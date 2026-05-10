# Tabs — Implementation Guide

A horizontal row of tab triggers above a content panel. Three variants share the same row geometry and type ramp; they differ only in how the active tab is signalled:

- **`underline`** (default) — hairline rail beneath the strip; active tab grows that rail to a thicker fg-colored stroke.
- **`pills`** — no rail; active tab fills with a soft tint.
- **`enclosed`** — folder-tab geometry; active tab carries top + side borders and merges into the panel below.

Sizes (`sm` / `base` / `lg`) tune row height + label size + horizontal padding, orthogonal to variant. `data-stretch="1"` makes tabs fill the row equally (segmented-control-style).

## Anatomy

```html
<div class="org-tabs" data-variant="underline" data-size="base">
  <div class="org-tabs-list" role="tablist" aria-label="Section">
    <button class="org-tabs-tab" role="tab" aria-selected="true"
            aria-controls="p-1" id="t-1" tabindex="0">
      <span class="org-icon" data-icon="layers"></span>
      Overview
      <span class="org-tag" data-color="neutral" data-size="sm">12</span>
    </button>
    <button class="org-tabs-tab" role="tab" aria-selected="false"
            aria-controls="p-2" id="t-2" tabindex="-1">Activity</button>
    <button class="org-tabs-tab" role="tab" aria-disabled="true"
            aria-selected="false" tabindex="-1">Audit log</button>
  </div>
  <div class="org-tabs-panels">
    <div class="org-tabs-panel" role="tabpanel" aria-labelledby="t-1" id="p-1">…</div>
    <div class="org-tabs-panel" role="tabpanel" hidden aria-labelledby="t-2" id="p-2">…</div>
  </div>
</div>
```

## Root (`.org-tabs`)

### Internal locals

| Local            | Default                                  |
| ---------------- | ---------------------------------------- |
| `--_tabs-row-h`  | `var(--sizing-tabs-row-h-base)`          |
| `--_tabs-tab-x`  | `var(--spacing-tabs-tab-x-base)`         |
| `--_tabs-font`   | `var(--font-size-tabs-base)`             |
| `--_tabs-gap`    | `var(--spacing-tabs-gap-underline)`      |

### Layout

- `display: flex; flex-direction: column; gap: var(--spacing-tabs-strip-panel)` — owns the strip-to-panel rhythm; consumers don't add their own gap.
- `font-family: var(--font-sans); color: var(--color-fg); min-width: 0`.

### Sizes

`data-size="sm|base|lg"` reassigns `--_tabs-row-h`, `--_tabs-tab-x`, `--_tabs-font`.

### Variant gap mapping

`data-variant` reassigns `--_tabs-gap`:

- `underline` → `var(--spacing-tabs-gap-underline)` (tight; tabs read as one strip).
- `pills` → `var(--spacing-tabs-gap-pills)` (looser; pills float independently).
- `enclosed` → `var(--spacing-tabs-gap-enclosed)` (folder-tab rhythm).

## List (`.org-tabs-list`)

```css
.org-tabs-list {
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: var(--_tabs-gap);
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.org-tabs-list::-webkit-scrollbar { display: none; }
```

Horizontal scroll when the strip overflows. The rail (in `underline` and `enclosed`) keeps painting under scrolled-out tabs because the rail lives on the **list border**, not on a viewport-wide pseudo.

### Stretch (`data-stretch="1"`)

```css
.org-tabs[data-stretch="1"] .org-tabs-list > .org-tabs-tab {
  flex: 1 1 0;
  justify-content: center;
}
```

Tabs fill the row equally — segmented-control behaviour.

### Variant: underline / enclosed list rail

Both variants give the **list** a real `border-bottom` carrying the rail color:

```css
.org-tabs[data-variant="underline"] > .org-tabs-list,
.org-tabs[data-variant="enclosed"]  > .org-tabs-list {
  border-bottom: var(--border-width-thin) solid var(--color-tabs-rail);
}
```

