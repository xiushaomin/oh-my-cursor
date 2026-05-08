---
name: omc-scm
description: Safe source-control workflow for branch strategy, staging, commits, and handoff hygiene. Use when the user wants help with commits, PR prep, branch shape, or other git coordination tasks.
disable-model-invocation: true
metadata:
  category: workflow
---

# omc-scm

## Overview

Use this skill to keep source-control actions intentional, reviewable, and safe. The core job is to shape the change set cleanly, avoid destructive surprises, and make commits explain why the work exists.

## When to use

- Commit and staging help
- Branch planning and PR prep
- Cherry-pick, merge, or rebase risk assessment
- Handoff hygiene for multi-step or multi-agent work

## When not to use

- The user is asking for implementation rather than git workflow help
- Destructive history rewriting is being considered without explicit user intent

## Workflow

1. Inspect the state.
   Review status, changed files, and recent history before touching staging.

2. Define inclusion boundaries.
   Decide what belongs in this commit or branch and what does not.

3. Shape the commit plan.
   Prefer small, purpose-driven commits with a clear why.

4. Stage narrowly.
   Include only the files relevant to the intended unit of change.

5. Commit and re-check.
   Verify the tree state after the commit and call out anything intentionally left out.

## Common rationalizations

| Rationalization | Reality |
| --- | --- |
| "I'll just commit everything so nothing gets lost." | Mixed commits make review and rollback harder. |
| "Force push is probably fine." | Destructive operations need explicit user intent. |
| "The commit message can describe what changed." | The most valuable message explains why the change exists. |
| "Branch shape doesn't matter for a small change." | Even small changes benefit from clean inclusion boundaries. |

## Red flags

- Unrelated files are staged together
- The branch or commit strategy is implicit
- Destructive commands appear as casual cleanup
- Secret or environment files are near the staging surface
- The message describes mechanics but not intent

## Verification

Before finishing SCM work, confirm:

- [ ] Inclusion boundaries are explicit
- [ ] Only relevant files are staged
- [ ] The commit strategy is reviewable
- [ ] Risky operations were avoided or explicitly requested
- [ ] Tree state was re-checked after the action
