import type { Meta, StoryObj } from '@storybook/angular';
import { EXAMPLEParentChildMultipleNestedCommunication } from './parent-child-multiple-nested-communication';

const meta: Meta<EXAMPLEParentChildMultipleNestedCommunication> = {
  title: 'Examples/Patterns/Parent -> Child Communication',
  component: EXAMPLEParentChildMultipleNestedCommunication,
};

export default meta;
type Story = StoryObj<EXAMPLEParentChildMultipleNestedCommunication>;

export const MultipleNested: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the registry pattern for parent-to-nested-child communication. The parent provides stores via injection tokens that deeply nested children can access without prop drilling.',
      },
    },
  },
  render: () => ({
    template: `<org-example-parent-child-multiple-nested-communication />`,
    moduleMetadata: {
      imports: [EXAMPLEParentChildMultipleNestedCommunication],
    },
  }),
};
