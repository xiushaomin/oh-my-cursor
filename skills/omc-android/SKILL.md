---
name: omc-android
description: Android skill for Kotlin, Jetpack, Compose or Views, lifecycle-aware state, and Android test surfaces. Use when changing screens, ViewModels, navigation, or Android verification paths.
metadata:
  category: pack
---

# omc-android

## Overview

Use this skill for native Android screens, state, navigation, and Gradle-based app work.

## When to use

- Compose or View UI changes
- ViewModel, Flow, coroutine, or lifecycle-sensitive behavior
- Android verification and smoke coverage

## Repo-first discovery

- Find the owning screen, ViewModel, navigation flow, and module first.
- Reuse repo-local coroutine, Flow, and lifecycle patterns.

## Default deliverable

- Name the affected screen, module, or lifecycle boundary.
- State the state or navigation assumption being preserved.
- State the strongest build or test path available in the repo.

## On-demand references

- Pull from [`../../references/skill-repo-discovery.md`](../../references/skill-repo-discovery.md) when ownership is unclear.
- Pull from [`../../references/mobile-verification-prompts.md`](../../references/mobile-verification-prompts.md) and [`../../references/testing-checklist.md`](../../references/testing-checklist.md) for deeper verification.
