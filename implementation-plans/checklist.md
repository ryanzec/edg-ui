# Checklist — Implementation Guide

A vertical list of status-bearing items for multi-step processes, validation rule readouts, and AI step traces. Each row carries a fixed-footprint status glyph (`not-started` / `in-progress` / `valid` / `invalid`), a label, optional count + meta, and an optional chevron when it has children. Single size only. Borderless — sits in any container.

## Anatomy

- **List** (`<ul class="org-checklist">`): vertical stack. `list-style: none; margin: 0; padding: 0`.
- **Item** (`<li class="org-checklist-item" data-status="…">` + optional `data-expanded="1"`): wrapper for a row + optional children block. Paints nothing.
- **Row** (`<div class="org-checklist-row">` for leaves; `<button class="org-checklist-row" data-clickable="1" aria-expanded="…">` for parents): the only painted element.
- **Status slot** (`<span class="org-checklist-status" data-status="…">`): fixed-size circle wrapping the glyph icon. The `in-progress` status nests an `org-loading-spinner`.
- **Label** (`<span class="org-checklist-label">`): single-line truncating text, the only flex-grow element.
- **Count pill** (`<span class="org-checklist-count">`, optional): tabular fraction (`2/4`).
- **Meta** (`<span class="org-checklist-meta">`, optional): trailing detail (durations, tail status).
- **Chevron** (`<span class="org-checklist-chevron">`, parent only): single chevron-right glyph rotated 90° when expanded.
- **Children** (`<ul class="org-checklist-children">`, parent only): nested list shown when `data-expanded="1"`. Hidden otherwise.

## Authoring shape

```html
<ul class="org-checklist">
  <li class="org-checklist-item" data-status="valid">
    <div class="org-checklist-row">
      <span class="org-checklist-status" data-status="valid"><span class="org-icon" data-icon="check"></span></span>
      <span class="org-checklist-label">Parse user input</span>
      <span class="org-checklist-meta">0.4s</span>
    </div>
  </li>
  <li class="org-checklist-item" data-status="in-progress" data-expanded="1">
    <button class="org-checklist-row" data-clickable="1" type="button" aria-expanded="true">
      <span class="org-checklist-status" data-status="in-progress">
        <span class="org-loading-spinner"><span class="org-icon" data-icon="loader" data-context="spinner"></span></span>
      </span>
      <span class="org-checklist-label">Run tools</span>
      <span class="org-checklist-count">2/4</span>
      <span class="org-checklist-meta">2.3s</span>
      <span class="org-checklist-chevron"><span class="org-icon" data-icon="chevron-right"></span></span>
    </button>
    <ul class="org-checklist-children">…</ul>
  </li>
</ul>
```

## List + item

- List: `font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`; default text color `oklch(0.22 0.008 260)`.
- Successive top-level items sit `2px` apart; sub-items sit `2px` apart. (Apply via `margin-top: 2px` on `item + item`.)

## Row

- `display: flex; align-items: center; width: 100%`; `gap: 10px`.
- `padding: 6px 8px`.
- `border-radius: 6px`.
- `background: transparent`; `color: inherit`; `text-align: left`.
- **Leaf row**: `<div>`, non-interactive, no extra reset.
- **Parent row** (`[data-clickable="1"]`): `<button>` with `appearance: none; border: 0; cursor: pointer; font-family: inherit`. Transitions `background 100ms cubic-bezier(.3,.7,.4,1)`.
  - Hover: `background: oklch(0.945 0.005 95)`.
  - Active: `background: oklch(0.92 0.006 95)`.
  - Focus-visible: `outline: 0; box-shadow: 0 0 0 3px <focus-ring>` (the focus ring color `oklch(0.56 0.13 240) / 35%`).
- Row never wraps — overflow lives entirely in the label's ellipsis truncation.

## Status slot

- `flex: 0 0 auto`; `width: 20px; height: 20px`; `display: inline-flex; align-items: center; justify-content: center; line-height: 1`.
- `border-radius: 999px` (a circle — defaults to icon-only, no fill).
- Inner glyph (`org-icon` or spinner-wrapped icon): `width: 16px; height: 16px`.
- Color (drives `currentColor` on the glyph), per `data-status`:

| Status        | Color                         |
| ------------- | ----------------------------- |
| `not-started` | `oklch(0.58 0.005 260)` (neutral) |
| `in-progress` | `oklch(0.56 0.13 240)` (info)     |
| `valid`       | `oklch(0.58 0.13 145)` (safe)     |
| `invalid`     | `oklch(0.55 0.18 25)` (danger)    |

- Glyph per status: `not-started → circle`, `in-progress → loader` (inside `org-loading-spinner`), `valid → check`, `invalid → x`.
- Optional soft tile (consumer opt-in): set `background` to the matching `*-soft` color — `oklch(0.95 0.004 260)` / `oklch(0.94 0.04 240)` / `oklch(0.94 0.04 145)` / `oklch(0.94 0.05 25)`.

## Label

- `flex: 1 1 auto; min-width: 0`.
- `font-size: 14px`; `font-weight: 400`; `line-height: 1.45`; `color: oklch(0.22 0.008 260)`.
- `white-space: nowrap; overflow: hidden; text-overflow: ellipsis`.
- Color is constant across statuses — the icon, not the label, carries the hue. Opt-in: with `[data-emphasize-invalid="1"]` on the list, an `invalid` row's label paints `oklch(0.55 0.18 25)`.

## Meta

- `flex: 0 0 auto; margin-left: auto`.
- `font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace`.
- `font-size: 12px`; `color: oklch(0.62 0.008 260)`; `line-height: 1` (pulls mono digits to baseline-align with the label).
- `white-space: nowrap`.

## Count pill

- `flex: 0 0 auto; margin-left: auto` (yields the auto-margin to meta when both are present).
- `display: inline-flex; align-items: center; justify-content: center`.
- `height: 18px`; `min-width: 28px`; `padding: 0 6px`; `border-radius: 999px`; `line-height: 1`.
- `font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace`; `font-size: 10px`; `font-weight: 500`; `font-variant-numeric: tabular-nums`.
- `color: oklch(0.46 0.008 260)`; `background: oklch(0.95 0.004 260)`.
- When meta and count both render, the second sibling carries `margin-left: 8px`; meta keeps the `margin-left: auto` trailing slot.
- Hide the pill entirely if a parent has no meaningful count — never render an empty pill.

## Chevron

- Parent rows only. `flex: 0 0 auto; width: 14px; height: 14px`; `display: inline-flex; align-items: center; justify-content: center`.
- Inner icon `width: 14px; height: 14px`. Single glyph: `chevron-right`.
- Color: `oklch(0.62 0.008 260)` at rest; `oklch(0.46 0.008 260)` on parent-row hover and when expanded.
- `margin-left: 12px` after meta/count; `margin-left: auto` when only the label precedes it.
- Transition: `transform 150ms cubic-bezier(.3,.7,.4,1), color 100ms cubic-bezier(.3,.7,.4,1)`.
- Expanded state (`item[data-expanded="1"] > row > chevron`): `transform: rotate(90deg)`. No glyph swap.

## Children block

- `display: none` by default; `display: block` when parent has `data-expanded="1"`.
- `padding: 4px 0 6px 28px` (top / bottom / left).
- `position: relative` so the indent rail can pin to it.
- **Indent rail** (`::before` pseudo-element): a hairline absolute line.
  - `left: calc(28px / 2 - 1px / 2 - 2px)` (≈ `11.5px`). `top: 4px; bottom: 6px; width: 1px`.
  - `background: oklch(0.93 0.005 95)`; `border-radius: 1px`.
- Sub-items reuse the same row markup. One level only — children never carry grandchildren.

## Behaviours / rules

- **Status icon slot is fixed footprint** — labels align across rows even as glyphs change.
- The `in-progress` status composes `org-loading-spinner` inside the slot at the same `16px` size; the spinner inherits color via `currentColor`.
- Leaf rows are real `<div>`s; parent rows are real `<button aria-expanded>` — never reverse the pair, never put a clickable parent inside another expanded row.
- Chevron is a single glyph rotated 90° — no glyph swap, no flicker.
- The count pill uses tabular numerals so "1/3" and "12/12" don't wobble between updates.
- Indent rail is a single hairline on the children block, drawn via a sibling pseudo-element so the rail can stop short of the row padding. Never use `box-shadow` to render it.
- Default attributes when omitted: `data-status="not-started"`, `data-expanded="0"`. Rows without `data-clickable` never react to hover, focus, or press.
