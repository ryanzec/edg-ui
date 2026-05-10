# File Upload — Implementation Guide

A drag-and-drop file selector with a click-to-open file dialog. Single file. The component is a styled `<label>` wrapping a hidden `<input type="file">` — clicking anywhere in the drop zone opens the native picker; dragging a file activates the hover state; dropping (or picking) replaces the empty-state copy with a selected-file row in-place. State is driven entirely by `data-state` on the root.

## Anatomy

- **Root**: `<label class="org-file-upload" data-state="idle">` (or `data-disabled="1"`).
- **Hidden input**: `<input type="file" class="org-file-upload-input">` — the real `<input type="file">`, visually clipped but still keyboard-accessible (Enter / Space on the label opens the picker).
- **Empty state**: `<span class="org-file-upload-empty">` containing leading icon, prompt, hint.
  - Icon: `<span class="org-icon" data-icon="paperclip" data-context="file-upload"></span>`.
  - Prompt: `<span class="org-file-upload-prompt">Drop a file here, or <span class="org-file-upload-cta">browse</span></span>`.
  - Hint: `<span class="org-file-upload-hint">Accepts PNG, JPG · up to 10MB</span>`.
- **Selected-file row**: `<span class="org-file-upload-file">` — replaces the empty stack 1:1 once a file is picked.
  - Leading icon: `<span class="org-icon" data-icon="paperclip"></span>`.
  - Text stack: `<span class="org-file-upload-file-text">` containing `.org-file-upload-file-name`, `.org-file-upload-file-meta`, and (in upload variants) `<span class="org-file-upload-progress"><span class="org-file-upload-progress-fill" style="--_progress: 0.42"></span></span>`.
  - Remove button: `<button type="button" class="org-file-upload-remove" aria-label="Remove file"><span class="org-icon" data-icon="x"></span></button>`.

## Authoring shape

```html
<label class="org-file-upload" data-state="idle">
  <input type="file" class="org-file-upload-input" />

  <span class="org-file-upload-empty">
    <span class="org-icon" data-icon="paperclip" data-context="file-upload"></span>
    <span class="org-file-upload-prompt">
      Drop a file here, or <span class="org-file-upload-cta">browse</span>
    </span>
    <span class="org-file-upload-hint">Accepts PNG, JPG · up to 10MB</span>
  </span>

  <span class="org-file-upload-file">
    <span class="org-icon" data-icon="paperclip"></span>
    <span class="org-file-upload-file-text">
      <span class="org-file-upload-file-name">design-spec.pdf</span>
      <span class="org-file-upload-file-meta">PDF · 2.4 MB</span>
      <span class="org-file-upload-progress">
        <span class="org-file-upload-progress-fill" style="--_progress: 0.65"></span>
      </span>
    </span>
    <button type="button" class="org-file-upload-remove" aria-label="Remove file">
      <span class="org-icon" data-icon="x"></span>
    </button>
  </span>
</label>
```

Both the empty and the selected-file blocks live in the markup; CSS toggles which one is visible based on `data-state`.

## States (`data-state` on the root)

Brain owns idle / hover / selected / error. Uploading / success / failure are visual mocks for hosts that wrap their own progress.

| State        | Visible block | Border + bg ramp | Notes |
| ------------ | ------------- | ---------------- | ----- |
| `idle` (default) | empty       | default border, surface-2 bg | resting affordance |
| `hover`      | empty         | info-tinted border + bg, info-tinted icon | drag-over |
| `selected`   | file row      | default border, surface-2 bg | file picked, no upload pipeline |
| `uploading`  | file row + progress | default | progress fill = primary |
| `success`    | file row + filled progress | default | progress fill = safe; meta text = safe |
| `failure`    | file row + filled progress | default | progress fill = danger; meta text = danger |
| `error`      | empty         | danger-tinted border + bg, danger icon | hint text recolored to danger; user hasn't successfully picked |
| _(disabled)_ | via `data-disabled="1"` or `aria-disabled="true"` | default | `opacity: var(--opacity-disabled); cursor: not-allowed; pointer-events: none` |

