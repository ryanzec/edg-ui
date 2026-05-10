# Dialog — Implementation Guide

A modal surface — header (title + optional leading semantic icon), scrollable content, footer (left/center/right alignment), and a close button that floats in the top-right corner. Lives inside a stage that owns the scrim + position (`center | top | bottom | left | right`); drawer and sheet variants are the same dialog with different stage positions.

## Anatomy

- **Stage**: `<div class="org-dialog-stage" data-position="center" data-open="0" data-backdrop="1">` — the fixed-position overlay environment. Holds the scrim + the dialog panel.
- **Scrim**: `<div class="org-dialog-scrim"></div>` — translucent backdrop with light blur. Suppressed by `[data-backdrop="0"]` on the stage.
- **Panel**: `<div class="org-dialog" data-rounded="1" data-show-close="1">` — the actual surface.
- **Close button**: `<button class="org-dialog-close-button" aria-label="Close"><span class="org-icon" data-icon="x"></span></button>` — floats in the top-right corner; `position: absolute`, NOT inside the header padding rhythm.
- **Header**: `<div class="org-dialog-header">` with optional `<span class="org-dialog-icon" data-color="info">…</span>` and `<h2 class="org-dialog-title">…</h2>`.
- **Content**: `<div class="org-dialog-content">…</div>` — scrolling region.
- **Footer**: `<div class="org-dialog-footer" data-alignment="end|center|start">` — typically a row of `org-button`s.

## Authoring shape

```html
<div class="org-dialog-stage" data-position="center" data-open="1">
  <div class="org-dialog-scrim"></div>
  <div class="org-dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-title">
    <button class="org-dialog-close-button" aria-label="Close">
      <span class="org-icon" data-icon="x"></span>
    </button>
    <div class="org-dialog-header">
      <span class="org-dialog-icon" data-color="warning">
        <span class="org-icon" data-icon="alert-triangle" data-context="dialog"></span>
      </span>
      <h2 class="org-dialog-title" id="dlg-title">Discard changes?</h2>
    </div>
    <div class="org-dialog-content">
      <p>You have unsaved edits. Discarding will lose them permanently.</p>
    </div>
    <div class="org-dialog-footer" data-alignment="end">
      <button class="org-button" data-variant="ghost">Cancel</button>
      <button class="org-button" data-color="danger">Discard</button>
    </div>
  </div>
</div>
```

## Panel (`.org-dialog`)

- `display: flex; flex-direction: column; position: relative`.
- `width: var(--sizing-dialog-default)` (`28rem` / 448px); `max-width: 100%`.
- `max-height: var(--sizing-dialog-max-vh)` (`100vh - 24px`); `min-height: var(--sizing-dialog-min-content)` (`48px`).
- `background: var(--color-dialog-surface)`; `color: var(--color-dialog-fg)`.
- `border: 1px solid var(--color-dialog-border)`; `border-radius: var(--radius-dialog)` (`12px`).
- `box-shadow: var(--shadow-dialog)` (lg).
- `font-family: var(--font-sans)`.
- `overflow: hidden` so the close button corner-clips against the surface, not the parent stage.
- Sharp-cornered variant `[data-rounded="0"]` sets `--_radius: 0` — for dialogs that host edge-bleeding media (full-bleed banner / image bleed).

### Drawer (`[data-position="left|right"]` on the stage)

- Cross-axis width flips to `var(--sizing-dialog-drawer)` (`24rem` / 384px).
- `height: 100vh`; `max-height: 100vh`; `border-radius: 0`.

### Sheet (`[data-position="top|bottom"]`)

- `width: 100vw; max-width: 100vw`; `height: var(--sizing-dialog-sheet)` (`18rem` / 288px); `border-radius: 0`.

## Close button (`.org-dialog-close-button`)

- `position: absolute; top: var(--spacing-dialog-close-inset); right: var(--spacing-dialog-close-inset)` (both `8px`).
- `z-index: 1` so it floats above scrolling content.
- `width / height: var(--sizing-dialog-close)` (control-base, `32px`); `padding: 0`.
- `border: 1px solid transparent; border-radius: var(--radius-sm); background: transparent; color: var(--color-fg-muted)`.
- Hover (not disabled): `background: var(--color-bg-hover); color: var(--color-fg)`.
- Active: `background: var(--color-bg-active)`.
- `:focus-visible`: `outline: none; box-shadow: var(--shadow-focus-ring)`.
- Disabled: standard `opacity: var(--opacity-disabled); cursor: not-allowed; pointer-events: none`.
- `[data-show-close="0"]` on the panel hides the button entirely.

## Header (`.org-dialog-header`)

- `display: flex; align-items: center; gap: var(--spacing-dialog-header-gap)` (`12px`).
- Padding:
  - top + bottom: `var(--spacing-dialog-header-y)` (`16px`).
  - left: `var(--spacing-dialog-pad-x)` (`20px`).
  - **right: `var(--spacing-dialog-header-end-reserve)` (`36px`)** — reserved trailing space so the title never runs under the floating close button.
- `flex-shrink: 0`.

### Title (`.org-dialog-title`)

