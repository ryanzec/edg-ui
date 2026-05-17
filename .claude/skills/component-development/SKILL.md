---
name: component-development
description: Use this skill whenever the user asks to create, modify, refactor, review, style, or otherwise work on an Angular component, directive, brain component, or core component. Covers component architecture, brain/presentation split, content projection, output-listener detection, CSS variables, and Storybook updates.
---

# Definitions
- Brain Component - A foundation loe level component devoid of styling located in `projects/shared-ui/src/lib/brain`. 
- Core Component - A foundation low level component located in `projects/shared-ui/src/lib/core` that sometimes is paired with brain component.

# IMPORTANT Component Use Case Patterns
- `.claude/rules/use-cases/angular-content-projection.md`
- `.claude/rules/use-cases/css-local-variables.md`
- `.claude/rules/use-cases/detected-output-has-listener.md`
- `.claude/rules/use-cases/needing-multiple-ng-content-element.md`

# Reuse Protocol
- You are to **ALWAYS** use the `@angular/cdk` package over native or customer solution when possible.
- You are to **ALWAYS** re-use functionality from `projects/shared-ui/src/lib/core` over using bespoken / inline components when possible.

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

# General Rules
- **ALWAYS** choose inference over duplication of inputs (instead of having both a `clickable` input() and `clicked` output(), just have a clicked subject+ `outputFromObservable()` to be able to infer `clickable`)

# REVIEW AT THE END
- **ALWAYS** make sure if a token file has been add or modified in `projects/shared-ui/src/lib/core`, it is properly imported in `projects/shared-ui/src/lib/core/tokens.css`
- **ALWAYS** update the components `llm.md` file (or add one in the components main directory, eg. `projects/shared-ui/src/lib/core/card/llm/md`) the details the rule in how to use the component highly optomized for LLMs.
