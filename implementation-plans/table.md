# Table — implementation guide

A real `<table>` element. Owns row rhythm, cell padding, the header shelf, hover/selected/striped tints, and an optional sticky first column. Cell contents (Tag, Avatar, Link, Skeleton, Icon) drop in directly — the table doesn't wrap them. Pagination, batch-action bars, and totals chips are SIBLINGS in the outer shell, never `<tfoot>`.

## Structure

- **Outer shell (optional)** — `<div class="org-table-shell">` with an inner `<div class="org-table-shell-scroll">` (handles `overflow-x: auto`) and an optional `<div class="org-table-shell-foot">` after it. Use whenever Pagination / batch-actions accompany the table.
- **Table** — `<table class="org-table">` with attributes:
  - `data-size="sm" | "base" | "lg"` (default `base`); `data-density="compact"` aliases `sm`.
  - `data-bordered="1"` — give a bare table its own top hairline + surface (skip when wrapped in the shell or a Card).
  - `data-striped="1"` — even body rows tinted.
  - `data-hover="1"` — body rows tint on hover.
  - `data-sticky="1"` — pin the first column on horizontal scroll.
  - `data-emphasize-first="1"` — bold the first body cell of each row.
- **Header** — `<thead>` with one `<tr>` of `<th>` cells.
- **Body** — `<tbody>` with `<tr>` rows. Empty body uses one `<tr data-empty="1">` spanning every column, never an absent tbody.
- **Foot (optional)** — `<tfoot>` for a totals row only. Pagination is NOT a foot.
- **Sticky header (optional)** — `data-sticky-header="1"` on the shell; works independently of `data-sticky="1"` and the two compose.
- **Loading overlay (optional)** — `data-loading="1"` on the shell; renders a translucent veil over the inner scroll region with a centered `org-loading-spinner` inside `.org-table-shell-overlay`.

## Per-cell modifiers

- `<th data-numeric="1">` / `<td data-numeric="1">` — right-align + `font-variant-numeric: tabular-nums`. On a numeric `<th data-sortable>`, the chevron flips to the LEADING edge of the label so the number stays flush right.
- `<td data-muted="1">` — drops cell color to `oklch(0.46 0.008 260)`.
- `<td data-faint="1">` — drops cell color to `oklch(0.62 0.008 260)`.
- `<th data-sortable="1" aria-sort="ascending|descending|none">` — wrap the label in `<span class="org-table-sort">Label</span>`.
- `<th data-select-col="1">` / `<td data-select-col="1">` — leading checkbox column, fixed width `40px`, padding zeroed, contents centered.
- `<tr data-selected="1">` — selected row tint (wins over hover).
- `<tr data-clickable="1">` — `cursor: pointer` + a focus-visible ring (`outline: 2px solid oklch(0.56 0.13 240); outline-offset: -2px`).
- `<tr data-empty="1">` — full-width "no results" row inside `<tbody>`.

## Root `<table>` reset

- `width: 100%`, `table-layout: auto`.
- `border-collapse: separate; border-spacing: 0` (so a single 1px hairline reads, not a doubled-up 2px line).
- `background: #ffffff`; `color: oklch(0.22 0.008 260)`.
- `font-family: inherit`; `line-height: 1.45`; `text-align: left`.
- `font-size` follows the size variant (see below).
- `data-bordered="1"`: `background: #ffffff` + `border-top: 1px solid oklch(0.9 0.005 95)` (top hairline only — the last row sits flush against the surface).

## Sizes (set on the `<table>`)

| Size | Body row min-h | Header min-h | Cell padding (y · x) | Edge inset (x) | Cell font-size |
|---|---|---|---|---|---|
| `sm` | `24px` | `24px` | `6px · 10px` | `12px` | `13px` |
| `base` (default) | `32px` | `28px` | `8px · 12px` | `16px` | `14px` |
| `lg` | `40px` | `32px` | `12px · 16px` | `20px` | `16px` |

- The first and last cell of every row apply the edge inset on the leading/trailing edge respectively, instead of the regular cell-x. Other padding stays the same.
- Row min-height tracks the same control ramp as Button / Input so a row aligns vertically with neighbouring controls.

## Header (`<thead> <th>`)

