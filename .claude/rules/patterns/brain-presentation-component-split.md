---
alwaysApply: true
---
# Brain Presentation Component Split Pattern

This is the pattern for splitting a component into a brain / presentation split whenever needed.

## Architecture Rules

### The Brain Directive / Component
- Location: Must be generated in the same directory as its core component counterpart with the file named `<component-name>-brain.ts` (e.g. `projects/shared-ui/src/lib/core/button/button-brain.ts`).
- Styles: Must contain absolutely zero styling. Do not link a CSS/SCSS file and keep the styles array empty.
- Responsibilities: Must handle all state management (using Angular Signals), event handling, and complex logic.
- Accessibility: Must manage all ARIA attributes and keyboard navigation using host bindings or strictly controlled template logic.
- API: Must be designed as a standalone component or directive that cleanly exposes its state and methods (e.g., using exportAs or modern Signal inputs/models) so the presentation layer can easily consume it.
- **ALWAYS** favor using a directive, **ONLY** use a component when **100%** needed.
- Do **NOT** keep empty methods.

### The Presentation Component
- Location: Remains in the original component's current directory.
- Logic: Must be stripped of complex business logic. It should only contain the properties necessary to bridge the Brain component's API to the template.
- Styling: Retains all the CSS/SCSS and structural HTML.
- Integration: Must import and internally utilize the new Brain component to function.

# What Must **ALWAYS** Go In An Angular Brain Directive / Component
The following logic / state must **ALWAYS** go into the brain directive / component:
- state management like opened / closed, checked, focused, active (but **NOT** limited to only those).
- event handlers (e.g., `keydown`, `click`).
- focus management (roving tabindex, trapping focus).
- accessibility attributes (ARIA roles, states, properties, accessibility labels).
- stylistic attributes that have accessibility or interaction concerns, like `orientation` or `direction` (but **NOT** limited to those).

# What Must **NEVER** Go In An Angular Brain Directive / Component
The following logic / state must **NEVER** go into the brain directive / component:
- sizing attributes.
- spacing attributes.
- color / theming attributes.
- animation / transition attributes.
- layout logic: while `orientation` or `direction` need to be in the brain to handle keyboard routing, the actual CSS application of `flex-col` vs `flex-row` MUST reside in the core helm component.
- security related functionality.
