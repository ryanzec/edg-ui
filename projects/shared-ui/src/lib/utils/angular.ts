import { inject, Injector, runInInjectionContext } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { concatMap, first, from, isObservable, of } from 'rxjs';

/**
 * Builds a single `CanActivateFn` that runs the supplied guards sequentially and short-circuits
 * on the first guard that returns a non-`true` `GuardResult` (`false`, a `UrlTree`, or a
 * `RedirectCommand`). When every guard resolves to `true`, the composed guard resolves to
 * `true`. Mirrors angular's built-in `canActivate: [...]` array semantics while producing a
 * single reusable `CanActivateFn` that can be composed into other route configs.
 */
const buildActivateGuardSerially = (guards: CanActivateFn[]): CanActivateFn => {
  return (route, state) => {
    if (guards.length === 0) {
      return true;
    }

    // captured once at the outer guard's injection context so inner guards can resolve inject()
    // calls after async hops inside the rxjs chain (where the original context is no longer active).
    const injector = inject(Injector);

    return from(guards).pipe(
      concatMap((guard) => {
        const result = runInInjectionContext(injector, () => guard(route, state));

        if (isObservable(result)) {
          return result;
        }

        if (result instanceof Promise) {
          return from(result);
        }

        return of(result);
      }),
      first((result) => result !== true, true)
    );
  };
};

export const angularUtils = {
  buildActivateGuardSerially,
};
