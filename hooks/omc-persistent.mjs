#!/usr/bin/env node
/**
 * oh-my-cursor: stop hook — double-tap within window to end persistent workflows.
 */
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectDeactivationPhrases,
  getProjectDir,
  getStopConfirmWindowMs,
  loadRuntimeConfig,
  normalizeWorkflowList,
  readJsonFile,
  workflowsJsonPath,
} from "./omc-workflow-lib.mjs";

function getSessionId(input) {
  return String(input.sessionId ?? input.session_id ?? "default");
}

const scriptDir = dirname(fileURLToPath(import.meta.url));

function loadWorkflows() {
  const p = workflowsJsonPath(scriptDir);
  const doc = readJsonFile(p);
  if (!doc) return { stopConfirmWindowMs: 3000, workflows: [] };
  return doc;
}

function getStateDir(projectDir) {
  const dir = join(projectDir, ".cursor", "ohc", "state");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

function getStopConfirmPath(projectDir, sessionId) {
  return join(getStateDir(projectDir), `stop-confirm-${sessionId}.json`);
}

function readJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function makeBlock(reason) {
  return JSON.stringify({ decision: "block", reason });
}

function loadPersistentWorkflowNames(doc) {
  return normalizeWorkflowList(doc)
    .filter((w) => w.persistent)
    .map((w) => w.id);
}

function readModeState(projectDir, workflow, sessionId) {
  const p = join(getStateDir(projectDir), `${workflow}-state-${sessionId}.json`);
  return readJson(p);
}

function deactivate(projectDir, workflow, sessionId) {
  const p = join(getStateDir(projectDir), `${workflow}-state-${sessionId}.json`);
  if (existsSync(p)) unlinkSync(p);
}

function incrementReinforcement(projectDir, workflow, sessionId, state) {
  const p = join(getStateDir(projectDir), `${workflow}-state-${sessionId}.json`);
  state.reinforcementCount = (state.reinforcementCount ?? 0) + 1;
  writeFileSync(p, JSON.stringify(state, null, 2));
}

const MAX_REINFORCEMENTS = 5;
const STALE_MS = 2 * 60 * 60 * 1000;

function isStale(state) {
  const t = Date.parse(state.activatedAt);
  return Number.isFinite(t) && Date.now() - t > STALE_MS;
}

function clearStopConfirmation(projectDir, sessionId) {
  const p = getStopConfirmPath(projectDir, sessionId);
  if (existsSync(p)) unlinkSync(p);
}

function hasRecentStopConfirmation(projectDir, sessionId, workflow, windowMs) {
  const data = readJson(getStopConfirmPath(projectDir, sessionId));
  if (!data?.armedAt || data.workflow !== workflow) return false;
  return Date.now() - data.armedAt <= windowMs;
}

function armStopConfirmation(projectDir, sessionId, workflow) {
  writeFileSync(
    getStopConfirmPath(projectDir, sessionId),
    JSON.stringify({ workflow, armedAt: Date.now() }, null, 2),
  );
}

function includesDeactivation(text, phrases) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return phrases.some((p) => lower.includes(p));
}

function main() {
  let input;
  try {
    input = JSON.parse(readFileSync(0, "utf8"));
  } catch {
    process.exit(0);
  }

  const doc = loadWorkflows();
  const config = loadRuntimeConfig(scriptDir);
  if (!config.enabled || !config.hooks.persistentEnabled || !config.workflows.persistentEnabled) process.exit(0);
  const windowMs = config.workflows.stopConfirmWindowMsOverride ?? getStopConfirmWindowMs(doc);
  const projectDir = getProjectDir(input);
  const sessionId = getSessionId(input);
  const textToCheck = [
    input.prompt,
    input.prompt_response,
    String(input.stopReason ?? ""),
  ]
    .filter(Boolean)
    .join(" ");

  const deactivationPhrases = collectDeactivationPhrases(doc);

  if (includesDeactivation(textToCheck, deactivationPhrases)) {
    for (const w of loadPersistentWorkflowNames(doc)) {
      deactivate(projectDir, w, sessionId);
    }
    clearStopConfirmation(projectDir, sessionId);
    process.exit(0);
  }

  const persistent = loadPersistentWorkflowNames(doc);
  for (const workflow of persistent) {
    const state = readModeState(projectDir, workflow, sessionId);
    if (!state) continue;

    if (isStale(state) || (state.reinforcementCount ?? 0) >= MAX_REINFORCEMENTS) {
      deactivate(projectDir, workflow, sessionId);
      clearStopConfirmation(projectDir, sessionId);
      continue;
    }

    if (hasRecentStopConfirmation(projectDir, sessionId, workflow, windowMs)) {
      deactivate(projectDir, workflow, sessionId);
      clearStopConfirmation(projectDir, sessionId);
      process.exit(0);
    }

    armStopConfirmation(projectDir, sessionId, workflow);
    incrementReinforcement(projectDir, workflow, sessionId, state);

    const stateFile = ".cursor/ohc/state/" + `${workflow}-state-${sessionId}.json`;
    const reason = [
      `[OHC PERSISTENT: ${workflow.toUpperCase()}]`,
      `Stop was intercepted once. Press Stop again within ${Math.round(windowMs / 1000)}s to end this workflow.`,
      `To finish cleanly, use a deactivation phrase from workflows.json or remove ${stateFile}.`,
    ].join("\n");

    process.stdout.write(makeBlock(reason));
    process.exit(0);
  }

  clearStopConfirmation(projectDir, sessionId);
  process.exit(0);
}

main();
