# Radio — Implementation Guide

Single radio option — an indicator (ring + inner dot) paired with a label and an optional sub-description. The native `<input type="radio">` sits inside a styled wrapper so the wrapper can render the focus ring, the dot animation, and the disabled / error treatments. Three sizes (`sm` / `base` / `lg`), two colors (`primary` default, `danger`), two variants (`default` / `card`).

Per agreed decision, Radio does **not** expose the full ComponentColor palette — only `primary` (which reads as ink, the strongest neutral choice) and `danger` (for destructive opt-ins).

## Anatomy

```html
<label class="org-radio" data-size="base" data-color="primary">
  <input class="org-radio-native" type="radio" name="plan" value="pro" />
  <span class="org-radio-indicator"></span>
  <span class="org-radio-body">
    <span class="org-radio-label">Pro plan</span>
    <span class="org-radio-description">Everything in Free, plus team workspaces.</span>
  </span>
</label>
```

The whole row is a single hit target — the native input is visually hidden but receives the click via the wrapping `<label>`.

## Root (`.org-radio`)

### Internal locals

| Local                          | Default                                  |
| ------------------------------ | ---------------------------------------- |
| `--_radio-indicator-size`      | `var(--sizing-choice-indicator-base)`    |
| `--_radio-mark-size`           | `var(--sizing-choice-mark-base)`         |
| `--_radio-gap`                 | `var(--spacing-choice-gap-base)`         |
| `--_radio-desc-gap`            | `var(--spacing-choice-desc-gap)`         |
| `--_radio-label-font-size`     | `var(--font-size-choice-label)`          |
| `--_radio-desc-font-size`      | `var(--font-size-choice-desc)`           |
| `--_radio-border-width`        | `var(--border-width-thin)`               |
| `--_radio-radius`              | `var(--radius-pill)`                     |
| `--_radio-bg`                  | `var(--color-bg-surface)`                |
| `--_radio-bg-hover`            | `var(--color-bg-surface)`                |
| `--_radio-border-color`        | `var(--color-border-strong)`             |
| `--_radio-border-color-hover`  | `var(--color-fg)`                        |
| `--_radio-fill`                | `var(--color-primary)`                   |
| `--_radio-fill-hover`          | `var(--color-primary-hover)`             |
| `--_radio-fill-active`         | `var(--color-primary-active)`            |
| `--_radio-mark-color`          | `var(--color-primary-on)`                |
| `--_radio-fg`                  | `var(--color-fg)`                        |
| `--_radio-desc-fg`             | `var(--color-fg-muted)`                  |

### Layout

- `display: inline-flex; align-items: flex-start; gap: var(--_radio-gap)`.
- `font-family: var(--font-sans); font-size: var(--_radio-label-font-size); font-weight: var(--font-weight-regular); line-height: var(--line-height-normal); letter-spacing: var(--letter-spacing-normal); color: var(--_radio-fg)`.
- `cursor: pointer`.

## Native input (`.org-radio-native`)

Visually hidden, fully functional. Stretched over the indicator so click + focus work against the visible mark, but transparent so the indicator drawing wins:

```css
.org-radio-native {
  position: absolute;
  width: var(--_radio-indicator-size);
  height: var(--_radio-indicator-size);
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: inherit;
  pointer-events: none;
}
```

`pointer-events: none` is correct — the wrapping `<label>` forwards clicks to the input.

## Indicator (`.org-radio-indicator`)

The ring + inner dot:

- `position: relative; flex: 0 0 auto`.
- `width / height: var(--_radio-indicator-size); border-radius: var(--_radio-radius)` (pill).
- `border: var(--_radio-border-width) solid var(--_radio-border-color); background: var(--_radio-bg)`.
- **Optical alignment** with the first label line:
  ```css
  margin-top: calc((1em * var(--line-height-normal) - var(--_radio-indicator-size)) / 2);
  ```
  Sits on the cap-height of the first label line rather than the line-box top. Single-line labels get vertical centring from the row's flex-start anyway; this rule kicks in for multi-line labels.
- Transitions on `border-color`, `background`, `box-shadow` (motion-base / standard).

### Inner dot (pseudo-element)

Scaled from 0 → 1 when checked, so the check transition reads as a positive confirmation rather than an instant snap:

```css
.org-radio-indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--_radio-mark-size);
  height: var(--_radio-mark-size);
  border-radius: var(--_radio-radius);
  background: var(--_radio-mark-color);
  transform: translate(-50%, -50%) scale(0);
  transition: transform var(--motion-duration-base) var(--motion-ease-entrance);
}
```

## Body (`.org-radio-body`)

- `display: flex; flex-direction: column; gap: var(--_radio-desc-gap); min-width: 0`.
- Holds:
  - `.org-radio-label` — `font-size: var(--_radio-label-font-size); font-weight: regular; color: var(--_radio-fg)`.
  - `.org-radio-description` — `font-size: var(--_radio-desc-font-size); color: var(--_radio-desc-fg)`.

## States

### Hover

```css
.org-radio:hover:not([data-disabled="1"]) .org-radio-indicator {
  border-color: var(--_radio-border-color-hover);   /* deeper border */
  background: var(--_radio-bg-hover);
}
```

### Focus-visible (driven from the native input)

```css
.org-radio-native:focus-visible + .org-radio-indicator {
  border-color: var(--_radio-fill);
  box-shadow: var(--shadow-focus-ring);
}
```

### Checked

Ring becomes the fill color, dot scales in:

