---
name: directive-development
description: Use this skill whenever working on an Angular directive. Covers single-concern scope, the `org*` selector prefix, class-name-based input/output prefixing, default-value exports, and null-to-undefined input transforms.
---
# Directive Development Skill

# Rules
- Should **ONLY** focus on one logic group of data / functionality.
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
  - This rule does **NOT** apply to brain directives (files named `*-brain.ts` colocated with their core counterpart in `projects/shared-ui/src/lib/core/<component-name>/`); see `.claude/rules/angular/brain-directive-component.md` for the brain-specific rule.
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

# **REQUIRED** End Review

The following must be reviewed after finishing the task before the task can be considered complete:

- Review for any glaring issues.