- `height` = the size's header min-h above; `padding` = the size's cell padding.
- `background: oklch(0.97 0.004 95)` (a quiet shelf — same lifted tone striped rows use).
- `color: oklch(0.62 0.008 260)`; `font-size: 12px`; `font-weight: 600`; `letter-spacing: 0.04em`; `text-transform: uppercase`.
- `text-align: left` (default) or `right` for `data-numeric="1"`.
- `white-space: nowrap`; `vertical-align: middle`.
- `border-bottom: 1px solid oklch(0.9 0.005 95)` — a real CSS border, never a `box-shadow` (the rule of the system).
- `data-sortable="1"` adds `cursor: pointer; user-select: none`. The label wraps in `<span class="org-table-sort">` which is `display: inline-flex; align-items: center; gap: 6px`.
- The sort chevron is a `::after` on `.org-table-sort`, sized `12px × 12px`, rendered as a CSS-mask SVG, `flex-shrink: 0`, with `transition: background-color 100ms cubic-bezier(.3,.7,.4,1)`.
  - Rest (`aria-sort="none"` or absent): `background: oklch(0.62 0.008 260)`; bidirectional double-chevron mask (up + down stacked).
  - `aria-sort="ascending"`: `background: oklch(0.22 0.008 260)`; up-chevron mask. The header label itself also lifts to `oklch(0.22 0.008 260)`.
  - `aria-sort="descending"`: same lifted color; down-chevron mask.
  - `:hover`: header color → `oklch(0.22 0.008 260)`; chevron fill → `oklch(0.22 0.008 260)`.
- Numeric sortable header: `.org-table-sort` becomes `justify-content: flex-end; flex-direction: row-reverse` so the chevron leads.

## Body (`<tbody> <td>`)

- `height` = the size's row min-h; `padding` = the size's cell padding.
- `color: oklch(0.22 0.008 260)`; `vertical-align: middle`.
- Row separator: `border-top: 1px solid oklch(0.93 0.005 95)` on every `<td>`. The first body row drops its top border (the header shelf already supplies the line).
- `data-muted="1"` → `color: oklch(0.46 0.008 260)`.
- `data-faint="1"` → `color: oklch(0.62 0.008 260)`.
- Numeric cell: `text-align: right; font-variant-numeric: tabular-nums`.
- `data-emphasize-first="1"` on the table → first `<td>` of each row gets `font-weight: 500; color: oklch(0.22 0.008 260)`.

## Row backgrounds & state

- Rest: `<tr>` is `background: transparent`; the shell's surface shows through.
- Row transition: `background-color 100ms cubic-bezier(.3,.7,.4,1)`.
- **Hover** (when table has `data-hover="1"`, row is not selected and not empty): `background: oklch(0.945 0.005 95)`.
- **Selected** (`<tr data-selected="1">`): `background: oklch(0.95 0.004 260)` — wins over hover and stripe.
- **Selected + hover**: `background: oklch(0.92 0.005 260)`.
- **Striped** (when table has `data-striped="1"`): every even non-empty, non-selected row → `background: oklch(0.97 0.004 95)` (same tone as the header shelf, so striped tables read as one rhythm).
- **Clickable** (`<tr data-clickable="1">`): `cursor: pointer`; `:focus-visible` → `outline: 2px solid oklch(0.56 0.13 240); outline-offset: -2px`.
- **Empty** (`<tr data-empty="1"> <td colspan="N">`): cell padding swaps to `32px` (vertical) · the size's edge inset (horizontal); `color: oklch(0.46 0.008 260)`; `font-size: 13px`; `text-align: center`. Hover and stripe skip empty rows.

## Selection column (`data-select-col="1"`)

- Width `40px`; `padding-left: 0; padding-right: 0`; `text-align: center`; `vertical-align: middle`.
- Cell stays `display: table-cell` (preserves table semantics); the inner `.org-checkbox` becomes `display: inline-flex; align-items: center; justify-content: center` so the indicator centers deterministically.

## Sticky first column (`data-sticky="1"`)

- The first `<th>` and first `<td>` of every row become `position: sticky; left: 0; z-index: 10` (raised), with `border-right: 1px solid oklch(0.9 0.005 95)` so the pinned rail reads.
- The body sticky cell paints its own background (`#ffffff` rest) so striping / hover / selection carry over while content scrolls underneath. Re-apply the row's current state color to that first cell:
  - striped even row → `oklch(0.97 0.004 95)`
  - hover → `oklch(0.945 0.005 95)`
  - selected → `oklch(0.95 0.004 260)`
  - selected + hover → `oklch(0.92 0.005 260)`
- The header's first cell stays on the header tone (`oklch(0.97 0.004 95)`) and inherits the sticky position.

## Sticky header (`data-sticky-header="1"` on the shell)

