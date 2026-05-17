# Tickets Kanban Template

## Goal

Build a `TicketsKanban` template component under `projects/shared-ui/src/lib/templates/tickets-kanban/` that renders a static list of tickets across four status swimlanes using the existing `org-kanban-board`. Each status group is exposed as a `computed()` derived from one source-of-truth `_tickets` signal. Cross-lane drag updates the dragged ticket's `status`; clicking a card emits a `ticketClicked` event.

The existing `projects/shared-ui/src/lib/templates/tickets-kanban/` directory currently contains the empty Angular CLI scaffold (`tickets-kanban.ts/.html/.css/.spec.ts`). All four files will be fully rewritten.

---

## Files

### New

- `projects/shared-ui/src/lib/templates/tickets-kanban/tickets-kanban-types.ts` — types + constants + status maps + static seed data
- `projects/shared-ui/src/lib/templates/tickets-kanban/tickets-kanban-card.ts` — sub-component for a single card's visual content
- `projects/shared-ui/src/lib/templates/tickets-kanban/tickets-kanban-card.html` — card template
- `projects/shared-ui/src/lib/templates/tickets-kanban/tickets-kanban-card.css` — card-local styles (line-clamp, footer row)
- `projects/shared-ui/src/lib/templates/tickets-kanban/tickets-kanban.stories.ts` — Default + LiveDemo + Showcase
- `projects/shared-ui/src/lib/templates/tickets-kanban/llm.md` — LLM-optimized usage doc

### Rewritten

- `projects/shared-ui/src/lib/templates/tickets-kanban/tickets-kanban.ts` — top-level template component (replaces scaffold)
- `projects/shared-ui/src/lib/templates/tickets-kanban/tickets-kanban.html` — template (replaces `<p>tickets-kanban works!</p>`)
- `projects/shared-ui/src/lib/templates/tickets-kanban/tickets-kanban.css` — empty `@layer components { /* no rules — layout fully delegated to org-kanban-board */ }` (or removed if not needed)
- `projects/shared-ui/src/lib/templates/tickets-kanban/tickets-kanban.spec.ts` — updated to assert four computed groupings render

### Modified

- `projects/shared-ui/src/lib/templates/public-api.ts` — add `export * from './tickets-kanban/tickets-kanban';` and `export * from './tickets-kanban/tickets-kanban-types';`

No CSS variables are added to `*-tokens.css` files — this template composes existing core components and the kanban-board's own tokens already drive all sizing/spacing. The `build-typescript-design-token.cjs` script does **not** need to be re-run.

---

## Types (`tickets-kanban-types.ts`)

A **separate, narrower** type from the existing `ticket-details-types.ts` (different status set, different field shapes — intentional).

```ts
import { DateTime } from 'luxon';

/** all available kanban ticket status values, in workflow order */
export const allKanbanTicketStatuses = ['opened', 'in-progress', 'reviewing', 'completed'] as const;

/** the workflow status of a kanban ticket */
export type KanbanTicketStatus = (typeof allKanbanTicketStatuses)[number];

/** the user who created a ticket */
export type KanbanTicketUser = {
  /** unique id for the user */
  id: string;
  /** display name */
  name: string;
  /** email address (used by org-avatar to derive a gravatar) */
  email: string;
};

/** a single ticket rendered in the kanban */
export type KanbanTicket = {
  /** unique id for the ticket */
  id: string;
  /** short title shown as the card header */
  title: string;
  /** long-form description (truncated to 2 lines in the card) */
  description: string;
  /** when the ticket was created */
  createdAt: DateTime;
  /** the user that created the ticket */
  createdBy: KanbanTicketUser;
  /** when the ticket was last updated */
  updatedAt: DateTime;
  /** free-form string tags rendered as neutral org-tags */
  tags: string[];
  /** the current workflow status */
  status: KanbanTicketStatus;
};

/** human-readable heading rendered on each swimlane */
export const kanbanTicketStatusLabelMap: Record<KanbanTicketStatus, string> = {
  opened: 'Opened',
  'in-progress': 'In Progress',
  reviewing: 'Reviewing',
  completed: 'Completed',
};

/** the static seed list rendered by the template (lives here so stories / tests can reference it) */
export const defaultKanbanTickets: KanbanTicket[] = [
  // ~8-12 records spread across all four statuses so every lane is populated
  // (exact records authored in the implementation step)
];
```

**Notes:**

- `KanbanTicketUser.email` is used to derive a gravatar via `<org-avatar [imgEmail]="...">` — see the existing `Avatar` input `imgEmail` in `core/avatar/avatar.ts`.
- `DateTime` from `luxon` (per `.claude/rules/libraries.md` — luxon is the date library).
- All const arrays follow the "const + type derived from it" pattern from `.claude/rules/typescript/general.md`.

