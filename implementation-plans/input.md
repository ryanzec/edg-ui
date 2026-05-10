# Input — Implementation Guide

A single-line text-entry shell. The native `<input>` lives inside a styled wrapper so the wrapper can host slot adornments (leading icon, trailing buttons, chips), render the focused border, and grow to fit chips that wrap onto multiple rows. Three variants (`default` / `borderless` / `inline`), full state set (hover, focus, error, disabled, readonly, loading), and built-in support for clear / password-toggle / number-stepper / inline-chips.

A multi-line `Textarea` ships separately — Input is single-line only.

## What Input composes

- `org-icon` — leading & trailing glyphs (search, eye, chevrons), passed `data-context="input"`.
- `org-button` — clear, password-eye, number stepper buttons (real Buttons, not custom).
- `org-loading-spinner` — the loading indicator, sits in the trailing slot.
- `org-tag` — inline filter chips, **always** rendered at the tag's `base` size with the `weak` variant. Any `data-size` on a child chip is intentionally ignored.

## Anatomy

```html
<div class="org-input"
     data-variant="default"
     data-has-leading="1"
     data-has-trailing="1"
     data-has-chips="1"
     data-has-value="1"
     data-show-clear="active"
     data-state="error"
     data-disabled="1"
     data-readonly="1"
     data-loading="1"
     data-type="search">

  <span class="org-input-leading">
    <span class="org-icon" data-icon="search" data-context="input"></span>
  </span>

  <div class="org-input-track">
    <span class="org-input-chips">
      <span class="org-tag" data-variant="weak"> … </span>
      <span class="org-tag" data-variant="weak"> … </span>
    </span>
    <input class="org-input-native" type="text" />
  </div>

  <span class="org-input-trailing">
    <span class="org-loading-spinner"> … </span>
    <button class="org-input-clear org-button" data-icon-only="1" …> … </button>
    <button class="org-input-password-toggle org-button" data-icon-only="1" …> … </button>
    <span class="org-input-stepper">
      <button class="org-input-stepper-up"> … </button>
      <button class="org-input-stepper-down"> … </button>
    </span>
  </span>
</div>
```

## Root (`.org-input`)

### Internal locals

| Local                          | Default                            |
| ------------------------------ | ---------------------------------- |
| `--_input-height`              | `var(--sizing-control-base)`       |
| `--_input-pad-x`               | `var(--spacing-control-base-x)`    |
| `--_input-pad-x-tight`         | `var(--spacing-1_5)`               |
| `--_input-slot-gap`            | `var(--spacing-1)`                 |
| `--_input-chip-gap`            | `var(--spacing-1)`                 |
| `--_input-chip-height`         | `1.25rem` — sm tag (20px), used in track-padding calc |
| `--_input-font-size`           | `var(--font-size-base)`            |
| `--_input-line-height`         | `var(--line-height-tight)`         |
| `--_input-radius`              | `var(--radius-sm)`                 |
| `--_input-border-width`        | `var(--border-width-thin)`         |
| `--_input-bg`                  | `var(--color-bg-surface)`          |
| `--_input-bg-hover`            | `var(--color-bg-surface)`          |
| `--_input-bg-focus`            | `var(--color-bg-surface)`          |
| `--_input-border-color`        | `var(--color-border)`              |
| `--_input-border-color-hover`  | `var(--color-border-strong)`       |
| `--_input-border-color-focus`  | `var(--color-info)`                |
| `--_input-border-color-error`  | `var(--color-danger)`              |
| `--_input-fg`                  | `var(--color-fg)`                  |
| `--_input-fg-placeholder`      | `var(--color-fg-faint)`            |
| `--_input-stepper-width`       | `1.25rem`                          |
| `--_input-stepper-button-height` | `calc(var(--_input-height) / 2)` |

### Shell layout

- `display: inline-flex; align-items: stretch`.
- `min-height: var(--_input-height); width: 100%; max-width: 22rem; padding: 0`.
- `border-radius: var(--_input-radius)`, `border: var(--_input-border-width) solid var(--_input-border-color)`.
- `background: var(--_input-bg); color: var(--_input-fg)`.
- Type: `font-family: var(--font-sans); font-size: var(--_input-font-size); font-weight: var(--font-weight-regular); line-height: var(--_input-line-height); letter-spacing: var(--letter-spacing-normal)`.
- `cursor: text` — clicking anywhere in the shell focuses the input.
- Transitions on `background`, `border-color`, `box-shadow`, `color` (motion-base).

## Native control (`.org-input-native`)

- `flex: 1 1 8ch; min-width: 8ch; width: auto; margin: 0; border: 0; outline: none; background: transparent; color: inherit; font: inherit; letter-spacing: inherit; cursor: inherit`.
- **Padding lives on the native input**, computed so the shell stays at `--_input-height`:
  - `padding: calc((var(--_input-height) - 1em * var(--_input-line-height)) / 2 - var(--_input-border-width)) var(--_input-pad-x)`.
  - This is what makes "click anywhere inside the border" focus the input — the input fills the shell.
- Placeholder: `color: var(--_input-fg-placeholder); opacity: 1`.

### Native browser overrides

