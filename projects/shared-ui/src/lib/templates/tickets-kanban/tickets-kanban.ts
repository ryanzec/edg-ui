import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { KanbanBoard, type KanbanItemsMovedEvent } from '../../core/kanban-board/kanban-board';
import { KanbanLane } from '../../core/kanban-board/kanban-lane';
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

  /** the static list of tickets owned by this template */
  private readonly _tickets = signal<KanbanTicket[]>(defaultKanbanTickets);

  /** emitted when a card is dragged into a different lane and its status changes */
  public readonly ticketStatusChanged = outputFromObservable(this._ticketStatusChanged$);

  /** emitted when a card is clicked (payload is the ticket id) */
  public readonly ticketClicked = outputFromObservable(this._ticketClicked$);

  /** the ordered status list exposed for the template's @for over lanes */
  protected readonly statuses = allKanbanTicketStatuses;

  /** the lane heading label map exposed for the template */
  protected readonly statusLabels = kanbanTicketStatusLabelMap;

  /** tickets currently in the opened lane */
  protected readonly openedTickets = computed<KanbanTicket[]>(() =>
    this._tickets().filter((ticket) => ticket.status === 'opened')
  );

  /** tickets currently in the in-progress lane */
  protected readonly inProgressTickets = computed<KanbanTicket[]>(() =>
    this._tickets().filter((ticket) => ticket.status === 'in-progress')
  );

  /** tickets currently in the reviewing lane */
  protected readonly reviewingTickets = computed<KanbanTicket[]>(() =>
    this._tickets().filter((ticket) => ticket.status === 'reviewing')
  );

  /** tickets currently in the completed lane */
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

  /** handles a kanban-board drag-and-drop: cross-lane drag updates status; within-lane drag is a no-op */
  protected onItemsMoved(event: KanbanItemsMovedEvent): void {
    if (event.sourceLaneId === event.targetLaneId) {
      return;
    }

    const targetStatus = event.targetLaneId as KanbanTicketStatus;
    const movedIds = new Set(event.itemIds);

    for (const ticket of this._tickets()) {
      if (!movedIds.has(ticket.id)) {
        continue;
      }

      if (ticket.status === targetStatus) {
        continue;
      }

      this._ticketStatusChanged$.next({ ticketId: ticket.id, status: targetStatus });
    }

    this._tickets.update((current) =>
      current.map((ticket) => {
        if (!movedIds.has(ticket.id)) {
          return ticket;
        }

        if (ticket.status === targetStatus) {
          return ticket;
        }

        return { ...ticket, status: targetStatus };
      })
    );
  }

  /** handles a card click; emits the clicked ticket's id to consumers */
  protected onCardClicked(ticketId: string): void {
    this._ticketClicked$.next(ticketId);
  }
}
