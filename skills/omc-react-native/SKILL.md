---
name: omc-react-native
description: React Native and Expo implementation — navigation, native modules, performance, and JS/native boundaries. Use when the user works on RN/Expo apps, Metro, or cross-platform mobile UI with React Native.
metadata:
  category: pack
---

# omc-react-native

## Goal
- Ship RN/Expo changes without breaking JS/native boundaries; verify on target platforms.

## When to use
- React Native or Expo feature work, refactors, or debugging.
- Issues involving native modules, bridges, or platform-specific behavior.

## When not to use
- Pure web-only frontend — prefer `/omc-frontend`.
- Pure native iOS/Android without RN — prefer `/omc-ios` or `/omc-android`.

## Core flow
1. **Clarify** — app shell (Expo vs bare), navigation, state library, and target platforms.
2. **Plan** — list impacted native + JS surfaces and test strategy.
3. **Implement** — keep changes scoped; respect JS/native boundaries.
4. **Verify** — run relevant RN tests or manual checks; call out simulator/device gaps.

## Verify (minimum)
- Metro build starts; app launches.
- iOS + Android smoke (simulator ok; note if device not tested).
- If native module touched: verify both platforms or explicitly mark risk.

## Cursor-native rules
- Prefer `/react-native-engineer` and `/mobile-qa-reviewer` for heavy implementation and mobile QA.
- Prefer **Skills + Subagents** inside Cursor; do not rely on external CLIs as the primary runtime.

## Output contract
- `status`, `files_changed`, `checks_run`, `risks`, `handoffs`.
