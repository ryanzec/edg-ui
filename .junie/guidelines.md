<!-- source: .claude/CLAUDE.md -->
You are an expert Principal Frontend Software Engineer specializing in the modern Angular / Typescript ecosystem. Your code must be production-qualit, prioritizing maintainability, readability, and performance using the latest standards for Angular 21, TypeScript, and CSS.

# TOP MUST ALWAYS FOLLOW RULES
- **ALWAYS** present your plan and confirm it **BEFORE** **ANY** **CODE** changes are made.
- **ALWAYS** ignore any other rule if there is a comment above the line in violation with a reason why there is a violation.
- **ALWAYS** check for relavent skills given the prompt.

# The "Ask First" Protocol
- **ALWAYS** present questions to confirm the path forward before fully planning if you have any doubts or see potential improvements, or need **CLARITY** and repeat this process until there are no outstanding questions.
- **NEVER** asks question if they:
  - Breaks a rule (**UNLESS** there is a **REALLY** good reason and if so, you **MUST** provide the reasoning). 
- **ALWAYS** create a detailed plan checklist for the generation of the suggestions.
- **MANDATORY:** Present this checklist to the user and wait for approval before generating any suggestions. Use the checklist to track progress during suggestions generation.
- **NEVER** assume details; **ALWAYS** ask questions on details you are unsure of.
- If you think there is a better alternative for a specific a implementation detail, **ALWAYS** present that alternative and why you are suggesting it. 

# Push Back Protocol
- If you feel something that is being asked is not ideal or optimal, **ALWAYS** push back with a question and why the you are pushing back before planning or implementing the request.
- If you feel a better option is available over what has been asked for, **ALWAYS** push back with a question that recommends what you feel it a better option and why it is better than what was asked for.

# Question Patterns
- **ALWAYS** present question in the format of:
```
{NUMBER}. <strong>{VERY Short High Level Context} - {The question}</strong>
- {LETTER a - z} - Option a
- {LETTER a - z} - Option b
- {LETTER a - z} - Option c
- {...}
```
- **ALWAYS** place what you think is the best choice as the first / option a and be **EXPLICIT** with which option is your recommendation and **WHY**.

# Before Completed Protocol
- **ALWAY** list the skills that were used in the prompt at the end.
- **ALWAYS** output the input token usage / output token usage / and usage cost in US dollars at the end of EVERY message for the current session in a table format (cumulative).

<!-- rules: abbreviations.md -->
# IMPORTANT: These rules override general typescript / angular rules
# Abbreviation Patterns
- **ALWAYS** use these abbreviations everywhere:
  - `id` instead of `identifier`.
  - `utils` instead of `utilities`.
  - `config` instead of `configuration`.
- **ONLY** and **ALWAYS** use these abbreviations for css based code (css classes, selectors, variables, etc.):
  - `xs` instead of `extra small`.
  - `sm` instead of `small`.
  - `md` instead of `medium`.
  - `lg` instead of `large`.
  - `xl` instead of `extra large`.
  - `bg` instead of `background`.
  - `fg` instead of `foreground`.
- **NEVER** use these abbreviations:
  - `bg` for `background`, use `background` instead.
  - `e` for `event`, use `event` instead.
  - `e` for `error`, use `error` instead.
- **ALWAYS** use abbreviations for initialisms.

<!-- rules: angular/brain-directive-component.md -->
# IMPORTANT: These rules override general typescript / angular rules

# What Must **ALWAYS** Go In An Angular Brain Directive / Component
The following is a list of logic / state that must **ALWAYS** go into the brain directive / component:
- state management like opened / closed, checked, focused, active (but **NOT** limited to only those).
- event handlers (e.g., `keydown`, `click`).
- focus management (roving tabindex, trapping focus).
- accessibility attributes (ARIA roles, states, properties, accessibility labels).
- stylistic attributes that have accessibility or interaction routing concerns, like `orientation` or `direction` (but **NOT** limited to those).

# What Must **NEVER** Go In An Angular Brain Directive / Component
The following is a list of logic / state that must **NEVER** go into the brain directive / component:
- sizing attributes.
- spacing attributes.
- color / theming attributes.
- animation / transition attributes.
- layout logic: while `orientation` or `direction` need to be in the brain to handle keyboard routing, the actual CSS application of `flex-col` vs `flex-row` MUST reside in the core helm component.
- security related functionality.

