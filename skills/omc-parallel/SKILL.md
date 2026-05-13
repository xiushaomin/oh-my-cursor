---
name: omc-parallel
description: Coordinate bounded parallel work with clear ownership and integration. Use when a task has genuinely independent lanes and one parent lane must own the final result.
metadata:
  category: workflow
---

# omc-parallel

## Overview

Use this skill when a task is too broad for one uninterrupted pass and has genuinely independent lanes. The parent lane owns scope, sequencing, integration, and final verification.

## When to use

- The task spans multiple domains or subsystems
- Parallel specialist lanes would materially improve speed or quality
- Ownership boundaries can be stated before work begins
- Verification crosses multiple surfaces

## When not to use

- The task is a small local change
- The user wants only a plan
- Lanes would edit the same files without clear ownership
- The parent would become a passive router instead of an integrator

## Repo-first discovery

- Map the real file, module, and ownership boundaries before delegating.
- Identify which verification steps are global versus slice-local before work begins.
- Keep the parent lane on the critical path; do not delegate the understanding of the repo itself.

## Workflow

1. Define success, risks, and ownership boundaries before delegating.
2. Create a short execution plan with explicit lanes and checkpoints.
3. Delegate only bounded subtasks with clear done conditions.
4. Keep the parent lane active on integration and the critical path.
5. Verify the integrated result, then close with explicit residual risk.

## Output contract

- `status`: current parallel-work state
- `plan`: ordered workstreams, owners, and checkpoints
- `delegations`: bounded subtasks and done conditions
- `risks`: integration, scope, and verification risks
- `verification`: end-to-end proof and known gaps
- `handoffs`: follow-up work that should not be hidden in the current task

## Guardrails

- Do not delegate before success criteria are clear.
- Do not send multiple lanes into the same files without ownership splits.
- Keep the parent lane active.
- Verify integrated behavior, not just subtask-local behavior.

## On-demand references

- Pull from [`../../references/workflow-parallel.md`](../../references/workflow-parallel.md) when orchestration discipline needs more detail.
- Pull from [`../../references/skill-output-contracts.md`](../../references/skill-output-contracts.md) to keep delegated artifacts consistent.
- Pull from [`../../references/skill-repo-discovery.md`](../../references/skill-repo-discovery.md) when ownership boundaries or verification paths are fuzzy.
