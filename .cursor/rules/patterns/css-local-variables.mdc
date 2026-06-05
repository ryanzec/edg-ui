---
alwaysApply: true
---
# CSS Local Variables Pattern

When a component needs multiple variants of something (size, color, etc.), drive the variants through a component design token (CSS variable) rather than the raw CSS property. This reduces the amount of code needed, which makes it easier to reason about.

- Set the CSS property **ONCE** using a component design token (CSS variable).
- To vary it, override the **DESIGN TOKEN** and **NEVER** override the CSS property.

# Notes
- **ONLY** have 1 tokens file even if there are multiple components / css files.
- **ALWAYS** make things like color, border, spacing, sizing, pseudo states, typography, and transition durations design tokens.

# References
- `projects/shared-ui/src/lib/core/button` / `projects/shared-ui/src/lib/core/button/button-tokens.css`
- `projects/shared-ui/src/lib/core/tags` / `projects/shared-ui/src/lib/core/tags/tags-tokens.css`
