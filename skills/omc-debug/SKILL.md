---
name: omc-debug
description: Structured debugging workflow for reproducing failures, ranking hypotheses, gathering evidence, applying the smallest fix, and proving the regression is covered.
metadata:
  category: workflow
---

# omc-debug

## Overview

Use this skill to find the actual root cause instead of bouncing between guesses. Good debugging narrows uncertainty, proves the failure mode, and leaves behind a regression guard whenever practical.

## When to use

- A test, build, runtime flow, or user-visible behavior is failing
- The user asks why something broke or stopped working
- The issue is flaky, regressed, or difficult to localize
- A minimal safe fix matters more than broad cleanup

## When not to use

- The task is mainly design or planning
- The behavior is not actually wrong and the user wants a review or explanation

## Workflow

1. Capture the symptom.
   State what happened, what was expected, and the exact error text or observed behavior.

2. Reproduce it.
   Find the smallest reliable repro. If full reproduction is not possible, define the best available evidence path.

3. Rank hypotheses.
   Generate 2-3 plausible causes and prioritize them by likelihood and blast radius.

4. Gather targeted evidence.
   Use logs, existing tests, focused instrumentation, or code inspection to eliminate or confirm hypotheses.

5. State the root cause plainly.
   Use a concrete explanation in the form "Because X, Y happens."

6. Apply the smallest safe fix.
   Prefer a narrow correction over opportunistic refactoring.

7. Add or update regression coverage when practical.
   One focused regression check is better than many vague tests.

8. Re-run the proof.
   Verify the repro path and the most relevant targeted checks.

## Common rationalizations

| Rationalization | Reality |
| --- | --- |
| "I have a likely fix, I'll just try it." | A likely fix without a root cause often creates a second bug. |
| "The repro is annoying, I'll debug from memory." | Without a repro or evidence path, you are guessing. |
| "I already changed two things, one of them must have fixed it." | Multi-variable debugging makes future regressions harder to diagnose. |
| "A broad refactor will probably solve this class of issues." | Debugging should reduce uncertainty first, not increase scope. |

## Red flags

- Multiple fixes are attempted before the failure mode is understood
- The exact symptom is never written down
- The investigation expands because no hypothesis was ranked
- Verification relies on "seems fine now"
- No regression guard is added for an important fix

## Verification

Before closing the debugging loop, confirm:

- [ ] The symptom and expected behavior are explicit
- [ ] There is a concrete repro path or clearly stated evidence substitute
- [ ] The root cause is evidence-backed
- [ ] The fix is the smallest reasonable correction
- [ ] Relevant checks were rerun after the fix
- [ ] Regression coverage was added or its absence is explained
