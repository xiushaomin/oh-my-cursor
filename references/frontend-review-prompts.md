# Frontend Review Prompts

Use these prompts when frontend work needs deeper inspection beyond the core skill body.

## UI correctness

- What happens on loading, empty, success, and error states?
- Does keyboard access still work for the primary flow?
- Are labels, roles, and focus order still understandable?

## Data flow

- Is server versus client responsibility clear?
- Are cache invalidation, optimistic updates, and retries consistent with repo patterns?
- Is any component now doing data orchestration that belongs elsewhere?

## Rendering and performance

- Did the change widen render scope?
- Are large lists, expensive derived state, or layout thrash introduced?
- Did asset or bundle cost increase in a user-visible path?
