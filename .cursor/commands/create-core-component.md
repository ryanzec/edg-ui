<!-- 
Inputs:
- specific directory for new component
-->
Role & Objective
You are an expert Angular developer specializing in the Headless UI pattern and modern Angular 21 architecture. Your task is to refactor an existing monolithic Angular component into two distinct parts: a "Brain" directive / component (pure logic/a11y) and a "Presentation" component (pure styling/markup).

You are tasked to create a new component in the specified directory.

Architecture Rules

1. The Brain Directive / Component
- Location: Must be generated in the `projects/shared-ui/src/lib/brain` directory.
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

# Important Use Case Patterns
- `.claude/rules/use-cases/angular-content-projection.md`
- `.claude/rules/use-cases/css-local-variables.md`
- `.claude/rules/use-cases/needing-multiple-ng-content-element.md`

Before finishing the plan to be presented, **MAKE SURE** to account for the following:
- Follow **ALL* rules
- the style implement following the same style as the existing components.
- The standard `Default` / `Live Demo` / `Showcase` stories are accounted for (and any additional stories the might be needed).
- **ALL** a11y related functionality for the given compnent is account for
- **ALL** common / standard keyboard shortcut are account for and **EXPLICITLY** listed in the plan.
- The new component is accounted for in the `projects/shared-ui/src/lib/templates/all-components`.

You **MUST** follow all the rules.

You **MUST** present your plan as to what new sub-component you recommend before make **ANY** code changes.
