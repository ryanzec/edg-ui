# Indicator — Implementation Guide

A small status badge: a bare colored circle, a numeric pill, or a glyph pill. Three sizes (`sm` / `base` / `lg`), the eight semantic colors, an optional outline ring for sitting over imagery, an optional pulse animation, and an optional pin-to-corner mode that puts it at one of four corners of an anchor (an avatar, an icon button).

## Anatomy

- **Root**: `<span class="org-indicator" data-mode="dot|number|icon" data-color="…" data-size="…" data-position="…" data-ring="1" data-pulse="1" aria-label="…">`.
- **Anchor wrapper** (optional): `<span class="org-indicator-anchor">` — provides the `position: relative` box for `data-position`. Use whenever you pin an indicator to a corner.
- **Children**: empty (dot mode), a number (`number` mode — the brain renders `99+` for ≥100), or a single `<span class="org-icon">` (`icon` mode).

## Authoring shape

```html
<!-- Standalone dot -->
<span class="org-indicator" data-color="danger" aria-label="3 unread"></span>

<!-- Number pill -->
<span class="org-indicator" data-mode="number" data-color="primary">12</span>
<span class="org-indicator" data-mode="number" data-color="primary">99+</span>

<!-- Icon pill -->
<span class="org-indicator" data-mode="icon" data-color="safe">
  <span class="org-icon" data-icon="check"></span>
</span>

<!-- Pinned to an avatar corner -->
<span class="org-indicator-anchor">
  <img class="org-avatar" src="…" alt="" />
  <span class="org-indicator" data-color="safe" data-position="top-right" data-ring="1"
        aria-label="online"></span>
</span>
```

## Anchor (`.org-indicator-anchor`)

A thin helper so consumers don't write the position-relative box themselves:

- `position: relative; display: inline-flex; flex-shrink: 0`.

Any element with `position: relative` works as an anchor — this is just the canonical wrapper.

## Root (`.org-indicator`)

### Internal locals (defaults — `base` size, `primary` color)

| Local         | Default                       | Notes                                      |
| ------------- | ----------------------------- | ------------------------------------------ |
| `--_dot-size` | `0.5rem` (8px)                | Diameter in dot mode                       |
| `--_height`   | `1rem` (16px)                 | Pill height in number/icon mode            |
| `--_pad-x`    | `var(--spacing-1)` (4px)      | Horizontal padding in number/icon mode     |
| `--_font`     | `var(--font-size-xs)`         | Number text size                           |
| `--_ring`     | `0px`                         | Outline ring thickness, bumped by `data-ring="1"` |
| `--_color`    | `var(--color-primary)`        | Fill                                        |
| `--_on`       | `var(--color-primary-on)`     | Number / icon foreground                   |

### Layout

