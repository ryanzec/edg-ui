# Combobox — Implementation Guide

A select-like form field: a real `org-input` shell as the trigger (so it sits cleanly next to other inputs), an anchored panel of selectable rows below it. Built for type-to-filter pickers, single or multi-select, with an always-on leading check gutter so labels align whether or not a row is selected. The form-field flavour of the same idea — `DropDownSelector` is the action-bar flavour (Button trigger, no Input shell).

## Anatomy

- **Anchor wrapper**: `<span class="org-overlay-menu-anchor">` — owns absolute positioning of the panel.
- **Trigger**: a real `org-input` with `org-combobox-trigger` added; `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `data-state="open|closed"`.
- **Trigger inner pieces**: `.org-combobox-value` (current value or placeholder), `.org-combobox-chevron` (`org-icon` rotated 180° when open).
- **Panel**: `<div class="org-overlay-menu org-combobox-panel" role="listbox" data-state>` — the panel chrome is OverlayMenu's; Combobox just adds inner padding + the row geometry.
- **Option row**: `<div class="org-combobox-option" role="option" data-selected="0|1" data-active="0|1" data-disabled="0|1">`.
- **Option inner pieces**: `.org-combobox-option-check` (always-present check gutter), `.org-combobox-option-label`, optional `.org-combobox-option-meta` (trailing meta like a shortcut or count).
- **Group**: `<div class="org-combobox-group">` with `<div class="org-combobox-group-label">…</div>` and a stack of options.
- **Empty state**: `<div class="org-combobox-empty">No matches</div>`.

## Authoring shape

```html
<span class="org-overlay-menu-anchor">
  <button class="org-input org-combobox-trigger" data-state="closed" role="combobox" aria-expanded="false">
    <span class="org-combobox-value">Choose owner…</span>
    <span class="org-icon org-combobox-chevron" data-icon="chevron-down" data-context="input"></span>
  </button>
  <div class="org-overlay-menu org-combobox-panel" role="listbox" data-state="closed">
    <div class="org-combobox-option" role="option" data-selected="1" data-active="1">
      <span class="org-combobox-option-check"><span class="org-icon" data-icon="check"></span></span>
      <span class="org-combobox-option-label">Alice Chen</span>
      <span class="org-combobox-option-meta">⌘1</span>
    </div>
    <!-- … -->
  </div>
</span>
```

## Trigger (`org-combobox-trigger`)

- Composes `org-input` — height, font, focus ring, padding-x all flow through. We add only:
  - `cursor: pointer`; `text-align: start`; the value truncates with ellipsis.
  - `gap` between the value and the trailing chevron.
- `.org-combobox-value` at full fg when filled, `--color-fg-faint` when showing the placeholder (`[data-placeholder="1"]`).
- `.org-combobox-chevron` sits at the trailing edge; rotates 180° when `[data-state="open"]`. Transition `transform var(--motion-duration-fast)`; cleared by `prefers-reduced-motion`.

## Panel (`.org-combobox-panel`)

- Composes `org-overlay-menu` — surface, border, shadow, max-width, anchor gap, reveal motion all come from OverlayMenu.
- Combobox-only additions: inner padding `var(--spacing-combobox-panel-pad)` (`4px`) so the first / last row's hover highlight has breathing room.
- Anchor gap: `var(--spacing-combobox-anchor-gap)` (`4px`). Same gap OverlayMenu, DropDownSelector, and DatePicker use, so a row of triggers all anchor with identical rhythm.

## Option row (`.org-combobox-option`)

Three columns: leading **check gutter** · label · optional trailing meta.

- `display: flex; align-items: center; gap: var(--spacing-combobox-option-gap)` (`8px`).
- `min-height: var(--sizing-combobox-option-min-height)` (`32px`).
- `padding: var(--spacing-combobox-option-y) var(--spacing-combobox-option-x)` (`6px 10px`).
- `font-size: var(--font-size-combobox-option)` (base, 14px).
- `cursor: pointer; user-select: none`.

### States

| Attribute | Treatment |
| --- | --- |
| `[data-active="1"]` (keyboard cursor) | `background: var(--color-bg-hover)` |
| `:hover` | same `background: var(--color-bg-hover)` |
| `[data-selected="1"]` | check icon visible (see below); label weight unchanged |
| `[data-disabled="1"]` | `opacity: var(--opacity-disabled); cursor: not-allowed; pointer-events: none` |

`data-active` is the keyboard cursor; only one option carries it at a time. Hover and active read identically — moving the mouse onto a row also makes it the active row.

## Check gutter (`.org-combobox-option-check`)

- `flex: 0 0 var(--sizing-combobox-check-gutter)` (`18px`) — present on **every** row so labels line up regardless of selection.
- Inner `.org-icon` at `var(--sizing-icon-base)`, color `currentColor` resolved against `--color-combobox-option-check`.
- Default `opacity: 0`; `[data-selected="1"]` flips to `opacity: 1`. Transition `opacity var(--motion-duration-fast)`.

## Label + meta

- `.org-combobox-option-label`: `flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap`.
- `.org-combobox-option-meta`: `flex: 0 0 auto; color: var(--color-fg-muted); font-size: var(--font-size-xs); font-variant-numeric: tabular-nums`.

## Group label (`.org-combobox-group-label`)

- `padding: var(--spacing-combobox-group-y) var(--spacing-combobox-option-x)`.
- `font-size: var(--font-size-combobox-group-label)` (`2xs`); `font-weight: var(--font-weight-medium)`; `letter-spacing: var(--letter-spacing-wide)`; `text-transform: uppercase`; `color: var(--color-fg-muted)`.
- Sticks to the top of its group on scroll: `position: sticky; top: 0; background: var(--color-bg-surface)`.
- The first group label drops its top padding so it tucks against the panel's inner edge.

## Empty state (`.org-combobox-empty`)

- `padding: var(--spacing-combobox-empty-y)` vertical, panel x-padding horizontal.
- `font-size: var(--font-size-combobox-empty)` (sm); `color: var(--color-fg-muted)`; `text-align: center`.
- Replaces the option list entirely when the filter has no matches.

## Behaviours / rules

- **Composed, not reimplemented.** Trigger = real `org-input`, panel = real `org-overlay-menu`. Don't repaint border, focus ring, surface, motion — change those through Input / OverlayMenu tokens.
- **Check gutter always reserved.** Even rows with no selection state in the data model must render `.org-combobox-option-check` so the label x-offset is constant. This is the same alignment promise `DropDownSelector` makes — the two read at identical x when stacked.
- Rows are real DOM, not `<option>`. Keyboard model (↑↓ / Home / End / Enter / Esc / typeahead) is owned by the brain.
- Single-mode: clicking a row sets selection and closes the panel. Multi-mode: clicking toggles, panel stays open.
- `[data-active]` is **keyboard-driven**; never set it from CSS-only :hover. Hover paints the same `--color-bg-hover` background but doesn't move the keyboard cursor.
- Defaults when omitted: trigger `data-state="closed"`, options no `data-selected` / `data-active`. Disabled options must carry both `data-disabled="1"` and `aria-disabled="true"`.
