---
alwaysApply: true
---
# Vitest Loop Context Pattern
 
If an expect is happing in the loop of a vitest test, you **MUST** use the second paramets to provicde context of the loop data for better failed test debugging.
 
# Example
```ts
it('returns false for every known feature flag', () => {
  for (const flag of allFeatureFlags) {
    expect(store.has(flag), `flag: ${flag}`).toBe(false);
  }
});
```
