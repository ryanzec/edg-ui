---
alwaysApply: true
---
# IMPORTANT: These rules override general typescript / angular rules
# General Storybook Patterns
- Filing naming patterns:
    - `{DIRECTORY_NAME}.stories.ts` - Development level stories for working in isolation.
    - `{DIRECTORY_NAME}.tests.stories.ts` - Test level stories for running storybook is testing mode through the command line.
    - `{DIRECTORY_NAME}.use-cases.stories.ts` - Use case level stories for calling out specific use cases for the component that are not obviously otherwise.
- **ALWAYS** split out general stories from stories specifically for using Storybook testing functionality into seperate files.
- Storybook files specific for using storybook testing feature must end with `.tests.stories.ts` and its title must end with `/Tests`.
- **ALWAYS** create a storybook file (`*.stories.ts`) in the same folder as the component with stories for all the unique state, DO NOT create any play / test related stories in this file.
- If a storkbook test need to select a dom element, use the `data-testid`
- Tests must **ALWAYS** simulate the the interaction the user would take, **NEVER** call component apis directly.
- **ALWAYS** use custom components from `projects/shared-ui/src/lib/core` or native html elements instead of creating inline components.
- **NEVER** add TSDoc for story code, **NEVER**.
- **ALWAYS** create a seperate story for each input that control the visual / function nature of the code but have all variants of the input in the one story.
- **ALWAYS** create a seperate story for each combination of variants that have **EXPLICIT** logic between them.
- **ALWAYS** add `tags: ['autodocs']` for component and directive stories.
- **ALWAYS** use the follow component to wrap stroybook examples:
  - `projects/shared-ui/src/lib/private/storybook-example-container`
  - `projects/shared-ui/src/lib/private/storybook-example-container-section`
- **ALWAYS** wrap the docs description content in a `<div class="docs-top-level-overview">...</div>` block.
- **ALWAYS** create a first story called `Default` story with full controls for the autodocs story
- **ONLY** use `inject()` to inject services.
- **ALWAYS** combine development stories (`*.stories.ts`) into one file when a directory has multiple components.
- **ALWAYS** use `.toISO()` when rendering dates for debugging in stories.
- **ALWAYS** define `moduleMetadata` when creating a storybook stories that uses the Story's render method
- **ONLY** write play / tests stories in the tests stories file.
- **NEVER** export component created in storybook files

# References for **PATTERNS** to follow in structuring storybook file for components:
- `projects/shared-ui/src/lib/core/button/button.stories.ts`
- `projects/shared-ui/src/lib/core/card/card.stories.ts`
- 
# References for **PATTERNS** to follow in structuring storybook file for directives:
- `projects/shared-ui/src/lib/core/sortable-directive/sortable-directive.stories.ts`

# References for **PATTERNS** to follow in structuring storybook file for servives:
- `projects/shared-ui/src/lib/core/sorting-store/sorting-store.stories.ts`