- The inner `.org-table-shell-scroll` caps height (`max-height: 22rem` default; consumer can override) and gets `overflow-y: auto`.
- Every `<th>` becomes `position: sticky; top: 0; z-index: 10`, with `background: oklch(0.97 0.004 95)` re-applied so rows don't bleed through.
- If `data-sticky="1"` is also on, the leading `<th>` lifts one z-level higher (`z-index: 11`) so the corner stays on top in both axes.

## Footer (`<tfoot> <td>`) — totals row only

- Same height + padding as the header.
- `background: oklch(0.97 0.004 95)`; `color: oklch(0.22 0.008 260)`; `font-weight: 500`.
- `border-top: 1px solid oklch(0.9 0.005 95)`; `vertical-align: middle`.

## Outer shell (`.org-table-shell`)

- `display: block`; `background: #ffffff`.
- `border-top: 1px solid oklch(0.9 0.005 95)` (top hairline only — the last row sits flush against whatever's below).
- `container-type: inline-size`; `position: relative` (anchors the loading overlay).
- `.org-table-shell-scroll`: `display: block; width: 100%; overflow-x: auto`.
- The inner `.org-table` drops its own border (`border: 0`) — the shell owns the framing.
- `.org-table-shell-foot`: `border-top: 1px solid oklch(0.9 0.005 95)`; `background: #ffffff`.

## Loading overlay (`data-loading="1"` on the shell)

- Shell gets `isolation: isolate`.
- `.org-table-shell-scroll::after`: covers `inset: 0`; `background: color-mix(in oklab, #ffffff 90%, transparent)`; `backdrop-filter: blur(2px)` (with `-webkit-` prefix); `z-index: 12`; `pointer-events: auto` (blocks clicks on rows).
- `.org-table-shell-overlay`: absolutely positioned, `inset: 0`; `display: flex; align-items: center; justify-content: center`; `z-index: 13`; `color: oklch(0.46 0.008 260)`; `pointer-events: none`. The inner spinner re-enables `pointer-events: auto`.

## Reduced motion

- `@media (prefers-reduced-motion: reduce)`: drop the row `background-color` transition and the sort-chevron transition.

## Notable rules

- The component is a real `<table>`. Don't fake it with divs — semantics, AT row/column readouts, and keyboard nav through interactive cell content come for free.
- Row separators sit on the TOP edge of cells, not the bottom. The first body row drops its top border because the header shelf already supplies the dividing line.
- Edges are rendered with real CSS borders, never `box-shadow`. Box-shadow is reserved for actual elevation and would overlap cell content.
- Selection tint wins over hover. Empty rows skip both hover and striping.
- The Table does not own its footer: pagination, totals chips, and batch-action bars are SIBLINGS inside the same `org-table-shell`.
- Numeric columns must opt in on BOTH the `<th>` and the `<td>` so right-alignment + tabular-nums apply across the column.
- Sortable headers require `data-sortable="1"` AND `aria-sort="…"` together — the chevron and the AT state share that single source of truth.

## Dark-theme deltas

Geometry, type, motion, and structure are identical. The color values swap:

- Surface: `#ffffff` → `oklch(0.20 0.006 260)`
- Surface-2 (header / stripe): `oklch(0.97 0.004 95)` → `oklch(0.25 0.006 260)`
- Hover row bg: `oklch(0.945 0.005 95)` → `oklch(0.275 0.007 260)`
- Border: `oklch(0.9 0.005 95)` → `oklch(0.34 0.009 260)`
- Border-soft (row separator): `oklch(0.93 0.005 95)` → `oklch(0.30 0.008 260)`
- Foreground: `oklch(0.22 0.008 260)` → `oklch(0.96 0.005 95)`
- Fg-muted (header, muted cells, empty msg): `oklch(0.46 0.008 260)` → `oklch(0.7 0.008 260)`
- Fg-faint (sort icon rest, faint cells): `oklch(0.62 0.008 260)` → `oklch(0.5 0.008 260)`
- Selected row bg: `oklch(0.95 0.004 260)` → `oklch(0.28 0.005 260)`
- Selected hover bg: `oklch(0.92 0.005 260)` → `oklch(0.33 0.005 260)`
- Focus ring: `oklch(0.56 0.13 240)` → `oklch(0.70 0.14 240)`
- Loading overlay: `color-mix(in oklab, #ffffff 90%, transparent)` → `color-mix(in oklab, oklch(0.20 0.006 260) 90%, transparent)`
