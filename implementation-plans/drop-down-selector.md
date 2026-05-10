# Drop Down Selector — Implementation Guide

A button-like trigger that opens an OverlayMenu of selectable options. Used for action-bar pickers — "Status", "Sort by", "Owner", "Last updated" — where the control should read as an action button, not as a form field. (The form-field flavour of the same idea is **Combobox**, which sits inside an Input shell.)

The stylesheet owns one thing: the **inside** of the trigger — how the label, the optional value tail, the count chip, and the chevron sit on a single baseline so a row of these selectors reads as one toolbar. Panel chrome belongs to OverlayMenu; row chrome belongs to List. There is no second source of truth.

## Anatomy

- **Anchor wrapper**: `<span class="org-overlay-menu-anchor" data-align="start" data-position="below|above|before|after">`.
- **Trigger**: a real `org-button` with `org-drop-down-selector` added; `data-color="neutral" data-variant="ghost" data-size="sm|base|lg"`, `data-state="open|closed"`, `aria-haspopup="menu"`, `aria-expanded`, optional `data-has-value="1"` when something is picked.
- **Trigger inner pieces** (in order):
  1. Optional leading icon: `<span class="org-icon" data-icon="…" data-context="button"></span>`.
  2. Label: `<span class="org-drop-down-selector-label">Status</span>`.
  3. Hairline separator: `<span class="org-drop-down-selector-sep" aria-hidden="true"></span>` (renders only when `data-has-value="1"`).
  4. Either a value `<span class="org-drop-down-selector-value">Active</span>` (single-mode) **or** a count chip `<span class="org-tag org-drop-down-selector-count" data-color="neutral" data-variant="weak">3 selected</span>` (multi-mode).
  5. Trailing chevron: `<span class="org-icon org-drop-down-selector-chevron" data-icon="chevron-down" data-context="button"></span>`.
- **Panel**: a real `<div class="org-overlay-menu" role="menu" data-state="closed">` with `org-list-item` rows inside; the inner `<ul class="org-overlay-menu-list">` carries `data-show-check="1"` when checkmarks should appear in a leading gutter on every row.
- **Optional footer row**: an `org-list-item` with `org-drop-down-selector-clear` for "Clear selection".

## Authoring shape

```html
<span class="org-overlay-menu-anchor" data-align="start">
  <button class="org-button org-drop-down-selector"
          data-color="neutral" data-variant="ghost" data-size="base"
          data-state="closed" data-has-value="1"
          type="button" aria-haspopup="menu" aria-expanded="false">
    <span class="org-icon" data-icon="circle" data-context="button"></span>
    <span class="org-drop-down-selector-label">Status</span>
    <span class="org-drop-down-selector-sep" aria-hidden="true"></span>
    <span class="org-drop-down-selector-value">Active</span>
    <span class="org-icon org-drop-down-selector-chevron" data-icon="chevron-down" data-context="button"></span>
  </button>
  <div class="org-overlay-menu" role="menu" data-state="closed">
    <ul class="org-overlay-menu-list" data-show-check="1">
      <li class="org-list-item" data-selected="1">
        <span class="org-drop-down-selector-check"><span class="org-icon" data-icon="check"></span></span>
        Active
      </li>
      <!-- … -->
    </ul>
  </div>
</span>
```

Multi-mode swaps the value text for the count chip; everything else is identical.

## Trigger (`.org-drop-down-selector`)

- The trigger **is** an `org-button` — height, font, focus ring, padding-x, hover/active ramps, disabled treatment all flow through `data-color` / `data-variant` / `data-size`.
- Internal locals (mirror tokens):
  - `--_label-color: var(--color-drop-down-selector-label)` — fg-muted when paired with a value.
  - `--_value-color: var(--color-drop-down-selector-value)` — full fg.
  - `--_sep-color: var(--color-drop-down-selector-separator)` — aliased to the soft border.
  - `--_inner-gap: var(--spacing-drop-down-selector-gap)` (`6px` at base).
  - `--_sep-inset-y: var(--spacing-drop-down-selector-separator-y)` (`4px`).
  - `--_min-w / --_max-w` — `7.5rem` / `18rem` at base.
  - `--_count-h: var(--sizing-drop-down-selector-count)` (control-sm, `24px`).
