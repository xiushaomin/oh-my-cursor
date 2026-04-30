---
name: omc-review
description: Code and design review — security, correctness, maintainability, and tests.
metadata:
  category: workflow
---

# omc-review

## Goal
- Independent “merge readiness” review with actionable findings + suggested tests.

## When to use
- After implementation, before merge/release.
- When user asks “review / audit / security review / PR review / 走查”.

## When NOT to use
- No diff/artifact yet (ask user to provide files/branch/diff).
- User wants implementation, not review.

## Review checklist (concise)
1. **Requirement mapping**: does change match stated goal? scope creep?
2. **Correctness**: edge cases, error paths, concurrency, nullability.
3. **Security**: authz/authn, injection, secrets, unsafe shell/git, OWASP basics.
4. **Performance**: obvious hotspots, N+1, unnecessary renders, large payloads.
5. **A11y/UX** (if UI): keyboard, contrast, loading/error states.
6. **Tests**: what should exist; what is missing; smallest useful additions.

## Delegation
- Prefer QA subagents for deep passes:
  - `frontend-qa-reviewer` / `backend-qa-reviewer` / `mobile-qa-reviewer`
- Parent agent integrates findings; do not rewrite code during review unless user asks “fix it”.

## Output contract
- `summary`, `issues` (severity-tagged), `suggested_tests`, `merge_recommendation`.

## Minimal acceptance structure
- `findings`: concrete issues only, each tied to evidence or file scope.
- `severity`: mark blocker / major / minor.
- `suggested_tests`: smallest useful checks to confirm or disprove risk.
- `residual_risks`: what remains unverified.
