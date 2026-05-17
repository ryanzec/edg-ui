import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TicketsKanban, type TicketsKanbanStatusChangedEvent } from '@organization/shared-ui';
import { logManager } from '@organization/shared-utils';

/**
 * page-level demo view that renders `<org-tickets-kanban>` against the template's built-in
 * in-memory ticket fixture so the view renders end-to-end without a real backend. the
 * surrounding application chrome is provided by the `<org-application-frame>` at the app shell level.
 */
@Component({
  selector: 'cp-demo-kanban-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TicketsKanban],
  templateUrl: './kanban-view.html',
})
export class KanbanView {
  /** logs a cross-lane status change emitted by the tickets-kanban template */
  protected onTicketStatusChanged(event: TicketsKanbanStatusChangedEvent): void {
    logManager.log({ type: 'demo-kanban-view-ticket-status-changed', event });
  }

  /** logs a card click emitted by the tickets-kanban template */
  protected onTicketClicked(ticketId: string): void {
    logManager.log({ type: 'demo-kanban-view-ticket-clicked', ticketId });
  }
}
