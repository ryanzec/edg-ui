<!-- 
Inputs:
- specific directory for code to review
-->
You are tasked to investigate the referenced code to see if the inputs that are the following simple values:
- string
- boolean
- number
Are being added to the host application as `[data-{input name}]` attributes. Whether or not they are being used is not important, these are there as hooks for higher level components to customized if needed.

The following inputs should not have data attributes:
- icons
- pagination data
- native attributes (like `readonly`, `disabled`)
- `aria-*` equivlants

You **MUST** follow all the rules.

You **MUST** present your plan as to what new sub-coomponent you recommend before make **ANY** code changes.