```css
.org-radio-native:checked + .org-radio-indicator {
  border-color: var(--_radio-fill);
  background: var(--_radio-fill);
}
.org-radio-native:checked + .org-radio-indicator::after {
  transform: translate(-50%, -50%) scale(1);
}
```

Hover/active on a checked radio shifts the fill to `--_radio-fill-hover` / `--_radio-fill-active`.

### Forced-state helpers (docs only)

`.is-hover` / `.is-focus` mirror the `:hover` / `:focus-visible` rules so docs pages can pin a row in a particular state for visual matrices, without touching the native input.

## Sizes (`data-size`)

`sm` / `base` (default) / `lg` reassign:

- `--_radio-indicator-size` → `--sizing-choice-indicator-{sm,lg}`
- `--_radio-mark-size` → `--sizing-choice-mark-{sm,lg}`
- `--_radio-gap` → `--spacing-choice-gap-{sm,lg}`
- `--_radio-label-font-size` → `--font-size-{sm,md}`
- `--_radio-desc-font-size` → `--font-size-{xs,sm}`

## Color (`data-color`)

| Value     | Reassigns                                                    |
| --------- | ------------------------------------------------------------ |
| `primary` (default) | fill → `--color-primary`, mark → `--color-primary-on`. |
| `danger`  | fill → `--color-danger`, mark → `--color-danger-on`. Use only for destructive opt-ins. |

## Error (`data-state="error"`)

The indicator border flips to danger at rest, hover, and focus — same pattern as Input's error state. Layered **after** the hover/focus rules above so it wins:

```css
.org-radio[data-state="error"] .org-radio-indicator,
.org-radio[data-state="error"]:hover:not([data-disabled="1"]) .org-radio-indicator {
  border-color: var(--color-danger);
}
.org-radio[data-state="error"] .org-radio-native:focus-visible + .org-radio-indicator {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 0.1875rem color-mix(in oklch, var(--color-danger) 28%, transparent);
}
.org-radio[data-state="error"] .org-radio-native:checked + .org-radio-indicator {
  border-color: var(--color-danger);
  background: var(--color-danger);
}
```

## Disabled (`data-disabled="1"`)

```css
.org-radio[data-disabled="1"] {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}
.org-radio[data-disabled="1"] .org-radio-native {
  pointer-events: none;
}
```

## Card variant (`data-variant="card"`)

Wraps the indicator + body in a bordered tile (settings / plan picker pattern). Per-size padding from `--spacing-choice-card-pad-{sm,base,lg}`.

```css
.org-radio[data-variant="card"] {
  --_radio-card-pad: var(--spacing-choice-card-pad-base);

  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: var(--_radio-card-pad);
  background: var(--color-bg-surface);
  border: var(--_radio-border-width) solid var(--color-border);
  border-radius: var(--radius-choice-card);
  transition: background, border-color, box-shadow;
}
```

### Card states

- **Hover**: `border-color: var(--color-fg-muted); background: var(--color-bg-hover)`.
- **Selected** (driven by `:has(.org-radio-native:checked)` or fallback `.is-checked`):
  ```css
  border-color: var(--_radio-fill);
  background: var(--color-bg-surface);
  box-shadow: inset 0 0 0 var(--border-width-thin) var(--_radio-fill);
  ```
  The doubled border emphasis is drawn with an **inset box-shadow**, NOT a fake border. The real `border` carries 1px; the inset shadow adds the second px optically. This avoids changing the box model on selection.
- **Focus on a card**: the focus ring stacks with the inner ring:
  ```css
  box-shadow:
    inset 0 0 0 var(--border-width-thin) var(--_radio-fill),
    var(--shadow-focus-ring);
  ```
- **Error card**: real border + inset ring both flip to `--color-danger`.

## Behaviours / rules

- **Native input is visually hidden but functional.** Don't replace `<input type="radio">` — the form semantics, native a11y, and check state all live there. The `<label>` wraps the input so clicks anywhere on the row activate it.
- **The indicator is a `<span>`, not the input.** The wrapper paints the ring + dot; the native input is transparent and absolutely positioned over the indicator.
- **Dot scales from 0 → 1.** Use the entrance ease, not standard ease — the check feels like a positive confirmation. Don't snap-toggle.
- **Optical alignment with `margin-top: calc(...)`.** The indicator sits on the cap-height of the first label line. This is the right answer for multi-line labels with descriptions; don't replace with `align-items: center` on the row (that would re-center on the entire body and pull the indicator below the label baseline).
- **Hover / focus / checked are layered, not exclusive.** Each rule overrides one or two properties; the cascade composes them. `error` is layered after, with selectors that re-include `:hover` so it wins on hover too.
- **Card variant uses inset box-shadow for the second border.** Ordinary CSS `box-shadow` is reserved for elevation everywhere else in the system — but Card-Radio's inner ring is the documented exception, because changing the box model on select would shift the layout. The real `border` stays 1px; the shadow adds the second px optically.
- **Forced-state helpers (`.is-hover` / `.is-focus`) are docs-only.** Don't ship them in product. They mirror the live state selectors so designers can pin a state in a docs matrix.
- **Card-selected branch via `:has()`.** Modern browsers wire it from the native check state automatically. The `.is-checked` fallback exists for older browsers; consumers shouldn't need it on evergreen targets.
- **Color palette intentionally narrow.** Only `primary` and `danger`. Don't introduce `safe` / `caution` / `info` here — radios are commitment controls, and the soft semantic ramps belong to status surfaces.
- Defaults when omitted: `data-size="base"`, `data-color="primary"`, `data-variant="default"`, no error, not disabled, not checked.
