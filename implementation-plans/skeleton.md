# Skeleton — Implementation Guide

A loading placeholder that mimics the shape of the content being loaded. Composed from a small set of primitives so any preset can be assembled without bespoke styling.

Four documented presets — `card`, `card-headless`, `table`, `table-varied` — are exposed as `data-variant` values for consumers that want a single-attribute API.

## Anatomy

- **Host** (`.org-skeleton`): owns `role="status"` / `aria-label`, the outer border-radius, and (when bordered) the surrounding surface frame.
- **Stack** (`.org-skeleton-stack`): vertical column of bars. Owns inter-bar rhythm.
- **Bar** (`.org-skeleton-bar`): a single rectangular placeholder bar. Pulses on its own. Width is consumer-set via inline style or a width-step utility.
- **Block** (`.org-skeleton-block`): a larger rectangular block (the card preset's media region). Pulses too, with the stronger bar tint.

## Authoring shape

```html
<!-- Card preset (16:9 image + title + 2 body bars + footer bar) -->
<div class="org-skeleton" data-variant="card" role="status" aria-label="Loading">
  <div class="org-skeleton-block" data-aspect="media"></div>
  <div class="org-skeleton-stack">
    <div class="org-skeleton-bar" data-height="lg" style="width:60%"></div>
    <div class="org-skeleton-bar"></div>
    <div class="org-skeleton-bar" style="width:80%"></div>
    <div class="org-skeleton-bar" data-height="sm" style="width:40%"></div>
  </div>
</div>

<!-- Card-headless preset (no media block) -->
<div class="org-skeleton" data-variant="card-headless" role="status" aria-label="Loading">
  <div class="org-skeleton-stack">
    <div class="org-skeleton-bar" data-height="lg" style="width:60%"></div>
    <div class="org-skeleton-bar"></div>
    <div class="org-skeleton-bar" style="width:80%"></div>
  </div>
</div>

<!-- Table preset (rows of equal-width bars) -->
<div class="org-skeleton" data-variant="table" role="status" aria-label="Loading">
  <div class="org-skeleton-stack" data-gap="tight">
    <div class="org-skeleton-bar"></div>
    <div class="org-skeleton-bar"></div>
    <div class="org-skeleton-bar"></div>
    <div class="org-skeleton-bar"></div>
    <div class="org-skeleton-bar"></div>
    <div class="org-skeleton-bar"></div>
    <div class="org-skeleton-bar"></div>
  </div>
</div>

<!-- Table-varied preset (staggered widths via data-width) -->
<div class="org-skeleton" data-variant="table-varied" role="status" aria-label="Loading">
  <div class="org-skeleton-stack" data-gap="tight">
    <div class="org-skeleton-bar" data-width="full"></div>
    <div class="org-skeleton-bar" data-width="3/4"></div>
    <div class="org-skeleton-bar" data-width="2/3"></div>
    <div class="org-skeleton-bar" data-width="1/2"></div>
  </div>
</div>
```

## Host (`.org-skeleton`)

### Internal locals

| Local                    | Default                          |
| ------------------------ | -------------------------------- |
| `--_skeleton-radius`     | `var(--radius-lg)`               |
| `--_skeleton-bar-radius` | `var(--radius-sm)`               |
| `--_skeleton-bar-bg`     | `var(--color-skeleton-bar)`      |
| `--_skeleton-frame-bg`   | `var(--color-bg-surface)`        |
| `--_skeleton-frame-pad`  | `var(--spacing-4)`               |

### Layout

- `display: block; position: relative`.
- `border-radius: var(--_skeleton-radius)`.
- Default: **no frame** — `border: var(--border-width-thin) solid transparent; background: transparent`. The bordered variant adds it back.
- `overflow: hidden` — the inner media block's corners clip to the host's radius when the host is bordered.

### Bordered framing

The four named presets are bordered by default. The framing rule fires on:

- `.org-skeleton[data-bordered="1"]`, **or**
- `.org-skeleton[data-variant="card|card-headless|table|table-varied"]:not([data-bordered="0"])`.

When framed:

- `border-color: var(--color-border); background: var(--_skeleton-frame-bg)`.
- `padding: 0` — padding is owned by the inner stack so the media block in `card` can be flush against the host edge.

The frame uses the same surface + border tokens as a Card, so a skeleton sat next to a Card reads as the same kind of object.

## Stack (`.org-skeleton-stack`)

Vertical column of bars. Owns the inter-bar rhythm.

```css
.org-skeleton-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-skeleton-stack);
  padding: var(--spacing-4);
}
.org-skeleton-stack[data-gap="tight"]   { gap: var(--spacing-skeleton-stack-tight); }
.org-skeleton-stack[data-gap="default"] { gap: var(--spacing-skeleton-stack); }
```

- **Default gap** = body-line gap. Used by the card / card-headless presets.
- **Tight gap** = used by the table preset where bars stand in for row separators (denser rhythm).

When the stack sits below a media block, the top padding stays in place to provide breathing room between the block and the bars:

```css
.org-skeleton-block + .org-skeleton-stack {
  padding-top: var(--spacing-4);
}
```

## Bar (`.org-skeleton-bar`)

The atom. A rounded rectangle that pulses.

```css
.org-skeleton-bar {
  display: block;
  width: 100%;
  height: var(--sizing-skeleton-bar-base);
  background: var(--_skeleton-bar-bg);
  border-radius: var(--_skeleton-bar-radius);
  animation: org-skeleton-pulse var(--motion-skeleton-duration) var(--motion-ease-standard) infinite;
}
```

Each bar pulses on its own (no negative `animation-delay`), so the eye reads a calm rhythm rather than a single mass blinking.

### Heights (`data-height`)

| Value          | Maps to                         |
| -------------- | ------------------------------- |
| `sm`           | `var(--sizing-skeleton-bar-sm)` |
| `base` (default)| `var(--sizing-skeleton-bar-base)` |
| `lg`           | `var(--sizing-skeleton-bar-lg)` |

Pick the height to match the line of text the bar stands in for: a heading uses `lg`, body copy uses `base`, footer / metadata uses `sm`.

### Width steps (`data-width`)

A small set of common widths so a presentational layout can be assembled without inline styles:

| Value      | Width      |
| ---------- | ---------- |
| `full`     | 100%       |
| `3/4`      | 75%        |
| `2/3`      | 66.6667%   |
| `1/2`      | 50%        |
| `1/3`      | 33.3333%   |
| `1/4`      | 25%        |

For finer control, pass `style="width: 38%"` directly. Inline styles win over the data attribute.

## Block (`.org-skeleton-block`)

A larger rectangular placeholder for media regions inside the `card` preset (or arbitrary-size blocks). Pulses on the same cadence as bars but uses the **stronger bar tint** (`--color-skeleton-bar-strong`) so it reads as a denser silhouette than the line bars below it.

```css
.org-skeleton-block {
  display: block;
  width: 100%;
  background: var(--color-skeleton-bar-strong);
  border-radius: 0;
  animation: org-skeleton-pulse var(--motion-skeleton-duration) var(--motion-ease-standard) infinite;
}
```

The block has `border-radius: 0` by default — it sits at the top of the card preset, and corners are clipped by the host's `overflow: hidden` to match the host radius. The block's bottom edge meets the bar stack flush.

### Aspect ratios (`data-aspect`)

| Value     | `aspect-ratio`                  |
| --------- | ------------------------------- |
| `media`   | `var(--aspect-skeleton-media)` (16:9) |
| `square`  | `var(--aspect-square)`          |

### Block in unbordered hosts

When the host is **not** bordered, the block needs its own rounding so it doesn't look like a raw rectangle floating on the page:

```css
.org-skeleton[data-bordered="0"] .org-skeleton-block,
.org-skeleton:not([data-bordered]):not([data-variant]) .org-skeleton-block {
  border-radius: var(--_skeleton-bar-radius);
}
```

## Reduced motion

`prefers-reduced-motion: reduce` stops the pulse but keeps the placeholder shape readable as a loading silhouette:

```css
@media (prefers-reduced-motion: reduce) {
  .org-skeleton-bar,
  .org-skeleton-block {
    animation: none;
    opacity: var(--opacity-skeleton-pulse-max);
  }
}
```

Resting at the maximum-opacity frame of the pulse keeps the bars visible — fading to the dim end-state would make the placeholder disappear.

## Behaviours / rules

- **Compose presets from primitives.** The four `data-variant` values are convenience aliases for stacks of the same atoms. If a preset isn't documented, build it from `org-skeleton-block` + `org-skeleton-stack` + `org-skeleton-bar` directly — don't invent a new variant attribute.
- **Each bar pulses on its own.** No `animation-delay`. The placeholder reads as a calm rhythm; staggered delays would make it look like a wave.
- **Block uses the stronger bar tint.** It's the densest silhouette in the placeholder. Don't restyle to match `--color-skeleton-bar` — that would flatten the visual hierarchy.
- **Bordered framing matches Card tokens.** Same `--color-bg-surface`, same `--color-border`. A skeleton next to a Card should read as the same kind of object.
- **Padding lives on the stack, not the host.** When the host is bordered, the host has `padding: 0` so the media block sits flush. The stack carries `padding: var(--spacing-4)`. Don't add padding to the host — the block needs to crash against the host edge.
- **`role="status"` + `aria-label="Loading"`.** Always on the host. Without these, screen readers don't announce the loading state.
- **Reduced motion stops the pulse, not the placeholder.** Bars rest at the max-opacity frame, not transparent. Don't add a rule that hides them entirely.
- **Width via `data-width` OR inline style.** Both work. Inline style wins. The width-step utilities cover the common cases; inline style is for one-offs.
- **Bordered defaults can be opted out.** Set `data-bordered="0"` on the named presets to drop the frame. The block then picks up its own rounding so it doesn't float as a raw rectangle.
- **Aspect ratios on the block, not the host.** The block sets its own `aspect-ratio` via `data-aspect`. The host has no aspect property — its height is determined by its children.
- Defaults when omitted: no frame on bare `.org-skeleton`, framed on the four named variants, `data-gap="default"` on the stack, `data-height="base"` on bars, no `data-aspect` on the block (height = whatever the children give it).
