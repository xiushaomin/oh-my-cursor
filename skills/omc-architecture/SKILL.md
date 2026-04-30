---
name: omc-architecture
description: Architecture and tradeoff workflow for app teams. Use for boundaries, module design, API contracts, migration paths, and cross-domain technical decisions.
metadata:
  category: workflow
---

# omc-architecture

## Goal
- Make technical direction explicit: boundaries, constraints, tradeoffs, risks, and verification.

## When to use
- Cross-module or cross-platform design decisions.
- API, data, state, navigation, build, or migration architecture.
- The change could be expensive to reverse.

## When NOT to use
- Small implementation tasks with obvious local patterns -> do inline or use `/omc-work`.
- Pure brainstorming before constraints are known -> `/omc-brainstorm`.

## Protocol
1. **Context**: identify affected systems, current patterns, and constraints.
2. **Forces**: list what the design must optimize for and what it can sacrifice.
3. **Options**: compare 2-3 viable approaches.
4. **Decision**: recommend one approach with explicit rejected alternatives.
5. **Execution shape**: define milestones, migration strategy, and verification.

## Guardrails
- Prefer existing repo boundaries and platform conventions.
- Avoid new abstractions unless they remove real complexity.
- Call out irreversible or high-blast-radius decisions clearly.

## Output contract
- `context`, `constraints`, `options`, `decision`, `rejected`, `migration_plan`, `verification`.