The active tab paints over this rail (see per-variant rules below). Pills has no rail.

## Tab (`.org-tabs-tab`)

Native button reset + flex layout:

- `appearance: none; background: transparent; border: 0; margin: 0; font: inherit; cursor: pointer`.
- `display: inline-flex; align-items: center; justify-content: flex-start; gap: var(--spacing-tabs-tab-gap); flex: 0 0 auto; min-width: 0`.
- `height: var(--_tabs-row-h); padding: 0 var(--_tabs-tab-x)`.
- `font-size: var(--_tabs-font); font-weight: var(--font-weight-tabs); line-height: var(--line-height-tabs); color: var(--color-tabs-tab-fg)`.
- `white-space: nowrap`.
- Transitions: `color`, `background-color`, `border-color` (`var(--motion-tabs-duration)` standard ease).

### States

- **Hover**: `color: var(--color-tabs-tab-fg-hover)`.
- **Focus-visible**: `outline: var(--border-width-focus) solid var(--color-tabs-focus-ring); outline-offset: var(--spacing-0_5); border-radius: var(--radius-sm)`.
- **Selected** (`aria-selected="true"`): `color: var(--color-tabs-tab-fg-active)`. Variant chrome layers on top.
- **Disabled** (`aria-disabled="true"`): `opacity: var(--opacity-disabled); cursor: not-allowed; pointer-events: none`. **Use `aria-disabled`, not `disabled`** so the tab still receives focus during keyboard nav and announces its state.

### Inner glyph + tag rhythm

```css
.org-tabs-tab > .org-icon { flex: 0 0 auto; }
.org-tabs-tab > .org-tag  { flex: 0 0 auto; }
```

Leading icon and trailing count tag both lock to their natural width.

## Closable tabs (`.org-tabs-tab-close`)

When a tab carries `data-closable="1"` it MUST be rendered as `<div role="tab" tabindex="…">` rather than `<button role="tab">` — the trailing close affordance is a real nested `<button>`, and a button can't be nested inside another button. Visual treatment is identical.

```css
.org-tabs-tab-close {
  width: var(--sizing-tabs-close-base);
  height: var(--sizing-tabs-close-base);
  border-radius: var(--radius-tabs-close);
  color: var(--color-tabs-close-fg);
  margin-left: var(--spacing-0_5);
  margin-right: calc(-1 * var(--spacing-1));   /* hugs the trailing edge */
}
.org-tabs-tab-close:hover {
  color: var(--color-tabs-close-fg-hover);
  background: var(--color-tabs-close-bg-hover);
}
.org-tabs-tab-close:focus-visible {
  outline: var(--border-width-focus) solid var(--color-tabs-focus-ring);
  outline-offset: var(--spacing-0_5);
}
```

The inner icon is sized off the close-icon ramp (smaller than the leading icon) so the × reads as quiet chrome. Per-size mapping for `sm` / `lg` reassigns both the button hit area and the icon size. Pressing Delete or Backspace while the tab is focused fires the same close action (host script wires this).

## Variant: underline — per-tab borders

Inactive tabs carry a **transparent bottom border** at the active stroke width — selecting a tab swaps color, not layout (no jump on selection). The active stroke is pulled into the tab's own bottom border so it sits perfectly on the list's hairline rail; a `-1px margin-bottom` on each tab negates the list rail thickness so the active stroke **overlays** (not stacks atop) the rail:

```css
.org-tabs[data-variant="underline"] .org-tabs-tab {
  border-bottom: var(--border-width-tabs-active) solid transparent;
  margin-bottom: calc(-1 * var(--border-width-thin));
}
.org-tabs[data-variant="underline"] .org-tabs-tab:hover                  { border-bottom-color: var(--color-tabs-rail); }
.org-tabs[data-variant="underline"] .org-tabs-tab[aria-selected="true"]  { border-bottom-color: var(--color-tabs-active-rail); }
.org-tabs[data-variant="underline"] .org-tabs-tab[aria-disabled="true"]:hover { border-bottom-color: transparent; }
```

