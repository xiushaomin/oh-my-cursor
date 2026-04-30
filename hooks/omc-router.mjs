#!/usr/bin/env node
/**
 * oh-my-cursor: beforeSubmitPrompt router — intent hints + persistent workflow state.
 * Reads workflows.json (v2 array or legacy v1 object) from plugin config/ or user override.
 */
import { existsSync, mkdirSync, readFileSync, unlinkSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectDeactivationPhrases,
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
  normalizeWorkflowList,
  packsJsonPath,
  readJsonFile,
  workflowsJsonPath
} from "./omc-workflow-lib.mjs";

const scriptDir = dirname(fileURLToPath(import.meta.url));

function getSessionId(input) {
  return String(input.sessionId ?? input.session_id ?? "default");
}

function loadWorkflows() {
  const p = workflowsJsonPath(scriptDir);
  return readJsonFile(p);
}

function loadPacks() {
  return readJsonFile(packsJsonPath(scriptDir));
}

function isExplicitInvocation(prompt, wf) {
  const trimmed = String(prompt ?? "").trim().toLowerCase();
  const invocations = wf?.keywords ?? [];
  for (const raw of invocations) {
    const k = String(raw).trim().toLowerCase();
    if (!k.startsWith("/")) continue;
    if (trimmed === k) return true;
    if (trimmed.startsWith(k + " ")) return true;
  }
  return false;
}

function looksInformational(prompt) {
  const p = String(prompt ?? "").trim().toLowerCase();
  if (!p) return false;
  // Keep tiny and conservative. Goal: block obvious "what is / how to use" questions.
  const patterns = [
    /\bwhat\s+is\b/i,
    /\bhow\s+to\b/i,
    /\bexplain\b/i,
    /\bdescribe\b/i,
    /什么是/,
    /是什么/,
    /怎么用/,
    /如何使用/,
    /解释/,
    /说明/,
  ];
  return patterns.some((re) => re.test(p));
}

