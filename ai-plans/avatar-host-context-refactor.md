# Avatar Sub-Component `host-context()` Refactor

## Goal

Remove the parent / stack injections inside avatar sub-components that exist **purely to mirror styling data attributes**, and replace those attribute-driven CSS selectors with `:host-context()` selectors that read directly from the actual parent / ancestor (`org-avatar`, `org-avatar-stack`).

This reduces:

- Duplicated `data-*` mirrors on sub-components.
- TS-side parent-component injections that exist only to feed CSS.
- The cognitive overhead of "where does this style come from?" — the answer becomes "the nearest ancestor that owns that state".

The brain directive injections that drive **template content** (e.g. `initials`, `label`, alt-text fallback) stay where they are.

## Scope

Files touched:

- `projects/shared-ui/src/lib/core/avatar/avatar.ts`
- `projects/shared-ui/src/lib/core/avatar/avatar-shape.ts`
- `projects/shared-ui/src/lib/core/avatar/avatar-shape.css`
- `projects/shared-ui/src/lib/core/avatar/avatar-label.ts`
- `projects/shared-ui/src/lib/core/avatar/avatar-label.css`
- `projects/shared-ui/src/lib/core/avatar/avatar-stack-overflow.ts`
- `projects/shared-ui/src/lib/core/avatar/avatar-stack-overflow.css`

Files **not** touched:

- `avatar-image.ts` / `avatar-image.css` — only brain injection is for the alt-fallback (content/a11y), no styling-only attribute mirror.
- `avatar-stack.ts` / `avatar-stack.css` — already owns its own `data-size`.
- `avatar-tokens.css` — token slots stay; selectors that consume them just move.
- `avatar.html`, `avatar.css` — no template / wrapper changes required.
- Brain directives in `projects/shared-ui/src/lib/brain/avatar-brain/` — untouched.

No new components are being created. No public API changes. No new patterns introduced at the framework level — this is a consolidation of an existing pattern (`:host-context()` is already idiomatic for cross-component styling).

## Architectural Summary

| Concern                                | Before                                                                                                  | After                                                                                                                                                                                                                |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `avatar-shape` reads parent size/shape | injects `Avatar`, mirrors as `data-size` / `data-shape` on its own host                                 | reads via `:host-context(org-avatar[data-size='X'])` / `:host-context(org-avatar[data-shape='X'])`                                                                                                                   |
| `avatar-shape` reads "is stacked"      | injects optional `AvatarStack`, mirrors as `data-stacked` on its own host                               | reads via `:host-context(org-avatar-stack)`                                                                                                                                                                          |
| `avatar-shape` color index             | computed locally from `AvatarBrainDirective.label` and mirrored as `data-color-index` on the shape host | **moved up to `Avatar`** — `Avatar` computes `colorIndex` (it already injects the brain) and sets `[attr.data-color-index]` on the avatar host. Shape consumes via `:host-context(org-avatar[data-color-index='N'])` |
| `avatar-shape` renders initials        | injects `AvatarBrainDirective` to render `{{ initials() }}` in template                                 | **unchanged** — still injects the brain for the template content                                                                                                                                                     |
| `avatar-label` reads parent size       | injects `Avatar`, mirrors as `data-size`                                                                | reads via `:host-context(org-avatar[data-size='X'])`                                                                                                                                                                 |
| `avatar-label` renders display name    | injects `AvatarBrainDirective` for `{{ label() }}`                                                      | **unchanged**                                                                                                                                                                                                        |
| `avatar-stack-overflow` size fallback  | injects optional `AvatarStack`, computes `effectiveSize`, mirrors as `data-size`                        | own `size` input still wins when set (own `data-size`); when unset, falls back via `:host-context(org-avatar-stack[data-size='X'])`                                                                                  |

## Selector Convention (New Pattern Confirmed for This Refactor)

For every replacement, the `:host-context()` selector is **prefixed with the element name** so the match is scoped to the actual ancestor component, not any random ancestor that happens to have `data-size`:

```css
/* good */
:host-context(org-avatar[data-size='sm']) {
  /* ... */
}

/* avoid — ambient, matches any ancestor with data-size */
:host-context([data-size='sm']) {
  /* ... */
}
```

Chained `:host-context()` selectors are used when multiple ancestor conditions must hold simultaneously (e.g. stacked + small):

```css
:host-context(org-avatar-stack):host-context(org-avatar[data-size='sm']) {
  /* ... */
}
```

## Detailed Changes

### 1. `avatar.ts` — own the color index

The `colorIndex` computation moves here. `Avatar` already injects `AvatarBrainDirective`, so no new injection is needed.

