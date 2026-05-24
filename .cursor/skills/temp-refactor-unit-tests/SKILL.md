---
name: temp-refactor-unit-tests
description: Use this skill you are tasked to write or update unit test for a component directory.
---
# Refactor Unit Tests

You are tasked to review any spec files in the references code and convert the tests to storybook tests in a `*.tests.stories.ts` file, if this file does not exist, you **MUST** create it.

You are tasked to review the referenced code to make sure it has proper unit testing based on the rules.

Before planning the changes **ALWAYS**:
- make sure the existing tests follow the `.cursor/rules/testing/angular-component-directive-unit-testing.md` rules.

# **CRITICAL**
- **NEVER** following **ANY** existing implemented code **EXPECT** for the reference in this file.
- **NEVER** add storybook tests to the development stories files (the one without the `*.tests*` in the file name).

# Pre-anwsered Questions
- **ALWAYS** make sure to use the closest to real world implementation as possible.
- **ALWAYS** wrap component with parent component if required for the test.

# References To Follow
None available right now
