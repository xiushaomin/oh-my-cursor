# Architecture

This document explains how `oh-my-cursor` is structured and how its parts fit together.

If [README.md](README.md) is the product-facing guide, this file is the maintainer-facing execution map.

## Product boundary

`oh-my-cursor` is a Cursor-native coordination layer for app teams.

It is designed for:

- web frontend
- Java backend
- iOS
- Android
- Flutter
- React Native

It is not trying to become:

- a replacement agent runtime
- a universal prompt framework
- a deployment system
- an all-language platform
- a command framework layered on top of skills

## Core idea

The product works by keeping four surfaces sharp instead of collapsing everything into a giant prompt.

1. `rules/`
   Durable stack-aware engineering guidance.

2. `skills/`
   Ordered workflows with explicit exit criteria.

3. `agents/`
   Narrow specialist lanes for implementation, review, debugging, or documentation.

4. `hooks/`
   Lightweight routing, persistence, and governance tied to Cursor event boundaries.

`config/` exists to keep these layers coherent. It should not become the place where behavior is invented for its own sake.

## Repository structure

| Path | Purpose |
| --- | --- |
| `.cursor-plugin/plugin.json` | Cursor plugin manifest |
| `skills/` | workflow and pack skill entrypoints |
| `agents/` | focused subagent definitions |
| `hooks/` | routing, persistence, and governance hooks |
| `rules/` | durable stack-aware rules |
| `config/` | runtime metadata and generated guidance |
| `references/` | on-demand support material for skills |
| `docs/` | maintainer-facing product guidance |
| `scripts/` | build and verification utilities |

The repo should stay intentionally flat. Add a new layer only if it clearly reduces maintenance cost or user confusion.

## Layer responsibilities

- `rules/` hold durable engineering expectations.
- `skills/` hold reusable workflows, verification gates, and handoff artifacts.
- `agents/` hold narrow specialist perspectives.
- `hooks/` hold routing, persistence, and conservative safety guardrails.
- `config/` holds metadata glue and generated guidance.

## Workflow families

Workflow names should read like everyday engineering actions. The canonical product language is brainstorm, spec, plan, develop, verify, review, architecture, parallel, debug, and learn.

The target lifecycle is intentionally short:

```text
brainstorm -> plan -> develop -> review
```

Most tasks should use only the subset they need. Broader or riskier work may add `spec`, `check`, `architecture`, or `parallel` as helper skills.

### Workflow catalog

- `omc-brainstorm`
- `omc-spec`
- `omc-plan`
- `omc-develop`
- `omc-verify`
- `omc-review`
- `omc-architecture`
- `omc-parallel`
- `omc-debug`
- `omc-learn`

The catalog should stay short and developer-native. Lifecycle handoffs that involve source-control notes, release readiness, or migration details belong inside `omc-review` or `omc-architecture` artifacts instead of becoming standalone workflow surfaces.

## Domain packs

Current packs:

- `omc-frontend`
- `omc-java-backend`
- `omc-ios`
- `omc-android`
- `omc-flutter`
- `omc-react-native`

There is also one shared baseline rule, [rules/omc-common.mdc](rules/omc-common.mdc), which carries cross-cutting expectations around clarity, simplicity, narrow delegation, and evidence-backed verification.

## Configuration model

Most of the product contract lives in `config/`.

Key files:

- [config/workflows.json](config/workflows.json)
- [config/packs.json](config/packs.json)
- [config/capabilities.json](config/capabilities.json)
- [config/guidance-index.json](config/guidance-index.json)
- [config/subagent-context.json](config/subagent-context.json)
- [config/check-lanes.json](config/check-lanes.json)
- [config/config.jsonc](config/config.jsonc)

## Skill quality bar

Core workflow skills should keep one compact anatomy:

- `Overview`
- `When to use`
- `When not to use`
- `Repo-first discovery`
- `Workflow`
- `Output contract`
- `Red flags`
- `Verification`
- `On-demand references`

## References and docs

Long checklists and orchestration policies should live outside the core skill body.

Use:

- `references/` for reusable quality assets such as testing, security, performance, and accessibility checklists
- `evals/` for routing and output-contract regression fixtures
- `docs/` for maintainer-facing product shape, orchestration patterns, and Cursor-native design guidance

This preserves progressive disclosure and reduces context bloat.

## Routing philosophy

The router should remain pragmatic, not magical.

- Prefer explicit skill invocations when the user wants a specific mode.
- Support natural-language routing when intent is clear.
- Avoid accidental escalation into orchestration for tiny prompts.
- Detect packs conservatively and keep the injected context compact.
- Route vague work toward brainstorm, spec, or plan before implementation.
- Route serious review findings back to the right upstream skill instead of hiding them in local patching.

The best router is the one users barely notice.

## Verification loop

Because the product is mostly metadata plus runtime glue, quiet drift is a bigger risk than loud code failures.

For non-trivial work, the delivery loop should be explicit:

```text
plan -> develop -> review
```

If review is clean, the work should end with a handoff artifact. If review finds serious risk, the finding should flow back to `develop`, `plan`, `architecture`, or `check` depending on the root cause.

After metadata changes, run:

```bash
node scripts/build-guidance-index.mjs
node scripts/verify-guidance-index.mjs
node scripts/verify-plugin.mjs
node scripts/verify-skill-evals.mjs
node scripts/verify-output-contracts.mjs
node --test tests/*.test.mjs
```

These checks matter because routing, capability mapping, and plugin structure can break from small schema or path changes.

## Near-term improvement direction

The current strategic direction is to keep the workflow catalog small, keep hooks lean, and move depth into references and verification instead of adding new runtime surfaces.
