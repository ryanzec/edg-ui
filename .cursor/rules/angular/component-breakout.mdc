---
alwaysApply: true
---
# IMPORTANT: These rules override general typescript / angular rules
# General Angular Component Breakout Patterns
- **ONLY** suggest a sub component if it:
  - the component would be used public for stylistic reasons.
  - it can move a piece of complex logic to is own file reduce the complexity of the original file.
  - breaks up a really large component into smaller but still not trival component **AND** there are logic points of separation.
- If multiple components need access to input() values, you **MUST** place them in the top parent component and inject the parent component into the sub component to read those values to avoid input() duplications.

# References
Use the following components as references for how the codebase does sub-components:
- `projects/shared-ui/src/lib/core/avatar`
- `projects/shared-ui/src/lib/core/button`
- `projects/shared-ui/src/lib/core/card`
