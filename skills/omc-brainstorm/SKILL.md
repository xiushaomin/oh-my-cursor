---
name: omc-brainstorm
description: Explore product or technical options before committing to a plan. Use when the user wants alternatives, tradeoffs, naming, scope shaping, or early solution direction.
metadata:
  category: workflow
---

# omc-brainstorm

## Overview

Turn fuzzy intent into a small set of concrete options without prematurely committing to implementation.

## When to use

- Product direction, feature shape, naming, UX alternatives, or "what should we build?" questions
- Early architecture or scope options before planning
- Breadth is more useful than commitment

## When not to use

- A direction is already chosen and the next step is `omc-plan` or `omc-develop`
- The user wants a review of existing changes
- The task needs a final design decision record

## Repo-first discovery

- Read the local product, feature, or architecture context before inventing options.
- Reuse nearby terminology, boundaries, and constraints from the repo or user prompt.
- If the repo does not contain enough context, state the missing assumption instead of papering over it.

## Workflow

1. Frame the goal, audience, constraints, and non-goals.
2. Propose 3-5 distinct options with concrete tradeoffs.
3. Recommend one path and explain why it fits best.
4. End with a plan-ready brief or the smallest missing decision.

## Guardrails
- Keep options concrete enough to evaluate.
- Avoid implementation detail until direction is selected.
- Prefer simple, testable slices over broad promises.

## Output contract

- `problem_frame`, `options`, `recommendation`, `open_decisions`, `plan_seed`

## On-demand references

- Pull from [`../../references/workflow-brainstorm.md`](../../references/workflow-brainstorm.md) when the option set needs a stronger quality bar.
- Pull from [`../../references/skill-output-contracts.md`](../../references/skill-output-contracts.md) when a downstream workflow needs a stable handoff.
- Pull from [`../../references/skill-repo-discovery.md`](../../references/skill-repo-discovery.md) when the local context is thin or ambiguous.
