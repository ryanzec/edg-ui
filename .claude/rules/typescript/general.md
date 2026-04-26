---
alwaysApply: true
---
# General TypeScript Patterns
- **ALWAYS**** return early instead of nesting the continue logic
- **ALWAYS**** explicitly use `public`, `protected`, and `private` keywords in classes
- **ALWAYS**** prefix `private` methods / members with a `_`
- **ALWAYS**** add property TSDoc comment blocks for class property / methods and exports
- **ALWAYS**** use ALL lowercase for comments
- **NEVER**** use single line conditional statement like `if (condition) return true;`
- **ALWAYS**** use strict type checking
- **ALWAYS**** use type inference when the type is obvious
- **ALWAYS**** use `unknown` instead of `any` when the type is not known
- **ONLY** use `any` if it is requirement by another api
- **ALWAYS**** make sure code is self documenting
- **ONLY** comment code if it is highly complex and can't be self documenting
- **NEVER**** comment code that is self documenting **EXCEPT** for `effect()` since they add as the docblock for it.
- **NEVER**** add useless comments
- **ALWAYS**** ask when doing a very well defined generic tasks (like hashing) if you should use a 3rd party library or custom build something
- **ALWAYS**** prefix `public` method / members or export that are **ONLY** public for testing purpose with `_` and have a TSDoc block with an `@internal` commenting about this, pattern examples:
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
- **ALWAYS**** use `null` when the value is required but should allow a "no value" to be passed 
- **ALWAYS**** use `undefined` when it should be allowed to omit passing a value completely
- **ALWAYS**** allow both `null` and `undefined` should be allowed if both use case are valid
- **ALWAYS**** co-locate the types in the main file that is using them when they are tightly coupled, pattern example"
```ts
// MUST DO
export const IconName = 'caret-right' | 'caret-left';

export const iconNames = ['caret-right', 'caret-left'] as const;
// ...
export class Icon {
  public name = input.required<IconName>();
  // ...
```
- **ALWAYS**** create generic types that can be use in many locates (like a `ErrorMessage`) should be placed in there own file
```ts
export const ErrorMessage = {
  UNKNOWN: 'An unknown error occurred',
  UNAUTHENTICATED: 'unable to authenticate',
  AUTHENTICATION_EXPIRED: 'Logged in session expired',
} as const;

export type ErrorMessage = (typeof ErrorMessage)[keyof typeof ErrorMessage];
```
- **ALWAYS**** use a string literal union type over an enum
```ts
// ALWAY do this
export const IconName = 'caret-right' | 'caret-left';

export const iconNames = ['caret-right', 'caret-left'] as const;
```
- **ALWAYS**** create const array for all value for string literal union types
```ts
export const IconName = 'caret-right' | 'caret-left';

// ALWAY do this
export const allIconNames = ['caret-right', 'caret-left'] as const;
```
- **ONLY** use negative naming for `boolean` based inputs when there are tied to a standard html attribute.
- **ONLY** use patch for updating data with an api call
- **ALWAYS**** cast to the specific type when needed
- **ALWAYS**** attempt to fix circular dependencies by import the type one when possible
- **ALWAYS**** omit optional values if you are just setting it to the default value
- **ALWAYS**** write code to cleanup when needed (like cleaning up a timeout, a subscription, etc.)
- **ALWAYS**** type parameters to the minimum needed using `Pick<>` on the base type
```ts
const logUser = (user: Pick<User, 'name'>) => {
  console.log(user.name);
}
```
- **ALWAYS** prefer positive name variables / fields / method / etc. to avoid double negative confusion.
- If something can not be `null` / `undefined` based on typescript typing, falsey checks are ok **ONLY** if they include a comment above the check indicating it is just a defensive check.
- **ALWAYS** have a comment in an empty method that is designed to be overriden or set outside of the class to avoid confusion on why there is an empty method + prevent eslint errors
