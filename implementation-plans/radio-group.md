# Radio Group — Implementation Guide

Vertical stack of `org-radio` options with an optional legend + description. The group owns the inter-option rhythm and the legend rhythm above the options. It does **not** own each option's visual treatment — every `org-radio` inside renders itself.

Per agreed spec, **vertical layout only**. Horizontal radio rows are the responsibility of a future SegmentedControl primitive.

## Anatomy

```html
<fieldset class="org-radio-group" data-size="base">
  <div class="org-radio-group-header">
    <legend class="org-radio-group-legend" data-required="1">Plan</legend>
    <p class="org-radio-group-description">Pick the tier that fits your team.</p>
  </div>

  <div class="org-radio-group-options">
    <label class="org-radio">
      <input class="org-radio-native" type="radio" name="plan" value="free" checked />
      <span class="org-radio-indicator"></span>
      <span class="org-radio-body">
        <span class="org-radio-label">Free</span>
        <span class="org-radio-description">Up to 3 projects.</span>
      </span>
    </label>

    <label class="org-radio">
      <input class="org-radio-native" type="radio" name="plan" value="pro" />
      <span class="org-radio-indicator"></span>
      <span class="org-radio-body">
        <span class="org-radio-label">Pro</span>
        <span class="org-radio-description">Unlimited projects + team workspaces.</span>
      </span>
    </label>
  </div>
</fieldset>
```

The root is a real `<fieldset>` so the legend is announced by assistive tech. The stylesheet zeroes its native chrome.

## Root (`.org-radio-group`)

### Internal locals

| Local                  | Default                              |
| ---------------------- | ------------------------------------ |
| `--_rg-group-stack`    | `var(--spacing-choice-group-stack)`  |
| `--_rg-group-desc-gap` | `var(--spacing-choice-group-desc)`   |
| `--_rg-stack`          | `var(--spacing-choice-stack-base)`   |

### Geometry

- `display: flex; flex-direction: column; gap: var(--_rg-group-stack)` — the gap separates the header block from the options block.
- `font-family: var(--font-sans); color: var(--color-fg)`.
- `border: 0; margin: 0; padding: 0; min-width: 0` — kill the default `<fieldset>` chrome so the group reads as a plain stack.

## Header (`.org-radio-group-header`)

- `display: flex; flex-direction: column; gap: var(--_rg-group-desc-gap)`.
- Holds the legend and (optional) description as a tight pair.

### Legend (`.org-radio-group-legend`)

- `font-size: var(--font-size-choice-legend); font-weight: var(--font-weight-semibold); line-height: var(--line-height-tight); color: var(--color-fg); margin: 0; padding: 0`.
- **Required marker** (`data-required="1"`): trailing `*` in danger color via `::after`, with a small left margin (`var(--spacing-0_5)`).

### Description (`.org-radio-group-description`)

- `font-size: var(--font-size-form-field-hint); color: var(--color-fg-muted); line-height: var(--line-height-normal)`.

## Options (`.org-radio-group-options`)

- `display: flex; flex-direction: column; gap: var(--_rg-stack); min-width: 0`.
- The `min-width: 0` is essential — without it, long labels would force the group wider than its container.

## Sizes (`data-size`)

`data-size` on the group cascades to each child Radio for indicator + label scaling. **The inter-option gap stays constant across sizes** — the rhythm of the stack is independent of indicator scale, so a denser group never reads as "looser" just because the dots got smaller.

The cascade is implicit: each child Radio reads its own `data-size`. The convention is to set it once on the group and let the consumer rendering loop forward it; the stylesheet doesn't do the cascade itself.

## Card-variant tightening

When the children are cards, the gap auto-increases via `:has()` so the tiles don't feel like a single welded surface:

```css
.org-radio-group:has(.org-radio[data-variant="card"]) {
  --_rg-stack: var(--spacing-2);
}
```

Card spacing stays uniform across sizes for the same reason as the default variant.

## Error state (`data-state="error"`)

When the group is in error, every child radio that doesn't already carry its own `data-state` inherits the error indicator border:

```css
.org-radio-group[data-state="error"] .org-radio:not([data-state]) {
  --_radio-border-color: var(--color-danger);
  --_radio-border-color-hover: var(--color-danger);
}
```

The legend's required-asterisk color stays as-is — the error is a separate signal carried in a sibling FormField message. Don't change the legend on error.

## Disabled state (`data-disabled="1"`)

Cascades to children that don't already opt out via `data-disabled="0"`:

```css
.org-radio-group[data-disabled="1"] .org-radio:not([data-disabled="0"]) {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}
.org-radio-group[data-disabled="1"] .org-radio:not([data-disabled="0"]) .org-radio-native {
  pointer-events: none;
}
```

The opt-out branch (`data-disabled="0"`) lets a single option stay enabled inside an otherwise-disabled group — rare, but it's the documented escape hatch.

## Behaviours / rules

- **Vertical only.** Don't add a horizontal layout. Horizontal segmented choices are a future SegmentedControl primitive.
- **Real `<fieldset>` + `<legend>`.** Native a11y semantics — assistive tech announces the legend when focus enters the group. Stylesheet zeroes the default chrome so it reads as a plain stack.
- **Inter-option gap is constant across sizes.** Don't re-scale the gap with `data-size`. Density should change indicator size, not vertical rhythm.
- **Card spacing widens via `:has()`.** Modern browsers handle it automatically. No manual variant attribute on the group.
- **Group error → child border via custom-property override.** The group reaches into each child Radio's `--_radio-border-color` local. This is the documented cross-component channel; don't paint child borders directly with descendant selectors.
- **Group disabled has an opt-out.** A child with `data-disabled="0"` stays interactive even inside a disabled group. Don't remove this branch.
- **Required marker lives on the legend, not the radios.** Setting `data-required="1"` on individual radios doesn't make sense — the group is what's required. Set it on the legend.
- **Description sits below the legend, above the options.** Not between them. Long-form helper copy should be a sibling of the legend in the header block, not interleaved with options.
- **Group has no chrome.** No background, no border, no padding. Visual framing is the FormField's or Card's job.
- Defaults when omitted: `data-size="base"`, no error, not required, not disabled, no description.
