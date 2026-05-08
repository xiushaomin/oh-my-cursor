# oh-my-cursor

> Warning
> This project is still in active testing. Behavior, APIs, defaults, and workflow details may change, and some features may be incomplete or unstable.

`oh-my-cursor` is a Cursor plugin for app teams that want stronger execution discipline without fighting Cursor's native model.

It combines:

- `rules/` for durable stack-aware guidance
- `skills/` for multi-step workflows with explicit verification
- `agents/` for narrow specialist delegation
- `hooks/` for lightweight routing, persistence, and safety guardrails

The goal is not to replace Cursor with a custom runtime. The goal is to make Cursor behave more like a disciplined senior engineering teammate across planning, implementation, debugging, review, and release work.

## Design principles

- Stay Cursor-native. Prefer project rules, skills, focused agents, and hooks over one giant prompt.
- Keep layers sharp. Rules hold durable guidance, skills hold workflows, agents hold perspectives, hooks hold event-driven control.
- Favor evidence. Read the repo, inspect the relevant files, and verify changes before claiming completion.
- Keep changes reviewable. Prefer small diffs, explicit assumptions, and narrow delegation.
- Make quality habitual. Planning, testing, review, rollout, and rollback should be first-class concerns, not afterthoughts.

## What you get

- Core workflow skills for planning, execution, orchestration, review, debugging, architecture, and SCM handoff
- Domain packs for frontend, Java backend, iOS, Android, Flutter, and React Native work
- Stack-aware rules that attach lightweight, reusable guidance close to the relevant files
- Focused specialist agents for implementation, QA, debugging, planning, documentation, and migration work
- Hooks for intent routing, persistent workflow behavior, and conservative shell/MCP/file guardrails

## Workflow set

Core workflows:

- `omc-brainstorm`
- `omc-plan`
- `omc-work`
- `omc-orchestrate`
- `omc-review`
- `omc-debug`
- `omc-scm`
- `omc-architecture`

Delivery helpers:

- `omc-test-plan`
- `omc-pr-summary`
- `omc-release-checklist`
- `omc-incident-report`
- `omc-migration-checklist`

The plugin supports both explicit skill invocation and natural-language routing. The important abstraction is the workflow, not a custom command layer.

Current domain packs:

- `omc-frontend`
- `omc-java-backend`
- `omc-ios`
- `omc-android`
- `omc-flutter`
- `omc-react-native`

## Repository structure

| Path | Purpose |
| --- | --- |
| `.cursor-plugin/plugin.json` | Cursor plugin manifest |
| `skills/` | workflow and domain skill entrypoints |
| `agents/` | focused subagent definitions |
| `hooks/` | routing, persistence, and governance hooks |
| `rules/` | durable stack-aware rules |
| `config/` | workflow, pack, capability, and guidance metadata |
| `references/` | on-demand checklists and support material for skills |
| `docs/` | maintainer-facing product and orchestration guidance |
| `scripts/` | build and verification utilities |

## Install

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

The update script treats the remote branch as the source of truth. It resets the installed checkout to `origin/main`, so local commits and tracked edits inside the installed plugin checkout are discarded during update.

### Uninstall

```bash
curl -fsSL https://raw.githubusercontent.com/xiushaomin/oh-my-cursor/main/uninstall.sh | bash
```

### Manual install

```bash
git clone https://github.com/xiushaomin/oh-my-cursor.git
cd oh-my-cursor
mkdir -p ~/.cursor/plugins/local/oh-my-cursor
rsync -a --delete --exclude '.git' ./ ~/.cursor/plugins/local/oh-my-cursor/
```

Restart Cursor, or run `Developer: Reload Window`.

## How to use it well

- Ask naturally when you want Cursor to route toward the right workflow.
- Use explicit skills when you want a specific execution mode or stronger control.
- Let rules carry stable coding expectations instead of restating them in every task.
- Keep domain packs narrow and stack-aware.
- Treat specialist agents as bounded helpers, not as a replacement for thinking.

## Maintainer notes

After editing workflow, pack, capability, or subagent metadata, run:

```bash
node scripts/build-guidance-index.mjs
node scripts/verify-guidance-index.mjs
node scripts/verify-plugin.mjs
node --test tests/*.test.mjs
```

Additional design guidance lives in [ARCHITECTURE.md](/Users/smxiu/Desktop/oh-my-cursor/ARCHITECTURE.md) and [docs/orchestration-patterns.md](/Users/smxiu/Desktop/oh-my-cursor/docs/orchestration-patterns.md).

## License

MIT
