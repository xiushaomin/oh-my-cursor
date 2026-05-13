---
name: omc-verify
description: Design the proof for a change. Use when behavior claims need to be mapped to automated checks, manual checks, proof targets, blockers, and explicit coverage gaps.
metadata:
  category: workflow
---

# omc-verify

## Overview

Turn a claim into proof obligations. Name what must be true, what could regress, which checks should prove it, and what remains unproven.

## When to use

- Before implementation to shape verification early
- After implementation to identify missing proof
- During review when a change needs a clearer verification strategy
- When a risky path needs focused regression coverage rather than generic test sprawl

## When not to use

- The task is pure brainstorming with no concrete behavior yet
- The user needs the actual implementation more than the proof plan
- The verification depends on production-only credentials or deployment authority

## Repo-first discovery

- Discover the repo's existing test layers before recommending new ones.
- Prefer the smallest local verification path or file target that already fits the codebase.
- If the repo lacks automated coverage in the affected area, say so explicitly.

## Workflow

1. State the behavior, invariant, or promise that needs proof.
2. Rank the highest-value risks.
3. Split proof into automated checks, manual checks, and inspection targets.
4. Prefer the smallest strong regression checks.
5. End with explicit blockers and coverage gaps.

## Output contract

- `scope`: the behavior or invariant to prove
- `risks`: prioritized regression risks
- `automated_tests`: targeted automated checks
- `manual_checks`: focused human validation steps
- `check_targets`: concrete scripts, files, flows, or inspection targets when known
- `coverage_gaps`: what remains unproven, blocked, or expensive to prove

## Guardrails

- Do not list tools without saying what they prove.
- Prefer targeted regression checks over broad low-signal coverage.
- Keep manual checks repeatable.
- Name gaps instead of hiding them.

## On-demand references

- Pull from [`../../references/workflow-verify.md`](../../references/workflow-verify.md) when the proof design needs more structure.
- Pull from [`../../references/testing-checklist.md`](../../references/testing-checklist.md) for deeper verification heuristics.
- Pull from [`../../references/skill-repo-discovery.md`](../../references/skill-repo-discovery.md) when verification discovery or test ownership is unclear.
