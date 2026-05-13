# Mobile Verification Prompts

Use these prompts for iOS, Android, Flutter, or React Native changes when the skill needs a tighter verification pass.

## App behavior

- Does the critical path still launch and recover from interruption?
- Are loading, error, and offline states visible and actionable?
- Are navigation and back behavior still correct?

## Platform concerns

- Does the change depend on lifecycle timing, cancellation, or background/foreground transitions?
- Is simulator-only coverage being mistaken for full platform confidence?
- Are permissions, storage, or device capability edges handled explicitly?

## Release confidence

- Which path was actually exercised?
- What remains unverified on a real device, second platform, or production-like build?
