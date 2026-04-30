---
name: omc-migration-checklist
description: Produce a migration checklist for schema, API, dependency, platform, or architecture changes.
metadata:
  category: delivery
---

# omc-migration-checklist

## Goal
- Make risky transitions explicit before implementation or rollout.

## When to use
- Schema, API, dependency, platform, config, or architecture migrations.
- Any change that needs compatibility, rollout, or rollback planning.

## Protocol
1. Identify old state, target state, and compatibility window.
2. Define ordered migration steps.
3. Add verification at each step.
4. Add rollback and communication notes.

## Delegation
- Use `migration-reviewer` for compatibility and rollback analysis.
- Use `test-writer` for migration verification.

## Output contract
- `current_state`, `target_state`, `steps`, `verification`, `rollback`, `risks`.

## Minimal acceptance structure
- `current_state` and `target_state`: name the compatibility boundary clearly.
- `steps`: ordered sequence with risky transitions called out.
- `verification`: proof point for each risky step.
- `rollback`: last safe revert point before irreversible actions.
- `risks`: compatibility, data, or rollout concerns still open.
