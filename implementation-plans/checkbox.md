# Checkbox — Implementation Guide

A boolean opt-in — a styled square indicator (with a tick or a horizontal dash) paired with a label and an optional sub-line description. Native `<input type="checkbox">` drives state; the visible square is a styled sibling. Three sizes × two colors × default and card variants × indeterminate / disabled / error states.

## Anatomy

- **Root** (`<label>`): wraps the whole row so a click anywhere toggles. Carries `data-size`, `data-color`, `data-variant`, `data-indeterminate`, `data-disabled`, `data-state` attributes.
- **Native input** (`<input type="checkbox" class="org-checkbox-native">`): visually hidden but fully functional. Drives `:checked`, `:focus-visible`, form semantics.
- **Indicator** (`<span class="org-checkbox-indicator">`): the square with the border + fill. Holds the SVG.
- **SVG** (inside indicator): contains a `<path class="org-checkbox-tick">` (the check) and a `<line class="org-checkbox-dash">` (the indeterminate bar). Both render as strokes.
- **Body** (`<span class="org-checkbox-body">`): vertical stack of label + optional description.
  - **Label** (`<span class="org-checkbox-label">`)
  - **Description** (`<span class="org-checkbox-description">`, optional)

## Authoring shape

```html
<label class="org-checkbox" data-size="base" data-color="primary">
  <input class="org-checkbox-native" type="checkbox" />
  <span class="org-checkbox-indicator">
    <svg viewBox="0 0 24 24">
      <path class="org-checkbox-tick" d="M5 12.5 10.5 18 19 7"></path>
      <line class="org-checkbox-dash" x1="6" y1="12" x2="18" y2="12"></line>
    </svg>
  </span>
  <span class="org-checkbox-body">
    <span class="org-checkbox-label">Email me about new features</span>
    <span class="org-checkbox-description">Up to once a week.</span>
  </span>
</label>
```

## Root layout

- `display: inline-flex`; `align-items: flex-start`; `gap: 10px` (size base).
- `font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`.
- `font-weight: 400`; `line-height: 1.45`; `letter-spacing: 0`; `cursor: pointer`.
- `color: oklch(0.22 0.008 260)`.

## Native input

- `position: absolute`; `width` / `height` = indicator size; `margin: 0`; `padding: 0`.
- `opacity: 0`; `pointer-events: none`; `cursor: inherit`.

## Indicator (the square)

- `position: relative`; `flex: 0 0 auto`.
- `width` / `height` = per-size indicator (see Sizes).
- `border-radius: 4px` — fixed across all sizes (smaller than indicator so it reads square, not blob).
- `border: 1px solid oklch(0.78 0.008 260)`.
- `background: #ffffff`.
- `display: inline-flex`; `align-items: center`; `justify-content: center`.
- Optical alignment with first label line: `margin-top: calc((1em * 1.45 - <indicator-size>) / 2)`.
- Transitions border-color, background, box-shadow `150ms cubic-bezier(.3,.7,.4,1)`.

## Tick + dash SVG

- `<svg viewBox="0 0 24 24">` fills the indicator (`width: 100%`, `height: 100%`, `padding: 1px`, `display: block`, `pointer-events: none`).
- `color` (drives stroke) flips per state: unchecked uses default ink, checked uses the on-color (`oklch(0.985 0.003 95)` for primary, `#ffffff` for danger).
- Both `path` and `line`: `fill: none`; `stroke: currentColor`; `stroke-width: 3`; `stroke-linecap: round`; `stroke-linejoin: round`.
- Use `pathLength: 24` + `stroke-dasharray: 24` + `stroke-dashoffset: 24` so the line is hidden by default and traces in by animating offset to `0`. Transition: `stroke-dashoffset 250ms cubic-bezier(0,.55,.45,1)`.
- Tick `d="M5 12.5 10.5 18 19 7"`; dash `x1="6" y1="12" x2="18" y2="12"`.

## Body / label / description

- Body: `display: flex`; `flex-direction: column`; `gap: 2px`; `min-width: 0`.
- Label: `font-size: 14px` (size base); `font-weight: 400`; `line-height: 1.45`; `color: oklch(0.22 0.008 260)`.
- Description: `font-size: 12px` (size base); `line-height: 1.45`; `color: oklch(0.46 0.008 260)`.

