# Routing Smoke Queries

Use these prompts as a manual regression set when updating skill descriptions or router heuristics.

## Should trigger `omc-brainstorm`

- We have three ways to price this feature. Help us compare options before we commit.
- Brainstorm a few UX directions for onboarding without choosing implementation yet.

## Should trigger `omc-spec`

- Write a lightweight spec for this feature before we plan implementation.
- Capture scope, constraints, and acceptance criteria for this cross-team change.

## Should trigger `omc-plan`

- Turn this feature request into milestones, risks, and acceptance criteria.
- Plan the rollout for a multi-file change before we start coding.

## Should trigger `omc-develop`

- Implement this scoped feature and verify the result locally.
- Make the code change, keep the diff tight, and hand back what was proven.

## Should trigger `omc-verify`

- Map this behavior to the smallest useful proof plan.
- Identify the highest-value checks and coverage gaps for this change.

## Should trigger `omc-debug`

- The login flow regressed after yesterday's refactor. Find the root cause.
- Why does this test fail only in CI?

## Should trigger `omc-review`

- Review this diff for correctness and missing tests.
- Audit this change for security and compatibility risks.

## Should trigger `omc-parallel`

- Split this cross-platform change into bounded parallel lanes.
- Use multiple specialist lanes, then integrate and verify the result.

## Should trigger `omc-learn`

- Turn this regression into durable prevention guidance.
- Capture the lesson from these repeated review findings.

## Should not auto-trigger orchestration

- Rename this prop.
- Fix the typo in the button label.
- Explain what this helper does.
- Walk me through this one step at a time.
