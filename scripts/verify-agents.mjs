#!/usr/bin/env node
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const repoRoot = resolve(process.cwd());
const agentsDir = join(repoRoot, "agents");
const workflowsDoc = JSON.parse(readFileSync(join(repoRoot, "config", "workflows.json"), "utf8"));
const capabilitiesDoc = JSON.parse(readFileSync(join(repoRoot, "config", "capabilities.json"), "utf8"));
const subagentContextDoc = JSON.parse(readFileSync(join(repoRoot, "config", "subagent-context.json"), "utf8"));

const agentFiles = readdirSync(agentsDir)
  .filter((name) => name.endsWith(".md"))
  .map((name) => name.replace(/\.md$/, ""))
  .sort();
const capabilityMap = new Map(
  (capabilitiesDoc.capabilities ?? [])
    .filter((cap) => String(cap.id).startsWith("agent."))
    .map((cap) => [String(cap.id).slice(6), cap]),
);
const profileMap = new Map();
for (const profile of subagentContextDoc.profiles ?? []) {
  for (const agentId of profile.agentIds ?? []) {
    profileMap.set(String(agentId), profile);
  }
}
const workflowIds = new Set((workflowsDoc.workflows ?? []).map((workflow) => String(workflow.id)));
const workflowAgentRefs = new Map();
for (const workflow of workflowsDoc.workflows ?? []) {
  for (const agentId of workflow.subagents?.recommended ?? []) {
    const key = String(agentId);
    if (!workflowAgentRefs.has(key)) workflowAgentRefs.set(key, new Set());
    workflowAgentRefs.get(key).add(String(workflow.id));
  }
}

function parseFrontmatter(text, agentId) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, `[verify-agents] ${agentId} is missing valid frontmatter`);
  const frontmatter = match[1];
  const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  assert.equal(name, agentId, `[verify-agents] ${agentId} frontmatter name must match file name`);
  assert.ok(description && description.includes("Use proactively"), `[verify-agents] ${agentId} description should include "Use proactively"`);
}

let checked = 0;
for (const agentId of agentFiles) {
  const filePath = join(agentsDir, `${agentId}.md`);
  const text = readFileSync(filePath, "utf8");
  parseFrontmatter(text, agentId);

  const capability = capabilityMap.get(agentId);
  assert.ok(capability, `[verify-agents] ${agentId} is missing agent capability definition`);
  assert.ok(profileMap.has(agentId), `[verify-agents] ${agentId} is missing subagent profile membership`);

  const installPath = capability.install?.sourcePath ?? capability.source?.path;
  assert.equal(installPath, `agents/${agentId}.md`, `[verify-agents] ${agentId} capability source path mismatch`);

  const referencedWorkflows = new Set((capability.references?.workflowIds ?? []).map(String));
  for (const workflowId of referencedWorkflows) {
    assert.ok(workflowIds.has(workflowId), `[verify-agents] ${agentId} references unknown workflow: ${workflowId}`);
  }

  const recommendedByWorkflows = workflowAgentRefs.get(agentId) ?? new Set();
  for (const workflowId of recommendedByWorkflows) {
    assert.ok(
      referencedWorkflows.has(workflowId),
      `[verify-agents] ${agentId} is recommended by ${workflowId} but capability.references.workflowIds does not include it`,
    );
  }

  checked += 1;
}

console.log(`[verify-agents] ${checked} agents verified for frontmatter, capability linkage, profile membership, and workflow references.`);
