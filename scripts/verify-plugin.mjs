#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { verifyGuidanceIndex } from "./verify-guidance-index.mjs";
import { readJsonFile } from "../hooks/omc-workflow-lib.mjs";

const root = resolve(process.cwd());
const jsonFiles = [
  ".cursor-plugin/plugin.json",
  "hooks/hooks.json",
  "config/workflows.json",
  "config/packs.json",
  "config/capabilities.json",
  "config/config.jsonc",
  "config/subagent-context.json",
  "config/check-lanes.json",
  "config/guidance-index.json",
];

function readJson(path) {
  const parsed = readJsonFile(path);
  if (!parsed) {
    throw new Error(`[verify-plugin] Failed to parse JSON/JSONC file: ${path}`);
  }
  return parsed;
}

function runNodeCheck(paths) {
  const result = spawnSync("node", ["--check", ...paths], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "[verify-plugin] node --check failed");
  }
}

function verifyJsonFiles() {
  for (const file of jsonFiles) {
    const path = join(root, file);
    if (!existsSync(path)) throw new Error(`[verify-plugin] Missing JSON file: ${file}`);
    readJson(path);
  }
}

function verifyWorkflowAssets() {
  const workflows = readJson(join(root, "config", "workflows.json")).workflows ?? [];
  for (const workflow of workflows) {
    const skillPath = join(root, "skills", workflow.skillId, "SKILL.md");
    if (!existsSync(skillPath)) {
      throw new Error(`[verify-plugin] Missing skill for workflow ${workflow.id}: skills/${workflow.skillId}/SKILL.md`);
    }
    for (const agentId of workflow.subagents?.recommended ?? []) {
      const agentPath = join(root, "agents", `${agentId}.md`);
      if (!existsSync(agentPath)) {
        throw new Error(`[verify-plugin] Missing agent ${agentId} for workflow ${workflow.id}`);
      }
    }
  }
}

function verifyCapabilitySources() {
  const capabilities = readJson(join(root, "config", "capabilities.json")).capabilities ?? [];
  for (const cap of capabilities) {
    const sourcePath = cap.install?.sourcePath ?? cap.source?.path ?? null;
    const path = sourcePath ? join(root, sourcePath) : null;
    if (path && !existsSync(path)) {
      throw new Error(`[verify-plugin] Missing capability source ${cap.id}: ${sourcePath}`);
    }
  }
}

function verifyHooks() {
  const hooksDoc = readJson(join(root, "hooks", "hooks.json"));
  if (typeof hooksDoc.version !== "number") {
    throw new Error("[verify-plugin] hooks/hooks.json must include numeric top-level version.");
  }
  const hooks = hooksDoc.hooks ?? {};
  const required = [
    "beforeSubmitPrompt",
    "beforeShellExecution",
    "beforeMCPExecution",
    "beforeReadFile",
    "sessionStart",
    "stop",
  ];
  for (const name of required) {
    if (!hooks[name]?.length) {
      throw new Error(`[verify-plugin] Missing required hook registration: ${name}`);
    }
  }
}

try {
  runNodeCheck([
    "hooks/omc-workflow-lib.mjs",
    "hooks/omc-router.mjs",
    "hooks/omc-session.mjs",
    "hooks/omc-persistent.mjs",
    "hooks/omc-governance.mjs",
    "scripts/build-guidance-index.mjs",
    "scripts/verify-guidance-index.mjs",
    "scripts/verify-plugin.mjs",
  ]);
  verifyJsonFiles();
  verifyWorkflowAssets();
  verifyCapabilitySources();
  verifyHooks();
  console.log(verifyGuidanceIndex(root));
  console.log("[verify-plugin] plugin metadata, hooks, assets, and compiled guidance are valid.");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
