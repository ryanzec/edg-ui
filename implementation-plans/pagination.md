# Pagination — Implementation Guide

A footer-row component for any paginated list. Three slots on a single baseline:

```
[Rows per page ▾]  1–10 of 250                       « ‹ 1 2 … 25 › »
╰── items-per-page ──╯ ╰── result ──╯              ╰── navigation ──╯
```

Pagination owns no chrome — every visible element is a real component the page already loads. The stylesheet adds layout, the result-text typography, the ellipsis stub, the pinned-width Combobox trigger, and a single `data-pressed="1"` rule that paints the current-page Button.

## Anatomy

```html
<nav class="org-pagination" aria-label="Project list pages">
  <div class="org-pagination-info">
    <label class="org-pagination-label" for="rpp">Rows per page</label>
    <span class="org-input"
          data-combobox="1" data-variant="default"
          data-show-clear="never" data-has-trailing="1"
          data-readonly="1" data-pagination-select="1">
      <span class="org-input-track">
        <input class="org-input-native" id="rpp" type="text"
               value="10" aria-label="Rows per page" readonly />
      </span>
      <span class="org-input-trailing">
        <span class="org-combobox-chevron">
          <span class="org-icon" data-icon="chevron-down" data-context="input"></span>
        </span>
      </span>
    </span>
    <span class="org-pagination-result">
      <span class="org-pagination-result-em">1–10</span>
      <span> of </span>
      <span class="org-pagination-result-em">250</span>
    </span>
  </div>

  <div class="org-pagination-nav" role="group" aria-label="Pagination navigation">
    <button class="org-button" data-color="neutral" data-variant="text"
            data-icon-only="1" type="button" aria-label="First page">
      <span class="org-icon" data-icon="chevrons-left" data-context="button"></span>
    </button>
    <button class="org-button" data-color="neutral" data-variant="text"
            data-icon-only="1" type="button" aria-label="Previous page">
      <span class="org-icon" data-icon="chevron-left" data-context="button"></span>
    </button>

    <button class="org-button" data-color="neutral" data-variant="text"
            data-pressed="1" type="button" aria-current="page" aria-label="Page 1">1</button>
    <button class="org-button" data-color="neutral" data-variant="text"
            type="button" aria-label="Page 2">2</button>
    <span class="org-pagination-ellipsis" aria-hidden="true">…</span>
    <button class="org-button" data-color="neutral" data-variant="text"
            type="button" aria-label="Page 25">25</button>

    <button class="org-button" data-color="neutral" data-variant="text"
            data-icon-only="1" type="button" aria-label="Next page">
      <span class="org-icon" data-icon="chevron-right" data-context="button"></span>
    </button>
    <button class="org-button" data-color="neutral" data-variant="text"
            data-icon-only="1" type="button" aria-label="Last page">
      <span class="org-icon" data-icon="chevrons-right" data-context="button"></span>
    </button>
  </div>
</nav>
```

## Root (`.org-pagination`)

- `display: flex; align-items: center; flex-wrap: wrap; gap: var(--spacing-pagination-row-gap)`.
- `font-family: var(--font-sans); font-size: var(--font-size-pagination); color: var(--color-pagination-result)`.
- `font-variant-numeric: var(--font-variant-pagination)` — **tabular numerals everywhere**. Page numbers and "1–10 of 250" must not shimmy across updates.
- `flex-wrap: wrap` — the row breaks onto two lines on a narrow surface without intervention.

## Left group (`.org-pagination-info`)

- `display: flex; align-items: center; gap: var(--spacing-pagination-group-gap)`.
- `flex: 1 1 auto; min-width: 0` — grows to push navigation right, shrinks to allow wrapping under the nav cluster on narrow surfaces.

### "Rows per page" label (`.org-pagination-label`)

- `font-size: var(--font-size-pagination-label); font-weight: var(--font-weight-pagination-label); color: var(--color-pagination-label)`.
- Sits flush with the input on the same baseline; reads as supporting copy — never bolder than the value next to it.
- `margin-inline-end: calc(var(--spacing-pagination-label-gap) - var(--spacing-pagination-group-gap))` — makes the label hug the combobox tighter than the group's default gap allows.
- `white-space: nowrap`.

### Items-per-page combobox (`.org-input[data-pagination-select="1"]`)

A standard readonly Combobox trigger with one Pagination-specific override:

```css
.org-input[data-pagination-select="1"] {
  width: var(--sizing-pagination-select);
  min-width: var(--sizing-pagination-select);
  flex: 0 0 auto;
}
```

Fixed width so the row doesn't reflow when the selected value changes between, say, "10" and "100".

### Result text (`.org-pagination-result`)

