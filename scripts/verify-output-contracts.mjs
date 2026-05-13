#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const repoRoot = resolve(process.cwd());
const workflowsDoc = JSON.parse(readFileSync(join(repoRoot, "config", "workflows.json"), "utf8"));
const contractReference = readFileSync(join(repoRoot, "references", "skill-output-contracts.md"), "utf8");

function extractReferenceFields(text) {
  const lines = text.split("\n");
  const byWorkflow = new Map();
  let current = null;
  for (const line of lines) {
    const workflowMatch = line.match(/^- `([^`]+)`$/);
    if (workflowMatch) {
      current = workflowMatch[1];
      continue;
    }
    const fieldsMatch = line.match(/^  Fields: `(.+)`$/);
    if (current && fieldsMatch) {
      byWorkflow.set(
        current,
        fieldsMatch[1]
          .split(",")
          .map((x) => x.trim().replace(/^`|`$/g, ""))
          .filter(Boolean),
      );
      current = null;
    }
  }
  return byWorkflow;
}

const referenceFields = extractReferenceFields(contractReference);
let checked = 0;
const activeWorkflowIds = new Set((workflowsDoc.workflows ?? []).map((workflow) => String(workflow.id)));
const activeSkillIds = new Set((workflowsDoc.workflows ?? []).map((workflow) => String(workflow.skillId ?? "")));
const removedLegacyIds = new Set(
  (workflowsDoc.workflows ?? []).flatMap((workflow) => (workflow.removedLegacyIds ?? []).map(String)),
);

for (const workflow of workflowsDoc.workflows ?? []) {
  const workflowId = String(workflow.id);
  const configured = (workflow.outputContract?.fields ?? []).map(String);
  const referenced = referenceFields.get(workflowId);
  const canonicalName = String(workflow.canonicalName ?? "");
  const lifecycleStage = String(workflow.lifecycleStage ?? "");

  assert.equal(canonicalName, workflowId.replace(/^omc-/, ""), `[verify-output-contracts] ${workflowId} has invalid canonicalName`);
  assert.ok(
    ["main", "helper", "domain"].includes(lifecycleStage),
    `[verify-output-contracts] ${workflowId} has invalid lifecycleStage`,
  );
  assert.ok(Array.isArray(workflow.removedLegacyIds), `[verify-output-contracts] ${workflowId} must declare removedLegacyIds`);
  assert.ok(configured.length > 0, `[verify-output-contracts] ${workflowId} is missing outputContract.fields`);
  assert.ok(referenced, `[verify-output-contracts] ${workflowId} is missing from references/skill-output-contracts.md`);
  assert.deepEqual(
    referenced,
    configured,
    `[verify-output-contracts] ${workflowId} contract drifted between config/workflows.json and references/skill-output-contracts.md`,
  );
  checked += 1;
}

for (const legacyId of removedLegacyIds) {
  assert.equal(activeWorkflowIds.has(legacyId), false, `[verify-output-contracts] removed legacy workflow is still active: ${legacyId}`);
  assert.equal(activeSkillIds.has(legacyId), false, `[verify-output-contracts] removed legacy skill is still active: ${legacyId}`);
}

console.log(`[verify-output-contracts] ${checked} workflow output contracts verified.`);
