---
name: omc-release-checklist
description: Build a release readiness checklist covering tests, docs, migration, rollout, rollback, and owner handoff.
metadata:
  category: delivery
---

# omc-release-checklist

## Goal
- Turn a change set into a release-ready checklist.

## When to use
- Before a release, deploy, app submission, or major handoff.
- When a change touches migrations, platform stores, or multiple domains.

## Protocol
1. Identify release scope and impacted users/systems.
2. List required checks by domain.
3. Include docs, monitoring, rollout, rollback, and support notes.
4. Mark blockers separately from nice-to-have follow-ups.

## Delegation
- Use `test-writer` for verification gaps.
- Use `migration-reviewer` for compatibility and rollback risk.
- Use `release-notes-writer` for release wording.

## Output contract
- `scope`, `required_checks`, `release_blockers`, `rollout_plan`, `rollback_plan`, `handoff`.

## Minimal acceptance structure
- `scope`: changed systems, users, and surfaces.
- `required_checks`: grouped by engineering, product, and ops as needed.
- `release_blockers`: must-pass items before rollout.
- `rollout_plan`: staged release or owner notes when known.
- `rollback_plan`: trigger and reversal path.
