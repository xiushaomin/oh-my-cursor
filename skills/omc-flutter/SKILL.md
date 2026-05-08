---
name: omc-flutter
description: Flutter domain skill for Dart widgets, state boundaries, platform bridges, rendering performance, and cross-platform mobile delivery.
metadata:
  category: pack
---

# omc-flutter

## Overview

Use this pack skill when the work lives in Flutter UI, Dart state-management surfaces, or platform-bridge boundaries.

## When to use

- Widget tree or screen-level changes
- State-management or async UI flow work
- Platform channel or plugin-boundary changes
- Flutter test or launch-surface validation

## When not to use

- Native iOS or Android work without Flutter surfaces
- Web-only frontend work

## Focus

- Keep widgets small and state boundaries clear
- Respect the repo's chosen state-management shape
- Watch rebuild scope, jank, and plugin boundaries
- Keep loading, error, and empty states explicit

## Minimum verification

- Run `flutter analyze` or the repo's equivalent when available
- Run tests if the repo supports them
- Confirm the critical flow launches on at least one target platform
