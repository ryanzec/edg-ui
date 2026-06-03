---
name: angular-development
description: Use this skill whenever working on any Angular code. Enforces Angular 21 signal-based standards: `inject()` DI, `computed()`/signal state, immutable updates, `takeUntilDestroyed` in injection context, `NgOptimizedImage`, and banned legacy patterns (`@HostListener`/`@HostBinding`, `mutate`).
---
# Angular Development Skill

# Prework Validation

You are to **ALLWAY** do the following before performing any work:
- **ALWAYS** confirm when you intend to use a non-standard / discouraged pattern before implementing such a pattern.

# Rules
- **ALWAYS** following Angular 21 standards and best practices.
- **ALWAYS** use a signal based approach over "popular" but old angular patterns.
- **NEVER** use the following decorators: `@HostListener` / `@HostBinding`.
- **ALWAYS** wrap RxJS's `takeUntilDestroyed()` in `runInInjectionContext()` in the `ngAfterViewInit()` or pass in the `DestroyRef` as a parameter.
- **ALWAYS** explicit pass the generic type when using `computed<>()`.
- **ONLY** use lazy loading for routes view directly (shared layout components must **NOT** be lazy loaded).
- **ALWAYS** use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.
- **ALWAYS** use `computed()` for derived state.
- Keep state transformations pure and predictable.
- **ONLY** use `update` or `set` instead or `mutate` on signals.
- When doing dependency injection, the `inject()` pattern should **ALWAYS** be used over other older patterns.
- In non-angular specific code (classes not using one of the angualr decorators like `@Component`, `@Injectable`, etc.), **ALWAYS** make writeable state `private` and prefixed with `_`.
- When managing state, **ALWAYS** make sure it is done in an immutable way to avoid side effects whenever possible.
- **ALWAYS** use angular's built in `json` pipe for rendered json in templates.
- **ALWAYS** check if this is a built-in angular callback or lifecycle hook that can be used instead of trying to do a `setTimeout()`.
- **ALWAYS** place ALL injectable tokens for the `shared-ui` library as close to the source as possible.
- **ALWAYS** double check the `effect()` calls are in the valid context for them.
- **ALWAYS** pass `Signal<T>` directly when injecting reactive values through data objects (e.g., `DIALOG_DATA`, injection tokens). **NEVER** use `Observable<T>` / `BehaviorSubject<T>` for this purpose. Read the signal inside `computed()` using `typeof value === 'function' ? (value as Signal<T>)() : value` when the field can be either a plain value or a signal.
- **NEVER** use `as const` when define an icon name.

# **REQUIRED** End Review

The following must be reviewed after finishing the task before the task can be considered complete:

- Review for any glaring issues.
