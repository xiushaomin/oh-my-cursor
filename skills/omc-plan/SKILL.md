---
name: omc-plan
description: Turn a scoped goal into an execution-ready plan. Use when the work is multi-step, crosses modules, or needs milestones, acceptance criteria, risks, and verification before implementation.
metadata:
  category: workflow
---

# omc-plan

## Overview

Turn intent into an execution-ready plan before implementation starts. A good plan makes scope, dependencies, verification, and ownership visible early enough to avoid expensive rework.

## When to use

- The task spans multiple files, modules, or stages
- Requirements are mostly clear but execution shape is not
- The user wants milestones, sequencing, or dependency mapping
- A design or rollout decision could make later work expensive to reverse

## When not to use

- The task is a tiny local change with obvious scope
- The user wants brainstorming before committing to a path
- The user wants scoped implementation instead of a full plan

## Repo-first discovery

- Inspect the repo before planning so milestones reflect real modules, verification paths, and ownership boundaries.
- Find the most likely verification path early instead of leaving test shape abstract.
- If the repo is missing structure, call that out as a planning risk.

## Workflow

1. State the goal, user impact, and explicit non-goals.
2. Name assumptions that could change the plan.
3. Break the work into 2-6 reviewable milestones.
4. Add ownership, dependencies, acceptance criteria, and risks.
5. End with the proof path that should validate execution.

## Output contract

- `plan`: ordered milestones with purpose and ownership
- `acceptance_criteria`: the proof obligation for each milestone
- `dependencies`: sequencing constraints, prerequisites, or external blockers
- `risks`: highest-risk steps, assumptions, and mitigation

## Guardrails

- Do not start implementation.
- Keep milestones reviewable, not vague buckets of activity.
- Make verification part of the plan, not a follow-up thought.
- Name dependencies and assumptions explicitly.

## On-demand references

- Pull from [`../../references/workflow-plan.md`](../../references/workflow-plan.md) when sequencing or proof obligations need more detail.
- Pull from [`../../references/skill-output-contracts.md`](../../references/skill-output-contracts.md) to keep the artifact stable for downstream workflows.
- Pull from [`../../references/skill-repo-discovery.md`](../../references/skill-repo-discovery.md) when you need to ground milestones in the actual repo shape.
