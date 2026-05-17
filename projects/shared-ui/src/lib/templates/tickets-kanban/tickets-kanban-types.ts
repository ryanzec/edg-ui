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
  /** email address (used by org-avatar to derive a gravatar image) */
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

const mayaBrennan: KanbanTicketUser = {
  id: 'u-mb',
  name: 'Maya Brennan',
  email: 'maya.brennan@example.com',
};

const danOlsen: KanbanTicketUser = {
  id: 'u-do',
  name: 'Dan Olsen',
  email: 'dan.olsen@example.com',
};

const priyaShah: KanbanTicketUser = {
  id: 'u-ps',
  name: 'Priya Shah',
  email: 'priya.shah@example.com',
};

const yukiTanaka: KanbanTicketUser = {
  id: 'u-yt',
  name: 'Yuki Tanaka',
  email: 'yuki.tanaka@example.com',
};

const sofiaRivera: KanbanTicketUser = {
  id: 'u-sr',
  name: 'Sofia Rivera',
  email: 'sofia.rivera@example.com',
};

const liorAvni: KanbanTicketUser = {
  id: 'u-la',
  name: 'Lior Avni',
  email: 'lior.avni@example.com',
};

/** the static seed list rendered by the template; values cover all four statuses with varied recency */
export const defaultKanbanTickets: KanbanTicket[] = [
  {
    id: 't-001',
    title: 'Audit logging gaps in billing endpoints',
    description:
      'Several billing endpoints are missing structured logging, making it hard to correlate failures with downstream invoice generation. Catalog the gaps and propose a logging contract.',
    createdAt: DateTime.fromISO('2026-05-10T09:00:00Z'),
    createdBy: mayaBrennan,
    updatedAt: DateTime.fromISO('2026-05-15T14:22:00Z'),
    tags: ['observability', 'billing'],
    status: 'opened',
  },
  {
    id: 't-002',
    title: 'Refresh onboarding doc for the new SSO flow',
    description:
      'The internal onboarding guide still references the legacy SSO redirect. Update screenshots and the troubleshooting section.',
    createdAt: DateTime.fromISO('2026-05-12T16:30:00Z'),
    createdBy: liorAvni,
    updatedAt: DateTime.fromISO('2026-05-14T08:10:00Z'),
    tags: ['docs', 'sso'],
    status: 'opened',
  },
  {
    id: 't-003',
    title: 'Triage support backlog before Friday',
    description:
      'Aim to clear or assign every ticket older than 14 days. Pull a fresh report Monday morning and tag anything blocked.',
    createdAt: DateTime.fromISO('2026-05-13T11:45:00Z'),
    createdBy: mayaBrennan,
    updatedAt: DateTime.fromISO('2026-05-16T07:05:00Z'),
    tags: ['support'],
    status: 'opened',
  },
  {
    id: 't-004',
    title: 'Migrate auth middleware to vault adapter',
    description:
      'Replace the legacy token store with the vault adapter. Coordinate with the security team on rollout windows and make sure rollback is non-destructive.',
    createdAt: DateTime.fromISO('2026-05-05T13:15:00Z'),
    createdBy: danOlsen,
    updatedAt: DateTime.fromISO('2026-05-16T10:48:00Z'),
    tags: ['auth', 'security', 'migration'],
    status: 'in-progress',
  },
  {
    id: 't-005',
    title: 'Refactor billing module: extract usage calculation',
    description:
      'Pull the usage calculation out of the BillingService and into a dedicated UsageService so it can be reused by the upcoming reporting view.',
    createdAt: DateTime.fromISO('2026-05-08T10:20:00Z'),
    createdBy: priyaShah,
    updatedAt: DateTime.fromISO('2026-05-15T18:30:00Z'),
    tags: ['billing', 'refactor'],
    status: 'in-progress',
  },
  {
    id: 't-006',
    title: 'Telemetry dashboard PR awaiting approvals',
    description:
      'Two approvals still required before the new telemetry dashboard can ship. Pinged the reviewers; no blockers raised in feedback.',
    createdAt: DateTime.fromISO('2026-05-09T15:00:00Z'),
    createdBy: liorAvni,
    updatedAt: DateTime.fromISO('2026-05-15T22:15:00Z'),
    tags: ['telemetry', 'review'],
    status: 'reviewing',
  },
  {
    id: 't-007',
    title: 'Profile photo upload — performance regression PR',
    description:
      'Backend changes look good; waiting on a final pass from the frontend group. Includes the new size-guard middleware behind a feature flag.',
    createdAt: DateTime.fromISO('2026-05-11T17:42:00Z'),
    createdBy: sofiaRivera,
    updatedAt: DateTime.fromISO('2026-05-16T09:00:00Z'),
    tags: ['perf', 'media'],
    status: 'reviewing',
  },
  {
    id: 't-008',
    title: 'Q1 retrospective notes published',
    description:
      'Notes from the Q1 retrospective are published to the internal wiki, including the action-item owners and revisit dates.',
    createdAt: DateTime.fromISO('2026-04-22T09:00:00Z'),
    createdBy: mayaBrennan,
    updatedAt: DateTime.fromISO('2026-04-25T12:00:00Z'),
    tags: ['process'],
    status: 'completed',
  },
  {
    id: 't-009',
    title: 'Vendor security review for the analytics processor',
    description:
      'Legal review approved with one redline on data retention. Ticket closed after the redline was merged into the contract.',
    createdAt: DateTime.fromISO('2026-04-18T14:30:00Z'),
    createdBy: danOlsen,
    updatedAt: DateTime.fromISO('2026-04-30T16:45:00Z'),
    tags: ['security', 'vendor'],
    status: 'completed',
  },
  {
    id: 't-010',
    title: 'Promote staging metrics pipeline to production',
    description:
      'Pipeline ran clean for two weeks in staging. Promoted to production with the monitoring dashboards updated to point at the new topics.',
    createdAt: DateTime.fromISO('2026-04-30T11:00:00Z'),
    createdBy: yukiTanaka,
    updatedAt: DateTime.fromISO('2026-05-09T10:30:00Z'),
    tags: ['metrics', 'pipeline'],
    status: 'completed',
  },
];
