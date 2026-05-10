# Tooltip — Implementation Guide

A transient label attached to a trigger. Two layouts:

- **`label`** (default): one-line text, optionally with a trailing `<kbd>` shortcut hint. Used for icon-button labels, truncated names, etc.
- **`rich`**: title + body + optional inline action. For click-mode tooltips that hold a small amount of contextual help.

Surface uses the global inverse surface (`--color-bg-inverse`) — near-black ink in light theme, near-white callout in dark theme. Either way the tooltip is always the highest-contrast pop on the page. Twelve placements (4 sides × 3 alignments).

The `data-placement` attribute controls only the **arrow direction** (and the hairline transform that draws it). Anchor positioning is owned by product code (or a wrapper component) — the tooltip itself is just a self-contained surface.

## Anatomy

```html
<!-- Simple label, top placement -->
<span class="org-tooltip" role="tooltip"
      data-placement="top" data-state="open">
  Save changes
</span>

<!-- Label with keyboard hint -->
<span class="org-tooltip" role="tooltip"
      data-placement="bottom" data-state="open">
  Search
  <kbd class="org-tooltip-kbd">⌘K</kbd>
</span>

<!-- Rich layout (click trigger) -->
<div class="org-tooltip" role="tooltip"
     data-layout="rich" data-placement="right" data-state="open">
  <div class="org-tooltip-title">Two-factor auth</div>
  <p class="org-tooltip-body">
    Adds a second verification step every time you sign in.
  </p>
  <a class="org-tooltip-action" href="#">Learn more</a>
</div>

<!-- Pure-CSS hover/focus pattern (anchor wrapper) -->
<span class="org-tooltip-anchor">
  <button class="org-button" data-icon-only="1" aria-label="Search">…</button>
  <span class="org-tooltip" role="tooltip" data-placement="top">Search</span>
</span>
```

## Root (`.org-tooltip`)

### Internal locals

| Local            | Default                                      |
| ---------------- | -------------------------------------------- |
| `--_pad-x`       | `var(--spacing-tooltip-pad-x-base)`          |
| `--_pad-y`       | `var(--spacing-tooltip-pad-y-base)`          |
| `--_font-size`   | `var(--font-size-tooltip-base)`              |
| `--_tooltip-max-w` | (consumer-set; falls back to `--sizing-tooltip-max-w` for label, `--sizing-tooltip-rich-max-w` for rich) |

### Layout

- `display: inline-flex; align-items: center; gap: var(--spacing-tooltip-gap)`.
- `max-width: var(--_tooltip-max-w, var(--sizing-tooltip-max-w))`.
- `padding: var(--_pad-y) var(--_pad-x)`.
- Surface: `background: var(--color-tooltip-bg); color: var(--color-tooltip-fg); border: var(--border-width-tooltip) solid var(--color-tooltip-border); border-radius: var(--radius-tooltip); box-shadow: var(--shadow-tooltip)`.
- Type: `font-size: var(--_font-size); font-weight: var(--font-weight-tooltip); line-height: var(--line-height-tooltip); text-align: left`.
- `white-space: normal; text-wrap: pretty; word-break: break-word` — tooltips never grow beyond their natural width unless the consumer opts in via `--_tooltip-max-w` or wraps the content.
- `position: relative; z-index: var(--z-index-tooltip); pointer-events: none; user-select: none`.

## Sizes (`data-size`)

`sm` reassigns `--_pad-x`, `--_pad-y`, `--_font-size`, and tightens `gap` to `var(--spacing-1)`. `base` is the default and uses the values above.

## Rich layout (`data-layout="rich"`)

```css
.org-tooltip[data-layout="rich"] {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-tooltip-rich-gap);
  width: max-content;
  max-width: var(--_tooltip-max-w, var(--sizing-tooltip-rich-max-w));
  pointer-events: auto;          /* click triggers — links inside must be clickable */
}
```

### Title (`.org-tooltip-title`)

- `font-size: var(--font-size-tooltip-title); font-weight: var(--font-weight-tooltip-title); line-height: var(--line-height-tooltip); color: var(--color-tooltip-title)`.

### Body (`.org-tooltip-body`)

- `font-size: var(--font-size-tooltip-body); font-weight: regular; line-height: var(--line-height-tooltip-body); color: var(--color-tooltip-body)`.

### Action (`.org-tooltip-action`)

A pointer-active link rendered against the inverse surface. Reads at full inverse fg (no link-blue tint) with a hairline underline so it stays in the tooltip's voice:

```css
.org-tooltip-action {
  margin-top: var(--spacing-tooltip-rich-action-gap);
  color: var(--color-tooltip-title);
  font-size: var(--font-size-tooltip-body);
  font-weight: var(--font-weight-medium);
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-thickness: 1px;
}
.org-tooltip-action:hover { text-decoration-thickness: 2px; }
```

## Keyboard hint (`.org-tooltip-kbd`)

```html
<kbd class="org-tooltip-kbd">⌘K</kbd>
```

A quiet inset pill placed inline after a label. Never bright fill — the shortcut never fights the label:

- `background: var(--color-tooltip-kbd-bg); color: var(--color-tooltip-kbd-fg)`.
- `font-family: var(--font-mono); font-size: var(--font-size-2xs); font-weight: medium; line-height: 1`.
- `border-radius: var(--radius-xs); height: 1.125rem; padding-inline: var(--spacing-1)`.

