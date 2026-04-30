---
name: omc-java-backend
description: Java backend — Spring-style services, APIs, data access, transactions, and observability.
metadata:
  category: pack
---

# omc-java-backend

## Goal
- Build maintainable Java services/APIs with correct layering, validation, and tests.

## Focus
- Layering (controller/service/repo), DTO boundaries, validation.
- Error model (status codes, error bodies), idempotency where needed.
- Transactions, concurrency, and observability (logs/metrics/tracing) when relevant.

## Verify (minimum)
- Build + unit tests; add slice/integration test for new endpoints if repo supports it.
- Validate request/response schemas + error cases.

## Delegation
- Implementation: `java-backend-engineer` subagent.
