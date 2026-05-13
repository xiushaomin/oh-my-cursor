---
name: omc-react-native
description: React Native and Expo skill for navigation, JS and native boundaries, device capabilities, and cross-platform verification. Use when changing screens, bridge-sensitive behavior, or shared mobile flows.
metadata:
  category: pack
---

# omc-react-native

## Overview

Use this skill for React Native or Expo screens, navigation, bridge boundaries, and shared mobile flows.

## When to use

- Screen, navigation, or state-flow changes
- Native-module or bridge-sensitive behavior
- Cross-platform mobile verification

## Repo-first discovery

- Find the owning screen, navigation tree, and bridge boundary first.
- Reuse repo-local Expo, Metro, storage, and networking patterns.

## Default deliverable

- Name the affected screen, navigation boundary, or bridge surface.
- State the cross-platform assumption being preserved.
- State the strongest iOS and Android smoke path available.

## On-demand references

- Pull from [`../../references/skill-repo-discovery.md`](../../references/skill-repo-discovery.md) when ownership is unclear.
- Pull from [`../../references/mobile-verification-prompts.md`](../../references/mobile-verification-prompts.md) and [`../../references/testing-checklist.md`](../../references/testing-checklist.md) for deeper verification.
