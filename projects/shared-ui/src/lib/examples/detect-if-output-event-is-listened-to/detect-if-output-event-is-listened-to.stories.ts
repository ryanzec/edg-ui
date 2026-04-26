import type { Meta, StoryObj } from '@storybook/angular';
import { DetectIfOutputEventIsListenedTo } from './detect-if-output-event-is-listened-to';

const meta: Meta<DetectIfOutputEventIsListenedTo> = {
  title: 'Examples/Patterns/Detect Output Event Listeners',
  component: DetectIfOutputEventIsListenedTo,
  parameters: {
    docs: {
      description: {
        component: `
This example demonstrates the Subject + outputFromObservable() pattern for detecting if output events are being listened to.

## The Pattern:
1. Create a private Subject
2. Create output using outputFromObservable()
3. Check listeners with subject.observed

## Use Cases:
- Performance optimization (only emit when needed)
- Conditional styling based on listener presence
- Dynamic behavior based on event usage
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<DetectIfOutputEventIsListenedTo>;

export const NoListeners: Story = {
  name: 'No Listeners',
  parameters: {
    docs: {
      description: {
        story: 'When no one is listening to the buttonClicked output, the button appears gray and inactive.',
      },
    },
  },
  render: () => ({
    template: `<org-detect-if-output-event-is-listened-to />`,
    moduleMetadata: {
      imports: [DetectIfOutputEventIsListenedTo],
    },
  }),
};

export const WithEventListener: Story = {
  name: 'With Event Listener',
  argTypes: {
    buttonClicked: { action: 'buttonClicked' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'When someone is listening to the buttonClicked output (via Storybook actions), the button becomes blue and interactive. Check the Actions panel to see events.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<org-detect-if-output-event-is-listened-to (buttonClicked)="buttonClicked($event)" />`,
    moduleMetadata: {
      imports: [DetectIfOutputEventIsListenedTo],
    },
  }),
};
