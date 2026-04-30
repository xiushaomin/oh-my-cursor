---
name: omc-work
description: Guided step-by-step execution — one decision at a time with explicit checkpoints. Use when the user wants manual mode, walkthrough, or step-by-step help (e.g. "step by step", "guide me", "一步一步").
disable-model-invocation: true
metadata:
  category: workflow
---

# omc-work

## Goal
- Keep session safe + predictable: **one small step**, user confirms, repeat.

## When to use
- User asks “一步一步 / step by step / guide me”.
- Requirements fuzzy; need short loop to converge.
- Risky change; user wants tight control.

## When NOT to use
- Multi-domain parallel work needed → `/omc-orchestrator`.
- Pure review/audit → `/omc-review`.
- Pure git/PR ops → `/omc-scm`.

## Protocol (repeat)
1. **Restate goal + constraints** in 1-2 lines (no new scope).
2. **Propose exactly 1 next step** (must be reviewable in < 2 minutes).
3. **Stop and wait** for user confirmation/edits.
4. Execute the step.
5. Report:
   - what changed (files)
   - how verified (command/evidence)
   - next 2 options

## Output contract
- `current_step`, `next_options`, `blocked_on` (if any).

## Hard rules (anti-explosion)
- No parallel subagents unless user explicitly asks.
- No refactors “while here”.
- If unclear → ask 1 clarifying question, then propose next step again.