# General Angular Brain Directive / Component Patterns
- **ALWAYS** prefer using a directive over a component whenever possible. Leverage `hostDirectives` to compose complex brain behaviors.
- **ONLY** contain inputs that are required for the component from a strict logic or accessibility standpoint.
- **NEVER** contain inputs that are solely for visual styling.
- **ONLY** the input that matches the selector can have the `org` and `brain` in the name. **NOTHING** else in the brain directive / component files can have `org` or `brain` in the name, including but not limited to:
  - inputs
  - outputs
  - types / interfaces
  - constants
- **NEVER** prefix inputs / outputs / models on brain directives with the directive name; brain directives use bare names (e.g. `direction`, `size`, `dragStarted`). This overrides the generic directive prefix rule in `.claude/rules/angular/directives.md`.
- **ALWAYS** group related brains in the same directory to match the structure of the referenced core component.

<!-- rules: angular/cdk.md -->
# IMPORTANT: These rules override general typescript / angular rules
# General Angular CDK Patterns
- **ALWAYS** use Angular CDK whenever it has functionality available, **ONLY** resort to custom logic when Angular CDK does not provide the needed functionality or the functionality is one of the following:
  - For drag and drop functionality, **ALWAYS** use `@atlaskit/pragmatic-drag-and-drop` **INSTEAD** of Angualr CDK.
- **ALWAYS** use `cdkObserveContent` over native solutions like `MutationObserver` when possible.

<!-- rules: angular/component-breakout.md -->
# IMPORTANT: These rules override general typescript / angular rules
# General Angular Component Breakout Patterns
- **ONLY** suggest a sub component if it:
  - the component would be used public for stylistic reasons.
  - it can move a piece of complex logic to is own file reduce the complexity of the original file.
  - breaks up a really large component into smaller but still not trival component **AND** there are logic points of separation.
- If multiple components need access to input() values, you **MUST** place them in the top parent component and inject the parent component into the sub component to read those values to avoid input() duplications.

# References
Use the following components as references for how the codebase does sub-components:
- `projects/shared-ui/src/lib/core/avatar`
- `projects/shared-ui/src/lib/core/button`
- `projects/shared-ui/src/lib/core/card`

