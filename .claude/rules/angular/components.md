---
alwaysApply: true
---
# IMPORTANT: These rules override general typescript / angular rules
# General Angular Component Patterns
- **NEVER** use `standalone: true` in the `@Component` decorator.
- **ALWAYS** have a export default value for each input of the comopnent using the pattern of `{DIRECTORY_NAME}_{INPUT_NAME}_DEFAULT`.
- **ONLY** use modern signal based features like `input()`, `output()`, `computed()`
- **ALWAYS** use `computed()` when generating a property from another signal even if it current is not used reactively **ONLY** if it requires **NO** parameters.
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
- **ONLY** allow a `containerClass` input if it is applied to the outer most element in the template and has no better semanic name.
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
- **ALWAYS** inject the component intp a sub component when it needs to access property of the parent component.
- **ALWAYS** use `computed()` is the reference data is a signal.
- **NEVER** allow `null` as a true value for an input(), instead, **ALWAYS** allow it as a input transform value and transform it to `undefined`.
- When injecting a component with `inject()`, **ALWAYS** default to omitting `{ host: true }`. The default `inject()` behavior walks the element-injector tree (which mirrors the rendered DOM and crosses content-projection boundaries), which is what is needed in nearly all parent-component lookups. `{ host: true }` limits the search to the calling component's own host element view, so injecting a parent component (not on the calling component's own element) with `{ host: true }` will throw `NG0201: No provider for ...` even when the parent is structurally present. **ONLY** add `{ host: true }` when you have a concrete reason it is required (e.g. enforcing the dependency must be on the calling component's own host element, not an ancestor), and in that case **ALWAYS** ask first and explain why.
- **ALWAYS** default to using content projection when a component wants to allow the parent to provide content that will be placed in a specific location of the component.
- If you feel a content projection use case would be better implemented as a Lazy projection via `<ng-template>, **ALWAYS** ask if I would want that vs the standard / simpler content project.
- When a component is take an input() to pass it through to in inner componet is must **ALWAYS** be prefixed with the component name it is passing it to (`boxBorder` being passed to the box components `border` input).
- Host event bindings must **ONLY** be used with native dom events or `output()` declare on the component / directive itself, events on directives that are being added via `hostDirectives` **MUST** directly attach to the output via RxJS in the constructor.
