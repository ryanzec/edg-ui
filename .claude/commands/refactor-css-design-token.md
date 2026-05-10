You are tasked to review the reference component along with their design tokens that may or my not exist in the `projects/shared-ui/src/lib/styles/tokens` directory and make sure the component to utilitizing the `.claude/rules/use-cases/css-local-variables.md` use case properly.

You are to **ALWAYS** verify:
- If there is a css variable, the css code should only set the css properties **ONCE** for that css variables.
- If the component has different variants for a css variable, then the css code **MUST** override the css variable value and **NEVER** apply the css property again.
- the css code **MUST** implement all variants (even whatever the default values are) as the default css variables are more placeholder than values to be used.

# References
You can **ONLY** reference the following code as good implementation examples, **DO NOT** reference any other code:
- `projects/shared-ui/src/lib/core/button` / `projects/shared-ui/src/lib/styles/tokens/button-tokens.css`
- `projects/shared-ui/src/lib/core/tag` / `projects/shared-ui/src/lib/styles/tokens/tag-tokens.css`
