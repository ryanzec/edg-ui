---
name: component-development
description: Use this skill whenever the user asks to create, modify, refactor, review, style, or otherwise work on any Angular component, directive, brain component, or core component. Covers component architecture, brain/presentation split, content projection, output-listener detection, CSS variables, and Storybook updates.
---
# Component Development Skill

# IMPORTANT Component Coding Patterns
- `.claude/rules/patterns/angular-component-effective-input-value.md`
- `.claude/rules/patterns/angular-component-hide-empty-slot-projection.md`
- `.claude/rules/patterns/angular-content-projection.md`
- `.claude/rules/patterns/css-local-variables.md`
- `.claude/rules/patterns/needing-multiple-ng-content-element.md`
- `.claude/rules/patterns/angular-component-host-directives.md`
- `.claude/rules/patterns/unsaved-changes.md`

# Abbreviation Patterns
When an input of a component maps to css related functionality, the values of those input must use the same abbreviations that the `css-development` skill uses:
- `xs` instead of `extra small`.
- `sm` instead of `small`.
- `md` instead of `medium`.
- `lg` instead of `large`.
- `xl` instead of `extra large`.
- `bg` instead of `background`.
- `fg` instead of `foreground`.

# Prework Validation
If the code being worked on is in the `projects/shared-ui` directroy and it is injecting a service, if it is not stated **EXPLICITLY** that the service should be added to the `providers` of the components, **ALWAYS** ask if the component needs to add the service to the `providers` and **ALWAYS** recomend to **NOT** do that.

# Reuse Protocol
- **ALWAYS** use Angular CDK whenever it has functionality available, **ONLY** resort to custom logic when Angular CDK does not provide the needed functionality or the functionality is one of the following:
  - For drag and drop functionality, **ALWAYS** use `@atlaskit/pragmatic-drag-and-drop` **INSTEAD** of Angular CDK.
  - **ALWAYS** use `cdkObserveContent` over native solutions like `MutationObserver` when possible.
- You are to **ALWAYS** re-use functionality from `projects/shared-ui/src/lib/core` over using bespoken / inline components when possible.

# Core Component

If the component in in the `projects/shared-ui/src/lib/core` directory, it **MUST** follow the `.claude/rules/patterns/brain-presentation-component-split.md` pattern.

# Component Selector Prefixes
- `org-` - All components in `projects/shared-ui`.
- `cp` - All components in `projects/customer-portal`.
- `ip` - All components in `projects/internal-portal`.

# **CRITICAL** Reles
- Even if you are given an list of component to use for specific pieces, **ALWAYS** make sure to looks for other components that are not mention that can be used for pieces not specified in the components to use list.

# General Rules
- **NEVER** use `standalone: true` in the `@Component` decorator.
- **ALWAYS** have a export default value for each input of the comopnent using the pattern of `{DIRECTORY_NAME}_{INPUT_NAME}_DEFAULT`.
- **ONLY** use modern signal based features like `input()`, `output()`, `computed()`.
- **ALWAYS** use `computed()` when generating a property from another signal even if it current is not used reactively **ONLY** if it requires **NO** parameters.
- Default members (data) / methods (functions) of the class component to `protected`.
- **ONLY** use public for component members (data) / method (function) if that is **REQUIRED** to be part of the component public api.
- **ONLY** allow a `containerClass` input if it is applied to the outer most element in the template and has no better semanic name.
- **ALWAYS** explicitly define the input(s) that the directive defines on the component itself when adding a `hostDirective` to a component and **NOT** as standalone property `input()`'s of the class.
- If an icon is requested that is not available via `IconName` in `projects/shared-ui/src/lib/core/icon/icon.ts` **ALWAYS** ask before added a newicon, always say which icon you are adding,a nd the icon needs to come from lucide icons.
- **ALWAYS** prefix any input with `default*` when it is **ONLY** used to default internal state.
- **ALWAYS** use Reactive forms over of Template-driven ones.
- **ONLY** use `class` attribute for css classes.
- **ONLY** use `style` attribute for inline styles when **100%** needed (like css value that is dynamic based on javascript logic).
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
- **ALWAYS** make sure the form input component properly support angular's reactive form system.
- **ALWAYS** use `zodValidator` when dealing with form validation where a zod schema should be used.
- **ALWAYS** communicate child internal state changes to parent components with an `output()` event unless EXPLICITLY told otherwise.
- **ALWAYS** use a `model()` instead of a `input()` when the component itself and its parent need acces to modify and / or know when it changes.
- **ONLY** use `output()` to signal an internal event has happened in the component, NOT for state changing.
- **ONLY** use Angular's official naming conventions for internal event handler methods — use descriptive verb-based names (e.g., `save()`, `click()`, `submit()`) without requiring any specific prefix.
- **NEVER** allow `null` as a true value for an input(), instead, **ALWAYS** allow it as a input transform value and transform it to `undefined`.
- When injecting a component with `inject()`, **ALWAYS** default to omitting `{ host: true }`. The default `inject()` behavior walks the element-injector tree (which mirrors the rendered DOM and crosses content-projection boundaries), which is what is needed in nearly all parent-component lookups. `{ host: true }` limits the search to the calling component's own host element view, so injecting a parent component (not on the calling component's own element) with `{ host: true }` will throw `NG0201: No provider for ...` even when the parent is structurally present. **ONLY** add `{ host: true }` when you have a concrete reason it is required (e.g. enforcing the dependency must be on the calling component's own host element, not an ancestor), and in that case **ALWAYS** ask first and explain why.
- **ALWAYS** default to using content projection when a component wants to allow the parent to provide content that will be placed in a specific location of the component.
- When a component is taking an `input()` to pass it through to in inner component is must **ALWAYS** be prefixed with the component name it is passing it to (`boxBorder` being passed to the box components `border` input).
- Host event bindings must **ONLY** be used with native dom events or `output()` declare on the component / directive itself, events on directives that are being added via `hostDirectives` **MUST** directly attach to the output via RxJS in the constructor.
- **ALWAYS** omit passing values to component inputs that has a default value other than `null` / `undefined`.

# Brain Specific Rules
- **NEVER** add styling to brain directives (files named `*-brain.ts` colocated inside `projects/shared-ui/src/lib/core/<component-name>/`).

# Template Rules
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
- **NEVER** attempt to use `JSON.*` in template files.
- **ALWAYS** use `[slot="{{SLOT NAME}}"]` for ng-content select content projection.

# UX Rules
- **NEVER** disabled a button until the form in validate.

# **REQUIRED** End Review

The following must be reviewed after finishing the task before the task can be considered complete:

- Review for any glaring issues.
- **ALWAYS** make sure if a token file has been add or modified in `projects/shared-ui/src/lib/core`, it is properly imported in `projects/shared-ui/src/lib/core/tokens.css`
- Is there any code for this component in `projects/shared-ui/src/lib/core` and if so, should any of that code be broken out into a brain directive colocated alongside it in the same `projects/shared-ui/src/lib/core/<component-name>/` directory (file named `<component-name>-brain.ts`)?
- If there is logic in a component that is being used to handle a missing feature in a child component that is being used, **ALWAYS** ask if that should be done or if the child component needs a refactor so the use case can be manually checked
- `::ng-deep` should **NEVER** be used.
- Any questionable logic should be pointed out to be verified it is intended.
- **ALWAYS** make sure best practices for accessibility have been applied to the components implementation.
-
