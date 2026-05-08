---
name: omc-review
description: Independent merge-readiness review focused on correctness, security, maintainability, performance, UX risk, and missing verification. Use after implementation or before release when the user wants findings rather than code changes.
metadata:
  category: workflow
---

# omc-review

## Overview

Use this skill to inspect a change as a reviewer, not as an implementer. The primary output is concrete findings tied to evidence, plus the smallest useful tests that would confirm or disprove risk.

## When to use

- After implementation and before merge or release
- When the user asks for code review, audit, walkthrough, or risk assessment
- When a change affects security, data, UX, or compatibility and needs a second pass

## When not to use

- There is no artifact, diff, or file scope to review
- The user wants implementation rather than findings
- The task is primarily planning or debugging

## Workflow

1. Map the review target.
   Identify the intended goal, changed surfaces, and verification already present.

2. Review for correctness.
   Check edge cases, failure paths, state transitions, concurrency, and scope mismatch.

3. Review for trust-boundary risk.
   Inspect auth, validation, secret handling, file/shell/network usage, and external integration safety.
   Pull from [security-checklist.md](/Users/smxiu/Desktop/oh-my-cursor/references/security-checklist.md) when needed.

4. Review for performance and UX risk.
   Inspect rendering/query shape, payload size, latency states, loading/error handling, and platform fit.
   Pull from [performance-checklist.md](/Users/smxiu/Desktop/oh-my-cursor/references/performance-checklist.md) and [accessibility-checklist.md](/Users/smxiu/Desktop/oh-my-cursor/references/accessibility-checklist.md) when relevant.

5. Review for verification gaps.
   Ask what tests, checks, or manual proofs are missing.
   Pull from [testing-checklist.md](/Users/smxiu/Desktop/oh-my-cursor/references/testing-checklist.md) when deeper coverage guidance is needed.

6. Report findings only.
   Lead with severity-ordered issues. Keep summary secondary.

## Common rationalizations

| Rationalization | Reality |
| --- | --- |
| "The code looks clean, so it's probably fine." | Readability is helpful, but review is about behavior and risk. |
| "I'll suggest a refactor instead of naming the bug." | Findings should identify failure risk first, not rewrite style. |
| "There are no tests, so review can't go further." | Missing tests are themselves a review finding. |
| "This issue is probably too small to mention." | If it can cause a regression, confusion, or exploit path, mention it. |

## Red flags

- Findings are vague and not tied to files or behavior
- The review turns into an implementation pass
- Severity is missing or inconsistent
- Missing tests are noted without saying what the smallest useful check would be
- Summary comes before findings

## Verification

Before concluding the review, confirm:

- [ ] Findings are concrete and evidence-backed
- [ ] Severity is stated for each meaningful issue
- [ ] Suggested tests are specific and minimal
- [ ] Residual risk is named when verification is incomplete
- [ ] Summary stays secondary to actionable findings
