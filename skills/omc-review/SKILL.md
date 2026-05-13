---
name: omc-review
description: Review existing changes for correctness, risk, and missing proof. Use when the user wants findings, severity, and verification gaps rather than code changes after implementation.
metadata:
  category: workflow
---

# omc-review

## Overview

Inspect a change as a reviewer, not as an implementer. The primary output is concrete findings tied to evidence, plus the smallest useful tests that would confirm or disprove risk.

## When to use

- After implementation and before merge or handoff
- When the user asks for code review, audit, walkthrough, or risk assessment
- When a change affects security, data, UX, or compatibility and needs a second pass

## When not to use

- There is no artifact, diff, or file scope to review
- The user wants implementation rather than findings
- The task is primarily planning or debugging

## Repo-first discovery

- Read the diff, target files, and nearby patterns before forming findings.
- Identify which checks already ran so review can focus on unproven risk.
- Prefer repo-local trust boundaries and conventions over generic style opinions.

## Workflow

1. Map the review target.
   Identify the intended goal, changed surfaces, and verification already present.

2. Review for correctness.
   Check edge cases, failure paths, state transitions, concurrency, and scope mismatch.

3. Review for trust-boundary risk.
   Inspect auth, validation, secret handling, file/shell/network usage, and external integration safety.
   Pull from [`../../references/security-checklist.md`](../../references/security-checklist.md) when needed.

4. Review for performance and UX risk.
   Inspect rendering/query shape, payload size, latency states, loading/error handling, and platform fit.
   Pull from [`../../references/performance-checklist.md`](../../references/performance-checklist.md), [`../../references/accessibility-checklist.md`](../../references/accessibility-checklist.md), and [`../../references/frontend-review-prompts.md`](../../references/frontend-review-prompts.md) when relevant.

5. Review for verification gaps.
   Ask what tests, checks, or manual proofs are missing.
   Pull from [`../../references/testing-checklist.md`](../../references/testing-checklist.md), [`../../references/mobile-verification-prompts.md`](../../references/mobile-verification-prompts.md), or [`../../references/backend-verification-prompts.md`](../../references/backend-verification-prompts.md) when deeper coverage guidance is needed.

6. Report findings only.
   Lead with severity-ordered issues. Keep summary secondary.

7. Close with handoff notes.
   Include only the minimal summary and next workflow routing that the evidence supports.

## Output contract

- `findings`: severity-ordered, evidence-backed issues
- `severity`: the rating for each meaningful issue
- `residual_risks`: what remains unproven or unreviewed
- `checks_run`: existing or newly run checks that informed the review
- `handoff`: concise summary, human follow-ups, or next workflow routing

## Guardrails

- Findings come before summary.
- Tie every meaningful issue to evidence.
- Name the smallest useful follow-up test.
- Do not turn review into implementation or release choreography.

## On-demand references

- Pull from [`../../references/workflow-review.md`](../../references/workflow-review.md) when the findings-first pass needs a stronger quality bar.
- Pull from [`../../references/security-checklist.md`](../../references/security-checklist.md) when trust-boundary risk is central.
- Pull from [`../../references/testing-checklist.md`](../../references/testing-checklist.md), [`../../references/mobile-verification-prompts.md`](../../references/mobile-verification-prompts.md), or [`../../references/backend-verification-prompts.md`](../../references/backend-verification-prompts.md) when proof gaps need more depth.
