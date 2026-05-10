# Chat — implementation guide

A vertical thread of role-bearing messages plus a composer. The thread is deliberately quiet — assistant messages render as plain prose on the page (no surface), while **user** and **error** messages wrap their body in an `org-box` so a glance can separate "what I said" from "what was said back". **System** messages render as a centered chrome pill. Composes Avatar, Box, Button, Icon, Tag, LoadingSpinner, CodeBlock, and (for the composer) Textarea — Chat itself owns thread layout, run rhythm, role-specific surface wiring, and the small sub-components (block, suggestion, reaction, quote, typing, streaming, day-separator).

Values below are resolved (light theme); a dark-theme overrides block sits at the very bottom.

## Thread shell (`.org-chat` / `.org-chat-thread`)

- `.org-chat` — `display: flex; flex-direction: column; width: 100%; font-family: <sans>; color: oklch(0.22 0.008 260);`. No surface.
- `.org-chat-thread` — `display: flex; flex-direction: column; width: 100%; max-width: 768px; margin: 0 auto; padding: 16px; gap: 0;` (per-message margins drive rhythm; flex `gap` stays at `0`).

## Run rhythm (`data-run-position="first|middle|last|only"`)

- Default top margin between successive messages: `20px` (between different senders).
- Override for `middle` / `last` of a run: `4px` (visually one block).
- The component **never inspects content** — the consumer sets the attribute.

## Day separator (`.org-chat-day`)

- `display: flex; align-items: center; gap: 12px; margin: 16px 0;`
- `color: oklch(0.62 0.008 260); font-size: 12px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; user-select: none;`
- `::before` and `::after` pseudo-elements — `flex: 1 1 0; height: 1px; background: oklch(0.93 0.005 95);` (hairlines on either side of the label).

## Message (`.org-chat-message`)

Two-column grid: fixed avatar gutter on the left, flexible body column on the right.

- `display: grid; grid-template-columns: 32px minmax(0, 1fr); gap: 12px; width: 100%;`

### Avatar gutter (`.org-chat-avatar`)

- `width: 32px; height: 32px; align-self: start;`
- Inner element is the `org-avatar` component (`data-size="sm"`).
- Continuation messages keep the gutter but hide the glyph: `[data-hidden="1"] { visibility: hidden; }` — the column reserves the same width so labels line up.

### Column (`.org-chat-column`)

- `display: flex; flex-direction: column; gap: 4px; min-width: 0;` (the `min-width: 0` lets long unbroken strings wrap rather than overflow).

## Author / meta row (`.org-chat-author`)

- `display: flex; align-items: center; gap: 8px; min-height: 32px;`
- `color: oklch(0.22 0.008 260); font-size: 13px; font-weight: 600; line-height: 1.2;`
- `min-height: 32px` matches the avatar so the avatar centers against the author label.
- `.org-chat-author-name` — `color: oklch(0.22 0.008 260); font-weight: 600;`.
- `.org-chat-author-meta`, `.org-chat-author-time` — `color: oklch(0.62 0.008 260); font-size: 12px; font-weight: 400;`.
- `.org-chat-edited` — same color/size/weight as meta, plus `font-style: italic;`.
- Hidden on `data-run-position="middle"` and `"last"` (`display: none;`) — author is implied by the previous message.

## Message surface

- **User and error** messages wrap `.org-chat-body` in an `org-box`. Box owns the background, border, radius, padding via its own attrs:
  - User: `data-color="neutral" data-border="borderless" data-padding="sm" data-bg="1"`.
  - Error: `data-color="danger" data-border="bordered" data-padding="sm" data-bg="1"`.
- A direct-child `.org-box` of a user/error column gets `max-width: 672px;` so a long pasted prompt doesn't span the full thread.
- **Assistant** messages drop the box entirely — `.org-chat-body` sits bare in the column so long-form prose reads as document copy on the page.

## Body (`.org-chat-body`)

