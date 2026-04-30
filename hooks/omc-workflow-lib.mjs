/**
 * Shared workflow document helpers for oh-my-cursor hooks (ESM, no deps).
 * Supports workflows.json schemaVersion "2" (array) and legacy v1 (object map).
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { homedir } from "node:os";

export function isWorkflowsV2(doc) {
  return doc && String(doc.schemaVersion) === "2" && Array.isArray(doc.workflows);
}

function collectWorkflowKeywords(w) {
  const routing = w.routing ?? {};
  const k = [...(routing.keywords ?? []), ...(routing.phrases ?? []), ...(routing.manualInvocations ?? [])];
  if (Array.isArray(w.keywords)) return [...k, ...w.keywords].map(String);
  return k.map(String);
}

/** @returns {{ id: string, skillId: string, persistent: boolean, keywords: string[], priority: number, routing: object, activation: object }[]} */
export function normalizeWorkflowList(doc) {
  if (!doc?.workflows) return [];
  if (isWorkflowsV2(doc)) {
    return doc.workflows
      .map((w) => ({
        id: String(w.id ?? ""),
        skillId: String(w.skillId ?? w.skill ?? ""),
        persistent: !!w.persistent,
        keywords: collectWorkflowKeywords(w),
        priority: Number(w.priority) || 0,
        routing: w.routing ?? {},
        activation: w.activation ?? {},
      }))
      .filter((w) => w.id && w.skillId);
  }
  const out = [];
  for (const [name, def] of Object.entries(doc.workflows)) {
    out.push({
      id: String(name),
      skillId: String(def.skill ?? name),
      persistent: !!def.persistent,
      keywords: (def.keywords ?? []).map(String),
      priority: 0,
      routing: {},
      activation: {},
    });
  }
  return out;
}

export function collectDeactivationPhrases(doc) {
  const phrases = new Set();
  if (Array.isArray(doc?.deactivationPhrases)) {
    for (const p of doc.deactivationPhrases) phrases.add(String(p).toLowerCase());
  }
  if (isWorkflowsV2(doc)) {
    for (const w of doc.workflows) {
      for (const p of w.deactivation?.phrases ?? []) phrases.add(String(p).toLowerCase());
    }
  }
  return [...phrases];
}

export function getStopConfirmWindowMs(doc) {
  const n = Number(doc?.stopConfirmWindowMs);
  if (Number.isFinite(n) && n >= 500) return n;
  return 3000;
}

export function readJsonFile(path) {
  if (!existsSync(path)) return null;
  try {
    const text = readFileSync(path, "utf8");
    try {
      return JSON.parse(text);
    } catch {
      return JSON.parse(stripJsonc(text));
    }
  } catch {
    return null;
  }
}

function stripJsonc(text) {
  let out = "";
  let inString = false;
  let quote = "";
  let escaped = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inString) {
      out += c;
      if (escaped) {
        escaped = false;
      } else if (c === "\\") {
        escaped = true;
      } else if (c === quote) {
        inString = false;
        quote = "";
      }
      continue;
    }

    if (c === '"' || c === "'") {
      inString = true;
      quote = c;
      out += c;
      continue;
    }

    if (c === "/" && next === "/") {
      while (i < text.length && text[i] !== "\n") i++;
      out += "\n";
      continue;
    }

    if (c === "/" && next === "*") {
      i += 2;
      while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++;
      i++;
      continue;
    }

    out += c;
  }

  return out.replace(/,\s*([}\]])/g, "$1");
}

export function workflowsJsonPath(scriptDir) {
  const fromEnv = process.env.OHC_WORKFLOWS_JSON;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  const nextToHooks = join(scriptDir, "..", "config", "workflows.json");
  if (existsSync(nextToHooks)) return nextToHooks;
  return join(homedir(), ".cursor", "oh-my-cursor", "workflows.json");
}

export function packsJsonPath(scriptDir) {
  const fromEnv = process.env.OHC_PACKS_JSON;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  const nextToHooks = join(scriptDir, "..", "config", "packs.json");
  if (existsSync(nextToHooks)) return nextToHooks;
  return join(homedir(), ".cursor", "oh-my-cursor", "packs.json");
}

