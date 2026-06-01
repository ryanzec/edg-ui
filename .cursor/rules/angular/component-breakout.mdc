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

# Example
A card component depend on the supported feature might have the following compone the the `/card` directory:
- `card.ts`
- `card-header.ts`
- `card-content.ts`
- `card-footer.ts`
- `card-image.ts`
- `card-icon.ts`
