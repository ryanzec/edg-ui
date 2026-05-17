import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DateTime } from 'luxon';
import {
  TicketDetails,
  type Ticket,
  type TicketUser,
  type TicketStatus,
  type TicketDetailsAcceptanceCriterionToggledEvent,
  type TicketDetailsSubtaskToggledEvent,
} from '@organization/shared-ui';
import { logManager } from '@organization/shared-utils';

/** users referenced across the mocked ticket fixture */
const DAN_OLSEN: TicketUser = { id: 'u-do', name: 'Dan Olsen', initials: 'DO' };
const PRIYA_SHAH: TicketUser = { id: 'u-ps', name: 'Priya Shah', initials: 'PS' };
const YUKI_TANAKA: TicketUser = { id: 'u-yt', name: 'Yuki Tanaka', initials: 'YT' };
const MAYA_BRENNAN: TicketUser = { id: 'u-mb', name: 'Maya Brennan', initials: 'MB' };
const SOFIA_RIVERA: TicketUser = { id: 'u-sr', name: 'Sofia Rivera', initials: 'SR' };

/** mocked ticket record consumed by the demo composition view */
const MOCK_TICKET: Ticket = {
  code: 'BCN-412',
  type: 'bug',
  openedAt: DateTime.fromISO('2026-04-24T00:00:00Z'),
  title: 'Refresh-token rotation breaks Safari ITP — users signed out after 7 days',
  status: 'in-progress',
  assignee: PRIYA_SHAH,
  priority: 'p1',
  dueDate: DateTime.fromISO('2026-05-19T00:00:00Z'),
  collaborators: [PRIYA_SHAH, DAN_OLSEN, YUKI_TANAKA, MAYA_BRENNAN],
  blocked: {
    reason: 'Waiting on BCN-388 · Auth service: rotate-on-read endpoint',
  },
  description:
    "Safari (ITP) clamps the lifetime of cookies set via document.cookie to 7 days. Our refresh-token rotation issues a new cookie on every refresh, but because the new cookie inherits the same Date/Max-Age semantics, Safari folds it back to the original 7-day expiry — meaning anyone who isn't active in a 7-day window gets signed out.\n\nAffects roughly 12% of weekly actives on macOS Safari and ~6% on iOS. We confirmed via the auth-events table: a clean spike in session.expired_no_refresh events every Monday morning.",
  stepsToReproduce: [
    { content: 'Sign in to app.acme.com on Safari 17+ (macOS or iOS).' },
    { content: 'Inspect auth_rt cookie — note Max-Age ≤ 604800.' },
    { content: 'Skip 8 days. Return to the site.' },
    { content: 'Expected: silent refresh; remain signed in.' },
    { content: 'Actual: redirected to /login with session.expired event.' },
  ],
  acceptanceCriteria: [
    { id: 'ac-1', label: 'Refresh-token cookies survive ≥ 30-day inactivity on Safari 17+.', completed: false },
    { id: 'ac-2', label: 'Server-set `Set-Cookie` replaces document.cookie path entirely.', completed: false },
    {
      id: 'ac-3',
      label: 'Auth-events show `session.expired_no_refresh` drops to <0.5% of weekly actives.',
      completed: false,
    },
    { id: 'ac-4', label: 'No regression on Chrome / Firefox / Edge.', completed: false },
  ],
  properties: {
    reporter: DAN_OLSEN,
    estimate: '3d',
    branch: 'auth/rotate-tokens-safari-itp',
    environment: 'Production · Web',
    labels: [{ label: 'safari' }, { label: 'cookies' }, { label: 'auth-token' }, { label: 'web-only' }],
  },
  subtasks: [
    { id: 'st-1', code: 'BCN-413', title: 'Move cookie issuance to server-side Set-Cookie', completed: true },
    { id: 'st-2', code: 'BCN-414', title: 'Add Partitioned (CHIPS) attribute for cross-site widgets', completed: true },
    { id: 'st-3', code: 'BCN-415', title: 'Backfill rotation on first request for legacy cookies', completed: false },
    {
      id: 'st-4',
      code: 'BCN-416',
      title: 'Regression suite: 8-day skip on Safari/iOS via Playwright',
      completed: false,
    },
    { id: 'st-5', code: 'BCN-417', title: 'Doc: cookie lifetime + SSO interaction', completed: false },
  ],
  connectedWork: [
    {
      kind: 'parent',
      id: 'cw-parent-1',
      code: 'BCN-300',
      title: 'Q2: Reduce involuntary sign-outs to <1% weekly',
    },
    {
      kind: 'blocked-by',
      id: 'cw-blocked-1',
      code: 'BCN-388',
      title: 'Auth service: rotate-on-read endpoint',
      status: 'in-review',
      assignee: YUKI_TANAKA,
    },
    {
      kind: 'linked-pr',
      id: 'cw-pr-1',
      code: '#2841',
      title: 'auth: rotate refresh tokens on every use',
      state: 'merged',
      author: PRIYA_SHAH,
    },
    {
      kind: 'linked-pr',
      id: 'cw-pr-2',
      code: '#2902',
      title: 'auth: server-side Set-Cookie path',
      state: 'open',
      author: PRIYA_SHAH,
    },
    {
      kind: 'linked-pr',
      id: 'cw-pr-3',
      code: '#2914',
      title: 'tests: 8-day Safari skip via Playwright',
      state: 'draft',
      author: SOFIA_RIVERA,
    },
  ],
  connectedWorkAttentionCount: 1,
  activity: [
    {
      type: 'change',
      id: 'act-1',
      user: DAN_OLSEN,
      timestamp: DateTime.fromISO('2026-04-24T09:12:00Z'),
      changeType: 'created',
      description: 'created this ticket',
    },
    {
      type: 'change',
      id: 'act-2',
      user: DAN_OLSEN,
      timestamp: DateTime.fromISO('2026-04-24T09:14:00Z'),
      changeType: 'assigned',
      description: 'assigned to Priya Shah',
    },
    {
      type: 'change',
      id: 'act-3',
      user: PRIYA_SHAH,
      timestamp: DateTime.fromISO('2026-04-25T11:02:00Z'),
      changeType: 'moved',
      description: 'moved to In progress',
    },
    {
      type: 'comment',
      id: 'act-4',
      user: PRIYA_SHAH,
      timestamp: DateTime.fromISO('2026-04-26T16:48:00Z'),
      body: "Got it reproducing locally with Safari Tech Preview. The root cause is ITP clamping any Set-Cookie issued from JavaScript to 7 days — our SDK does that on every silent refresh. I'm moving cookie issuance to the auth-service so we get a real first-party Set-Cookie from the server response.",
    },
    {
      type: 'change',
      id: 'act-5',
      user: PRIYA_SHAH,
      timestamp: DateTime.fromISO('2026-04-28T14:30:00Z'),
      changeType: 'opened-pr',
      description: 'opened #2841 · auth: rotate refresh tokens on every use',
    },
    {
      type: 'change',
      id: 'act-6',
      user: PRIYA_SHAH,
      timestamp: DateTime.fromISO('2026-04-30T18:14:00Z'),
      changeType: 'merged-pr',
      description: 'merged #2841 · auth: rotate refresh tokens on every use',
    },
    {
      type: 'comment',
      id: 'act-7',
      user: YUKI_TANAKA,
      timestamp: DateTime.fromISO('2026-05-02T22:01:00Z'),
      body: "Confirmed the auth-events drop after #2841 — session.expired_no_refresh fell from 11.8% → 3.4% on macOS Safari. Still seeing tail of legacy cookies issued before the change; we'll need a one-off backfill on next request.",
    },
    {
      type: 'change',
      id: 'act-8',
      user: YUKI_TANAKA,
      timestamp: DateTime.fromISO('2026-05-04T13:22:00Z'),
      changeType: 'completed-subtask',
      description: 'completed BCN-414 · Partitioned (CHIPS)',
    },
    {
      type: 'comment',
      id: 'act-9',
      user: MAYA_BRENNAN,
      timestamp: DateTime.fromISO('2026-05-06T09:30:00Z'),
      body: 'Stakeholders are asking when this hits prod for the iOS WebView SDK too. Can we confirm the partner build inherits Set-Cookie semantics? Asked Sofia to review the SSO interaction in parallel.',
    },
    {
      type: 'change',
      id: 'act-10',
      user: PRIYA_SHAH,
      timestamp: DateTime.fromISO('2026-05-09T17:45:00Z'),
      changeType: 'blocked-by',
      description: 'blocked by BCN-388 · rotate-on-read endpoint',
    },
    {
      type: 'change',
      id: 'act-11',
      user: PRIYA_SHAH,
      timestamp: DateTime.fromISO('2026-05-14T11:48:00Z'),
      changeType: 'requested-review',
      description: 'requested review on #2902',
    },
  ],
};

