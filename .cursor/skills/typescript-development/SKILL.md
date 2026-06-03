---
name: typescript-development
description: Use this skill whenever working on any TypeScript code. Covers library-source ordering, string-literal-union-over-enum and `type`-only conventions, visibility/naming/TSDoc rules, null-vs-undefined semantics, `logManager` logging, Luxon dates, and the `localStorageManager`.
---
# Typescript Development Skill

# Prework Validation
- **ALWAYS** ask when doing a very well defined generic tasks (like hashing) if you should use a 3rd party library or custom build something

# Stack / Library
- Angular 21
- Angular CDK (npm pacakge ``).
- Luxon

# Low Level Code Source Ordering
When you need a low level components / directives / pipes / services / functionality, use the code available in this order:
- `/Users/ryanzec/repositories/angular-sandbox/projects/shared-ui/src/lib/core`
- Angular CDK
- Angular Built-In
- One of these libraries if they provide the functionality
  - `@angular/cdk`: General angular functionaltiy.
  - `es-toolkit`: General typescript utility functionality.
  - `luxon`: Anything related to dates.
  - `scrollparent`: For getting the scroll parent of an element.
  - `spark-md5`: ONLY when MD5 hashing is specifically needed.
  - `uuid`: For UUID specific use cases or when a generic id is needed.
  - `zod`: For data validation, type generation, and data structure conversion.
- Native HMTL / CSS

# Abbreviation Patterns
- **ALWAYS** use abbreviations for initialisms.
- **ONLY** use these abbreviations, **NO** other abbreviations are allowed:
  - `id` instead of `identifier`.
  - `utils` instead of `utilities`.
  - `config` instead of `configuration`.
- **NEVER** use these abbreviations:
  - `e` for `event`, use `event` instead.
  - `e` for `error`, use `error` instead.

# Rules
- **ALWAYS** use the `logManager` singleton from `projects/shared-utils/src/utils/log-manager.ts` to log and use and object format with a minimim of a `type` like (**EXCEPT** form storkbook files which can use `console.log()` as needed):
```ts
logManager.warn({
  type: 'some-error-type',
  message: logManager.getErrorMessage(error),
  error,
});
```
- **ONLY** use `type` for types.
- Make sure performance is **ALWAYS** factored in to the implementation but not too much at the cost of code readability / maintainability.
- When importing code, a project should **NEVER**** use it own project alias or public api for importing its own code, it should **ALWAYS** path to the direct file needed in order to prevent circular dependencies.
- **ALWAYS** return early instead of nesting the continue logic
- **NEVER** use one line conditional statement, **ALWAYS** wrap in braces `{}`.
- **ALWAYS** explicitly use `public`, `protected`, and `private` keywords in classes
- **ALWAYS** prefix `private` methods / members with a `_`
- **ALWAYS** add property TSDoc comment blocks for class property / methods and exports
- **ALWAYS** use ALL lowercase for comments
- **ALWAYS** use strict type checking
- **ALWAYS** use type inference when the type is obvious
- **ALWAYS** use `unknown` instead of `any` when the type is not known
- **ONLY** use `any` if it is requirement by another api
- **ALWAYS** make sure code is self documenting
- **ONLY** comment code if it is highly complex and can't be self documenting
- **NEVER** comment code that is self documenting **EXCEPT** for `effect()` since they act as the docblock for it.
- **NEVER** add useless comments that just describe what reading the code would already say.
- **ALWAYS** prefix `public` method / members or export that are **ONLY** public for testing purpose with `_` and have a TSDoc block with an `@internal` commenting about this, pattern examples:
```ts
/**
 * @internal only exposed for testing purposes
 */
export const _SOME_INTERNAL_VALUE = 'test';

class UsersApi = {
  /**
   * @internal only exposed for testing purposes
   */
  public _baseUrl = '/api/v2/users';
}
```
- **ALWAYS** use `null` when the value is required but should allow a "no value" to be passed 
- **ALWAYS** use `undefined` when it should be allowed to omit passing a value completely
- **ALWAYS** allow both `null` and `undefined` should be allowed if both use case are valid
- **ALWAYS** co-locate the types in the main file that is using them when they are tightly coupled, pattern example"
```ts
// MUST DO
export const IconName = 'caret-right' | 'caret-left';

export const iconNames = ['caret-right', 'caret-left'] as const;
// ...
export class Icon {
  public name = input.required<IconName>();
  // ...
```
- **ALWAYS** create generic types that can be use in many locates (like a `ErrorMessage`) should be placed in there own file
```ts
export const ErrorMessage = {
  UNKNOWN: 'An unknown error occurred',
  UNAUTHENTICATED: 'unable to authenticate',
  AUTHENTICATION_EXPIRED: 'Logged in session expired',
} as const;

export type ErrorMessage = (typeof ErrorMessage)[keyof typeof ErrorMessage];
```
- **ALWAYS** use a string literal union type over an enum
```ts
// ALWAY do this
export const IconName = 'caret-right' | 'caret-left';

export const iconNames = ['caret-right', 'caret-left'] as const;
```
- **ALWAYS** create const array for all value for string literal union types
```ts
export const IconName = 'caret-right' | 'caret-left';

// ALWAY do this
export const allIconNames = ['caret-right', 'caret-left'] as const;
```
- **ONLY** use negative naming for `boolean` based inputs when there are tied to a standard html attribute.
- **ALWAYS** cast to the specific type when needed
- **ALWAYS** attempt to fix circular dependencies by import the type one when possible
- **ALWAYS** omit optional values if you are just setting it to the default value
- **ALWAYS** write code to cleanup when needed (like cleaning up a timeout, a subscription, etc.)
- **ALWAYS** type parameters to the minimum needed using `Pick<>` on the base type
```ts
const logUser = (user: Pick<User, 'name'>) => {
  console.log(user.name);
}
```
- **ALWAYS** prefer positive name variables / fields / method / etc. to avoid double negative confusion.
- If something can not be `null` / `undefined` based on typescript typing, falsey checks are ok **ONLY** if they include a comment above the check indicating it is just a defensive check.
- **ALWAYS** have a comment in an empty method that is designed to be overriden or set outside of the class to avoid confusion on why there is an empty method + prevent eslint errors
- **AWLAYS** use the `projects/shared-ui/src/lib/styles/design-tokens.ts` when you need to access css design tokens in typescript code.

# Date Rules
- **ALWAYS** use Luxon when dealing when dates whenever possible
- **ALWAYS** use the custom `projects/shared-ui/src/lib/core/date-pipe` pipe for formatting date in component templates
- **NEVER** use the built-in `DatePipe` for formatting dates
- **ONLY** format date with value available from the exported consts in `projects/shared-utils/src/utils/date.ts`

# Local Storage Rules
- **ALWAYS** use the `localStorageManager` singleton from `projects/shared-utils/src/utils/local-storage-manager.ts` for persisting local data.
- **NEVER** interact with local storage directly through the native api outside of the `projects/shared-utils/src/utils/local-storage-manager.ts`.
- **ALWAYS** add a value to the `LocalStorageKey` enum in `projects/shared-ui/src/lib/core/types.ts` and **ONLY** use that instead of raw string when interacting with `projects/shared-utils/src/utils/local-storage-manager.ts`.

# **REQUIRED** End Review

The following must be reviewed after finishing the task before the task can be considered complete:

- Review for any glaring issues.
