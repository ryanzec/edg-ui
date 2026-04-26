# Style Guide

The official Angular style guide : https://angular.dev/style-guide#project-structure : should be followed, this document just adds additional guidelines where we think it would be benificial.

Some of the points here are the same as the official documentation but also provide explicit examples to help better convey the idea.

# Styling

## CSS

Just use CSS + CSS values.

# Package management / tooling

For almost everything (if not everything) you should be using moon for any tooling commands (dev servers, testing, installing packages), some specific points to call out

## Always use `moon :pnpm -- ...`

In order to make sure the same version of node / pnpm is used, we need `moon :pnpm -- ...` to manage packages so to add a package it would be:

```
moon :pnpm -- add --save-exact --save zod
```

## Always install package with `--save-exact`

This avoid hard to debug issues or expliots that can happen with automatic updates.

## Always use --skip-install for `ng generate` when available

- ✅ `moon :generate` handles this automatically

Some `ng generate` commands will attempt to install packages however there are two issue with that isn the current setup:

- It makes assumptions as to where they should be installed
- Running the command manually would not use moon's version of pnpm

Since we have only a root level `package.json` file, we need to skip the install and manually add them through `moon :pnpm -- add ...` to avoid both of those issue.

# Avoid component inline templates / styles

Ideally we should never use inline templates / styles but it is ok if the component is trivial (like no more than 10 lines of inline code) however if the component is that simple, you should think if a directive could be used.

## Storybook exception

For storybook this standard does not apply for ease of development of DX code.

# Avoid modules whenever possible (tooling handles this)

- ✅ `moon :generate` handles this automatically

Modules are more or less a legacy system that is not longer needed and whenever possible should be avoided. Component should be create as standalone and services that are truly global can be created with `providedIn: 'root'`.

While `moon :generate` does ask for a "module / feature", is it used for code organization only (which is still recommended).

# Split out development stories from testing stories

Splitting out the testing stories from the development stories provides 2 benefits:

- It helps keep the storybook interface clean as all test stories will be in their own nested group (that should only be needed with the storybook cli tests fail)
- It optomizes (at least a little) the storybook test runner so that it only have to worry about the files that actually have tests.

# Prefer signal over rxjs when possible

Signal have been around for years and is now stable in Angular 20 and generally is a simplier and more optimized solution for state management (especially for component state / properties) and should be preferred over rxjs.

Rxjs should only be used for things like api requests and when the complexity of the situation requires it.

# Single responsibility

We will always want make sure each to following the single responsibility rule, especially for services, to make the code as re-usable and maintainable as possible.

For example an authentication system needs to make api requests and store state locally and while the two can be seen also closely related, that should be 2 services, an `AuthenticationApiService` and an `AuthenticationStateService`. While the `AuthenticationStateService` might be the only things to call the `AuthenticationApiService` splitting them up make is clear one related to state management (and methods the related to it) and the other is specically for calling backend apis. This also means if there is a case for make an authentication api request outside of `AuthenticationStateService`, it is easy to do.

# Only use classes for Angular specific code

While we need to use classes for Angular specific code, for our own data, we should always prefer using types and then create utility Angular services to be able to perform actions on those types. This just make the code more flexible when apis that return the same resource might have different structure depending on the context of the request.

# Component state

In almost al use cases we should be able to store component state on the component class itself.

In the rare case where that does not work, you can create a store service for it however this is a last resort and class state is preferred and should work in nearly all use cases.

# Naming

- ✅ mostly handling in tooling

## Files

For the most part, naming conventions are handled with `moon :generate` but some that are not:

### View Components

In general component should be named as what they are but some special cases are:

- `*-view`: Page level component

## Services

Make more specific to avoid confusion on if something is a service vs component

- `*-api`: API services (ex. `users-api`)
- `*-admin-api`: API services design for only internal usage (ex. `users-admin-api`)
  - This code should be located in the application that is using it to avoid is being mistakenly imported other applications
- `*-manager`: A service that is used to manage a global level feature (ex. `logger-manager` or `global-notification-manager`, `authentication-store`)
- `*-store`: Management of a pariticular feature or instance of a feature that has state associated (ex. `pagi`)
  - `[COMPONENT_NAME]-store`: This should be used as a last resort.

## Observable `$` suffix

It is widely adopted (in both RxJS and Angualt) to have a $ suffix in the name of observables and so shall we.

# Library shared api

Instead of just having one publis-api.ts file, each module should have its own and the top level one just exported those files. This is to make it so the top level files does not get too large to be easily managed.

# Storybook example classes should be prefixed with EXAMPLE

This is to make is easy to see if we ware importing these in production code (even though they are not exported, this is just incase).

# Explicit access modifiers

