import type { Meta, StoryObj } from '@storybook/angular';
import { EXAMPLESignalsCustomEquality } from './signals-custom-equality';

const meta: Meta<EXAMPLESignalsCustomEquality> = {
  title: 'Examples/Patterns/Signals',
  component: EXAMPLESignalsCustomEquality,
};

export default meta;
type Story = StoryObj<EXAMPLESignalsCustomEquality>;

export const CustomEquality: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how to use custom equality functions with signals to prevent unnecessary effect triggers when updating non-scalar values. Compares default behavior vs. using a deep equality check.',
      },
    },
  },
  render: () => ({
    template: `<org-example-signals-custom-equality />`,
    moduleMetadata: {
      imports: [EXAMPLESignalsCustomEquality],
    },
  }),
};
