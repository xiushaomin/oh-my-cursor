---
name: omc-flutter
description: Flutter/Dart — widgets, state, platform channels, and cross-platform constraints.
metadata:
  category: pack
---

# omc-flutter

## Goal
- Ship Flutter changes with minimal rebuild/jank, correct state, and safe platform bridges.

## Focus
- Widget composition, state management aligned with the repo, and platform bridges.
- Performance: rebuild scope, jank, and plugin boundaries.

## Verify (minimum)
- `flutter analyze` + tests if repo has them.
- App launches; critical flow smoke on at least one platform.

## Delegation
- Implementation: `flutter-engineer` subagent.
