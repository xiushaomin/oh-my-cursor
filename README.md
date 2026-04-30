# oh-my-cursor

`oh-my-cursor` is a Cursor plugin for product teams.

It adds reusable workflows, focused subagents, stack-aware guidance, and lightweight hooks to make Cursor more structured, more consistent, and easier to scale across real engineering work.

It is designed for teams building web, backend, and mobile apps with stacks like Java, iOS, Android, Flutter, and React Native.

## What you get

- `skills/` for reusable entrypoints like planning, implementation, review, and debugging
- `agents/` for focused specialists across engineering, QA, docs, migration, and release work
- `hooks/` for routing and guardrails that stay mostly out of your way
- `rules/` for optional durable engineering guidance
- `config/` for workflow, pack, capability, and guidance metadata

## Quick start

### Requirements

- [Cursor](https://cursor.com) with Skills, Subagents, and Hooks enabled
- Node.js for the bundled hook scripts

### One-command install

```bash
curl -fsSL https://raw.githubusercontent.com/xiushaomin/oh-my-cursor/main/install.sh | bash
```

### Update

```bash
curl -fsSL https://raw.githubusercontent.com/xiushaomin/oh-my-cursor/main/update.sh | bash
```

### Uninstall

```bash
curl -fsSL https://raw.githubusercontent.com/xiushaomin/oh-my-cursor/main/uninstall.sh | bash
```

You can also paste that command directly to your AI assistant and ask it to install `oh-my-cursor` for you.

Restart Cursor, or run `Developer: Reload Window`.

### Manual install

Clone the repo and copy it into Cursor's local plugin directory.

```bash
git clone https://github.com/xiushaomin/oh-my-cursor.git
cd oh-my-cursor
mkdir -p ~/.cursor/plugins/local/oh-my-cursor
rsync -a --delete --exclude '.git' ./ ~/.cursor/plugins/local/oh-my-cursor/
```

## How to use it

Use explicit workflows:

```text
/omc-plan design a release checklist for this repo
/omc-work help me implement this step by step
/omc-review review the current changes for bugs and security
/omc-debug investigate why this hook is not firing
```

Or just ask naturally:

```text
Plan this feature
Review my current changes
Walk me through the migration
Debug this failing workflow
```

## Core workflows

| Workflow | Best for |
| --- | --- |
| `omc-brainstorm` | exploring options before committing |
| `omc-plan` | turning an idea into an execution plan |
| `omc-work` | guided step-by-step collaboration |
| `omc-orchestrate` | multi-lane work with subagent delegation |
| `omc-review` | code quality, security, and completeness review |
| `omc-debug` | root-cause investigation |
| `omc-scm` | git hygiene and handoff tasks |
| `omc-architecture` | boundaries, tradeoffs, and design review |

The repo also includes helpers for test planning, PR summaries, release checklists, incident reports, and migration checklists.

## Subagent strategy

`oh-my-cursor` does not treat subagents as generic extra hands.

It uses a deliberate delegation model:

- subagents should have clear specialist lanes
- the active workflow shapes what kind of delegation is appropriate
- domain packs narrow which specialists make sense for the current repo
- subagents receive smaller, scoped briefs instead of the full project policy dump

The goal is to make delegation feel useful, not ceremonial.

### Default model lanes

Different specialist roles use different model lanes by default:

| Role | Default model lane | Description |
| --- | --- | --- |
| `frontend-engineer` | `gemini-3.1-pro` | Frontend implementation for web UI, component work, and interaction-heavy product surfaces. |
| `java-backend-engineer` | `gpt-5.3-codex` | Java service and backend implementation with a stronger coding-first profile. |
| `ios-engineer` | `claude-4.6-sonnet-medium` | Native iOS implementation with emphasis on app structure, platform patterns, and product polish. |
| `android-engineer` | `claude-4.6-sonnet-medium` | Native Android implementation focused on maintainable app flows and platform-aligned structure. |
| `flutter-engineer` | `gemini-3.1-pro` | Flutter UI and cross-platform feature work with strong support for iterative product development. |
| `react-native-engineer` | `claude-4.6-sonnet-medium` | React Native implementation across screens, flows, and mobile product integration points. |
| `architecture-reviewer` | `gpt-5.5-medium` | Reviews system boundaries, tradeoffs, abstractions, and long-horizon design risk. |
| `debug-investigator` | `gpt-5.5-medium` | Investigates root causes, traces failures, and narrows ambiguous technical problems. |
| `backend-qa-reviewer` | `gpt-5.3-codex` | Reviews backend changes for correctness, regressions, and implementation-level risk. |
| `mobile-qa-reviewer` | `claude-4.6-sonnet-medium-thinking` | Reviews mobile changes with extra depth for UX flows, platform behavior, and edge cases. |
| `frontend-qa-reviewer` | `grok-4-20` | Reviews frontend work for UI quality, behavior gaps, and user-facing regressions. |
| `pm-planner` | `kimi-k2.5` | Breaks product requests into plans, milestones, decision points, and execution-ready tasks. |

This is intentional: UI-heavy work, backend coding, planning, and deep review do not all benefit from the same model profile.

## How it works

`oh-my-cursor` is built from a few small pieces instead of one giant prompt:

1. Workflows decide how a task should run.
2. Domain packs add stack-specific guidance.
3. Subagents handle bounded specialist work.
4. Hooks provide routing, persistence, and lightweight governance.
5. Rules keep durable engineering guidance separate from task choreography.

That means a request like "review this React feature" can naturally pick up the review workflow, the frontend pack, and the right specialist helpers without you stitching them together manually.

## Repo structure

| Path | Purpose |
| --- | --- |
| `.cursor-plugin/plugin.json` | Cursor plugin manifest |
| `skills/` | workflow and domain skill entrypoints |
| `agents/` | subagent definitions |
| `hooks/` | routing, session, persistence, and governance hooks |
| `rules/` | optional rule files |
| `config/` | runtime metadata and generated guidance |
| `scripts/` | build and verification utilities |

## Architecture

[ARCHITECTURE.md](./ARCHITECTURE.md) covers the system structure, configuration model, routing philosophy, and maintainer notes.

## For maintainers

After editing workflow, pack, capability, or subagent metadata, run:

```bash
node scripts/build-guidance-index.mjs
node scripts/verify-guidance-index.mjs
node scripts/verify-plugin.mjs
```

## License

MIT