- `margin: 0`; `font-size: var(--font-size-dialog-title)` (lg, `18px`); `font-weight: var(--font-weight-dialog-title)` (semibold); `line-height: var(--line-height-dialog-title)` (tight); `letter-spacing: var(--letter-spacing-tight)`.
- Single-line: `flex: 1 1 auto; min-width: 0` — wrapping lives in the content slot, not in the header.

### Leading icon (`.org-dialog-icon`)

- A bare semantic-tinted glyph next to the title — no background tile, color alone carries the meaning. Same convention as Tag / Button / Indicator.
- `flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; color: var(--_color)`.
- Inner icon at `var(--sizing-dialog-icon)` (icon-2xl, `24px`).
- `data-color` selects the ramp:
  - `primary`, `neutral`, `info` (default), `safe`, `caution`, `warning`, `danger`.

## Content (`.org-dialog-content`)

- `flex: 1 1 auto; min-height: 0; overflow: auto` — scrolling lives here; header + footer pin.
- `padding: var(--spacing-dialog-content-y) var(--spacing-dialog-pad-x)` (`16px 20px`).
- `color: var(--color-dialog-fg); font-size: var(--font-size-base); line-height: var(--line-height-normal)`.

### Padding interactions

- Header directly above content: content's `padding-top: 0` (header carries the gap).
- Content directly above footer: content's `padding-bottom: 0` (footer carries the gap).
- Header directly above footer (no content): footer's `padding-top: 0`.

These rules use `:has()` and adjacency selectors so the rhythm stays right whether or not all three slots are present.

## Footer (`.org-dialog-footer`)

- `flex-shrink: 0; display: flex; align-items: center; gap: var(--spacing-dialog-footer-gap)` (`8px`).
- `padding: var(--spacing-dialog-footer-y) var(--spacing-dialog-pad-x)` (`16px 20px`).
- `data-alignment`:
  - `end` (default in practice): `justify-content: flex-end`.
  - `center`: `justify-content: center`.
  - `start`: `justify-content: flex-start`.
- Buttons inside are real `org-button`s — primary action on the right (in `end` alignment), neutral / ghost on its left.

## Stage (`.org-dialog-stage`)

- `position: fixed; inset: 0; z-index: var(--z-index-modal); display: flex; pointer-events: none`.
- `[data-open="1"]` flips `pointer-events: auto`.
- `data-position`:
  - `center`: `align-items: center; justify-content: center; padding: var(--spacing-6)`.
  - `top`: `align-items: flex-start; justify-content: stretch`.
  - `bottom`: `align-items: flex-end; justify-content: stretch`.
  - `left`: `align-items: stretch; justify-content: flex-start`.
  - `right`: `align-items: stretch; justify-content: flex-end`.

## Scrim (`.org-dialog-scrim`)

- `position: absolute; inset: 0; background: var(--color-dialog-scrim)` (`rgba(15, 18, 24, 0.45)` light / `rgba(0,0,0,0.62)` dark).
- `backdrop-filter: blur(var(--blur-dialog-scrim))` (`2px`); plus `-webkit-backdrop-filter` twin.
- `opacity: 0`; `transition: opacity var(--motion-dialog-duration) var(--motion-dialog-ease)`.
- `[data-open="1"]` on the stage flips opacity to `1`.
- `[data-backdrop="0"]` on the stage hides the scrim entirely.

## Panel motion

- The panel sits above the scrim (`position: relative; z-index: 1`).
- Reveal: `opacity 0 → 1` plus a position-specific entrance vector:
  - `center` (default): `transform: scale(0.97) translateY(0.25rem) → none`.
  - `top`: `translateY(-1.5rem) → none`.
  - `bottom`: `translateY(1.5rem) → none`.
  - `left`: `translateX(-1.5rem) → none`.
  - `right`: `translateX(1.5rem) → none`.
- Duration `var(--motion-dialog-duration)` (slow); easing entrance.
- `prefers-reduced-motion: reduce` zeros the transition duration AND clears the transform — fade only, instant arrival.

## Behaviours / rules

- **Close button floats; header reserves space.** Never give the close a slot in the header flex row — it sits absolutely, the header reserves a 36px right padding so the title doesn't run under it. This is the only way to keep the corner placement stable while header copy length varies.
- **Header / content / footer pin / scroll / pin.** Long content scrolls; the header and footer never move. `min-height: 0` on the content is required so its overflow works inside a flex column.
- **No visual size variants.** A dialog's width comes from `--sizing-dialog-default` (centered), `--sizing-dialog-drawer` (left/right), or `--sizing-dialog-sheet` (top/bottom). Override with a class that resets `--_width` for the rare case — don't add new size attrs to the dialog itself.
- **Semantic icon, not status tile.** The leading `.org-dialog-icon` is a bare glyph in a semantic color. No background fill, no border. Color does the carrying.
- **Sharp corners only when needed.** The default is rounded; `[data-rounded="0"]` is reserved for full-bleed media — don't reach for it as a stylistic choice.
- Defaults when omitted: stage `data-position="center"`, `data-open="0"`, `data-backdrop="1"`. Panel `data-rounded="1"`, `data-show-close="1"`. Footer `data-alignment="end"`. Header icon `data-color="info"`.
