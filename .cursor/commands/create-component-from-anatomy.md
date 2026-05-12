<!-- 
Inputs:
- specific directory for new component
- image of the anatomy of the new component
-->
You are tasked to create a new component in the referenced directory using the referenced image as a guide.

If this component is in `projects/shared-ui/src/lib/core` then you must **ALWAYS** include the context from `.claude/commands/create-core-component.md` but if it is **NOT** in that directory, **NEVER** use the context from `claude/commands/create-core-component.md`.

# Design Tokens

You are to create a new component tokens css file co-located with the component in `projects/shared-ui/src/lib/core/{component-name}/` (and add an import for it in `projects/shared-ui/src/lib/core/tokens.css`) if needed.

If the image reference design tokens / css variables that are not available, you can create them in the component tokens css files **ALWAYS** using the base tokens from `projects/shared-ui/src/lib/styles/base-tokens.css` and the value for the component tokens (if a value can't be found, use the closest value that is available).

# Storybook

- **ALWAYS** create stories for the new component.
- **NEVER** create a story that that maps to the referenced anatomy image, the image is **ONLY** provided for context to the implementation.

# MUST ALWAYS FOLLOW
- **ALL** rules in this repository **ALWAY** override what is in the visual guide if there is a conflict.
- **ALWAYS** use `projects/shared-ui/src/lib/core/scroll-area` for any scrolling content regardless of what the reference image might show
