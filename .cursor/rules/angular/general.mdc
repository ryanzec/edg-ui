---
alwaysApply: true
---
# IMPORTANT: These rules override general typescript rules
# General Angular Patterns
- **ALWAYS** following Angular 21 standards and best practices.
- **ALWAYS** confirm when you intend to use a non-standard / discouraged pattern before implementing such a pattern
- **ALWAYS** use a signal based approach over "popular" but old angular patterns.
- **ALWAYS** use `projects/shared-ui/src/lib/core/local-storage-manager` for persistent local storage data
- **ALWAYS** prefer organizing writable state into as few unified signal objects (ideally 1 called `_state`) instead of a signal per piece of data.
- **NEVER** use the following decorators: `@HostListener` / `@HostBinding`.
- **ALWAYS** use the `logManager` singleton from `projects/shared-utils/src/utils/log-manager` to log and use and object format with a minimim of a `type` like (**EXCEPT** form storkbook files which can use `console.log()` as needed):
```ts
logManager.warn({
  type: 'some-error-type',
  message: logManager.getErrorMessage(error),
  error,
});
```
- **ALWAYS** wrap RxJS's `takeUntilDestroyed()` in `runInInjectionContext()` in the `ngAfterViewInit()` or pass in the `DestroyRef` as a parameter.
- **ALWAYS** explicit pass the generic type when using `computed<>()`.
- **ONLY** use lazy loading for routes view directly (shared layout components should not be lazy loaded).
- **ALWAYS** use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.
- **ALWAYS** use `computed()` for derived state.
- Keep state transformations pure and predictable.
- **NEVER**** use `mutate` on signals, ONLY use `update` or `set` instead.
- When doing dependency injection, the `inject()` pattern should **ALWAYS** be used over other older patterns.
- **ALWAYS** make writeable state `private` and prefixed with `_`.
- Make individual components, services, directives, pipes, and guard are responsible to **SINGLE** domain and not doing too much.
- Make sure performance is **ALWAYS** factored in to the implementation but not too at the cost of code readability.
- When managing state, **ALWAYS** make sure it is done in an immutable way to avoid side effects whenever possible.
- When import code, a project should **NEVER**** use the project alias or public api for importing its own code, it should **ALWAYS** path to the direct file needed in order to prevent circular depencdencies.
- **ONLY** use `type` for types.
- **ALWAYS** use angular's built in `json` pipe for rendered json in templates.
- **ALWAYS** check if this is a built-in angular callback or lifecycle hook that can be used instead of trying to do a `setTimeout()`.
- **ALWAYS** place ANY injectable for the `shared-ui` library as close to the source as possible.
- **ALWAYS** double check the `effect()` calls are in the valid context for them.
- **ALWAYS** pass `Signal<T>` directly when injecting reactive values through data objects (e.g., `DIALOG_DATA`, injection tokens). **NEVER** use `Observable<T>` / `BehaviorSubject<T>` for this purpose. Read the signal inside `computed()` using `typeof value === 'function' ? (value as Signal<T>)() : value` when the field can be either a plain value or a signal.
---
- **NEVER**** use `as const` when define an icon name.
- **NEVER**** attempt to use `JSON.*` in template files.
