import type { Meta, StoryObj } from '@storybook/angular';
import { EXAMPLEParentChildNestedCommunication } from './parent-child-nested-communication';

const meta: Meta<EXAMPLEParentChildNestedCommunication> = {
  title: 'Examples/Patterns/Parent -> Child Communication',
  component: EXAMPLEParentChildNestedCommunication,
};

export default meta;
type Story = StoryObj<EXAMPLEParentChildNestedCommunication>;

export const Nested: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the registry pattern for parent-to-nested-child communication. The parent provides a store that deeply nested children can inject and access without prop drilling.',
      },
    },
  },
  render: () => ({
    template: `<org-example-parent-child-nested-communication />`,
    moduleMetadata: {
      imports: [EXAMPLEParentChildNestedCommunication],
    },
  }),
};
