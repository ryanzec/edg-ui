---
name: temp-refactor-components-directive-storybook-tests
description: Use this skill you are tasked to refactor vitest unit test to storybook tests for a component directory.
---
# Refactor Unit Tests

You are tasked to review any spec files in the references code and convert the tests to storybook tests in a `*.tests.stories.ts` file, if this file does not exist, you **MUST** create it.

You must also review the referenced code to make sure all test cases are handled by the to be created storybook test even if the existing unit tests don't cover everything.

Before planning the changes **ALWAYS**:
- make sure the existing tests follow the `.cursor/rules/testing/angular-component-directive-testing.md` rules.

# **CRITICAL**
- **NEVER** following **ANY** existing implemented code **EXPECT** for the reference in this file.
- **NEVER** add storybook tests to the development stories files (the one without the `*.tests*` in the file name).

# Pre-anwsered Questions
- **ALWAYS** make sure to use the closest to real world implementation as possible.
- **ALWAYS** wrap component with parent component if required for the test.
- **ALWAYS** delete the old spec files for the tests that have been converted.

# References To Follow
- `projects/shared-ui/src/lib/core/avatar`
- `projects/shared-ui/src/lib/core/button`
- `projects/shared-ui/src/lib/core/combobox`
