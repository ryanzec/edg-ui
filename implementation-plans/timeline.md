# Timeline — Implementation Guide

A vertical sequence of items connected by a hairline rail. Each item carries a `data-color` (one of the shared semantic ramps) that drives **both** its own dot fill **and** the connector segment running BELOW it down to the next item — so the line between two items reads as the color of the one ABOVE it ("the status of what just happened").

Single size only. Left-rail vertical orientation only.

## What Timeline composes

- `org-icon` — optional glyph inside the dot when `data-has-icon="1"` is set on the item.
- Free-form body content inside `.org-timeline-body` — Avatars, CodeBlock, anything.

## Anatomy

```html
<ol class="org-timeline">
  <li class="org-timeline-item" data-color="info">
    <div class="org-timeline-marker">
      <span class="org-timeline-dot"></span>
    </div>
    <div class="org-timeline-content">
      <div class="org-timeline-time">2:14 PM</div>
      <div class="org-timeline-header">Item title</div>
      <div class="org-timeline-body">
        Free-form body content. May contain Avatars, CodeBlock, …
      </div>
    </div>
  </li>

  <li class="org-timeline-item" data-color="safe" data-has-icon="1">
    <div class="org-timeline-marker">
      <span class="org-timeline-dot">
        <span class="org-icon" data-icon="check"></span>
      </span>
    </div>
    <div class="org-timeline-content"> … </div>
  </li>
</ol>
```

## Root (`.org-timeline`)

- `list-style: none; margin: 0; padding: 0`.
- `font-family: var(--font-sans); color: var(--color-fg)`.

## Item (`.org-timeline-item`)

A two-column row: marker rail on the left, content on the right.

- `display: grid; grid-template-columns: var(--sizing-timeline-rail) 1fr`.
- `gap: 0 var(--spacing-timeline-gutter)`.
- `color: var(--color-timeline-dot-neutral)` — default semantic color, overridden by `data-color`. Both the dot and the connector read `currentColor` so they swap together when this changes.
- Vertical rhythm between rows: `> .org-timeline-item + .org-timeline-item { margin-top: var(--spacing-timeline-stack); }`. The connector inside the marker column extends THROUGH this gap (negative bottom on the connector pseudo-element) so the line is visually continuous.

### Per-color tinting (`data-color`)

Sets the row's `currentColor` — flows to the dot fill, the connector below, and (via the rule below) the icon-on color inside the dot.

| Value       | Token                                  |
| ----------- | -------------------------------------- |
| `neutral`   | `var(--color-timeline-dot-neutral)`    |
| `info`      | `var(--color-timeline-dot-info)`       |
| `safe`      | `var(--color-timeline-dot-safe)`       |
| `warning`   | `var(--color-timeline-dot-warning)`    |
| `danger`    | `var(--color-timeline-dot-danger)`     |
| `primary`   | `var(--color-timeline-dot-primary)`    |
| `secondary` | `var(--color-timeline-dot-secondary)`  |

## Marker column (`.org-timeline-marker`)

Hosts the dot and the connector running BELOW it down to the next item. Fixed-width so the rail's x-position is stable across rows regardless of content height.

- `position: relative; display: flex; justify-content: center; align-items: flex-start`.
- `padding-top: 0.375rem` (6px) — pulls the dot down so it baseline-aligns with the first line of the time/header content next to it. Tuned for the time eyebrow line.

## Dot (`.org-timeline-dot`)

A circle painted with the item's `currentColor`.

- `flex: 0 0 auto; width: var(--sizing-timeline-dot); height: var(--sizing-timeline-dot)`.
- `border-radius: var(--radius-pill); background: currentColor`.
- `display: inline-flex; align-items: center; justify-content: center` — reset for child icon.
- Transitions on `background`, `width`, `height` (motion-timeline-duration) — smooth color/size swap when an item's status changes in a live feed.

### Icon variant (`data-has-icon="1"` on the item)

The dot grows to a larger host and a glyph is rendered inside, painted with the matching `-on` foreground for the row's color.

- Dot grows: `width / height: var(--sizing-timeline-dot-icon-host)`.
- Icon inside: `width / height: var(--sizing-timeline-dot-icon)`.
- Icon color tracks the row's `data-color` via the matching `--color-timeline-dot-on-*` token (e.g. `data-color="info"` → `--color-timeline-dot-on-info`).
- Default fallback (no `data-color`): icon uses `--color-timeline-dot-on-neutral`.

## Connector (the rail)

