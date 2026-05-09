import type { Meta, StoryObj } from '@storybook/angular';
import { DateTime } from 'luxon';
import { LastUpdated } from './last-updated';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<LastUpdated> = {
  title: 'Core/Components/Last Updated',
  component: LastUpdated,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Last Updated Component

  A component that displays when something was last updated, paired with a status indicator that communicates whether the underlying value is currently active or inactive. While loading, the indicator is replaced by a spinner.

  ### Features
  - Timestamp display for when the value was last updated (luxon DateTime)
  - Status indicator (active or inactive) with color-coded dot
  - Loading state that swaps the dot for an animated spinner
  - Graceful handling of invalid DateTime values
  - Accessible status semantics (role and aria-label)

  ### Status Options
  - **active**: Green indicator showing the value is currently active
  - **inactive**: Neutral/gray indicator showing the value is not currently active

  ### Usage Examples
  \`\`\`typescript
  import { DateTime } from 'luxon';

  // In component
  lastUpdated = DateTime.fromISO('2025-10-08T10:30:00Z');
  \`\`\`

  \`\`\`html
  <!-- Basic active -->
  <org-last-updated
    status="active"
    [lastUpdatedAt]="lastUpdated"
  />

  <!-- Inactive -->
  <org-last-updated
    status="inactive"
    [lastUpdatedAt]="lastUpdated"
  />

  <!-- Loading state -->
  <org-last-updated
    status="active"
    [isLoading]="true"
    [lastUpdatedAt]="lastUpdated"
  />
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;

// the status / isLoading inputs come from the host-directive forwarding on `LastUpdated`, which storybook's
// signal-input type extraction does not see, so they are augmented onto the args type here.
type Story = StoryObj<LastUpdated & { status: 'active' | 'inactive'; isLoading: boolean }>;

export const Default: Story = {
  args: {
    status: 'active',
    isLoading: false,
    lastUpdatedAt: DateTime.fromISO('2025-10-08T14:30:00Z'),
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['active', 'inactive'],
      description: 'The status (active = green, inactive = neutral)',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the indicator is in loading state (shows spinner instead of dot)',
    },
    lastUpdatedAt: {
      control: false,
      description: 'Luxon DateTime object for when the value was last updated (required)',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default last updated with active status. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-last-updated
        [status]="status"
        [isLoading]="isLoading"
        [lastUpdatedAt]="lastUpdatedAt"
      />
    `,
    moduleMetadata: {
      imports: [LastUpdated],
    },
  }),
};

export const Status: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of active (green) and inactive (neutral) status states.',
      },
    },
  },
  render: () => ({
    props: {
      activeTimestamp: DateTime.fromISO('2025-10-08T14:30:00Z'),
      inactiveTimestamp: DateTime.fromISO('2025-10-08T09:15:00Z'),
    },
    template: `
      <org-storybook-example-container
        title="Status Variants"
        currentState="Comparing active and inactive status"
      >
        <org-storybook-example-container-section label="Active (Green)">
          <org-last-updated status="active" [lastUpdatedAt]="activeTimestamp" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Inactive (Neutral)">
          <org-last-updated status="inactive" [lastUpdatedAt]="inactiveTimestamp" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Active</strong>: Green indicator showing the value is currently active</li>
          <li><strong>Inactive</strong>: Neutral/gray indicator showing the value is not currently active</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [LastUpdated, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const LoadingState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of normal and loading states for both active and inactive status.',
      },
    },
  },
  render: () => ({
    props: {
      activeTimestamp: DateTime.fromISO('2025-10-08T14:30:00Z'),
      inactiveTimestamp: DateTime.fromISO('2025-10-08T09:15:00Z'),
    },
    template: `
      <org-storybook-example-container
        title="Loading States"
        currentState="Comparing normal and loading states"
      >
        <org-storybook-example-container-section label="Active - Normal">
          <org-last-updated status="active" [lastUpdatedAt]="activeTimestamp" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Active - Loading">
          <org-last-updated status="active" [isLoading]="true" [lastUpdatedAt]="activeTimestamp" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Inactive - Normal">
          <org-last-updated status="inactive" [lastUpdatedAt]="inactiveTimestamp" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Inactive - Loading">
          <org-last-updated status="inactive" [isLoading]="true" [lastUpdatedAt]="inactiveTimestamp" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Normal State</strong>: Shows colored indicator dot based on status</li>
          <li><strong>Loading State</strong>: Shows animated spinner while the value is being updated</li>
          <li><strong>Status Preserved</strong>: Status determines color after loading completes</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [LastUpdated, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithLastUpdatedAt: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Examples showing the component with last updated timestamp display and invalid date handling.',
      },
    },
  },
  render: () => ({
    props: {
      activeTimestamp: DateTime.fromISO('2025-10-08T14:30:00Z'),
      inactiveTimestamp: DateTime.fromISO('2025-10-08T09:15:00Z'),
      invalidTimestamp: DateTime.fromISO('invalid-date'),
    },
    template: `
      <org-storybook-example-container
        title="Last Updated Timestamp"
        currentState="Showing the component with last updated timestamps"
      >
        <org-storybook-example-container-section label="Active with Timestamp">
          <org-last-updated
            status="active"
            [lastUpdatedAt]="activeTimestamp"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Inactive with Timestamp">
          <org-last-updated
            status="inactive"
            [lastUpdatedAt]="inactiveTimestamp"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Loading with Timestamp">
          <org-last-updated
            status="active"
            [isLoading]="true"
            [lastUpdatedAt]="activeTimestamp"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Invalid DateTime">
          <org-last-updated
            status="active"
            [lastUpdatedAt]="invalidTimestamp"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Format</strong>: Timestamp is displayed using DateFormat.STANDARD and TimeFormat.STANDARD with timezone</li>
          <li><strong>Required</strong>: lastUpdatedAt is a required input (luxon DateTime object)</li>
          <li><strong>Validation</strong>: Invalid DateTime objects are handled gracefully (shows "----")</li>
          <li><strong>Position</strong>: Timestamp appears to the right of the indicator/spinner</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [LastUpdated, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
