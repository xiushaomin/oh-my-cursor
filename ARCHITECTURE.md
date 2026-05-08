# Architecture

This document explains how `oh-my-cursor` is structured and how its parts fit together.

If [README.md](/Users/smxiu/Desktop/oh-my-cursor/README.md) is the product-facing guide, this file is the maintainer-facing execution map.

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

## Cursor-native product shape

The design target is to amplify Cursor's built-in model, not compete with it.

- Rules should stay small, composable, and durable.
- Skills should hold multi-step process, anti-rationalization, and verification gates.
- Agents should have a single perspective and a bounded scope.
- Hooks should stay operational and lightweight.

When the same concern could live in multiple layers, prefer this order:

1. `rules/` for durable expectations
2. `skills/` for reusable workflows
3. `agents/` for delegated perspectives
4. `hooks/` for event-driven control
5. `config/` for metadata glue

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

## Runtime responsibilities

### Rules

Own:

- stable coding expectations
- stack-aware heuristics
- reusable quality principles

Do not own:

- long workflow choreography
- routing logic
- hidden state machines

### Skills

Own:

- workflow steps
- stop points
- anti-rationalization
- red flags
- verification gates

Do not own:

- broad static stack knowledge better expressed as rules
- hidden runtime behavior that only hooks can enforce

### Agents

Own:

- a single specialist role
- a narrow deliverable shape
- deeper implementation or review passes

Agents should not become generic helpers. They should have obvious delegation triggers and clear output formats.

### Hooks

Own:

- intent routing
- persistent workflow state
- conservative shell, MCP, and file guardrails
- lightweight telemetry and session glue

Hooks should not become a second workflow engine.

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

Each pack contributes:

- likely workflow fit
- likely rules
- likely agents
- stack heuristics for detection

There is also one shared baseline rule, [rules/omc-common.mdc](/Users/smxiu/Desktop/oh-my-cursor/rules/omc-common.mdc), which carries cross-cutting expectations around clarity, simplicity, narrow delegation, and evidence-backed verification.

## Configuration model

Most of the product contract lives in `config/`.

Key files:

- [config/workflows.json](/Users/smxiu/Desktop/oh-my-cursor/config/workflows.json)
- [config/packs.json](/Users/smxiu/Desktop/oh-my-cursor/config/packs.json)
- [config/capabilities.json](/Users/smxiu/Desktop/oh-my-cursor/config/capabilities.json)
- [config/guidance-index.json](/Users/smxiu/Desktop/oh-my-cursor/config/guidance-index.json)
- [config/subagent-context.json](/Users/smxiu/Desktop/oh-my-cursor/config/subagent-context.json)
- [config/check-lanes.json](/Users/smxiu/Desktop/oh-my-cursor/config/check-lanes.json)
- [config/config.jsonc](/Users/smxiu/Desktop/oh-my-cursor/config/config.jsonc)

## Skill quality bar

Core workflow skills should converge on one consistent anatomy:

- `Overview`
- `When to use`
- `When not to use`
- `Workflow`
- `Common rationalizations`
- `Red flags`
- `Verification`

Why this matters:

- Cursor skills need to stay reasonably short.
- Short skills still need enough structure to constrain agent behavior.
- Anti-rationalization is often more valuable than extra prose.
- References and docs can carry deeper support material on demand.

## References and docs

Long checklists and orchestration policies should live outside the core skill body.

Use:

- `references/` for reusable quality assets such as testing, security, performance, and accessibility checklists
- `docs/` for maintainer-facing product shape, orchestration patterns, and Cursor-native design guidance

This preserves progressive disclosure and reduces context bloat.

## Routing philosophy

The router should remain pragmatic, not magical.

- Prefer explicit skill invocations when the user wants a specific mode.
- Support natural-language routing when intent is clear.
- Avoid accidental escalation into orchestration for tiny prompts.
- Detect packs conservatively and keep the injected context compact.

The best router is the one users barely notice.

## Governance philosophy

Safety guardrails should block obviously risky behavior without making ordinary work painful.

Current governance focuses on:

- destructive shell commands
- sensitive file reads
- risky MCP configuration mutations

This is intentionally conservative and dependency-free.

## Verification loop

Because the product is mostly metadata plus runtime glue, quiet drift is a bigger risk than loud code failures.

After metadata changes, run:

```bash
node scripts/build-guidance-index.mjs
node scripts/verify-guidance-index.mjs
node scripts/verify-plugin.mjs
node --test tests/*.test.mjs
```

These checks matter because routing, capability mapping, and plugin structure can break from small schema or path changes.

## Near-term improvement direction

The current strategic direction is:

- strengthen core workflow skills
- keep the product more Cursor-native and less command-centric
- expand references instead of bloating skills
- document good and bad orchestration patterns explicitly
- keep hooks lean while improving skill quality
