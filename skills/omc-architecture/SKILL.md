---
name: omc-architecture
description: Architecture and tradeoff workflow for boundaries, module design, API contracts, migration paths, and cross-domain technical decisions that are expensive to reverse.
metadata:
  category: workflow
---

# omc-architecture

## Overview

Use this skill when the hard part of the task is choosing the shape of the system rather than writing the code. Good architecture work makes constraints, rejected alternatives, and migration consequences explicit.

## When to use

- Cross-module, cross-platform, or cross-service design decisions
- API or contract changes with compatibility impact
- Migration, boundary, state, routing, or data-flow decisions
- Work that would be expensive to reverse after implementation

## When not to use

- A small local implementation task with obvious existing patterns
- Early ideation where breadth matters more than design commitment

## Workflow

1. Map the current shape.
   Identify existing boundaries, ownership, and constraints in the repo.

2. State the forces.
   Name what the design must optimize for and what it can afford to trade away.

3. Compare real options.
   Evaluate 2-3 viable approaches, not strawmen.

4. Make the decision.
   Recommend one path and name the rejected alternatives and why they lose.

5. Define execution shape.
   Describe migration steps, compatibility concerns, and verification checkpoints.

## Common rationalizations

| Rationalization | Reality |
| --- | --- |
| "There's an obvious best design." | If it affects multiple surfaces, the tradeoffs should still be written down. |
| "We'll decide the migration later." | Migration cost is part of the architecture choice. |
| "The existing repo shape is messy, so we'll replace it wholesale." | Consistency with the current system often beats theoretical purity. |
| "We only need one option to keep momentum." | Without alternatives, the decision record is weak and easy to revisit badly. |

## Red flags

- Constraints are implicit
- Rejected alternatives are missing
- The decision optimizes one concern while hiding the cost to another
- Migration or compatibility work is hand-waved
- The proposed design depends on new abstractions that solve no current problem

## Verification

Before concluding the architecture step, confirm:

- [ ] Current constraints and boundaries are explicit
- [ ] Multiple viable options were considered
- [ ] The chosen option has a clear why
- [ ] Rejected options are named
- [ ] Migration and verification shape are defined
