---
name: angular-storybook-testing
description: Use this skill you are tasked to write tests for angular components or angular directives.
---
# Angular Storybook Testing

# **CRITICAL**
- **ONLY** write storybook tests for component and directives, **NO** other type of angular code can have storybook tests.
- **NEVER** add storybook tests to the development stories files (the one without the `*.tests*` in the file name).

You are tasked to review the referenced code make sure all non-purely stylistic functionality (logic, a11y, etc.) are covered by the storybook tests file.

Before planning the changes **ALWAYS**:
- Make sure the existing tests follow the `.cursor/rules/testing/angular-storybook-testing.md` rules.


# Pre-anwsered Questions
- **ALWAYS** make sure to use the closest to real world implementation as possible.
- **ALWAYS** wrap component with parent component if required for the test.
- **ALWAYS** delete the old spec files for the tests that have been converted. 

# References To Follow
- `projects/shared-ui/src/lib/core/avatar/avatar.tests.stories.ts`
- `projects/shared-ui/src/lib/core/button/button.tests.stories.ts`
- `projects/shared-ui/src/lib/core/combobox/combobox.tests.stories.ts`
