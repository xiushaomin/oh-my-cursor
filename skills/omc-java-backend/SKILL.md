---
name: omc-java-backend
description: Java backend domain skill for Spring-style services, APIs, persistence, validation, transactions, and observability-aware server work.
metadata:
  category: pack
---

# omc-java-backend

## Overview

Use this pack skill when the work is primarily in Java service code, API boundaries, persistence logic, or backend verification.

## When to use

- Controller, service, repository, DTO, or validation work
- New or modified endpoints
- Persistence, transaction, or query-shape changes
- Backend tests around business behavior or API behavior

## When not to use

- UI-only work
- Mobile-only work without shared Java backend changes

## Focus

- Keep controller, service, and repository boundaries clear
- Validate inputs near the boundary
- Watch transaction shape, N+1 risk, and error semantics
- Keep observability and failure behavior explicit when it matters

## Minimum verification

- Run build and unit tests when available
- For endpoint changes, verify happy path and error path behavior
- Call out any missing integration coverage
