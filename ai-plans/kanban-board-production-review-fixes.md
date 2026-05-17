# Kanban Board — Production Review Fixes

## Goal

Bring the `kanban-board` core component (and the related brain directives that drive it) into compliance with the project rules in `.claude/rules/`. The component as it stands is functional and type-clean, but it has several rule violations introduced in the initial implementation, most clustered in the storybook files and a few in the CSS / brain.

## Scope

Files touched (in priority order):

- `projects/shared-ui/src/lib/core/kanban-board/kanban-board.stories.ts`
- `projects/shared-ui/src/lib/core/kanban-board/kanban-board.tests.stories.ts`
- `projects/shared-ui/src/lib/core/kanban-board/kanban-card.css`
- `projects/shared-ui/src/lib/core/kanban-board/kanban-lane.css`
- `projects/shared-ui/src/lib/core/kanban-board/kanban-board.css`
- `projects/shared-ui/src/lib/core/kanban-board/kanban-board-tokens.css` (token additions only)
- `projects/shared-ui/src/lib/core/kanban-board/kanban-board.spec.ts` (delete)
- `projects/shared-ui/src/lib/brain/kanban-board-brain/kanban-card-brain.ts` (related code, drag-preview render)

Files **not** touched:

- `kanban-board.ts` / `kanban-board.html`
- `kanban-card.ts` / `kanban-card.html`
- `kanban-lane.ts` / `kanban-lane.html`
- `kanban-board-brain.ts` / `kanban-lane-brain.ts`

No public API changes. No new components.

---

## Violations & Fixes

### 1. Bespoke inline-component markup + `styles: [...]` blocks in stories

**Files:** `kanban-board.stories.ts`, `kanban-board.tests.stories.ts`

**Rules violated:**

- `.claude/rules/storybook/general.md` — _"ALWAYS use custom components from `projects/shared-ui/src/lib/core` or native html elements instead of creating inline components."_
- `.claude/rules/styling.md` — _"NEVER use the style tag unless the value NEEDS to be dynamic based on typescript code."_

**Where:**

1. `StoryKanbanCardContent` (kanban-board.stories.ts ~line 132-192):
   - Bespoke `<div class="title">`, `<div class="description">`, `<div class="meta">`, `<span class="assignee">` markup
   - Bespoke `styles: [...]` block defining `.title`, `.description`, `.meta`, `.assignee` (all static values)
