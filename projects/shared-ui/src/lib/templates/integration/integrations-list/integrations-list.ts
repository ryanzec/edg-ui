import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DateTime } from 'luxon';
import { EmptyIndicator } from '../../../core/empty-indicator/empty-indicator';
import { logManager } from '@organization/shared-utils';
import {
  IntegrationCardAvailable,
  type AvailableIntegration,
} from '../integration-card-available/integration-card-available';
import {
  IntegrationCardConfigured,
  type Integration,
} from '../integration-card-configured/integration-card-configured';

@Component({
  selector: 'org-integrations-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmptyIndicator, IntegrationCardAvailable, IntegrationCardConfigured],
  templateUrl: './integrations-list.html',
  styleUrl: './integrations-list.css',
})
export class IntegrationsList {
  /** the list of configured integrations rendered in the top section */
  protected readonly configuredIntegrations: Integration[] = [
    {
      id: 'integration-slack-deploys',
      name: 'Slack',
      workspace: 'acme-engineering',
      channel: '#deploys',
      description: 'Send deploy notifications and error alerts to team channels in real time.',
      iconName: 'send',
      status: 'active',
      tags: [{ label: 'Messaging' }, { label: 'Notifications' }, { label: 'Team' }],
      createdAt: DateTime.fromISO('2026-04-12T00:00:00Z'),
      lastActivityAt: DateTime.fromISO('2026-04-18T12:23:34Z'),
    },
    {
      id: 'integration-slack-incidents',
      name: 'Slack',
      workspace: 'acme-support',
      channel: '#incidents',
      description: 'Send deploy notifications and error alerts to team channels in real time.',
      iconName: 'send',
      status: 'active',
      tags: [{ label: 'Messaging' }, { label: 'Notifications' }, { label: 'Team' }, { label: 'Alerts' }],
      createdAt: DateTime.fromISO('2026-03-28T00:00:00Z'),
      lastActivityAt: DateTime.fromISO('2026-04-18T08:12:00Z'),
    },
    {
      id: 'integration-github',
      name: 'GitHub',
      workspace: 'acme-corp',
      channel: 'monorepo',
      description: 'Auth token expired · reauthenticate to resume syncing',
      iconName: 'upload',
      status: 'error',
      tags: [{ label: 'Source control' }, { label: 'CI/CD' }, { label: 'Developer tools' }],
      createdAt: DateTime.fromISO('2026-02-03T00:00:00Z'),
      lastActivityAt: DateTime.fromISO('2026-04-01T00:00:00Z'),
    },
    {
      id: 'integration-stripe',
      name: 'Stripe',
      workspace: 'acct_1N9Jz',
      channel: '8fQp',
      description: 'Establishing secure connection with Stripe…',
      iconName: 'cog',
      status: 'connecting',
      tags: [{ label: 'Payments' }, { label: 'Billing' }, { label: 'Finance' }],
      createdAt: DateTime.fromISO('2026-04-18T00:00:00Z'),
      lastActivityAt: DateTime.fromISO('2026-04-19T00:00:00Z'),
    },
    {
      id: 'integration-postgres',
      name: 'Postgres',
      workspace: 'warehouse-primary',
      channel: 'us-east-1',
      description: 'Paused by admin on Apr 10',
      iconName: 'download',
      status: 'disconnected',
      tags: [{ label: 'Database' }, { label: 'Analytics' }, { label: 'SQL' }, { label: 'Ops' }],
      createdAt: DateTime.fromISO('2026-01-18T00:00:00Z'),
      lastActivityAt: DateTime.fromISO('2026-04-10T00:00:00Z'),
    },
    {
      id: 'integration-hubspot',
      name: 'HubSpot',
      workspace: 'Marketing',
      channel: 'Portal #8841273',
      description: 'Two-way sync for contacts, companies, and deals to keep sales and product aligned.',
      iconName: 'mail',
      status: 'active',
      tags: [{ label: 'CRM' }, { label: 'Marketing' }, { label: 'Sales' }],
      createdAt: DateTime.fromISO('2026-03-05T00:00:00Z'),
      lastActivityAt: DateTime.fromISO('2026-04-18T10:00:00Z'),
    },
  ];

