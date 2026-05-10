# Code Block — Implementation Guide

A monospace surface for technical strings, snippets, and token names. Two variants — **inline** (sits in flowing text) and **block** (a card with optional header + copy button). Block bodies are real `<pre><code>` for semantics; the root is a `<div>` so source-indented chrome doesn't render as preserved whitespace. Built on `org-button` for the copy affordance — it's composed in markup, never reimplemented.

## Anatomy

- **Root** (`<span>` for inline, `<div>` for block): `org-code-block` with `data-variant="inline" | "block"`. Optional `data-tone="token | danger | safe"`, `data-wrap`, `data-ellipsis-at="N"`, `data-expanded`, `data-overflowing`.
- **Header (block, optional)**: `<div class="org-code-block-hd">` with `.org-code-block-hd-label` (icon + filename) and `.org-code-block-hd-spacer` to push the copy button right.
- **Body (block)**: `<pre class="org-code-block-body"><code>…</code></pre>`.
- **Copy button**: a real `org-button` (variant `text`, tone `neutral`, size `sm`, icon-only) with class `org-code-block-copy` added. Lives inside the header, or absolutely positioned top-right when no header.
- **Show-more affordance (clamped block)**: `org-button` with `org-code-block-more` anchored bottom-right.

## Authoring shape

```html
<!-- Inline -->
<code class="org-code-block" data-variant="inline">--color-fg</code>
<code class="org-code-block" data-variant="inline" data-tone="token">primary.500</code>

<!-- Block with header + copy -->
<div class="org-code-block" data-variant="block">
  <div class="org-code-block-hd">
    <span class="org-code-block-hd-label"><span class="org-icon" data-icon="file"></span>app.tsx</span>
    <span class="org-code-block-hd-spacer"></span>
    <button class="org-button org-code-block-copy" data-variant="text" data-tone="neutral" data-size="sm">…</button>
  </div>
  <pre class="org-code-block-body"><code>const x = 1;</code></pre>
</div>
```

## Root container

- `font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace`.
- `color: oklch(0.22 0.008 260)` (fg); `background: oklch(0.97 0.004 95)` (bg-surface-2); `border: 1px solid oklch(0.93 0.005 95)` (border-soft).
- Internal locals `--_fg / --_bg / --_border` so consumers can override per-instance.

## Inline variant (`data-variant="inline"`, default)

- `display: inline`; `font-size: 0.85em`; `line-height: inherit`.
- `padding: 1px 6px`; `border-radius: 4px`.
- `white-space: nowrap` so single tokens never break mid-character; allow normal break **between** inline tokens.

## Block variant (`data-variant="block"`)

- `display: flex; flex-direction: column`; `padding: 0`; `border-radius: 8px`.
- `font-size: 13px`; `white-space: normal`.
- `position: relative; overflow: hidden`; `user-select: text`.

## Header bar

- `display: flex; align-items: center; gap: 8px`; `flex: 0 0 auto`.
- `padding: 6px 12px`; `min-height: 24px`.
- `background: #ffffff` (header-bg); `border-bottom: 1px solid oklch(0.93 0.005 95)`.
- Type: `font-family: 'Inter', …`; `font-size: 12px`; `font-weight: 500`; `letter-spacing: 0`; `color: oklch(0.46 0.008 260)`.
- `.org-code-block-hd-label`: `inline-flex; align-items: center; gap: 6px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap`.
- Header icon (`[data-icon]` inside label): `width: 13px; height: 13px; color: oklch(0.62 0.008 260)`.
- `.org-code-block-hd-spacer`: `flex: 1 1 auto`.

## Body (`<pre class="org-code-block-body">`)

- `margin: 0; padding: 12px`.
- `font-family: 'JetBrains Mono', …`; `font-size: inherit`; `line-height: 1.55`; `color: inherit` (resolves to `oklch(0.22 0.008 260)`).
- `overflow-x: auto; overflow-y: hidden`; `white-space: pre`; `tab-size: 2`.
- Scrollbar: `scrollbar-width: thin; scrollbar-color: oklch(0.78 0.008 260) transparent`.
- Inner `<code>`: inherit everything, no extra padding/border/background.

## Wrap variant (`[data-wrap]`)

On the block body: `white-space: pre-wrap; overflow-x: hidden; word-break: break-word`. Use for prose-y snippets where horizontal scroll would hurt.

## Ellipsis / line-clamp (`[data-ellipsis-at="N"]`)

- Body: `max-height: calc(N * 1.55em); overflow-y: hidden`.
- Bottom fade mask: `mask-image: linear-gradient(to bottom, #000 0%, #000 calc(100% - 2.25em), transparent 100%)` (and the `-webkit-mask-image` twin).
- Add `[data-expanded]` on the root to lift the clamp (`max-height: none; mask-image: none`).
- `.org-code-block-more` is `position: absolute; right: 8px; bottom: 8px; display: none` — switches to `inline-flex` only when JS adds `[data-overflowing]` to the root.

## Copy button (`.org-code-block-copy`)

- Resting state: `opacity: 0.35`; transitions `opacity 150ms cubic-bezier(.3,.7,.4,1)`.
- Lift to `opacity: 1` on `.org-code-block:hover`, `:focus-within`, or `.org-code-block-copy:focus-visible`.
- When no header is present (`:not(:has(> .org-code-block-hd))`): `position: absolute; top: 6px; right: 6px; z-index: 2`.
- Confirm state (`[data-copied]`): `opacity: 1`; both the button and its inner icon swap to `color: oklch(0.58 0.13 145)` (safe). Hold for `1200ms`, then JS clears the attribute.

## Tones (inline only, `data-tone="…"`)

Override `--_bg / --_fg / --_border` so a token reference reads visually distinct from a generic snippet.

| Tone     | Background              | Foreground              | Border       |
| -------- | ----------------------- | ----------------------- | ------------ |
| `token`  | `oklch(0.93 0.005 95)`  | `oklch(0.32 0.008 260)` | `transparent`|
| `danger` | `oklch(0.94 0.05 25)`   | `oklch(0.55 0.18 25)`   | `transparent`|
| `safe`   | `oklch(0.94 0.04 145)`  | `oklch(0.58 0.13 145)`  | `transparent`|

## Behaviours / rules

- The root is a `<div>` (block) or `<span>`/`<code>` (inline) — never a `<pre>`. Source indentation in the markup must not bleed into rendered whitespace.
- Block code is selectable but not implicitly editable.
- Long lines scroll horizontally by default; opt into wrap with `[data-wrap]`.
- The copy button is composed (a real `org-button`); never paint a fresh button inside the code-block stylesheet.
- The "show more" affordance only renders when JS confirms the body actually overflowed (`[data-overflowing]`) — empty affordance never ships.
- Defaults when omitted: `data-variant="inline"`. Inline tone is unset (uses neutral surface); block ignores `data-tone`.
