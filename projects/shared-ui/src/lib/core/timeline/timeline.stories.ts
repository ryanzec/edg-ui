import type { Meta, StoryObj } from '@storybook/angular';
import { allComponentColors } from '../types/component-types';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { Timeline } from './timeline';
import { TimelineItem, TIMELINE_ITEM_COLOR_DEFAULT } from './timeline-item';
import { TimelineTime } from './timeline-time';
import { TimelineHeader } from './timeline-header';
import { TimelineContent } from './timeline-content';

const meta: Meta<TimelineItem> = {
  title: 'Core/Components/Timeline',
  component: TimelineItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Timeline Component

  A vertical timeline component for displaying a sequence of events with an indicator dot, connecting lines, and associated content.

  ### Components
  - **Timeline**: The outer container that holds all timeline items
  - **TimelineItem**: Each individual event row; accepts a \`color\` input that styles both the indicator dot and the connecting lines
  - **TimelineTime**: Displays the time label with subtle text styling
  - **TimelineHeader**: Displays the event heading with lg text sizing
  - **TimelineContent**: Displays the main body content for the event

  ### Color Options
  - **primary**: Primary color (default)
  - **secondary**: Secondary accent color
  - **neutral**: Neutral/gray color
  - **safe**: Success/positive state (green)
  - **info**: Informational state (blue)
  - **caution**: Caution state (yellow)
  - **warning**: Warning state (orange)
  - **danger**: Error/danger state (red)

  ### Usage Example
  \`\`\`html
  <org-timeline>
    <org-timeline-item color="safe">
      <org-timeline-time>10:00 AM</org-timeline-time>
      <org-timeline-header>Order Placed</org-timeline-header>
      <org-timeline-content>Your order has been received and is being processed.</org-timeline-content>
    </org-timeline-item>
    <org-timeline-item color="info">
      <org-timeline-time>11:30 AM</org-timeline-time>
      <org-timeline-header>Processing</org-timeline-header>
      <org-timeline-content>Your order is being prepared for shipment.</org-timeline-content>
    </org-timeline-item>
  </org-timeline>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<TimelineItem>;

export const Default: Story = {
  args: {
    color: TIMELINE_ITEM_COLOR_DEFAULT,
  },
  argTypes: {
    color: {
      control: 'select',
      options: allComponentColors,
      description: 'the semantic color applied to the indicator dot and connecting lines',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'default timeline with a single item. use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-timeline>
        <org-timeline-item [color]="color">
          <org-timeline-time>10:00 AM</org-timeline-time>
          <org-timeline-header>Order Placed</org-timeline-header>
          <org-timeline-content>Your order has been received and is being processed.</org-timeline-content>
        </org-timeline-item>
        <org-timeline-item [color]="color">
          <org-timeline-time>11:30 AM</org-timeline-time>
          <org-timeline-header>Processing</org-timeline-header>
          <org-timeline-content>Your order is being prepared for shipment.</org-timeline-content>
        </org-timeline-item>
        <org-timeline-item [color]="color">
          <org-timeline-time>2:00 PM</org-timeline-time>
          <org-timeline-header>Shipped</org-timeline-header>
          <org-timeline-content>Your order has been shipped and is on its way.</org-timeline-content>
        </org-timeline-item>
      </org-timeline>
    `,
    moduleMetadata: {
      imports: [Timeline, TimelineItem, TimelineTime, TimelineHeader, TimelineContent],
    },
  }),
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'all 8 color variants applied to timeline items showing indicator dot and line coloring.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Color Variants"
        currentState="Comparing all 8 color options"
      >
        <org-storybook-example-container-section label="Primary">
          <org-timeline>
            <org-timeline-item>
              <org-timeline-time>10:00 AM</org-timeline-time>
              <org-timeline-header>Event Title</org-timeline-header>
              <org-timeline-content>Event description content goes here.</org-timeline-content>
            </org-timeline-item>
            <org-timeline-item>
              <org-timeline-time>11:00 AM</org-timeline-time>
              <org-timeline-header>Next Event</org-timeline-header>
            </org-timeline-item>
          </org-timeline>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Secondary">
          <org-timeline>
            <org-timeline-item color="secondary">
              <org-timeline-time>10:00 AM</org-timeline-time>
              <org-timeline-header>Event Title</org-timeline-header>
              <org-timeline-content>Event description content goes here.</org-timeline-content>
            </org-timeline-item>
            <org-timeline-item color="secondary">
              <org-timeline-time>11:00 AM</org-timeline-time>
              <org-timeline-header>Next Event</org-timeline-header>
            </org-timeline-item>
          </org-timeline>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Neutral">
          <org-timeline>
            <org-timeline-item color="neutral">
              <org-timeline-time>10:00 AM</org-timeline-time>
              <org-timeline-header>Event Title</org-timeline-header>
              <org-timeline-content>Event description content goes here.</org-timeline-content>
            </org-timeline-item>
            <org-timeline-item color="neutral">
              <org-timeline-time>11:00 AM</org-timeline-time>
              <org-timeline-header>Next Event</org-timeline-header>
            </org-timeline-item>
          </org-timeline>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Safe">
          <org-timeline>
            <org-timeline-item color="safe">
              <org-timeline-time>10:00 AM</org-timeline-time>
              <org-timeline-header>Event Title</org-timeline-header>
              <org-timeline-content>Event description content goes here.</org-timeline-content>
            </org-timeline-item>
            <org-timeline-item color="safe">
              <org-timeline-time>11:00 AM</org-timeline-time>
              <org-timeline-header>Next Event</org-timeline-header>
            </org-timeline-item>
          </org-timeline>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Info">
          <org-timeline>
            <org-timeline-item color="info">
              <org-timeline-time>10:00 AM</org-timeline-time>
              <org-timeline-header>Event Title</org-timeline-header>
              <org-timeline-content>Event description content goes here.</org-timeline-content>
            </org-timeline-item>
            <org-timeline-item color="info">
              <org-timeline-time>11:00 AM</org-timeline-time>
              <org-timeline-header>Next Event</org-timeline-header>
            </org-timeline-item>
          </org-timeline>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Caution">
          <org-timeline>
            <org-timeline-item color="caution">
              <org-timeline-time>10:00 AM</org-timeline-time>
              <org-timeline-header>Event Title</org-timeline-header>
              <org-timeline-content>Event description content goes here.</org-timeline-content>
            </org-timeline-item>
            <org-timeline-item color="caution">
              <org-timeline-time>11:00 AM</org-timeline-time>
              <org-timeline-header>Next Event</org-timeline-header>
            </org-timeline-item>
          </org-timeline>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Warning">
          <org-timeline>
            <org-timeline-item color="warning">
              <org-timeline-time>10:00 AM</org-timeline-time>
              <org-timeline-header>Event Title</org-timeline-header>
              <org-timeline-content>Event description content goes here.</org-timeline-content>
            </org-timeline-item>
            <org-timeline-item color="warning">
              <org-timeline-time>11:00 AM</org-timeline-time>
              <org-timeline-header>Next Event</org-timeline-header>
            </org-timeline-item>
          </org-timeline>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Danger">
          <org-timeline>
            <org-timeline-item color="danger">
              <org-timeline-time>10:00 AM</org-timeline-time>
              <org-timeline-header>Event Title</org-timeline-header>
              <org-timeline-content>Event description content goes here.</org-timeline-content>
            </org-timeline-item>
            <org-timeline-item color="danger">
              <org-timeline-time>11:00 AM</org-timeline-time>
              <org-timeline-header>Next Event</org-timeline-header>
            </org-timeline-item>
          </org-timeline>
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        Timeline,
        TimelineItem,
        TimelineTime,
        TimelineHeader,
        TimelineContent,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};

