---
name: omc-learn
description: Convert incidents, regressions, or repeated findings into durable prevention assets. Use when the task should end with reusable rules, references, evals, or follow-up guidance.
metadata:
  category: workflow
---

# omc-learn

## Overview

Use this skill when the work should leave behind reusable knowledge. Convert evidence into prevention: rules, skill updates, references, evals, scripts, or follow-up tasks that reduce repeat failures.

## When to use

- After a severe regression, incident, or debugging investigation
- When review finds the same class of issue repeatedly
- When a repo convention or verification gap should become durable guidance
- When a handoff needs prevention actions rather than release authority

## When not to use

- The root cause is still speculative and investigation should stay in `omc-debug`
- The main need is implementation, which belongs in `omc-develop`
- The output would only be a human checklist with no durable repo asset

## Repo-first discovery

- Pull from actual findings, logs, diffs, tests, and review notes before drafting lessons.
- Distinguish what local evidence proved from what remains inferred.
- Prefer durable project assets over one-off narrative summaries.

## Workflow

1. State the trigger and the evidence behind it.
2. Separate what is proven from what is inferred.
3. Explain the lesson in reusable terms.
4. Choose the prevention asset that should capture it.
5. End with explicit follow-up or ownership.

## Output contract

- `trigger`: the incident, regression, review pattern, or debugging result
- `evidence`: facts, files, checks, or observations that support the lesson
- `lesson`: the reusable insight or failure mode
- `prevention_assets`: rules, skills, references, evals, scripts, or config to update
- `follow_ups`: remaining actions, owners, or blockers

## Guardrails

- Do not mix facts with guesses.
- Do not stop at a narrative summary if a durable asset is needed.
- Keep prevention concrete.
- Do not recreate release or incident-management ceremony as a fake workflow.

## On-demand references

- Pull from [`../../references/workflow-learn.md`](../../references/workflow-learn.md) when the prevention artifact needs a stronger bar.
- Pull from [`../../references/skill-output-contracts.md`](../../references/skill-output-contracts.md) when the lesson feeds another workflow artifact.
- Pull from [`../../references/skill-repo-discovery.md`](../../references/skill-repo-discovery.md) when it is unclear where a prevention asset belongs.