- **Autofill** (`-webkit-autofill`): neutralised. `text-fill-color` and `caret-color` pinned to `--_input-fg`; `transition` set to a 9999s decay so the yellow flash never shows.
- **Search clear cross** (`type="search"`): hidden — the shell owns clear via `org-input-clear`.
- **Number spinners** (`type="number"`): hidden (`appearance: textfield`, inner/outer spin buttons set to `appearance: none`) — the shell owns the stepper.

## Slots (`.org-input-leading`, `.org-input-trailing`)

- `display: inline-flex; align-items: center; gap: var(--_input-slot-gap); flex: 0 0 auto`.
- `color: var(--color-fg-muted); font-size: var(--_input-font-size); line-height: 1`.
- Outer padding lives on the slot (`--_input-pad-x` on the outside; 0 on the side facing the input).
- When a slot is present, the native input drops to the **tight** pad-x on that side via:
  - `[data-has-leading="1"] .org-input-native { padding-left: var(--_input-pad-x-tight); }`
  - `[data-has-trailing="1"] .org-input-native { padding-right: var(--_input-pad-x-tight); }`
- A slot is hidden via `display: none` when its `data-has-*` flag is absent — keep both slots in markup; toggle via the data attributes.
- Icons inside an Input default to `data-context="input"`: `--_size: var(--sizing-icon-base); --_color: var(--color-fg-muted)`.

## Track (`.org-input-track`)

The flex container holding chips and the native input.

- `display: flex; flex-wrap: wrap; align-items: center; gap: var(--_input-chip-gap); flex: 1 1 auto; min-width: 0`.

### When chips are present (`data-has-chips="1"`)

- The track owns vertical padding (so click-empty-space-to-focus still works), and the native input drops its own vertical padding to avoid double-padding.
  - Track: `padding-block: calc((var(--_input-height) - var(--_input-chip-height)) / 2 - var(--_input-border-width)); padding-inline-start: var(--_input-pad-x); row-gap: var(--spacing-1_5)`.
  - Native: `padding-block: 0; padding-inline: 0`.
- The track's start padding ensures the first chip sits at the same x-offset text would — vertical alignment between chip-mode fields and plain fields in stacked forms.
- The end padding stays `0` so the native input flows to the trailing slot like normal.
- When a leading slot is also present, the slot owns the start padding instead — track uses `--_input-pad-x-tight`.

### Chips list (`.org-input-chips`)

- `display: contents` — each tag participates in the track's flex layout directly (same row as the native input, wraps with the same row-gap).
- The actual chip styling is owned by `org-tag`. Input only **pins the chip size** (overriding any `data-size` on the child tag):
  ```css
  .org-input-chips > .org-tag {
    --_height: var(--sizing-control-sm);    /* 24px */
    --_pad-x: var(--spacing-2_5);           /* 10px */
    --_gap: var(--spacing-1_5);             /* 6px */
    --_font-size: var(--font-size-xs);
    --_icon-size: var(--sizing-icon-xs);
  }
  ```

## Variants (`data-variant`)

### `default`

The ramp shown above. Hover and focus both surface `var(--color-info)` so the field reads as actively-targeted on pointer hover and keyboard focus alike — no separate focus-ring shadow needed; the border color carries the signal and meets non-color-only contrast guidance.

```css
.org-input[data-variant="default"] {
  --_input-bg: var(--color-bg-surface);
  --_input-bg-hover: var(--color-bg-surface);
  --_input-border-color: var(--color-border);
  --_input-border-color-hover: var(--color-info);
  --_input-border-color-focus: var(--color-info);
}
```

### `borderless`

No chrome until interacted with. Intended for use **inside** another bordered surface (e.g. a Card header).

```css
.org-input[data-variant="borderless"] {
  --_input-bg: transparent;
  --_input-bg-hover: var(--color-bg-surface-2);
  --_input-bg-focus: transparent;
  --_input-border-color: transparent;
  --_input-border-color-hover: transparent;
  --_input-border-color-focus: var(--color-info);
}
```

Slot and native pad-x switch to `--spacing-1_5` so the field reads tighter against its host surface.

### `inline`

Hugs its text, no height token, focused = single underline. Looks like editable inline copy.

- `min-height: auto; height: auto; padding: 0`.
- `border-width: 0; border-bottom: var(--border-width-thin) solid transparent; border-radius: 0`.
- `color: var(--color-fg-muted); width: auto; max-width: none`.
- Native control + slots all `padding: 0; height: auto; width: auto`.
- Hover: `color: var(--color-fg)`.
- Focus / `.is-focus`: `color: var(--color-fg); border-bottom-color: var(--color-info); box-shadow: none`.

## States

### Hover (default + borderless)

- `:hover` (or `.is-hover`) → `background: var(--_input-bg-hover); border-color: var(--_input-border-color-hover)`.
- The border-color rule is scoped with `:not([data-state="error"])` so error red survives hover without `!important`. The bg transition still runs — the field still feels interactive — only the border is locked.
- Inline variant skips the bg/border swap entirely and just shifts `color`.

### Focus (`:focus-within` or `.is-focus`)

