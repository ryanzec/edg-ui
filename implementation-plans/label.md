# Label — Implementation Guide

A form-field label with built-in indicators for **required** (a danger-colored asterisk) and **loading** (a spinner). Renders as a real `<label>` linked by `for`/`id` when the field is a single native control, or as a styled `<div>` for compound fields. Composes `org-loading-spinner` and `org-icon`.

## Anatomy

- **Root**: `<label class="org-label" for="…" data-required="1" data-loading="1">` (or `<div class="org-label">` for compound fields).
- **Text** (optional wrapper): `<span class="org-label-text">Email address</span>` — required only when other markers/slots sit beside the text. Bare text inside the label is supported.
- **Spinner** (when loading): `<span class="org-loading-spinner">…</span>`.
- **Trailing slot** (optional): `<span class="org-label-trailing">…</span>` — for help icons, inline links, badges. Sits after the spinner.

## Authoring shape

```html
<label class="org-label" for="email">Email address</label>

<label class="org-label" data-required="1" for="password">Password</label>

<label class="org-label" data-loading="1" for="org">
  <span class="org-label-text">Organization</span>
  <span class="org-loading-spinner"> … </span>
</label>

<label class="org-label" for="bio">
  <span class="org-label-text">Bio</span>
  <span class="org-label-trailing">
    <span class="org-icon" data-icon="info" data-size="sm" data-color="secondary"></span>
  </span>
</label>
```

## Root (`.org-label`)

- `display: inline-flex; align-items: center; gap: var(--spacing-1_5)`.
- Type tracks form-control density:
  - `font-family: inherit; font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); line-height: var(--line-height-tight); color: var(--color-fg); letter-spacing: var(--letter-spacing-normal)`.
- `cursor: default` — overrides the native label's text cursor so it reads as UI chrome, not editable text.

## Text wrapper (`.org-label-text`)

- `display: inline-flex; align-items: center; gap: 0.125rem` — for cleaner alignment when other markers sit alongside.
- Optional. Bare text inside the label is styled identically.

## Required marker (`data-required="1"`)

A trailing asterisk in danger color, rendered as a generated marker so consumers don't author the glyph:

```css
.org-label[data-required="1"] .org-label-text::after,
.org-label[data-required="1"]:not(:has(.org-label-text))::after {
  content: "*";
  margin-left: 0.125rem;
  color: var(--color-danger);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
}
```

The `:not(:has(.org-label-text))` fallback handles the bare-text case so `<label class="org-label" data-required="1">Email</label>` still gets the asterisk.

The marker sits flush with the label text (`0.125rem` margin only) so "Email *" reads as one unit, not "Email" + a separate badge.

## Loading slot

When a `<span class="org-loading-spinner">` lives inside the label:

```css
.org-label .org-loading-spinner {
  color: var(--color-fg-muted);
  margin-left: var(--spacing-0_5);
}
```

The spinner color is muted so it doesn't pull focus from the label text. Size inherits from the loader's defaults.

## Trailing slot (`.org-label-trailing`)

- `display: inline-flex; align-items: center; gap: var(--spacing-1)`.
- `color: var(--color-fg-muted)` — children inherit the muted foreground unless they opt into a different color.
- Sits after the spinner. Use for help icons, inline links, badges — anything informational about the field.

## Behaviours / rules

- **Native `<label>` is the default.** Use `for` / `id` linkage for any single native control. Drop to `<div class="org-label">` only for compound fields where the linked-id model breaks down.
- **The required asterisk is generated.** Don't hand-author `*` in the label text — set `data-required="1"`. The marker stays in danger color, in the correct weight, with the correct spacing for free.
- **Spinner is a real `org-loading-spinner`.** The label only restyles its color and adds a tiny left margin. Don't paint a custom spinner here.
- **Trailing slot is for accessory content.** It defaults to muted color so a help icon reads as secondary. Children that need more emphasis set their own color via `data-color`.
- **`cursor: default`.** Pinned over the native text cursor so the label reads as chrome. Don't restore `cursor: text`.
- Defaults when omitted: not required, not loading, no trailing slot.
