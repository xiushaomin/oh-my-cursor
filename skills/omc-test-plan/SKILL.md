---
name: omc-test-plan
description: Builds a focused verification plan with regression targets, automated checks, manual checks, and risk-based coverage priorities. Use before implementation, after implementation, or during review when the question is "what should prove this works?"
metadata:
  category: delivery
---

# omc-test-plan

## Overview

Use this skill to turn changed behavior into proof obligations. A good test plan maps the claim being made, the risks worth covering, and the smallest checks that would catch an expensive regression.

## When to use

- Before implementation to shape verification early
- After implementation to identify missing coverage
- During review when a change needs a clearer proof strategy
- When a risky path needs regression-focused testing instead of generic test sprawl

## When not to use

- The task is pure brainstorming with no concrete behavior yet
- The user needs the actual implementation or test code more than the plan

## Workflow

1. Define the claim.
   State what behavior, invariant, or user-visible promise needs proof.

2. Identify the risks.
   Separate correctness, trust-boundary, performance, and UX risks when relevant.

3. Group the proof.
   Split checks into automated tests, static checks, and manual validation.

4. Prioritize the smallest strong checks.
   Prefer targeted regression protection over broad low-signal coverage.

5. Name commands and artifacts.
   When possible, point to exact test files, commands, flows, or inspection targets.

6. Call out gaps.
   If a claim cannot be proven cheaply, say so explicitly.

## Common rationalizations

| Rationalization | Reality |
| --- | --- |
| "We'll know if it breaks." | Hope is not a verification strategy. |
| "More tests is always better." | More weak tests can be worse than one strong regression check. |
| "Manual testing is enough here." | Some risks need automation or they will regress quietly. |
| "The exact commands don't matter." | Concrete commands make the plan reusable and reviewable. |

## Red flags

- The plan lists tools but not behaviors to prove
- Important risks are not prioritized
- Coverage is broad but shallow
- Manual checks are vague or unrepeatable
- Gaps are hidden instead of named

## Verification

Before finishing the test plan, confirm:

- [ ] The behavior or invariant to prove is explicit
- [ ] High-risk paths are prioritized
- [ ] Automated, static, and manual checks are separated where useful
- [ ] Commands or artifacts are named when known
- [ ] Coverage gaps are explicit
