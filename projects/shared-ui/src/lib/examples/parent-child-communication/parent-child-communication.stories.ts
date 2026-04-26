import type { Meta, StoryObj } from '@storybook/angular';
import { EXAMPLEParentChildCommunication } from './parent-child-communication';

const meta: Meta<EXAMPLEParentChildCommunication> = {
  title: 'Examples/Patterns/Parent -> Child Communication',
  component: EXAMPLEParentChildCommunication,
};

export default meta;
type Story = StoryObj<EXAMPLEParentChildCommunication>;

export const DirectChild: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates parent-to-child communication using ViewChild to access a direct child component's public methods. The parent calls setValue() on the child after the view initializes.",
      },
    },
  },
  render: () => ({
    template: `<org-example-parent-child-communication />`,
    moduleMetadata: {
      imports: [EXAMPLEParentChildCommunication],
    },
  }),
};
