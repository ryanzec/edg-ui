import type { Meta, StoryObj } from '@storybook/angular';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IntegrationCardAvailable, type AvailableIntegration } from './integration-card-available';
import { DesignSystemDemo } from '../../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoExpectedBehaviour } from '../../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../../example/design-system-demo/design-system-demo-header';

const baseIntegration: AvailableIntegration = {
  id: 'integration-google-calendar',
  name: 'Google Calendar',
  description: 'Create events from incidents and pull team availability into scheduling flows.',
  iconName: 'calendar',
  tags: [{ label: 'Calendar' }, { label: 'Productivity' }, { label: 'Google' }],
};

const noTagsIntegration: AvailableIntegration = {
  id: 'integration-webhook',
  name: 'Custom Webhook',
  description: 'Send JSON payloads to any HTTP endpoint when selected events occur.',
  iconName: 'send',
  tags: [],
};

const coloredTagsIntegration: AvailableIntegration = {
  id: 'integration-analytics',
  name: 'Product Analytics',
  description: 'Sync product analytics events to the data warehouse for reporting.',
  iconName: 'download',
  tags: [
    { label: 'Analytics', color: 'info' },
    { label: 'Data', color: 'warning' },
    { label: 'New', color: 'safe' },
  ],
};

@Component({
  selector: 'story-integration-card-available-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IntegrationCardAvailable,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header slot="header" title="Add Action Output" />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">Click the Add button</div>
          <div class="flex flex-col gap-4">
            <div class="w-lg">
              <org-integration-card-available [integration]="integration" (add)="onAdd($event)" />
            </div>
            @if (lastAction(); as action) {
              <p>
                Last action: <strong>add</strong> on <strong>{{ action.name }}</strong>
              </p>
            }
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
    <org-design-system-demo-expected-behaviour>
      <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>Add</strong> emits the integration via the <strong>add</strong> output</li>
      </ul>
    </org-design-system-demo-expected-behaviour>
  `,
})
class IntegrationCardAvailableActionsStory {
  protected readonly integration = baseIntegration;
  protected readonly lastAction = signal<AvailableIntegration | null>(null);

  protected onAdd(integration: AvailableIntegration): void {
    this.lastAction.set(integration);
  }
}

const meta: Meta<IntegrationCardAvailable> = {
  title: 'Templates/Integration/Integration Card Available',
  component: IntegrationCardAvailable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Integration Card Available

  A reusable template card that renders a single available (not yet connected) integration. Displays the
  integration brand icon, name, description, optional tags, and an "Add" action button used to initiate
  the connection flow.

  ### Features
  - Single \`integration\` input accepting the \`AvailableIntegration\` record
  - \`safe\`-colored "Add" button with a plus icon
  - Optional tag list rendered when \`tags\` is non-empty
  - \`add\` output emitting the full integration record when the button is clicked
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<IntegrationCardAvailable>;

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
        story: 'Default available integration card. Use the controls to adjust the integration record.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-lg">
        <org-integration-card-available [integration]="integration" />
      </div>
    `,
    moduleMetadata: {
      imports: [IntegrationCardAvailable],
    },
  }),
};

export const WithoutTags: Story = {
  parameters: {
    docs: {
      description: {
        story: 'When the integration has no tags, the tag row is omitted entirely.',
      },
    },
  },
  render: () => ({
    props: {
      integration: noTagsIntegration,
    },
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="No Tags" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">No tags</div>
            <div class="w-lg">
              <org-integration-card-available [integration]="integration" />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>The tag row is not rendered when the <strong>tags</strong> array is empty</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        IntegrationCardAvailable,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

export const ColoredTags: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tags may provide a semantic color; when omitted, tags fall back to neutral.',
      },
    },
  },
  render: () => ({
    props: {
      defaultIntegration: baseIntegration,
      coloredIntegration: coloredTagsIntegration,
    },
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Tag Colors" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Default (neutral)</div>
            <div class="w-lg">
              <org-integration-card-available [integration]="defaultIntegration" />
            </div>
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Semantic colors</div>
            <div class="w-lg">
              <org-integration-card-available [integration]="coloredIntegration" />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Tags without a <strong>color</strong> render with the <strong>neutral</strong> color</li>
          <li>Tags with a <strong>color</strong> render with the configured semantic color</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        IntegrationCardAvailable,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

export const AddAction: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the add output emitted by the "Add" button.',
      },
    },
  },
  render: () => ({
    template: `<story-integration-card-available-actions />`,
    moduleMetadata: {
      imports: [IntegrationCardAvailableActionsStory],
    },
  }),
};
