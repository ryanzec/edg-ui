# Tag — Implementation Guide

A small inline pill / chip for status, categories, and filters. Pill-shaped (fully rounded) so it never reads as a button. Eight semantic colors × two fill variants × three sizes; optional leading/trailing icon; optional removable "×" affordance.

## Anatomy

- **Root** (`<span>`): the pill container.
- **Label** (text node): the visible string. Single line, no wrap.
- **Icon (optional)**: an icon as the **first** child (leading) or **last** child (trailing). Inherits color and size from the root.
- **Remove button (optional)**: a real `<button>` as the **last** child. Replaces the trailing icon when present (mutually exclusive). Carries its own `aria-label` and focus ring.

## Authoring shape

```html
<!-- Bare -->
<span class="org-tag" data-color="primary">Design</span>

<!-- Color + variant + size -->
<span class="org-tag" data-color="safe" data-variant="weak" data-size="sm">Active</span>

<!-- Leading icon -->
<span class="org-tag" data-color="info" data-variant="weak">
  <span class="org-icon" data-icon="bookmark"></span>Saved
</span>

<!-- Removable -->
<span class="org-tag" data-color="neutral" data-variant="weak">
  priority:high
  <button type="button" class="org-tag-remove" aria-label="Remove priority:high">
    <span class="org-icon" data-icon="x"></span>
  </button>
</span>
```

## Root container

- Display: `inline-flex`; `align-items: center`; `justify-content: center`.
- Border-radius: `999px` (pill — distinguishes Tag from Button's `6px` radius).
- Border: `1px solid transparent` (reserves the box so variant swaps don't shift layout).
- Font-family: `inherit`; `font-weight: 500`; `line-height: 1`; `letter-spacing: 0`.
- `white-space: nowrap`; `user-select: none`; `vertical-align: middle`.
- Background + foreground: driven by **variant × color** (see below).

## Sizes (apply via `data-size`)

Three sizes mirror Button / Indicator's rhythm.

| Size             | Height | Padding-inline | Font size | Gap | Icon size |
| ---------------- | ------ | -------------- | --------- | --- | --------- |
| `xs`             | 18px   | 6px            | 10px      | 4px | 10px      |
| `sm`             | 20px   | 8px            | 10px      | 4px | 10px      |
| `base` (default) | 24px   | 10px           | 12px      | 6px | 12px      |

- Use `padding-inline` (not `padding-left/right`) so RTL flips automatically.
- Height is fixed; padding-block is **not** applied (the pill height alone defines vertical rhythm).

## Variants (apply via `data-variant`; default = `strong`)

For each color, the variant chooses how the pill is filled:

- **strong** (default) — saturated `background = color`, text = `color-on`. Border transparent.
- **weak** — `background = color-soft`, text = `color`. Border transparent.

## Colors (apply via `data-color`; default = `primary`)

Each color name maps to three raw values: **`color`** (strong fill / weak text), **`color-on`** (strong text), **`color-soft`** (weak fill). Light theme:

| Color       | `color` (strong bg / weak fg) | `color-on` (strong fg)  | `color-soft` (weak bg)  |
| ----------- | ----------------------------- | ----------------------- | ----------------------- |
| `primary`   | `oklch(0.32 0.008 260)`       | `oklch(0.985 0.003 95)` | `oklch(0.93 0.005 95)`  |
| `secondary` | `oklch(0.55 0.04 260)`        | `#ffffff`               | `oklch(0.94 0.012 260)` |
| `neutral`   | `oklch(0.58 0.005 260)`       | `#ffffff`               | `oklch(0.95 0.004 260)` |
| `safe`      | `oklch(0.58 0.13 145)`        | `#ffffff`               | `oklch(0.94 0.04 145)`  |
| `info`      | `oklch(0.56 0.13 240)`        | `#ffffff`               | `oklch(0.94 0.04 240)`  |
| `caution`   | `oklch(0.68 0.14 90)`         | `oklch(0.18 0.02 90)`   | `oklch(0.95 0.05 90)`   |
| `warning`   | `oklch(0.65 0.16 55)`         | `#ffffff`               | `oklch(0.95 0.05 55)`   |
| `danger`    | `oklch(0.55 0.18 25)`         | `#ffffff`               | `oklch(0.94 0.05 25)`   |

## Inner icon (`org-icon` child)

- A child icon inherits the tag's text color (`currentColor`) and the tag's per-size icon dimension (`10px` for `xs`/`sm`, `12px` for `base`).
- `flex-shrink: 0` so it never collapses.
- No special positioning rule — order in the DOM (first or last child) determines leading vs trailing.

## Remove button (`.org-tag-remove`)

- Real `<button type="button">`, **last child**, with its own `aria-label` (e.g. `"Remove priority:high"`).
- Reset: `appearance: none`; `border: 0`; `padding: 0`; `background: transparent`; `cursor: pointer`.
- Layout: `inline-flex`; centered; width = height = the tag's icon size (`10px` / `10px` / `12px` per size).
- `border-radius: 999px` (matches the pill).
- `color: inherit` so it works on both strong and weak variants.
- **Negative end margin**: `margin-inline-end: calc(<pad-x> * -0.4)` — pulls the X toward the pill curve so it doesn't look double-padded.
  - Resolves to `-2.4px` (xs), `-3.2px` (sm), `-4px` (base).
- Default `opacity: 0.75`.
- Transition: `background 150ms cubic-bezier(.3,.7,.4,1), opacity 150ms cubic-bezier(.3,.7,.4,1)`.
- **Hover**: `opacity: 1`; `background: rgb(0 0 0 / 0.08)`.
- **Focus-visible**: remove default outline; apply `box-shadow: 0 0 0 3px oklch(0.56 0.13 240)` (light) / `oklch(0.70 0.14 240)` (dark); `opacity: 1`.
- The X icon inside the button is sized **2px smaller** than the surrounding icon size (`8px` / `8px` / `10px`) so it reads as an affordance, not a glyph.
- The remove button emits a normal `click` event — consumers wire up DOM removal of the parent tag.

## Behaviors / rules

- **Presentational only** — the root is non-interactive. If the whole pill should act as a target, use a Button instead.
- **Pill shape is the load-bearing cue** that separates Tag from Button. Don't override `border-radius`.
- **Color is never the only signal** — pair every color with text ("Active", not just a green pill).
- **Trailing icon and remove button are mutually exclusive** — render one, not both. Removable wins.
- **Numeric "0" tags** (e.g. "0 issues") should use the HTML `hidden` attribute rather than render at all.
- Default values when attributes are omitted: `data-color="primary"`, `data-variant="strong"`, `data-size="base"`.

## Dark-theme deltas

Only the color ramps change; geometry, type, and motion are identical. Notable swaps used by Tag:

- `danger-on` becomes `oklch(0.16 0.05 25)` (dark text on the danger fill).
- `focus-ring` becomes `oklch(0.70 0.14 240)`.
- All other `*-soft` and `*-on` values shift along the dark ramp; the same selector logic applies.