  /** the list of available (not yet connected) integrations rendered in the bottom section */
  protected readonly availableIntegrations: AvailableIntegration[] = [
    {
      id: 'integration-available-google-calendar',
      name: 'Google Calendar',
      description: 'Create events from incidents and pull team availability into scheduling flows.',
      iconName: 'calendar',
      tags: [{ label: 'Calendar' }, { label: 'Productivity' }, { label: 'Google' }],
    },
    {
      id: 'integration-available-jira',
      name: 'Jira',
      description: 'Open and triage tickets directly from alerts — keep engineering and ops aligned.',
      iconName: 'square-check-big',
      tags: [{ label: 'Issue tracking' }, { label: 'Project management' }, { label: 'Atlassian' }],
    },
    {
      id: 'integration-available-zendesk',
      name: 'Zendesk',
      description: 'Pipe customer tickets into your workflows and close the loop on resolutions.',
      iconName: 'notification',
      tags: [{ label: 'Support' }, { label: 'Customer service' }, { label: 'Tickets' }],
    },
    {
      id: 'integration-available-linear',
      name: 'Linear',
      description: 'Turn incidents into Linear issues and keep engineering work connected to alerts.',
      iconName: 'square-check-big',
      tags: [{ label: 'Issue tracking' }, { label: 'Engineering' }],
    },
    {
      id: 'integration-available-datadog',
      name: 'Datadog',
      description: 'Forward metrics and logs to correlate performance signals with incidents.',
      iconName: 'cog',
      tags: [{ label: 'Monitoring' }, { label: 'Observability' }, { label: 'Metrics' }],
    },
    {
      id: 'integration-available-pagerduty',
      name: 'PagerDuty',
      description: 'Trigger on-call rotations automatically when a high-severity alert fires.',
      iconName: 'notification',
      tags: [{ label: 'On-call' }, { label: 'Alerting' }, { label: 'Incidents' }],
    },
    {
      id: 'integration-available-notion',
      name: 'Notion',
      description: 'Attach runbooks and post-incident notes to your integration workflows.',
      iconName: 'pencil',
      tags: [{ label: 'Docs' }, { label: 'Knowledge base' }, { label: 'Productivity' }],
    },
    {
      id: 'integration-available-intercom',
      name: 'Intercom',
      description: 'Surface integration status to customer-facing teams via Intercom messages.',
      iconName: 'mail',
      tags: [{ label: 'Support' }, { label: 'Messaging' }, { label: 'Customer success' }],
    },
    {
      id: 'integration-available-s3',
      name: 'Amazon S3',
      description: 'Archive event payloads and snapshots to a managed object storage bucket.',
      iconName: 'upload',
      tags: [{ label: 'Storage' }, { label: 'AWS' }, { label: 'Backup' }],
    },
    {
      id: 'integration-available-webhook',
      name: 'Custom Webhook',
      description: 'Send JSON payloads to any HTTP endpoint when selected events occur.',
      iconName: 'send',
      tags: [{ label: 'Developer tools' }, { label: 'Automation' }],
    },
  ];

  /** the total count of available integrations rendered next to the section title */
  protected readonly availableCount = this.availableIntegrations.length;

  /** logs the integration when a configured card emits its edit output */
  protected onEdit(integration: Integration): void {
    logManager.log({ type: 'integrations-list-edit', integration });
  }

  /** logs the integration when a configured card emits its reconnect output */
  protected onReconnect(integration: Integration): void {
    logManager.log({ type: 'integrations-list-reconnect', integration });
  }

  /** logs the integration when a configured card emits its delete output */
  protected onDelete(integration: Integration): void {
    logManager.log({ type: 'integrations-list-delete', integration });
  }

  /** logs the integration when an available card emits its add output */
  protected onAdd(integration: AvailableIntegration): void {
    logManager.log({ type: 'integrations-list-add', integration });
  }
}
