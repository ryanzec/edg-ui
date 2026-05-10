# Notification — Implementation Guide

Global toast notifications. A fixed corner stack hosts one or more toasts, each with a left intent rail, leading icon or avatar, title, optional description, optional action buttons, a close button, and an optional countdown progress bar.

**One look only.** Subtle surface with a left intent rail + tinted leading glyph. No solid / outline siblings. **One size only.** Variation is via `[data-color]` (intent) and `[data-position]` (stack location).

## Anatomy

```html
<div class="org-notifications" data-position="top-right">

  <div class="org-notification" data-color="info" data-show-close="1">

    <div class="org-notification-media">
      <span class="org-icon" data-icon="info" data-context="notification"></span>
    </div>

    <div class="org-notification-body">
      <h4 class="org-notification-title">Backup complete</h4>
      <p class="org-notification-description">Your last 24h is safe.</p>
      <div class="org-notification-actions">
        <button class="org-button" data-variant="text" data-size="sm">View</button>
      </div>
    </div>

    <button class="org-notification-close" aria-label="Dismiss">
      <span class="org-icon" data-icon="close"></span>
    </button>

    <div class="org-notification-progress" style="--_progress: 60%"></div>
  </div>
</div>
```

## Stack container (`.org-notifications`)

- `position: fixed; z-index: var(--z-index-toast)`.
- `display: flex; flex-direction: column; gap: var(--spacing-notification-stack-gap)`.
- `width: var(--sizing-notification-stack-width); max-width: calc(100vw - (var(--spacing-notification-stack-inset) * 2))`.
- `pointer-events: none` on the container; `pointer-events: auto` on each toast — empty stacks never block the page.

### Position (`data-position`)

| Value             | Anchoring                                                              |
| ----------------- | ---------------------------------------------------------------------- |
| `top-right`       | `top: inset; right: inset`                                             |
| `top-left`        | `top: inset; left: inset`                                              |
| `top-center`      | `top: inset; left: 50%; transform: translateX(-50%)`                   |
| `bottom-right`    | `bottom: inset; right: inset`                                          |
| `bottom-left`     | `bottom: inset; left: inset`                                           |
| `bottom-center`   | `bottom: inset; left: 50%; transform: translateX(-50%)`                |

**Bottom-anchored stacks grow upward** — `flex-direction: column-reverse` so the newest toast sits at the bottom edge and older ones float up.

## Toast surface (`.org-notification`)

### Internal locals

- `--_accent: var(--color-notification-accent-info)` — drives the left rail color and the leading icon color. Reassigned by `[data-color]`.

### Layout

- `position: relative; display: grid; grid-template-columns: auto 1fr auto; align-items: start; gap: var(--spacing-notification-media-gap); width: 100%`.
- `padding: var(--spacing-notification-pad-y) var(--spacing-notification-pad-x)`.
- **Reserve space for the rail and the close button**:
  - `padding-left: calc(var(--spacing-notification-pad-x) + var(--sizing-notification-rail))` — body never crashes into the rail.
  - `padding-right: calc(var(--spacing-notification-pad-x) + var(--sizing-notification-close))` — title never runs under the floating close button.
- `background: var(--color-notification-surface); color: var(--color-notification-fg)`.
- `border: var(--border-width-thin) solid var(--color-notification-border)`. **Left intent rail** is a real left border carrying the accent: `border-left-width: var(--sizing-notification-rail); border-left-color: var(--_accent)`.
- `border-radius: var(--radius-notification); box-shadow: var(--shadow-notification)`.
- `font-family: var(--font-sans); overflow: hidden` — children inherit the rounded clip so the progress bar at the bottom corner-clips against the surface.

### Intent (`data-color`)

Each value reassigns `--_accent`:

| Value       | `--_accent`                                |
| ----------- | ------------------------------------------ |
| `info`      | `var(--color-notification-accent-info)`    |
| `safe`      | `var(--color-notification-accent-safe)`    |
| `caution`   | `var(--color-notification-accent-caution)` |
| `warning`   | `var(--color-notification-accent-warning)` |
| `danger`    | `var(--color-notification-accent-danger)`  |
| `primary`   | `var(--color-notification-accent-primary)` |
| `neutral`   | `var(--color-notification-accent-neutral)` |

## Leading media (`.org-notification-media`)

- `grid-column: 1; grid-row: 1`.
- `display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0`.
- `height: var(--line-height-notification-title)` — vertically centers on the title row.
- `color: var(--_accent)` — the leading icon picks up the intent color via `currentColor`.

### Icon variant

- `> .org-icon[data-context="notification"] { --_size: var(--sizing-notification-icon); }`.

### Avatar variant

- Consumer drops an `<img>` directly:
  ```css
  .org-notification-media > img {
    width: var(--sizing-notification-avatar);
    height: var(--sizing-notification-avatar);
    border-radius: var(--radius-pill);
    object-fit: cover;
    display: block;
  }
  ```
- When the slot holds an avatar, the auto height drops so the avatar isn't squashed against the title's line-height: `.org-notification-media:has(> img) { height: auto; }`.

## Body (`.org-notification-body`)

- `grid-column: 2; grid-row: 1`.
- `display: flex; flex-direction: column; gap: var(--spacing-notification-stack-y); min-width: 0`.
- **No leading media** → body spans `grid-column: 1 / span 2` so the surface still feels balanced.

### Title (`.org-notification-title`)

