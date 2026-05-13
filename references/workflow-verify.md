# Check Companion

Use this companion when `omc-verify` needs a stronger proof-design pass.

## Proof-design quality bar

- Start from the user-visible claim or invariant.
- Rank the highest-value regression risks first.
- Prefer one strong targeted regression verify over many vague checks.
- Separate automated checks from manual validation.

## Common failure modes

- Listing tools without naming the behavior they prove
- Broad but shallow coverage
- Manual checks that are not repeatable
