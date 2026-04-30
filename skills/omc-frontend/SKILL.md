---
name: omc-frontend
description: Web frontend — React/Next/TypeScript, components, a11y, and frontend testing.
metadata:
  category: pack
---

# omc-frontend

## Goal
- Ship web UI changes that match repo conventions: architecture, styling, a11y, tests.

## Focus
- UI architecture + data-fetching boundaries.
- A11y (keyboard/labels/contrast) and UX states (loading/error/empty).
- Match existing design system and styling choices in repo.

## When NOT to use
- React Native / Expo → `/omc-react-native`.

## Verify (minimum)
- Lint/typecheck if available.
- Smoke check key flows (at least happy path + one error state).
- If UI change: keyboard focus + basic screen reader labels.

## Delegation
- Implementation: `frontend-engineer` subagent.