- `font-size: 14px; line-height: 1.45; color: inherit; text-wrap: pretty;`
- Successive children: `> * + * { margin-top: 10px; }`. `p { margin: 0; }`.
- Lists: `ul, ol { margin: 0; padding-left: 20px; }`; `li + li { margin-top: 4px; }`.
- `strong { font-weight: 600; }`; `em { font-style: italic; }`.

## Streaming indicator (`.org-chat-streaming`)

A small "live" badge — info-blue dot + label — placed as a sibling block after the last `<p>`.

- Wrapper — `display: inline-flex; align-items: center; gap: 8px; padding: 4px 10px; border-radius: 999px; background: oklch(0.94 0.04 240); color: oklch(0.56 0.13 240); font-size: 12px; font-weight: 500; line-height: 1; user-select: none;`.
- `.org-chat-streaming-dot` — `position: relative; width: 8px; height: 8px; border-radius: 50%; background: oklch(0.56 0.13 240); flex: 0 0 auto;`. Its `::after` clones the dot and animates `transform: scale(1) → scale(2.4); opacity: 0.6 → 0;` over `1.2s ease-out infinite`. Disabled under `prefers-reduced-motion`.

### Streaming caret (legacy alternative)

- `.org-chat-caret` — `display: inline-block; vertical-align: -2px; width: 8px; height: 14px; margin-left: 2px; background: oklch(0.22 0.008 260); border-radius: 1px;` blinking on/off in `1s steps(2, end) infinite`.

## System banner (`.org-chat-system`)

Centered chrome pill — no avatar gutter, no author row.

- `display: flex; align-items: center; justify-content: center; gap: 8px; margin: 8px auto; padding: 8px 12px; width: fit-content; max-width: 100%;`
- `background: oklch(0.97 0.004 95); color: oklch(0.46 0.008 260); border: 1px solid oklch(0.93 0.005 95); border-radius: 999px; font-size: 13px; line-height: 1.2; text-align: center;`
- Inner icon picks up `currentColor` at `14px`.
- If rendered as a real `<article data-role="system">`, override the grid: `grid-template-columns: minmax(0, 1fr);` and `display: none` the avatar + author.

## States

- `data-state="failed"` on the message — overrides the inner `org-box` to danger-soft: `border-color: oklch(0.55 0.18 25); background: oklch(0.94 0.05 25);`.
- `data-state="pending"` — `opacity: 0.6;` on the inner `org-box` (dim while sending).

## Tool / thinking block (`.org-chat-block`)

Collapsible card inside an assistant message body. Header always visible; body collapses via `data-expanded="0|1"`. Kinds: `tool` (info accent) and `thinking` (faint italic).

- Card — `display: block; border: 1px solid oklch(0.9 0.005 95); background: oklch(0.97 0.004 95); border-radius: 8px; font-size: 14px; color: oklch(0.22 0.008 260);`.
- Stack: a block adjacent to a sibling block, or sitting inside a body, gets `margin-top: 8px;`.
- Header (`.org-chat-block-header`) — `display: flex; align-items: center; gap: 8px; width: 100%; padding: 12px; background: transparent; border: 0; border-radius: 8px; color: inherit; font: inherit; font-size: 13px; font-weight: 500; text-align: left; cursor: pointer; user-select: none;`. Hover `background: oklch(0.945 0.005 95);`. Focus-visible `outline: 2px solid oklch(0.56 0.13 240); outline-offset: -2px;`.
- Kind icon (`.org-chat-block-kind`) — `display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; flex: 0 0 auto;`. Inner icon `width/height: 14px`. Color: `oklch(0.56 0.13 240)` for `[data-kind="tool"]`, `oklch(0.62 0.008 260)` for `[data-kind="thinking"]`.
- Title (`.org-chat-block-title`) — `flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`. Inner `.org-chat-block-title-emphasis` — `font-family: <mono>; font-size: 0.95em; color: oklch(0.56 0.13 240);` for tool kind; for `thinking` kind it switches to `color: oklch(0.46 0.008 260); font-style: italic; font-family: <sans>;`.
- Meta (`.org-chat-block-meta`) — `color: oklch(0.46 0.008 260); font-size: 12px; font-weight: 400; flex: 0 0 auto; font-variant-numeric: tabular-nums;`.
- Chevron — `color: oklch(0.46 0.008 260); transition: transform 150ms cubic-bezier(.3,.7,.4,1);`. Rotates `180deg` when `[data-expanded="1"]`.
- Body (`.org-chat-block-body`) — `padding: 0 12px 12px; color: oklch(0.46 0.008 260); font-size: 13px; line-height: 1.45;`. Children: `> * + * { margin-top: 8px; }`. `[data-expanded="0"] .org-chat-block-body { display: none; }`.
- Running state (`[data-state="running"]`) — left edge thickens to the info ramp: `border-left-color: oklch(0.56 0.13 240); border-left-width: 8px;`. Header re-balances: `padding-left: calc(12px - 8px + 1px) = 5px;`.

