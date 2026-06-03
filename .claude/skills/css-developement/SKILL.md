---
name: css-development
description: Use this skill whenever working on CSS or styling that affects an Angular component/directive. Covers the utility-class vs CSS-file split, design-token (CSS variable) variants, `@layer` wrapping, rem/relative sizing, dark mode, and naming/abbreviation conventions.
---
# CSS Development Skill

# Prework Validation
- If you intend to set an explicit height / width for any component, **ALWAY** make that a question **BEFORE** writing any code.
- If you feel a new utility css files / class needs to be added to ``, **ALWAYS** make that a question **BEFORE** adding it so I can validate it is in fact needed.

You are to **ALLWAY** do the following before performing any work:
- **ALWAYS** confirm when you intend to use a non-standard / discouraged pattern before implementing such a pattern.

# CSS Files
The following types of styles must **ALWAYS** be placed in `.css` files:
- viewport / container media queries.
- pseudo selectors (:hover, :focus, :active, :first-child, etc.).
- dynamic values based on component input (which use data-* attributes)
- one off values

# Utility Classes
Utility css classes **MUST** be used for all other styles:
- display (flex, block, inline-flex, etc.).
- spacing (margin, padding, etc.).
- sizing (width, height, etc.).
- font (sizing, weight, color, etc.).
- border (width, style, color, etc.).
- background color.
- z-index
- etc.

# IMPORTANT NOTES:
- when setting a css variable to 0, if that is designed to be used with a unit value of `rem` or something like that, **ALWAYS** add the unit (need for `calc()`'s to work properly).
- when there are sub-components, **ALWAYS** use `host-context()` if you need to style based on an attribute that is already needed on the parent component instead of injecting and adding the data attribute to the sub component so the parent is the single source of thruth.
- While tailwind is a dependency, you **CAN"T** use all tailwind utility classes, you can **ONLY** use the utility classes that are available in one of the `*-utility.css` files from `projects/shared-ui/src/lib/styles`.

# Design Token / CSS Variables Patterns:
- any component that can have variants that effect css property must **ALWAYS** use design tokens (css variables) for that as a placeholder value in a component design token file in `projects/shared-ui/src/lib/styles/animations.css`.
- the css code **MUST** implement all variants (even whatever the default values are) as the default css variables are more placeholders than values to be used.

# CSS Layer Patterns
- **ALWAYS** wrap css in general component css files (NOT variables component cssfiles) in `@layer components {...}` for components in `projects/shared-ui/src/lib/core`.
- **ALWAYS** wrap css in general component css files (NOT variables component cssfiles) in `@layer application {...}` for components outside of `projects/shared-ui/src/lib/core`.

# General Rules
- **NEVER** manually apply resets as we include tailwind's preflight to reset default browser styles.
- **NEVER** add specific values units for height / widths to component is `projects/shared-ui/src/lib/core` (`px`, `cm`, `mm`, `in`, `pt`, `pc`), they should **ALWAYS** grow based on the content inside them or use relatively values (`%`, `em`, `rem`, `vh`, `vw`, `vmin`, `vmax`, `ch`, `ex`, `lh`, `rlh`, `vi`, `vb`).
- **ALWAYS** use css variables from `projects/shared-ui/src/lib/styles/base-tokens.css` or the `{component-name}-tokens.css` file (co-located with the component in `projects/shared-ui/src/lib/core/{component-name}/`) for styling in css files.
- - **ONLY** write custom CSS or create custom class names when no combination of utility classes from `projects/shared-ui/src/lib/styles` can achieve the needed result.
- **ALWAYS** use flexbox for aligning and spacing a group of elements.
- **ALWAYS** use `var()` when defining custom css variables
- **ONLY** use system level design tokens in css utility classes
- **ALWAYS** use `aria-*` when available and then fallback to `data-*` attributes for component styling that is based on an input having the input value be the `data-*` attribute value, see `projects/shared-ui/src/lib/core/box` as a reference.
- **ALWAYS** use the `.dark` for defining dark mode colors.
- **ALWAYS** use `/* ... */` to comment is CSS.
- **ONLY** use negative margins as a **LAST** resort.
- **ALWAYS** use `focus-visible` over `focus` pseduo selector.
- **ALWAYS** use thing like background color change when styling `focus` elements for accessability.
- **ALWAYS** prevent states based styles from being applied to components when it is disabled.
- **ALWAYS** use `rem` over `px` for css values.
- **ONLY** add a comment at the end of the line when using **RAW** `rem` values that just has the `px` value assuming a `1rem` = `16px`, **DONT** do this when using a variable that is a `REM` value.
- **ALWAYS** place ALL @keyframes definations in `projects/shared-ui/src/lib/animations.css`.
- **NEVER** add animations or transitions unless **EXPLICITLY** asked for.
- **NEVER** use box shadows unless **EXPLICITLY** asked for.
- **NEVER** use margin to space element within a container.
- **NEVER** use a default values when using `var(...)`.
- **ALWAYS** make css class name as short as needed but still descripitive since Angular handle encapulation to avoid naming conflict so `header` instead of `integration-card-configured-header`.
- **ALWAYS** make sure to update the `.moon/scripts/build-typescript-design-token.cjs` script when modifying css variables in any `*-tokens.css` file.
- **ALWAYS** make sure to run `moon run :build-design-tokens` when css variables in any `*-tokens.css` file are modified in any way (added / removed / changed).
- **ALWAYS** prefix component specific design token names with `{component-name}-*` following base the standard base token naming.

# **REQUIRED** End Review

The following must be reviewed after finishing the task before the task can be considered complete:

- Review for any glaring issues.


# Abbreviation Patterns

**NOTE:** If an update to this list is made, the `.claude/skills/component-development/SKILL.md` **MUST** also be updated.

- **ALWAYS** use abbreviations for initialisms.
- These are the non-initialism abbreviations that css based code (css classes, selectors, variables, etc.) must **ALWAYS** and **ONLY** use:
  - `xs` instead of `extra small`.
  - `sm` instead of `small`.
  - `md` instead of `medium`.
  - `lg` instead of `large`.
  - `xl` instead of `extra large`.
  - `bg` instead of `background`.
  - `fg` instead of `foreground`.
