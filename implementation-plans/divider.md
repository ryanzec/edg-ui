# Divider — Implementation Guide

A thin separator line between sections, list rows, or columns. Renders horizontal or vertical, in three styles (solid / dashed / dotted), two weights (thin / thick), and any of the semantic colors. Implemented as a real CSS `border` — not `box-shadow`, not `background-color` — so the line is a true 1-device-pixel hairline at any zoom and contributes nothing else to the box model.

## Anatomy

- **Root**: `<hr class="org-divider">` (or a `<div>` if you don't need the implicit semantics) with `data-direction`, `data-style`, `data-weight`, `data-padding`, `data-color`.

That's it — Divider has no children, no slots, no surface. It's a single element with one painted edge.

## Authoring shape

```html
<!-- Default: horizontal · solid · thin · default border color · sm padding -->
<hr class="org-divider" />

<!-- Vertical, dashed, danger-tinted, no surrounding padding -->
<hr class="org-divider"
    data-direction="vertical"
    data-style="dashed"
    data-color="danger"
    data-padding="none" />
```

## Root container

- `display: block; margin: 0; user-select: none`.
- `border: 0 var(--_div-style) var(--_div-color)` — all four borders start at width `0`. The direction selectors below pick **one** side and set its width.
- Internal locals (per-instance overridable):
  - `--_div-color: var(--color-border)` — line color.
  - `--_div-weight: var(--border-width-thin)` — line thickness.
  - `--_div-style: solid` — line style.
  - `--_div-pad: var(--spacing-box-sm)` — cross-axis breathing room (becomes vertical margin for horizontal, horizontal margin for vertical).

## Direction (`data-direction`)

### Horizontal (default)

- Applied via `[data-direction="horizontal"]` or by omitting the attribute entirely.
- `width: 100%; height: 0; align-self: stretch`.
- Sets `border-top-width: var(--_div-weight)` — the divider contributes only its line thickness to the parent's main axis.
- `margin-block: var(--_div-pad)` — padding becomes vertical margin (breathing room above/below the line).

### Vertical (`[data-direction="vertical"]`)

- `width: 0; align-self: stretch`.
- Sets `border-left-width: var(--_div-weight)`.
- `min-height: 1rem` — non-zero so the divider is visible even outside flex parents (a vertical divider in a vertical-divider preview cell still renders). Inside a flex row, `align-self: stretch` takes over and the line picks up the parent's height.
- `margin-inline: var(--_div-pad)` — padding becomes horizontal margin (breathing room left/right).

## Style (`data-style`)

| Value    | `--_div-style` |
| -------- | -------------- |
| `solid` (default) | `solid` |
| `dashed` | `dashed` |
| `dotted` | `dotted` |

## Weight (`data-weight`)

| Value  | `--_div-weight`             |
| ------ | --------------------------- |
| `thin` (default) | `var(--border-width-thin)` (`1px`) |
| `thick` | `var(--border-width-thick)` (`2px`) |

## Padding (`data-padding`)

Cross-axis breathing room around the line.

| Value  | `--_div-pad`                 |
| ------ | ---------------------------- |
| `none` | `var(--spacing-box-none)`    |
| `sm` (default) | `var(--spacing-box-sm)` |
| `md`   | `var(--spacing-box-md)`      |
| `lg`   | `var(--spacing-box-lg)`      |

## Color (`data-color`)

Maps a semantic name to `--_div-color`.

| Value       | Resolves to                |
| ----------- | -------------------------- |
| _omitted_   | `var(--color-border)`      |
| `primary`   | `var(--color-primary)`     |
| `secondary` | `var(--color-secondary)`   |
| `neutral`   | `var(--color-neutral)`     |
| `safe`      | `var(--color-safe)`        |
| `info`      | `var(--color-info)`        |
| `caution`   | `var(--color-caution)`     |
| `warning`   | `var(--color-warning)`     |
| `danger`    | `var(--color-danger)`      |

## Behaviours / rules

- **Real CSS border, never `box-shadow` or `background-color`.** The line must contribute exactly its thickness to the box model and resolve as a true 1-device-pixel hairline; shadow tricks shift under sub-pixel rounding.
- **Only one side is painted.** `border` starts at `0`-width on every side; the active direction sets `border-{top|left}-width`. The other three remain zero — a divider must never look like a thin rectangle.
- **Padding is cross-axis margin.** A horizontal divider with `data-padding="lg"` reserves vertical breathing room around the line; a vertical one reserves horizontal. Padding never affects the dimension the line sits on (height for horizontal, width for vertical).
- **Stretches in flex parents.** Horizontal: `align-self: stretch` claims the cross axis. Vertical: same plus a `min-height` floor for non-flex parents.
- **No focus, no interaction.** `user-select: none`; the divider is decorative chrome and should never accept focus or hover affordances.
- Defaults when omitted: `direction="horizontal"`, `style="solid"`, `weight="thin"`, `padding="sm"`, color = `--color-border`.
