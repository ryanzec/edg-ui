import type { Meta, StoryObj } from '@storybook/angular';
import { Box, allBoxBackgrounds, allBoxBorders, allBoxColors, allBoxPaddings } from './box';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<Box> = {
  title: 'Core/Components/Box',
  component: Box,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Box Component

  A general-purpose visual container component providing configurable border and background styling with color
  variant support.

  ### Features
  - Rounded corners and overflow clipping
  - Bordered and borderless border variants
  - 8 semantic color variants for border and background
  - Configurable internal padding
  - Optional colorless background mode so color only affects the border
  - Accepts any content via ng-content

  ### Border Options
  - **bordered**: Renders a visible border (default)
  - **borderless**: Border is transparent, only background color is applied
  - **border-thick**: Renders a thicker (2px) visible border
  - **border-emphasize**: Top/right/bottom use the default border color; left border is 7px and matches the color input

  ### Padding Options
  - **none**: No internal padding
  - **sm**: Small padding
  - **md**: Medium padding (default)
  - **lg**: Large padding

  ### Color Options
  - **null/default**: Default border and background
  - **primary**: Primary color
  - **secondary**: Secondary accent color
  - **neutral**: Neutral gray
  - **safe**: Success/safe state (green)
  - **info**: Informational state (blue)
  - **caution**: Caution state (yellow)
  - **warning**: Warning state (orange)
  - **danger**: Danger/error state (red)

  ### Background Options
  - **colored**: Color input tints both the border and the background (default)
  - **colorless**: Color input only affects the border; background stays at the default

  ### Usage Examples
  \`\`\`html
  <!-- basic box -->
  <org-box>
    Content inside a bordered box.
  </org-box>

  <!-- colored box -->
  <org-box color="primary">
    Primary colored box.
  </org-box>

  <!-- borderless box with background color -->
  <org-box color="safe" border="borderless">
    Borderless box with safe background.
  </org-box>

  <!-- colorless background so only the border is tinted -->
  <org-box color="danger" background="colorless">
    Danger border, default background.
  </org-box>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Box>;

export const Default: Story = {
  args: {
    color: null,
    border: 'bordered',
    padding: 'base',
    background: 'colored',
  },
  argTypes: {
    color: {
      control: 'select',
      options: [null, ...allBoxColors],
      description: 'the color variant applied to the border and background',
    },
    border: {
      control: 'select',
      options: allBoxBorders,
      description: 'whether to show a visible border or only the background color',
    },
    padding: {
      control: 'select',
      options: allBoxPaddings,
      description: 'the internal padding applied to the box',
    },
    background: {
      control: 'select',
      options: allBoxBackgrounds,
      description: 'whether the color input tints the background (colored) or leaves the default (colorless)',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default box with full controls. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div>
        <org-box [color]="color" [border]="border" [padding]="padding" [background]="background">
          Box content.
        </org-box>
      </div>
    `,
    moduleMetadata: {
      imports: [Box],
    },
  }),
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all color variants for both bordered and borderless borders.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Color Variants"
        currentState="Comparing default and all 8 color options (bordered)"
      >
        <org-storybook-example-container-section label="Default (No Color)">
          <div>
            <org-box>Default box.</org-box>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Primary">
          <div>
            <org-box color="primary">Primary box.</org-box>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Secondary">
          <div>
            <org-box color="secondary">Secondary box.</org-box>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Neutral">
          <div>
            <org-box color="neutral">Neutral box.</org-box>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Safe">
          <div>
            <org-box color="safe">Safe box.</org-box>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Info">
          <div>
            <org-box color="info">Info box.</org-box>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Caution">
          <div>
            <org-box color="caution">Caution box.</org-box>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Warning">
          <div>
            <org-box color="warning">Warning box.</org-box>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Danger">
          <div>
            <org-box color="danger">Danger box.</org-box>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Default</strong>: Standard border and background</li>
          <li><strong>Primary</strong>: Primary color for main content</li>
          <li><strong>Secondary</strong>: Secondary accent for supporting content</li>
          <li><strong>Neutral</strong>: Neutral gray for low-emphasis containers</li>
          <li><strong>Safe</strong>: Green for success/positive status</li>
          <li><strong>Info</strong>: Blue for informational content</li>
          <li><strong>Caution</strong>: Yellow for caution states</li>
          <li><strong>Warning</strong>: Orange for important warnings</li>
          <li><strong>Danger</strong>: Red for error/critical status</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Box, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Borders: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of bordered, borderless, border-thick, and border-emphasize borders across color options.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Borders"
        currentState="Comparing bordered, borderless, border-thick, and border-emphasize borders"
      >
        <org-storybook-example-container-section label="Bordered (Default)">
          <div class="flex flex-col gap-2 max-w-sm">
            <org-box>Default bordered.</org-box>
            <org-box color="primary">Primary bordered.</org-box>
            <org-box color="safe">Safe bordered.</org-box>
            <org-box color="danger">Danger bordered.</org-box>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Borderless">
          <div class="flex flex-col gap-2 max-w-sm">
            <org-box border="borderless">Default borderless.</org-box>
            <org-box color="primary" border="borderless">Primary borderless.</org-box>
            <org-box color="safe" border="borderless">Safe borderless.</org-box>
            <org-box color="danger" border="borderless">Danger borderless.</org-box>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Border Thick">
          <div class="flex flex-col gap-2 max-w-sm">
            <org-box border="border-thick">Default border-thick.</org-box>
            <org-box color="primary" border="border-thick">Primary border-thick.</org-box>
            <org-box color="safe" border="border-thick">Safe border-thick.</org-box>
            <org-box color="danger" border="border-thick">Danger border-thick.</org-box>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Border Emphasize">
          <div class="flex flex-col gap-2 max-w-sm">
            <org-box border="border-emphasize">Default border-emphasize.</org-box>
            <org-box color="primary" border="border-emphasize">Primary border-emphasize.</org-box>
            <org-box color="safe" border="border-emphasize">Safe border-emphasize.</org-box>
            <org-box color="danger" border="border-emphasize">Danger border-emphasize.</org-box>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Bordered</strong>: Visible colored border with matching subtle background</li>
          <li><strong>Borderless</strong>: Transparent border — only the background color is applied</li>
          <li><strong>Border Thick</strong>: Thicker (2px) visible border with matching subtle background</li>
          <li><strong>Border Emphasize</strong>: Top/right/bottom borders use the default border color; the left border is 7px and matches the color input</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Box, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Background: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of colored vs colorless backgrounds. When colorless, the color input only tints the border and the background stays at the default.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Background"
        currentState="Comparing colored and colorless backgrounds with bordered and border-emphasize borders"
      >
        <org-storybook-example-container-section label="Bordered - Colored (Default)">
          <div class="flex flex-col gap-2 max-w-sm">
            <org-box color="primary" border="bordered">Primary bordered colored.</org-box>
            <org-box color="safe" border="bordered">Safe bordered colored.</org-box>
            <org-box color="warning" border="bordered">Warning bordered colored.</org-box>
            <org-box color="danger" border="bordered">Danger bordered colored.</org-box>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Bordered - Colorless">
          <div class="flex flex-col gap-2 max-w-sm">
            <org-box color="primary" border="bordered" background="colorless">Primary bordered colorless.</org-box>
            <org-box color="safe" border="bordered" background="colorless">Safe bordered colorless.</org-box>
            <org-box color="warning" border="bordered" background="colorless">Warning bordered colorless.</org-box>
            <org-box color="danger" border="bordered" background="colorless">Danger bordered colorless.</org-box>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Border Emphasize - Colored (Default)">
          <div class="flex flex-col gap-2 max-w-sm">
            <org-box color="primary" border="border-emphasize">Primary border-emphasize colored.</org-box>
            <org-box color="safe" border="border-emphasize">Safe border-emphasize colored.</org-box>
            <org-box color="warning" border="border-emphasize">Warning border-emphasize colored.</org-box>
            <org-box color="danger" border="border-emphasize">Danger border-emphasize colored.</org-box>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Border Emphasize - Colorless">
          <div class="flex flex-col gap-2 max-w-sm">
            <org-box color="primary" border="border-emphasize" background="colorless">
              Primary border-emphasize colorless.
            </org-box>
            <org-box color="safe" border="border-emphasize" background="colorless">
              Safe border-emphasize colorless.
            </org-box>
            <org-box color="warning" border="border-emphasize" background="colorless">
              Warning border-emphasize colorless.
            </org-box>
            <org-box color="danger" border="border-emphasize" background="colorless">
              Danger border-emphasize colorless.
            </org-box>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Colored</strong>: The color input tints both the border and the background (default)</li>
          <li><strong>Colorless</strong>: The color input only affects the border; the background stays at the default</li>
          <li><strong>Bordered + Colorless</strong>: Useful when you want a subtle neutral container with a semantic border accent</li>
          <li><strong>Border Emphasize + Colorless</strong>: Useful for call-out style containers where only the left accent bar is colored</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Box, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Padding: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all padding options: none, sm, md (default), and lg.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Padding"
        currentState="Comparing none, sm, md, and lg padding options"
      >
        <org-storybook-example-container-section label="None">
          <org-box padding="none">Box with no padding.</org-box>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Small">
          <org-box padding="sm">Box with small padding.</org-box>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Base (Default)">
          <org-box padding="base">Box with base padding.</org-box>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Large">
          <org-box padding="lg">Box with large padding.</org-box>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>None</strong>: No internal padding applied</li>
          <li><strong>Small</strong>: Small padding</li>
          <li><strong>Base</strong>: Base padding — the default value</li>
          <li><strong>Large</strong>: Large padding for spacious content areas</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Box, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
