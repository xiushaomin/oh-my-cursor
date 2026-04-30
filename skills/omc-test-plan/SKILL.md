---
name: omc-test-plan
description: Generate a focused test plan with regression targets, commands, manual checks, and risk-based coverage priorities.
metadata:
  category: delivery
---

# omc-test-plan

## Goal
- Turn changed behavior or proposed work into a concrete verification plan.

## When to use
- Before implementation to define test shape.
- After implementation to identify missing coverage.
- When a reviewer asks "what should we test?"

## Protocol
1. Identify behavior, invariants, and user-visible claims.
2. Group checks by automated tests, static checks, and manual validation.
3. Prioritize regression risk and critical paths.
4. Name the exact commands or files to inspect when known.

## Delegation
- Use `test-writer` for concrete test additions or deeper coverage planning.

## Output contract
- `scope`, `risks`, `automated_tests`, `manual_checks`, `commands`, `coverage_gaps`.
