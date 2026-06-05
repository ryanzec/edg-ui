---
alwaysApply: true
---
# Angular Component Effective Input Value Pattern

When a component has an `input()` that is passed but also has logic to determine the value actually used, keep the input clean and resolve the final value separately.

- Keep the `input()` as clean as possible.
- Expose a protected member that holds the resolved value, prefixing the `input()` name with `effective` (e.g. `effectiveSize`).

# Reference
```ts
class Component {
  // ...
  /** the size variant shared with internal sub-components. */
  public size = input<AvatarSize>(AVATAR_SIZE_DEFAULT);
    
  /** resolved size honoring the parent avatar stack (if present) over the locally provided size. */
  protected readonly effectiveSize = computed<AvatarSize>(() => this._avatarStack?.size() ?? this.size());
  // ...
}
```
