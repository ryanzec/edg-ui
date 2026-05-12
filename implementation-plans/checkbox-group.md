# Checkbox Group — Implementation Guide

A vertical stack of `org-checkbox` options with an optional legend, description, error state, and disabled state. Sibling primitive to Radio Group — they share spacing tokens and rhythm so a Checkbox Group can sit beside a Radio Group in the same form without drift.

**Layout is vertical-only, by design.** No horizontal / grid mode.

## Anatomy

- **Root**: `<fieldset class="org-checkbox-group" data-size="sm|base|lg" data-state="error" data-disabled="1">` — `fieldset` + native legend semantics.
- **Header** (optional): `<div class="org-checkbox-group-header">`
  - `<legend class="org-checkbox-group-legend" data-required="1">` — required asterisk via attribute.
  - `<div class="org-checkbox-group-description">` — muted helper line.
- **Options**: `<div class="org-checkbox-group-options">` containing `<label class="org-checkbox">` children. The `data-size` on the group cascades to each Checkbox.

## Authoring shape

```html
<fieldset class="org-checkbox-group" data-size="base">
  <div class="org-checkbox-group-header">
    <legend class="org-checkbox-group-legend" data-required="1">Notifications</legend>
    <div class="org-checkbox-group-description">Pick the events you want emailed.</div>
  </div>
  <div class="org-checkbox-group-options">
    <label class="org-checkbox"> … </label>
    <label class="org-checkbox"> … </label>
    <label class="org-checkbox"> … </label>
  </div>
</fieldset>
```

## Root (`.org-checkbox-group`)

- Internal locals (mapped from tokens):
  - `--_cbg-group-stack: var(--spacing-choice-group-stack)` — gap between header and options block.
  - `--_cbg-group-desc-gap: var(--spacing-choice-group-desc)` — gap between legend and description.
  - `--_cbg-stack: var(--spacing-choice-stack-base)` — gap between adjacent option rows.
- `display: flex; flex-direction: column; gap: var(--_cbg-group-stack)`.
- `font-family: var(--font-sans); color: var(--color-fg)`.
- Resets the native fieldset chrome: `border: 0; margin: 0; padding: 0; min-width: 0`.

## Header

- `display: flex; flex-direction: column; gap: var(--_cbg-group-desc-gap)`.

### Legend (`.org-checkbox-group-legend`)

- `font-size: var(--font-size-choice-legend)`, `font-weight: var(--font-weight-semibold)`, `line-height: var(--line-height-tight)`, `color: var(--color-fg)`.
- `margin: 0; padding: 0` — overrides the native fieldset legend layout.
- `[data-required="1"]::after { content: '*'; color: var(--color-danger); margin-left: var(--spacing-0_5); }`.

### Description (`.org-checkbox-group-description`)

- `font-size: var(--font-size-form-field-hint)`, `color: var(--color-fg-muted)`, `line-height: var(--line-height-normal)`.

## Options (`.org-checkbox-group-options`)

- `display: flex; flex-direction: column; gap: var(--_cbg-stack); min-width: 0`.

## Sizes (`data-size`)

- `data-size` on the group cascades to each child Checkbox — Checkbox owns indicator + label scaling.
- The **inter-option gap stays constant across sizes**. The rhythm of the stack is independent of indicator scale, by design — a tight `sm` stack at one size and a roomy `lg` stack at another would break vertical alignment with siblings.

## Card-variant tightening

When _any_ child carries `data-variant="card"`, the group uses a tighter stack:

```css
.org-checkbox-group:has(.org-checkbox[data-variant='card']) {
  --_cbg-stack: var(--spacing-2);
}
```

Card spacing also stays uniform across sizes — for the same alignment reason as the default variant.

## Error state (`data-state="error"`)

- Cascades the danger border into every child Checkbox that hasn't already been pinned to its own state:

```css
.org-checkbox-group[data-state='error'] .org-checkbox:not([data-state]) {
  --_cb-border-color: var(--color-danger);
  --_cb-border-color-hover: var(--color-danger);
}
```

This sets the border roles on Checkbox's locals — only the indicator's border picks up red, not its fill or label color, matching the rest of the form-field error language.

A child Checkbox with its own `data-state="error"` keeps that explicit state.

## Disabled state (`data-disabled="1"`)

- Dims every child that hasn't opted out with `data-disabled="0"`:

```css
.org-checkbox-group[data-disabled='1'] .org-checkbox:not([data-disabled='0']) {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}
.org-checkbox-group[data-disabled='1'] .org-checkbox:not([data-disabled='0']) .org-checkbox-native {
  pointer-events: none;
}
```

Children stay technically focusable for assistive tech but cannot be activated.

## Behaviours / rules

- **Wraps real `org-checkbox` rows.** The group never repaints checkbox internals; it owns layout + group-level state cascade only.
- **Vertical-only.** Per agreed spec — no horizontal or grid layout. Use Checkbox Group, not a custom flex row, when you have a labelled set.
- **Native `fieldset` + `legend`.** Accessibility is built on the native semantics; don't replace with `div` + `aria-labelledby` unless you have a constraint that forbids fieldset.
- **Required asterisk lives on the legend.** Don't stamp asterisks onto individual checkboxes — required means the _group_ must have at least one selection (or whatever the consumer's rule is).
- **Per-child state wins.** A Checkbox with its own `data-state` or `data-disabled="0"` opts out of the group cascade. Use this sparingly — usually the whole group's state is uniform.
- **Sit beside a Radio Group cleanly.** Two Choice Groups share the `--spacing-choice-*` tokens, so vertically stacked groups in the same form align at the legend, description, and option rows.
- Defaults when omitted: `data-size="base"`, no error state, not disabled.
