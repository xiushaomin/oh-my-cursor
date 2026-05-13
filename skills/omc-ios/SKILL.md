---
name: omc-ios
description: iOS skill for Swift, SwiftUI, UIKit, concurrency, navigation, and lifecycle-sensitive app work. Use when changing screens, flows, state ownership, or iOS validation paths.
metadata:
  category: pack
---

# omc-ios

## Overview

Use this skill for native iOS surfaces, app lifecycle behavior, and Apple-platform UI work.

## When to use

- SwiftUI or UIKit feature work
- Navigation, state ownership, or concurrency-sensitive changes
- iOS verification and smoke coverage

## Repo-first discovery

- Find the owning screen, navigation flow, and state boundary first.
- Reuse repo-local concurrency, navigation, and testing patterns.

## Default deliverable

- Name the affected screen or lifecycle boundary.
- State the concurrency or navigation assumption being preserved.
- State the strongest simulator or device verification path.

## On-demand references

- Pull from [`../../references/skill-repo-discovery.md`](../../references/skill-repo-discovery.md) when ownership is unclear.
- Pull from [`../../references/mobile-verification-prompts.md`](../../references/mobile-verification-prompts.md) and [`../../references/testing-checklist.md`](../../references/testing-checklist.md) for deeper verification.
