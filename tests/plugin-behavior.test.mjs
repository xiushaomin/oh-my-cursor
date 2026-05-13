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

test("detectPacks finds the java backend pack from repo signals", () =>
  withTempDir((projectDir) => {
    mkdirSync(join(projectDir, "src", "main", "java", "com", "example"), { recursive: true });
    writeFileSync(join(projectDir, "pom.xml"), "<project></project>\n");
    writeFileSync(join(projectDir, "src", "main", "java", "com", "example", "App.java"), "class App {}\n");

    const packsDoc = readJsonFile(packsPath);
    const detected = detectPacks(packsDoc, projectDir, "review this spring backend change");

    assert.equal(detected[0]?.id, "omc-java-backend");
    assert.match(detected[0]?.reasons.join(" "), /pom|java|backend|spring/i);
  }));

test("detectPacks finds the ios pack from repo signals", () =>
  withTempDir((projectDir) => {
    mkdirSync(join(projectDir, "ios"), { recursive: true });
    writeFileSync(join(projectDir, "Package.swift"), "// swift package\n");
    writeFileSync(join(projectDir, "ios", "HomeView.swift"), "struct HomeView {}\n");

    const packsDoc = readJsonFile(packsPath);
    const detected = detectPacks(packsDoc, projectDir, "fix this swiftui screen");

    assert.equal(detected[0]?.id, "omc-ios");
    assert.match(detected[0]?.reasons.join(" "), /swift|package|ios/i);
  }));

test("detectPacks finds the android pack from repo signals", () =>
  withTempDir((projectDir) => {
    mkdirSync(join(projectDir, "app", "src", "main"), { recursive: true });
    writeFileSync(join(projectDir, "settings.gradle.kts"), "rootProject.name = \"app\"\n");
    writeFileSync(join(projectDir, "app", "src", "main", "AndroidManifest.xml"), "<manifest />\n");
    writeFileSync(join(projectDir, "app", "src", "main", "MainActivity.kt"), "class MainActivity {}\n");

    const packsDoc = readJsonFile(packsPath);
    const detected = detectPacks(packsDoc, projectDir, "fix this android compose flow");

    assert.equal(detected[0]?.id, "omc-android");
    assert.match(detected[0]?.reasons.join(" "), /android|manifest|gradle|kotlin|compose/i);
  }));

test("detectPacks finds the flutter pack from repo signals", () =>
  withTempDir((projectDir) => {
    mkdirSync(join(projectDir, "lib"), { recursive: true });
    writeFileSync(join(projectDir, "pubspec.yaml"), "name: demo\n");
    writeFileSync(join(projectDir, "lib", "main.dart"), "void main() {}\n");

    const packsDoc = readJsonFile(packsPath);
    const detected = detectPacks(packsDoc, projectDir, "fix this flutter widget");

    assert.equal(detected[0]?.id, "omc-flutter");
    assert.match(detected[0]?.reasons.join(" "), /flutter|dart|pubspec/i);
  }));

test("detectPacks finds the react native pack from repo signals", () =>
  withTempDir((projectDir) => {
    writeFileSync(
      join(projectDir, "package.json"),
      JSON.stringify({ dependencies: { "react-native": "^0.81.0", expo: "^54.0.0" } }, null, 2),
    );
    writeFileSync(join(projectDir, "app.json"), "{ \"expo\": {} }\n");
    writeFileSync(join(projectDir, "App.tsx"), "export default function App() { return null; }\n");

    const packsDoc = readJsonFile(packsPath);
    const detected = detectPacks(packsDoc, projectDir, "debug this react native screen");

    assert.equal(detected[0]?.id, "omc-react-native");
    assert.match(detected[0]?.reasons.join(" "), /react-native|expo|app\.json|screen/i);
  }));

test("router suppresses accidental parallel auto-activation on tiny prompts", () =>
  withTempDir((projectDir) => {
    const output = runNodeScript(join(repoRoot, "hooks", "omc-router.mjs"), {
      prompt: "parallel",
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "router-suppress",
    });

    assert.equal(output, "");
  }));

test("router supports explicit parallel invocation and injects workflow context", () =>
  withTempDir((projectDir) => {
    const output = runNodeScript(join(repoRoot, "hooks", "omc-router.mjs"), {
      prompt: "/omc-parallel implement this feature",
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "router-explicit",
    });

    assert.match(output, /OHC INTENT: OMC-PARALLEL/);
    assert.match(output, /\/omc-parallel/);
  }));

test("router injects detected pack context for frontend prompts", () =>
  withTempDir((projectDir) => {
    writeFileSync(
      join(projectDir, "package.json"),
      JSON.stringify({ dependencies: { react: "^19.0.0", next: "^15.0.0" } }, null, 2),
    );
    mkdirSync(join(projectDir, "src", "components"), { recursive: true });
    writeFileSync(join(projectDir, "src", "components", "Button.tsx"), "export function Button() { return null; }\n");

    const output = runNodeScript(join(repoRoot, "hooks", "omc-router.mjs"), {
      prompt: "/omc-review review this React UI change",
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "router-pack-context",
    });

    assert.match(output, /\[OHC DOMAIN PACKS\]/);
    assert.match(output, /omc-frontend/);
    assert.match(output, /frontend-engineer|frontend-qa-reviewer/);
  }));

test("router does not keep removed legacy orchestration invocations active", () =>
  withTempDir((projectDir) => {
    const output = runNodeScript(join(repoRoot, "hooks", "omc-router.mjs"), {
      prompt: "/omc-orchestrate implement this feature",
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "router-alias",
    });

    assert.equal(output, "");
  }));

