---
alwaysApply: true
---
# IMPORTANT: These rules override general typescript / angular rules
# General RxJS Patterns
- **ALWAYS** use built-in rxjs utilities when available instead of creating a custom one.
- **ALWAYS** create subjects as `private` implementation details and only expose `publicly` what is needed
```ts
// MUST DO
private _focusRequestSubject = new Subject<void>();
// ...
public focusRequest$ = this._focusRequestSubject.asObservable();
```
- **ALWAYS** make sure error handling is done somewhere in the chain of events (if error handling is done higher up, lower usage error handling is optional).
- **ALWAYS** make sure streams properly composed to avoid nested subscriptions whenever possible.
- **ALWAYS** log error in `catchError()` using the `logManager.warn()` or `logManager.error()`.
- **ONLY** use `combineLatestWith` to combine multiple streams.
- **NEVER** expose a subject directoy as `public`.
