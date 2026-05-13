---
name: omc-develop
description: Implement a scoped change with tight repo fit and local proof. Use when the direction is chosen and the next step is code or documentation work with explicit verification.
metadata:
  category: workflow
---

# omc-develop

## Overview

Implement a scoped change. Stay repo-first, touch only the necessary surface, and treat verification as part of the work.

## When to use

- The user has chosen a direction and wants code or docs changed
- The plan is clear enough to start implementation
- The work can be completed with local repo evidence and local verification
- A review finding has a concrete fix path

## When not to use

- The prompt is still fuzzy and needs `omc-brainstorm` or `omc-spec`
- The task needs a design decision before code, which belongs in `omc-architecture`
- The main need is independent findings rather than edits, which belongs in `omc-review`
- The task requires production credentials, deployment authority, or external release approval

## Repo-first discovery

- Identify the exact files, tests, and conventions that own the behavior before editing.
- Prefer existing utilities and nearby patterns over new abstractions.
- Keep unrelated cleanup out of the change unless it is required for the scoped result.

## Workflow

1. Restate the scoped outcome, affected surface, and non-goals.
2. Read the nearest implementation, tests, and configuration before editing.
3. Make the smallest coherent change.
4. Run the narrowest meaningful verification path.
5. Close with what changed, what was proven, and what remains risky.

## Output contract

- `scope`: the behavior or artifact changed
- `changes`: concise summary of files or surfaces touched
- `checks_run`: verification commands, inspections, or proof paths used
- `blocked_on`: missing information, authority, or verification if progress stalls
- `handoff`: residual risks, next workflow, or human follow-up if needed

## Guardrails

- Do not widen scope with opportunistic refactors.
- Prefer existing utilities and nearby patterns over new abstractions.
- Keep verification explicit.
- Route unresolved proof, design, or review issues to the next workflow instead of hiding them.

## On-demand references

- Pull from [`../../references/workflow-develop.md`](../../references/workflow-develop.md) when the execution pass needs a tighter quality bar.
- Pull from [`../../references/skill-output-contracts.md`](../../references/skill-output-contracts.md) when another workflow will consume the handoff.
- Pull from [`../../references/skill-repo-discovery.md`](../../references/skill-repo-discovery.md) when local ownership or verification paths are unclear.
