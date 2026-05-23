---
alwaysApply: true
---
# IMPORTANT: These rules override general typescript rules

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

# Design Token / CSS Variables Patterns:
- any component that can have variants that effect css property must **ALWAYS** use design tokens (css variables) for that as a placeholder value in a component design token file in `projects/shared-ui/src/lib/styles/animations.css`.
- the css code **MUST** implement all variants (even whatever the default values are) as the default css variables are more placeholders than values to be used.

# Styling Patterns
- **NEVER** add styling to brain directives (files named `*-brain.ts` colocated inside `projects/shared-ui/src/lib/core/<component-name>/`).
- **NEVER** add specific values units for height / widths to component is `projects/shared-ui/src/lib/core` (`px`, `cm`, `mm`, `in`, `pt`, `pc`), they should **ALWAYS** grow based on the content inside them or use relatively values (`%`, `em`, `rem`, `vh`, `vw`, `vmin`, `vmax`, `ch`, `ex`, `lh`, `rlh`, `vi`, `vb`).
- If you intend to set an explicit height / width for any component, **ALWAY** make the a question **BEFORE** writing any code.
- **ALWAYS** use css files for styling components and directives in `projects/shared-ui/src/lib/core` **EXCEPT** for `*stories*` files.
- **ALWAYS** use css variables from `projects/shared-ui/src/lib/styles/base-tokens.css` or the `{component-name}-tokens.css` file (co-located with the component in `projects/shared-ui/src/lib/core/{component-name}/`) for styling in css files.
- **ALWAYS** favor css utility based styling for component **OUTSIDE** of `projects/shared-ui/src/lib/core`.

# Layer Patterns
- **ALWAYS** wrap css in general component css files (NOT variables component cssfiles) in `@layer components {...}` for components in `projects/shared-ui/src/lib/core`.
- **ALWAYS** wrap css in general component css files (NOT variables component cssfiles) in `@layer application {...}` for components outside of `projects/shared-ui/src/lib/core`.

# General Styling Patterns
- If you see what you think is a tailwind css, check to see if those css classes are in any of the custom utilities in `projects/shared-ui/src/lib/styles` as tailwind utility classes **ARE NOT USE**, if the utility class does not exist, **ALWAYS** ask if it should be added to an existing one or a new utility class file.
- **NEVER** manually apply resets as we include tailwind's preflight to reset default browser styles.
- **ONLY** use utility classes that are available from `projects/shared-ui/src/lib/styles`.
- **ONLY** write custom CSS or create custom class names when no combination of utility classes from `projects/shared-ui/src/lib/styles` can achieve the needed result.
- When no utility class exists for a needed style, **ALWAYS** ask whether to add the utility class to `projects/shared-ui/src/lib/styles` instead of writing custom CSS.
- **ALWAYS** use reference images as a rough reference to the structure and over goal but not end goal pixel perfect expection, **ALWAYS** use existing colors and spaces that best matches when is in the image.
- **ALWAYS** prioritize written instruction over reference images.
- **ALWAYS** use flexbox for aligning and spacing a group of elements.
- **ALWAYS** omit passing values to component inputs that has a default value other than `null` / `undefined`.
- **ALWAYS** use `var()` when defining custom css variables
- **ONLY** use system level design tokens in css utility classes
- **ALWAYS** use `aria-*` when available and then fallback to `data-*` attributes for component styling that is based on an input having the input value be the `data-*` attribute value, see `projects/shared-ui/src/lib/core/box` as a reference.
- **ALWAYS** use the `.dark` for defining dark mode colors.
- **ALWAYS** use `/* ... */` to comment is CSS.
- **ONLY** use negative margins as a LAST resort.
- **ALWAYS** use `focus-visible` over `focus` pseduo selector.
- **ALWAYS** use thing like background color change when styling `focus` elements for accessability.
- **ALWAYS** prevent states based styles from being applied to components when it is disabled.
- **ALWAYS** use `rem` over `px` for css values.
- **ONLY** add a comment at the end of the line when using **RAW** `rem` values that just has the `px` value assuming a `1rem` = `16px`, **DONT** do this when using a variable that is a `REM` value.
- **ALWAYS** place ALL @keyframes definations in `projects/shared-ui/src/lib/animations.css`.
- **NEVER** use the style tag unless the value NEEDS to be dynamic based on typescript code.=
- **NEVER** add animations or transitions unless **EXPLICITLY** asked for.
- **NEVER** use box shadows unless **EXPLICITLY** asked for.
- **NEVER** use margin to space element within a container.
- **NEVER** use ring / outline / box-shadow styles other than to remove it **OR** if it is for a11y.
- **NEVER** use a default values when using `var(...)`.
- **ALWAYS** make css class name as short as needed but still descripitive since Angular handle encapulation to avoid naming conflict so `header` instead of `integration-card-configured-header`.
- **ALWAYS** make sure to update the `.moon/scripts/build-typescript-design-token.cjs` script when modifying css variables in any `*-tokens.css` file.
- **ALWAYS** make sure to run `moon :build-design-tokens` when css variables in any `*-tokens.css` file are modified in any way (added / removed / changed).
- **ALWAYS** prefix component specific design token names with `{component-name}-*` following base the standard base token naming.
