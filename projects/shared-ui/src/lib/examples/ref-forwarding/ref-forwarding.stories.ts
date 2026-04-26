import type { Meta, StoryObj } from '@storybook/angular';
import { EXAMPLERefForwarding } from './ref-forwarding';

const meta: Meta<EXAMPLERefForwarding> = {
  title: 'Examples/Patterns/Ref Forwarding',
  component: EXAMPLERefForwarding,
};

export default meta;
type Story = StoryObj<EXAMPLERefForwarding>;

export const Nested: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates ref forwarding pattern where a parent component can access deeply nested child component references through a chain of ViewChild decorators. This allows the parent to directly interact with nested elements.',
      },
    },
  },
  render: () => ({
    template: `<org-example-ref-forwarding />`,
    moduleMetadata: {
      imports: [EXAMPLERefForwarding],
    },
  }),
};