export const MixedColors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'timeline items with different colors per item to represent varying event statuses.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Mixed Colors"
        currentState="Each item uses a different color to represent distinct statuses"
      >
        <org-timeline>
          <org-timeline-item color="safe">
            <org-timeline-time>9:00 AM</org-timeline-time>
            <org-timeline-header>Completed</org-timeline-header>
            <org-timeline-content>This step has been completed successfully.</org-timeline-content>
          </org-timeline-item>
          <org-timeline-item color="info">
            <org-timeline-time>10:30 AM</org-timeline-time>
            <org-timeline-header>In Progress</org-timeline-header>
            <org-timeline-content>This step is currently being processed.</org-timeline-content>
          </org-timeline-item>
          <org-timeline-item color="caution">
            <org-timeline-time>12:00 PM</org-timeline-time>
            <org-timeline-header>Pending Review</org-timeline-header>
            <org-timeline-content>This step is awaiting approval before continuing.</org-timeline-content>
          </org-timeline-item>
          <org-timeline-item color="danger">
            <org-timeline-time>2:00 PM</org-timeline-time>
            <org-timeline-header>Failed</org-timeline-header>
            <org-timeline-content>This step encountered an error and requires attention.</org-timeline-content>
          </org-timeline-item>
          <org-timeline-item color="neutral">
            <org-timeline-time>4:00 PM</org-timeline-time>
            <org-timeline-header>Scheduled</org-timeline-header>
            <org-timeline-content>This step is scheduled to run later.</org-timeline-content>
          </org-timeline-item>
        </org-timeline>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        Timeline,
        TimelineItem,
        TimelineTime,
        TimelineHeader,
        TimelineContent,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};