2. `StoryKanbanBasic` (~line 194-232): `styles: [':host { display: block; height: 32rem; }']`
3. `StoryKanbanManyLanes` (~line 234-262): `styles: [':host { display: block; height: 30rem; }']`
4. `StoryKanbanWithActions` (~line 264-301): `styles: [':host { display: block; height: 28rem; }']`
5. `StoryKanbanEmptyLane` (~line 303-343): `styles: [':host { display: block; height: 28rem; }']`
6. `StoryKanbanLiveDemo` (~line 345-457): `styles: [...]` block with `.canvas-stage { height: 26rem; }` and `.selection-readout { font-size: ...; color: ...; padding-top: ...; }`
7. `StoryKanbanTestsShell` (kanban-board.tests.stories.ts ~line 31-68): `styles: [...]` block with `:host { display: block; height: 24rem; }` and `.readout { font-size: 0.75rem; padding-top: 0.5rem; }`
8. The tests shell also renders cards as bespoke `<div [attr.data-testid]="'card-' + item.id">{{ item.title }}</div>` (acceptable since it's native html, but worth using `<org-box>` or similar if needed for visual parity)

**Fix:**

For `StoryKanbanCardContent`:

- Replace the bespoke markup with `<org-card>` / `<org-card-header>` / `<org-card-header-title>` / `<org-card-header-subtitle>` (description as subtitle) / `<org-card-footer>` (the meta row containing assignee + priority `<org-tag>`)
- If a flex row inside the footer is needed, use `<org-box>` or just flex/gap utility classes (`flex items-center justify-between gap-2`)
- Delete the `styles: [...]` block entirely
- Use existing typography utilities (`text-xs`, `text-sm`, `font-semibold`, `text-fg-muted`, etc.) for any color / size needs (check `projects/shared-ui/src/lib/styles` for the actual class names — `font-utility.css`, etc.)

For every wrapper component (`StoryKanbanBasic`, `StoryKanbanManyLanes`, `StoryKanbanWithActions`, `StoryKanbanEmptyLane`, `StoryKanbanLiveDemo`, `StoryKanbanTestsShell`):

- Delete the `styles: [...]` block
- Replace `:host { display: block; height: Xrem; }` with `host: { class: 'block h-Xrem' }` (or whatever the existing sizing utility class is — see `projects/shared-ui/src/lib/styles/sizing-utility.css`)
- If a needed sizing utility class doesn't exist, **stop and ask** before writing custom CSS (per the styling rule: _"When no utility class exists for a needed style, ALWAYS ask whether to add the utility class to `projects/shared-ui/src/lib/styles` instead of writing custom CSS."_)
- For `StoryKanbanLiveDemo`'s `.canvas-stage` wrapper, do the same — sizing utility on a `<div class="...">` instead of a `:host`/class style block
- For `StoryKanbanLiveDemo`'s `.selection-readout`, use utility classes (`text-xs`, `text-fg-muted`, `pt-2`) on the existing `<div>`
- For `StoryKanbanTestsShell`'s `.readout`, same approach

**Verification step:** after refactor, do a `grep -n "styles:" projects/shared-ui/src/lib/core/kanban-board/*.stories.ts` and confirm zero matches.

---

### 2. TSDoc on a story export

**File:** `kanban-board.stories.ts` (~line 533-537)

**Rule violated:** `.claude/rules/storybook/general.md` — _"NEVER add TSDoc for story code, NEVER."_

**Where:** The `Default` story has a multi-line JSDoc block above it explaining why the typing is loose:

```ts
/**
 * the Default story is typed loosely because `ariaLabel` is forwarded ...
 */
export const Default: StoryObj<{ ariaLabel: string }> = {
```

**Fix:** Delete the JSDoc block entirely. If the typing rationale is worth preserving anywhere, move it to a single-line `// ...` comment (the rule bans TSDoc, not single-line comments) — but a single-line is fine here, the typing decision is locally obvious from the inline `StoryObj<{ ariaLabel: string }>` annotation.

---

### 3. Raw `z-index: 1` not from a token

**File:** `kanban-card.css` (~line 39)

**Rule violated:** `.claude/rules/styling.md` — _"ALWAYS use css variables from `projects/shared-ui/src/lib/styles/base-tokens.css` or the `{component-name}-tokens.css` file ... for styling in css files."_

**Where:**

```css
.kanban-card-drop-indicator {
  ...
  z-index: 1;       /* violation */
}
```

**Fix:**

- Add a token in `kanban-board-tokens.css`: `--kanban-board-drop-indicator-z-index: var(--z-index-raised);` (base-tokens.css has `--z-index-raised: 2`, which is the correct semantic — drop indicator should sit just above the card surface)
- Reference it: `z-index: var(--kanban-board-drop-indicator-z-index);`
- Run `moon run :build-design-tokens` to regenerate the TS tokens map

---

### 4. Raw `line-height: 1` not from a token

**File:** `kanban-lane.css` (~line 50)

**Rule violated:** Same styling rule as #4.

**Where:**

```css
.kanban-lane-count-pill {
  ...
  line-height: 1;      /* violation — base-tokens.css has --line-height-none: 1 */
}
```

**Fix:** Replace with `line-height: var(--line-height-none);`. No token additions needed.

---

### 5. Leftover scaffolded spec file

**File:** `kanban-board.spec.ts`

**Rules violated:**

- `.claude/rules/testing/unit.md` — _"ALWAYS use `vitest` apis."_ (this spec uses Jasmine-style describe/it/expect globals; no `import` from `vitest`)
- General convention: no other component in `projects/shared-ui/src/lib/core` has a `.spec.ts` file — testing for this codebase happens via the storybook `.tests.stories.ts` pattern, which already exists for kanban-board

**Fix:**

- Delete `kanban-board.spec.ts` entirely. It's `ng generate` scaffolding that never got removed and adds no coverage beyond what `kanban-board.tests.stories.ts` already provides.
- **Ask first** before deleting (per `.claude/rules/general.md` — _"If you think some code is redundant, ALWAYS ask before removing it."_).

---

### 6. Brain: `_renderPreview` styling — document the deliberate rule break

**File:** `projects/shared-ui/src/lib/brain/kanban-board-brain/kanban-card-brain.ts` (~lines 197-252)

**Rules involved (intentionally broken):**

- `.claude/rules/angular/brain-directive-component.md` — brain directives must **NEVER** contain _"sizing attributes / spacing attributes / color / theming attributes"_
- `.claude/rules/styling.md`:
  - _"NEVER use box shadows unless EXPLICITLY asked for."_
  - _"NEVER use a default values when using `var(...)`."_
  - _"ALWAYS use `rem` over `px`"_
  - _"ALWAYS use css variables from base-tokens.css ..."_

**Decision:** Keep the inline styling as-is. The drag preview is rendered in the browser's drag-image portal — a separate DOM where stylesheet loading is unreliable. Refactoring into a CSS class + token system would require either a globally-loaded preview stylesheet outside the component's normal CSS lifecycle, or class-application gymnastics that don't actually improve maintainability. The simpler, safer path is to inline.

CLAUDE.md's top rule covers this: _"ALWAYS ignore any other rule if there is a comment above the line in violation with a reason why there is a violation."_

**Fix:**

Expand the existing JSDoc above `_renderPreview` (~line 197) to explicitly call out the rule break and the reasoning, so future reviewers (human or AI) don't try to "clean this up". Something along these lines:

```ts
/**
 * builds the drag preview dom: clones the source card silhouette; when more than one card is in the drag,
 * stacks additional offset silhouettes behind the front card and appends a count badge.
 *
 * RULE BREAK — intentional: this method violates several brain/styling rules (inline sizing, colors, fonts,
 * padding, border-radius, box-shadow, raw px values, var() fallbacks) AND the brain-must-not-contain-styling
 * rule. these are kept here on purpose because the preview is rendered inside the browser's drag-image
 * portal — a separate DOM where component stylesheets are not reliably loaded. moving the static styles
 * into a CSS class + tokens would require either a globally-loaded preview stylesheet outside the normal
 * component CSS lifecycle, or fragile class-application from the brain into a portal DOM. inline styling
 * is the pragmatic choice; do not "refactor" this back into the standard pattern.
 */
private _renderPreview(...): void { ... }
```

Additionally, fix the one _bug_ that is independent of the rule break:

- `var(--color-on-primary, white)` references a non-existent token. The correct token name is `--color-primary-on` (see `base-tokens.css`). Because the `, white` fallback is present, this currently silently renders as `white` instead of using the design system color. Fix the token name. The fallback can stay (it's part of the deliberate rule break being documented above).
- After fix: `'var(--color-primary-on, white)'`

---

### 7. Brain: missing `aria-selected` companion to `data-selected`

**File:** `projects/shared-ui/src/lib/brain/kanban-board-brain/kanban-card-brain.ts` (~lines 34-44)

**Rules violated:** `.claude/rules/styling.md` — _"ALWAYS use `aria-_`when available and then fallback to`data-_`attributes for component styling that is based on an input having the input value be the`data-_`attribute value, see`projects/shared-ui/src/lib/core/box` as a reference."\*

Also `.claude/rules/reviewing.md` — _"ALWAYS apply best practices for accessibility."_

**Where:** The card brain's host bindings set `data-selected` for selection state, but selection in a "listitem"-roled element has a natural ARIA equivalent (`aria-selected`).

```ts
host: {
  role: 'listitem',
  ...
  '[attr.data-selected]': 'isSelected() ? "" : null',     // present
  // missing: '[attr.aria-selected]': 'isSelected() ? "true" : "false"',
  ...
}
```

**Fix:**

- Add `'[attr.aria-selected]': 'isSelected()'` to the host bindings (Angular will stringify boolean to `'true' | 'false'`)
- Once aria-selected is set, update `kanban-card.css` so the selected-state rule reads `:host([aria-selected="true"])` instead of `:host([data-selected])`
- Consider whether `role: 'listitem'` is the most semantically correct — a kanban card is more like a `gridcell` or `option` (since it's selectable). `listitem` is workable but `option` better matches the selection semantic. Flag for confirmation before changing role.

---

## Order of Operations

1. **Easy / low-risk first:**
   - #4 (`line-height: 1` → token)
   - #3 (`z-index: 1` → token; requires token addition + `moon run :build-design-tokens`)
   - #2 (delete TSDoc on `Default` story)
2. **Ask, then act:**
   - #5 (delete `kanban-board.spec.ts`)
3. **Moderate refactor:**
   - #1 (stories cleanup — biggest visible change; verify the visual result matches in storybook after)
4. **Brain (related code):**
   - #7 (add `aria-selected`, update CSS selector)
   - #6 (expand `_renderPreview` JSDoc + fix `--color-on-primary` → `--color-primary-on` token-name bug)

Each step ends with:

- `moon run shared-ui:type-check`
- `moon run :lint`
- `moon run :build-design-tokens` (only when tokens changed)

---

## Out of Scope

- Keyboard drag/drop (separate feature)
- Lane reordering (separate feature)
- Virtualization for large item lists
- Changing the brain's `role: 'listitem'` to `role: 'option'` (flagged but needs confirmation)
- Refactoring `_renderPreview` to extract styling into a CSS class — explicitly **not** doing this; see #6 for the documented rule-break rationale