Always be explicit with the `public` / `protected` / `private` access modidier just to make the code easier to read.

# Prefix private with `_`

This makes it easy to identify private data and make it easy in naming if there also need to be a `public` or `protected` equivlant (which would be the name without the `_`)

# Component data encapsulation

Data on a component should be made protected and then if it needs to be exposed, use a public api mapped to a readonly version (signals have a helper method for this) that way modification of this data can be better controlled and debugged.

# Types over interfaces whenever possible

- ✅ error in linting

Types can basically do everything that interface can but more, type can handle:

Union Types: Combining multiple types into one.

```ts
type Status = 'success' | 'error' | 'loading';
type ID = string | number;
```

Intersection Types: Merging multiple types together.

```ts
type Writable = { write: () => void };
type Closable = { close: () => void };

type WritableAndClosable = Writable & Closable;
```

Primitives: Creating an alias for a primitive type.

```ts
type UserID = string;
```

Tuples: Defining arrays with a fixed number of elements of specific types.

```ts
type Point = [number, number];
```

Complex Mapped Types: Creating new types by transforming properties of an existing type.

```ts
type ReadonlyUser = { readonly [K in keyof User]: User[K] };
```

Because type can do all of this in addition to defining object shapes, using it exclusively means you only need to use one keyword for all your type definitions, creating a more consistent style.

## Interface use case

The one thing the interfaces can do the types can't is add to an existing interface. While this might seems useful, it becomes and maintain headache and to know how a interface is defined, you need to know all the locations where it is defined and it is almost always easier to just use types.

If a 3rd aprt requires you to add to an interface, that is fine, but that should be the only use case for using interfaces

# Use unified signals whenever possible

Instead of doing something like this in a class:

```tsx
// ❌ bad
class AuthenticationServices {
  private _user = signal<User | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  public readonly user = computed(() => this._user());
  public readonly isLoading = computed(() => this._isLoading());
  public readonly error = computed(() => this._error());
  public readonly isAuthenticated = computed(() => this._user() !== null);
}
```

you want to do this:

```tsx
// ✅ good
class AuthenticationServices {
  private readonly _state = signal<AuthenticationState>({
    user: null,
    isLoading: false,
    error: null,
  });

  public readonly user = computed(() => this._state().user);
  public readonly isLoading = computed(() => this._state().isLoading);
  public readonly error = computed(() => this._state().error);
  public readonly isAuthenticated = computed(() => !!this._state().user);
}
```

Since we are exposing the internal unified store at a grainular level, we gain the best of both worlds.

- We keep the benifit of updates being fine-grained so if a component is using the `user` property and the signal updates it `error` data, the component using `user` but not `error` will not trigger a reactive update.
- If we need to update multiple pieces of data at the same time, we can do that is one atomic update trigger one reactive event instead of multiple smaller updates triggering multiple reactive events.

# AI flow for net new code

In order to best get AI to generate working but also good code the flow should be:

- use `moon :generate` to generate the scalfolding for the component, services, etc
- after that you can give a detailed prompt to ai passing reference to where code should go and other references , like:

## Enable auto ai rules / guidelines inclusion

Some editors might require you to configure the that that ai files in the repository are added as context when interacting with it so make sure do to do otherwise the generated code will not be upto the standard we want it to be.

# exporting / public for unit test

If something is being exported or made public for the sole purpose of allow better and easier testing, is should have a `TSDoc` block that has at a minimum a `@internal` line explaining why is it being exported / made public and it should be prefixed with `_` to make it easy to identify in code.

# AI

Most of the common ai tooling should have a "rules" file(s) that at a minimum references all the partial rule files that have been generated so should result is relatively consisteny code generation.

If the tool you use require you to tell it about rule rules, MAKESURE TO CONFIGURE IT, while it should generate functional code without it, it will most certainly not be consistent with the rest of the codebase.

## Cursor

For cursor, we also have explicit commands manually used to minimize the context set based ont he text mainly to save of token usage but also to make certain tasks easier.

### Updating Storybook

Lets say you made updates to the dialog component but now you want to make sure the stories are updated. There is a Cursor command of `/storybook/update` to do this so all you have to do is:

```
/storybook/update @dialog/
```

## Ask for question for larger requests.

When you are doing a larger request it is recommend guide the AI to ask question to avoid unexcepted implementation details by adding something like this to the end of the prompt:

```
If you have any questions about the present functionality or ideas for functionality that should be considered, present those questions before fully planning the coding work.
```

I would also add this line for each time you reply to any questions to make sure your anwsers did not produce and other questions.

### Cursor Shortcut

Cursor has a command for this to make it easier where you can do:

```
/angular/component/general @dialog/

[YOUT PROMPT]

/ask-me-questions
```

## Thing to watch out for

