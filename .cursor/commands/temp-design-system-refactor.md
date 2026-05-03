You are to use the referenced implementation plan document to refactor the referenced component. By refactor, I mean:
- stylistically it should be **COMPLETELY** refactored, delete the existing css code if that is easier
- functionality should remain however if there are difference in function that in the the plan and not implemented, that **MUST** be added / updated
- If there is missing functionality in the plan that is current implementated in the component, flag those as question that I can anwser if we want to keep or now

All rules override anything in the implementation plan if there is a conflict for coding style / patterns / Angular best practices.

These rules also override anything in the implemetation plan:
- If a component has customer design tokens / css variables, they need to be added as there own file in `projects/shared-ui/src/lib/styles/variables` named in the pattern of `{component-name}-tokens.css`
- If css is referencing a class name that can just be written using the host, use the host

Things to double check (**NEVER** ask about these):
- update the `projects/shared-ui/src/lib/styles/styles.css` to import any new tokens.css files that are added
- update the `.moon/scripts/build-typescript-design-token.cjs` to include any new tokens.css files that are added
- if an icon is being request to use that is not include, **ALWAYS** add it
- **ALWAYS** use the current lucide package and **NEVER** imbed svg directly
- **ALWAYS** keep `data-*` regardles of value
- **ALWAYS** ask if the plan includes creating something in a component custom that could use an existing component, point this out in a question
- **ALWAYS** ask if you see something that should be a sub-component but not called out as one in the plan
