# Textarea — Implementation Guide

A multi-line text-entry shell. Sibling of Input — same variant ramp (`default`, `borderless`), same focus / hover / error vocabulary. The native `<textarea>` sits inside a styled wrapper so the wrapper can host an optional **bottom toolbar** with a built-in send button + keyboard hint, and own the focus-within border color.

Auto-grow is the only height behaviour — there is no native resize handle. The shell sizes between `min-lines` and `max-lines`, and content beyond `max-lines` scrolls inside.

## What Textarea composes

- `org-button` — toolbar action buttons, including the built-in send button.
- `org-loading-spinner` — loading state in the toolbar.

## Anatomy

```html
<label class="org-textarea"
       data-variant="default"
       data-state="error"
       data-disabled="1"
       data-readonly="1"
       data-loading="1"
       data-has-toolbar="1">

  <textarea class="org-textarea-native" rows="3"></textarea>

  <div class="org-textarea-toolbar">
    <div class="org-textarea-toolbar-left"> … </div>
    <div class="org-textarea-toolbar-spacer"></div>
    <div class="org-textarea-toolbar-right">
      <span class="org-textarea-hint">⏎ <kbd>↵</kbd> to send</span>
      <button class="org-button" data-icon-only="1"> … </button>
    </div>
  </div>
</label>
```

## Root (`.org-textarea`)

### Internal locals

| Local                                | Default                                  |
| ------------------------------------ | ---------------------------------------- |
| `--_textarea-pad-x`                  | `var(--spacing-textarea-pad-x)`          |
| `--_textarea-pad-y`                  | `var(--spacing-textarea-pad-y)`          |
| `--_textarea-font-size`              | `var(--font-size-textarea)`              |
| `--_textarea-line-height`            | `var(--line-height-textarea)`            |
| `--_textarea-radius`                 | `var(--radius-textarea)`                 |
| `--_textarea-border-width`           | `var(--border-width-textarea)`           |
| `--_textarea-min-lines`              | `var(--sizing-textarea-min-lines)`       |
| `--_textarea-max-lines`              | `var(--sizing-textarea-max-lines)`       |
| `--_textarea-bg`                     | `var(--color-textarea-bg)`               |
| `--_textarea-bg-hover`               | `var(--color-textarea-bg-hover)`         |
| `--_textarea-bg-focus`               | `var(--color-textarea-bg-focus)`         |
| `--_textarea-border-color`           | `var(--color-textarea-border)`           |
| `--_textarea-border-color-hover`     | `var(--color-textarea-border-hover)`     |
| `--_textarea-border-color-focus`     | `var(--color-textarea-border-focus)`     |
| `--_textarea-border-color-error`     | `var(--color-textarea-border-error)`     |
| `--_textarea-fg`                     | `var(--color-textarea-fg)`               |
| `--_textarea-fg-placeholder`         | `var(--color-textarea-fg-placeholder)`   |

### Shell layout

The shell is a CSS grid: a single content row that holds the native textarea; plus an optional toolbar row underneath. The grid lets the toolbar sit flush against the shell edges without an inner divider.

- `display: grid; grid-template-columns: 1fr; grid-template-rows: 1fr auto`.
- `width: 100%; max-width: 36rem; padding: 0`.
- `border-radius: var(--_textarea-radius); border: var(--_textarea-border-width) solid var(--_textarea-border-color)`.
- `background: var(--_textarea-bg); color: var(--_textarea-fg)`.
- Type: `font-family: var(--font-sans); font-size: var(--_textarea-font-size); font-weight: var(--font-weight-regular); line-height: var(--_textarea-line-height); letter-spacing: var(--letter-spacing-normal)`.
- `cursor: text` — clicking anywhere in the shell focuses the textarea.
- Transitions on `background`, `border-color`, `color` (motion-base).

## Native control (`.org-textarea-native`)

Fills the content cell and grows between min/max line heights.

- `grid-column: 1 / 2; grid-row: 1 / 2; width: 100%; margin: 0`.
- **Padding lives on the native control** so clicking anywhere inside the shell (including the gaps between border and text) hits the textarea and focuses it.
  - `padding: var(--_textarea-pad-y) var(--_textarea-pad-x)`.
