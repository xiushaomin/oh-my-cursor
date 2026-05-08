---
name: omc-migration-checklist
description: Produces a migration checklist for schema, API, dependency, platform, config, or architecture changes with compatibility, rollback, and verification called out explicitly.
metadata:
  category: delivery
---

# omc-migration-checklist

## Overview

Use this skill when the hard part is moving from one state to another safely. A migration checklist should make sequencing, compatibility windows, rollback points, and proof obligations visible before rollout.

## When to use

- Schema or data migrations
- API contract or client compatibility changes
- Dependency, platform, or config transitions
- Architecture shifts that cannot be landed atomically

## When not to use

- A local implementation change with no compatibility or rollout impact
- A release checklist that is broader than the migration itself

## Workflow

1. Name the boundary.
   Define current state, target state, and who or what is affected.

2. Define the compatibility window.
   State whether old and new states must coexist and for how long.

3. Sequence the steps.
   Order preparation, dual-write or compatibility work, cutover, and cleanup.

4. Add proof points.
   Each risky step needs a verification check.

5. Define rollback.
   Name the last safe revert point before irreversible actions.

6. Call out unresolved risk.
   Surface data loss, downtime, client lag, or dependency drift explicitly.

## Common rationalizations

| Rationalization | Reality |
| --- | --- |
| "We'll clean up the old path later." | Zombie compatibility layers become permanent if cleanup is not planned. |
| "Rollback probably won't be needed." | The checklist exists precisely because the change is risky. |
| "The sequence is obvious." | Hidden ordering assumptions are where migrations fail. |
| "Clients will update quickly." | Compatibility assumptions must be stated, not hoped for. |

## Red flags

- No coexistence or compatibility story
- Irreversible steps are mixed with reversible ones
- Rollback starts after the dangerous point
- Verification is global instead of step-specific
- Cleanup of temporary compatibility code is missing

## Verification

Before finishing the migration checklist, confirm:

- [ ] Current and target states are explicit
- [ ] Compatibility window is defined
- [ ] Steps are ordered and risky transitions are called out
- [ ] Verification exists for each meaningful risk
- [ ] Rollback is concrete and timely
