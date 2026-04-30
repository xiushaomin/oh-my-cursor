---
name: omc-brainstorm
description: Ideation and option exploration before planning. Use when the user wants alternatives, product thinking, naming, scope shaping, or rough solution discovery before implementation.
metadata:
  category: workflow
---

# omc-brainstorm

## Goal
- Turn fuzzy intent into a small set of useful options without prematurely committing to implementation.

## When to use
- Product direction, feature shape, naming, UX alternatives, architecture options, or "what should we build?" questions.
- The user wants breadth before a plan.

## When NOT to use
- The user already chose a path and wants execution -> `/omc-work` or `/omc-orchestrator`.
- The user needs a review of existing work -> `/omc-review`.

## Protocol
1. **Frame**: restate the goal, audience, constraints, and non-goals.
2. **Diverge**: propose 3-5 distinct options, each with tradeoffs.
3. **Converge**: recommend one path and name why it fits the constraints.
4. **Next step**: produce either a plan-ready brief or 1-2 questions if a decision is still missing.

## Guardrails
- Keep options concrete enough to evaluate.
- Avoid implementation details until the direction is selected.
- Prefer simple, testable product slices over broad platform promises.

## Output contract
- `problem_frame`, `options`, `recommendation`, `open_decisions`, `plan_seed`.
