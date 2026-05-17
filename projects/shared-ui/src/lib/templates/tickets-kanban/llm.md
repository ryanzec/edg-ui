# org-tickets-kanban

Template component. Renders a static list of tickets across four status swimlanes using `org-kanban-board`. Located at `projects/shared-ui/src/lib/templates/tickets-kanban/`.

## Selector

`org-tickets-kanban`

## Inputs

None. The ticket list is owned internally as a private signal seeded from `defaultKanbanTickets`. To change the dataset, modify `defaultKanbanTickets` in `tickets-kanban-types.ts` or fork the template.

## Outputs

- `ticketStatusChanged` — `{ ticketId: string; status: KanbanTicketStatus }` — fires when a cross-lane drag updates a ticket's status. Does NOT fire for within-lane drag.
- `ticketClicked` — `string` (the ticket id) — fires when a card is clicked.

## Types

From `./tickets-kanban-types.ts`:

```ts
type KanbanTicketStatus = 'opened' | 'in-progress' | 'reviewing' | 'completed';

type KanbanTicketUser = {
  id: string;
  name: string;
  email: string; // used by org-avatar for gravatar lookup
};

type KanbanTicket = {
  id: string;
  title: string;
  description: string;
  createdAt: DateTime; // luxon
  createdBy: KanbanTicketUser;
  updatedAt: DateTime; // luxon — rendered relative via dateUtils.fromNow()
  tags: string[];
  status: KanbanTicketStatus;
};
```

Exports: `allKanbanTicketStatuses`, `kanbanTicketStatusLabelMap`, `defaultKanbanTickets`.

## Drag semantics

- **Cross-lane drag** → mutates `_tickets` so the moved ticket's `status` becomes the target lane id; emits one `ticketStatusChanged` per ticket that actually changed.
- **Within-lane drag** → no-op. The data model has no ordering field, so reorder events are intentionally dropped.
- Multi-select drag (cmd/ctrl/shift+click then drag) moves the whole selection; one event per ticket whose status changed.

## Architecture

- Lane id ≡ status string, so `KanbanItemsMovedEvent.targetLaneId` casts directly to `KanbanTicketStatus`.
- Status grouping: one `computed<KanbanTicket[]>()` per status (`openedTickets`, `inProgressTickets`, `reviewingTickets`, `completedTickets`) plus a unified `ticketsByStatus` computed used by the template's `@for` over lanes. All derive from a single `_tickets` signal.
- Card visuals live in the `TicketsKanbanCard` sub-component (`org-tickets-kanban-card`), composed of `org-card` + `org-card-header` + `org-card-content` + `org-card-footer` + `org-avatar` + `org-tag`.
- Click target is a native `<button>` wrapping the card inside the `<ng-template #card>` — keeps click affordance separate from the kanban-card brain's drag/select interactions.

## Usage

```html
<org-tickets-kanban (ticketStatusChanged)="onStatusChanged($event)" (ticketClicked)="onTicketClicked($event)" />
```

The host element is `display: block` (set via `host: { class: 'block' }`). Constrain its height in the consumer (e.g. `class="block h-lg"`) so the internal kanban-board can scroll properly.

## Related

- Core composition: `projects/shared-ui/src/lib/core/kanban-board/` (`org-kanban-board`, `org-kanban-lane`, `org-kanban-card`).
- Sibling template (richer single-ticket view, different status taxonomy): `projects/shared-ui/src/lib/templates/ticket-details/`.