export function configJsonPath(scriptDir) {
  const fromEnv = process.env.OHC_CONFIG_JSON;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  const nextToHooks = join(scriptDir, "..", "config", "config.jsonc");
  if (existsSync(nextToHooks)) return nextToHooks;
  return join(homedir(), ".cursor", "oh-my-cursor", "config.jsonc");
}

export function guidanceIndexJsonPath(scriptDir) {
  const fromEnv = process.env.OHC_GUIDANCE_INDEX_JSON;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  const nextToHooks = join(scriptDir, "..", "config", "guidance-index.json");
  if (existsSync(nextToHooks)) return nextToHooks;
  return join(homedir(), ".cursor", "oh-my-cursor", "guidance-index.json");
}

export function subagentContextJsonPath(scriptDir) {
  const fromEnv = process.env.OHC_SUBAGENT_CONTEXT_JSON;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  const nextToHooks = join(scriptDir, "..", "config", "subagent-context.json");
  if (existsSync(nextToHooks)) return nextToHooks;
  return join(homedir(), ".cursor", "oh-my-cursor", "subagent-context.json");
}

export function checkLanesJsonPath(scriptDir) {
  const fromEnv = process.env.OHC_CHECK_LANES_JSON;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  const nextToHooks = join(scriptDir, "..", "config", "check-lanes.json");
  if (existsSync(nextToHooks)) return nextToHooks;
  return join(homedir(), ".cursor", "oh-my-cursor", "check-lanes.json");
}

export function loadRuntimeConfig(scriptDir) {
  const config = readJsonFile(configJsonPath(scriptDir)) ?? {};
  const stopOverrideRaw = config.workflows?.stopConfirmWindowMsOverride;
  const stopOverrideNumber =
    stopOverrideRaw === null || stopOverrideRaw === undefined || stopOverrideRaw === ""
      ? null
      : Number(stopOverrideRaw);
  return {
    enabled: config.enabled !== false,
    workflows: {
      enabled: config.workflows?.enabled !== false,
      defaultWorkflowId: config.workflows?.defaultWorkflowId ? String(config.workflows.defaultWorkflowId) : null,
      persistentEnabled: config.workflows?.persistentEnabled !== false,
      stopConfirmWindowMsOverride:
        Number.isFinite(stopOverrideNumber) && stopOverrideNumber >= 500 ? stopOverrideNumber : null,
      autoActivationEnabled: config.workflows?.autoActivationEnabled !== false,
      disabledWorkflowIds: Array.isArray(config.workflows?.disabledWorkflowIds) ? config.workflows.disabledWorkflowIds.map(String) : [],
    },
    packs: {
      autoDetectionEnabled: config.packs?.autoDetectionEnabled !== false,
      preferredPackIds: Array.isArray(config.packs?.preferredPackIds) ? config.packs.preferredPackIds.map(String) : [],
      disabledPackIds: Array.isArray(config.packs?.disabledPackIds) ? config.packs.disabledPackIds.map(String) : [],
      defaultPackId: config.packs?.defaultPackId ? String(config.packs.defaultPackId) : null,
    },
    routing: {
      preferExplicitInvocation: config.routing?.preferExplicitInvocation === true,
      fallbackToDefaultWorkflow: config.routing?.fallbackToDefaultWorkflow !== false,
      maxSuggestedPacks: Number(config.routing?.maxSuggestedPacks) || 3,
    },
    hooks: {
      routerEnabled: config.hooks?.routerEnabled !== false,
      sessionEnabled: config.hooks?.sessionEnabled !== false,
      persistentEnabled: config.hooks?.persistentEnabled !== false,
      guardEnabled: config.hooks?.guardEnabled !== false,
    },
    safety: {
      destructiveShellGuard: config.safety?.destructiveShellGuard !== false,
      destructiveGitGuard: config.safety?.destructiveGitGuard !== false,
      mcpGuardEnabled: config.safety?.mcpGuardEnabled !== false,
    },
    telemetry: {
      localLogsEnabled: config.telemetry?.localLogsEnabled !== false,
    },
  };
}