---

## Card Sub-Component (`tickets-kanban-card.ts`)

Reason this is a sub-component (per `.claude/rules/angular/component-breakout.md`): non-trivial styling (multi-line clamp, tag-row, avatar+timestamp footer) and lets the parent template stay a thin wiring layer.

```ts
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { dateUtils } from '@org/shared-utils/utils/date'; // direct path per .claude/rules — no project alias for own code
import { Avatar } from '../../core/avatar/avatar';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardHeader } from '../../core/card/card-header';
import { CardFooter } from '../../core/card/card-footer';
import { Tag } from '../../core/tags/tag';
import { type KanbanTicket } from './tickets-kanban-types';

@Component({
  selector: 'org-tickets-kanban-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Card, CardContent, CardHeader, CardFooter, Tag],
  templateUrl: './tickets-kanban-card.html',
  styleUrl: './tickets-kanban-card.css',
})
export class TicketsKanbanCard {
  /** the ticket record to render */
  public readonly ticket = input.required<KanbanTicket>();

  /** human-readable relative timestamp for the footer (e.g. "5 minutes ago") */
  protected readonly updatedRelative = computed<string>(() => dateUtils.fromNow(this.ticket().updatedAt));
}
```

```html
<!-- tickets-kanban-card.html -->
<org-card>
  <org-card-header [title]="ticket().title" />
  <org-card-content>
    <p class="description">{{ ticket().description }}</p>
    @if (ticket().tags.length > 0) {
    <div class="tags">
      @for (tag of ticket().tags; track tag) {
      <org-tag color="neutral" size="sm">{{ tag }}</org-tag>
      }
    </div>
    }
  </org-card-content>
  <org-card-footer>
    <div class="footer">
      <org-avatar
        size="sm"
        [imgEmail]="ticket().createdBy.email"
        [imgAlt]="ticket().createdBy.name"
        [showLabel]="true"
        [subLabel]="ticket().createdBy.name"
      />
      <span class="updated">{{ updatedRelative() }}</span>
    </div>
  </org-card-footer>
</org-card>
```

```css
/* tickets-kanban-card.css */
@layer components {
  .description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--base-spacing-2x);
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--base-spacing-2x);
  }

  .updated {
    font-size: var(--base-font-size-xs);
    color: var(--base-color-fg-muted);
  }
}
```

Per `.claude/rules/styling.md`: rules wrapped in `@layer components { ... }` since this is in `shared-ui` (note: this is in `templates/`, not `core/` — but templates compose core components so `@layer components` remains appropriate). All exact pixel values are avoided in favor of design tokens.

---

## Top-Level Template (`tickets-kanban.ts`)

```ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { KanbanBoard } from '../../core/kanban-board/kanban-board';
import { KanbanLane } from '../../core/kanban-board/kanban-lane';
import type { KanbanItemsMovedEvent } from '../../core/kanban-board/kanban-board';
import { TicketsKanbanCard } from './tickets-kanban-card';
import {
  allKanbanTicketStatuses,
  defaultKanbanTickets,
  kanbanTicketStatusLabelMap,
  type KanbanTicket,
  type KanbanTicketStatus,
} from './tickets-kanban-types';

/** event payload emitted when a ticket's status changes due to a cross-lane drag */
export type TicketsKanbanStatusChangedEvent = {
  /** the id of the ticket that moved */
  ticketId: string;
  /** the resulting status (target lane id) */
  status: KanbanTicketStatus;
};

@Component({
  selector: 'org-tickets-kanban',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KanbanBoard, KanbanLane, TicketsKanbanCard],
  templateUrl: './tickets-kanban.html',
  styleUrl: './tickets-kanban.css',
  host: {
    class: 'block',
  },
})
export class TicketsKanban {
  private readonly _ticketStatusChanged$ = new Subject<TicketsKanbanStatusChangedEvent>();

  private readonly _ticketClicked$ = new Subject<string>();

  /** the static list of tickets (owned by this template per requirements) */
  private readonly _tickets = signal<KanbanTicket[]>(defaultKanbanTickets);

  /** emitted when a card is dragged into a different lane */
  public readonly ticketStatusChanged = outputFromObservable(this._ticketStatusChanged$);

  /** emitted when a card is clicked (carries the ticket id) */
  public readonly ticketClicked = outputFromObservable(this._ticketClicked$);

  /** the ordered status list, exposed for the template's @for over lanes */
  protected readonly statuses = allKanbanTicketStatuses;

  /** label map exposed for the template */
  protected readonly statusLabels = kanbanTicketStatusLabelMap;

  /** one computed per status, grouping the source list by the ticket.status field */
  protected readonly openedTickets = computed<KanbanTicket[]>(() =>
    this._tickets().filter((ticket) => ticket.status === 'opened')
  );

  protected readonly inProgressTickets = computed<KanbanTicket[]>(() =>
    this._tickets().filter((ticket) => ticket.status === 'in-progress')
  );

  protected readonly reviewingTickets = computed<KanbanTicket[]>(() =>
    this._tickets().filter((ticket) => ticket.status === 'reviewing')
  );

  protected readonly completedTickets = computed<KanbanTicket[]>(() =>
    this._tickets().filter((ticket) => ticket.status === 'completed')
  );

  /** unified lookup so the template's @for can pull the right list by status */
  protected readonly ticketsByStatus = computed<Record<KanbanTicketStatus, KanbanTicket[]>>(() => ({
    opened: this.openedTickets(),
    'in-progress': this.inProgressTickets(),
    reviewing: this.reviewingTickets(),
    completed: this.completedTickets(),
  }));

  /** handles the kanban-board's itemsMoved event: cross-lane drag updates status, within-lane reorders the static list */
  protected onItemsMoved(event: KanbanItemsMovedEvent): void {
    const targetStatus = event.targetLaneId as KanbanTicketStatus;
    const movedIds = new Set(event.itemIds);

    this._tickets.update((current) => {
      const updated = current.map((ticket) => {
        if (!movedIds.has(ticket.id)) {
          return ticket;
        }

        if (ticket.status === targetStatus) {
          return ticket;
        }

        return { ...ticket, status: targetStatus };
      });

      // emit one event per ticket whose status actually changed
      for (const ticket of current) {
        if (!movedIds.has(ticket.id)) {
          continue;
        }

        if (ticket.status === targetStatus) {
          continue;
        }

        this._ticketStatusChanged$.next({ ticketId: ticket.id, status: targetStatus });
      }

      return updated;
    });
  }

  /** click handler attached at the card level */
  protected onCardClicked(ticketId: string): void {
    this._ticketClicked$.next(ticketId);
  }
}
```

```html
<!-- tickets-kanban.html -->
<org-kanban-board ariaLabel="Tickets kanban" (itemsMoved)="onItemsMoved($event)">
  @for (status of statuses; track status) {
  <org-kanban-lane [laneId]="status" [heading]="statusLabels[status]" [items]="ticketsByStatus()[status]">
    <ng-template #card let-item>
      <button class="card-click-target" type="button" (click)="onCardClicked(item.id)">
        <org-tickets-kanban-card [ticket]="item" />
      </button>
    </ng-template>
  </org-kanban-lane>
  }
</org-kanban-board>
```

**Click target detail:** The native `<button>` wraps the card to give a keyboard-accessible click affordance (per `.claude/rules/angular/templates.md` — "use the `button` html element when needing to create a generic element that has clickbility"). It needs an unstyled appearance so the card looks identical:

```css
/* tickets-kanban.css */
@layer components {
  .card-click-target {
    display: block;
    width: 100%;
    padding: 0;
    background: transparent;
    border: 0;
    text-align: inherit;
    cursor: pointer;
  }
}
```

---

## Architectural Decisions

1. **Status grouping via per-status `computed()` plus a unified `ticketsByStatus` computed.** The four `*Tickets` computeds satisfy the literal request ("each status grouping as a computed() property"); the unified `ticketsByStatus` is purely a template-side convenience to avoid a four-way `@switch` in the template. Both derive from the same `_tickets` source signal — single source of truth.

2. **State storage = single `_tickets` signal, not one signal per lane.** Matches `.claude/rules/angular/general.md`: "prefer organizing writable state into as few unified signal objects (ideally 1 called `_state`) instead of a signal per piece of data."

3. **Lane id ≡ ticket status string.** This makes the `KanbanItemsMovedEvent.targetLaneId` directly castable to `KanbanTicketStatus`, removing the need for a lane-id → status mapping.

4. **No `tickets` input.** Static list is internal per the prompt ("stored as a static list"). The storybook LiveDemo doesn't need a public input — it can render the template directly and observe the outputs.

5. **Outputs via Subject + `outputFromObservable()`.** Per `.claude/rules/use-cases/detected-output-has-listener.md` and the existing `ticket-details.ts` pattern — consistent with the rest of the codebase.