function countWords(text) {
  return String(text ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function hasComplexSignals(prompt) {
  const p = String(prompt ?? "");
  // Any of these: file paths/extensions, stack traces/errors, bullets/steps, multi-domain mentions.
  const re = [
    /\b[\w./-]+\.(?:ts|tsx|js|jsx|py|go|rs|java|kt|swift|m|mm|cpp|c|h|css|scss|html|json|yaml|yml|toml|md)\b/i,
    /(?:TypeError|ReferenceError|SyntaxError|Exception|stack\s*trace|traceback|崩溃|异常|堆栈|栈追踪)/i,
    /(?:^|\n)\s*(?:\d+[.)]\s|-\s+\S|\*\s+\S)/m,
    /\b(?:ios|android|flutter|react\s+native|expo|frontend|backend|java)\b/i,
  ];
  return re.some((x) => x.test(p));
}

function suppressOrchestrateAuto(prompt) {
  // Small prompt + no concrete signals => avoid accidental "do everything" explosions.
  const w = countWords(prompt);
  if (w > 60) return false;
  return !hasComplexSignals(prompt);
}

function getStateDir(projectDir) {
  const dir = join(projectDir, ".cursor", "ohc", "state");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

function activateMode(projectDir, workflow, sessionId) {
  const state = {
    workflow,
    sessionId,
    activatedAt: new Date().toISOString(),
    reinforcementCount: 0,
  };
  writeFileSync(
    join(getStateDir(projectDir), `${workflow}-state-${sessionId}.json`),
    JSON.stringify(state, null, 2),
  );
}

function deactivateAllPersistentModes(projectDir, sessionId) {
  const stateDir = join(projectDir, ".cursor", "ohc", "state");
  if (!existsSync(stateDir)) return;
  try {
    for (const file of readdirSync(stateDir)) {
      if (sessionId) {
        if (file.endsWith(`-state-${sessionId}.json`)) unlinkSync(join(stateDir, file));
      } else if (/-state-/.test(file) && file.endsWith(".json")) {
        unlinkSync(join(stateDir, file));
      }
    }
  } catch {
    // ignore
  }
}

function isDeactivation(prompt, phrases) {
  const lower = prompt.toLowerCase();
  return phrases.some((p) => lower.includes(p));
}

function makePromptOutput(additionalContext) {
  return JSON.stringify({
    additionalContext,
    additional_context: additionalContext,
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
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

  const prompt = (input.prompt ?? "").trim();
  if (!prompt) process.exit(0);

  const config = loadRuntimeConfig(scriptDir);
  if (!config.enabled || !config.workflows.enabled || !config.hooks.routerEnabled) process.exit(0);

  const projectDir = getProjectDir(input);
  const sessionId = getSessionId(input);

  const doc = loadWorkflows() ?? {};
  const packsDoc = loadPacks() ?? {};
  const guidanceIndex = loadGuidanceIndex(scriptDir);
  const subagentContextDoc = loadSubagentContextConfig(scriptDir);
  const detectedPacks = applyDefaultPack(
    config.packs.autoDetectionEnabled
      ? detectPacks(packsDoc, projectDir, prompt, {
          disabledPackIds: config.packs.disabledPackIds,
          preferredPackIds: config.packs.preferredPackIds,
          maxPacks: config.routing.maxSuggestedPacks,
        })
      : [],
    packsDoc,
    config.packs.defaultPackId,
  );
  const deactivationPhrases = collectDeactivationPhrases(doc);

  if (isDeactivation(prompt, deactivationPhrases)) {
    deactivateAllPersistentModes(projectDir, sessionId);
    process.exit(0);
  }

  const list = normalizeWorkflowList(doc);
  if (!list.length) process.exit(0);

  const sorted = [...list].sort((a, b) => b.priority - a.priority);

  for (const wf of sorted) {
    if (config.workflows.disabledWorkflowIds.includes(wf.id)) continue;
    // 1) Explicit invocation always allowed, even if auto is disabled.
    const explicit = isExplicitInvocation(prompt, wf);

    // 2) Auto activation gating.
    if (!explicit) {
      if (!config.workflows.autoActivationEnabled) continue;
      if (config.routing.preferExplicitInvocation) continue;
      if (wf.routing?.preferExplicitInvocation) continue;
      if (wf.activation?.allowAutoActivation === false) continue;
      if (looksInformational(prompt)) continue;
      if (wf.id === "omc-orchestrate" && suppressOrchestrateAuto(prompt)) continue;
    }

    const lowered = prompt.toLowerCase();
    const hit = wf.keywords.some((k) => lowered.includes(String(k).toLowerCase()));
    if (!hit) continue;

    if (wf.persistent && config.workflows.persistentEnabled) {
      activateMode(projectDir, wf.id, sessionId);
    }

    const lines = [
      `[OHC INTENT: ${String(wf.id).toUpperCase()}]`,
      `Prefer the Cursor skill \`/${wf.skillId}\` and subagents under CURSOR_USER_DIR/agents/.`,
      formatWorkflowGuidanceContext(guidanceIndex, wf.id),
      formatPackContext(detectedPacks),
      formatSubagentBriefsContext(guidanceIndex, subagentContextDoc, wf.id, detectedPacks),
      formatCheckLaneContext(guidanceIndex, wf.id),
      `Stay within Cursor Agent / Skills / Subagents unless the user explicitly asks otherwise.`,
    ].filter(Boolean).join("\n");

    process.stdout.write(makePromptOutput(lines));
    process.exit(0);
  }

  if (
    config.routing.fallbackToDefaultWorkflow &&
    !config.routing.preferExplicitInvocation &&
    config.workflows.defaultWorkflowId &&
    !looksInformational(prompt)
  ) {
    const wf = sorted.find((candidate) => candidate.id === config.workflows.defaultWorkflowId);
    if (wf && !config.workflows.disabledWorkflowIds.includes(wf.id)) {
      if (wf.persistent && config.workflows.persistentEnabled) activateMode(projectDir, wf.id, sessionId);
      const lines = [
        `[OHC INTENT: ${String(wf.id).toUpperCase()}]`,
        `Prefer the Cursor skill \`/${wf.skillId}\` and subagents under CURSOR_USER_DIR/agents/.`,
        formatWorkflowGuidanceContext(guidanceIndex, wf.id),
        formatPackContext(detectedPacks),
        formatSubagentBriefsContext(guidanceIndex, subagentContextDoc, wf.id, detectedPacks),
        formatCheckLaneContext(guidanceIndex, wf.id),
        "Default workflow selected from config/config.jsonc.",
        `Stay within Cursor Agent / Skills / Subagents unless the user explicitly asks otherwise.`,
      ].filter(Boolean).join("\n");
      process.stdout.write(makePromptOutput(lines));
      process.exit(0);
    }
  }

  process.exit(0);
}

main();
