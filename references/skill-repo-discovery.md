# Skill Repo Discovery

Use this reference when a skill needs concrete repo context before it can give strong guidance.

## Discovery order

1. Find the likely source of truth.
   Look for package manifests, build files, lockfiles, workspace configs, app entrypoints, and test configs before making assumptions.

2. Map the affected surface.
   Identify the files, modules, routes, screens, services, or pipelines that appear to own the behavior in question.

3. Read the nearest local pattern.
   Prefer existing implementations in the same repo over generic framework advice.

4. Discover the verification path.
   Find the most likely lint, typecheck, test, build, or smoke path that already exists in the repo.

5. State gaps explicitly.
   If checks, ownership, or verification paths are missing, say so rather than inventing certainty.

## Typical discovery targets

- `package.json`, workspace files, and lockfiles
- `pom.xml`, Gradle files, Xcode projects, `Podfile`, `Package.swift`
- test configs such as Jest, Vitest, Playwright, XCTest, JUnit, or Gradle test tasks
- route, screen, controller, service, repository, reducer, or ViewModel entrypoints
- CI config or scripts that already define the expected verification flow

## Anti-patterns

- Starting from framework recall before checking the repo
- Naming verification paths that are not present in the project
- Treating one nearby file as proof of a global pattern
- Claiming verification is complete without identifying the actual check path