6. **Within-lane drag handling.** Because the data model has no explicit `order` field, within-lane drag is effectively a no-op in the data layer (status doesn't change, nothing else to reorder). The kanban-board will still animate the drop; the data stays as-is. This is intentional and called out in the LLM doc.

7. **Card click is on a wrapping `<button>`, not on `<org-kanban-card>`.** The kanban-card already owns drag/select interactions; routing a click event through it would risk colliding with the brain's selection logic (cmd/ctrl/shift+click). A discrete inner click target keeps the affordances separate.

---

## Stories (`tickets-kanban.stories.ts`)

Three stories, matching the rules in `.claude/rules/storybook/general.md`:

- **`Default`** — autodocs story with `org-tickets-kanban` rendered inside a height-constrained container (`block h-lg`). No controls (the template has no inputs).
- **`LiveDemo`** — wraps `org-tickets-kanban` in a `org-design-system-demo`, shows a "Last event" line bound to a signal that captures every `ticketStatusChanged` / `ticketClicked` payload. No controls (per CLAUDE.md: live demos should have controls for inputs, but this template has no inputs — the demo's value is observing outputs).
- **`Showcase`** — sections wrapped in `org-storybook-example-container` / `org-storybook-example-container-section`:
  - "Standard view" — the template as-is, all four lanes populated
  - "Single status loaded" — a variant story-component that overrides the internal list via DI / re-instantiation to show only `opened` tickets (uses the exported `defaultKanbanTickets` + a custom story component that owns a filtered list — falls back to the standard template if filtering proves out-of-scope)
  - Each section followed by an `<ul expected-behaviour>` listing observable expectations (drag cross-lane updates status; click emits ticket id; tags render as neutral pills; updated-at renders as relative)

Story file follows the structure of `projects/shared-ui/src/lib/templates/ticket-details/ticket-details.stories.ts`: a meta with `title: 'Templates/Tickets Kanban'`, `tags: ['autodocs']`, a docs description wrapped in `<div class="docs-top-level-overview">`, and `moduleMetadata` per render.

A separate `tickets-kanban.tests.stories.ts` is **not** in scope for this plan — no test stories were requested.

---

## Spec Update (`tickets-kanban.spec.ts`)

Replace the scaffold spec with assertions that:

1. The component creates.
2. Each of the four computed groupings (`openedTickets`, `inProgressTickets`, `reviewingTickets`, `completedTickets`) contains only tickets whose `status` matches the lane.
3. Four `org-kanban-lane` elements render with the expected `laneId`s.

Per `.claude/rules/testing/unit.md`: vitest APIs, no animation mocking, no debugElement unless 100% needed.

---

## llm.md (`projects/shared-ui/src/lib/templates/tickets-kanban/llm.md`)

A concise, LLM-optimized usage doc covering:

- What the template does (renders four-lane kanban over a static ticket list).
- The `KanbanTicket` shape + `KanbanTicketStatus` values.
- Drag semantics (cross-lane = status change, within-lane = no-op).
- The two outputs and their payloads.
- A minimal `<org-tickets-kanban (ticketStatusChanged)="..." (ticketClicked)="..." />` usage snippet.
- Note that there are no inputs and the data is owned internally — to swap the source list, fork the component or open an issue to add a `tickets` input.

---

## Implementation Checklist

- [ ] Create `tickets-kanban-types.ts` with the type, status const, label map, and seed records (8–12 tickets covering all four statuses, with realistic titles/descriptions/tags and varied `createdAt`/`updatedAt` to exercise `dateUtils.fromNow()` output).
- [ ] Create `tickets-kanban-card.ts` + `.html` + `.css`.
- [ ] Rewrite `tickets-kanban.ts` + `.html` + `.css`.
- [ ] Update `tickets-kanban.spec.ts` to cover the four computed groupings + lane render assertion.
- [ ] Create `tickets-kanban.stories.ts` with Default + LiveDemo + Showcase.
- [ ] Create `llm.md`.
- [ ] Add the two `export *` lines to `projects/shared-ui/src/lib/templates/public-api.ts`.
- [ ] Run `moon shared-ui:lint`, `moon shared-ui:test`, and `moon shared-ui:build-storybook` (or the project's equivalent tasks) to verify everything passes.

---

## Out of Scope

- No new design tokens; no edits to `*-tokens.css` files; no `moon :build-design-tokens` run.
- No `tickets-kanban.tests.stories.ts` (no test stories requested).
- No `tickets` input — list is internal per the requirement.
- No per-lane color treatment on the kanban-board lane header.
- No view-layer (no `projects/customer-portal` / `projects/internal-portal`) consumer of this template.
