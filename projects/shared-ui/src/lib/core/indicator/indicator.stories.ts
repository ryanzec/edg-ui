import type { Meta, StoryObj } from '@storybook/angular';
import { Indicator } from './indicator';
import { allComponentColors } from '../types/component-types';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<Indicator> = {
  title: 'Core/Components/Indicator',
  component: Indicator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Indicator Component

  A status indicator component that displays either a colored circle or a numbered badge.

  ### Features
  - Two states: simple dot (no number) or numbered badge
  - Eight color options for semantic status indication
  - Automatic formatting for numbers 100+ (displays as "99+")
  - Compact default size (10x10px for dot at sm size)

  ### States
  - **No Number**: Displays a colored circle sized by the size input
  - **With Number**: Displays the number in a larger badge (shows "99+" for values ≥100)

  ### Color Options
  - **primary**: Primary color (default)
  - **secondary**: Secondary accent color
  - **neutral**: Neutral/gray color
  - **safe**: Success/positive state (green)
  - **info**: Informational state (blue)
  - **caution**: Caution state (yellow)
  - **warning**: Warning state (orange)
  - **danger**: Error/danger state (red)

  ### Usage Examples
  \`\`\`html
  <!-- Simple status dot -->
  <org-indicator />

  <!-- Numbered indicator -->
  <org-indicator color="danger" [number]="5" />

  <!-- Large number (displays as 99+) -->
  <org-indicator color="info" [number]="150" />

  <!-- Different colors for different statuses -->
  <org-indicator color="safe" />
  <org-indicator color="warning" [number]="3" />
</div>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Indicator>;

export const Default: Story = {
  args: {
    color: 'primary',
    number: null,
    size: 'base',
  },
  argTypes: {
    color: {
      control: 'select',
      options: allComponentColors,
      description: 'The color of the indicator',
    },
    number: {
      control: 'number',
      description: 'Optional number to display (shows "99+" for values ≥100)',
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'The size of the indicator',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default indicator with primary color. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-indicator
        [color]="color"
        [number]="number"
        [size]="size"
      />
    `,
    moduleMetadata: {
      imports: [Indicator],
    },
  }),
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all 8 color variants without numbers (simple dot state).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Color Variants (No Number)"
        currentState="Comparing all 8 color options as simple dots"
      >
        <org-storybook-example-container-section label="Primary">
          <org-indicator />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Secondary">
          <org-indicator color="secondary" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Neutral">
          <org-indicator color="neutral" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Safe">
          <org-indicator color="safe" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Info">
          <org-indicator color="info" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Caution">
          <org-indicator color="caution" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Warning">
          <org-indicator color="warning" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Danger">
          <org-indicator color="danger" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>primary</strong>: Primary color (default)</li>
          <li><strong>secondary</strong>: Secondary accent color</li>
          <li><strong>neutral</strong>: Neutral/gray color</li>
          <li><strong>safe</strong>: Success/positive state (green)</li>
          <li><strong>info</strong>: Informational state (blue)</li>
          <li><strong>caution</strong>: Caution state (yellow)</li>
          <li><strong>warning</strong>: Warning state (orange)</li>
          <li><strong>danger</strong>: Error/danger state (red)</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Indicator, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all size variants (sm, base, lg) with and without numbers.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Size Variants"
        currentState="Comparing all 3 size options"
      >
        <org-storybook-example-container-section label="Small (sm)">
          <div class="flex gap-4 items-center">
            <org-indicator size="sm" />
            <org-indicator size="sm" [number]="5" />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Base (default)">
          <div class="flex gap-4 items-center">
            <org-indicator size="base" />
            <org-indicator size="base" [number]="5" />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Large (lg)">
          <div class="flex gap-4 items-center">
            <org-indicator size="lg" />
            <org-indicator size="lg" [number]="5" />
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>sm</strong>: 10x10px dot / 20x20px badge (default)</li>
          <li><strong>base</strong>: 14x14px dot / 24x24px badge</li>
          <li><strong>lg</strong>: 18x18px dot / 28x28px badge</li>
          <li>Both dot and badge states scale with the size input</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Indicator, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithNumbers: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Indicators with numbers showing how the component displays different numeric values.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Numbered Indicators"
        currentState="Indicators displaying various numeric values"
      >
        <org-storybook-example-container-section label="Single Digit">
          <div class="flex gap-2">
            <org-indicator [number]="1" />
            <org-indicator color="info" [number]="5" />
            <org-indicator color="danger" [number]="9" />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Double Digits">
          <div class="flex gap-2">
            <org-indicator [number]="10" />
            <org-indicator color="info" [number]="42" />
            <org-indicator color="danger" [number]="99" />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="100+ (Shows 99+)">
          <div class="flex gap-2">
            <org-indicator [number]="100" />
            <org-indicator color="info" [number]="250" />
            <org-indicator color="danger" [number]="9999" />
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Numbers below 100 display as-is</li>
          <li>Numbers 100 or greater display as "99+"</li>
          <li>Badge size adjusts to accommodate content</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Indicator, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const ColorsWithNumbers: Story = {
  parameters: {
    docs: {
      description: {
        story: 'All color variants with numbers to show the numbered badge state.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Color Variants (With Numbers)"
        currentState="All colors with numeric indicators"
      >
        <org-storybook-example-container-section label="Primary">
          <org-indicator [number]="5" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Secondary">
          <org-indicator color="secondary" [number]="5" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Neutral">
          <org-indicator color="neutral" [number]="5" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Safe">
          <org-indicator color="safe" [number]="5" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Info">
          <org-indicator color="info" [number]="5" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Caution">
          <org-indicator color="caution" [number]="5" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Warning">
          <org-indicator color="warning" [number]="5" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Danger">
          <org-indicator color="danger" [number]="5" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Each color variant maintains semantic meaning even with numbers</li>
          <li>Text uses the standard text color token for readability on all backgrounds</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Indicator, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const UseCases: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Common use cases showing how indicators can be used in real-world scenarios.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Common Use Cases"
        currentState="Real-world usage examples"
      >
        <org-storybook-example-container-section label="Status Indicators">
          <div class="flex gap-4 items-center">
            <div class="flex gap-2 items-center">
              <org-indicator color="safe" ariaLabel="online" />
              <span>Online</span>
            </div>
            <div class="flex gap-2 items-center">
              <org-indicator color="warning" ariaLabel="away" />
              <span>Away</span>
            </div>
            <div class="flex gap-2 items-center">
              <org-indicator color="danger" ariaLabel="busy" />
              <span>Busy</span>
            </div>
            <div class="flex gap-2 items-center">
              <org-indicator color="neutral" ariaLabel="offline" />
              <span>Offline</span>
            </div>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Notification Badges">
          <div class="flex gap-4 items-center">
            <div class="flex gap-2 items-center">
              <span>Messages</span>
              <org-indicator [number]="3" ariaLabel="3 messages" />
            </div>
            <div class="flex gap-2 items-center">
              <span>Alerts</span>
              <org-indicator color="danger" [number]="12" ariaLabel="12 alerts" />
            </div>
            <div class="flex gap-2 items-center">
              <span>Updates</span>
              <org-indicator color="info" [number]="150" ariaLabel="99 or more updates" />
            </div>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Task Counters">
          <div class="flex gap-4 items-center">
            <div class="flex gap-2 items-center">
              <span>Pending</span>
              <org-indicator color="caution" [number]="7" ariaLabel="7 pending" />
            </div>
            <div class="flex gap-2 items-center">
              <span>In Progress</span>
              <org-indicator color="info" [number]="4" ariaLabel="4 in progress" />
            </div>
            <div class="flex gap-2 items-center">
              <span>Completed</span>
              <org-indicator color="safe" [number]="25" ariaLabel="25 completed" />
            </div>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Simple dots for binary status states (online/offline, active/inactive)</li>
          <li>Numbered badges for counts (notifications, tasks, alerts)</li>
          <li>Color selection should match semantic meaning</li>
          <li>Use ariaLabel to provide accessible text, especially for dot-state indicators</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Indicator, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
