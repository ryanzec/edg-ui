import type { Meta, StoryObj } from '@storybook/angular';
import { AllComponents } from './all-components';

const meta: Meta<AllComponents> = {
  title: 'Templates/All Components',
  component: AllComponents,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## All Components

  A kitchen-sink template that renders an instance of every visual core component grouped into
  category sections (Foundations, Buttons &amp; Toggles, Inputs &amp; Forms, Containers, Navigation,
  Display &amp; Data). Each component sits in its own block inside a three-column css grid so the
  full surface area of the design system is visible at a glance with minimal whitespace.

  ### What it shows
  - One representative example per visual component exercising the main variants inline
  - Hardcoded fixture data for components that require it (combobox, drop-down, checklist, tabs,
    timeline, pagination, etc.)
  - Output handlers logged via the shared \`logManager\`

  ### Not included
  Composite components that require significant data plumbing (table, chart, chat, application
  navigation) are intentionally omitted — see their dedicated stories under \`Core/Components\`.
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<AllComponents>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default rendering of every included component grouped into category sections.',
      },
    },
  },
  render: () => ({
    template: `<org-all-components />`,
    moduleMetadata: {
      imports: [AllComponents],
    },
  }),
};
