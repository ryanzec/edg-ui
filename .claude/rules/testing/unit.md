---
alwaysApply: true
---
# IMPORTANT: These rules override general typescript / angular rules
# General Unit Testing Patterns
- **ALWAYS** use `vitest` apis.
- **ALWAYS** make sure the pipe only does ONE thing and the name of the pipe CLEARLY indicates what is does.
- **ONLY** use `debugElement` when **100%** NECESSARY.
- **ALWAYS** group related test in nested describes.
- **NEVER** mock any animation stuff (`provideNoopAnimations`, `NoopAnimationsModule`, etc.).
- **NEVER** write unit tests that are just a combination of multiple other unit tests.
