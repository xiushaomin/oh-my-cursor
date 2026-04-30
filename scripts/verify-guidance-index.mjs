#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { buildGuidanceIndex, writeGuidanceIndex } from "./build-guidance-index.mjs";

function fail(message) {
  throw new Error(message);
}

function stableJson(value) {
  return JSON.stringify(value, null, 2);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function verifyGuidanceIndex(rootDir = process.cwd(), options = {}) {
  const root = resolve(rootDir);
  const configDir = join(root, "config");
  const guidancePath = join(configDir, "guidance-index.json");

  const requiredFiles = [
    "workflows.json",
    "packs.json",
    "capabilities.json",
    "check-lanes.json",
    "subagent-context.json",
  ];

  for (const file of requiredFiles) {
    const path = join(configDir, file);
    if (!existsSync(path)) fail(`[verify-guidance-index] Missing required config file: ${path}`);
    readJson(path);
  }

  const generated = buildGuidanceIndex(root);

  if (!existsSync(guidancePath)) {
    writeGuidanceIndex(root);
    return "[verify-guidance-index] guidance-index.json was missing and has been generated.";
  }

  const current = readJson(guidancePath);
  const workflowIds = new Set(readJson(join(configDir, "workflows.json")).workflows.map((workflow) => workflow.id));

  for (const workflow of generated.workflows) {
    if (!workflowIds.has(workflow.id)) {
      fail(`[verify-guidance-index] Generated guidance contains unknown workflow id: ${workflow.id}`);
    }
  }

  const normalize = (value) => {
    const clone = JSON.parse(JSON.stringify(value));
    delete clone.generatedAt;
    return clone;
  };

  const currentNormalized = stableJson(normalize(current));
  const generatedNormalized = stableJson(normalize(generated));

  if (currentNormalized !== generatedNormalized) {
    writeGuidanceIndex(root);
    return "[verify-guidance-index] guidance-index.json was stale and has been refreshed.";
  }

  return "[verify-guidance-index] guidance-index.json is current.";
}

try {
  console.log(verifyGuidanceIndex(process.cwd()));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
