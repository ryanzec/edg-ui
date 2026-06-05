---
alwaysApply: true
---
# Angular Component Host Directives Pattern

When adding `hostDirectives` to a component, use the explicit form to avoid Angular compile issues.

- **ALWAYS** use the explicit object form (`directive` + `inputs`) shown below.

# Example

```ts
@Component({
  //...
  hostDirectives: [
    {
      directive: ComponentColorDirective,
      inputs: ['orgColor'],
    },
  ],
  //...
})
```
