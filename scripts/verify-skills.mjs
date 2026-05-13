#!/usr/bin/env node
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, normalize, resolve } from "node:path";

const repoRoot = resolve(process.cwd());
const skillsDir = join(repoRoot, "skills");
const requiredWorkflowHeadings = [
  "## Overview",
  "## When to use",
  "## When not to use",
  "## Repo-first discovery",
  "## Workflow",
  "## Output contract",
  "## On-demand references",
];
const requiredPackHeadings = [
  "## Overview",
  "## When to use",
  "## Repo-first discovery",
  "## Default deliverable",
  "## On-demand references",
];

function parseFrontmatter(text, skillId) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, `[verify-skills] ${skillId} is missing valid frontmatter`);
  const frontmatter = match[1];
  const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  const category = frontmatter.match(/^metadata:\n  category:\s*(.+)$/m)?.[1]?.trim();
  assert.equal(name, skillId, `[verify-skills] ${skillId} frontmatter name must match directory`);
  assert.ok(description && description.includes("Use when"), `[verify-skills] ${skillId} description should include "Use when" for discovery`);
  assert.ok(category === "workflow" || category === "pack", `[verify-skills] ${skillId} metadata.category must be workflow or pack`);
  return { category };
}

function verifyHeadings(text, skillId, category) {
  const required = category === "workflow" ? requiredWorkflowHeadings : requiredPackHeadings;
  for (const heading of required) {
    assert.ok(text.includes(heading), `[verify-skills] ${skillId} is missing heading: ${heading}`);
  }
  assert.ok(!text.includes("## When NOT to use"), `[verify-skills] ${skillId} should use normalized heading casing`);
}

function verifyReferenceLinks(text, skillId) {
  const matches = [...text.matchAll(/\]\((\.\.\/\.\.\/references\/[^)]+)\)/g)];
  for (const match of matches) {
    const rel = match[1];
    const full = normalize(join(skillsDir, skillId, rel));
    assert.ok(existsSync(full), `[verify-skills] ${skillId} references missing file: ${rel}`);
  }
}

let checked = 0;
for (const skillId of readdirSync(skillsDir).sort()) {
  const skillPath = join(skillsDir, skillId, "SKILL.md");
  if (!existsSync(skillPath)) continue;
  const text = readFileSync(skillPath, "utf8");
  const { category } = parseFrontmatter(text, skillId);
  verifyHeadings(text, skillId, category);
  verifyReferenceLinks(text, skillId);
  checked += 1;
}

console.log(`[verify-skills] ${checked} skills verified for frontmatter, structure, and reference links.`);
