---
name: omc-work
description: Guided step-by-step execution with explicit checkpoints. Use when the user wants close control, incremental progress, or one decision at a time instead of broad autonomous execution.
disable-model-invocation: true
metadata:
  category: workflow
---

# omc-work

## Overview

Use this skill when the right pace is deliberate, visible, and collaborative. The point is not to slow work down; the point is to keep each step small enough that the next decision stays clear.

## When to use

- The user asks for step-by-step or guided execution
- The task is risky and the user wants tight control
- Requirements are still settling and short loops will converge faster
- The best next move is a small reversible action

## When not to use

- The task needs multi-lane orchestration
- The user asked for a review rather than implementation
- The user wants a full plan before any action

## Workflow

1. Restate the immediate goal.
   Keep it to the current step, not the whole project.

2. Propose exactly one next step.
   That step should be reviewable quickly and should not hide multiple decisions.

3. Execute only that step.
   Do not pull in adjacent cleanup, refactors, or speculative work.

4. Verify the step.
   Use the smallest meaningful check for the change.

5. Report what changed and what is now true.
   Then offer at most two reasonable next options.

6. Repeat.
   Keep the loop short until the user or the workflow naturally graduates to broader execution.

## Common rationalizations

| Rationalization | Reality |
| --- | --- |
| "While I'm here, I should fix these nearby issues too." | This workflow exists to prevent scope creep and hidden coupling. |
| "The next three steps are obvious, I'll just do them together." | If the user chose guided execution, collapsing steps defeats the point. |
| "I don't need to verify such a small change." | Small steps are only safe if each one is proven. |
| "Parallel subagents would be faster." | Not in a mode designed for tight control and frequent checkpoints. |

## Red flags

- A single step touches multiple concerns
- The update cannot be reviewed in under a couple of minutes
- Verification is deferred until later
- New scope appears without an explicit user request
- More than two next options are presented

## Verification

Before moving to the next step, confirm:

- [ ] Only one logical change was made
- [ ] The current step was verified with evidence
- [ ] The user can understand exactly what changed
- [ ] The next options are narrow and actionable