## Arrow (pseudo-element `::before`)

A 0.5rem × 0.5rem square rotated 45deg, half-overlapping the tooltip body:

```css
.org-tooltip::before {
  content: '';
  position: absolute;
  width: 0.5rem;
  height: 0.5rem;
  background: var(--color-tooltip-bg);
}
.org-tooltip[data-arrow="off"]::before { display: none; }
```

The arrow inherits the tooltip's drop shadow naturally (same stacking context) — no separate shadow rule needed for the seam to look unified.

### Per-side positioning

Each `data-placement^="…"` sets the offset side and rotation:

| Side prefix    | Offset                                             |
| -------------- | -------------------------------------------------- |
| `top-…`        | `bottom: -0.21875rem; transform: rotate(45deg)`    |
| `bottom-…`     | `top: -0.21875rem; transform: rotate(45deg)`       |
| `left-…`       | `right: -0.21875rem; transform: rotate(45deg)`     |
| `right-…`      | `left: -0.21875rem; transform: rotate(45deg)`      |

The `-0.21875rem` (-3.5px) places the diamond's tip just outside the tooltip's edge.

### Per-alignment X / Y

For each side, the perpendicular axis lands by alignment:

- `…-start` → `left` or `top` = `var(--spacing-3)`.
- (no alignment, e.g. `top` / `right`) → centered (`50%` with `-0.25rem` margin).
- `…-end` → `right` or `bottom` = `var(--spacing-3)`.

## State / motion (`data-state`)

`data-state` is **optional** — if a consumer sets it, the tooltip fades and slides 2px toward its trigger:

```css
.org-tooltip[data-state] {
  transition:
    opacity   var(--motion-tooltip-duration) var(--motion-tooltip-ease),
    transform var(--motion-tooltip-duration) var(--motion-tooltip-ease);
}
.org-tooltip[data-state="closed"],
.org-tooltip[data-state="closing"] { opacity: 0; pointer-events: none; }
.org-tooltip[data-state="open"]    { opacity: 1; }
.org-tooltip[data-state="opening"] { opacity: 0; }
```

The slide axis is keyed to placement so motion always reads as "appearing from the trigger":

- `top-*` opening/closed: `translateY(2px)` (slides up to land).
- `bottom-*`: `translateY(-2px)`.
- `left-*`: `translateX(2px)`.
- `right-*`: `translateX(-2px)`.

## Anchor wrapper (`.org-tooltip-anchor`) — optional

A pure-CSS hover/focus pattern. Wrap a trigger in `.org-tooltip-anchor` and place an `.org-tooltip` inside; the tooltip shows on hover/focus of the anchor:

```css
.org-tooltip-anchor {
  position: relative;
  display: inline-flex;
  overflow: visible;
}
.org-tooltip-anchor > .org-tooltip {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  transition: opacity, transform;
}
.org-tooltip-anchor:hover > .org-tooltip,
.org-tooltip-anchor:focus-within > .org-tooltip {
  opacity: 1;
  transition-delay: 200ms;        /* small open delay */
}
```

Each placement has its own absolute-positioning rule — `top` puts `bottom: calc(100% + var(--spacing-tooltip-offset))`; `right` puts `left: calc(100% + …)`; etc. Alignment variants (`-start` / `-end`) anchor to the appropriate corner. The closed transform (small slide toward the trigger) is reset to zero on hover/focus.

Production code typically uses JS positioning instead. The anchor wrapper is for simple cases (icon-only buttons in a sidebar) and the demo page itself.

## Behaviours / rules

- **`role="tooltip"` on the surface, always.** Even if a consumer is rolling their own positioning logic.
- **`data-placement` controls the arrow direction only.** Anchor positioning is product code's job. Don't try to use the placement attribute as a positioning system.
- **Arrow uses surface color and inherits the shadow.** Don't paint it as a separate filter — the seam between body and arrow must look unified, and that requires the arrow being on the same surface fill.
- **Tooltip surface is `pointer-events: none`** for label layout. Rich layout flips to `pointer-events: auto` so the action link can be clicked.
- **Click triggers use `data-layout="rich"`.** Hover triggers use the label layout. Don't put click-targets in label tooltips — they can't be clicked.
- **`data-state` is optional.** Without it, the consumer's positioning script can show/hide the tooltip without a transition. With it, the tooltip fades and slides toward its trigger.
- **Reduced motion: drop the slide.** Keep the fade. The user still needs visual confirmation that something appeared.
- **Anchor wrapper is for simple cases.** For tooltips that need flipping or collision avoidance, use a real positioning library (Floating UI / CDK overlay) and write `data-placement` from JS.
- **`<kbd>` uses the system mono font and a quiet inset pill.** Don't restyle to a brighter fill — the shortcut should never fight the label text.
- **Rich tooltip has `width: max-content` capped by `max-width`.** Gives a stable default the consumer can override via `--_tooltip-max-w` for a custom cap. Don't pin a hard width.
- **Tooltip sits above everything except modals/notifications** (`z-index: var(--z-index-tooltip)`).
- Defaults when omitted: `data-size="base"`, `data-layout="label"`, `data-placement="top"`, no `data-state` (consumer-controlled visibility), arrow on.
