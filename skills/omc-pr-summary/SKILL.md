---
name: omc-pr-summary
description: Produces a reviewer-friendly PR summary with why the change exists, user impact, implementation notes, verification evidence, and residual risk.
metadata:
  category: delivery
---

# omc-pr-summary

## Overview

Use this skill to turn a change set into a concise handoff for reviewers. The goal is not to restate the diff line by line; it is to explain why the change exists, what behavior matters, and how it was verified.

## When to use

- Before opening a PR
- When handing work to another engineer
- When the user asks for a concise change summary

## When not to use

- The work is still in flux and not ready for review
- The user needs a release or incident artifact instead of a PR handoff

## Workflow

1. State the purpose.
   Explain why the change exists.

2. Separate user impact from implementation detail.
   Reviewers should see behavior first, internals second.

3. Summarize verification.
   Include the strongest checks that were run.

4. Name residual risk.
   Mention known gaps, follow-ups, or compatibility concerns.

## Common rationalizations

| Rationalization | Reality |
| --- | --- |
| "The diff explains itself." | Reviewers still need the why and the proof. |
| "I'll just paste a changelog." | A PR summary should help judgment, not just enumerate files. |
| "Known gaps are obvious." | If they matter, they should be written down. |
| "Verification details are too noisy." | High-signal verification is one of the most useful parts of the summary. |

## Red flags

- Summary is file-by-file instead of purpose-driven
- User impact is buried
- Verification is omitted
- Risks are hidden to sound confident

## Verification

Before finishing the PR summary, confirm:

- [ ] Purpose is clear
- [ ] User impact is separated from implementation notes
- [ ] Verification evidence is included
- [ ] Residual risks or gaps are named when relevant
