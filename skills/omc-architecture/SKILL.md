---
name: omc-architecture
description: Make a design decision with explicit tradeoffs. Use when the hard part is system shape, boundaries, contracts, or migration risk rather than local implementation.
metadata:
  category: workflow
---

# omc-architecture

## Overview

Use this skill when the hard part is choosing the shape of the system rather than writing the code. Good architecture work makes constraints, rejected alternatives, and migration consequences explicit.

## When to use

- Cross-module, cross-platform, or cross-service design decisions
- API or contract changes with compatibility impact
- Migration, boundary, state, routing, or data-flow decisions
- Work that would be expensive to reverse after implementation

## When not to use

- A small local implementation task with obvious existing patterns
- Early ideation where breadth matters more than design commitment

## Repo-first discovery

- Read the current module, API, routing, or ownership boundaries before sketching a better shape.
- Ground options in the repo's real constraints, not abstract architecture preferences.
- Verify whether migration and compatibility pressure already exists in adjacent code or docs.

## Workflow

1. Map the current boundaries, constraints, and affected surfaces.
2. State the forces and tradeoffs.
3. Compare 2-3 viable options.
4. Recommend one path and name the rejected alternatives.
5. End with migration shape and verification points.

## Output contract

- `context`: current system shape and affected surfaces
- `constraints`: forces, tradeoffs, and non-goals
- `options`: 2-3 viable approaches with tradeoffs
- `decision`: the recommended path
- `rejected`: alternatives and why they lose
- `migration_plan`: transition shape, compatibility window, rollback decision point, and human-owned operational notes when relevant
- `verification`: proof points for the chosen design

## Guardrails

- Do not present one option as if tradeoffs do not exist.
- Keep migration cost inside the decision, not as a later note.
- Avoid theoretical purity that ignores the repo's current shape.
- Do not pretend to own production rollout authority.

## On-demand references

- Pull from [`../../references/workflow-architecture.md`](../../references/workflow-architecture.md) when the decision record needs a stronger tradeoff bar.
- Pull from [`../../references/skill-output-contracts.md`](../../references/skill-output-contracts.md) when another workflow will consume the decision record.
- Pull from [`../../references/skill-repo-discovery.md`](../../references/skill-repo-discovery.md) when local boundaries or constraints are not yet explicit.
