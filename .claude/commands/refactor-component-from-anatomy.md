<!-- 
Inputs:
- specific directory for new component
- image of the anatomy of the new component
-->
You are tasked to refactor the reference component using the referenced image as a reference point to determine what things are different for the refactor. The purrpose of the refactor is to make sure all functionality in cupport in the component being refactored based on the anamtomy.

# Design Tokens

You are to create a new component tokens css file in `projects/shared-ui/src/lib/styles` or update the existing one if needed.

If the image reference design tokens / css variables that are not available, you can create them in the component tokens css files **ALWAYS** using the base tokens from `projects/shared-ui/src/lib/styles/tokens/base-tokens.css` and the value for the component tokens (if a value can't be found, use the closest value that is available).

# Storybook

**ALWAYS** update stories based on the changes made. 

# MUST ALWAYS FOLLOW
- **ALL** rules in this repository **ALWAY** override what is in the visual guide if there is a conflict.
- **ALWAYS** present the list of things that are being added / removed / changed **BEFORE** making any chances to confirm.
- **ALWAYS** use `projects/shared-ui/src/lib/core/scroll-area` for any scrolling content regardless of what the reference image might show.
- For font size related styling, the tokens in `` **ALWAYS** override the referenced images
