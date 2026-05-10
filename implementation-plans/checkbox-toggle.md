# Checkbox Toggle — Implementation Guide

A pill-shaped switch that semantically behaves like a checkbox: the native `<input type="checkbox">` drives state and form semantics; this component wraps it in a row that owns the visual treatment, the sliding knob, and an enlarged hit-target. Use for "is this thing turned on right now" settings (notifications, dark mode, autosave) — change takes effect immediately. Use plain Checkbox for opt-ins / agreements pending a Save.

## Anatomy

- **Root** (`<label class="org-checkbox-toggle">`): wraps the whole row. Carries `data-size`, `data-color`, `data-variant`, `data-label-position`, `data-disabled`.
- **Native input** (`<input type="checkbox" class="org-checkbox-toggle-native">`): visually hidden but functional.
- **Track** (`<span class="org-checkbox-toggle-track">`): the pill that holds the knob and changes color on / off.
- **Knob** (`<span class="org-checkbox-toggle-knob">` inside track): the sliding circle. Optionally wraps icons.
- **Icon-off / Icon-on** (`<span class="org-checkbox-toggle-icon-off">`, `<span class="org-checkbox-toggle-icon-on">`, optional, both inside knob): stacked at the same spot, crossfade with state.
- **Body** (`<span class="org-checkbox-toggle-body">`): vertical stack of label + optional description.
  - **Label** (`<span class="org-checkbox-toggle-label">`)
  - **Description** (`<span class="org-checkbox-toggle-description">`, optional)

## Authoring shape

```html
<label class="org-checkbox-toggle" data-size="base" data-color="primary">
  <input class="org-checkbox-toggle-native" type="checkbox" />
  <span class="org-checkbox-toggle-track">
    <span class="org-checkbox-toggle-knob">
      <span class="org-checkbox-toggle-icon-off">…</span>
      <span class="org-checkbox-toggle-icon-on">…</span>
    </span>
  </span>
  <span class="org-checkbox-toggle-body">
    <span class="org-checkbox-toggle-label">Notifications</span>
    <span class="org-checkbox-toggle-description">Get an email when something changes.</span>
  </span>
</label>
```

## Root layout

- `display: inline-flex`; `align-items: flex-start`; `gap: 10px` (size base).
- `min-height: 32px` (size base — matches base control row).
- `font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`.
- `font-weight: 400`; `line-height: 1.45`; `letter-spacing: 0`; `cursor: pointer`.
- `color: oklch(0.22 0.008 260)`.

### Label position

- Default — track on the leading edge, label trailing.
- `data-label-position="start"` — `flex-direction: row-reverse`. Body grows: `flex: 1 1 auto` so the track sticks to the trailing edge (typical settings-row pattern).

## Native input

- `position: absolute`; `width` = track-w; `height` = track-h; `margin: 0`; `padding: 0`.
- `opacity: 0`; `pointer-events: none`; `cursor: inherit`.

## Track (the pill)

- `position: relative`; `flex: 0 0 auto`.
- `width` / `height` per size (see Sizes). `border-radius: 999px` (fully rounded pill regardless of size).
- `background: oklch(0.92 0.006 95)` (off state).
- Optical alignment with first label line: `margin-top: calc((1em * 1.45 - <track-h>) / 2)`.
- Transitions: `background 250ms cubic-bezier(.3,.7,.4,1)`, `box-shadow 150ms cubic-bezier(.3,.7,.4,1)`.

## Knob (the circle)

- `position: absolute`; `top: 50%`; `left: 2px` (the inset).
- `width` / `height` = knob size; `border-radius: 999px`.
- `background: #ffffff`.
- `transform: translateY(-50%)`.
- `display: flex`; `align-items: center`; `justify-content: center`.
- `box-shadow: 0 1px 2px rgba(0,0,0,.04)` (real elevation — not a fake border).
- Transitions: `left 250ms cubic-bezier(.3,.7,.4,1)`, `background 150ms cubic-bezier(.3,.7,.4,1)`.

When checked, knob `left = track-w − knob-size − 2px` so the inset is symmetric in both end positions.

## Knob icons

- Both `.org-checkbox-toggle-icon-off` / `.org-checkbox-toggle-icon-on`: `position: absolute`; `display: inline-flex`; centered; `width` / `height` / `font-size` = icon size; `line-height: 1`; `transition: opacity 150ms cubic-bezier(.3,.7,.4,1)`.
- Off icon: `color: oklch(0.46 0.008 260)`; `opacity: 1` when off, `0` when on.
- On icon: `color` = the active color's on-icon (primary: `oklch(0.32 0.008 260)`; safe: `oklch(0.58 0.13 145)`; danger: `oklch(0.55 0.18 25)`); `opacity: 0` when off, `1` when on.
- Either slot can be absent.

