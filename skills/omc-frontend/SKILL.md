---
name: omc-frontend
description: Web frontend domain skill for React, Next.js, and TypeScript UI work. Use when editing components, app routes, client data flows, styling systems, accessibility-sensitive UI, or frontend tests.
metadata:
  category: pack
---

# omc-frontend

## Overview

Use this pack skill when the work lives in a web UI surface. The goal is to keep component boundaries, data flow, accessibility, and design-system consistency aligned with the repo.

## When to use

- React or Next.js UI work
- Component, page, or route-layer changes
- Client data-loading, mutation, or cache interaction work
- Frontend-focused tests or accessibility-sensitive flows

## When not to use

- React Native or Expo work
- Pure backend or infrastructure work

## Focus

- Reuse existing UI primitives and design-system patterns
- Keep rendering and data responsibilities legible
- Make loading, empty, success, and error states explicit
- Treat accessibility and keyboard behavior as part of feature correctness

## Minimum verification

- Run lint or typecheck when available
- Smoke the primary flow and one meaningful failure state
- If UI changed, confirm basic keyboard and labeling sanity
