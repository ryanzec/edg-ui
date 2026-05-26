---
alwaysApply: true
---
# IMPORTANT: These rules override general typescript / angular rules
# General Unit Testing Patterns
- **ALWAYS** use `vitest` apis.
- **ALWAYS** group related test in nested describes.
- **NEVER** mock internal methods.
- **NEVER** mock 3rd party libraries.
- **ONLY** use vitest unit tests for code that are not angualr component or angular directives.
- **ONLY** mock native apis when **100%** needed.
- You can have multiple level of nested `describe()`s as needed.
- **NEVER** write unit tests that are just a combination of multiple other unit tests.
- **ALWAYS** test the output of RxJS related code and **NEVER** subscribe to the subject directly.
- **NEVER** validation any logging from `logManager` in tests.
