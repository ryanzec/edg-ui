import type { Meta, StoryObj } from '@storybook/angular';
import { Skeleton } from './skeleton';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<Skeleton> = {
  title: 'Core/Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Skeleton Component

  A loading placeholder component that displays animated gradient placeholders while content is loading in the background.

  ### Features
  - 2 type variants (table, card)
  - Animated left-to-right gradient shimmer effect
  - Top-left to bottom-right light gray gradient
  - Customizable container classes

  ### Type Options
  - **table**: Renders 7 bars of varying widths with animated gradient
  - **card**: Renders a rectangular card with animated gradient

  ### Usage Examples
  \`\`\`html
  <!-- Table skeleton -->
  <org-skeleton type="table" />

  <!-- Card skeleton -->
  <org-skeleton type="card" />

  <!-- With custom dimensions via class -->
  <org-skeleton type="card" class="w-2xs h-sm" />
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Skeleton>;

export const Default: Story = {
  args: {
    type: 'table',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['table', 'card'],
      description: 'The type of skeleton to display',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default skeleton with table type. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-skeleton
        [type]="type"
      />
    `,
    moduleMetadata: {
      imports: [Skeleton],
    },
  }),
};

export const Types: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of table and card skeleton types.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Skeleton Types"
        currentState="Comparing table and card skeleton types"
      >
        <org-storybook-example-container-section label="Table Type">
          <org-skeleton type="table" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Card Type">
          <org-skeleton type="card" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Table</strong>: 7 bars of varying widths with animated gradient shimmer</li>
          <li><strong>Card</strong>: Rectangular card with animated gradient shimmer</li>
          <li><strong>Animation</strong>: Both types have a smooth left-to-right gradient animation</li>
          <li><strong>Gradient</strong>: Top-left to bottom-right light gray gradient effect</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Skeleton, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const TableVariations: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Different table skeleton variations with different container classes.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Table Skeleton Variations"
        currentState="Comparing different table skeleton configurations"
      >
        <org-storybook-example-container-section label="Default Width">
          <org-skeleton type="table" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Custom Width">
          <org-skeleton type="table" class="w-sm" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Full Width with More Gap">
          <org-skeleton type="table" class="w-full gap-4" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Default</strong>: Uses full width available with standard gap</li>
          <li><strong>Custom Width</strong>: Fixed width can be set via the <code>class</code> attribute on the element</li>
          <li><strong>Custom Gap</strong>: Spacing between bars can be customized</li>
          <li><strong>Bar Widths</strong>: Each bar has a different width (90%, 75%, 95%, 60%, 85%, 70%, 80%)</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Skeleton, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const CardVariations: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Different card skeleton variations with different dimensions.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Card Skeleton Variations"
        currentState="Comparing different card skeleton dimensions"
      >
        <org-storybook-example-container-section label="Default Size">
          <org-skeleton type="card" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Square Card">
          <org-skeleton type="card" class="w-5xs h-5xs" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Wide Card">
          <org-skeleton type="card" class="w-sm h-6xs" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Tall Card">
          <org-skeleton type="card" class="w-5xs h-sm" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Default</strong>: Full width with 200px height</li>
          <li><strong>Square</strong>: Equal width and height for square cards</li>
          <li><strong>Wide</strong>: Wider aspect ratio for horizontal layouts</li>
          <li><strong>Tall</strong>: Taller aspect ratio for vertical layouts</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Skeleton, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const UsageExamples: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Real-world usage examples showing skeletons in typical loading scenarios.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Usage Examples"
        currentState="Real-world skeleton loading scenarios"
      >
        <org-storybook-example-container-section label="Loading User List">
          <div class="flex flex-col gap-4">
            <org-skeleton type="table" />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Loading Product Cards">
          <div class="flex gap-4">
            <org-skeleton type="card" class="w-3xs h-2xs" />
            <org-skeleton type="card" class="w-3xs h-2xs" />
            <org-skeleton type="card" class="w-3xs h-2xs" />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Loading Profile Section">
          <div class="flex gap-4">
            <org-skeleton type="card" class="w-6xs h-6xs" />
            <div class="flex-1">
              <org-skeleton type="table" class="gap-3" />
            </div>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>User List</strong>: Table skeleton for loading list data</li>
          <li><strong>Product Cards</strong>: Multiple card skeletons for grid layouts</li>
          <li><strong>Profile Section</strong>: Combined card and table skeletons for complex layouts</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Skeleton, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
