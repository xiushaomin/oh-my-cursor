---
name: omc-incident-report
description: Converts debugging or production failure evidence into a clear incident report with impact, timeline, root cause, remediation, verification, and prevention follow-ups.
metadata:
  category: delivery
---

# omc-incident-report

## Overview

Use this skill when the work needs to leave behind an understandable record. A good incident report separates facts from hypotheses, documents the actual fix, and preserves lessons that reduce repeat failures.

## When to use

- After a production issue or severe regression
- After a debugging investigation that needs team handoff
- When stakeholders need a clear summary of impact and resolution

## When not to use

- The root cause is still speculative and the investigation is not mature enough to summarize
- The user only needs a quick PR or release summary

## Workflow

1. Record impact.
   State who was affected, what broke, and how severe it was.

2. Build the timeline.
   Capture discovery, key observations, mitigation, and resolution milestones.

3. Separate evidence from inference.
   Clearly distinguish confirmed facts from earlier hypotheses.

4. State root cause and remediation.
   Explain why the issue occurred and what changed to stop it.

5. Capture verification and prevention.
   Include how the fix was proven and what follow-up reduces recurrence risk.

## Common rationalizations

| Rationalization | Reality |
| --- | --- |
| "Everyone already knows what happened." | Shared memory degrades quickly; written records preserve operational learning. |
| "The timeline doesn't need detail." | Timing is often how teams understand detection and response gaps. |
| "A vague prevention section is enough." | Follow-up only matters if it is concrete. |
| "The root cause is obvious now." | It should still be written down precisely. |

## Red flags

- Facts and guesses are mixed together
- Impact is minimized or missing
- Timeline skips the key decision points
- Verification is absent from the report
- Prevention items are slogans instead of actions

## Verification

Before finishing the incident report, confirm:

- [ ] Impact is explicit
- [ ] Timeline is coherent
- [ ] Evidence is separated from inference
- [ ] Root cause and remediation are concrete
- [ ] Verification and prevention are included
