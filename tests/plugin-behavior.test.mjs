import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

import { detectPacks, readJsonFile } from "../hooks/omc-workflow-lib.mjs";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);
const workflowsPath = join(repoRoot, "config", "workflows.json");
const packsPath = join(repoRoot, "config", "packs.json");
const guidancePath = join(repoRoot, "config", "guidance-index.json");
const subagentContextPath = join(repoRoot, "config", "subagent-context.json");
const configPath = join(repoRoot, "config", "config.jsonc");

function withTempDir(fn) {
  const dir = mkdtempSync(join(tmpdir(), "oh-my-cursor-test-"));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function runNodeScript(scriptPath, input, extraEnv = {}, cwd = repoRoot) {
  const result = spawnSync("node", [scriptPath], {
    cwd,
    env: {
      ...process.env,
      OHC_WORKFLOWS_JSON: workflowsPath,
      OHC_PACKS_JSON: packsPath,
      OHC_GUIDANCE_INDEX_JSON: guidancePath,
      OHC_SUBAGENT_CONTEXT_JSON: subagentContextPath,
      OHC_CONFIG_JSON: configPath,
      ...extraEnv,
    },
    input: JSON.stringify(input),
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout.trim();
}

test("detectPacks finds the frontend pack from repo signals", () =>
  withTempDir((projectDir) => {
    writeFileSync(
      join(projectDir, "package.json"),
      JSON.stringify({ dependencies: { react: "^19.0.0", next: "^15.0.0" } }, null, 2),
    );
    mkdirSync(join(projectDir, "src", "components"), { recursive: true });
    writeFileSync(join(projectDir, "src", "components", "Button.tsx"), "export function Button() { return null; }\n");

    const packsDoc = readJsonFile(packsPath);
    const detected = detectPacks(packsDoc, projectDir, "review this React UI change");

    assert.equal(detected[0]?.id, "omc-frontend");
    assert.match(detected[0]?.reasons.join(" "), /react|next|components/i);
  }));

test("router suppresses accidental orchestrate auto-activation on tiny prompts", () =>
  withTempDir((projectDir) => {
    const output = runNodeScript(join(repoRoot, "hooks", "omc-router.mjs"), {
      prompt: "parallel",
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "router-suppress",
    });

    assert.equal(output, "");
  }));

test("router supports explicit orchestrator invocation and injects workflow context", () =>
  withTempDir((projectDir) => {
    const output = runNodeScript(join(repoRoot, "hooks", "omc-router.mjs"), {
      prompt: "/omc-orchestrator implement this feature",
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "router-explicit",
    });

    assert.match(output, /OHC INTENT: OMC-ORCHESTRATE/);
    assert.match(output, /\/omc-orchestrator/);
  }));

test("router supports the omc-orchestrate alias for explicit orchestration", () =>
  withTempDir((projectDir) => {
    const output = runNodeScript(join(repoRoot, "hooks", "omc-router.mjs"), {
      prompt: "/omc-orchestrate implement this feature",
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "router-alias",
    });

    assert.match(output, /OHC INTENT: OMC-ORCHESTRATE/);
    assert.match(output, /\/omc-orchestrator/);
  }));

test("governance denies destructive shell commands and sensitive reads", () =>
  withTempDir((projectDir) => {
    const shellOutput = runNodeScript(
      join(repoRoot, "hooks", "omc-governance.mjs"),
      {
        hookEventName: "beforeShellExecution",
        command: "git reset --hard HEAD",
        cwd: projectDir,
        workspace_roots: [projectDir],
      },
      {},
      repoRoot,
    );
    const readOutput = runNodeScript(
      join(repoRoot, "hooks", "omc-governance.mjs"),
      {
        hookEventName: "beforeReadFile",
        path: join(projectDir, ".env"),
        cwd: projectDir,
        workspace_roots: [projectDir],
      },
      {},
      repoRoot,
    );

    assert.match(shellOutput, /"permission":"deny"/);
    assert.match(shellOutput, /git reset/i);
    assert.match(readOutput, /"permission":"deny"/);
    assert.match(readOutput, /sensitive file read/i);
  }));

test("governance allows normal MCP business tools like jira_add_comment", () =>
  withTempDir((projectDir) => {
    const output = runNodeScript(
      join(repoRoot, "hooks", "omc-governance.mjs"),
      {
        hookEventName: "beforeMCPExecution",
        tool_name: "jira_add_comment",
        tool_input: JSON.stringify({
          issue_key: "TM-6965",
          comment: "Trip segmentation issue summary",
        }),
        cwd: projectDir,
        workspace_roots: [projectDir],
      },
      {},
      repoRoot,
    );

    assert.match(output, /"permission":"allow"/);
  }));

test("persistent hook requires a second stop to exit active workflow", () =>
  withTempDir((projectDir) => {
    const stateDir = join(projectDir, ".cursor", "ohc", "state");
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(
      join(stateDir, "omc-work-state-session-a.json"),
      JSON.stringify({
        workflow: "omc-work",
        sessionId: "session-a",
        activatedAt: new Date().toISOString(),
        reinforcementCount: 0,
      }),
    );

    const firstOutput = runNodeScript(join(repoRoot, "hooks", "omc-persistent.mjs"), {
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "session-a",
    });
    assert.match(firstOutput, /"decision":"block"/);
    assert.match(firstOutput, /Press Stop again/);

    const secondOutput = runNodeScript(join(repoRoot, "hooks", "omc-persistent.mjs"), {
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "session-a",
    });
    assert.equal(secondOutput, "");
    assert.equal(existsSync(join(stateDir, "omc-work-state-session-a.json")), false);
  }));

test("verify-plugin succeeds from the repository root", () => {
  const result = spawnSync("node", ["scripts/verify-plugin.mjs"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /plugin metadata, hooks, assets, and compiled guidance are valid/i);
});

test("persistent hook increments reinforcement count on first intercepted stop", () =>
  withTempDir((projectDir) => {
    const stateDir = join(projectDir, ".cursor", "ohc", "state");
    mkdirSync(stateDir, { recursive: true });
    const statePath = join(stateDir, "omc-orchestrate-state-session-b.json");
    writeFileSync(
      statePath,
      JSON.stringify({
        workflow: "omc-orchestrate",
        sessionId: "session-b",
        activatedAt: new Date().toISOString(),
        reinforcementCount: 1,
      }),
    );

    runNodeScript(join(repoRoot, "hooks", "omc-persistent.mjs"), {
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "session-b",
    });

    const nextState = JSON.parse(readFileSync(statePath, "utf8"));
    assert.equal(nextState.reinforcementCount, 2);
  }));
