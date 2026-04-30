---
name: omc-orchestrator
description: Heavy multi-step orchestration across domains — analyze, plan, dispatch subagents, integrate, verify.
metadata:
  category: workflow
---

# omc-orchestrator

## Goal
- Split big work into parallel streams, keep one coherent integration story, then verify.

## When to use
- 2+ domains (web + backend + mobile) or 4+ files with dependencies.
- Need parallel specialists and explicit acceptance checks.
- Need “done” definition and verification before handoff.

## When NOT to use
- Single small change → do inline (or `/omc-work` if user wants manual).
- User only wants a plan → `/omc-plan`.
- User asks “what is orchestrate” style question → answer; do not execute.

## Core flow
1. **Analyze**: scope, risks, unknowns, repo signals; define success criteria.
2. **Plan**: 3-7 steps, each owned (parent vs subagent), each has verification.
3. **Dispatch**: spawn only task-scoped subagents; include “Done When” and file boundaries.
4. **Integrate**: reconcile diffs; keep minimal surface area; resolve conflicts intentionally.
5. **Verify**: run checks/tests; record what was run + results; list remaining gaps.
6. **Stop**: present handoffs + next actions; do not auto-expand scope.

## Cursor-native rules
- Prefer **Skills + Subagents** inside Cursor; do not rely on external CLIs as the primary runtime.
- Parent agent keeps the global picture; subagents own narrow execution.

## Guardrails (from reference repos)
- **Avoid over-orchestration**: if prompt small/underspecified, fall back to `/omc-work`.
- **Mutual exclusion**: do not trigger `review/debug/plan/scm` implicitly—use explicit calls.
- **Evidence-first**: no “seems fixed”; require a check or concrete repro evidence.

## Output contract
- `status`, `plan`, `delegations`, `risks`, `verification`, `handoffs`.
