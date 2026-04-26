---
alwaysApply: true
---
# IMPORTANT: These rules override general typescript / angular rules
# General Angular Template Patterns
- **ONLY** use either use `[selected]` for the option or reactive form binding if a reactive form is needed for select elements values.
- **ALWAYS** use the async pipe to handle observables.
- **ALWAYS** use html entity for angular special character in template (such as `&#64;` instead of `@`).
- **ALWAYS** use the `button` html element when needing to create an element that has clickbility
- **ALWAYS** use `@let` to provide typing for templates that use `let-*` in like this:
```html
<ng-template #body let-tempUser>
  @let user = asUser(tempUser);
  <!-- ... -->
</ng-template>
```
```ts
  protected asUser(tempUser: unknown): User {
    return tempUser as User;
  }
```
- **ONLY** use native control flow like `@if`, `@for`, `@switch` in templates.