```ts
import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
// ...existing imports...

/** total number of distinct background colors cycled through based on the first label character. */
const AVATAR_COLOR_COUNT = 8;

@Component({
  selector: 'org-avatar',
  // ...
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-color-index]': 'colorIndex()',
    '[attr.data-clickable]': 'avatarBrainDirective.isClickable() ? "true" : null',
    '[attr.data-disabled]': 'avatarBrainDirective.isDisabled() ? "true" : null',
  },
})
export class Avatar {
  protected readonly avatarBrainDirective = inject(AvatarBrainDirective);

  /** background color index (0-7) derived from the first character of the brain label; falls back to 0 when empty. */
  protected readonly colorIndex = computed<number>(() => {
    const label = this.avatarBrainDirective.label().trim();

    if (!label) {
      return 0;
    }

    return (label.toLowerCase().codePointAt(0) ?? 0) % AVATAR_COLOR_COUNT;
  });

  // ...existing inputs unchanged...
}
```

Notes:

- `AVATAR_COLOR_COUNT` const moves from `avatar-shape.ts` to `avatar.ts`.
- `colorIndex` is `protected` because it is only referenced from the avatar host binding string.
- No template changes in `avatar.html`.

### 2. `avatar-shape.ts` — drop parent / stack injections

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AvatarBrainDirective } from '../../brain/avatar-brain/avatar-brain';

@Component({
  selector: 'org-avatar-shape',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar-shape.html',
  styleUrl: './avatar-shape.css',
  // host: { ... } removed entirely — no styling-only attribute mirrors left on this element.
})
export class AvatarShape {
  /** reference to the parent avatar's brain directive — used to render initials in the template. */
  protected readonly avatarBrainDirective = inject(AvatarBrainDirective);
}
```

Removed:

- `inject<Avatar>(forwardRef(() => Avatar))`
- `inject(AvatarStack, { optional: true })`
- `isStacked` computed
- `colorIndex` computed (moved to `Avatar`)
- `AVATAR_COLOR_COUNT` const (moved to `Avatar`)
- All host attribute bindings

Kept:

- `AvatarBrainDirective` injection (still required for `avatar-shape.html`'s `{{ avatarBrainDirective.initials() }}`).

`avatar-shape.html` is **unchanged**.

### 3. `avatar-shape.css` — switch to `:host-context()`

Replace every `:host([data-…])` selector that was driven by a removed host binding. The token-slot defaults block (`width`, `height`, `border-radius`, etc. using `var(--avatar-…)`) is unchanged.

```css
@layer components {
  :host {
    position: relative;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: var(--avatar-shape-size);
    height: var(--avatar-shape-size);
    border-radius: var(--avatar-radius);
    background-color: var(--avatar-color);
    color: var(--avatar-shape-fg);
    font-size: var(--avatar-initials-font-size);
    font-weight: var(--avatar-initials-font-weight);
    line-height: var(--avatar-line-height);
    letter-spacing: var(--avatar-letter-spacing);
    text-transform: uppercase;
    user-select: none;
  }

  /* shape variants (read from the org-avatar ancestor) */
  :host-context(org-avatar[data-shape='square']) {
    --avatar-radius: var(--radius-base);
  }

  /* size variants (read from the org-avatar ancestor) */
  :host-context(org-avatar[data-size='sm']) {
    --avatar-shape-size: var(--spacing-8);
    --avatar-initials-font-size: var(--font-size-xs);
  }

  :host-context(org-avatar[data-size='base']) {
    --avatar-shape-size: var(--spacing-12);
    --avatar-initials-font-size: var(--font-size-lg);
  }

  :host-context(org-avatar[data-size='lg']) {
    --avatar-shape-size: var(--spacing-16);
    --avatar-initials-font-size: var(--font-size-2xl);
  }

  /* indexed palette overrides — color index now lives on the org-avatar host */
  :host-context(org-avatar[data-color-index='1']) {
    --avatar-color: var(--avatar-color-1);
  }

  :host-context(org-avatar[data-color-index='2']) {
    --avatar-color: var(--avatar-color-2);
  }

  :host-context(org-avatar[data-color-index='3']) {
    --avatar-color: var(--avatar-color-3);
  }

  :host-context(org-avatar[data-color-index='4']) {
    --avatar-color: var(--avatar-color-4);
  }

  :host-context(org-avatar[data-color-index='5']) {
    --avatar-color: var(--avatar-color-5);
  }

  :host-context(org-avatar[data-color-index='6']) {
    --avatar-color: var(--avatar-color-6);
  }

  :host-context(org-avatar[data-color-index='7']) {
    --avatar-color: var(--avatar-color-7);
  }

  /* stacked ring (rendered only when inside an avatar stack ancestor) */
  :host-context(org-avatar-stack) {
    border-style: solid;
    border-color: var(--avatar-ring-color);
    border-width: var(--avatar-ring-width);
  }

  /* sm is the only ring-width that differs from the slot default */
  :host-context(org-avatar-stack):host-context(org-avatar[data-size='sm']) {
    --avatar-ring-width: var(--border-width-thick);
  }
}
```

### 4. `avatar-label.ts` — drop parent injection

```ts
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { AvatarBrainDirective } from '../../brain/avatar-brain/avatar-brain';

