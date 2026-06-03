---
alwaysApply: true
---
# Angular Sub-component Breakout Pattern

There are times when a component should be broken out into smaller components / services to help it be more maintainable

## Components

You will want to create sub-components in the same directory as the main component when:
- The component need to be available as part of the public api.
- The main component is too large making maintaining harder to do.
- A section of the main components is repeated multiple times.

## Service

If there is component state or logic that needs to be shared across different sub-component, you are to create a internal implementation details store that is **NEVER** provided in root (name `{component-name}-store.ts`), have the main component add that to its `providers` and then the sub-components that need it can inject it. 

## Exporting Sub-components / services Publicly

You are to **ONLY** export the components that are part of the public api and **NEVER** export components / services that are internal implementation details.

# Example
A card component depend on the supported feature might have the following compone the the `/card` directory:
- `card.ts`
- `card-header.ts`
- `card-content.ts`
- `card-footer.ts`
- `card-image.ts`
- `card-icon.ts`
- `card-store.ts`
