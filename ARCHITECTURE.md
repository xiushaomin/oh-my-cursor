# Architecture

This document explains how `oh-my-cursor` is structured and how its pieces fit together.

If `README.md` is the product-facing guide, this file is the maintainer-facing map.

## Product boundary

`oh-my-cursor` is a Cursor plugin for app teams. It adds structure around Cursor's native primitives without replacing Cursor itself.

It is designed for:

- web frontend
- Java backend
- iOS
- Android
- Flutter
- React Native

It is not trying to become:

- a generic agent runtime
- a CI/CD system
- a deployment platform
- a universal all-language framework

## Core idea

The plugin works by combining a few small surfaces instead of one giant instruction set:

1. **Workflows**
   Define how work should run.

2. **Domain packs**
   Define what stack-specific context matters.

3. **Subagents**
   Handle bounded specialist work.

4. **Hooks**
   Add routing, persistence, and lightweight governance.

5. **Rules**
   Provide stable, reusable engineering guidance.

## Repository structure

| Path | Purpose |
| --- | --- |
| `.cursor-plugin/plugin.json` | Cursor plugin manifest |
| `skills/` | workflow and domain skill entrypoints |
| `agents/` | subagent definitions |
| `hooks/` | routing, session, persistence, and governance hooks |
| `rules/` | optional rule files |
| `config/` | runtime metadata and generated guidance |
| `scripts/` | build and verification utilities |

The repo stays intentionally flat. New layers should exist only if they reduce real complexity.

## Runtime responsibilities

### Skills

Own:

- workflow entrypoints
- protocols
- handoffs
- checklists

Do not own:

- heavy static guidance
- install logic
- hidden runtime behavior

### Subagents

Own:

- focused specialist execution
- deep review
- bounded implementation lanes

Subagents should have a clear role, not a vague helper identity.

### Rules

Own:

- durable conventions
- stack-specific principles
- reusable guidance

Rules should stay small and should not turn into workflow engines.

### Hooks

Own:

- prompt routing
- pack detection
- session hints
- persistent workflow stop behavior
- conservative governance for shell, MCP, and file access

Hooks should stay operational and lightweight.

## Workflow families

### Core workflows

- `omc-brainstorm`
- `omc-plan`
- `omc-work`
- `omc-orchestrate`
- `omc-review`
- `omc-debug`
- `omc-scm`
- `omc-architecture`

### Delivery helpers

- `omc-test-plan`
- `omc-pr-summary`
- `omc-release-checklist`
- `omc-incident-report`
- `omc-migration-checklist`

## Domain packs

Current packs:

- `omc-frontend`
- `omc-java-backend`
- `omc-ios`
- `omc-android`
- `omc-flutter`
- `omc-react-native`

Each pack contributes likely rules, specialist roles, and stack heuristics.

There is also one shared baseline rule, `rules/omc-common.mdc`, which uses Cursor's `alwaysApply: true` mode. Stack-specific rules stay scoped, while the common rule carries cross-cutting expectations around clarity, simplicity, surgical changes, delegation discipline, and verification.

## Configuration model

Most of the contract lives in `config/`.

Key files:

- `config/workflows.json`
- `config/packs.json`
- `config/capabilities.json`
- `config/guidance-index.json`
- `config/subagent-context.json`
- `config/check-lanes.json`
- `config/config.jsonc`

## Model routing

Model choice is role-based, not uniform.

The guiding idea:

- UI-heavy work gets strong large-context UI models
- backend coding gets coding-focused models
- architecture and hard debugging get stronger reasoning models
- planning stays cost-aware

Default routing is intentionally pragmatic rather than flashy.

## Rule design

Rules in this repo should be:

- concise
- composable
- stack-aware
- durable across many repos

They should not encode task choreography. If guidance depends on sequence or handoff, it probably belongs in a skill.

## Customization layers

The expected precedence is:

1. shipped defaults
2. plugin config
3. repo rules and overlays
4. Cursor team rules

## Verification loop

After metadata changes, run:

```bash
node scripts/build-guidance-index.mjs
node scripts/verify-guidance-index.mjs
node scripts/verify-plugin.mjs
```

These checks matter because the product is mostly metadata plus runtime glue. Small path or schema drift can quietly break the plugin.
