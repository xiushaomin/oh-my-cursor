---
name: omc-android
description: Android work — Kotlin, Jetpack, Compose/Views, lifecycle, and instrumentation tests.
metadata:
  category: pack
---

# omc-android

## Goal
- Deliver Android changes with correct lifecycle/threading and repo-aligned architecture.

## Focus
- Gradle module boundaries, threading, and performance on real devices.
- Prefer project conventions over generic samples.

## Verify (minimum)
- Build (Gradle) + unit tests where available.
- If UI change: basic navigation + rotation/background/restore sanity.

## Delegation
- Implementation: `android-engineer` subagent.
