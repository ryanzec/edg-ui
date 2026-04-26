import type { Meta, StoryObj } from '@storybook/angular';
import { DateTime } from 'luxon';
import { DataUpdaterIndicator } from './data-updater-indicator';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<DataUpdaterIndicator> = {
  title: 'Core/Components/Data Updater Indicator',
  component: DataUpdaterIndicator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Data Updater Indicator Component

  A component that indicates whether data is currently being updated. It displays either a colored indicator dot or a loading spinner based on the loading state.

  ### Features
  - Visual indicator for data update status (active or inactive)
  - Loading state with animated spinner
  - Color-coded status (green for active, neutral for inactive)
  - Automatic component switching between indicator and spinner
  - Required last updated timestamp display (luxon DateTime)

  ### Status Options
  - **active**: Green indicator showing data is active/being tracked
  - **inactive**: Neutral/gray indicator showing data is not being tracked

  ### Usage Examples
  \`\`\`typescript
  import { DateTime } from 'luxon';

  // In component
  lastUpdated = DateTime.fromISO('2025-10-08T10:30:00Z');
  \`\`\`

  \`\`\`html
  <!-- Basic active indicator -->
  <org-data-updater-indicator
    status="active"
    [lastUpdatedAt]="lastUpdated"
  />

  <!-- Inactive indicator -->
  <org-data-updater-indicator
    status="inactive"
    [lastUpdatedAt]="lastUpdated"
  />

  <!-- Loading state -->
  <org-data-updater-indicator
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
type Story = StoryObj<DataUpdaterIndicator>;

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
      description: 'The status of the data updater (active = green, inactive = neutral)',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the indicator is in loading state (shows spinner instead of dot)',
    },
    lastUpdatedAt: {
      control: false,
      description: 'Luxon DateTime object for when data was last updated (required)',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default data updater indicator with active status. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-data-updater-indicator
        [status]="status"
        [isLoading]="isLoading"
        [lastUpdatedAt]="lastUpdatedAt"
      />
    `,
    moduleMetadata: {
      imports: [DataUpdaterIndicator],
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
          <org-data-updater-indicator status="active" [lastUpdatedAt]="activeTimestamp" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Inactive (Neutral)">
          <org-data-updater-indicator status="inactive" [lastUpdatedAt]="inactiveTimestamp" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Active</strong>: Green indicator showing data is actively being tracked</li>
          <li><strong>Inactive</strong>: Neutral/gray indicator showing data is not being tracked</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [DataUpdaterIndicator, StorybookExampleContainer, StorybookExampleContainerSection],
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
          <org-data-updater-indicator status="active" [lastUpdatedAt]="activeTimestamp" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Active - Loading">
          <org-data-updater-indicator status="active" [isLoading]="true" [lastUpdatedAt]="activeTimestamp" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Inactive - Normal">
          <org-data-updater-indicator status="inactive" [lastUpdatedAt]="inactiveTimestamp" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Inactive - Loading">
          <org-data-updater-indicator status="inactive" [isLoading]="true" [lastUpdatedAt]="inactiveTimestamp" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Normal State</strong>: Shows colored indicator dot based on status</li>
          <li><strong>Loading State</strong>: Shows animated spinner while data is being updated</li>
          <li><strong>Status Preserved</strong>: Status determines color after loading completes</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [DataUpdaterIndicator, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithLastUpdatedAt: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Examples showing the indicator with last updated timestamp display and invalid date handling.',
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
        currentState="Showing indicators with last updated timestamp"
      >
        <org-storybook-example-container-section label="Active with Timestamp">
          <org-data-updater-indicator
            status="active"
            [lastUpdatedAt]="activeTimestamp"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Inactive with Timestamp">
          <org-data-updater-indicator
            status="inactive"
            [lastUpdatedAt]="inactiveTimestamp"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Loading with Timestamp">
          <org-data-updater-indicator
            status="active"
            [isLoading]="true"
            [lastUpdatedAt]="activeTimestamp"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Invalid DateTime">
          <org-data-updater-indicator
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
      imports: [DataUpdaterIndicator, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
