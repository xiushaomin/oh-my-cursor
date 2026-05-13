# Skill Output Contracts

Use these contracts when a workflow needs a stable artifact that another skill, hook, evaluator, or reviewer can consume.

## Current Workflow Contracts

These contracts mirror `config/workflows.json`.

- `omc-brainstorm`
  Fields: `problem_frame`, `options`, `recommendation`, `open_decisions`, `plan_seed`

- `omc-spec`
  Fields: `intent`, `constraints`, `acceptance_criteria`, `quality_contract`, `open_questions`

- `omc-plan`
  Fields: `plan`, `acceptance_criteria`, `dependencies`, `risks`

- `omc-develop`
  Fields: `scope`, `changes`, `checks_run`, `blocked_on`, `handoff`

- `omc-verify`
  Fields: `scope`, `risks`, `automated_tests`, `manual_checks`, `check_targets`, `coverage_gaps`

- `omc-review`
  Fields: `findings`, `severity`, `residual_risks`, `checks_run`, `handoff`

- `omc-architecture`
  Fields: `context`, `constraints`, `options`, `decision`, `rejected`, `migration_plan`, `verification`

- `omc-parallel`
  Fields: `status`, `plan`, `delegations`, `risks`, `verification`, `handoffs`

- `omc-debug`
  Fields: `root_cause`, `evidence`, `fix`, `tests`

- `omc-learn`
  Fields: `trigger`, `evidence`, `lesson`, `prevention_assets`, `follow_ups`

## Contract Rules

- Keep field names stable.
- Prefer short, concrete entries over prose blobs.
- If evidence is missing, include the field and state the gap explicitly.
- Keep human-owned release, source-control, and operational notes inside `handoff` fields instead of creating standalone workflow surfaces.
- Keep migration strategy inside `omc-architecture` and implementation proof inside `omc-verify` or `omc-develop`.
