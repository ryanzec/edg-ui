You are tasked to investigate the referenced code to see if there is code within that should be pulled out into it own sub-component (container within the same directory) to utilize the composition patter over input configuration.

Make sure to utilize the following patterns:
- **ONLY** suggest a sub component if it:
  - the component would be used public for stylistic reasons.
  - it can move a piece of complex logic to is own file reduce the complexity of the original file.
  - breaks up a really large component into smaller but still not trival component **AND** there are logic points of separation.
- If multiple components need access to input() values, you **MUST** place them in the top parent component and inject the parent component into the sub component to read those values to avoid input() duplications.
- Make sure existing sub-components are properly brokn out.

Use the following components as references for how the codebase does sub-components:
- `projects/shared-ui/src/lib/core/avatar`
- `projects/shared-ui/src/lib/core/button`
- `projects/shared-ui/src/lib/core/card`

The new sub-components **MUST** follow all the rules.

You **MUST** present your plan as to what new sub-coomponent you recommend before make **ANY** code changes.
