# Backend Verification Prompts

Use these prompts when backend/API changes need stronger proof than the core skill body can hold.

## Contract correctness

- Which request and response paths changed?
- What is the expected behavior for validation failures, missing records, conflicts, and auth failures?
- Are error semantics stable for existing clients?

## Data and transaction safety

- Did transaction boundaries or query shape change?
- Is there any new N+1, lock, rollback, or partial-write risk?
- Are migrations, seeds, or feature flags part of the proof surface?

## Operational confidence

- What log, metric, or trace evidence would confirm the change in production?
- What integration check is still missing?
