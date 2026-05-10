# Last Updated — Implementation Guide

A small "as of HH:MM" line that pairs an indicator dot (or a refresh button, or a loading spinner) with a label + timestamp. Sits next to data — beside a chart title, in a table footer, on a dashboard card. Tightly subordinate; the data is the point, this just stamps it.

## Anatomy

- **Root**: `<span class="org-last-updated" data-state="fresh|stale|error|loading">`.
- **Leading slot** (one of three, mutually exclusive):
  - `<span class="org-indicator">` (default) — the standard indicator dot, tinted by data-state via the `data-color` it carries.
  - `<button class="org-last-updated-refresh" type="button" aria-label="Refresh"><span class="org-icon" data-icon="refresh"></span></button>` — when the slot is interactive.
  - `<span class="org-last-updated-spinner"><span class="org-loading-spinner"></span></span>` — replaces the dot while `data-state="loading"`.
- **Label**: `<span class="org-last-updated-label">Updated</span>`.
- **Time**: `<time class="org-last-updated-time" datetime="2026-05-09T14:32">2:32 PM</time>`.

## Authoring shape

```html
<span class="org-last-updated" data-state="fresh">
  <span class="org-indicator" data-color="safe"></span>
  <span class="org-last-updated-label">Updated</span>
  <time class="org-last-updated-time" datetime="2026-05-09T14:32">2:32 PM</time>
</span>

<!-- With refresh button -->
<span class="org-last-updated" data-state="stale">
  <button type="button" class="org-last-updated-refresh" aria-label="Refresh">
    <span class="org-icon" data-icon="refresh"></span>
  </button>
  <span class="org-last-updated-label">Updated</span>
  <time class="org-last-updated-time">14m ago</time>
</span>

<!-- Loading -->
<span class="org-last-updated" data-state="loading">
  <span class="org-last-updated-spinner"><span class="org-loading-spinner"></span></span>
  <span class="org-last-updated-label">Updating…</span>
</span>
```

## Root container

- `display: inline-flex; align-items: center; gap: var(--spacing-last-updated-gap)` (`6px`) between slot and label-cluster.
- `font-family: inherit; font-size: var(--font-size-last-updated)` (sm, `13px`); `font-weight: var(--font-weight-last-updated)` (regular).
- `line-height: var(--line-height-tight); white-space: nowrap`.
- No background, no border, no padding — just a row of inline pieces.

## Label + time cluster

- The label and time share their own tighter gap: `var(--spacing-last-updated-label-gap)` (`4px`). Implemented either as an inner `<span>` flex wrapper, or by giving the time its own `margin-inline-start` of the label gap. The visual goal is "Updated 2:32 PM" reads as one phrase, separated from the leading dot/button by a slightly larger gap.
- `.org-last-updated-label`: `color: var(--color-last-updated-label)` (fg-muted).
- `.org-last-updated-time`: `color: var(--color-last-updated-time)` (full fg); `font-weight: var(--font-weight-last-updated-time)` (medium); `font-variant-numeric: tabular-nums` so digits don't jitter as the minute ticks.

## States (`data-state` on the root)

| State     | Indicator color | Label color                                | Notes |
| --------- | --------------- | ------------------------------------------ | ----- |
| `fresh`   | `safe`          | `--color-last-updated-label` (fg-muted)    | default; clean read |
| `stale`   | `caution`       | `--color-last-updated-label-stale`         | label tints to caution so the warning is unmissable |
| `error`   | `danger`        | `--color-last-updated-label-error`         | label tints to danger; replace timestamp with an error message at consumer's discretion |
| `loading` | —               | inherits; spinner replaces the dot         | use `--color-last-updated-loading` (info) on the spinner |

The root toggles which leading slot is shown — when `data-state="loading"`, the dot or refresh button is hidden and `.org-last-updated-spinner` is revealed (handled by simple `display` swaps in CSS keyed off `data-state`).

## Refresh button (`.org-last-updated-refresh`)

- `width / height: var(--sizing-last-updated-refresh)` (`24px`); `border: 0; background: transparent; border-radius: var(--radius-last-updated-refresh)` (sm).
- Color resting `var(--color-last-updated-refresh)` (fg-muted); hover `var(--color-last-updated-refresh-hover)` (full fg) with `background: var(--color-bg-hover)`.
- Icon inside: `--_size: var(--sizing-last-updated-refresh-icon)` (sm, `13px`); `--_color: currentColor`.
- Focus ring: `box-shadow: var(--shadow-focus-ring)` on `:focus-visible`. Disabled: standard `opacity: var(--opacity-disabled); cursor: not-allowed; pointer-events: none`.

## Spinner slot (`.org-last-updated-spinner`)

- A bare wrapper that hosts an `org-loading-spinner` sized to `var(--sizing-last-updated-spinner)` (`12px` — one notch smaller than the refresh icon so the optical weight matches the indicator dot it replaces).
- `color: var(--color-last-updated-loading)` (info) — the spinner inherits via currentColor.

## Behaviours / rules

- **No surface.** No `background`, no `border`, no `padding`. The component sits inside whatever box already exists; it does not paint chrome.
- **One leading slot at a time.** The dot, refresh button, and spinner are mutually exclusive — driven by `data-state` (and by the consumer including the appropriate node).
- **Indicator is the standard `org-indicator`** — never a freshly drawn dot. Tint by setting `data-color` on the indicator (`safe` / `caution` / `danger`).
- **Loading replaces the dot, not the label.** The "Updated" copy stays put; only the leading glyph swaps.
- **Tabular numerals** on the time so a "1:09 → 1:10" tick doesn't shift the layout.
- Defaults when omitted: `data-state="fresh"`, indicator with `data-color="safe"`. The label string ("Updated") is plain text — pluralization, "ago" formatting, and locale all live with the consumer.
