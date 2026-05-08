# Testing checklist

Use this reference when a workflow needs deeper verification guidance than the core skill body should carry.

## Core questions

- What user-visible claim is this change making?
- Which invariant must never regress?
- What is the smallest automated check that would catch the most expensive failure?

## Coverage shape

- Unit tests for logic, branching, parsing, validation, and edge cases
- Integration tests for module boundaries, persistence, API behavior, and state transitions
- UI or end-to-end checks for critical user flows and wiring
- Static checks for type, lint, formatting, and schema drift where relevant

## Good habits

- Prefer one targeted regression test over many vague tests
- Add tests near the behavior they protect
- Name tests after the behavior or invariant, not the implementation detail
- Cover happy path and at least one meaningful failure mode

## Red flags

- Tests that only snapshot structure without asserting behavior
- Re-running the same command without code changes just for reassurance
- Adding broad end-to-end coverage where a small integration test would prove the claim better
- Leaving new behavior with no proof beyond manual belief