The line running BELOW the dot down to the next item's dot. Drawn as a `::before` pseudo-element on `.org-timeline-marker` so its color comes from `currentColor` (the row's `data-color`), and so its extent can stretch through the row's bottom margin to meet the next dot.

```css
.org-timeline-marker::before {
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: var(--sizing-timeline-connector);
  top: calc(0.375rem + var(--sizing-timeline-dot));
  bottom: calc(-1 * var(--spacing-timeline-stack) - 0.375rem);
  background: currentColor;
}
```

- `top` starts just below the dot (`marker padding-top` + dot height).
- `bottom` extends past the row's bottom edge by the stack gap (negative bottom value) so it crosses the row gap and meets the **next** item's dot's top edge — accounting for the next marker's own `padding-top: 0.375rem`.

### Connector + icon dot

When the row hosts an icon, its dot is larger — push the connector start further down so it doesn't clip the dot:

```css
.org-timeline-item[data-has-icon="1"] > .org-timeline-marker::before {
  top: calc(0.375rem + var(--sizing-timeline-dot-icon-host));
}
```

### Last item

Suppress the trailing connector entirely — there's nothing below it:

```css
.org-timeline > .org-timeline-item:last-child > .org-timeline-marker::before {
  display: none;
}
```

## Content column (`.org-timeline-content`)

The right column. Hosts an optional eyebrow time line, a header, and arbitrary body content.

- `min-width: 0` — allow truncation inside.
- `padding-top: 0` — time eyebrow is the first ink.
- `padding-bottom: var(--spacing-1)` — matches the dot's vertical alignment offset so the row stays balanced.

### Time eyebrow (`.org-timeline-time`)

- `font-size: var(--font-size-timeline-time); font-weight: var(--font-weight-timeline-time); letter-spacing: var(--letter-spacing-timeline-time)`.
- `text-transform: uppercase; color: var(--color-timeline-time)`.
- `margin-bottom: var(--spacing-timeline-time-header)` — sits as an eyebrow above the header.
- `font-variant-numeric: tabular-nums; line-height: 1` — mono numerals so timestamps don't wobble between rows.

### Header (`.org-timeline-header`)

- `font-size: var(--font-size-timeline-header); font-weight: var(--font-weight-timeline-header); line-height: var(--line-height-timeline-header)`.
- `color: var(--color-timeline-header); text-wrap: pretty`.

### Body (`.org-timeline-body`)

- `margin-top: var(--spacing-timeline-header-body); font-size: var(--font-size-base); line-height: var(--line-height-normal)`.
- `color: var(--color-fg-muted)`.
- `> :first-child { margin-top: 0 }` and `> :last-child { margin-bottom: 0 }` — collapse outer margins of arbitrary children so the body's own spacing wins.

## Reduced motion

- `@media (prefers-reduced-motion: reduce) { .org-timeline-dot { transition: none; } }`.

## Behaviours / rules

- **`data-color` drives both dot and connector.** They share `currentColor` from the row. Don't paint the connector or the dot with explicit color values — go through `data-color`.
- **The connector ABOVE belongs to the previous row.** Each row owns the connector running DOWN from its own dot. Reading the timeline top-to-bottom: the line between item N and item N+1 carries item N's color — the status of "what just happened".
- **Dot + rail are visually continuous.** The connector pseudo-element starts just past the dot's bottom edge and extends through the inter-row gap. Don't introduce a separate rail element on the column — it would double-paint.
- **Last-row connector is suppressed.** `:last-child` drops the `::before`. If you reorder DOM dynamically, the rule still applies — no manual flag needed.
- **Icon dot grows the host, not the glyph.** `--sizing-timeline-dot-icon-host` is the larger circle; `--sizing-timeline-dot-icon` is the glyph inside. Resize the host without touching the glyph and the rail still meets the dot cleanly because the connector's `top` calc uses the host size.
- **Marker padding-top is calibrated.** `0.375rem` aligns the dot's vertical centre with the time eyebrow's cap-height. If you drop the eyebrow and lead with the header, expect the dot to feel slightly low — adjust the marker's padding rather than the connector's `top`.
- **Tabular numerals on the time eyebrow are structural.** Without them, timestamps shift horizontally between rows and the eyebrow loses its quiet rhythm.
- **Body collapses its outer margins.** `:first-child { margin-top: 0 }` / `:last-child { margin-bottom: 0 }` — drop arbitrary content (paragraphs, code blocks) into the body without margin-stacking surprises.
- Defaults when omitted: `data-color="neutral"`, no icon. The dot is a small `currentColor` circle; the connector a hairline of the same.
