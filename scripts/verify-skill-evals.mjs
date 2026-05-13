#!/usr/bin/env node
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = resolve(process.cwd());
const workflowsPath = join(repoRoot, "config", "workflows.json");
const packsPath = join(repoRoot, "config", "packs.json");
const guidancePath = join(repoRoot, "config", "guidance-index.json");
const subagentContextPath = join(repoRoot, "config", "subagent-context.json");
const configPath = join(repoRoot, "config", "config.jsonc");
const routerPath = join(repoRoot, "hooks", "omc-router.mjs");
const evalDoc = JSON.parse(readFileSync(join(repoRoot, "evals", "routing-smoke.json"), "utf8"));

function withTempDir(fn) {
  const dir = mkdtempSync(join(tmpdir(), "ohc-eval-"));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function runRouter(prompt, projectDir, sessionId) {
  writeFileSync(join(projectDir, "package.json"), JSON.stringify({ name: "eval-app" }, null, 2));
  const result = spawnSync("node", [routerPath], {
    cwd: repoRoot,
    env: {
      ...process.env,
      OHC_WORKFLOWS_JSON: workflowsPath,
      OHC_PACKS_JSON: packsPath,
      OHC_GUIDANCE_INDEX_JSON: guidancePath,
      OHC_SUBAGENT_CONTEXT_JSON: subagentContextPath,
      OHC_CONFIG_JSON: configPath,
    },
    input: JSON.stringify({
      prompt,
      cwd: projectDir,
      workspace_roots: [projectDir],
      sessionId,
    }),
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout.trim();
}

function extractWorkflow(output) {
  if (!output) return null;
  const match = output.match(/OHC INTENT: ([A-Z0-9-]+)/);
  return match ? match[1].toLowerCase() : null;
}

let passCount = 0;
for (const [index, testCase] of (evalDoc.cases ?? []).entries()) {
  withTempDir((projectDir) => {
    const output = runRouter(testCase.prompt, projectDir, `eval-${index}`);
    const actual = extractWorkflow(output);
    assert.equal(
      actual,
      testCase.expectedWorkflow,
      `[verify-skill-evals] ${testCase.name} expected ${testCase.expectedWorkflow ?? "no workflow"} but got ${actual ?? "no workflow"}`,
    );
    passCount += 1;
  });
}

console.log(`[verify-skill-evals] ${passCount} routing evals passed.`);
