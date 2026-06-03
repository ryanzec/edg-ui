---
name: storybook-development
description: Use this skill whenever a new Angular component is being created, an existing component is being updated in a way that affects its visuals or inputs, or the user explicitly asks to create, modify, refactor, or review Storybook-related code (stories, showcase sections, live demo controls, test stories). Covers Storybook file structure, Showcase/LiveDemo/Tests story patterns, and keeping stories in sync with component inputs.
---
# Storybook Development Skill

When new components are create or an addition or change is made to an existing component that effects the the visuals of the component, Storybook **MUST** be added / updated to account for these changes.

## New Input

- Add a new section to the Showcase story for the new input.
- Add a control for the new input to the Live Demo story.

## New Input Value
-
Update the existing section in the Showcase story with the new value.
- Update the control for the input to include the option to select the new input value.

# Live Demo Story

- **ALWAYS** create live story demo using the `projects/shared-ui/src/lib/example/design-system-demo` components that allows the single section to control all input that have an effect on the visual / functionality of the component.
- The controls for the Live Demo story must **ALWAYS** use custom input components, NEVER native ones.
- **ALWAYS** make sure that the live demo has controls for any input that effect the visual output of the component.

# Showcase Story

- **ALWAYS** use the `projects/shared-ui/src/lib/example/design-system-demo` components for storybook examples.
- **ALWAYS** create a Showcase story that show all different inputs the component can have with each input having its own `org-design-system-demo` section (though it can use other input if there is an interact with the main one for that input), see `projects/shared-ui/src/lib/core/button/button.stories.ts`.
- When a new variant or variant option is added / removed, make sure to update the showcase story accordingly.

# General Rules
- Filing naming patterns is `{DIRECTORY_NAME}.stories.ts` in the same folder as the component for development level stories for working in isolation and testing use cases.
- **NEVER** write any stroybook tests.
- **ALWAYS** use custom components from `projects/shared-ui/src/lib/core` or native html elements instead of creating inline components.
- **NEVER** add TSDoc for story code, **NEVER**.
- **ALWAYS** add `tags: ['autodocs']` for component and directive stories.
- **ALWAYS** create a first story called `Default` story with full controls for the autodocs story
- **ONLY** use `inject()` to inject services.
- **ALWAYS** combine development stories (`*.stories.ts`) into one file when a directory has multiple components.
- **ALWAYS** use `.toISO()` when rendering dates for debugging in stories.
- **ALWAYS** define `moduleMetadata` when creating a storybook stories that uses the Story's render method
- **NEVER** export component created in storybook files
