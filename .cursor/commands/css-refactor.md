You are tasked to investigate the referenced code to see if there is CSS / styling within that should be refactored to favor utility classes from `projects/shared-ui/src/lib/styles` over custom CSS rules and custom class names.

Make sure to utilize the following patterns:
- **ALWAYS** favor using utility classes from `projects/shared-ui/src/lib/styles` over writing custom CSS or creating custom class names, this applies to **ALL** code including components in `projects/shared-ui/src/lib/core`.
- **ONLY** keep custom CSS or custom class names when no combination of utility classes from `projects/shared-ui/src/lib/styles` can achieve the needed result.
- **NEVER** keep a custom class name when a combination of utility classes can achieve the same result.
- When no utility class exists for a needed style, **ALWAYS** ask whether to add the utility class to `projects/shared-ui/src/lib/styles` instead of keeping the custom CSS.
- **ONLY** keep a component css file for components in `projects/shared-ui/src/lib/core` when utility classes from `projects/shared-ui/src/lib/styles` cannot achieve the needed result.
- **ONLY** use utility classes that are available from `projects/shared-ui/src/lib/styles` (no tailwind utility classes).

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

The refactored CSS / styling **MUST** follow all the rules.

Use the following components as references for how the codebase does sub-components:
- `projects/shared-ui/src/lib/templates/integration/integration-card-available`
- `projects/shared-ui/src/lib/templates/integration/integration-card-configured`
- `projects/shared-ui/src/lib/templates/integration/integrations-list`

You **MUST** present your plan of which CSS rules / custom class names you recommend refactoring (and which utility classes will replace them) before making **ANY** code changes.
