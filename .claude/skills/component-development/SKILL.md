---
name: component-development
description: Use this skill when being prompted to work on an Angular component.
---

# Definitions
- Brain Component - A foundation loe level component devoid of styling located in `projects/shared-ui/src/lib/brain`. 
- Core Component - A foundation low level component located in `projects/shared-ui/src/lib/core` that sometimes is paired with brain component.

# IMPORTANT Componen tUse Case Patterns
- `.claude/rules/use-cases/angular-content-projection.md`
- `.claude/rules/use-cases/css-local-variables.md`
- `.claude/rules/use-cases/detected-output-has-listener.md`
- `.claude/rules/use-cases/needing-multiple-ng-content-element.md`

# Core Component

The rules in this section must **ONLY** be applied to core components.

## Architecture Rules

### The Brain Directive / Component
- Location: Must be generated in the `projects/shared-ui/src/lib/brain` directory.
- Styles: Must contain absolutely zero styling. Do not link a CSS/SCSS file and keep the styles array empty.
- Responsibilities: Must handle all state management (using Angular Signals), event handling, and complex logic.
- Accessibility: Must manage all ARIA attributes and keyboard navigation using host bindings or strictly controlled template logic.
- API: Must be designed as a standalone component or directive that cleanly exposes its state and methods (e.g., using exportAs or modern Signal inputs/models) so the presentation layer can easily consume it.
- Always favor using a directive or only use a component when 100% needed
- Do **NOT** keep empty methods

### The Presentation Component
- Location: Remains in the original component's current directory.
- Logic: Must be stripped of complex business logic. It should only contain the properties necessary to bridge the Brain component's API to the template.
- Styling: Retains all the CSS/SCSS and structural HTML.
- Integration: Must import and internally utilize the new Brain component to function.

# Storybook Management

When an addition or change is made to a component that effects the the visuals of the component, Storybook **MUST** be updated to account for these changes.

## New Input
- Add a new section to the Showcase story for the new input.
- Add a control for the new input to the Live Demo story.

## New Input Value
- Update the existing section in the Showcase story with the new value.
- Update the control for the input to include the option to select the new input value.
