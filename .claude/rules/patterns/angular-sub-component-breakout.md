---
alwaysApply: true
---
# Angular Sub-component Breakout Pattern

There are times when a component should be broken out into smaller components / services to make it more maintainable.

## Components

Create sub-components in the same directory as the main component when:
- The component needs to be available as part of the public api.
- The main component is too large, making it harder to maintain.
- A section of the main component is repeated multiple times.

## Service

When component state or logic needs to be shared across different sub-components:
- Create an internal implementation-details store that is **NEVER** provided in root (named `{component-name}-store.ts`).
- Add that store to the main component's `providers`.
- Inject it into the sub-components that need it.

## Exporting Sub-components / Services Publicly

- **ONLY** export components that are part of the public api.
- **NEVER** export components / services that are internal implementation details.

# Example
A card component might have the following in the `/card` directory:
- `card.ts`
- `card-header.ts`
- `card-content.ts`
- `card-footer.ts`
- `card-image.ts`
- `card-icon.ts`
- `card-store.ts`
