# Skill Evals

This directory holds lightweight evaluation fixtures for `oh-my-cursor` skills.

## Goals

- Check whether descriptions trigger the right skill
- Catch false-positive routing before release
- Preserve stable output contracts for core workflows

## Suggested workflow

1. Add representative user prompts to a skill-specific fixture.
2. Mark whether the skill should trigger or should stay inactive.
3. Include a small set of negative examples for closely related skills.
4. Revisit prompts after changing skill descriptions, routing keywords, or workflow boundaries.

## Current fixture shape

- `routing-smoke.md` for human-readable prompts
- `routing-smoke.json` for script-checked router regression cases
- `../scripts/verify-skill-evals.mjs` for quick automated validation
- `../scripts/verify-output-contracts.mjs` for contract drift checks between workflow config and shared references
