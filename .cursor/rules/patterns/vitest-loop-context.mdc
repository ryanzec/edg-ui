---
alwaysApply: true
---
# Vitest Loop Context Pattern

When an `expect` happens inside a loop in a vitest test, the loop data must be surfaced for better failed-test debugging.

- **MUST** use the second parameter of `expect` to provide context of the loop data.

# Example
```ts
it('returns false for every known feature flag', () => {
  for (const flag of allFeatureFlags) {
    expect(store.has(flag), `flag: ${flag}`).toBe(false);
  }
});
```
