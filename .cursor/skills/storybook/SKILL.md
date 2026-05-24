---
name: storybook
description: Use this skill whenever a new Angular component is being created, an existing component is being updated in a way that affects its visuals or inputs, or the user explicitly asks to create, modify, refactor, or review Storybook-related code (stories, showcase sections, live demo controls, test stories). Covers Storybook file structure, Showcase/LiveDemo/Tests story patterns, and keeping stories in sync with component inputs.
---
# Storybook

When an addition or change is made to a component that effects the the visuals of the component, Storybook **MUST** be updated to account for these changes.

## New Input
- Add a new section to the Showcase story for the new input.
- Add a control for the new input to the Live Demo story.

## New Input Value
- Update the existing section in the Showcase story with the new value.
- Update the control for the input to include the option to select the new input value.

# Live Demo Story
- The controls for the Live Demo story must **ALWAYS** use custom input components, NEVER native ones
