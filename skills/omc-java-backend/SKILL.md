---
name: omc-java-backend
description: Backend skill for Java and Spring-style service work. Use when changing controllers, services, repositories, persistence, validation, transactions, or backend verification.
metadata:
  category: pack
---

# omc-java-backend

## Overview

Use this skill for Java service, API, and persistence work.

## When to use

- Controller, service, DTO, or repository changes
- Endpoint, validation, transaction, or query-shape work
- Backend-focused verification

## Repo-first discovery

- Find the owning controller, service, repository, and test surface first.
- Reuse repo-local transaction, validation, and error-shaping patterns.

## Default deliverable

- Name the affected API or service boundary.
- State the validation, persistence, or transaction behavior involved.
- State the strongest verification path available in the repo.

## On-demand references

- Pull from [`../../references/skill-repo-discovery.md`](../../references/skill-repo-discovery.md) when service ownership is unclear.
- Pull from [`../../references/backend-verification-prompts.md`](../../references/backend-verification-prompts.md), [`../../references/security-checklist.md`](../../references/security-checklist.md), and [`../../references/testing-checklist.md`](../../references/testing-checklist.md) for deeper verification.