- `border: 0; outline: none; background: transparent; color: inherit; font: inherit; letter-spacing: inherit; cursor: inherit`.
- `resize: none` — hidden always; auto-grow + scroll is the only height behaviour.
- `overflow-y: auto`.

### Min/max height — line-count derived

Vertical bounds derive from the line-count tokens. Padding is added so the calc'd visible area equals N full lines:

```css
min-height: calc(var(--_textarea-line-height) * 1em * var(--_textarea-min-lines) + var(--_textarea-pad-y) * 2);
max-height: calc(var(--_textarea-line-height) * 1em * var(--_textarea-max-lines) + var(--_textarea-pad-y) * 2);
```

Auto-grow is consumer-driven (set `rows` to fit content), but the shell enforces a hard floor and ceiling so a 1-row textarea never collapses below `min-lines` and a 50-row textarea never exceeds `max-lines` — overflow scrolls inside.

### Native browser overrides

- **Placeholder**: `color: var(--_textarea-fg-placeholder); opacity: 1`.
- **Autofill** (`-webkit-autofill`): neutralised. `text-fill-color` and `caret-color` pinned to `--_textarea-fg`; `transition: background-color 9999s ease-out 0s`.
- **Custom scrollbar** (WebKit): 10px wide, transparent track, `--color-border` thumb (`--color-border-strong` on hover), `radius-pill`, with a 3px transparent border + `background-clip: padding-box` so the thumb reads as a soft pill.

## Toolbar (`.org-textarea-toolbar`)

The merged bottom strip. Spans the full grid width, sits at the bottom of the same shell — **no internal divider, no separate background**. The shell border is the only chrome, so the toolbar feels like part of the field rather than a stuck-on accessory.

- `grid-column: 1 / -1; grid-row: 2 / 3`.
- `display: flex; align-items: center; gap: var(--spacing-textarea-toolbar-gap)`.
- `min-height: var(--sizing-textarea-toolbar-h)`.
- `padding: var(--spacing-textarea-toolbar-pad-y) var(--_textarea-pad-x) var(--_textarea-pad-y)`.
- `margin-top: calc(var(--spacing-textarea-toolbar-stack) * -1)` — pulls the toolbar slightly closer to the textarea than the shell's vertical padding implies. `padding-top: 0` would feel cramped; the shell's pad-y already gave the textarea breathing room, so the toolbar sits right below with just a small gap.

### Toolbar regions

- `.org-textarea-toolbar-left`, `.org-textarea-toolbar-right`:
  - `display: inline-flex; align-items: center; gap: var(--spacing-textarea-toolbar-gap); flex: 0 0 auto`.
- `.org-textarea-toolbar-spacer`: `flex: 1 1 auto` — push left and right groups apart.

### Toolbar visibility

- `data-has-toolbar="1"` — toolbar visible.
- Without the flag, `.org-textarea-toolbar { display: none }`.
- When toolbar is present, the textarea drops its bottom padding to `var(--spacing-1)` so the seam between the textarea row and the toolbar row reads as intentional whitespace, not a double-pad.

## Built-in send button + keyboard hint (`.org-textarea-hint`)

The send button is a real `org-button` (`variant=fill`, `color=primary`, square via `data-icon-only="1"`). The hint sits to its left and is purely informational — `pointer-events: none` so it never steals a click.

- Hint container: `display: inline-flex; align-items: center; gap: var(--spacing-1); color: var(--color-textarea-hint-fg); font-size: var(--font-size-textarea-hint); line-height: 1; user-select: none; pointer-events: none`.
- `kbd` inside the hint:
  - `display: inline-flex; align-items: center; justify-content: center`.
  - `min-width: 1.125rem; padding: 0 var(--spacing-1)`.
  - `border: var(--border-width-thin) solid var(--color-textarea-hint-kbd-border); border-radius: var(--radius-xs); background: var(--color-textarea-hint-kbd-bg); color: var(--color-textarea-hint-kbd-fg)`.
  - `font-family: var(--font-mono); font-size: 0.85em; line-height: 1.4`.

## Variants (`data-variant`)

Mirror Input. `default` is the bordered card; `borderless` is fully chromeless until interacted with — intended for use inside another bordered container (a card, a chat thread, a panel).

