---
name: omc-release-checklist
description: Builds a release-readiness checklist covering verification, docs, rollout, rollback, migration, and owner handoff. Use before deployment, app submission, or any change set that needs a clear go/no-go frame.
metadata:
  category: delivery
---

# omc-release-checklist

## Overview

Use this skill to turn a finished change set into a release decision surface. The checklist should separate blockers from follow-ups and make rollout and rollback expectations visible.

## When to use

- Before release or deployment
- Before store submission or platform rollout
- When a change touches migrations, multiple domains, or production-critical paths

## When not to use

- The work is still in active implementation and not close to handoff
- The need is only for a PR summary or local test plan

## Workflow

1. Define scope.
   State what is shipping and who or what it affects.

2. Collect must-pass checks.
   Include code, product, operational, and documentation checks where relevant.

3. Separate blockers from follow-ups.
   Make the go/no-go line explicit.

4. Define rollout shape.
   Say whether the release is staged, feature-flagged, coordinated, or all-at-once.

5. Define rollback shape.
   Name the trigger and the reversal path.

6. Assign handoff clarity.
   Make owners and post-release expectations visible when known.

## Common rationalizations

| Rationalization | Reality |
| --- | --- |
| "Most of this is implied." | Releases fail on implied coordination and forgotten checks. |
| "Docs can wait until after release." | Missing docs and rollout notes are release risk, not polish work. |
| "Rollback is just revert the code." | That is often false once data, flags, or clients are involved. |
| "Everything here is important." | If blockers and follow-ups are not separated, nothing is actionable. |

## Red flags

- Scope is vague
- Blockers are mixed with nice-to-haves
- Rollout and rollback are absent
- Ownership is unclear
- Production risk is described emotionally instead of operationally

## Verification

Before finishing the release checklist, confirm:

- [ ] Scope and impacted surfaces are explicit
- [ ] Must-pass checks are separated from follow-ups
- [ ] Rollout plan is visible
- [ ] Rollback trigger and path are named
- [ ] Ownership or handoff notes exist when relevant
