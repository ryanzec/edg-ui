import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';
import { TicketDetails } from './ticket-details';
import { type Ticket } from './ticket-details-types';

const sampleTicket: Ticket = {
  code: 'BCN-1',
  type: 'bug',
  openedAt: DateTime.fromISO('2026-04-24T00:00:00Z'),
  title: 'Sample ticket',
  status: 'in-progress',
  assignee: { id: 'u1', name: 'Sam Doe', initials: 'SD' },
  priority: 'p2',
  dueDate: DateTime.fromISO('2026-05-19T00:00:00Z'),
  collaborators: [],
  description: 'Sample description',
  stepsToReproduce: [],
  acceptanceCriteria: [],
  properties: {
    reporter: { id: 'u2', name: 'Reporter User', initials: 'RU' },
    estimate: '1d',
    branch: 'main',
    environment: 'Production',
    labels: [],
  },
  subtasks: [],
  connectedWork: [],
  connectedWorkAttentionCount: 0,
  activity: [],
};

describe('TicketDetails', () => {
  let component: TicketDetails;
  let fixture: ComponentFixture<TicketDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketDetails);
    fixture.componentRef.setInput('ticket', sampleTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
