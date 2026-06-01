---
name: component-development
description: Use this skill whenever the user asks to create, modify, refactor, review, style, or otherwise work on an Angular component, directive, brain component, or core component. Covers component architecture, brain/presentation split, content projection, output-listener detection, CSS variables, and Storybook updates.
---

# Definitions
- Brain Component - A foundation low level component devoid of styling, colocated with its core counterpart in `projects/shared-ui/src/lib/core/<component-name>/` and named `<component-name>-brain.ts` (e.g. `projects/shared-ui/src/lib/core/button/button-brain.ts`).
- Core Component - A foundation low level component located in `projects/shared-ui/src/lib/core` that sometimes is paired with a brain component (which now lives in the same folder).

# IMPORTANT Component Coding Patterns
- `.cursor/rules/patterns/angular-content-projection.md`
- `.cursor/rules/patterns/css-local-variables.md`
- `.cursor/rules/patterns/detected-output-has-listener.md`
- `.cursor/rules/patterns/needing-multiple-ng-content-element.md`

# Reuse Protocol
- You are to **ALWAYS** use the `@angular/cdk` package over native or customer solution when possible.
- You are to **ALWAYS** re-use functionality from `projects/shared-ui/src/lib/core` over using bespoken / inline components when possible.

# Core Component

If the component in in the `` directory, it **MUST** follow the `` pattern.

# CRITICAL Rules
- **ALWAYS** choose inference over duplication of inputs (instead of having both a `clickable` input() and `clicked` output(), just have a clicked subject+ `outputFromObservable()` to be able to infer `clickable`)
- **ALWAYS** list out bespoken components that are going to be made a verity those bespoken component are good to be made.

# **REQUIRED** End Review

The following must be reviewed after finishing the task before the task can be considered complete:

- **ALWAYS** make sure if a token file has been add or modified in `projects/shared-ui/src/lib/core`, it is properly imported in `projects/shared-ui/src/lib/core/tokens.css`
- Is there any code for this component in `projects/shared-ui/src/lib/core` and if so, should any of that code be broken out into a brain directive colocated alongside it in the same `projects/shared-ui/src/lib/core/<component-name>/` directory (file named `<component-name>-brain.ts`)?
- If there is logic in a component that is being used to handle a missing feature in a child component that is being used, **ALWAYS** ask if that should be done or if the child component needs a refactor so the use case can be manually checked
- `::ng-deep` should **NEVER** be used.
- Any questionable logic should be pointed out to be verified it is intended.
