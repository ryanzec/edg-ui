import type { Meta, StoryObj } from '@storybook/angular';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DateTime } from 'luxon';
import { IntegrationCardConfigured, type Integration } from './integration-card-configured';
import { StorybookExampleContainer } from '../../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../../private/storybook-example-container-section/storybook-example-container-section';

const baseIntegration: Integration = {
  id: 'integration-slack',
  name: 'Slack',
  workspace: 'acme-engineering',
  channel: '#deploys',
  description: 'Send deploy notifications and error alerts to team channels in real time.',
  iconName: 'send',
  status: 'active',
  tags: [{ label: 'Messaging' }, { label: 'Notifications' }, { label: 'Team' }],
  createdAt: DateTime.fromISO('2026-04-12T00:00:00Z'),
  lastActivityAt: DateTime.fromISO('2026-04-14T12:23:34Z'),
};

const emailIntegration: Integration = {
  id: 'integration-email',
  name: 'Email Digest',
  workspace: 'product-team',
  channel: 'weekly@acme.io',
  description: 'Aggregate team activity into a weekly email digest.',
  iconName: 'mail',
  status: 'connecting',
  tags: [{ label: 'Email', color: 'info' }, { label: 'Reporting' }],
  createdAt: DateTime.fromISO('2026-03-02T00:00:00Z'),
  lastActivityAt: DateTime.fromISO('2026-04-14T12:23:34Z'),
};

const errorIntegration: Integration = {
  id: 'integration-backup',
  name: 'Offsite Backup',
  workspace: 'infra',
  channel: 's3://acme-backups',
  description: 'Nightly backup failed to authenticate with the remote storage provider.',
  iconName: 'upload',
  status: 'error',
  tags: [{ label: 'Storage', color: 'warning' }, { label: 'Backup' }],
  createdAt: DateTime.fromISO('2025-11-18T00:00:00Z'),
  lastActivityAt: DateTime.fromISO('2026-04-14T12:23:34Z'),
};

const disconnectedIntegration: Integration = {
  id: 'integration-analytics',
  name: 'Analytics Sync',
  workspace: 'growth',
  channel: 'events/pipeline',
  description: 'Sync product analytics events to the data warehouse.',
  iconName: 'download',
  status: 'disconnected',
  tags: [{ label: 'Analytics' }, { label: 'Data' }],
  createdAt: DateTime.fromISO('2025-08-04T00:00:00Z'),
  lastActivityAt: DateTime.fromISO('2026-04-14T12:23:34Z'),
};

@Component({
  selector: 'story-integration-card-configured-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IntegrationCardConfigured, StorybookExampleContainer, StorybookExampleContainerSection],
  template: `
    <org-storybook-example-container
      title="Menu Action Outputs"
      currentState="Open the overlay menu and select an item to observe the matching output"
    >
      <org-storybook-example-container-section label="Click a menu item">
        <div class="flex flex-col gap-4">
          <div class="w-lg">
            <org-integration-card-configured
              [integration]="errorIntegration"
              (edit)="onEdit($event)"
              (reconnect)="onReconnect($event)"
              (delete)="onDelete($event)"
            />
          </div>
          @if (lastAction(); as action) {
            <p>
              Last action: <strong>{{ action.type }}</strong> on
              <strong>{{ action.integration.name }}</strong>
            </p>
          }
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>Edit</strong> emits the integration via the <strong>edit</strong> output</li>
        <li>
          <strong>Re-connect</strong> emits the integration via the <strong>reconnect</strong> output and only appears
          when the status is <strong>error</strong>
        </li>
        <li><strong>Delete</strong> emits the integration via the <strong>delete</strong> output</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class IntegrationCardConfiguredActionsStory {
  protected readonly errorIntegration = errorIntegration;
  protected readonly lastAction = signal<{ type: 'edit' | 'reconnect' | 'delete'; integration: Integration } | null>(
    null
  );

  protected onEdit(integration: Integration): void {
    this.lastAction.set({ type: 'edit', integration });
  }

  protected onReconnect(integration: Integration): void {
    this.lastAction.set({ type: 'reconnect', integration });
  }

  protected onDelete(integration: Integration): void {
    this.lastAction.set({ type: 'delete', integration });
  }
}

const meta: Meta<IntegrationCardConfigured> = {
  title: 'Templates/Integration/Integration Card Configured',
  component: IntegrationCardConfigured,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Integration Card Configured

  A reusable template card that renders a single configured integration. Supports four lifecycle
  statuses (active, connecting, error, disconnected) with automatic status-driven icon, color, and
  label mapping for the footer.

  ### Features
  - Single \`integration\` input accepting the \`Integration\` record
  - Status-aware footer (icon, color, label) and emphasized box border color automatically derived from \`integration.status\`
  - Spinning icon when \`status\` is \`connecting\`
  - Overlay menu with \`Edit\`, \`Re-connect\` (error only), and \`Delete\` actions
  - Dedicated \`edit\`, \`reconnect\`, and \`delete\` outputs emitting the full integration record
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<IntegrationCardConfigured>;

export const Default: Story = {
  args: {
    integration: baseIntegration,
  },
  argTypes: {
    integration: {
      control: 'object',
      description: 'The integration record to render',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default configured integration card. Use the controls to adjust the integration record.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-lg">
        <org-integration-card-configured [integration]="integration" />
      </div>
    `,
    moduleMetadata: {
      imports: [IntegrationCardConfigured],
    },
  }),
};

export const Statuses: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of all four status variants (active, connecting, error, disconnected). The footer icon, color, and label are derived from the status. The connecting icon spins.',
      },
    },
  },
  render: () => ({
    props: {
      activeIntegration: baseIntegration,
      connectingIntegration: emailIntegration,
      errorIntegration,
      disconnectedIntegration,
    },
    template: `
      <org-storybook-example-container
        title="Status Variants"
        currentState="Comparing active, connecting, error, and disconnected statuses"
      >
        <org-storybook-example-container-section label="Active">
          <div class="w-lg">
            <org-integration-card-configured [integration]="activeIntegration" />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Connecting (icon spins)">
          <div class="w-lg">
            <org-integration-card-configured [integration]="connectingIntegration" />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Error (menu includes Re-connect)">
          <div class="w-lg">
            <org-integration-card-configured [integration]="errorIntegration" />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Disconnected">
          <div class="w-lg">
            <org-integration-card-configured [integration]="disconnectedIntegration" />
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Active</strong>: green check icon, "Active" label</li>
          <li><strong>Connecting</strong>: blue loader icon (spinning), "Connecting" label</li>
          <li><strong>Error</strong>: red circle-x icon, "Connection error" label; menu adds "Re-connect"</li>
          <li><strong>Disconnected</strong>: neutral power-off icon, "Disconnected" label</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [IntegrationCardConfigured, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const MenuActions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the edit, reconnect, and delete outputs emitted by the overlay menu.',
      },
    },
  },
  render: () => ({
    template: `<story-integration-card-configured-actions />`,
    moduleMetadata: {
      imports: [IntegrationCardConfiguredActionsStory],
    },
  }),
};
