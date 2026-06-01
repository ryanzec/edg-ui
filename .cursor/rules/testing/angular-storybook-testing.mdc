---
alwaysApply: true
---
# IMPORTANT: These rules override general typescript / angular rules
# Angular Storybook Testing Patterns
- **NEVER** create storybook tests services directly (services can be used if the component / directive is using the services, but the component / directive must be the direct thing being tested).
- **ALWAYS** test brain component through the primary component whenever possible
- **ONLY** create a custom component to test a directive when there is no component that can be used to test the directive functionality.
- When testing subcomponents of the primary component, **ALWAYS** testing them through the primary component and **NEVER** independently.
- When timing related functionality needs to be tested, **ALWAYS** use the `waitFor` api.
- **ALWAYS** use readout string pattern instead of structured json to avoid whitespace brittleness.
- When testing reactive form related functionality, **ALWAYS** create a specific shell for testing that functionality.
- Storybook tests must focus on **LOGICAL** and **A11Y** functionality and **NOT** styling concerns.
- **NEVER** validation any logging from `logManager` in tests.