### `default`

```css
.org-textarea[data-variant="default"] {
  --_textarea-bg: var(--color-textarea-bg);
  --_textarea-bg-hover: var(--color-textarea-bg-hover);
  --_textarea-bg-focus: var(--color-textarea-bg-focus);
  --_textarea-border-color: var(--color-textarea-border);
  --_textarea-border-color-hover: var(--color-textarea-border-hover);
  --_textarea-border-color-focus: var(--color-textarea-border-focus);
}
```

### `borderless`

```css
.org-textarea[data-variant="borderless"] {
  --_textarea-bg: transparent;
  --_textarea-bg-hover: var(--color-bg-surface-2);
  --_textarea-bg-focus: transparent;
  --_textarea-border-color: transparent;
  --_textarea-border-color-hover: transparent;
  --_textarea-border-color-focus: var(--color-textarea-border-focus);
}
```

## States

### Hover (`:hover` / `.is-hover`)

- `:not([data-disabled="1"])` → `background: var(--_textarea-bg-hover)`.
- `:not([data-disabled="1"]):not([data-state="error"])` → `border-color: var(--_textarea-border-color-hover)`.
- The `:not([data-state="error"])` exclusion lets the danger border survive hover without `!important`. The bg transition still runs — the field still feels interactive — only the border is locked.

### Focus (`:focus-within` / `.is-focus`)

- `:not([data-disabled="1"]):not([data-state="error"])` → `background: var(--_textarea-bg-focus); border-color: var(--_textarea-border-color-focus)`.
- A focused error field **still gets the focus background tint** — the user knows they're inside the field — but the border stays red.

### Error (`data-state="error"`)

- `border-color: var(--_textarea-border-color-error)` (`var(--color-danger)`) at rest, on hover, and on focus.

### Disabled (`data-disabled="1"`)

- `opacity: var(--opacity-disabled); cursor: not-allowed; pointer-events: none`.

### Readonly (`data-readonly="1"`)

- `--_textarea-bg / --_textarea-bg-hover: var(--color-bg-surface-2)` — visually different from disabled, still selectable.

### Loading (`data-loading="1"`)

- `.org-loading-spinner` inside picks up `color: var(--color-fg-muted)`. Consumer drops the spinner into the toolbar themselves; the component just tones it.

## Behaviours / rules

- **Wrapper, not native swap.** The native `<textarea>` provides keyboard, IME, autofill, and selection — the shell sits around it. Don't replace with a `contenteditable` div.
- **Click-anywhere-to-focus is structural.** Padding lives on the native textarea, not the shell — every click inside the border lands on the control. Keep it that way.
- **Auto-grow only.** `resize: none` is non-negotiable. Sizing goes through `--_textarea-min-lines` and `--_textarea-max-lines`. No native handle, no `resize: vertical`.
- **Border = focus signal.** `--color-textarea-border-focus` (info-toned by default) on the border is the focus indicator; there is no `:focus-visible` ring shadow.
- **Error wins, always.** Every hover/focus rule carries `:not([data-state="error"])` so danger red can't be clobbered without `!important`. Keep the exclusion when adding new state rules.
- **Toolbar is part of the shell, not an accessory.** No internal divider, no separate background. The shell border is the only chrome — don't add a `border-top` to the toolbar.
- **Toolbar margin-top is negative on purpose.** It pulls the toolbar tighter to the textarea than the shell's vertical padding. Don't switch to `padding-top: 0` on the toolbar — that fights the textarea's own pad-y.
- **Toolbar visibility flips one rule.** `data-has-toolbar="1"` shows the toolbar AND drops the textarea's bottom padding to `--spacing-1`. Removing the flag does both.
- **Send button is a real `org-button`.** Don't recreate the chip — `variant=fill`, `color=primary`, `data-icon-only="1"` plus a glyph is the entire build.
- **Hint is informational only.** `pointer-events: none` so a user clicking the kbd doesn't steal focus from the textarea.
- **`max-width: 36rem` is a sane default, not a cap.** Override on the consumer side (or via a layout container) when the field needs to fill a column.
- Defaults when omitted: `data-variant="default"`, no toolbar, not error/disabled/readonly/loading.
