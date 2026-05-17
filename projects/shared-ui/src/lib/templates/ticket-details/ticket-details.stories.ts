import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DateTime } from 'luxon';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { TicketDetails, type TicketDetailsSubtaskToggledEvent } from './ticket-details';
import {
  allTicketPriorities,
  allTicketStatuses,
  allTicketTypes,
  type Ticket,
  type TicketPriority,
  type TicketStatus,
  type TicketType,
  type TicketUser,
} from './ticket-details-types';

const danOlsen: TicketUser = { id: 'u-do', name: 'Dan Olsen', initials: 'DO' };
const priyaShah: TicketUser = { id: 'u-ps', name: 'Priya Shah', initials: 'PS' };
const yukiTanaka: TicketUser = { id: 'u-yt', name: 'Yuki Tanaka', initials: 'YT' };
const mayaBrennan: TicketUser = { id: 'u-mb', name: 'Maya Brennan', initials: 'MB' };
const sofiaRivera: TicketUser = { id: 'u-sr', name: 'Sofia Rivera', initials: 'SR' };

const baseTicket: Ticket = {
  code: 'BCN-412',
  type: 'bug',
  openedAt: DateTime.fromISO('2026-04-24T00:00:00Z'),
  title: 'Refresh-token rotation breaks Safari ITP — users signed out after 7 days',
  status: 'in-progress',
  assignee: priyaShah,
  priority: 'p1',
  dueDate: DateTime.fromISO('2026-05-19T00:00:00Z'),
  collaborators: [priyaShah, danOlsen, yukiTanaka, mayaBrennan],
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
    reporter: danOlsen,
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
      assignee: yukiTanaka,
    },
    {
      kind: 'linked-pr',
      id: 'cw-pr-1',
      code: '#2841',
      title: 'auth: rotate refresh tokens on every use',
      state: 'merged',
      author: priyaShah,
    },
    {
      kind: 'linked-pr',
      id: 'cw-pr-2',
      code: '#2902',
      title: 'auth: server-side Set-Cookie path',
      state: 'open',
      author: priyaShah,
    },
    {
      kind: 'linked-pr',
      id: 'cw-pr-3',
      code: '#2914',
      title: 'tests: 8-day Safari skip via Playwright',
      state: 'draft',
      author: sofiaRivera,
    },
  ],
  connectedWorkAttentionCount: 1,
  activity: [
    {
      type: 'change',
      id: 'act-1',
      user: danOlsen,
      timestamp: DateTime.fromISO('2026-04-24T09:12:00Z'),
      changeType: 'created',
      description: 'created this ticket',
    },
    {
      type: 'change',
      id: 'act-2',
      user: danOlsen,
      timestamp: DateTime.fromISO('2026-04-24T09:14:00Z'),
      changeType: 'assigned',
      description: 'assigned to Priya Shah',
    },
    {
      type: 'change',
      id: 'act-3',
      user: priyaShah,
      timestamp: DateTime.fromISO('2026-04-25T11:02:00Z'),
      changeType: 'moved',
      description: 'moved to In progress',
    },
    {
      type: 'comment',
      id: 'act-4',
      user: priyaShah,
      timestamp: DateTime.fromISO('2026-04-26T16:48:00Z'),
      body: "Got it reproducing locally with Safari Tech Preview. The root cause is ITP clamping any Set-Cookie issued from JavaScript to 7 days — our SDK does that on every silent refresh. I'm moving cookie issuance to the auth-service so we get a real first-party Set-Cookie from the server response.",
    },
    {
      type: 'change',
      id: 'act-5',
      user: priyaShah,
      timestamp: DateTime.fromISO('2026-04-28T14:30:00Z'),
      changeType: 'opened-pr',
      description: 'opened #2841 · auth: rotate refresh tokens on every use',
    },
    {
      type: 'change',
      id: 'act-6',
      user: priyaShah,
      timestamp: DateTime.fromISO('2026-04-30T18:14:00Z'),
      changeType: 'merged-pr',
      description: 'merged #2841 · auth: rotate refresh tokens on every use',
    },
    {
      type: 'comment',
      id: 'act-7',
      user: yukiTanaka,
      timestamp: DateTime.fromISO('2026-05-02T22:01:00Z'),
      body: "Confirmed the auth-events drop after #2841 — session.expired_no_refresh fell from 11.8% → 3.4% on macOS Safari. Still seeing tail of legacy cookies issued before the change; we'll need a one-off backfill on next request.",
    },
    {
      type: 'change',
      id: 'act-8',
      user: yukiTanaka,
      timestamp: DateTime.fromISO('2026-05-04T13:22:00Z'),
      changeType: 'completed-subtask',
      description: 'completed BCN-414 · Partitioned (CHIPS)',
    },
    {
      type: 'comment',
      id: 'act-9',
      user: mayaBrennan,
      timestamp: DateTime.fromISO('2026-05-06T09:30:00Z'),
      body: 'Stakeholders are asking when this hits prod for the iOS WebView SDK too. Can we confirm the partner build inherits Set-Cookie semantics? Asked Sofia to review the SSO interaction in parallel.',
    },
    {
      type: 'change',
      id: 'act-10',
      user: priyaShah,
      timestamp: DateTime.fromISO('2026-05-09T17:45:00Z'),
      changeType: 'blocked-by',
      description: 'blocked by BCN-388 · rotate-on-read endpoint',
    },
    {
      type: 'change',
      id: 'act-11',
      user: priyaShah,
      timestamp: DateTime.fromISO('2026-05-14T11:48:00Z'),
      changeType: 'requested-review',
      description: 'requested review on #2902',
    },
  ],
};

