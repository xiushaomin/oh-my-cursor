---
name: omc-plan
description: Turn goals into a structured plan — milestones, dependencies, and acceptance criteria.
metadata:
  category: workflow
---

# omc-plan

## Goal
- Convert goal → executable steps with **acceptance criteria** + dependencies + risks.

## When to use
- “plan / roadmap / 里程碑 / 拆解需求 / milestone”.
- Multi-step delivery or cross-module dependency.

## Plan format (short)
- **Goal**
- **Non-goals**
- **Assumptions**
- **Milestones** (2-6)
- **Tasks** (grouped by milestone; each has owner: parent vs subagent)
- **Acceptance criteria** (verifiable)
- **Risks** + mitigations
- **Test plan** (what to run / what manual check)

## Stop point
- After presenting plan, stop and wait for approval before implementing.

## Output contract
- `goals`, `milestones`, `dependencies`, `risks`, `acceptance_criteria`.
