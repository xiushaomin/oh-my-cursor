---
name: omc-ios
description: iOS domain skill for Swift, SwiftUI, UIKit, concurrency, navigation, lifecycle, and Xcode-friendly app workflows.
metadata:
  category: pack
---

# omc-ios

## Overview

Use this pack skill when the work primarily targets native iOS surfaces, app lifecycle behavior, or Apple-platform UI and concurrency constraints.

## When to use

- SwiftUI or UIKit feature work
- Navigation, state ownership, or lifecycle behavior
- Concurrency, task lifetime, or `@MainActor` sensitive changes
- XCTest or iOS UI validation work

## When not to use

- React Native or Expo flows
- Pure backend or non-iOS platform work

## Focus

- Keep views composable and orchestration out of view bodies
- Respect task lifetime, cancellation, and actor boundaries
- Stay aligned with the repo's app structure and Apple platform conventions
- Treat accessibility and interaction feedback as feature behavior

## Minimum verification

- Build in Xcode or with the repo's configured build path
- Smoke one critical flow
- State simulator versus real-device gaps when relevant