## Variant: pills

Soft-tinted pill that hovers + selects via background only:

```css
.org-tabs[data-variant="pills"] .org-tabs-tab {
  background: var(--color-tabs-pill-bg);
  border-radius: var(--radius-tabs-pill);
}
.org-tabs[data-variant="pills"] .org-tabs-tab:hover                   { background: var(--color-tabs-pill-bg-hover); }
.org-tabs[data-variant="pills"] .org-tabs-tab[aria-selected="true"]   { background: var(--color-tabs-pill-bg-active); }
.org-tabs[data-variant="pills"] .org-tabs-tab[aria-disabled="true"]:hover { background: var(--color-tabs-pill-bg); }
```

## Variant: enclosed

Folder-tab geometry. Active tab carries top + left + right borders that meet the rail below, plus a bottom border in the **panel surface color** so the rail visually breaks under this tab. Inactive tabs use four transparent borders so selection doesn't shift layout:

```css
.org-tabs[data-variant="enclosed"] .org-tabs-tab {
  border: var(--border-width-thin) solid transparent;
  border-top-left-radius: var(--radius-tabs-enclosed-top);
  border-top-right-radius: var(--radius-tabs-enclosed-top);
  margin-bottom: calc(-1 * var(--border-width-thin));   /* land bottom border on top of rail */
}
.org-tabs[data-variant="enclosed"] .org-tabs-tab:hover { background: var(--color-tabs-enclosed-bg-hover); }
.org-tabs[data-variant="enclosed"] .org-tabs-tab[aria-selected="true"] {
  background: var(--color-tabs-enclosed-bg);
  border-top-color:    var(--color-tabs-enclosed-border);
  border-left-color:   var(--color-tabs-enclosed-border);
  border-right-color:  var(--color-tabs-enclosed-border);
  border-bottom-color: var(--color-tabs-enclosed-bg);    /* erases the rail under this tab */
}
```

## Panels

```css
.org-tabs-panels { min-width: 0; }
.org-tabs-panel  { min-width: 0; }
.org-tabs-panel[hidden] { display: none; }
```

Toggle with the `hidden` attribute. The stylesheet does no fade between panels.

## Reduced motion

Disable the color/border transitions so a selection change reads as an instant swap.

## Behaviours / rules

- **Active state is `aria-selected="true"`, not a custom `data-*`.** A11y and visual state stay in lockstep.
- **Inactive tabs get `tabindex="-1"`.** The tablist is a single keyboard-tab stop; ←/→ moves selection (host script).
- **Disabled is `aria-disabled="true"`, not `disabled`.** Disabled tabs still receive keyboard focus and announce their disabled state. The native `disabled` would skip them entirely.
- **Underline / enclosed: per-tab transparent bottom border + `-1px margin-bottom`.** The two rules together let the active stroke overlay the list's rail without shifting layout. Don't replace with `box-shadow`-fakery — the seam wouldn't sit on a real border line.
- **Enclosed active tab paints its bottom border in the surface color.** That's how the rail "breaks" under the active tab. Don't try to do this with `clip-path` or pseudo-elements; the surface-color border is the right answer.
- **List owns the scroll, not the root.** Overflow tabs scroll horizontally inside the list; the panel below is unaffected. The rail keeps painting under scrolled-out tabs because it's on the list border.
- **Closable tab is `<div role="tab">`, not `<button>`.** Close is a nested real `<button>` — buttons can't nest. The visual treatment matches the button-host case.
- **Stylesheet doesn't own panel switching.** Toggle `hidden` on panels in product code; the CSS just hides hidden panels.
- **`aria-controls` + `id` link tab to panel.** And `aria-labelledby` on each panel back to its tab. Both required for screen readers.
- **`min-width: 0` on root, list, panels, and tabs.** Without it, long labels force the entire row wider than its container.
- Defaults when omitted: `data-variant="underline"`, `data-size="base"`, no stretch, single panel visible.