/**
 * page-level demo view that renders `<org-ticket-details>` against a hardcoded in-memory ticket fixture
 * so the view renders end-to-end without a real backend. the surrounding application chrome is provided
 * by the `<org-application-frame>` at the app shell level.
 */
@Component({
  selector: 'cp-demo-ticket-details-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TicketDetails],
  templateUrl: './ticket-details-view.html',
})
export class TicketDetailsView {
  /** the mocked ticket rendered by the embedded ticket-details template */
  protected readonly ticket = signal<Ticket>(MOCK_TICKET);

  /** logs a status-change request emitted by the ticket-details template */
  protected onStatusChanged(status: TicketStatus): void {
    logManager.log({ type: 'demo-ticket-details-view-status-changed', status });
  }

  /** logs a comment submission emitted by the activity composer */
  protected onCommentSubmitted(comment: string): void {
    logManager.log({ type: 'demo-ticket-details-view-comment-submitted', comment });
  }

  /** logs a subtask toggle emitted by the subtasks sub-component */
  protected onSubtaskToggled(event: TicketDetailsSubtaskToggledEvent): void {
    logManager.log({ type: 'demo-ticket-details-view-subtask-toggled', event });
  }

  /** logs an add-subtask request emitted by the subtasks sub-component */
  protected onSubtaskAddRequested(): void {
    logManager.log({ type: 'demo-ticket-details-view-subtask-add-requested' });
  }

  /** logs an acceptance-criterion toggle emitted by the checklist */
  protected onAcceptanceCriterionToggled(event: TicketDetailsAcceptanceCriterionToggledEvent): void {
    logManager.log({ type: 'demo-ticket-details-view-acceptance-criterion-toggled', event });
  }

  /** logs an unblock action emitted by the blocked banner */
  protected onUnblock(): void {
    logManager.log({ type: 'demo-ticket-details-view-unblock' });
  }

  /** logs a ping-owner action emitted by the blocked banner */
  protected onPingOwner(): void {
    logManager.log({ type: 'demo-ticket-details-view-ping-owner' });
  }

  /** logs a description-edit request emitted by the ticket-details template */
  protected onDescriptionEditRequested(): void {
    logManager.log({ type: 'demo-ticket-details-view-description-edit-requested' });
  }

  protected onDueDateChanged(value: DateTime): void {
    logManager.log({ type: 'demo-ticket-details-view-due-date-selected', value });
  }
}