## Suggested replies (`.org-chat-suggestions` / `.org-chat-suggestion`)

- Row — `display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;`.
- Chip — `display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #ffffff; color: oklch(0.22 0.008 260); border: 1px solid oklch(0.9 0.005 95); border-radius: 999px; font-size: 13px; font-weight: 400; line-height: 1.2; cursor: pointer; transition: background 100ms cubic-bezier(.3,.7,.4,1), border-color 100ms cubic-bezier(.3,.7,.4,1);`.
- Hover `background: oklch(0.945 0.005 95);`. Focus-visible `outline: 2px solid oklch(0.56 0.13 240); outline-offset: 1px;`.
- Inner icon: `13px`, color `oklch(0.46 0.008 260)`.

## Reactions (`.org-chat-reactions` / `.org-chat-reaction`)

- Row — `display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px;`.
- Chip — `display: inline-flex; align-items: center; gap: 4px; min-height: 22px; padding: 2px 8px; background: oklch(0.97 0.004 95); color: oklch(0.46 0.008 260); border: 1px solid oklch(0.93 0.005 95); border-radius: 999px; font-family: inherit; font-size: 12px; font-weight: 500; cursor: pointer; transition: background 100ms cubic-bezier(.3,.7,.4,1), color 100ms, border-color 100ms;`.
- Hover `background: oklch(0.945 0.005 95);`.
- `[data-selected="1"]` — `background: oklch(0.94 0.04 240); color: oklch(0.56 0.13 240); border-color: oklch(0.56 0.13 240);`.
- `.org-chat-reaction-count` — `font-variant-numeric: tabular-nums;`.

## Quoted-reply preview (`.org-chat-quote`)

Sits above a message body; thick left rail so it reads as reference, not duplicate.

- `display: flex; flex-direction: column; gap: 2px; padding: 6px 10px; margin-bottom: 6px;`
- `background: oklch(0.97 0.004 95); color: oklch(0.46 0.008 260); border-left: 8px solid oklch(0.78 0.008 260); border-radius: 6px; font-size: 12px; line-height: 1.45; cursor: pointer; transition: background 100ms cubic-bezier(.3,.7,.4,1);`
- Hover `background: oklch(0.945 0.005 95);`.
- `.org-chat-quote-author` — `color: oklch(0.22 0.008 260); font-size: 12px; font-weight: 600;`.
- `.org-chat-quote-body` — `color: oklch(0.46 0.008 260); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`.

## Hover actions (uses `org-button-group`)

A standard `org-button-group[data-variant="disconnected"]` placed as a direct child of `.org-chat-message`. Chat only owns the reveal-on-hover behaviour; the buttons are plain icon-only `org-button`s.

