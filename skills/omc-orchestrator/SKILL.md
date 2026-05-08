---
name: omc-orchestrator
description: Multi-lane execution workflow for large, cross-domain, or dependency-heavy work. Use when the parent agent must plan, delegate bounded tasks, integrate results, and verify a coherent end-to-end outcome.
metadata:
  category: workflow
---

# omc-orchestrator

## Overview

Use this skill when the task is too large or multi-domain for one uninterrupted pass, but still needs one parent lane to own scope, sequencing, integration, and verification.

## When to use

- The task spans multiple domains or subsystems
- Parallel specialist lanes would materially speed up the work
- The parent agent needs a coherent done definition and integration story
- Verification crosses multiple surfaces

## When not to use

- The task is a small local change
- The user wants only a plan
- The work is better handled in deliberate step-by-step mode

## Workflow

1. Analyze the whole task.
   Define success, risks, unknowns, and likely ownership boundaries before delegating anything.

2. Create a short execution plan.
   Use 3-7 steps with explicit owners and verification checkpoints.

3. Delegate bounded subtasks only.
   Each subtask needs file or concern boundaries, a done condition, and a reason it is worth parallelizing.

4. Keep the parent lane active.
   The parent owns integration, conflict resolution, and any work on the immediate critical path.

5. Integrate carefully.
   Reconcile results with the smallest possible surface area and avoid hidden scope growth.

6. Verify the whole outcome.
   Run the checks that prove the integrated system behavior, not just the local slice behavior.

7. Close with handoff clarity.
   State what was verified, what remains risky, and what follow-up belongs in a separate task.

## Common rationalizations

| Rationalization | Reality |
| --- | --- |
| "Subagents exist, so we should use them." | Delegation only helps when the tasks are truly parallel and bounded. |
| "I'll hand off the hard part and wait." | The parent should own the global picture and stay productive locally. |
| "We'll sort out integration after everyone finishes." | Integration shape should be planned before delegation starts. |
| "A bigger orchestrated flow always looks more impressive." | Over-orchestration adds latency, cost, and confusion. |

## Red flags

- Delegation begins before success criteria are clear
- Multiple lanes edit the same files without ownership splits
- The parent becomes a passive router
- Verification only covers subtask-local checks
- Orchestration expands scope beyond the original request

## Verification

Before concluding orchestration, confirm:

- [ ] The task really justified multi-lane execution
- [ ] Delegated subtasks were bounded and had explicit done conditions
- [ ] Integration was owned by the parent lane
- [ ] End-to-end verification was run or clearly scoped as a gap
- [ ] Residual risks and handoffs are explicit
