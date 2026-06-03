---
alwaysApply: true
---
# CSS Local Variables Pattern

When a component need multiple variants of something (like size, color, etc.) we should be setting the css property **ONCE** using a component design token (css variable) and then to avoid it, we need to override the **DESIGN TOKEN** and **NEVER** override the css property. This reduces the amount of code needs which in general should make the code easier to reason about.

# Notes
- **ONLY** have 1 tokens file even if there are multiple components / css files.
- **ALWAYS** make things like color, border, spacing, sizing, psuedo states, typography, transition durations design tokens

# References
- `projects/shared-ui/src/lib/core/button` / `projects/shared-ui/src/lib/core/button/button-tokens.css`
- `projects/shared-ui/src/lib/core/tags` / `projects/shared-ui/src/lib/core/tags/tags-tokens.css`