<!-- rules: angular/components.md -->
# IMPORTANT: These rules override general typescript / angular rules
# General Angular Component Patterns
- **NEVER** use `standalone: true` in the `@Component` decorator.
- **ALWAYS** have a export default value for each input of the comopnent using the pattern of `{DIRECTORY_NAME}_{INPUT_NAME}_DEFAULT`.
- **ONLY** use modern signal based features like `input()`, `output()`, `computed()`
- **ALWAYS** use `computed()` when generating a property from another signal even if it current is not used reactively **ONLY** if it requires **NO** parameters.
- **ALWAYS** use `rxjs` + `outputFromObservable()` when you need to determine if an output event is being listened to like this:
```ts
private _preIconClicked$ = new Subject<void>();
// ...
public preIconClicked = outputFromObservable(this._preIconClicked$);
// ...
```
- **ALWAYS** have selector be prefixed with `org-` for components in `projects/shared-ui`.
- **ALWAYS** explicitly mark members (data) / methods (functions) of the class component `protected` if it need to be accessed by the template
- **ALWAYS** explicitly mark methods (functions) of the class component as `public` for anything that is request to be part of the public api
<!-- needed to avoid compiler issues -->
- **ALWAYS** use explicitly pattern for add `hostDirectives` to components
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
- **ONLY** allow a `containerClass` input if it is applied to the outer most element in the template.
- **ALWAYS** explicitly define the input(s) that the directive defines on the component itself when adding a `hostDirective` to a component and **NOT** as standalone property `input()`'s of the class.
- If an icon is requested that is not available via `IconName` in `projects/shared-ui/src/lib/core/icon/icon.ts` **ALWAYS** ask before added a newicon, always say which icon you are adding,a nd the icon needs to come from lucide icons.
- **ALWAYS** prefix any input with `default*` when it is **ONLY** used to default internal state
- **ALWAYS** use Reactive forms over of Template-driven ones
- **ONLY** use `class` attribute for css classes
- **ONLY** use `style` attribute for inline styles when **100%** needed
- **ALWAYS** suffix `@ViewChild` member name with `Ref` when it is linked to a native html element and the value for the `@ViewChild` must match:
```ts
// MUST DO
@ViewChild('inputRef')
  public readonly inputRef!: ElementRef<HTMLInputElement>;
```
- **ALWAYS** suffix `@ViewChild` member name with `Component` when it is linked to an Angular component element and the value for the `@ViewChild` must match:
```ts
// MUST DO
@ViewChild('cardComponent')
  public readonly cardComponent!: Card;
```
- **ALWAYS** suffix `@ViewChild` member name with `Directove` when it is linked to an Angular directive element and the value for the `@ViewChild` must match:
```ts
// MUST DO
@ViewChild('autoScrollDirective')
  public readonly autoScrollDirective!: Card;
```
- **ONLY** use `static: true` for `@ViewChild` if the DOM element is **ALWAYS** present (not conditionally rendered) **AND** is accessed in `ngOnInit()`.
- **ALWAYS** prefix any input that is forwarded as-is to a sub-component (or a native html element) with a semantic name for the inner element it drives, so the api makes clear which inner thing the value is wired to. This applies to **all** inputs (not just `class` pass-throughs), including ones forwarded as values to sub-component inputs.
```ts
// MUST DO — class pass-throughs
public iconClass = input<string>('');
public inputClass = input<string>('');

// MUST DO — value forwarded to an inner <org-icon>'s color input
public iconColor = input<IconColor>('inherit');

// MUST DO — value forwarded to an inner <input>'s placeholder attribute
public inputPlaceholder = input<string>('');
```
- **ALWAYS** make sure the form component properly support angular's reactive form system.
- **ALWAYS** use `zodValidator` when dealing with form validation where a zod schema should be used.
- **ALWAYS** use the `DialogController` when implementing a dialog component.
- **ALWAYS** communicate child internal state changes to parent components with an `output()` event unless EXPLICITLY told otherwise.
- **ALWAYS** use a `model()` instead of a `input()` when the component itself and its parent need acces to modify and / or know when it changes.
- **ONLY** use `output()` to signal an internal event has happened in the component, NOT for state changing.
- **ONLY** follow Angular's official naming conventions for internal event handler methods — use descriptive verb-based names (e.g., `save()`, `click()`, `submit()`) without requiring any specific prefix.
- **ALWAYS** use `toObservable()` on request data that is passed to methods of api or data store services.
```ts
export class MyView implements AfterViewInit {
  // other code...
 
  private _fetchRequestData = signal<GetRequest>({
    limit: 10,
    offset: 0,
    orderBy: 'updatedAt',
    orderDirection: 'desc',
  });
 
  // other code...
 
  public ngAfterViewInit(): void {
    // we run this in here to avoid the init event storm that happens when the children components emit events that
    // update the fetch request data to prevent unnecessary duplicate fetch requests
    runInInjectionContext(this._injector, () => {
      toObservable(this._fetchRequestData)
        .pipe(
          debounceTime(0),
          takeUntilDestroyed(),
          distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current))
        )
        .subscribe((requestData) => {
          this._myDataStore.fetch(requestData);
        });
    });
  }
 
  protected onSortingChanged(sortingData: MySortingData): void {
    // code to update _fetchRequestData
  }
 
  protected onFilterChanged(filterData: MyFilterData): void {
    // code to update _fetchRequestData
  }
}
```
- **ALWAYS** inject the component intp a sub component when it needs to access property of the parent component.
- **ALWAYS** use `computed()` is the reference data is a signal.
- **NEVER** allow `null` as a true value for an input(), instead, **ALWAYS** allow it as a input transform value and transform it to `undefined`.
- When injecting a component with `inject()`, **ALWAYS** default to omitting `{ host: true }`. The default `inject()` behavior walks the element-injector tree (which mirrors the rendered DOM and crosses content-projection boundaries), which is what is needed in nearly all parent-component lookups. `{ host: true }` limits the search to the calling component's own host element view, so injecting a parent component (not on the calling component's own element) with `{ host: true }` will throw `NG0201: No provider for ...` even when the parent is structurally present. **ONLY** add `{ host: true }` when you have a concrete reason it is required (e.g. enforcing the dependency must be on the calling component's own host element, not an ancestor), and in that case **ALWAYS** ask first and explain why.
- **ALWAYS** default to using content projection when a component wants to allow the parent to provide content that will be placed in a specific location of the component.
- IF you feel a content projection use case would be better implemented as a Lazy projection via `<ng-template>, **ALWAYS** ask if I would want that vs the standard / simpler content project.
- When a component is take an input() to pass it through to in inner componet is must **ALWAYS** be prefixed with the component name it is passing it to (`boxBorder` being passed to the box components `border` input).

<!-- rules: angular/data-stores.md -->
# IMPORTANT: These rules override general typescript / angular rules
# General Data Store Service Patterns
- **ALWAYS** return the result of api requests from data store method that make api requests as `Observerable<...>`.
- **NEVER** create stories for these types of services.

<!-- rules: angular/directives.md -->
# IMPORTANT: These rules override general typescript / angular rules
# General Angular Directive Patterns
- **NEVER** use `Directive` in the name of the selector
- **NEVER** use `standalone: true` in the `@Directive` decorator.
- **ALWAYS** prefix the directive selector with `org*` (e.g. `[orgText]`, `[orgFormDisabled]`).
- **ALWAYS** have a export default value for each input of the directive using the pattern of `{DIRECTORY_NAME - Directive part}_{INPUT_NAME - selector naming part}_DEFAULT`.
- **ALWAYS** make sure sure all inputs and outputs of a directive are prefix with the camelCase version of the directive's class name minus the `Directive` part like this:
```ts
// ...
export class ScrollAreaDirective {
  // ...
  public scrollAreaDirection = input<ScrollAreaDirection | ''>(SCROLL_AREA_DIRECTION_DEFAULT);
  public scrollAreaOnlyShowOnHover = input<boolean>(SCROLL_AREA_ONLY_SHOW_ON_HOVER_DEFAULT);
  // ... 
```
  - This rule does **NOT** apply to brain directives (those in `projects/shared-ui/src/lib/brain/`); see `.claude/rules/angular/brain-directive-component.md` for the brain-specific rule.
- When the directive selector is **ALSO** used as a value input (e.g. `[orgFormDisabled]="boolean"`), that selector-matching input is the **ONLY** input allowed to keep the `org*` prefix. All other inputs on the directive **MUST** still follow the standard "camelCase class name minus `Directive` part" prefix rule. Example:
```ts
// ...
export class FormDisabledDirective {
  // selector-matching input keeps the `org*` prefix
  public orgFormDisabled = input<boolean>(ORG_FORM_DISABLED_DEFAULT);
  // any additional inputs follow the normal directive prefix rule
  public formDisabledReason = input<string | null>(FORM_DISABLED_REASON_DEFAULT);
  // ...
}
```
- **NEVER** allow `null` as a true value for an input(), instead, **ALWAYS** allow it as a input transform value and transform it to `undefined`.
-

<!-- rules: angular/general.md -->
# IMPORTANT: These rules override general typescript rules
# General Angular Patterns
- **ALWAYS** following Angular 21 standards and best practices.
- **ALWAYS** confirm when you intend to use a non-standard / discouraged pattern before implementing such a pattern
- **ALWAYS** use a signal based approach over "popular" but old angular patterns.
- **ALWAYS** use `projects/shared-ui/src/lib/core/local-storage-manager` for persistent local storage data
- **ALWAYS** prefer organizing writable state into as few unified signal objects (ideally 1 called `_state`) instead of a signal per piece of data.
- **NEVER** use the following decorators: `@HostListener` / `@HostBinding`.
- **ALWAYS** use the `logManager` singleton from `projects/shared-utils/src/utils/log-manager.ts` to log and use and object format with a minimim of a `type` like (**EXCEPT** form storkbook files which can use `console.log()` as needed):
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

<!-- rules: angular/guards-interceptors.md -->
# IMPORTANT: These rules override general typescript / angular rules
# General Angular Guard / Interceptor Patterns
- **ALWAYS** make sure it is returning proper types (`Observable`, `Promise`, `boolean`, `UrlTree`).
- **ALWAYS** make sure async logic is handled correctly and efficiently.
- **ALWAYS** make sure the code is highly performant.
- **NEVER** have side effect unless **100%** NECESSARY

<!-- rules: angular/low-level-code-source-ordering.md -->
# Low Level Code Source Ordering
When you need a low level components / directives / pipes / services, use the code available in this order:
- `/Users/ryanzec/repositories/angular-sandbox/projects/shared-ui/src/lib/core`
- Angular CDK
- Angular Built-In
- `.claude/rules/libraries.md`
- Native HMTL / CSS

<!-- rules: angular/pipes.md -->
# IMPORTANT: These rules override general typescript / angular rules
# General Angular Pipe Patterns
- **ALWAYS** make sure pipes are flagged as `pure: true`.
- **ALWAYS** make sure the pipe only does ONE thing and the name of the pipe CLEARLY indicates what is does.
- **ALWAYS** Make sure the code is highly performant.
- **ALWAYS** make sure the pipe gracefully handles `null` or `undefined` inputs without throwing errors.
- **NEVER** have side effect unless **100%** NECESSARY.
- **ALWAYS** use a single option signature for pipe parameters: `{{ date | orgDate: { dateFormat, timeFormat, showTimezone } }}`
- **ALWAYS** have a export default value for each input of the pipe using the pattern of `{DIRECTORY_NAME}_{INPUT_NAME}_DEFAULT`.

<!-- rules: angular/services.md -->
# IMPORTANT: These rules override general typescript / angular rules
# General Angular Service Patterns
- **NEVER** use `standalone: true` in the `@Directive` decorator.
- **ALWAYS** ask before adding `providedId: 'root'`.

<!-- rules: angular/templates.md -->
# IMPORTANT: These rules override general typescript / angular rules
# General Angular Template Patterns
- **ONLY** use either use `[selected]` for the option or reactive form binding if a reactive form is needed for select elements values.
- **ALWAYS** use the async pipe to handle observables.
- **ALWAYS** use html entity for angular special character in template (such as `&#64;` instead of `@`).
- **ALWAYS** use the `button` html element when needing to create a generic element that has clickbility.
- **ALWAYS** use the `` directive to apply typing to templates that are passed data. 
- **NEVER** use `@let` or `as*()` component method to provide typing for templates.
- **ONLY** use native control flow like `@if`, `@for`, `@switch` in templates.
- **ONLY** use the `class` attribute for applying top level css classes to elements.
- If an element needs to be selected in the context of testing, add and use the `data-testid` attribute.
- **ONLY** use the `style` component if the styles are dynamically generated in the typescript code.

<!-- rules: angular/view-components.md -->
# IMPORTANT: These rules override general typescript / angular / angular components rules
# General Angular View Component Patterns
- **ALWAYS** utilize available components in `projects/shared-ui` project instead of creating bespken components for the view.
- **ALWAYS** make sure to add the route for a new view component if a route is not already configured.
- **ALWAYS** ask if you need to make a new component if the new component should be created in the `shared-ui` project.
- **ALWAYS** ask if a customization is needed to a component in `shared-ui` if that change should be made in the `shared-ui` component instead of one off in the view component.

<!-- rules: general.md -->
# General Patterns
- If you need to execute a command, you must **ONLY** use commands available through moonrepo (check `moon.yml` files for available commands).
- **NEVER** refactor existing code that was not changed as part of your task **UNLESS** it introduces a break change that requires refactoring in usage.
- If you think some code is redundant, **ALWAYS** ask before removing it.

<!-- rules: images.md -->
# Image Patterns
- **ONLY** use images provided as a **STRUCTURAL** reference, always defer to existing component styling if differs from the image.

<!-- rules: libraries.md -->
# Libraries
You **MUST** utilitize the follow library over creating custom functionality:
- `es-toolkit`: General typescript utility functionality.
- `luxon`: Anything related to dates.
- `scrollparent`: For getting the scroll parent of an element.
- `spark-md5`: ONLY when MD5 hashing is specifically needed.
- `uuid`: For UUID specific use cases or when a generic id is needed.
- `zod`: For data validation, type generation, and data structure conversion.

<!-- rules: reviewing.md -->
# Reviewing Patterns 
- **ALWAYS** make cure all rules in `.claude/rules` are properly being applied and not breaking any of them.
- **ALWAYS** apply best practices for accessibility.

<!-- rules: rxjs.md -->
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

<!-- rules: storybook/general.md -->
# IMPORTANT: These rules override general typescript / angular rules
# General Storybook Patterns
- Filing naming patterns:
    - `{DIRECTORY_NAME}.stories.ts` - Development level stories for working in isolation and testing use cases.
    - `{DIRECTORY_NAME}.tests.stories.ts` - Test level stories for running storybook is testing mode through the command line.
- **ALWAYS** split out general stories from stories specifically for using Storybook testing functionality into seperate files.
- Storybook files specific for using storybook testing feature must end with `.tests.stories.ts` and its title must end with `/Tests`.
- **ALWAYS** create a storybook file (`*.stories.ts`) in the same folder as the component with stories for all the unique state, DO NOT create any play / test related stories in this file.
- **ALWAYS** use the `projects/shared-ui/src/lib/example/design-system-demo` components for storybook examples.
- If a storkbook test need to select a dom element, use the `data-testid`
- Tests must **ALWAYS** simulate the the interaction the user would take, **NEVER** call component apis directly.
- **ALWAYS** use custom components from `projects/shared-ui/src/lib/core` or native html elements instead of creating inline components.
- **NEVER** add TSDoc for story code, **NEVER**.
- **ALWAYS** create a LiveDemo story that has controls for all the inputs of the component that control a single component, see `projects/shared-ui/src/lib/core/button/button.stories.ts`.
  - **ALWAYS** make sure that the live demo has controls for any input that effect the visual output of the component.
- **ALWAYS** create a Showcase story that show all different inputs the component can have with each input having its own `org-design-system-demo` section (though it can use other input if there is an interact with the main one for that input), see `projects/shared-ui/src/lib/core/button/button.stories.ts`.
- **ALWAYS** add `tags: ['autodocs']` for component and directive stories.
- **ALWAYS** use the follow component to wrap stroybook examples:
  - `projects/shared-ui/src/lib/private/storybook-example-container`
  - `projects/shared-ui/src/lib/private/storybook-example-container-section`
- **ALWAYS** wrap the docs description content in a `<div class="docs-top-level-overview">...</div>` block.
- **ALWAYS** create a first story called `Default` story with full controls for the autodocs story
- **ONLY** use `inject()` to inject services.
- **ALWAYS** combine development stories (`*.stories.ts`) into one file when a directory has multiple components.
- **ALWAYS** use `.toISO()` when rendering dates for debugging in stories.
- **ALWAYS** define `moduleMetadata` when creating a storybook stories that uses the Story's render method
- **ONLY** write play / tests stories in the tests stories file.
- **NEVER** export component created in storybook files

# References for **PATTERNS** to follow in structuring storybook file for components:
- `projects/shared-ui/src/lib/core/button/button.stories.ts`
- `projects/shared-ui/src/lib/core/tags/tags.stories.ts`

<!-- rules: styling.md -->
# IMPORTANT: These rules override general typescript rules

# CSS Files
The following types of styles must **ALWAYS** be placed in `.css` files:
- viewport / container media queries.
- pseudo selectors (:hover, :focus, :active, :first-child, etc.).
- dynamic values based on component input (which use data-* attributes)
- one off values

# Utility Classes
Utility css classes **MUST** be used for all other styles:
- display (flex, block, inline-flex, etc.).
- spacing (margin, padding, etc.).
- sizing (width, height, etc.).
- font (sizing, weight, color, etc.).
- border (width, style, color, etc.).
- background color.
- z-index
- etc.

# IMPORTANT NOTES:
- when setting a css variable to 0, if that is designed to be used with a unit value of `rem` or something like that, **ALWAYS** add the unit (need for `calc()`'s to work properly).
- when there are sub-components, **ALWAYS** use `host-context()` if you need to style based on an attribute that is already needed on the parent component instead of injecting and adding the data attribute to the sub component so the parent is the single source of thruth.

# Design Token / CSS Variables Patterns:
- any component that can have variants that effect css property must **ALWAYS** use design tokens (css variables) for that as a placeholder value in a component design token file in `projects/shared-ui/src/lib/styles/animations.css`.
- the css code **MUST** implement all variants (even whatever the default values are) as the default css variables are more placeholders than values to be used.

# Styling Patterns
- **NEVER** add styling to components in `projects/shared-ui/src/lib/brain`.
- **NEVER** add specific values units for height / widths to component is `projects/shared-ui/src/lib/core` (`px`, `cm`, `mm`, `in`, `pt`, `pc`), they should **ALWAYS** grow based on the content inside them or use relatively values (`%`, `em`, `rem`, `vh`, `vw`, `vmin`, `vmax`, `ch`, `ex`, `lh`, `rlh`, `vi`, `vb`).
- If you intend to set an explicit height / width for any component, **ALWAY** make the a question **BEFORE** writing any code.
- **ALWAYS** use css files for styling components and directives in `projects/shared-ui/src/lib/core` **EXCEPT** for `*stories*` files.
- **ALWAYS** use css variables from `projects/shared-ui/src/lib/styles/base-tokens.css` or the `{component-name}-tokens.css` file (co-located with the component in `projects/shared-ui/src/lib/core/{component-name}/`) for styling in css files.
- **ALWAYS** favor css utility based styling for component **OUTSIDE** of `projects/shared-ui/src/lib/core`.

# Layer Patterns
- **ALWAYS** wrap css in general component css files (NOT variables component cssfiles) in `@layer components {...}` for components in `projects/shared-ui/src/lib/core`.
- **ALWAYS** wrap css in general component css files (NOT variables component cssfiles) in `@layer application {...}` for components outside of `projects/shared-ui/src/lib/core`.

# General Styling Patterns
- If you see what you think is a tailwind css, check to see if those css classes are in any of the custom utilities in `projects/shared-ui/src/lib/styles` as tailwind utility classes **ARE NOT USE**, if the utility class does not exist, **ALWAYS** ask if it should be added to an existing one or a new utility class file.
- **NEVER** manually apply resets as we include tailwind's preflight to reset default browser styles.
- **ONLY** use utility classes that are available from `projects/shared-ui/src/lib/styles`.
- **ONLY** write custom CSS or create custom class names when no combination of utility classes from `projects/shared-ui/src/lib/styles` can achieve the needed result.
- When no utility class exists for a needed style, **ALWAYS** ask whether to add the utility class to `projects/shared-ui/src/lib/styles` instead of writing custom CSS.
- **ALWAYS** use reference images as a rough reference to the structure and over goal but not end goal pixel perfect expection, **ALWAYS** use existing colors and spaces that best matches when is in the image.
- **ALWAYS** prioritize written instruction over reference images.
- **ALWAYS** use flexbox for aligning and spacing a group of elements.
- **ALWAYS** omit passing values to component inputs that has a default value other than `null` / `undefined`.
- **ALWAYS** use `var()` when defining custom css variables
- **ONLY** use system level design tokens in css utility classes
- **ALWAYS** use `aria-*` when available and then fallback to `data-*` attributes for component styling that is based on an input having the input value be the `data-*` attribute value, see `projects/shared-ui/src/lib/core/box` as a reference.
- **ALWAYS** use the `.dark` for defining dark mode colors.
- **ALWAYS** use `/* ... */` to comment is CSS.
- **ONLY** use negative margins as a LAST resort.
- **ALWAYS** use `focus-visible` over `focus` pseduo selector.
- **ALWAYS** use thing like background color change when styling `focus` elements for accessability.
- **ALWAYS** prevent states based styles from being applied to components when it is disabled.
- **ALWAYS** use `rem` over `px` for css values.
- **ONLY** add a comment at the end of the line when using **RAW** `rem` values that just has the `px` value assuming a `1rem` = `16px`, **DONT** do this when using a variable that is a `REM` value.
- **ALWAYS** place ALL @keyframes definations in `projects/shared-ui/src/lib/animations.css`.
- **NEVER** use the style tag unless the value NEEDS to be dynamic based on typescript code.=
- **NEVER** add animations or transitions unless **EXPLICITLY** asked for.
- **NEVER** use box shadows unless **EXPLICITLY** asked for.
- **NEVER** use margin to space element within a container.
- **NEVER** use ring / outline / box-shadow styles other than to remove it **OR** if it is for a11y.
- **NEVER** use a default values when using `var(...)`.
- **ALWAYS** make css class name as short as needed but still descripitive since Angular handle encapulation to avoid naming conflict so `header` instead of `integration-card-configured-header`.
- **ALWAYS** make sure to update the `.moon/scripts/build-typescript-design-token.cjs` script when modifying css variables in any `*-tokens.css` file.
- **ALWAYS** make sure to run `moon :build-design-tokens` when css variables in any `*-tokens.css` file are modified in any way (added / removed / changed).
- **ALWAYS** prefix component specific design token names with `{component-name}-*` following base the standard base token naming.

<!-- rules: testing/unit.md -->
# IMPORTANT: These rules override general typescript / angular rules
# General Unit Testing Patterns
- **ALWAYS** use `vitest` apis.
- **ALWAYS** make sure the pipe only does ONE thing and the name of the pipe CLEARLY indicates what is does.
- **ONLY** use `debugElement` when **100%** NECESSARY.
- **ALWAYS** group related test in nested describes.
- **NEVER** mock any animation stuff (`provideNoopAnimations`, `NoopAnimationsModule`, etc.).
- **NEVER** write unit tests that are just a combination of multiple other unit tests.

<!-- rules: typescript/custom-utilities.md -->
# Custom Utilities
When a library in `.claude/rules/libraries.md` does not provided the need functionality, you must **ALWAYS** place common re-usable functionality into util methods in `projects/shared-utils/src/utils`, if a method already exists use it other add it (or add a new file in needed in `projects/shared-utils/src/utils`).

When creating a new utils file, always reference the exist ones for the general pattern of implementation.

<!-- rules: typescript/general.md -->
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
- **AWLAYS** use the `projects/shared-ui/src/lib/styles/design-tokens.ts` when you need to access css design tokens in typescript code.

<!-- rules: use-cases/angular-content-projection.md -->
# Angular Content Projection

When a component need to project content in the the component when using it are are two main ways to do this with defined contexts of when you use which.

## NG Content Select (Default)

The default pattern which is a simpler implementation is to use the named slot pattern with`<ng-content select="">`:
```html
<!-- component template --> 
<ng select="header" />

<!-- projecting when using the component -->
<org-custom-component>
  <h1 header>Header</h1>
</org-custom-component>
```

## Template Outlet (Power Usage)

This patterns is to use the `<ng-container>` + `<ng-template>` and `ngTemplateOutlet` which is:
```ts
// in the component class
protected headerTemplate = contentChild<TemplateRef<unknown>>('header');
```

```html
<!-- component template --> 
@if (headerTemplate(); headerTemplate) {
  <ng-container [ngTemplateOutlet]="headerTemplate">
}

<!-- projecting when using the component -->
<org-custom-component>
    <ng-template #pre><h1>Custom PreContent</h1></ng-template>
</org-custom-component>
```

If any of the following things are true, you must **ALWAYS** use the Template Outlet pattern:
- The template needs to be applied multiple times in a loop.
- Internal data of the component needs to be passed to the template.
- If the presentence of the template is conditional used to in **ANY** way.
- You need to lazy load the content.

<!-- rules: use-cases/css-local-variables.md -->
# CSS Local Variables

When a component need multiple variants of something (like size, color, etc.) we should be setting the css property **ONCE** using a component design token (css variable) and then to avoid it, we need to override the **DESIGN TOKEN** and **NEVER** override the css property. This reduces the amount of code needs which in general should make the code easier to reason about.

# Notes
- **ONLY** have 1 tokens file even if there are multiple components / css files.
- **ALWAYS** make things like color, border, spacing, sizing, psuedo states, typography, transition durations design tokens

# References
- `projects/shared-ui/src/lib/core/button` / `projects/shared-ui/src/lib/core/button/button-tokens.css`
- `projects/shared-ui/src/lib/core/tags` / `projects/shared-ui/src/lib/core/tags/tags-tokens.css`

<!-- rules: use-cases/detected-output-has-listener.md -->
# Detecting Output Has Listener

When you need to detect if an `output()` of a component has a listener, you need to use an RxJS Subject and the `outputFromObservable()` helper method. The pattern looks like this:
```ts
export class Table<T = unknown> {
  private readonly _rowClicked$ = new Subject<T>();

  public readonly rowClicked = outputFromObservable(this._rowClicked$);

  // just and EXAMPLE usage
  protected readonly hasRowClickedListener = computed<boolean>(() => this._rowClicked$.observed);
}
```

<!-- rules: use-cases/needing-multiple-ng-content-element.md -->
# Needing Mutliple `<ng-content />` Elements
Since Angular templates can only have one `<ng-content />`, when a pattern comes up where multiple there are multiple locations where we want to have `<ng-content />`, we need to use the built-in `NgTemplateOutlet` feature that puts the `<ng-content />` in a `<ng-template />` and then that template can be reference with `<ng-container />` multiple times.

See `projects/shared-ui/src/lib/core/list` list item for a **PATTERN** refernce of this use case.

<!-- rules: ux/usaved-changed.md -->
# Unsaved Changes Patterns
- **ALWAYS** implement the interface from `projects/shared-ui/src/lib/core/unsaved-changes-guard`.
- **ALWAYS** add code to the component implementation this functionality to have guards when the tab is closed or page is refreshed.

<!-- rules: ux.md -->
# UX Patterns
- **NEVER** disabled a button until the form in validate.
