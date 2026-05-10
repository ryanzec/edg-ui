# TimeInput — Implementation Guide

A time-picking field. The trigger is an `org-input` shell that carries `data-time-input="1"` so its inner track hosts three (12-hour) or two (24-hour) selectable segments — `hh`, `mm`, and the optional `am/pm` — instead of a free-text native input. The user clicks a segment to focus it, then types digits / arrows / `A`·`P` keys to mutate the value. The shell owns every other piece of chrome an Input does: height, padding, border, focus border, validity, disabled, readonly, leading + trailing slots.

This file owns only the small surface area TimeInput adds on top of Input.

## What TimeInput owns vs. inherits

**Owned by TimeInput:**

1. The segmented track layout — three segments, a literal `:` between hh and mm, a small fixed space between mm and am/pm.
2. The selected-segment highlight band that paints behind the segment carrying focus.
3. The placeholder ghost — the dashes that render when no value is set so the field reads as time-shaped at rest.
4. A click-target cursor override on the inner segments so the field reads as "click a segment" rather than "type into a text box".

**Inherited from Input shell:** height, padding, border, focus-ring/border, validity, disabled, readonly, leading + trailing slots, slot icons via `org-icon[data-context="input"]`.

## What TimeInput composes

- `org-input` — the trigger shell (height, padding, border, focus, validity, slots).
- `org-icon` — leading clock glyph in the leading slot (uses `data-context="input"`, no extra rule needed).

## Anatomy

```html
<div class="org-input"
     data-time-input="1"
     data-has-leading="1"
     data-focused="1"
     data-readonly="0">

  <span class="org-input-leading">
    <span class="org-icon" data-icon="clock" data-context="input"></span>
  </span>

  <div class="org-input-track">
    <span class="org-time-input-segment" data-segment="hh" data-selected="1">11</span>
    <span class="org-time-input-separator">:</span>
    <span class="org-time-input-segment" data-segment="mm" data-empty="1">--</span>
    <span class="org-time-input-segment" data-segment="meridiem">AM</span>
  </div>
</div>
```

## Track override

The Input shell already exposes `.org-input-track` as the flex row between the leading and trailing slots; for TimeInput the track hosts the three segments + the literal separators.

```css
.org-input[data-time-input="1"] {
  cursor: default;             /* not "type here" — segments are click targets */
}
.org-input[data-time-input="1"] .org-input-track {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0;
  padding-inline: var(--spacing-control-base-x);
  font-variant-numeric: tabular-nums;   /* "11" and "00" same width */
  min-width: 0;
}
```

### Track-level locals

| Local                  | Default                                       |
| ---------------------- | --------------------------------------------- |
| `--_segment-bg-active` | `var(--color-time-input-segment-active-bg)`   |
| `--_segment-fg-active` | `var(--color-time-input-segment-active-fg)`   |
| `--_separator-fg`      | `var(--color-time-input-separator)`           |
| `--_segment-pad-x`     | `var(--spacing-time-input-segment-x)`         |
| `--_segment-gap`       | `var(--spacing-time-input-segment-gap)`       |
| `--_meridiem-gap`      | `var(--spacing-time-input-meridiem-gap)`      |
| `--_segment-radius`    | `var(--radius-time-input-segment)`            |
| `--_segment-duration`  | `var(--motion-time-input-duration)`           |

### Slot interaction with the track

