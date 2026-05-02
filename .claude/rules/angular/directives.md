---
alwaysApply: true
---
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
