---
name: omc-frontend
description: Frontend skill for React, Next.js, and TypeScript UI work. Use when changing components, routes, client data flow, styling systems, accessibility-sensitive UI, or frontend tests.
metadata:
  category: pack
---

# omc-frontend

## Overview

Use this skill for web UI work in React or Next.js surfaces.

## When to use

- Component, route, or page changes
- Client data flow or mutation behavior
- Styling, accessibility, or frontend verification work

## Repo-first discovery

- Find the owning route, component boundary, and UI primitives before changing anything.
- Reuse repo-local data-flow and testing patterns before reaching for generic framework advice.

## Default deliverable

- Name the affected UI boundary.
- State the data-flow or state pattern being preserved.
- State the primary verification path.

## On-demand references

- Pull from [`../../references/skill-repo-discovery.md`](../../references/skill-repo-discovery.md) when local ownership is unclear.
- Pull from [`../../references/frontend-review-prompts.md`](../../references/frontend-review-prompts.md), [`../../references/accessibility-checklist.md`](../../references/accessibility-checklist.md), and [`../../references/performance-checklist.md`](../../references/performance-checklist.md) for deeper review and verification.
