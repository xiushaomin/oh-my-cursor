#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function unique(values) {
  return [...new Set((values ?? []).filter(Boolean).map(String))];
}

export function buildGuidanceIndex(rootDir = process.cwd()) {
  const root = resolve(rootDir);
  const configDir = join(root, "config");
  const workflowsDoc = JSON.parse(readFileSync(join(configDir, "workflows.json"), "utf8"));
  const packsDoc = JSON.parse(readFileSync(join(configDir, "packs.json"), "utf8"));
  const capsDoc = JSON.parse(readFileSync(join(configDir, "capabilities.json"), "utf8"));
  const checkLaneDoc = JSON.parse(readFileSync(join(configDir, "check-lanes.json"), "utf8"));
  const subagentDoc = JSON.parse(readFileSync(join(configDir, "subagent-context.json"), "utf8"));

  const capabilityById = new Map((capsDoc.capabilities ?? []).map((cap) => [String(cap.id), cap]));
  const packById = new Map((packsDoc.packs ?? []).map((pack) => [String(pack.id), pack]));
  const checkLaneByWorkflowId = new Map((checkLaneDoc.lanes ?? []).map((lane) => [String(lane.workflowId), lane]));

  function flattenRuleIds(packIds) {
    return unique(
      packIds.flatMap((packId) => {
        const pack = packById.get(String(packId));
        return pack?.assets?.ruleIds ?? [];
      }),
    );
  }

  function titleForAgent(agentId) {
    return capabilityById.get(`agent.${agentId}`)?.title ?? agentId;
  }

  function titleForRule(ruleId) {
    return capabilityById.get(ruleId)?.title ?? ruleId;
  }

  function titleForPack(packId) {
    return packById.get(String(packId))?.title ?? packId;
  }

  const workflows = (workflowsDoc.workflows ?? []).map((workflow) => {
    const workflowId = String(workflow.id);
    const packIds = unique(workflow.compatibility?.packIds ?? []);
    const agentIds = unique(workflow.subagents?.recommended ?? []);
    const ruleIds = flattenRuleIds(packIds);
    const lane = checkLaneByWorkflowId.get(workflowId) ?? null;
    return {
      id: workflowId,
      title: String(workflow.title ?? workflowId),
      skillId: String(workflow.skillId ?? ""),
      description: String(workflow.description ?? ""),
      packIds,
      packs: packIds.map((packId) => ({ id: packId, title: titleForPack(packId) })),
      agentIds,
      agents: agentIds.map((agentId) => ({ id: agentId, title: titleForAgent(agentId) })),
      ruleIds,
      rules: ruleIds.map((ruleId) => ({ id: ruleId, title: titleForRule(ruleId) })),
      deliverables: unique(workflow.outputContract?.fields ?? []),
      successDefinition: String(workflow.outputContract?.successDefinition ?? ""),
      relatedWorkflowIds: unique(workflow.explain?.relatedWorkflowIds ?? []),
      checkLane: lane
        ? {
            title: String(lane.title ?? ""),
            minimumSections: unique(lane.minimumSections ?? []),
            verificationPrompts: unique(lane.verificationPrompts ?? []),
          }
        : null,
    };
  });

  const packs = (packsDoc.packs ?? []).map((pack) => ({
    id: String(pack.id),
    title: String(pack.title ?? pack.id),
    primarySkillId: String(pack.primarySkillId ?? ""),
    workflowIds: unique(pack.compatibility?.workflowIds ?? []),
    defaultWorkflowIds: unique(pack.compatibility?.defaultWorkflowIds ?? []),
    ruleIds: unique(pack.assets?.ruleIds ?? []),
    agentIds: unique(pack.assets?.agentIds ?? []),
    qualityFocus: unique(pack.qualityFocus ?? []),
  }));

  const subagentProfiles = (subagentDoc.profiles ?? []).map((profile) => ({
    id: String(profile.id),
    agentIds: unique(profile.agentIds ?? []),
    include: profile.include ?? {},
    focus: String(profile.focus ?? ""),
    outputHints: unique(profile.outputHints ?? []),
  }));

  const agents = subagentProfiles.flatMap((profile) =>
    profile.agentIds.map((agentId) => ({
      id: agentId,
      title: titleForAgent(agentId),
      profileId: profile.id,
      focus: profile.focus,
      outputHints: profile.outputHints,
      workflowIds: unique(
        workflows
          .filter((workflow) => workflow.agentIds.includes(agentId))
          .map((workflow) => workflow.id),
      ),
    })),
  );

  return {
    schemaVersion: "1",
    productVersion: "0.1.0",
    generatedAt: new Date().toISOString(),
    workflows,
    packs,
    agents,
    subagentProfiles,
    checkLanes: checkLaneDoc.lanes ?? [],
  };
}

export function writeGuidanceIndex(rootDir = process.cwd()) {
  const root = resolve(rootDir);
  const configDir = join(root, "config");
  const out = buildGuidanceIndex(root);
  mkdirSync(dirname(join(configDir, "guidance-index.json")), { recursive: true });
  writeFileSync(join(configDir, "guidance-index.json"), JSON.stringify(out, null, 2) + "\n");
  return out;
}

const isDirectRun = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  writeGuidanceIndex(process.cwd());
}
