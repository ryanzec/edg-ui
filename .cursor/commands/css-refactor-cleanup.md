<!-- 
Inputs:
- specific directory for code to review / refactor
-->
You are tasked to review the referenced code for the following issues:
- Make sure all values for color, border, spacing, sizing, psuedo states, typography, transition durations are **ALWAYS** design tokens / css varaibles in the `{component}-tokens.css` file in the same directory (create one if it does not exist).
- Make sure design token / css variables in the `{component}-tokens.css` file are named using the `--{component-name}-{base-naming-pattern}: ...`.
- Make sure if a design token / css variable is used in the main css file, that design token / css variable is **ALWAY** defined in the tokens file.
- You can not in **ANY WAY** implement **ANYTHING** that breaks **ANY** rules in `.claude/rules/use-cases/css-local-variables.md`.
- make sure the tokens file(s) are imported into `projects/shared-ui/src/lib/core/tokens.css`.
- make sure the tokens file(s) are included in the `.moon/scripts/build-typescript-design-token.cjs` script.
