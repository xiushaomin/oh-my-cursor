---
name: omc-debug
description: Diagnose and fix a real failure with evidence. Use when a test, build, runtime flow, or user-visible behavior is broken and the task is root-cause debugging.
metadata:
  category: workflow
---

# omc-debug

## Overview

Find the actual root cause instead of bouncing between guesses. Good debugging narrows uncertainty, proves the failure mode, and leaves behind a regression guard when practical.

## When to use

- A test, build, runtime flow, or user-visible behavior is failing
- The user asks why something broke or stopped working
- The issue is flaky, regressed, or difficult to localize
- A minimal safe fix matters more than broad cleanup

## When not to use

- The task is mainly design or planning
- The behavior is not actually wrong and the user wants a review or explanation

## Repo-first discovery

- Find the failing test, script, log, or user path before proposing fixes.
- Inspect the nearest local implementation and recent changes before leaning on framework recall.
- Prefer the repo's existing verification path over invented reproduction steps.

## Workflow

1. State the symptom, expected behavior, and best available repro.
2. Rank 2-3 plausible causes.
3. Gather targeted evidence until one cause is supported.
4. Apply the smallest safe fix.
5. Re-run the proof path and add regression coverage when practical.

## Output contract

- `root_cause`: the plain-language failure explanation
- `evidence`: repro steps, logs, tests, or inspection results that support the diagnosis
- `fix`: the smallest safe correction
- `tests`: rerun checks and any regression coverage added

## Guardrails

- Do not guess without a repro or evidence path.
- Avoid multi-variable fixes before the failure mode is understood.
- Prefer a narrow correction over cleanup disguised as debugging.
- Re-run the proof after the fix.

## On-demand references

- Pull from [`../../references/workflow-debug.md`](../../references/workflow-debug.md) when the investigation loop needs more structure.
- Pull from [`../../references/skill-output-contracts.md`](../../references/skill-output-contracts.md) when handing the investigation to another workflow.
- Pull from [`../../references/skill-repo-discovery.md`](../../references/skill-repo-discovery.md) when the repro or verification path is unclear.
