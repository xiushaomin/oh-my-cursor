---
name: omc-react-native
description: React Native and Expo domain skill for navigation, JS and native boundaries, device capabilities, mobile UI state, and cross-platform verification.
metadata:
  category: pack
---

# omc-react-native

## Overview

Use this pack skill when the work spans React Native or Expo screens, navigation, JS/native boundaries, Metro surfaces, or device-capability behavior.

## When to use

- React Native or Expo feature work
- Screen, navigation, or state-flow changes
- Native-module or bridge-sensitive behavior
- Cross-platform mobile smoke validation

## When not to use

- Pure web frontend work
- Pure native iOS or Android work without React Native

## Focus

- Keep JS and native responsibilities explicit
- Stay aligned with the repo's routing and state patterns
- Treat asset loading, secure storage, offline behavior, and device capability use as product-critical
- Keep interaction, error, and network state visible in the UI

## Minimum verification

- Confirm the app launches and the affected flow runs
- Validate the main path on both iOS and Android when the change crosses shared mobile behavior
- Explicitly name simulator or device coverage gaps
