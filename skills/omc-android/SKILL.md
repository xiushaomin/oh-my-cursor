---
name: omc-android
description: Android domain skill for Kotlin, Jetpack, Compose or Views, lifecycle-aware state, threading, and Android test surfaces.
metadata:
  category: pack
---

# omc-android

## Overview

Use this pack skill when the work primarily targets native Android surfaces, Compose or View-based UI, lifecycle-aware state, or Gradle-based app structure.

## When to use

- Kotlin feature work
- Compose or Android View UI changes
- ViewModel, Flow, coroutine, or lifecycle-sensitive behavior
- Android instrumentation or unit test updates

## When not to use

- Flutter or React Native feature work
- Pure backend or non-Android platform work

## Focus

- Keep UI state explicit and lifecycle-aware
- Use coroutines and Flow consistently with repo patterns
- Avoid work in composition that belongs in ViewModel or domain logic
- Make loading, error, and empty states explicit

## Minimum verification

- Run the Gradle build and tests when available
- Smoke navigation or the affected flow
- If UI changed, consider rotation or background/restore sanity where practical