## Hidden native input

```css
.org-file-upload-input {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

Clipped, not `display: none` — keyboard activation must still flow through it.

## Root drop zone (`.org-file-upload`)

- `display: flex; align-items: stretch; justify-content: center`.
- `min-height: var(--sizing-file-upload-min-h)` (`6.5rem` — drop zone resting height).
- `padding: var(--spacing-file-upload-pad-y) var(--spacing-file-upload-pad-x)` (both `20px`).
- `background: var(--_bg)`, `border: var(--border-width-file-upload) var(--border-style-file-upload) var(--_border)` (1px **dashed** by default, picked deliberately so the rim reads as a target rather than a pill control).
- `border-radius: var(--radius-file-upload)` (md).
- `color: var(--color-file-upload-prompt); cursor: pointer; user-select: none`.
- Internal locals:
  - `--_bg: var(--color-file-upload-bg)` — surface-2 by default.
  - `--_border: var(--color-file-upload-border)` — default border.
  - `--_icon: var(--color-file-upload-icon)` — fg-muted by default.
- Transition: `background`, `border-color`, `color` over `var(--motion-file-upload-duration)` with `var(--motion-ease-standard)`.
- `:focus-within` lifts `box-shadow: var(--shadow-focus-ring)` (the hidden input drives keyboard focus into here).

### Selected / uploading / success / failure padding shrink

Once a file is picked, the row carries its own padding — the surface tightens up:

```css
.org-file-upload[data-state="selected"],
.org-file-upload[data-state="uploading"],
.org-file-upload[data-state="success"],
.org-file-upload[data-state="failure"] {
  padding: var(--spacing-2);
  min-height: 0;
}
```

## Empty state (`.org-file-upload-empty`)

- `display: flex; flex-direction: column; align-items: center; justify-content: center`.
- `gap: var(--spacing-file-upload-stack)` (`8px`); `width: 100%; text-align: center`.
- Leading icon: `--_size: var(--sizing-file-upload-icon)` (icon-3xl, `30px`); `--_color: var(--_icon)`. `margin-bottom: calc(var(--spacing-file-upload-icon-gap) - var(--spacing-file-upload-stack))` so the icon reads as a lead, not a peer of the prompt.
- Icon transitions `color` so the dragover state can recolor the glyph in lockstep with the border.
- Prompt: `font-size: var(--font-size-file-upload-prompt)` (base, 14px); `font-weight: var(--font-weight-file-upload-prompt)` (medium); `line-height: var(--line-height-normal); color: var(--color-file-upload-prompt)`.
- CTA span (`.org-file-upload-cta`) — the "browse" word styled like a link: `color: var(--color-link); text-decoration: underline; text-underline-offset: 0.15em`. The whole label is clickable; the underline just signals it.
- Hint: `font-size: var(--font-size-file-upload-hint)` (sm); `color: var(--color-file-upload-hint)` (fg-muted).

## Selected-file row (`.org-file-upload-file`)

Three columns: leading icon · name + meta stack (with optional progress under) · remove button.

- `display: none` by default; revealed by `data-state="selected" | "uploading" | "success" | "failure"`.
- When shown: `display: flex; align-items: center; gap: var(--spacing-file-upload-row-gap)` (`10px`); `width: 100%; padding: var(--spacing-file-upload-row-pad-y) var(--spacing-file-upload-row-pad-x)`; `text-align: start`.
- Leading icon: `--_size: var(--sizing-file-upload-row-icon)` (icon-xl, `20px`); `flex-shrink: 0; --_color: var(--_icon)`.
- Text stack `.org-file-upload-file-text`: `display: flex; flex-direction: column; gap: var(--spacing-0_5); flex: 1; min-width: 0`.
- Name: `font-size: var(--font-size-file-upload-file-name)` (base); `font-weight: var(--font-weight-file-upload-file-name)` (medium); `color: var(--color-file-upload-file-name)`. `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` so long filenames truncate.
- Meta: `font-size: var(--font-size-file-upload-file-meta)` (xs); `color: var(--color-file-upload-file-meta)` (fg-faint). `font-variant-numeric: tabular-nums` so size readouts don't jitter.

## Progress bar (`.org-file-upload-progress`)

- `display: none` by default; revealed in `uploading | success | failure`.
- Geometry: `width: 100%; height: var(--sizing-file-upload-progress-h)` (`4px`); `background: var(--color-file-upload-progress-track)`; `border-radius: var(--radius-pill); overflow: hidden; margin-top: var(--spacing-1)`.
- Fill: `display: block; height: 100%; width: calc(var(--_progress, 0) * 100%); background: var(--color-file-upload-progress-fill); border-radius: inherit`. Drive `--_progress` (0–1) inline.
- `transition: width var(--motion-duration-slow) var(--motion-ease-standard)`.

State remaps the fill color:

```css
.org-file-upload[data-state="success"] .org-file-upload-progress-fill { background: var(--color-file-upload-progress-fill-success); }
.org-file-upload[data-state="failure"] .org-file-upload-progress-fill { background: var(--color-file-upload-progress-fill-error); }
```

And tints the meta line in lockstep:

```css
.org-file-upload[data-state="success"] .org-file-upload-file-meta { color: var(--color-safe); }
.org-file-upload[data-state="failure"] .org-file-upload-file-meta { color: var(--color-danger); }
```

The geometry stays identical across the three states.

## Remove button (`.org-file-upload-remove`)

- `appearance: none; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0`.
- `width / height: var(--sizing-control-sm)` (`24px`); `border: 0; border-radius: var(--radius-sm); background: transparent`.
- Resting `color: var(--color-fg-muted)`.
- Hover: `background: var(--color-bg-hover); color: var(--color-danger)` — destructive intent reads on hover only.
- `:focus-visible: outline: none; box-shadow: var(--shadow-focus-ring)`.
- Inner icon: `--_size: var(--sizing-icon-base); --_color: currentColor`.
- Transitions `background` and `color` over `var(--motion-duration-fast)`.

## State ramps

### Hover (drag-over)

```css
.org-file-upload[data-state="hover"] {
  --_bg:     var(--color-file-upload-bg-hover);    /* info-soft */
  --_border: var(--color-file-upload-border-hover); /* info */
  --_icon:   var(--color-file-upload-icon-hover);   /* info */
}
```

### Error

```css
.org-file-upload[data-state="error"] {
  --_bg:     var(--color-file-upload-bg-error);
  --_border: var(--color-file-upload-border-error);
  --_icon:   var(--color-file-upload-icon-error);
}
.org-file-upload[data-state="error"] .org-file-upload-hint { color: var(--color-danger); }
```

The empty state stays visible — the user hasn't successfully picked a file. The hint copy is recolored by the consumer to carry the actual error message.

## Behaviours / rules

- **Real `<label>` wrapping a real `<input type="file">`.** Don't replace either. The label is the drop zone; the input is the keyboard-accessible activator. Visually clip the input — never `display: none` it.
- **Empty and file blocks both live in the DOM.** CSS toggles which is visible via `data-state`. Don't conditionally render — the brain just flips an attribute.
- **Dashed rim is intentional.** It signals "drop target", not "form control". Don't switch it to solid.
- **Hover state is a drag-over signal**, not a CSS `:hover`. The brain stamps `data-state="hover"` on `dragenter` and clears it on `dragleave` / `drop`. CSS `:hover` is unused for this affordance.
- **Progress is opt-in.** The bar is `display: none` until `uploading | success | failure`. Fill width is driven by `--_progress` set inline; geometry never changes between states.
- **Single file only.** No multi-file row stack — the spec is one file at a time.
- **Remove button reads danger on hover only.** Resting state is fg-muted so the row doesn't shout "destructive" before the user reaches for it.
- Defaults when omitted: `data-state="idle"`. The full markup (empty + file row) lives even in idle — CSS handles the show/hide.