const unblockedTicket: Ticket = {
  ...baseTicket,
  blocked: undefined,
  status: 'in-review',
};

@Component({
  selector: 'story-ticket-details-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TicketDetails],
  template: `
    <div class="p-4">
      <org-ticket-details
        [ticket]="currentTicket()"
        (statusChanged)="onStatusChanged($event)"
        (dueDateChanged)="onDueDateChanged($event)"
        (commentSubmitted)="onCommentSubmitted($event)"
        (subtaskToggled)="onSubtaskToggled($event)"
        (subtaskAddRequested)="onSubtaskAddRequested()"
        (unblock)="onUnblock()"
        (pingOwner)="onPingOwner()"
        (descriptionEditRequested)="onDescriptionEditRequested()"
      />
      <div class="mt-4 text-xs text-muted">Last event: {{ lastEvent() ?? '—' }}</div>
    </div>
  `,
})
class TicketDetailsLiveDemoStory {
  public readonly status = signal<TicketStatus>('in-progress');
  public readonly priority = signal<TicketPriority>('p1');
  public readonly type = signal<TicketType>('bug');
  public readonly blocked = signal<boolean>(true);

  protected readonly currentTicket = signal<Ticket>(baseTicket);

  protected readonly lastEvent = signal<string | null>(null);

  protected onStatusChanged(value: TicketStatus): void {
    this.lastEvent.set(`statusChanged → ${value}`);
    this.currentTicket.update((ticket) => ({ ...ticket, status: value }));
  }

  protected onDueDateChanged(value: DateTime): void {
    this.lastEvent.set(`dueDateChanged → ${value.toISO()}`);
    this.currentTicket.update((ticket) => ({ ...ticket, dueDate: value }));
  }

  protected onCommentSubmitted(comment: string): void {
    this.lastEvent.set(`commentSubmitted: ${comment}`);
  }

  protected onSubtaskToggled(event: TicketDetailsSubtaskToggledEvent): void {
    this.lastEvent.set(`subtaskToggled: ${event.id} → ${event.completed}`);
    this.currentTicket.update((ticket) => ({
      ...ticket,
      subtasks: ticket.subtasks.map((subtask) =>
        subtask.id === event.id ? { ...subtask, completed: event.completed } : subtask
      ),
    }));
  }

  protected onSubtaskAddRequested(): void {
    this.lastEvent.set('subtaskAddRequested');
  }