/** default value for the subLabel input. */
export const AVATAR_LABEL_SUB_LABEL_DEFAULT: string | undefined = undefined;

@Component({
  selector: 'org-avatar-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar-label.html',
  styleUrl: './avatar-label.css',
  // host: { ... } removed — no styling-only attribute mirrors left.
})
export class AvatarLabel {
  /** reference to the parent avatar's brain directive for the display label. */
  protected readonly avatarBrainDirective = inject(AvatarBrainDirective);

  /** optional secondary text displayed below the main label. */
  public subLabel = input<string | undefined, string | null | undefined>(AVATAR_LABEL_SUB_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });
}
```

Removed:

- `inject<Avatar>(forwardRef(() => Avatar))`
- `[attr.data-size]` host binding
- `forwardRef` / `Avatar` imports

Kept:

- `AvatarBrainDirective` injection (still rendering `{{ avatarBrainDirective.label() }}` in `avatar-label.html`).

`avatar-label.html` is **unchanged**.

### 5. `avatar-label.css` — switch to `:host-context()`

```css
@layer components {
  :host {
    display: inline-flex;
    flex-direction: column;
    min-width: 0;
    gap: var(--avatar-label-gap);
  }

  .label,
  .sub-label {
    line-height: var(--avatar-line-height);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .label {
    font-size: var(--avatar-label-name-font-size);
    font-weight: var(--avatar-label-name-font-weight);
    color: var(--avatar-label-name-color);
  }

  .sub-label {
    font-size: var(--avatar-label-sub-font-size);
    font-weight: var(--avatar-label-sub-font-weight);
    color: var(--avatar-label-sub-color);
  }

  /* size variants (read from the org-avatar ancestor) */
  :host-context(org-avatar[data-size='sm']) {
    --avatar-label-name-font-size: var(--font-size-sm);
  }

  :host-context(org-avatar[data-size='lg']) {
    --avatar-label-name-font-size: var(--font-size-lg);
    --avatar-label-sub-font-size: var(--font-size-sm);
  }
}
```

### 6. `avatar-stack-overflow.ts` — drop stack injection

The component's own `size` input still wins when explicitly set; when unset, the styling falls back to the ancestor stack via `:host-context()` (no TS-side `effectiveSize` chain needed).

```ts
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ComponentSize } from '../types/component-types';

/** available size variants for the avatar stack overflow pill. */
export const allAvatarStackOverflowSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** size variant for the avatar stack overflow pill. */
export type AvatarStackOverflowSize = (typeof allAvatarStackOverflowSizes)[number];

@Component({
  selector: 'org-avatar-stack-overflow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar-stack-overflow.html',
  styleUrl: './avatar-stack-overflow.css',
  host: {
    '[attr.data-size]': 'size() ?? null',
  },
})
export class AvatarStackOverflow {
  /** the additional avatar count rendered inside the pill (will display as "+N"). */
  public count = input.required<number>();

