import type { Meta, StoryObj } from '@storybook/angular';
import { IntegrationsList } from './integrations-list';

const meta: Meta<IntegrationsList> = {
  title: 'Templates/Integration/Integrations List',
  component: IntegrationsList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Integrations List

  A template view that renders two sections of integration cards: the top \`Configured\` section shows
  configured integrations with edit/reconnect/delete actions, and the bottom \`Available\` section lists
  integrations that can be added. Both sections lay out their cards in a css grid that adapts via
  container queries — 2 columns by default, 3 columns at \`lg\` (64rem), and 4 columns at \`2xl\` (96rem).

  ### Features
  - Hardcoded demo integration data for both sections
  - Container-query driven grid (2 / 3 / 4 columns at default / lg / 2xl)
  - Empty sections fall back to an \`org-empty-indicator\` with a bordered box
  - Inner card outputs (\`edit\`, \`reconnect\`, \`delete\`, \`add\`) are logged via the \`logManager\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<IntegrationsList>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default rendering of the integrations list with both the configured and available sections populated.',
      },
    },
  },
  render: () => ({
    template: `<org-integrations-list />`,
    moduleMetadata: {
      imports: [IntegrationsList],
    },
  }),
};
