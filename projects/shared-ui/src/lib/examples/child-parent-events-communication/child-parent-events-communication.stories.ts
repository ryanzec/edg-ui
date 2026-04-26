import type { Meta, StoryObj } from '@storybook/angular';
import { EXAMPLEChildParentEventsCommunication } from './child-parent-events-communication';

const meta: Meta<EXAMPLEChildParentEventsCommunication> = {
  title: 'Examples/Patterns/Child -> Parent Communication',
  component: EXAMPLEChildParentEventsCommunication,
};

export default meta;
type Story = StoryObj<EXAMPLEChildParentEventsCommunication>;

export const Events: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates child-to-parent communication using the signal-based output() pattern. The child component emits events that the parent listens to and handles.',
      },
    },
  },
  render: () => ({
    template: `<org-example-child-parent-events-communication />`,
    moduleMetadata: {
      imports: [EXAMPLEChildParentEventsCommunication],
    },
  }),
};
