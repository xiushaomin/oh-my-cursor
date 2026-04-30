---
name: omc-debug
description: Structured debugging — hypotheses, evidence, minimal repro, and fix verification.
metadata:
  category: workflow
---

# omc-debug

## Goal
- Find **root cause** with evidence. Apply **minimal fix**. Add **regression check**.

## When to use
- Crash/error/stack trace, flaky test, regression, “why failing”.

## Protocol
1. **Symptom**: what happened + what expected. Capture exact error text.
2. **Repro**: smallest repro path (command/steps). If cannot repro: explain why + next best evidence.
3. **Hypotheses**: 2-3 plausible causes; rank by likelihood.
4. **Evidence**: logs, tests, git bisect, targeted instrumentation.
5. **Root cause**: state it as “Because X, Y happens”.
6. **Fix**: smallest change; avoid refactor.
7. **Verify**: rerun repro + relevant tests; note gaps (device/sim/CI).
8. **Stop**: summarize and list follow-ups if any.

## Rules
- No “random try” loops. If two attempts fail, expand evidence.
- Prefer 1 regression test over many.

## Output contract
- `root_cause` (confidence), `fix`, `verification`, `follow_ups`.

## Minimal acceptance structure
- `symptom`: exact failure and expected behavior.
- `root_cause`: evidence-backed explanation.
- `fix`: smallest safe change direction.
- `verification`: repro rerun, targeted tests, or best available check.
- `follow_ups`: remaining gaps or hardening tasks.