When a leading slot is present the slot owns the start padding, so the track drops it (mirrors Input's own `[data-has-leading="1"] .org-input-native` rule). Same on the trailing side.

```css
.org-input[data-time-input="1"][data-has-leading="1"]  .org-input-track { padding-inline-start: var(--spacing-1_5); }
.org-input[data-time-input="1"][data-has-trailing="1"] .org-input-track { padding-inline-end:   var(--spacing-1_5); }
```

## Segments (`.org-time-input-segment`)

Each segment is a small button-shaped span sized to comfortably hold its content (two tabular digits or "AM"/"PM"). Selection is a single attribute — `data-selected="1"` — set by the consumer when the segment is focused for keyboard input. The highlight band sits on the segment's own background; **no extra DOM**.

- `display: inline-flex; align-items: center; justify-content: center`.
- `border-radius: var(--_segment-radius); color: inherit; background: transparent`.
- `cursor: pointer; user-select: none`.
- `line-height: var(--line-height-tight)` — match the field so the segment doesn't push the track taller than the shell.
- Transitions on `background` and `color` (motion-base).
- `:focus-visible { outline: none; }` — the highlight band is the only focus signal.

### Meridiem segment (`data-segment="meridiem"`)

- `min-width: var(--sizing-time-input-segment-meridiem)`.
- `letter-spacing: var(--letter-spacing-wide)` — "AM" / "PM" reads in caps; the wide tracking matches the rest of the system's short-caps treatment so the two letters don't cluster.
- `margin-inline-start: calc(var(--_meridiem-gap) - var(--_segment-gap))` — larger gap before the meridiem segment so AM/PM reads as its own piece of the value, not as part of the minutes.

### Selected highlight

The "this segment is taking your keystrokes" band. **Only paints when the field itself is focused** — an unfocused field shows no highlight even if a segment carries `data-selected="1"`.

```css
.org-input[data-focused="1"] .org-time-input-segment[data-selected="1"] {
  background: var(--_segment-bg-active);
  color: var(--_segment-fg-active);
}
```

### Empty / placeholder ghost (`data-empty="1"`)

When a segment carries no value yet, its glyph is the placeholder dashes (or, for the meridiem segment, the field's placeholder character).

- `color: var(--color-fg-faint)` — reads as ghost text, same tone an Input's `::placeholder` uses.
- A **selected empty** segment in a focused field gets a stronger tone so the dashes read as "you're about to type here":
  ```css
  .org-input[data-focused="1"] .org-time-input-segment[data-empty="1"][data-selected="1"] {
    color: var(--color-fg-muted);
  }
  ```

## Separators (`.org-time-input-separator`)

The `:` between hh and mm. Bare span — doesn't take focus, isn't a click target, just sits in the flex row.

- `color: var(--_separator-fg); user-select: none; pointer-events: none`.
- `line-height: var(--line-height-tight)` — pulls the colon's optical centre back onto the row (Inter's `:` sits a touch high relative to digits at this size).

## State inheritance

- **Disabled:** the Input shell's `data-disabled="1"` already drops opacity and `pointer-events` for the whole field — flows through to segments without an extra rule.
- **Readonly:** `.org-input[data-readonly="1"] .org-time-input-segment { cursor: default; }` — the affordance reads as "this is the value, not a control". Segments stay focusable-as-data.
- **Error / focus border / hover bg:** all owned by the Input shell. Nothing TimeInput-specific.

## Behaviours / rules

- **TimeInput is an Input variant, not a peer.** The shell IS an `.org-input` with `data-time-input="1"` — height, padding, border, focus border, validity, disabled, readonly, slots all come from Input's own rules. Don't duplicate them.
- **Cursor flips to `default` on the shell.** Hover over the empty space between segments doesn't read as "type here". Hover over a segment itself flips back to `pointer` (the segment rule wins).
- **`tabular-nums` on the track is structural.** Without it, "11" is wider than "00" and the highlight band wobbles between values.
- **Highlight only paints when the field is focused.** `data-selected="1"` alone is not enough; the parent must carry `data-focused="1"`. An unfocused field with selection state shows no band.
- **Meridiem gap is computed.** `margin-inline-start: calc(--_meridiem-gap - --_segment-gap)` — the gap token is the *visual* space; the calc accounts for whatever inter-segment gap the track already provides. Don't hard-code a margin.
- **Segments don't wrap.** A time value is a single visual unit. `flex-wrap: nowrap` on the track + `min-width: 0` enforces that.
- **No extra DOM for the highlight.** The segment's own `background` is the band. Don't introduce a pseudo-element for it.
- **Separators are pointer-inert.** `pointer-events: none` so clicking the colon doesn't try to focus a non-existent control.
- Defaults when omitted: 12-hour layout (3 segments + colon + meridiem). For 24-hour, drop the meridiem segment from markup; the track's flex layout doesn't care.
