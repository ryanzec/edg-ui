# Code Highlighter — Implementation Guide

A syntax-highlighting wrapper that sits inside a Code Block's `<pre><code>` body. It owns one thing only: the **token color palette**. All chrome (surface, header, copy button, scroll, clamp) belongs to Code Block. The highlighter just classifies a string of source into spans and tints them.

## Anatomy

- **Host**: lives inside an existing `<pre class="org-code-block-body"><code>…</code></pre>`. The highlighter does not paint a surface, border, padding, or font.
- **Token spans**: `<span class="org-syntax-{kind}">…</span>` wrap each lexed token inside the `<code>`.
- **Optional language hint**: `data-language="js | ts | tsx | css | html | json | …"` on the `<code>` (informational; the palette is the same across languages).

## Authoring shape

```html
<div class="org-code-block" data-variant="block">
  <pre class="org-code-block-body"><code data-language="tsx"><span class="org-syntax-keyword">const</span> <span class="org-syntax-variable">x</span> = <span class="org-syntax-number">1</span>;</code></pre>
</div>
```

## Token classes + palette

Each class maps to one `color`. No background fills, no font-weight changes, no italic — the rhythm of the body must read as one block of code, not a rainbow. Colors are tuned for the light surface (`oklch(0.97 0.004 95)`); the dark theme remaps the same class names to a higher-L palette.

| Class                        | Role                                | Color (light)             |
| ---------------------------- | ----------------------------------- | ------------------------- |
| `.org-syntax-comment`        | line + block comments               | `oklch(0.62 0.008 260)`   |
| `.org-syntax-keyword`        | `const`, `if`, `return`, `import`   | `oklch(0.45 0.18 295)`    |
| `.org-syntax-string`         | `'…'`, `"…"`, template literal text | `oklch(0.50 0.13 145)`    |
| `.org-syntax-number`         | numeric + boolean literals          | `oklch(0.50 0.15 35)`     |
| `.org-syntax-function`       | function names at call/def site     | `oklch(0.48 0.16 250)`    |
| `.org-syntax-variable`       | identifiers (declared / used)       | `oklch(0.32 0.008 260)`   |
| `.org-syntax-property`       | object keys, JSX attribute names    | `oklch(0.45 0.12 220)`    |
| `.org-syntax-tag`            | JSX/HTML tag names                  | `oklch(0.50 0.18 25)`     |
| `.org-syntax-attribute`      | HTML attribute names                | `oklch(0.45 0.12 220)`    |
| `.org-syntax-operator`       | `=`, `+`, `=>`, `?:`                | `oklch(0.46 0.008 260)`   |
| `.org-syntax-punctuation`    | `()`, `{}`, `[]`, `,`, `;`          | `oklch(0.46 0.008 260)`   |
| `.org-syntax-class`          | type + class identifiers            | `oklch(0.45 0.14 65)`     |
| `.org-syntax-builtin`        | `Math`, `JSON`, `console`           | `oklch(0.45 0.14 65)`     |
| `.org-syntax-regex`          | regular expression literals         | `oklch(0.50 0.13 145)`    |
| `.org-syntax-escape`         | `\n`, `\t` inside a string          | `oklch(0.50 0.15 35)`     |
| `.org-syntax-decorator`      | `@decorator`                        | `oklch(0.45 0.18 295)`    |
| `.org-syntax-deleted`        | diff "−" line                       | `oklch(0.55 0.18 25)`     |
| `.org-syntax-inserted`       | diff "+" line                       | `oklch(0.50 0.13 145)`    |

## Rules

- The highlighter **never** sets `font-family`, `font-size`, `line-height`, `padding`, `background`, `border`, or `box-shadow`. Those belong to Code Block; if you need to tweak them, tweak Code Block.
- Token spans inherit everything but `color`. No bold, no italic — keep the body monoline.
- Comments are the one exception where `font-style: italic` is acceptable, but only inside `.org-syntax-comment`.
- Whitespace lives in the source string, not in the spans — never wrap a leading indent or a trailing newline in a token span.
- The classes are defined as `color`-only rules; the consumer (or a tokenizer like Shiki / Prism) owns the lexing — this stylesheet is purely the palette contract.
- Defaults when omitted: a bare `<code>` with no syntax spans renders at `--_fg` (the body's default fg). Highlighting is purely additive — strip the spans and the code still reads.
- Diff lines (`org-syntax-deleted` / `org-syntax-inserted`) tint the **text** only; the row background is not painted by the highlighter. If a consumer wants a green/red gutter band, they wrap the line in their own row element with their own background.