- Layout adjustments on top of Button:
  - `gap: var(--_inner-gap)` (overrides Button's default cluster gap so the inner rhythm stays tight).
  - `min-width: var(--_min-w); max-width: var(--_max-w)` — the trigger never collapses to a chip and never blows past the cap.
  - `justify-content: flex-start` — content packs to the start; the chevron pulls itself to the trailing edge with `margin-left: auto`.

### Sizes

Track Button's three sizes, but only adjust the min-width and inner gap:

| Size | `--_min-w` | `--_inner-gap` |
| ---- | ---------- | -------------- |
| `sm` | `var(--sizing-drop-down-selector-min-width-sm)` | `var(--spacing-1)` (`4px`) |
| `base` (default) | `var(--sizing-drop-down-selector-min-width)` (`7.5rem` / 120px) | `var(--spacing-1_5)` (`6px`) |
| `lg` | `var(--sizing-drop-down-selector-min-width-lg)` | `var(--spacing-2)` (`8px`) |

## Inner pieces

### Label (`.org-drop-down-selector-label`)

- `flex: 0 0 auto`.
- Standalone (no value picked): `color: var(--color-fg); font-weight: var(--font-weight-medium)` — reads as a normal Button label.
- Paired with a value (`[data-has-value="1"]` on the trigger): `color: var(--_label-color)` (fg-muted); `font-weight: var(--font-weight-regular)` — drops to a prefix.

### Separator (`.org-drop-down-selector-sep`)

- `flex: 0 0 1px; align-self: stretch; margin-block: var(--_sep-inset-y); background: var(--_sep-color)`.
- `display: none` by default; revealed via `display: block` only when the trigger has `data-has-value="1"`. A trigger with no value reads as a clean Button — no orphan rule.

### Value (`.org-drop-down-selector-value`)

- `flex: 1 1 auto; min-width: 0`.
- `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`.
- `color: var(--_value-color); font-weight: var(--font-weight-medium)`.

### Count chip (`.org-drop-down-selector-count`)

- Built on `org-tag` with `data-color="neutral" data-variant="weak"` so a tag tweak propagates through.
- Pinned dimensions:
  - `--_height: var(--_count-h)` (`24px`).
  - `--_pad-x: var(--spacing-2)` (`8px`).
  - `--_font-size: var(--font-size-xs)`.
- `flex: 0 0 auto`.

### Chevron (`.org-drop-down-selector-chevron`)

- `margin-left: auto; flex: 0 0 auto`.
- `transition: transform var(--motion-overlay-menu-duration) var(--motion-ease-standard)`.
- `[data-state="open"]` on the trigger rotates `180deg`.
- `prefers-reduced-motion: reduce` zeros the transition.

## Open-state surface emphasis

While the panel is open the trigger should read "armed" — same visual weight as a hovered ghost button.

```css
.org-button.org-drop-down-selector[data-state="open"]:not(:disabled) {
  background: var(--color-neutral-soft);
  color: var(--color-fg);
}
```

This lifts Button's existing soft-tint state via `data-state="open"` rather than introducing a new ramp.

## Menu rows

Rows inside the panel are real `.org-list-item`s — List paints hover, focus, active, selected, and disabled. Drop Down Selector adds **only** the leading-check column when needed:

```css
.org-overlay-menu-list[data-show-check="1"] .org-list-item {
  --_check-gutter: var(--sizing-combobox-check-gutter); /* 18px — matches Combobox */
}
```

The `.org-drop-down-selector-check` slot itself:

- `flex: 0 0 var(--_check-gutter); display: inline-flex; align-items: center; justify-content: flex-start`.
- `color: var(--color-combobox-option-check)`.
- `opacity: 0` by default; `[data-selected="1"]` on the row flips to `1`.
- `transition: opacity var(--motion-duration-fast)`.
- Inner icon at `var(--sizing-icon-base)`, color `currentColor`.

The check column is reserved on **every** row of a `[data-show-check="1"]` list so labels x-align whether or not a row is selected — the same alignment promise Combobox makes.

## Clear footer row

```html
<li class="org-list-item org-drop-down-selector-clear">Clear selection</li>
```

- `color: var(--color-drop-down-selector-clear)` (fg-muted) at rest.
- `:hover` lifts to `var(--color-fg)`.
- Sits below the option rows, separated by a real Divider.

## Position variants (anchor)

Set on the `.org-overlay-menu-anchor` wrapper.

| Position  | Effect                                                           |
| --------- | ---------------------------------------------------------------- |
| `below` (default) | inherited from OverlayMenu — panel under the trigger     |
| `above`   | `top: auto; bottom: 100%; margin-bottom: var(--spacing-overlay-menu-anchor-gap)`; closed-state slide vector flips to `translateY(2px)` so the reveal doesn't slide *into* the trigger |
| `before`  | `top: 0; right: 100%; margin-right: anchor-gap`                  |
| `after`   | `top: 0; left: 100%; margin-left: anchor-gap`                    |

These rules live in the Drop Down Selector stylesheet, not in OverlayMenu, because they're a Drop Down Selector-spec affordance — a context-menu OverlayMenu doesn't need `before` / `after`.

## Behaviours / rules

- **Composed, not redrawn.** Trigger = real `org-button` (ghost neutral by default). Panel = real `org-overlay-menu`. Rows = real `org-list-item`. Count chip = real `org-tag`. Don't repaint Button / OverlayMenu / List / Tag chrome from inside this stylesheet.
- **Inner rhythm is the only contract.** This stylesheet pins how label / separator / value / count / chevron sit on one baseline. Everything else flows through the composed parts.
- **Separator is conditional.** `.org-drop-down-selector-sep` only renders when `data-has-value="1"`. A trigger with no value is a clean Button.
- **Check gutter is uniform.** When `data-show-check="1"` is set on the list, every row reserves the gutter; the check itself fades in on `[data-selected="1"]`.
- **Single vs multi mode is JS, not CSS.** Single: clicking sets selection and closes. Multi: clicking toggles, panel stays open. The stylesheet just reacts to `data-has-value` and the count chip's presence.
- **Open state lifts the trigger.** `data-state="open"` paints the same `--color-neutral-soft` background a hovered ghost button has — no new ramp.
- Defaults when omitted: `data-color="neutral"`, `data-variant="ghost"`, `data-size="base"`, no leading icon, no value, `data-state="closed"`, anchor position `below`.
