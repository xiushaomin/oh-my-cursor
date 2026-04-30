---
name: omc-scm
description: Branching, commits, merges, and safe git hygiene for multi-agent work.
disable-model-invocation: true
metadata:
  category: workflow
---

# omc-scm

## Goal
- Keep git actions safe, reviewable, and collaboration-ready.

## When to use
- “git / commit / PR / merge / rebase / cherry-pick / branch / release notes”.

## Rules (safety)
- No destructive commands unless user explicitly asks (force push, hard reset).
- No secret files in commits (`.env`, credentials).
- Prefer small commits; avoid mixing unrelated changes.
- Use conventional commit style when repo uses it.

## Protocol
1. Inspect: `git status`, `git diff`, recent `git log`.
2. Propose branch + commit plan (1-5 commits).
3. Stage only relevant files.
4. Commit with message focused on “why”.
5. Verify: `git status` clean; optional tests if requested.

## Stop point
- If ambiguity about what to include/exclude, stop and ask for decision before staging.

## Output contract
- `branch_strategy`, `commit_plan`, `risk_notes`.
