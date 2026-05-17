import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { TicketsKanban } from './tickets-kanban';
import {
  allKanbanTicketStatuses,
  defaultKanbanTickets,
  type KanbanTicket,
  type KanbanTicketStatus,
} from './tickets-kanban-types';

/** read-only window into the protected per-status computeds for assertion purposes */
type TicketsKanbanInternals = {
  openedTickets: () => KanbanTicket[];
  inProgressTickets: () => KanbanTicket[];
  reviewingTickets: () => KanbanTicket[];
  completedTickets: () => KanbanTicket[];
};

const groupingAccessorMap: Record<KanbanTicketStatus, keyof TicketsKanbanInternals> = {
  opened: 'openedTickets',
  'in-progress': 'inProgressTickets',
  reviewing: 'reviewingTickets',
  completed: 'completedTickets',
};

describe('TicketsKanban', () => {
  let component: TicketsKanban;
  let fixture: ComponentFixture<TicketsKanban>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsKanban],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketsKanban);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('status groupings', () => {
    it.each(allKanbanTicketStatuses)('only contains tickets with status "%s" in its grouping', (status) => {
      const internals = component as unknown as TicketsKanbanInternals;
      const grouping = internals[groupingAccessorMap[status]]();
      const expectedCount = defaultKanbanTickets.filter((ticket) => ticket.status === status).length;

      expect(grouping.length).toBe(expectedCount);

      for (const ticket of grouping) {
        expect(ticket.status).toBe(status);
      }
    });

    it('the union of all four groupings equals the seed list length', () => {
      const internals = component as unknown as TicketsKanbanInternals;
      const total = allKanbanTicketStatuses.reduce(
        (sum, status) => sum + internals[groupingAccessorMap[status]]().length,
        0
      );

      expect(total).toBe(defaultKanbanTickets.length);
    });
  });

  describe('lane rendering', () => {
    it('renders one org-kanban-lane per status', () => {
      const lanes = fixture.nativeElement.querySelectorAll('org-kanban-lane');

      expect(lanes.length).toBe(allKanbanTicketStatuses.length);
    });
  });
});