test("router auto-activates debug for natural-language troubleshooting prompts", () =>
  withTempDir((projectDir) => {
    const output = runNodeScript(join(repoRoot, "hooks", "omc-router.mjs"), {
      prompt: "帮我排查这个问题为什么不生效",
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "router-debug-auto",
    });

    assert.match(output, /OHC INTENT: OMC-DEBUG/);
    assert.match(output, /\/omc-debug/);
  }));

test("router auto-activates plan for natural-language planning prompts", () =>
  withTempDir((projectDir) => {
    const output = runNodeScript(join(repoRoot, "hooks", "omc-router.mjs"), {
      prompt: "帮我规划一下这个需求怎么做",
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "router-plan-auto",
    });

    assert.match(output, /OHC INTENT: OMC-PLAN/);
    assert.match(output, /\/omc-plan/);
  }));

test("router auto-activates review for natural-language review prompts", () =>
  withTempDir((projectDir) => {
    const output = runNodeScript(join(repoRoot, "hooks", "omc-router.mjs"), {
      prompt: "帮我 review 当前改动有没有问题",
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "router-review-auto",
    });

    assert.match(output, /OHC INTENT: OMC-REVIEW/);
    assert.match(output, /\/omc-review/);
  }));

test("router still treats pure help prompts as informational", () =>
  withTempDir((projectDir) => {
    const output = runNodeScript(join(repoRoot, "hooks", "omc-router.mjs"), {
      prompt: "什么是 omc-plan",
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "router-info-block",
    });

    assert.equal(output, "");
  }));

test("router does not auto-activate plan for generic analyze requests", () =>
  withTempDir((projectDir) => {
    const output = runNodeScript(join(repoRoot, "hooks", "omc-router.mjs"), {
      prompt: "analyze this helper and explain what it does",
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "router-plan-precision",
    });

    assert.equal(output, "");
  }));

test("router does not auto-activate review for generic verify phrasing", () =>
  withTempDir((projectDir) => {
    const output = runNodeScript(join(repoRoot, "hooks", "omc-router.mjs"), {
      prompt: "帮我检查一下这个接口文档怎么写",
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "router-review-precision",
    });

    assert.equal(output, "");
  }));

test("router does not auto-activate debug for copy-only error wording", () =>
  withTempDir((projectDir) => {
    const output = runNodeScript(join(repoRoot, "hooks", "omc-router.mjs"), {
      prompt: "这个错误提示文案改一下",
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "router-debug-precision",
    });

    assert.equal(output, "");
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

test("governance does not create local log files when telemetry is disabled", () =>
  withTempDir((projectDir) => {
    const output = runNodeScript(
      join(repoRoot, "hooks", "omc-governance.mjs"),
      {
        hookEventName: "beforeShellExecution",
        command: "echo safe",
        cwd: projectDir,
        workspace_roots: [projectDir],
      },
      {},
      repoRoot,
    );

    assert.match(output, /"permission":"allow"/);
    assert.equal(existsSync(join(projectDir, ".cursor", "ohc", "logs")), false);
  }));

test("persistent hook requires a second stop to exit active workflow", () =>
  withTempDir((projectDir) => {
    const stateDir = join(projectDir, ".cursor", "ohc", "state");
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(
      join(stateDir, "omc-parallel-state-session-a.json"),
      JSON.stringify({
        workflow: "omc-parallel",
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
    assert.equal(existsSync(join(stateDir, "omc-parallel-state-session-a.json")), false);
  }));

test("persistent hook requires a second stop to exit omc-develop", () =>
  withTempDir((projectDir) => {
    const stateDir = join(projectDir, ".cursor", "ohc", "state");
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(
      join(stateDir, "omc-develop-state-session-c.json"),
      JSON.stringify({
        workflow: "omc-develop",
        sessionId: "session-c",
        activatedAt: new Date().toISOString(),
        reinforcementCount: 0,
      }),
    );

    const firstOutput = runNodeScript(join(repoRoot, "hooks", "omc-persistent.mjs"), {
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "session-c",
    });

    assert.match(firstOutput, /"decision":"block"/);

    const secondOutput = runNodeScript(join(repoRoot, "hooks", "omc-persistent.mjs"), {
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId: "session-c",
    });

    assert.equal(secondOutput, "");
    assert.equal(existsSync(join(stateDir, "omc-develop-state-session-c.json")), false);
  }));

test("verify-plugin succeeds from the repository root", () => {
  const result = spawnSync("node", ["scripts/verify-plugin.mjs"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /plugin metadata, hooks, assets, and compiled guidance are valid/i);
});

test("verify-skill-evals succeeds from the repository root", () => {
  const result = spawnSync("node", ["scripts/verify-skill-evals.mjs"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /routing evals passed/i);
});

test("verify-agents succeeds from the repository root", () => {
  const result = spawnSync("node", ["scripts/verify-agents.mjs"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /agents verified/i);
});

test("verify-skills succeeds from the repository root", () => {
  const result = spawnSync("node", ["scripts/verify-skills.mjs"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /skills verified/i);
});

test("verify-output-contracts succeeds from the repository root", () => {
  const result = spawnSync("node", ["scripts/verify-output-contracts.mjs"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /workflow output contracts verified/i);
});

test("persistent hook increments reinforcement count on first intercepted stop", () =>
  withTempDir((projectDir) => {
    const stateDir = join(projectDir, ".cursor", "ohc", "state");
    mkdirSync(stateDir, { recursive: true });
    const statePath = join(stateDir, "omc-parallel-state-session-b.json");
    writeFileSync(
      statePath,
      JSON.stringify({
        workflow: "omc-parallel",
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