While the AI should have extensive rules around stuff, it does not always following them, these more common issue I have experienced:

- organization storybook stories (by the title name) incorrectly (just manually update)
- storybook will sometimes implement functionality inline in the story that is already implemented in a service
- storybook will sometimes implement functionality inline in the story that should be abstract into a service / component to prevent duplication of code
- will sometimes use `setTimeout` in areas where it should not be used as in many cases it can be flacky (like using `setTimeout` to run code after a `scrollIntoView` instead of doing an event binding like `(scrollend)="onScrollEnd()"` on the scroll element or using a `setTimeout` instead of a angular lifecycle hook)
- while using `nativeElement` for things like calling `focus()` or in a directive for appendind dom elements, AI will sometimes use it for event binding which should almost always be handle through the host property of the `@Component` or `@Directive` or event binding on the element itself like `(scrollend)="onScrollEnd()"`
- if you have a default value, it will default at every step of the way instead of just at the end (making refactoring the default harder)
- you need to be explicitly on when you have checks on data triggering certain action and be clear if it should happen whenever the data changes (that would be an `effect()`) or only on that (which should be in an `ngOninit()` method)
- when dealing with a forms, indicate if there is a zod schema that should be used with the validation piece

## Check for custom AI implementation of truely general logic

Sometimes AI will create custom implementation of thing where a 3rd part library would be far better (like creating a md5 hashing solution that ironically indefinately loops), make sure to look out this this in AI generated code.

## Do full testing and give full information if asking AI to resolve the issue

Be sure to give as much information as possible, telling it a form is not validating properly and that alone can have the AI go down a path trying to look at and modify all the input components instead of looking at the form but if you say one worm does and but another does not, that can avoid this (then again sometimes is need to be told to use `(submit)` instead of `(ngSubmit)`).

# Pattern Examples

There are a number of pattern example in the `shared-ui` examples module (usually in a storybook file).

# Typing

## Zod

When we are going to what to be able to validate a type, instead of creating the type manually, we should should generate a zod schema for it and then the type can be inferred from the schema with `z.infer<typeof [SCHEMA_VARIABLE_NAME]>`. This allow us to get validation and typing for the type that better automatically syncs.

## Multiple schemas / types

Often there will be case where you need multiple schemas / types for the same base type. In those cases, you should create the full base schema (for example `userSchema`) and then derived other schema by picking from that one instead of omit, for example:

```ts
export const userSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  name: z.string(),
  email: z.email(),
  roles: z.array(z.enum(['admin', 'user'])),
  hasPassword: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ❌ bad
export const createUserSchema = userSchema.omit({
  id: true,
  organizationId: true,
  hasPassword: true,
  createdAt: true,
  updatedAt: true,
});

// ✅ good
export const createUserSchema = userSchema.pick({
  name: true,
  email: true,
  roles: true,
});
```

This make the schemas / types more explicit as it would be harder to accidently add a properly that should not be there and is make that type easier to read as the omit pattern does not really tell you what is there, just want it not.

# Things to improve

## Root level package file

While using a root only package.json files is generally no recommended with moonrepos, it is the easiest option that I know works for this setup, we can investigate cleaning this up if it every becomes a problem.

---

---

# AI Examples

## Simple

If the example can be expressed relatively easily in the code snippit, just inline the code snippet to the ai as it avoid providing too context that can cost more token and some cause confusion.

## Complex

If the example is more complex, just reference a location where it is being used.

When possible, we should create a minimal storybook example that can be used to reference it so that we feed minial context into the ai and also have a manual example we can reference in the future.

# Good / Ok / Bad code example template

```ts
// ❌ bad

// 😐 ok

// ✅ good
```

# Tips

## Weird extra bottom spacing

Sometimes an element will have seemingly random extra spacing at the bottom as adding `inline-flex` will often fix that issue

## Flexbox child overflowing

It is a known issue the flexbox child can often overflow their parent which is almost never wanted, add `min-h-0` or `min-w-0` (depends on flex direction) to child overflowing their `flex` based parent will resolve this issue.

## Refactoring angular component class code

Refactoring names in component typescript code does not auto update template code so you will have to make sure to do that manually (tooling will error about this).

## Storybook component templates don't have linting erros

Not sure why or if there is a way to handle to handle this but storybook template does have in editor linting error which can be annoying.

## Storybook titles

While AI will sometimes title things properly, sometimes it will not and you will need to update story titles to match our pattern for story organization

# NEW PATTERNS

- use the `aria-*` `data-*` attribute for input values that related to styling and use that in the css selectors to style
  - class are now for identification and data-\* are for modification
  - avoid manual string generation for css classes that can sometimes have logic that can introduce bugs
  - enforces one value only
  - promotes a11y