export function resolveGitRoot(startDir) {
  let dir = startDir;
  for (let i = 0; i < 20; i++) {
    if (existsSync(join(dir, ".git"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return startDir;
    dir = parent;
  }
  return startDir;
}

export function getProjectDir(input) {
  const roots = input?.workspace_roots;
  if (Array.isArray(roots) && roots[0]) return resolveGitRoot(String(roots[0]));
  const cwd = input?.cwd ? String(input.cwd) : process.cwd();
  return resolveGitRoot(cwd);
}

const SKIP_DIRS = new Set([
  ".git",
  ".omx",
  ".cursor",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".gradle",
  ".dart_tool",
  "DerivedData",
  "reference",
]);

function safeStat(path) {
  try {
    return statSync(path);
  } catch {
    return null;
  }
}

export function collectRepoFiles(root, options = {}) {
  const maxFiles = Number(options.maxFiles ?? 2500);
  const maxDepth = Number(options.maxDepth ?? 6);
  const out = [];

  function visit(dir, depth) {
    if (out.length >= maxFiles || depth > maxDepth) return;
    let entries = [];
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (out.length >= maxFiles) return;
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        out.push(relative(root, join(dir, entry.name)).split("\\").join("/") + "/");
        visit(join(dir, entry.name), depth + 1);
        continue;
      }
      if (!entry.isFile()) continue;
      const full = join(dir, entry.name);
      const st = safeStat(full);
      if (!st || st.size > 512 * 1024) continue;
      out.push(relative(root, full).split("\\").join("/"));
    }
  }

  visit(root, 0);
  return out;
}

function globToRegExp(glob) {
  const escaped = String(glob)
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*\//g, "\u0001")
    .replace(/\*\*/g, "\u0000")
    .replace(/\*/g, "[^/]*")
    .replace(/\u0001/g, "(?:.*/)?")
    .replace(/\u0000/g, ".*");
  return new RegExp(`^${escaped}$`);
}

function matchesGlob(file, glob) {
  const normalized = String(file).split("\\").join("/");
  const g = String(glob).replace(/^\/+/, "");
  return globToRegExp(g).test(normalized);
}

function findFiles(files, pattern) {
  const raw = String(pattern ?? "");
  if (!raw) return [];
  if (raw.includes("*")) return files.filter((file) => matchesGlob(file, raw));
  return files.filter((file) => file === raw || file.endsWith(`/${raw}`) || file.includes(raw));
}

function fileContains(root, file, needle) {
  try {
    const text = readFileSync(join(root, file), "utf8");
    return text.toLowerCase().includes(String(needle).toLowerCase());
  } catch {
    return false;
  }
}

function packageJsonHasDependency(root, file, dependencyName) {
  try {
    const manifest = JSON.parse(readFileSync(join(root, file), "utf8"));
    const sections = [
      manifest.dependencies,
      manifest.devDependencies,
      manifest.peerDependencies,
      manifest.optionalDependencies,
    ];
    return sections.some((section) => section && Object.hasOwn(section, dependencyName));
  } catch {
    return false;
  }
}

function scoreRepoSignal(root, files, signal) {
  const raw = String(signal ?? "").trim();
  if (!raw) return null;

  if (raw.includes(":")) {
    const [filePattern, ...needleParts] = raw.split(":");
    const needle = needleParts.join(":");
    for (const file of findFiles(files, filePattern)) {
      if (file.endsWith("package.json")) {
        if (packageJsonHasDependency(root, file, needle)) return `signal ${raw}`;
        continue;
      }
      if (fileContains(root, file, needle)) return `signal ${raw}`;
    }
    return null;
  }

  const hits = findFiles(files, raw);
  if (hits.length) return `signal ${raw}`;
  return null;
}

export function detectPacks(packsDoc, projectDir, prompt = "", options = {}) {
  const packs = Array.isArray(packsDoc?.packs) ? packsDoc.packs : [];
  if (!packs.length) return [];
  const files = collectRepoFiles(projectDir);
  const promptLower = String(prompt ?? "").toLowerCase();
  const disabled = new Set((options.disabledPackIds ?? []).map(String));
  const preferred = new Set((options.preferredPackIds ?? []).map(String));
  const maxPacks = Number(options.maxPacks ?? 4);

  return packs
    .filter((pack) => pack?.id && !disabled.has(String(pack.id)))
    .map((pack) => {
      const reasons = [];
      let score = 0;
      let repoEvidence = 0;

      for (const signal of pack.stack?.signals ?? []) {
        const reason = scoreRepoSignal(projectDir, files, signal);
        if (reason) {
          score += 4;
          repoEvidence += 4;
          reasons.push(reason);
        }
      }

      for (const signal of pack.packHeuristics?.repoSignals ?? []) {
        const reason = scoreRepoSignal(projectDir, files, signal);
        if (reason) {
          score += 3;
          repoEvidence += 3;
          reasons.push(reason);
        }
      }

      for (const glob of pack.packHeuristics?.fileGlobs ?? []) {
        const hits = files.filter((file) => matchesGlob(file, glob)).slice(0, 3);
        if (hits.length) {
          score += Math.min(3, hits.length);
          repoEvidence += Math.min(2, hits.length);
          reasons.push(`files ${glob}`);
        }
      }

      for (const keyword of pack.packHeuristics?.keywords ?? []) {
        const k = String(keyword).toLowerCase();
        if (k && promptLower.includes(k)) {
          score += 2;
          reasons.push(`prompt ${keyword}`);
        }
      }

      if (preferred.has(String(pack.id))) {
        score += 2;
        reasons.push("preferred pack");
      }

      return {
        id: String(pack.id ?? ""),
        title: String(pack.title ?? pack.id ?? ""),
        primarySkillId: String(pack.primarySkillId ?? ""),
        agentIds: pack.assets?.agentIds ?? [],
        ruleIds: pack.assets?.ruleIds ?? [],
        score,
        repoEvidence,
        reasons: [...new Set(reasons)].slice(0, 5),
      };
    })
    .filter((pack) => pack.id && pack.repoEvidence >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPacks);
}

export function formatPackContext(detectedPacks) {
  if (!detectedPacks.length) return "";
  const lines = ["[OHC DOMAIN PACKS]"];
  for (const pack of detectedPacks) {
    lines.push(
      `- ${pack.id} (${pack.title}) score=${pack.score}; skill=/${pack.primarySkillId}; agents=${pack.agentIds.join(", ") || "none"}; rules=${pack.ruleIds.join(", ") || "none"}; evidence=${pack.reasons.join("; ")}`,
    );
  }
  return lines.join("\n");
}

export function applyDefaultPack(detectedPacks, packsDoc, defaultPackId) {
  if (detectedPacks.length || !defaultPackId) return detectedPacks;
  const pack = (packsDoc?.packs ?? []).find((candidate) => String(candidate.id) === String(defaultPackId));
  if (!pack) return detectedPacks;
  return [
    {
      id: String(pack.id),
      title: String(pack.title ?? pack.id),
      primarySkillId: String(pack.primarySkillId ?? ""),
      agentIds: pack.assets?.agentIds ?? [],
      ruleIds: pack.assets?.ruleIds ?? [],
      score: 1,
      repoEvidence: 0,
      reasons: ["default pack"],
    },
  ];
}

export function loadGuidanceIndex(scriptDir) {
  return readJsonFile(guidanceIndexJsonPath(scriptDir)) ?? {};
}

export function loadSubagentContextConfig(scriptDir) {
  return readJsonFile(subagentContextJsonPath(scriptDir)) ?? {};
}

export function loadCheckLanes(scriptDir) {
  return readJsonFile(checkLanesJsonPath(scriptDir)) ?? {};
}

function uniqueStrings(values) {
  return [...new Set((values ?? []).filter(Boolean).map(String))];
}

function workflowGuidanceEntry(guidanceIndex, workflowId) {
  return (guidanceIndex?.workflows ?? []).find((entry) => String(entry.id) === String(workflowId)) ?? null;
}

function packGuidanceEntries(guidanceIndex, detectedPacks) {
  const ids = new Set((detectedPacks ?? []).map((pack) => String(pack.id)));
  return (guidanceIndex?.packs ?? []).filter((entry) => ids.has(String(entry.id)));
}

function subagentProfile(subagentDoc, agentId) {
  return (subagentDoc?.profiles ?? []).find((profile) => (profile.agentIds ?? []).map(String).includes(String(agentId))) ?? null;
}

export function formatWorkflowGuidanceContext(guidanceIndex, workflowId) {
  const entry = workflowGuidanceEntry(guidanceIndex, workflowId);
  if (!entry) return "";
  const lines = [
    "[OHC GUIDANCE INDEX]",
    `- workflow=${entry.id}; skill=/${entry.skillId}; deliverables=${(entry.deliverables ?? []).join(", ") || "none"}`,
    `- agents=${(entry.agentIds ?? []).join(", ") || "none"}; rules=${(entry.ruleIds ?? []).slice(0, 4).join(", ") || "none"}; success=${entry.successDefinition || "n/a"}`,
  ];
  return lines.join("\n");
}

export function formatCheckLaneContext(guidanceIndex, workflowId) {
  const lane = workflowGuidanceEntry(guidanceIndex, workflowId)?.checkLane;
  if (!lane) return "";
  const lines = [
    `[OHC CHECK LANE: ${String(lane.title ?? workflowId).toUpperCase()}]`,
    `- minimum_sections=${(lane.minimumSections ?? []).join(", ") || "none"}`,
    `- verification_prompts=${(lane.verificationPrompts ?? []).slice(0, 3).join(" | ") || "none"}`,
  ];
  return lines.join("\n");
}

function rankWorkflowAgents(workflowEntry, detectedPacks, guidanceIndex) {
  const preferred = new Set(packGuidanceEntries(guidanceIndex, detectedPacks).flatMap((pack) => pack.agentIds ?? []).map(String));
  const ordered = [...(workflowEntry?.agentIds ?? [])].map(String);
  const universal = new Set([
    "pm-planner",
    "question-asker",
    "architecture-reviewer",
    "repo-researcher",
    "debug-investigator",
    "test-writer",
    "docs-maintainer",
    "release-notes-writer",
    "migration-reviewer",
  ]);
  const narrowed = preferred.size
    ? ordered.filter((agentId) => preferred.has(agentId) || universal.has(agentId))
    : ordered;
  return (narrowed.length ? narrowed : ordered).sort((a, b) => {
    const aPreferred = preferred.has(a) ? 0 : universal.has(a) ? 1 : 2;
    const bPreferred = preferred.has(b) ? 0 : universal.has(b) ? 1 : 2;
    return aPreferred - bPreferred;
  });
}

export function formatSubagentBriefsContext(guidanceIndex, subagentDoc, workflowId, detectedPacks = []) {
  const workflowEntry = workflowGuidanceEntry(guidanceIndex, workflowId);
  if (!workflowEntry) return "";
  const defaults = subagentDoc?.defaults ?? {};
  const maxRuleIds = Number(defaults.maxRuleIds ?? 2);
  const maxPackIds = Number(defaults.maxPackIds ?? 2);
  const routerAgentLimit = Number(defaults.routerAgentLimit ?? 3);
  const packEntries = packGuidanceEntries(guidanceIndex, detectedPacks).slice(0, maxPackIds);
  const activePackIds = uniqueStrings(packEntries.map((pack) => pack.id));
  const activeRuleIds = uniqueStrings(packEntries.flatMap((pack) => pack.ruleIds ?? [])).slice(0, maxRuleIds);
  const rankedAgents = rankWorkflowAgents(workflowEntry, detectedPacks, guidanceIndex).slice(0, routerAgentLimit);

  if (!rankedAgents.length) return "";

  const lines = ["[OHC SUBAGENT BRIEFS]"];
  for (const agentId of rankedAgents) {
    const profile = subagentProfile(subagentDoc, agentId);
    const include = profile?.include ?? {};
    const sections = [];
    if (include.workflowSummary) sections.push(`workflow=${workflowId}`);
    if (include.workflowDeliverables) sections.push(`deliverables=${(workflowEntry.deliverables ?? []).join(", ") || "none"}`);
    if (include.packRules) {
      sections.push(`packs=${activePackIds.join(", ") || "none"}`);
      sections.push(`rules=${activeRuleIds.join(", ") || "none"}`);
    }
    if (include.checkLane && workflowEntry.checkLane) {
      sections.push(`check_lane=${(workflowEntry.checkLane.minimumSections ?? []).join(", ") || "none"}`);
    }
    lines.push(`- ${agentId}: focus=${profile?.focus ?? "scoped specialist"}; ${sections.join("; ")}; output=${(profile?.outputHints ?? []).join(", ") || "none"}`);
  }
  return lines.join("\n");
}
