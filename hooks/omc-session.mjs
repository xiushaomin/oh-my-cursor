#!/usr/bin/env node
/**
 * oh-my-cursor: sessionStart — lightweight pack hints from packs.json (optional).
 */
import { readFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  applyDefaultPack,
  detectPacks,
  formatCheckLaneContext,
  formatPackContext,
  formatSubagentBriefsContext,
  formatWorkflowGuidanceContext,
  getProjectDir,
  loadGuidanceIndex,
  loadRuntimeConfig,
  loadSubagentContextConfig,
  packsJsonPath,
  readJsonFile,
} from "./omc-workflow-lib.mjs";

const scriptDir = dirname(fileURLToPath(import.meta.url));

function makeSessionOutput(lines) {
  const additionalContext = lines.join("\n");
  return JSON.stringify({
    additionalContext,
    additional_context: additionalContext,
    hookSpecificOutput: {
      hookEventName: "sessionStart",
      additionalContext,
    },
  });
}

function main() {
  let input;
  try {
    input = JSON.parse(readFileSync(0, "utf8"));
  } catch {
    process.exit(0);
  }

  const config = loadRuntimeConfig(scriptDir);
  if (!config.enabled || !config.hooks.sessionEnabled) process.exit(0);

  const packsDoc = readJsonFile(packsJsonPath(scriptDir));
  const guidanceIndex = loadGuidanceIndex(scriptDir);
  const subagentContextDoc = loadSubagentContextConfig(scriptDir);
  const packs = Array.isArray(packsDoc?.packs) ? packsDoc.packs : [];
  if (!packs.length) process.exit(0);

  const projectDir = getProjectDir(input);
  const detected = applyDefaultPack(
    config.packs.autoDetectionEnabled
      ? detectPacks(packsDoc, projectDir, "", {
          disabledPackIds: config.packs.disabledPackIds,
          preferredPackIds: config.packs.preferredPackIds,
          maxPacks: config.routing.maxSuggestedPacks,
        })
      : [],
    packsDoc,
    config.packs.defaultPackId,
  );

  const titles = packs
    .filter((p) => p?.id && p?.title)
    .slice(0, 8)
    .map((p) => `- ${p.id}: ${p.title}`);
  const suggestedPack = detected[0]?.id
    ? (guidanceIndex.packs ?? []).find((pack) => String(pack.id) === String(detected[0].id))
    : null;
  const suggestedWorkflowId = suggestedPack?.defaultWorkflowIds?.[0] ?? suggestedPack?.workflowIds?.[0] ?? null;

  const lines = [
    "[OHC SESSION]",
    "Installed domain packs (use /{skill} or natural language to route):",
    ...titles,
    formatPackContext(detected) || "No domain pack detected yet. Mention a stack or open stack files to attach pack context.",
    suggestedWorkflowId ? formatWorkflowGuidanceContext(guidanceIndex, suggestedWorkflowId) : "",
    suggestedWorkflowId ? formatSubagentBriefsContext(guidanceIndex, subagentContextDoc, suggestedWorkflowId, detected) : "",
    suggestedWorkflowId ? formatCheckLaneContext(guidanceIndex, suggestedWorkflowId) : "",
    "Tip: tune bundled defaults in the plugin config/ directory or via OHC_* JSON overrides.",
  ];

  process.stdout.write(makeSessionOutput(lines));
}

main();
