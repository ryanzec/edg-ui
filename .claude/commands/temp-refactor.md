<!-- 
Inputs:
- specific directory for code to review
-->
Role & Objective
You are an expert Angular developer specializing in the Headless UI pattern and modern Angular 21 architecture. Your task is to refactor an existing monolithic Angular component into two distinct parts: a "Brain" directive / component (pure logic/a11y) and a "Presentation" component (pure styling/markup).

Architecture Rules

1. The Brain Directive / Component
- Location: Must be generated in the /projects/shared-ui/brain directory.
- Styles: Must contain absolutely zero styling. Do not link a CSS/SCSS file and keep the styles array empty.
- Responsibilities: Must handle all state management (using Angular Signals), event handling, and complex logic.
- Accessibility: Must manage all ARIA attributes and keyboard navigation using host bindings or strictly controlled template logic.
- API: Must be designed as a standalone component or directive that cleanly exposes its state and methods (e.g., using exportAs or modern Signal inputs/models) so the presentation layer can easily consume it.
- Always favor using a directive or only use a component when 100% needed
- Do **NOT** keep empty methods

2. The Presentation Component
- Location: Remains in the original component's current directory.
- Logic: Must be stripped of complex business logic. It should only contain the properties necessary to bridge the Brain component's API to the template.
- Styling: Retains all the CSS/SCSS and structural HTML.
- Integration: Must import and internally utilize the new Brain component to function.

3. Reference Images
- If references images are provided, there are **ONLY** to be used as a **REFERENCE**. If we have core component for related functionality, use those component **AS IS**.

4. Refactor Stories
- Implement the story refactor work as defined in `.claude/commands/refactor-story-design-system.md`.

# MUST Follow Notes
These must **ALWAYS** be followed and override anything in the implementation notes referenced markdown file
- All scrolling functionality **MUST** use the `projects/shared-ui/src/lib/core/scroll-area` component.
- If a component can be used has a form input, you must create a Non Form Usage and Reactive Form Integration stories (like we do in `projects/shared-ui/src/lib/core/button-toggle/button-toggle.stories.ts`).
- All references to `md` for size / design tokens must **ALWAYS** use `base` instead.
- All values from the reference images and markdown notes are close, not exact, always use the existing base design token that closest match.
- If you add a new file in `projects/shared-ui/src/lib/styles/tokens`, you **MUST** add an import for it to `projects/shared-ui/src/lib/styles/styles.css`.
- The rules in `.claude/rules/use-cases/css-local-variables.md` **ALWAYS** override the implementation plan referenced markdown file.
- **ALWAYS** use the custom component over a native one if available regardless of what the referenced implementation markdown file says.

For any feature that is currently not supported. let each one as a question on we want to implement the new feature.

You **MUST** follow all the rules.

You **MUST** present your plan as to what new sub-component you recommend before make **ANY** code changes.
