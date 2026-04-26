import type { Meta, StoryObj } from '@storybook/angular';
import { Divider, allDividerDirections } from './divider';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<Divider> = {
  title: 'Core/Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Divider Component

  A simple visual separator that renders a single border line in either a horizontal or vertical orientation.

  ### Features
  - Two orientations: horizontal and vertical
  - Uses the standard border token (\`--border-width\` + \`--color-border\`)
  - Horizontal dividers fill the full width of their container
  - Vertical dividers fill the full height of their container

  ### Direction Options
  - **horizontal** (default): Line spans left to right; element fills 100% width
  - **vertical**: Line spans top to bottom; element fills 100% height

  ### Usage Examples
  \`\`\`html
  <!-- horizontal divider -->
  <org-divider></org-divider>

  <!-- vertical divider (parent should have a defined height) -->
  <org-divider direction="vertical"></org-divider>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Divider>;

export const Default: Story = {
  args: {
    direction: 'horizontal',
  },
  argTypes: {
    direction: {
      control: 'select',
      options: allDividerDirections,
      description: 'the orientation of the divider line',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default divider with full controls. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="size-lg">
        <org-divider [direction]="direction"></org-divider>
      </div>
    `,
    moduleMetadata: {
      imports: [Divider],
    },
  }),
};

export const Direction: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of horizontal and vertical orientations, each rendered inside a 512px (size-lg) container.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Direction Variants"
        currentState="Comparing horizontal and vertical directions"
      >
        <org-storybook-example-container-section label="Horizontal">
          <div class="size-lg">
            <org-divider direction="horizontal"></org-divider>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Vertical">
          <div class="size-lg">
            <org-divider direction="vertical"></org-divider>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Horizontal</strong>: Spans the full width of its container with a top border line</li>
          <li><strong>Vertical</strong>: Spans the full height of its container with a left border line</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Divider, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
