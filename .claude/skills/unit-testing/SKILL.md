---
name: unit-testing
description: Use this skill you are tasked to write tests for angular components or angular directives.
---
# Angular Storybook Testing

# **CRITICAL**
- **ONLY** write vitest unit tests for non-angular code or angular code that are **NOT** components or directives, **NO** angular components or angular directives can have vitest unit tests.

You are tasked to review the referenced code make sure there is properly unit test coverage via vitest unit tests.

Before planning the changes **ALWAYS**:
- Make sure the existing tests follow the `.claude/rules/testing/unit-testing.md` rules.

# Pre-anwsered Questions
- **ALWAYS** make sure to use the closest to real world implementation as possible.
- **ALWAYS** wrap component with parent component if required for the test.
- **ALWAYS** delete the old spec files for the tests that have been converted.

# References To Follow
- `projects/shared-ui/src/lib/core/notification-manager/notification-manager.spec.ts`