```html
<span class="org-pagination-result">
  <span class="org-pagination-result-em">1–10</span>
  <span> of </span>
  <span class="org-pagination-result-em">250</span>
</span>
```

- `display: inline-flex; align-items: baseline; gap: 0.25em; white-space: nowrap`.
- Numerals carry `--font-weight-pagination-result`; emphasized numerals carry `--font-weight-pagination-emphasis` and `--color-pagination-result-emphasis`.
- The connecting word **"of"** stays at the regular weight to subordinate it.

## Right cluster (`.org-pagination-nav`)

- `display: inline-flex; align-items: center; gap: var(--spacing-pagination-button-gap)`.
- `flex: 0 0 auto` — never shrinks; wraps to a new line first.
- `role="group" aria-label="Pagination navigation"`.

### Page buttons

Every page button is a standard `org-button` with:

- `data-color="neutral" data-variant="text"`.
- `aria-label="Page N"`.
- Edge buttons (first / prev / next / last) add `data-icon-only="1"` and contain a single chevron icon with `data-context="button"`.

### Current page (`data-pressed="1"`)

The current page is **the same button** as every other page — it just carries `data-pressed="1"` and `aria-current="page"`. The Pagination stylesheet adds a single rule that paints any pressed Button (not just inside Pagination) in the soft neutral fill that already exists in Button:

```css
.org-button[data-pressed="1"]:not(:disabled):not([data-loading="1"]) {
  background: var(--_color-soft);
  color: var(--_color-active);
}
.org-button[data-pressed="1"]:hover:not(:disabled):not([data-loading="1"]) {
  background: var(--_color-soft-hover);
  color: var(--_color-active);
}
```

This reads `--_color-soft` / `--_color-soft-hover` / `--_color-active` from Button's own internal locals — no new color ramp, no new tokens.

### Disabled edge buttons

Use the standard `:disabled` from Button — first/prev are disabled on page 1, next/last on the last page. Pagination doesn't restate this; the Button's `--opacity-disabled` and `pointer-events: none` already do the job.

## Ellipsis (`.org-pagination-ellipsis`)

A static span that sits between non-contiguous page numbers (`1 … 25`):

- `display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0`.
- `width / height: var(--sizing-pagination-ellipsis)` — same hit footprint as a numbered button so the row rhythm doesn't break on either side.
- `color: var(--color-pagination-ellipsis); user-select: none; line-height: 1` — matches Button's optical centre.
- `aria-hidden="true"` — not interactive, decoration only.

## Narrow-surface wrap (`@container`)

```css
@container (max-width: 32rem) {
  .org-pagination {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-pagination-group-gap);
  }
  .org-pagination-info { flex-wrap: wrap; }
  .org-pagination-nav  { align-self: flex-end; }
}
```

Below 32rem of available container width, the row stacks: info group on top, nav cluster aligned to the right edge below. This is `@container`, not `@media` — so a Pagination inside a narrow card collapses even if the viewport is wide. The host (or some ancestor) needs `container-type: inline-size` for the rule to fire.

## Behaviours / rules

- **Tabular numerals everywhere.** Page numbers and "1–10 of 250" both update in place — non-tabular figures cause the row to shimmy. Don't drop `font-variant-numeric`.
- **Current page is `data-pressed="1"`, not a special class.** No new "selected" tokens, no new color. The Button already paints pressed states; Pagination just routes that for one specific case.
- **Items-per-page width is fixed.** Don't let the combobox auto-size — switching from "10" to "100" would jiggle the entire result text.
- **Edge buttons are `data-icon-only="1"`.** They carry only an icon child; the `aria-label` is what screen readers announce. Don't put visible text in an edge button.
- **Ellipsis matches the button hit footprint.** Same width/height as a numbered button. If you change `--sizing-pagination-ellipsis`, the row rhythm breaks on either side.
- **Result emphasis is two `<span>`s, not bold inline text.** `1–10` and `250` get `.org-pagination-result-em`; "of" stays plain. This keeps the emphasis token-driven.
- **`@container` query, not `@media`.** A narrow Pagination inside a wide page should still collapse. The host needs `container-type: inline-size`.
- **Disabled edges via `:disabled` on Button.** Don't add `data-disabled="1"` or set `aria-disabled="true"` — use the native `disabled` attribute.
- **`aria-current="page"` on the current page button.** In addition to `data-pressed="1"`. The visual state and the a11y state are independent.
- **`role="group"` on the nav cluster, not `role="navigation"`.** The outer `<nav>` already provides nav landmark semantics; the inner cluster is just a group of related controls.
- Defaults when omitted: no narrow-surface collapse without container queries enabled on an ancestor; `aria-current="page"` not set unless the consumer authors it.