- `margin: 0; font-size: var(--font-size-notification-title); font-weight: var(--font-weight-notification-title); line-height: var(--line-height-notification-title); color: var(--color-notification-fg); letter-spacing: var(--letter-spacing-tight)`.

### Description (`.org-notification-description`)

- `margin: 0; font-size: var(--font-size-notification-desc); line-height: var(--line-height-notification-desc); color: var(--color-notification-fg-muted)`.

### Actions (`.org-notification-actions`)

- `display: flex; align-items: center; gap: var(--spacing-notification-actions-gap)`.
- `margin-top: calc(var(--spacing-notification-actions-y) - var(--spacing-notification-stack-y))` — picks up the actions-y spacing on top of the body's stack-y, so 1–2 buttons or an inline link sit at the right rhythm below the description.
- Children: real `org-button`s (typically `data-variant="text"` at `data-size="sm"`) and/or `org-link`s.

## Close button (`.org-notification-close`)

Floats top-right. Owns its own button styling rather than composing `org-button` so the floating geometry stays self-contained:

- `position: absolute; top / right: var(--spacing-notification-close-inset); z-index: 1`.
- `appearance: none; display: inline-flex; align-items: center; justify-content: center`.
- `width / height: var(--sizing-notification-close); padding: 0`.
- `border: var(--border-width-thin) solid transparent; border-radius: var(--radius-sm); background: transparent`.
- `color: var(--color-notification-fg-muted); cursor: pointer`.
- Transitions on `background`, `color`, `box-shadow` (motion-base).

States:

- Hover: `background: var(--color-bg-hover); color: var(--color-notification-fg)`.
- Active: `background: var(--color-bg-active)`.
- Focus-visible: `outline: none; box-shadow: var(--shadow-focus-ring)`.
- `[data-show-close="0"]` on the toast hides it: `.org-notification[data-show-close="0"] .org-notification-close { display: none; }`.

## Progress bar (`.org-notification-progress`)

Bottom-edge countdown:

- `position: absolute; left: 0; right: 0; bottom: 0; height: var(--sizing-notification-progress)`.
- `background: var(--color-notification-progress-track); pointer-events: none; z-index: 1`.
- Fill via `::after`:
  ```css
  .org-notification-progress::after {
    content: "";
    display: block;
    height: 100%;
    width: var(--_progress, 50%);
    background: var(--_accent);
    transition: width var(--motion-duration-base) linear;
  }
  ```
- Consumer updates `--_progress` (e.g. `style="--_progress: 30%"`) to tick down.

## Enter / exit motion

- **Enter (top-anchored)**: from `opacity: 0; translateY(-half-gap) scale(0.985)` to `opacity: 1; transform: none`.
- **Enter (bottom-anchored)**: from `opacity: 0; translateY(+half-gap) scale(0.985)` — slides from below.
- **Leave** (`data-state="leaving"`): to `opacity: 0; translateY(-quarter-gap) scale(0.985)`. Collapses the toast's vertical footprint so siblings reflow into the gap as it fades. `pointer-events: none`.
- Animation duration: `var(--motion-notification-duration)`. Enter uses `var(--motion-notification-ease)`; exit uses `var(--motion-notification-ease-exit)`.

### Reduced motion

- `prefers-reduced-motion: reduce` removes enter/leave animations. Leaving toasts simply set `opacity: 0`. Progress fill drops its width transition.

## Behaviours / rules

- **One look, intent via color.** Don't introduce solid / outline / filled variants. The subtle surface + colored rail is the entire visual language.
- **Stack container is pointer-transparent.** `.org-notifications` itself has `pointer-events: none`; only toasts re-enable. Empty stacks must not block the page.
- **Bottom stacks reverse direction.** `column-reverse` means newest toast sits at the bottom edge, older ones above. The DOM order can stay newest-first; the layout flips.
- **Reserve space for floating chrome in padding.** The close button and the rail aren't laid out by the grid — they float in. The shell pads to make room. Don't shrink that padding.
- **Leading rail is a real left border.** Not a `box-shadow`, not a pseudo-element. Width and color come from the same border declaration so the box model accounts for it.
- **Avatar branch via `:has()`.** The media slot's height auto-resets when an `<img>` is present. Don't author a separate `.org-notification-media[data-kind="avatar"]` — `:has()` handles it.
- **Body spans 2 columns when there's no media.** `:not(:has(> .org-notification-media))` keeps the surface balanced. Don't remove this — a single-column body next to an empty media slot looks lopsided.
- **Progress is consumer-driven.** The CSS animates `width`; the brain updates `--_progress`. Pause-on-hover, restart-on-blur, and the timer all live in JS.
- **Close button is bespoke, not an `org-button`.** Its floating absolute positioning and tight footprint don't match Button's geometry. Keep it specialized — but match Button's hover/focus states so it feels familiar.
- **Always supply `aria-label="Dismiss"`** on the close button. The icon is the only label otherwise.
- **`role="status"` or `role="alert"`** on the toast (consumer-decided based on intent). `info` / `safe` / `neutral` use `status`; `danger` / `warning` use `alert` to interrupt screen-reader speech.
- **Reduced-motion still ships the toast.** Only the animation drops; the toast appears and disappears. Don't no-op the entire show/hide.
- Defaults when omitted: `data-color="info"`, `data-show-close="1"` (close visible), no progress bar (omit the element entirely), `data-position="top-right"`.
