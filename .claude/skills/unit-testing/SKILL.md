---
name: unit-testing
description: Use this skill whenever writing tests for code that does not require a browser. Covers vitest unit tests with nested describes, no mocking of internals or 3rd-party libraries, and asserting RxJS outputs (never subscribing to subjects directly).
---
# Unit Testing

# **CRITICAL** Rules
- **ONLY** write vitest unit tests without the browser feature for code that does not require a browser to properly test it.

# Rules
- **ALWAYS** use `vitest` apis.
- **ALWAYS** group related test in nested describes.
- **NEVER** mock internal methods.
- **NEVER** mock 3rd party libraries.
- **ONLY** mock native apis when **100%** needed.
- You can have multiple level of nested `describe()`s as needed.
- **NEVER** write unit tests that are just a combination of multiple other unit tests.
- **ALWAYS** test the output of RxJS related code and **NEVER** subscribe to the subject directly.
- **NEVER** validation any logging from `logManager` in tests.
- **ONLY** mock logManager when the test in question **SHOULD** trigger the logging.
- Angular services **MUST** always be mcoked for tests.

# Pre-anwsered Questions
If you have questions, review this pre-determined anwsers to see if they anwser any of them **BEFORE** presenting those questions to me:
- **ALWAYS** make sure to use the closest to real world implementation as possible.
- **ALWAYS** wrap component with parent component if required for the test.
- **ALWAYS** delete the old spec files for the tests that have been converted.
