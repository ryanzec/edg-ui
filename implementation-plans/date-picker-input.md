# Date Picker Input — Implementation Guide

A date-input form field — an `org-input` trigger with a leading calendar icon, anchored to a popover that hosts an `org-calendar`. Single date or range. The field shell, focus ring, and disabled treatment are all Input's; the popover surface and motion are paired with the Calendar inside it. The Date Picker stylesheet only owns the trigger's leading-icon column and the popover's anchored placement.

## Anatomy

- **Anchor wrapper**: `<span class="org-overlay-menu-anchor org-date-picker-anchor">` — owns absolute positioning of the popover under the trigger.
- **Trigger**: a real `org-input` with `org-date-picker-input` added; `role="combobox"`, `aria-haspopup="dialog"`, `aria-expanded`, `data-state="open|closed"`.
- **Trigger inner pieces**:
  - `<span class="org-date-picker-input-icon"><span class="org-icon" data-icon="calendar" data-context="input"></span></span>` — leading column.
  - `<span class="org-date-picker-input-value">May 9, 2026</span>` — the displayed value or placeholder.
  - Optional clear button at the trailing edge (a real `org-button`, ghost neutral, sm).
- **Popover**: `<div class="org-date-picker-popover" role="dialog" data-state="open|closed">` wrapping a real `<div class="org-calendar">…</div>` (and optionally a footer with Apply / Cancel buttons in range mode).

## Authoring shape

```html
<span class="org-overlay-menu-anchor org-date-picker-anchor">
  <button class="org-input org-date-picker-input" data-state="closed" type="button"
          role="combobox" aria-haspopup="dialog" aria-expanded="false">
    <span class="org-date-picker-input-icon">
      <span class="org-icon" data-icon="calendar" data-context="input"></span>
    </span>
    <span class="org-date-picker-input-value">May 9, 2026</span>
  </button>

  <div class="org-date-picker-popover" role="dialog" data-state="closed">
    <div class="org-calendar">…</div>
  </div>
</span>
```

## Trigger (`org-date-picker-input`)

- Composes `org-input` — height, font, border, focus ring, hover/focus border-color, disabled opacity all come from Input. The Date Picker stylesheet only adds the leading icon column and the chevron-less trailing edge.
- `display: flex; align-items: center; gap` between the icon column and the value. The Input's `padding-inline-start` is overridden so the icon has its own inset rather than competing with Input's default left padding.
- `cursor: pointer; text-align: start`.
- The value `.org-date-picker-input-value` at full fg when filled, `var(--color-fg-faint)` when showing the placeholder (`[data-placeholder="1"]`).
- The leading icon column `.org-date-picker-input-icon`: `flex: 0 0 auto; color: var(--color-fg-muted); display: inline-flex; align-items: center; justify-content: center`. Inner icon at the standard input-context size.
- When `[data-state="open"]`: the trigger picks up the same focus ring it gets on `:focus-visible` so the open relationship is visible without a second visual mechanism.

## Popover (`.org-date-picker-popover`)

- `position: absolute; top: 100%; left: 0; z-index: var(--z-index-popover)`; `margin-top: var(--spacing-date-picker-anchor-gap)` (`4px` — same hugging gap as Combobox + OverlayMenu, so a row of mixed triggers anchors at identical rhythm).
- The popover is **just a wrapper** — no surface, no border, no shadow of its own. The Calendar inside it paints those. Wrapper exists only to host the anchor offset and the open/closed motion.
- `border-radius: var(--radius-date-picker-popover)` matches the calendar surface radius so the popover's clip mask doesn't fight the calendar's own corners.
- `box-shadow: var(--shadow-date-picker-popover)` (md) — applied at the wrapper level so the shadow doesn't get clipped by the calendar's own internal radius. (Yes, there's a thin redundancy with the Calendar's surface — accepted because the wrapper is the one element that owns the lift while the popover is open.)
- Reveal motion: `opacity 0 → 1`, `transform: translateY(2px) → 0`. Duration `var(--motion-date-picker-duration)` (fast); easing entrance/standard. Closed state lives at `[data-state="closed"]` (display none or opacity 0 + pointer-events none — the brain owns the DOM lifecycle, the stylesheet just has to make both states paintable).
- `prefers-reduced-motion`: zero out the `transition-duration` and the `transform` translation; keep the fade only.

## Range mode

- The trigger value reads `"May 9 – May 16, 2026"`. No additional class on the trigger — same `.org-date-picker-input-value` slot, the calendar inside the popover handles its own range-selection model.
- A footer row with Apply / Cancel sits beneath the calendar inside the popover when consumers need a deliberate-confirm pattern. Real `org-button`s, gap from `var(--spacing-2)`, right-aligned. Calendar above; footer at the bottom; standard column layout.

## Behaviours / rules

- **Composed, not redrawn.** Trigger = real `org-input` plus a leading-icon column. Calendar = real `org-calendar`. Popover wrapper exists for one reason: anchor offset + motion. Don't repaint Input chrome or Calendar chrome from inside the date picker stylesheet.
- **Same anchor gap as Combobox / OverlayMenu** (`--spacing-combobox-anchor-gap`, aliased through `--spacing-date-picker-anchor-gap`). A row of mixed triggers must line up under their popovers.
- **Trigger value placeholder is opt-in** via `[data-placeholder="1"]` on `.org-date-picker-input-value`; reads at `--color-fg-faint`.
- The popover never grows past the Calendar's intrinsic width — the wrapper is `width: max-content` so it sits flush around the calendar surface.
- Defaults when omitted: `data-state="closed"`, single-date mode, no clear button, no footer.