- At rest — `margin-top: 6px; opacity: 0; transform: translateY(-2px); pointer-events: none; transition: opacity 150ms cubic-bezier(.3,.7,.4,1), transform 150ms cubic-bezier(.3,.7,.4,1);`.
- On message hover / focus-within, or when group has `[data-pinned="1"]` — `opacity: 1; transform: translateY(0); pointer-events: auto;`.
- Under `prefers-reduced-motion` — `transition: none; transform: none;`.

## Typing indicator (`.org-chat-typing` / `.org-chat-typing-dot`)

Three dots that bounce while the assistant is composing. Replaces the body text before the first token.

- Container — `display: inline-flex; align-items: center; gap: 4px; padding: 8px 0; height: 20px;`.
- Dot — `width: 6px; height: 6px; border-radius: 50%; background: oklch(0.46 0.008 260);` animating `transform: translateY(0 ↔ -3px); opacity: 0.5 ↔ 1;` over `1.2s ease-in-out infinite`. Dots 2 and 3 use `animation-delay: 0.15s` and `0.3s`. Reduced motion → static at `opacity: 0.7`.

## Composer (`.org-chat-composer`)

A thin wrapper around `org-textarea` (`data-has-toolbar="1"`). The textarea owns the surface, focus ring, padding, the merged toolbar row, the kbd hint, and the disabled fade. The composer only stacks an optional attachments-chip row above and clamps width.

- `display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 768px; margin: 0 auto;`
- Inner textarea overrides: `> .org-textarea { max-width: none; }` (the textarea's default cap of 36rem doesn't apply here).
- `[data-disabled="1"]` — `opacity: 0.5; pointer-events: none;` (dims chips + textarea together).
- Attachments row (`.org-chat-composer-attachments`) — `display: flex; flex-wrap: wrap; gap: 8px;`. `&:empty { display: none; }`. Holds `org-tag` chips.

### Composer behaviour notes

- For a streaming-state composer, leave the wrapper enabled and only mark the native `<textarea>` and the attach button as `disabled` — the Stop button must remain clickable.
- Auto-grow lives on the textarea: set `--_textarea-min-lines` / `--_textarea-max-lines` on the inner `.org-textarea` (defaults `1` / `6` for chat). The textarea scrolls internally past the ceiling.

## Empty thread

Render the chat normally with an empty `.org-chat-thread`. Suggested layout for the empty state inside the thread: `min-height: 240px; align-items: center; justify-content: center; text-align: center; gap: 12px;` with an icon + heading + supporting copy + a `.org-chat-suggestions` row of starters. The composer still sits at the bottom.

## Behaviour rules

- **Run rhythm is the only grouping signal.** The component never inspects message content — the consumer sets `data-run-position` on each article.
- **Continuation messages must keep the avatar gutter** (`.org-chat-avatar` with `data-hidden="1"`) so labels line up across a run.
- **Tool / thinking blocks are pure markup.** Clicking the header doesn't toggle on its own — the consumer wires `aria-expanded` and `data-expanded` together.
- **Reactions, suggestions, and hover actions are plain buttons.** The component owns the chrome; the consumer owns the click handlers.
- **Reduced motion** collapses typing dots, the streaming pulse, and the hover-actions reveal automatically.

## Dark-theme overrides

When `[data-theme="dark"]` is in effect, swap the resolved values above for these (everything else stays the same):

- Foreground / muted / faint — `oklch(0.96 0.005 95)` / `oklch(0.7 0.008 260)` / `oklch(0.5 0.008 260)`.
- App / surface / surface-2 / hover — `oklch(0.16 0.005 260)` / `oklch(0.20 0.006 260)` / `oklch(0.25 0.006 260)` / `oklch(0.275 0.007 260)`.
- Border / soft / strong — `oklch(0.34 0.009 260)` / `oklch(0.30 0.008 260)` / `oklch(0.46 0.011 260)`.
- Info / info-soft — `oklch(0.70 0.14 240)` / `oklch(0.30 0.06 240)`.
- Danger / danger-soft — `oklch(0.70 0.18 25)` / `oklch(0.32 0.09 25)`.
