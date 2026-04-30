---
name: omc-incident-report
description: Write a structured incident or debug report with timeline, impact, root cause, fix, verification, and prevention.
metadata:
  category: delivery
---

# omc-incident-report

## Goal
- Convert debugging evidence into a clear incident/debug report.

## When to use
- After a production issue, regression, flaky failure, or root-cause investigation.
- When the user needs a handoff for stakeholders or future maintainers.

## Protocol
1. Record symptoms, impact, and timeline.
2. Separate confirmed evidence from hypotheses.
3. State root cause and fix.
4. List verification and prevention follow-ups.

## Delegation
- Use `debug-investigator` for root-cause evidence.
- Use `docs-maintainer` when the report should be stored in repo docs.

## Output contract
- `impact`, `timeline`, `root_cause`, `fix`, `verification`, `prevention`.