- `display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-sizing: border-box`.
- `background: var(--_color); color: var(--_on)`.
- `border-radius: var(--radius-pill)`.
- `box-shadow: 0 0 0 var(--_ring) var(--color-bg-surface)` — the outline ring (cosmetic, doesn't change the box model).
- Defaults to number/icon mode geometry: `min-width: var(--_height); height: var(--_height); padding-inline: var(--_pad-x)`.
- Type: `font-family: inherit; font-size: var(--_font); font-weight: var(--font-weight-semibold); line-height: 1; letter-spacing: -0.01em; font-variant-numeric: tabular-nums`.
- `z-index: 1` — sits above the anchor.

## Modes (`data-mode`)

### `dot` (default — also fires for any empty indicator)

```css
.org-indicator:empty,
.org-indicator[data-mode="dot"] {
  width: var(--_dot-size);
  height: var(--_dot-size);
  min-width: 0;
  padding: 0;
}
```

A bare colored circle, sized by `--_dot-size`. No children.

### `number`

The default pill geometry. The brain caps the rendered text at `99+` for any value ≥100 — the indicator itself just renders whatever string is inside it.

### `icon`

Pill with a snug-fit glyph:

- `--_size: calc(var(--_height) - 0.25rem)` — the wedge available for the icon.
- `padding-inline: 0.1875rem` — slightly tighter than the default pad-x to balance the icon's own box.
- `.org-icon` inside: `--_size: calc(var(--_height) - 0.375rem); --_color: var(--_on)` — Icon picks up the size and the indicator's `--_on` foreground.

## Sizes (`data-size`)

The dot diameter, pill height, padding, and font scale together.

| Value | `--_dot-size` | `--_height`   | `--_pad-x`            | `--_font`                |
| ----- | ------------- | ------------- | --------------------- | ------------------------ |
| `sm`  | `0.375rem` (6px) | `0.875rem` (14px) | `0.25rem`         | `var(--font-size-2xs)`   |
| `base` (default) | `0.5rem` (8px) | `1rem` (16px) | `var(--spacing-1)` | `var(--font-size-xs)` |
| `lg`  | `0.625rem` (10px) | `1.25rem` (20px) | `var(--spacing-1_5)` | `var(--font-size-sm)` |

## Colors (`data-color`)

The eight semantic ramps — each maps `--_color` to the base hue and `--_on` to its `*-on` partner so number / icon contrast is correct.

| Value       | `--_color`               | `--_on`                  |
| ----------- | ------------------------ | ------------------------ |
| `primary` (default) | `var(--color-primary)` | `var(--color-primary-on)` |
| `secondary` | `var(--color-secondary)` | `var(--color-secondary-on)` |
| `neutral`   | `var(--color-neutral)`   | `var(--color-neutral-on)` |
| `safe`      | `var(--color-safe)`      | `var(--color-safe-on)`   |
| `info`      | `var(--color-info)`      | `var(--color-info-on)`   |
| `caution`   | `var(--color-caution)`   | `var(--color-caution-on)` |
| `warning`   | `var(--color-warning)`   | `var(--color-warning-on)` |
| `danger`    | `var(--color-danger)`    | `var(--color-danger-on)` |

## Outline ring (`data-ring="1"`)

- Bumps `--_ring` to `2px` so the indicator's `box-shadow` paints a `2px` ring matching `var(--color-bg-surface)`. Use when pinning an indicator over imagery so the dot stays visible against busy pixels.
- `data-ring` and `data-position` are independent — you can pin without a ring or ring without pinning.

## Pulse (`data-pulse="1"`)

- The dot itself stays steady; a pseudo-element at `inset: 0` (background `var(--_color)`, `border-radius: inherit`, `z-index: -1`) animates outwards via the `org-indicator-pulse` keyframe (1.6s, ease-out, infinite).
- `prefers-reduced-motion: reduce` disables the pulse — keep the rule.

## Positioning (`data-position`)

- Sets `position: absolute` on the indicator and pins it to a corner of its anchor with a 35% out-of-bounds translate so it visually overlaps the anchor edge.

| Value          | Anchoring                          |
| -------------- | ---------------------------------- |
| `top-right`    | `top: 0; right: 0; translate(35%, -35%)` |
| `top-left`     | `top: 0; left: 0; translate(-35%, -35%)` |
| `bottom-right` | `bottom: 0; right: 0; translate(35%, 35%)` |
| `bottom-left`  | `bottom: 0; left: 0; translate(-35%, 35%)` |

The anchor must be `position: relative` — wrap with `.org-indicator-anchor` (or any element you've already given that property).

## Behaviours / rules

- **Dot is the default.** Empty `<span class="org-indicator">` renders as a dot — `:empty` and `[data-mode="dot"]` resolve to the same geometry.
- **`aria-label` is the only accessible name.** The visual is silent — supply a label for screen readers (`"3 unread"`, `"online"`, `"new"`).
- **`99+` is brain-side.** The CSS doesn't truncate; the consumer renders the string. `font-variant-numeric: tabular-nums` keeps width steady as digits change.
- **Ring is for over-imagery.** Pinning to an avatar that has a photo → use `data-ring="1"` so the dot doesn't get lost. Pinning over flat surfaces → ring is usually unnecessary.
- **Pulse means live.** Keep it for active / online status — not for "new", not for permanent badges. The pulse should imply the state is being kept fresh.
- **One mode at a time.** Don't put a number inside a `data-mode="icon"` indicator. The geometry locals are tuned per-mode.
- Defaults when omitted: `data-mode="dot"`, `data-color="primary"`, `data-size="base"`, no ring, no pulse, not pinned.