  protected onUnblock(): void {
    this.lastEvent.set('unblock');
  }

  protected onPingOwner(): void {
    this.lastEvent.set('pingOwner');
  }

  protected onDescriptionEditRequested(): void {
    this.lastEvent.set('descriptionEditRequested');
  }
}

const meta: Meta<TicketDetails> = {
  title: 'Templates/Ticket Details',
  component: TicketDetails,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [TicketDetails, StorybookExampleContainer, StorybookExampleContainerSection],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Ticket Details

  A composite template view for displaying every aspect of a single ticket: meta line, title,
  status / assignee / priority / due / collaborators chips, optional blocked banner, description
  with steps-to-reproduce and acceptance-criteria, side-panel properties, expandable subtasks,
  expandable connected work, and an activity feed with mixed comments / change entries plus a
  comment composer.

  ### Features
  - Single \`ticket\` input accepting the full \`Ticket\` record (with nested user, label, subtask, connected-work, and activity types)
  - Status drop-down emits \`statusChanged\` on selection
  - Due date is editable inline via \`org-date-picker-input\`; selections emit \`dueDateChanged\`
  - Activity feed renders mixed comment / change entries via \`org-timeline\` and a boxed comment cell, with an All / Comments / Changes tab filter
  - Composer powered by \`org-textarea\` + \`org-textarea-toolbar\` emits \`commentSubmitted\`
  - Subtasks and Connected work are independently expandable cards
  - Acceptance criteria render via \`org-checklist\` and emit \`acceptanceCriterionToggled\` on toggle
  - Blocked banner is conditionally rendered when \`ticket.blocked\` is provided and exposes \`unblock\` / \`pingOwner\` outputs
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<TicketDetails>;

export const Default: Story = {
  args: {
    ticket: baseTicket,
  },
  argTypes: {
    ticket: {
      control: 'object',
      description: 'The Ticket record to render',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default ticket detail view. Use the controls to adjust the ticket record.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <org-ticket-details [ticket]="ticket" />
      </div>
    `,
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo where outputs are wired to update local state. Changing the status from the drop-down updates the chip immediately; toggling a subtask flips the strikethrough; submitting a comment logs the body to the last-event line.',
      },
    },
  },
  render: () => ({
    template: '<story-ticket-details-live-demo />',
    moduleMetadata: {
      imports: [TicketDetailsLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Showcase of distinct visual states: every status variant, with/without blocked banner, and a fully-populated reference view.',
      },
    },
  },
  render: () => ({
    props: {
      baseTicket,
      unblockedTicket,
      allStatuses: allTicketStatuses,
      allPriorities: allTicketPriorities,
      allTypes: allTicketTypes,
      ticketsByStatus: allTicketStatuses.map((status) => ({ ...baseTicket, status, blocked: undefined })),
    },
    template: `
      <org-storybook-example-container
        title="Ticket Details — Showcase"
        currentState="Covers the canonical reference, status variants, and the blocked / unblocked banner toggle"
      >
        <org-storybook-example-container-section label="Canonical reference (with blocked banner)">
          <org-ticket-details [ticket]="baseTicket" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Without blocked banner (status = in-review)">
          <org-ticket-details [ticket]="unblockedTicket" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="All status variants">
          <div class="flex flex-col gap-6">
            @for (ticket of ticketsByStatus; track ticket.status) {
              <div>
                <div class="text-xs text-muted">Status: {{ ticket.status }}</div>
                <org-ticket-details [ticket]="ticket" />
              </div>
            }
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>The status chip drop-down trigger reflects the current ticket status</li>
          <li>The blocked banner is conditionally rendered based on the <strong>blocked</strong> field</li>
          <li>The activity feed mixes change entries (timeline dot + line) with boxed comment entries</li>
          <li>Subtasks and Connected work are both expand/collapse cards driven by the card's expandable affordance</li>
          <li>Acceptance criteria toggle their valid / not-started status on click</li>
        </ul>
      </org-storybook-example-container>
    `,
  }),
};