## Body / label / description

- Body: `display: flex`; `flex-direction: column`; `gap: 2px`; `min-width: 0`.
- Label: `font-size: 14px` (base); `font-weight: 400`; `line-height: 1.45`; `color: oklch(0.22 0.008 260)`.
- Description: `font-size: 12px` (base); `line-height: 1.45`; `color: oklch(0.46 0.008 260)`.

## Sizes (`data-size`; default `base`)

| Size   | Track w × h | Knob | Icon | Gap  | Row min-h | Label / Desc font |
| ------ | ----------- | ---- | ---- | ---- | --------- | ----------------- |
| `sm`   | `28 × 16`   | `12` | `10` | `8`  | `24`      | `13` / `12`       |
| `base` | `36 × 20`   | `16` | `12` | `10` | `32`      | `14` / `12`       |
| `lg`   | `44 × 24`   | `20` | `13` | `12` | `40`      | `16` / `13`       |

(All values in px. Knob inset is constant `2px` across sizes.)

## Colors (`data-color`; default `primary`)

Off-state is identical across colors; only the on-state ramp swaps.

| Color     | track-on                 | track-on-hover           | track-on-active          | knob-icon-on             |
| --------- | ------------------------ | ------------------------ | ------------------------ | ------------------------ |
| `primary` | `oklch(0.32 0.008 260)`  | `oklch(0.40 0.010 260)`  | `oklch(0.26 0.008 260)`  | `oklch(0.32 0.008 260)`  |
| `safe`    | `oklch(0.58 0.13 145)`   | `oklch(0.52 0.14 145)`   | `oklch(0.46 0.14 145)`   | `oklch(0.58 0.13 145)`   |
| `danger`  | `oklch(0.55 0.18 25)`    | `oklch(0.48 0.19 25)`    | `oklch(0.42 0.19 25)`    | `oklch(0.55 0.18 25)`    |

`safe` is the extra positive option for switches where on/off carries meaning (2FA on, autosave on).

## States

- **Off (default)** — track `oklch(0.92 0.006 95)`; knob at `left: 2px`; off-icon visible.
- **Off hover** (not disabled) — track `oklch(0.9 0.005 95)`.
- **On** (`:checked`) — track = color's track-on; knob slides to `calc(<track-w> − <knob-size> − 2px)`; on-icon visible (off-icon `opacity: 0`).
- **On hover** (not disabled) — track = color's track-on-hover.
- **On active** (pressed, not disabled) — track = color's track-on-active.
- **Focus-visible** (native input) — track gets `box-shadow: 0 0 0 3px oklch(0.56 0.13 240)`.
- **Disabled** (`data-disabled="1"`) — root `opacity: 0.5`; `cursor: not-allowed`; native `pointer-events: none`.
- **Forced-state helpers** (docs only): `.is-hover` mirrors hover, `.is-focus` mirrors focus-visible.

## Card variant (`data-variant="card"`)

Bordered tile wrapping the row — for settings lists where each row is its own surface.

- `display: flex`; `align-items: center`; `width: 100%`.
- `padding: 12px` (sm: `10px`, lg: `16px`).
- `background: #ffffff`; `border: 1px solid oklch(0.9 0.005 95)`; `border-radius: 8px`.
- Transitions background, border-color, box-shadow `150ms cubic-bezier(.3,.7,.4,1)`.
- Body grows: `flex: 1 1 auto`.
- Defaults to **label-first** (`flex-direction: row-reverse`) — the conventional settings-row layout (copy left, switch right). Override with `data-label-position="end"` to put the track on the leading edge.
- **Hover** (not disabled): border `oklch(0.46 0.008 260)`; background `oklch(0.945 0.005 95)`.
- **Selected** (`:has(.org-checkbox-toggle-native:checked)`): border = color's track-on; `box-shadow: inset 0 0 0 1px <track-on>` (doubles weight without layout shift).
- **Focus-visible inside**: `box-shadow: inset 0 0 0 1px <track-on>, 0 0 0 3px oklch(0.56 0.13 240)`.

## Behaviours / rules

- The wrapping `<label>` makes the whole row a hit target — clicks anywhere forward to the native input.
- Knob slide is `250ms cubic-bezier(.3,.7,.4,1)` — slightly slower than the choice indicator's fade so the travel reads as deliberate.
- Off-state styling never changes per color — color only affects the on-state ramp + on-icon.
- Default attributes when omitted: `data-size="base"`, `data-color="primary"`, `data-variant="default"`, `data-label-position="end"` (track-leading).
- Use `safe` for "thing is enabled / protected" framings; `danger` for "armed / destructive enabled" framings; `primary` everywhere else.
