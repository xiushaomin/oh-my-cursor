---
name: omc-ios
description: iOS work — Swift, SwiftUI, UIKit, concurrency, performance, and Xcode-friendly workflows.
metadata:
  category: pack
---

# omc-ios

## Goal
- Deliver iOS changes aligned with repo conventions and Apple platform constraints.

## Focus
- Platform APIs, app lifecycle, navigation, concurrency, performance.
- Testing: XCTest/unit/UI tests where repo supports it.
- Prefer project conventions; align with Apple HIG when relevant.

## Verify (minimum)
- Build in Xcode (or `xcodebuild` if configured).
- Smoke one critical flow; call out simulator vs device gap.

## Delegation
- Implementation: `ios-engineer` subagent.
- Large structural decisions: use `architecture-reviewer` (explicit) or `/omc-plan` for upfront design.