## Sizes (`data-size`; default `base`)

| Size   | Indicator | Gap (indicator↔body) | Label font | Desc font |
| ------ | --------- | -------------------- | ---------- | --------- |
| `sm`   | `14px`    | `8px`                | `13px`     | `12px`    |
| `base` | `18px`    | `10px`               | `14px`     | `12px`    |
| `lg`   | `22px`    | `12px`               | `16px`     | `13px`    |

## Colors (`data-color`; default `primary`)

Color drives the **fill** when checked / indeterminate, the focus-ring border, and the tick stroke (`-on`).

| Color     | fill                        | fill-hover                  | fill-active                 | tick stroke (`-on`)         |
| --------- | --------------------------- | --------------------------- | --------------------------- | --------------------------- |
| `primary` | `oklch(0.32 0.008 260)`     | `oklch(0.40 0.010 260)`     | `oklch(0.26 0.008 260)`     | `oklch(0.985 0.003 95)`     |
| `danger`  | `oklch(0.55 0.18 25)`       | `oklch(0.48 0.19 25)`       | `oklch(0.42 0.19 25)`       | `#ffffff`                   |

Use `danger` sparingly, only for destructive opt-ins.

## States

- **Unchecked** — border `oklch(0.78 0.008 260)`, background `#ffffff`, both SVG segments hidden (`stroke-dashoffset: 24`).
- **Hover** (not disabled) — border-color `oklch(0.22 0.008 260)`. When already checked, fill goes to fill-hover.
- **Active** (pressed, not disabled, checked) — fill goes to fill-active.
- **Focus-visible** (on the native input) — indicator border = the color's fill; add `box-shadow: 0 0 0 3px oklch(0.56 0.13 240)`.
- **Checked** (`:checked`) — border + background = the color's fill; tick `stroke-dashoffset: 0` (animates in).
- **Indeterminate** (`data-indeterminate="1"` on root **and** `el.indeterminate = true` on the input) — same fill as checked, but tick stays hidden and the dash `<line>` reveals (`stroke-dashoffset: 0`).
- **Disabled** (`data-disabled="1"`) — `opacity: 0.5`; `cursor: not-allowed`; native is `pointer-events: none`.
- **Error** (`data-state="error"`) — indicator border `oklch(0.55 0.18 25)` in every state; checked / indeterminate fill `oklch(0.55 0.18 25)`; focus ring `box-shadow: 0 0 0 3px color-mix(in oklch, oklch(0.55 0.18 25) 28%, transparent)`.

## Card variant (`data-variant="card"`)

Wraps the row in a bordered tile. Use for permission pickers, feature opt-ins, settings rows.

- `display: flex`; `align-items: flex-start`; `width: 100%`.
- `padding: 12px` (sm: `10px`, lg: `16px`).
- `background: #ffffff`; `border: 1px solid oklch(0.9 0.005 95)`; `border-radius: 8px`.
- Transitions background, border-color, box-shadow `150ms cubic-bezier(.3,.7,.4,1)`.
- **Hover** (not disabled): border `oklch(0.46 0.008 260)`; background `oklch(0.945 0.005 95)`.
- **Selected** (`:has(.org-checkbox-native:checked)`, or `[data-indeterminate="1"]`): border = the color's fill; `box-shadow: inset 0 0 0 1px <fill>` (doubles the border weight without layout shift).
- **Focus-visible inside**: `box-shadow: inset 0 0 0 1px <fill>, 0 0 0 3px oklch(0.56 0.13 240)`.
- **Error**: border + inset shadow use `oklch(0.55 0.18 25)`.

## Behaviours / rules

- The whole row is the hit target — clicking indicator, label, description, or the gap toggles the option.
- Indeterminate is a third **visual** state — set `data-indeterminate="1"` on root **and** assign `el.indeterminate = true` on the native input so assistive tech reads it correctly.
- Tick traces in over `250ms` on check; uncheck instantly retracts the stroke without a visual snap (the offset jumps back to `24` with no transition observed).
- Color is intentionally limited to `primary` + `danger` — matches Radio so a CheckboxGroup beside a RadioGroup uses the same visual weight.
- Default attributes when omitted: `data-size="base"`, `data-color="primary"`, `data-variant="default"`.
- Pair multiple checkboxes inside a CheckboxGroup when grouping related opt-ins.
