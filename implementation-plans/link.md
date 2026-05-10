# Link — Implementation Guide

Inline link primitive. Renders as a real `<a>` (or `<span>` when disabled). Inherits font-size and font-weight from the surrounding text — there are no explicit size variants. Auto-injects a trailing affordance icon for `target="_blank"` and `download` links unless suppressed.

## Anatomy

- **Root**: `<a class="org-link" href="…" target="…" download data-no-affordance="1">` — or `<span class="org-link" data-disabled="1">` when disabled.
- **Inline icon child** (optional): `<span class="org-icon" data-context="link" data-pos="leading|trailing">`.
- **Auto-injected trailing icon**: when `target="_blank"` or `[download]` is present, the painter adds a single trailing `org-icon` automatically. Suppressed by `data-no-affordance="1"` or by an existing trailing icon.

## Authoring shape

```html
<a class="org-link" href="/settings">Settings</a>

<a class="org-link" href="https://example.com" target="_blank" rel="noopener">
  External docs
</a>

<a class="org-link" href="/file.pdf" download>Download PDF</a>

<a class="org-link" href="/help">
  <span class="org-icon" data-icon="help" data-context="link" data-pos="leading"></span>
  Get help
</a>

<a class="org-link">Quick action</a>             <!-- no href = action link -->

<span class="org-link" data-disabled="1">Locked</span>
```

## Root (`.org-link`)

- `font: inherit` — picks up the surrounding text's font, size, and weight.
- `color: var(--color-link); text-decoration: none; cursor: pointer; display: inline`.
- Underline lives in the `text-decoration` channel so it tracks descenders correctly when the link wraps onto multiple lines:
  - `text-decoration-line: underline; text-decoration-color: transparent; text-decoration-thickness: 1px; text-underline-offset: 2px`.
- Transitions on `color` and `text-decoration-color` (motion-fast).

## States

### Hover

- `color: var(--color-link-hover); text-decoration-color: currentColor` — underline appears on hover.

### Pressed

- `color: var(--color-link-active)`.

### Focus-visible

- `outline: var(--border-width-thick) solid var(--color-focus-ring); outline-offset: 2px; border-radius: var(--radius-xs)`.
- `text-decoration-color: currentColor` — underline always visible on keyboard focus regardless of hover.
- The focus ring is a real CSS `outline` (not a `box-shadow` border fakery) with offset, so wrapped links don't get clipped at line breaks.

### Visited

Suppressed — apps revisit routes constantly and a permanently-purple link reads as a stale state in product UI:

```css
.org-link:visited { color: var(--color-link); }
.org-link:visited:hover { color: var(--color-link-hover); }
.org-link:visited:active { color: var(--color-link-active); }
```

### Disabled (`data-disabled="1"`)

The host renders as a non-interactive `<span>`:

- `color: var(--color-link-disabled); cursor: not-allowed; text-decoration-color: transparent; pointer-events: none`.
- No underline (even on hover), no focus ring.

## Inline icons

Both manual leading/trailing icons and the auto-injected affordance icon use the `link` context:

```css
.org-link > .org-icon[data-context="link"] {
  display: inline-flex;
  vertical-align: -0.125em;   /* sit on the cap-line vs. baseline */
  width: 1em;
  height: 1em;
  font-size: 0.95em;          /* slightly smaller than text — reads as accessory */
  color: currentColor;
}
.org-link > .org-icon[data-context="link"][data-pos="leading"]  { margin-right: var(--spacing-1); }
.org-link > .org-icon[data-context="link"][data-pos="trailing"] { margin-left: var(--spacing-1); }
```

## Auto-injected affordance icon

A small JS helper (`link.js` painter) injects a single trailing `org-icon` when:

- `target="_blank"` is present → external-link glyph.
- `[download]` is present → download glyph.

Suppressed when:

- The consumer has already provided a trailing icon, **or**
- `data-no-affordance="1"` is set.

The injected icon is sized exactly like a manual trailing icon — same context rules apply.

## Behaviours / rules

- **Inherit font from surroundings.** A link inside an `h2` reads at the heading size; a link in body copy reads at body size. There are no explicit size variants.
- **Underline channel, not `border-bottom`.** `text-decoration-line` tracks descenders and survives line wraps cleanly; the alternative breaks at the wrap point.
- **Real `outline` for focus.** Don't switch to a `box-shadow` ring — wrapped links would clip at line breaks. The 2px offset is essential.
- **`:visited` is silenced.** App routes are visited constantly; a stale-purple state hurts more than it helps. Don't restore the visited variant.
- **External / download icons are automatic.** Don't hand-author them in markup. If you need the link without an affordance, set `data-no-affordance="1"`.
- **Disabled links are `<span>`s.** Native `<a>` doesn't accept disabled — render the host as a span so it can't be tabbed to or activated.
- **Always inline-level.** No `display: block` mode on the link itself. If you need full-width, wrap in a flex container; that's the parent's job.
- **`rel="noopener"` (or `noreferrer`) for `target="_blank"`.** Security default — author it, don't rely on the icon to imply it.
- Defaults when omitted: not disabled, no manual icons, affordance icon auto-injected when applicable.
