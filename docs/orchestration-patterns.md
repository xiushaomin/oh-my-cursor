# Orchestration patterns

This document defines which delegation patterns `oh-my-cursor` encourages and which ones it should resist.

## Default posture

Work directly unless delegation materially improves quality, speed, or safety.

The existence of specialist agents is not a reason to use them.

`oh-my-cursor` should feel skill-first, not command-first. A workflow skill is the user-facing unit of intent; hooks and agents support it, but should not become competing orchestration layers.

## Recommended patterns

### 1. Direct execution

One agent handles one scoped task with local verification.

Use when:

- the task is local and understandable
- the write surface is small
- no second perspective is needed

### 2. Research isolation

Spawn a read-only research lane to map files, conventions, or examples, then return a compact digest.

Use when:

- the repo lookup would otherwise bloat the main context
- the result is much smaller than the material consumed

### 3. Perspective fan-out

Multiple narrow review or specialist lanes inspect the same artifact from different angles, then the parent integrates.

Use when:

- the lanes are genuinely independent
- each lane brings a different perspective
- the merge step is simple enough to stay local

### 4. Workflow-first orchestration

Plan first, then delegate only the steps that benefit from specialist ownership.

Use when:

- the task spans multiple domains
- sequencing matters
- the parent needs to own integration and verification

### 5. Review feedback loop

Use review findings as structured input to the next workflow instead of treating review as a terminal report.

Use when:

- review finds scope, architecture, or proof gaps
- the fix path is not just a local patch
- the same class of issue appears repeatedly

Route findings back to:

- `develop` for local implementation defects
- `plan` for scope or sequencing gaps
- `architecture` for boundary, migration, or compatibility concerns
- `check` for missing proof obligations

## Anti-patterns

### 1. Router-on-router

Do not build an agent whose main value is deciding which other agent should decide something.

Why it is bad:

- adds latency
- adds token cost
- loses information across paraphrase hops

### 2. Persona nesting for prestige

Do not delegate just because a task sounds important.

Why it is bad:

- creates ceremony without quality
- hides ownership
- makes verification harder

### 3. Shared-write chaos

Do not send multiple agents into the same file set without a clear ownership split.

Why it is bad:

- increases merge conflict risk
- makes blame and verification murky

### 4. Premature orchestration

Do not jump to parallel orchestration when develop, plan, or direct execution is enough.

Why it is bad:

- heavier context
- more moving parts
- easier to overrun the user's actual request

### 5. Command shadowing

Do not add a command layer that duplicates skills.

Why it is bad:

- users have to learn two names for the same workflow
- routing becomes harder to reason about
- product behavior drifts away from Cursor's native skill model

## Delegation checklist

Before delegating, confirm:

- the subtask is bounded
- the output shape is explicit
- the write surface is clear
- the parent can verify the result
- the task is not on the immediate critical path unless parallelism truly helps
