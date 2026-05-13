---
name: omc-spec
description: Write a lightweight spec before planning broad or risky work. Use when the task needs intent, constraints, acceptance criteria, and a quality contract before implementation planning.
metadata:
  category: workflow
---

# omc-spec

## Overview

Use this skill when the work is too consequential for a loose prompt but not yet ready for implementation. A good spec captures intent, boundaries, acceptance criteria, and quality expectations without turning into a heavyweight document.

## When to use

- The feature crosses multiple user-visible or technical surfaces
- Requirements are clear enough to write down but not clear enough to implement
- The work has compatibility, security, data, or UX risk
- `omc-brainstorm` has produced a recommended direction that needs a stable handoff

## When not to use

- The task is small enough for `omc-develop`
- The real question is architectural shape, which belongs in `omc-architecture`
- The user needs options rather than commitment, which belongs in `omc-brainstorm`

## Repo-first discovery

- Read existing product docs, rules, tests, and nearby implementation before writing requirements.
- Reuse the repo's terminology and boundaries.
- Make assumptions explicit when the repo does not contain enough context.

## Workflow

1. State the target outcome and audience.
2. Name scope boundaries, constraints, dependencies, and assumptions.
3. Write observable acceptance criteria.
4. Add the quality contract that should shape planning.
5. End with only the open questions that materially block progress.

## Output contract

- `intent`: target outcome and audience
- `constraints`: scope boundaries, non-goals, dependencies, and assumptions
- `acceptance_criteria`: observable completion criteria
- `quality_contract`: verification and quality expectations
- `open_questions`: unresolved decisions that block planning or implementation

## Guardrails

- Keep the document lightweight and execution-facing.
- Do not mix multiple directions into one spec.
- Keep acceptance criteria observable.
- Only include open questions that materially affect planning or implementation.

## On-demand references

- Pull from [`../../references/workflow-spec.md`](../../references/workflow-spec.md) when the spec needs a stronger shape or quality bar.
- Pull from [`../../references/skill-output-contracts.md`](../../references/skill-output-contracts.md) to keep the spec handoff stable.
- Pull from [`../../references/skill-repo-discovery.md`](../../references/skill-repo-discovery.md) when local product or implementation context is thin.
