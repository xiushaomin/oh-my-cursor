---
name: omc-pr-summary
description: Produce a concise PR summary with user impact, implementation notes, verification, and residual risk.
metadata:
  category: delivery
---

# omc-pr-summary

## Goal
- Convert completed work into a reviewer-friendly handoff.

## When to use
- Before opening a PR.
- When handing off local changes to a teammate.
- When the user asks for a concise change summary.

## Protocol
1. Summarize why the change exists.
2. Separate user-visible behavior from internal implementation.
3. List verification evidence and known gaps.
4. Call out migration, rollout, or compatibility notes when relevant.

## Delegation
- Use `release-notes-writer` for polished wording.
- Use `docs-maintainer` when docs changed or should change.

## Output contract
- `summary`, `user_impact`, `implementation_notes`, `verification`, `risks`.
