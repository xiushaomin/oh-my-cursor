---
name: omc-plan
description: Turns a goal into an execution-ready plan with assumptions, milestones, risks, ownership, and verification. Use when the work is multi-step, crosses modules, or needs explicit acceptance criteria before implementation.
metadata:
  category: workflow
---

# omc-plan

## Overview

Use this skill to turn intent into an execution-ready plan before implementation starts. A good plan makes scope, dependencies, verification, and ownership visible early enough to avoid expensive rework.

## When to use

- The task spans multiple files, modules, or stages
- Requirements are mostly clear but execution shape is not
- The user wants milestones, sequencing, or dependency mapping
- A design or rollout decision could make later work expensive to reverse

## When not to use

- The task is a tiny local change with obvious scope
- The user wants brainstorming before committing to a path
- The user wants step-by-step supervised execution instead of a full plan

## Workflow

1. Define the outcome.
   State the goal, user impact, and explicit non-goals.

2. Surface assumptions.
   Name the assumptions that could change the plan if they are wrong.

3. Map the work.
   Break the change into 2-6 milestones. Each milestone should produce a meaningful checkpoint, not just a bucket of activity.

4. Name ownership and ordering.
   For each major task, say whether it belongs to the parent agent or a focused specialist lane, and identify dependencies.

5. Build acceptance criteria.
   Each milestone needs verifiable conditions that prove completion.

6. Add risk and verification.
   Name the highest-risk step, mitigation strategy, and what commands, tests, or manual checks would prove the plan worked.

7. Stop at the plan boundary.
   Present the plan cleanly enough that implementation can start without re-discovering the task shape.

## Common rationalizations

| Rationalization | Reality |
| --- | --- |
| "This is small enough to just start coding." | If the work crosses files or behaviors, a short plan saves more time than it costs. |
| "I already know what to do." | A private mental plan is not a shared execution contract. |
| "I'll figure out tests after implementation." | Verification shape is part of the plan, not an afterthought. |
| "Milestones are overhead." | Milestones are how we keep progress reviewable and recoverable. |

## Red flags

- Tasks are listed without acceptance criteria
- Dependencies are implied instead of named
- The plan mixes execution detail with unresolved product choices
- Risks are omitted because the path "seems straightforward"
- The plan is too vague to tell what proves success

## Verification

Before concluding the planning step, confirm:

- [ ] Goal and non-goals are explicit
- [ ] Assumptions that could materially change execution are named
- [ ] Milestones are ordered and reviewable
- [ ] Acceptance criteria are verifiable
- [ ] Risks and mitigation are called out
- [ ] The verification plan names concrete checks or commands when known
