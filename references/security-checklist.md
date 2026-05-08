# Security checklist

Use this reference when review or implementation work touches trust boundaries.

## Boundary questions

- What input is attacker-controlled?
- Where does authorization happen?
- What secrets, tokens, or credentials are in play?
- What external systems are being called?

## Minimum checks

- Validate inputs at the boundary
- Keep authn and authz explicit
- Avoid logging secrets or sensitive payloads
- Use parameterized queries or safe ORM patterns
- Keep file, shell, and network operations scoped and intentional

## Common review targets

- Missing authorization on read or write paths
- Trusting client-provided identifiers or roles
- Injection risks in SQL, shell, templates, or interpreters
- Unsafe defaults in feature flags, admin paths, or debug tooling
- Weak secret handling in config, logs, or commits

## Red flags

- "Internal only" used as a substitute for authorization
- New external integrations without failure and timeout handling
- Sensitive files or credentials touched during ordinary implementation