- `background: var(--_input-bg-focus); border-color: var(--_input-border-color-focus)`.
- Scoped with `:not([data-state="error"])` so the danger border wins on error.
- A focused error field **still gets the focus background tint** — the user knows they're inside the field — but the border stays red.

### Error (`data-state="error"`)

- `border-color: var(--_input-border-color-error)` (`var(--color-danger)`) at rest, on hover, and on focus.
- The hover/focus rules carry `:not([data-state="error"])` exclusions — none of them can clobber the danger border.
- Inline variant: `border-bottom-color: var(--color-danger); color: var(--color-fg)`.

### Disabled (`data-disabled="1"`)

- `opacity: var(--opacity-disabled); cursor: not-allowed; pointer-events: none`.

### Readonly (`data-readonly="1"`, non-inline only)

- `--_input-bg / --_input-bg-hover: var(--color-bg-surface-2)` — visually different from disabled, still selectable.

### Loading (`data-loading="1"`)

- `.org-loading-spinner` inside picks up `color: var(--color-fg-muted)`.
- The spinner sits in the trailing slot via `order: -1` so it appears **before** clear / eye / stepper.

## Type-specific

### `data-type="search"`

- Leading icon (a search glyph) explicitly tracks to `var(--color-fg-muted)`.

### `data-type="number"` — number stepper (`.org-input-stepper`)

- A vertical column inside the trailing slot, two stacked buttons:
  ```css
  .org-input-stepper {
    display: inline-flex;
    flex-direction: column;
    width: var(--_input-stepper-width);
    height: calc(var(--_input-height) - 0.25rem);
    border-radius: var(--radius-xs);
    overflow: hidden;
    flex-shrink: 0;
  }
  ```
- `.org-input-stepper-up`, `.org-input-stepper-down`:
  - `appearance: none; border: 0; background: transparent; color: var(--color-fg-muted); cursor: pointer`.
  - `height: var(--_input-stepper-button-height)` (each = half the input height).
  - `display: inline-flex; align-items: center; justify-content: center; padding: 0`.
  - Hover: `background: var(--color-bg-hover); color: var(--color-fg)`.
  - Active: `background: var(--color-bg-active)`.
- The stepper sits last in the trailing slot via `order: 1` (after spinner / clear / eye).

## Clear button visibility (`data-show-clear`)

The brain stamps `data-has-value="1"` whenever the field is non-empty.

| Mode      | Visibility rule                                                |
| --------- | -------------------------------------------------------------- |
| `never`   | Always hidden.                                                 |
| `active` (default) | Hidden unless `(:hover OR :focus-within)` AND `data-has-value="1"`. |
| `always`  | Hidden if empty; visible whenever `data-has-value="1"`.        |

`.org-input-clear` and `.org-input-password-toggle` are sized via the `org-button` they compose; the wrapper just keeps them from breaking vertical centering (`display: inline-flex; align-items: center; flex-shrink: 0`).

## Trailing slot ordering

The trailing slot uses CSS `order` so the visual sequence stays correct regardless of DOM order:

- `.org-loading-spinner` → `order: -1` (first).
- `.org-input-stepper` → `order: 1` (last).
- Everything else (clear, password toggle) → default `order: 0` (middle).

## Forced-state helpers (`.is-hover`, `.is-focus`)

- Used in docs / showcase to pin a state. Already wired into the hover/focus rules above as alternatives to `:hover` / `:focus-within`.

## Behaviours / rules

- **Wrapper, not native swap.** The native `<input>` provides keyboard, IME, autofill, and selection — the shell sits around it. Don't try to do this with a contenteditable div.
- **Click-anywhere-to-focus is structural.** Padding lives on the native input, not the shell — every click inside the border lands on the input. Don't move the padding to the shell, even if it looks tidier.
- **Border = focus signal.** `--color-info` on the border is the focus indicator; there is no `:focus-visible` ring shadow. Don't add one — it would compete with the existing signal and hurt the borderless variant.
- **Variants change rest state, not interaction model.** Hover and focus rules are shared across `default` and `borderless`; only `inline` ships its own narrower rule set (color + underline only).
- **Error wins, always.** Every hover/focus rule carries `:not([data-state="error"])` so danger red can't be clobbered without `!important`. Keep the exclusion when adding new state rules.
- **Chips are real `org-tag`s.** The input doesn't repaint tag internals — it pins the size and lets the tag own everything else. Don't size chips to match a custom value.
- **Slot adornments compose real components.** Buttons inside slots are `org-button` with `data-icon-only="1"`, icons are `org-icon` with `data-context="input"`. Don't restyle them locally.
- **Native autofill, search-cross, and number-spinner overrides are non-negotiable.** Removing them lets the browser break the shell's geometry.
- **Trailing-slot order is fixed.** Spinner first, stepper last — `order` controls visual sequence, not DOM order. Don't rearrange children to match.
- **`max-width: 22rem` is a sane default, not a cap.** Override it on the consumer side (or via a layout container) when the field needs to fill a column.
- Defaults when omitted: `data-variant="default"`, `data-show-clear="active"`, no leading/trailing/chips/value flags, not error / disabled / readonly / loading.