  /** the size of the pill; when omitted, falls back to the ancestor avatar stack size via CSS. */
  public size = input<AvatarStackOverflowSize | undefined>(undefined);
}
```

Removed:

- `inject(AvatarStack, { optional: true })`
- `effectiveSize` computed
- `AVATAR_STACK_OVERFLOW_SIZE_DEFAULT` const (no longer referenced — confirm and delete the export if no external consumer relies on it; if any consumer does, leave the export in place but stop using it internally).

Notes:

- `[attr.data-size]` now uses `size() ?? null` so that when `size` is not passed, the attribute is **omitted entirely** from the host element. This is what lets `:not([data-size])` in CSS unambiguously detect "fall back to stack".

### 7. `avatar-stack-overflow.css` — explicit own size wins, otherwise fall back to stack

```css
@layer components {
  :host {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: var(--avatar-shape-size);
    height: var(--avatar-shape-size);
    border-radius: var(--avatar-radius);
    background-color: var(--avatar-overflow-bg);
    color: var(--avatar-overflow-fg);
    border-style: solid;
    border-color: var(--avatar-ring-color);
    border-width: var(--avatar-ring-width);
    font-size: var(--avatar-initials-font-size);
    font-weight: var(--avatar-overflow-font-weight);
    line-height: var(--avatar-line-height);
    letter-spacing: var(--avatar-letter-spacing);
    user-select: none;
  }

  /* explicit size on the overflow itself wins */
  :host([data-size='sm']) {
    --avatar-shape-size: var(--spacing-8);
    --avatar-initials-font-size: var(--font-size-xs);
    --avatar-ring-width: var(--border-width-thick);
  }

  :host([data-size='lg']) {
    --avatar-shape-size: var(--spacing-16);
    --avatar-initials-font-size: var(--font-size-2xl);
  }

  /* fall back to the ancestor stack's size when no explicit size is set on the overflow */
  :host(:not([data-size])):host-context(org-avatar-stack[data-size='sm']) {
    --avatar-shape-size: var(--spacing-8);
    --avatar-initials-font-size: var(--font-size-xs);
    --avatar-ring-width: var(--border-width-thick);
  }

  :host(:not([data-size])):host-context(org-avatar-stack[data-size='lg']) {
    --avatar-shape-size: var(--spacing-16);
    --avatar-initials-font-size: var(--font-size-2xl);
  }
}
```

Notes:

- `base` is the slot default, so no rule is needed for it.
- The `:host(:not([data-size]))` guard ensures the stack-fallback rules never beat an explicit own size, regardless of CSS source order.

## Behavior Verification Matrix

| Scenario                                                                                   | Expected outcome                                                              |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `<org-avatar size="sm">` standalone                                                        | shape + label sized `sm` via `:host-context(org-avatar[data-size='sm'])`      |
| `<org-avatar shape="square">`                                                              | shape uses square radius via `:host-context(org-avatar[data-shape='square'])` |
| `<org-avatar>` with label `"Alice"`                                                        | `data-color-index` on the avatar host drives shape background                 |
| `<org-avatar-stack><org-avatar … /></org-avatar-stack>`                                    | shape gets the stacked ring via `:host-context(org-avatar-stack)`             |
| `<org-avatar-stack size="sm"><org-avatar size="sm" /></org-avatar-stack>`                  | thick ring (`border-width-thick`) via chained `:host-context()`               |
| `<org-avatar-stack-overflow [count]="3" />` inside `org-avatar-stack[size='lg']`           | stack-fallback rule applies (lg)                                              |
| `<org-avatar-stack-overflow [count]="3" size="sm" />` inside `org-avatar-stack[size='lg']` | own `size='sm'` wins; stack-fallback rules ignored                            |
| `<org-avatar-stack-overflow [count]="3" />` not inside any stack                           | slot defaults (base) apply                                                    |

## Implementation Checklist

- [ ] `avatar.ts` — add `AVATAR_COLOR_COUNT`, add `colorIndex` computed, add `[attr.data-color-index]` host binding.
- [ ] `avatar-shape.ts` — remove `Avatar`/`AvatarStack`/`forwardRef` imports, remove `host: {…}`, remove `colorIndex` + `isStacked`, keep brain injection only.
- [ ] `avatar-shape.css` — convert `:host([data-size])`, `:host([data-shape])`, `:host([data-stacked])`, `:host([data-color-index])` selectors to `:host-context(org-avatar[…])` / `:host-context(org-avatar-stack)` forms; collapse the `[data-stacked][data-size='sm']` combo into chained `:host-context()`.
- [ ] `avatar-label.ts` — remove `Avatar`/`forwardRef` imports, remove `host: {…}`, keep brain injection only.
- [ ] `avatar-label.css` — convert size selectors to `:host-context(org-avatar[data-size='X'])`.
- [ ] `avatar-stack-overflow.ts` — remove `AvatarStack` injection + `effectiveSize` + `computed` import, simplify `data-size` binding to `size() ?? null`, drop `AVATAR_STACK_OVERFLOW_SIZE_DEFAULT` if unused externally.
- [ ] `avatar-stack-overflow.css` — keep own-size `:host([data-size='X'])` rules, add stack-fallback `:host(:not([data-size])):host-context(org-avatar-stack[data-size='X'])` rules.
- [ ] Run the avatar Storybook stories (LiveDemo + Showcase) and visually verify all variants (sizes, shapes, stacked, color rotation, overflow with / without explicit size).
- [ ] Run the avatar component's unit tests.

## Out of Scope

- Renaming or removing `avatar-tokens.css` variables.
- Adjusting brain directive APIs.
- Storybook story changes (no rendered output should change, so stories require no edits).
- Public TypeScript API changes on any avatar component or directive.
