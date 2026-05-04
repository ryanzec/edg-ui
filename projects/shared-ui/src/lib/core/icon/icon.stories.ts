import type { Meta, StoryObj } from '@storybook/angular';
import { Icon, allIconNames, allIconColors, allIconSizes } from './icon';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<Icon> = {
  title: 'Core/Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Icon Component

  A component for rendering Lucide Icons with configurable size and color options.

  ### Features
  - Uses Lucide Icons library via [\`@lucide/angular\`](https://lucide.dev/guide/packages/angular)
  - Dynamic icon rendering via \`[lucideIcon]\` directive
  - Five size options: 2xs, xs, sm, base (default), lg
  - Nine color options: inherit (default), primary, secondary, neutral, safe, info, caution, warning, danger
  - Inline display for easy integration with text
  - Accessible with aria-hidden attribute

  ### Size Options
  - **2xs**: 0.625rem / 10px
  - **xs**: 0.75rem / 12px
  - **sm**: 0.8125rem / 13px
  - **base**: 0.875rem / 14px - default
  - **md**: 1rem / 16px
  - **lg**: 1.125rem / 18px
  - **xl**: 1.25rem / 20px
  - **2xl**: 1.5rem / 24px
  - **3xl**: 1.875rem / 30px
  - **4xl**: 2.25rem / 36px

  ### Color Options
  - **inherit**: Inherits text color from parent elements (default)
  - **primary**: Primary color
  - **secondary**: Secondary accent color
  - **neutral**: Neutral/gray color
  - **safe**: Success/positive state (green)
  - **info**: Informational state (blue)
  - **caution**: Caution state (yellow)
  - **warning**: Warning state (orange)
  - **danger**: Error/danger state (red)

  ### Usage Examples
  \`\`\`html
  <!-- Default icon -->
  <org-icon name="check"></org-icon>

  <!-- Icon with size -->
  <org-icon name="check" size="lg"></org-icon>

  <!-- Icon with color -->
  <org-icon name="check" color="primary"></org-icon>

  <!-- Icon with custom color (via parent) -->
  <div class="text-blue-500">
    <org-icon name="check"></org-icon>
  </div>

  <!-- Icon with all options -->
  <org-icon name="check" size="lg" color="safe"></org-icon>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Icon>;

export const Default: Story = {
  args: {
    name: 'check',
    size: 'base',
    color: 'inherit',
    label: undefined,
  },
  argTypes: {
    name: {
      control: 'select',
      options: allIconNames,
      description: 'The name of the icon to display from the Lucide Icons library',
    },
    size: {
      control: 'select',
      options: allIconSizes,
      description: 'The size of the icon',
    },
    color: {
      control: 'select',
      options: allIconColors,
      description: 'The color of the icon',
    },
    label: {
      control: 'text',
      description:
        'Accessible label for the icon; when provided the icon is treated as meaningful (role="img"); omit for decorative icons',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default icon with base size and inherit color. Use the controls below to interact with the component.',
      },
    },
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available size variants (2xs, xs, sm, base, md, lg, xl, 2xl, 3xl, 4xl).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Size Variants"
        currentState="Comparing 2xs, xs, sm, base, md, lg, xl, 2xl, 3xl, and 4xl sizes"
      >
        <org-storybook-example-container-section label="2 Extra Small">
          <org-icon name="check" size="2xs"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Extra Small">
          <org-icon name="check" size="xs"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Small">
          <org-icon name="check" size="sm"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Base - Default">
          <org-icon name="check" size="base"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Medium">
          <org-icon name="check" size="md"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Large">
          <org-icon name="check" size="lg"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Extra Large">
          <org-icon name="check" size="xl"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="2 Extra Large">
          <org-icon name="check" size="2xl"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="3 Extra Large">
          <org-icon name="check" size="3xl"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="4 Extra Large">
          <org-icon name="check" size="4xl"></org-icon>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>2xs</strong>: 0.625rem / 10px</li>
          <li><strong>xs</strong>: 0.75rem / 12px</li>
          <li><strong>sm</strong>: 0.8125rem / 13px</li>
          <li><strong>base</strong>: 0.875rem / 14px - default</li>
          <li><strong>md</strong>: 1rem / 16px</li>
          <li><strong>lg</strong>: 1.125rem / 18px</li>
          <li><strong>xl</strong>: 1.25rem / 20px</li>
          <li><strong>2xl</strong>: 1.5rem / 24px</li>
          <li><strong>3xl</strong>: 1.875rem / 30px</li>
          <li><strong>4xl</strong>: 2.25rem / 36px</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Icon, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all 9 color variants including inherit (default) and 8 component colors.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Color Variants"
        currentState="Comparing all 9 color options"
      >
        <org-storybook-example-container-section label="Inherit (default)">
          <org-icon name="check" color="inherit"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Primary">
          <org-icon name="check" color="primary"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Secondary">
          <org-icon name="check" color="secondary"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Neutral">
          <org-icon name="check" color="neutral"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Safe">
          <org-icon name="check" color="safe"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Info">
          <org-icon name="check" color="info"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Caution">
          <org-icon name="check" color="caution"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Warning">
          <org-icon name="check" color="warning"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Danger">
          <org-icon name="check" color="danger"></org-icon>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>inherit</strong>: Inherits text color from parent elements (default)</li>
          <li><strong>primary</strong>: Primary color</li>
          <li><strong>secondary</strong>: Secondary accent color</li>
          <li><strong>neutral</strong>: Neutral/gray color</li>
          <li><strong>safe</strong>: Success/positive state (green)</li>
          <li><strong>info</strong>: Informational state (blue)</li>
          <li><strong>caution</strong>: Caution state (yellow)</li>
          <li><strong>warning</strong>: Warning state (orange)</li>
          <li><strong>danger</strong>: Error/danger state (red)</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Icon, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const ColorInheritance: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Icons inherit text color from parent elements for flexible styling.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Color Inheritance"
        currentState="Icons inherit text color from parent"
      >
        <org-storybook-example-container-section label="Default (inherits current text color)">
          <org-icon name="check"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Blue text color">
          <div class="text-blue-500">
            <org-icon name="check"></org-icon>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Red text color">
          <div class="text-red-500">
            <org-icon name="x"></org-icon>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Green text color">
          <div class="text-green-500">
            <org-icon name="plus"></org-icon>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Icons automatically inherit the text color from their parent element</li>
          <li>Use css color variables on parent elements to style icons</li>
          <li>This allows icons to adapt to different contexts and themes</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Icon, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Label: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates accessible label behavior: icons with a label are meaningful (role="img", aria-label set); icons without a label are decorative (aria-hidden="true").',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Label (Accessibility)"
        currentState="Meaningful vs decorative icon aria behavior"
      >
        <org-storybook-example-container-section label="Decorative icon (no label — aria-hidden=true)">
          <org-icon name="check"></org-icon>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Meaningful icon (label provided — role=img, aria-label set)">
          <org-icon name="check" label="Task completed"></org-icon>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Decorative icons (no label) have <strong>aria-hidden="true"</strong> — hidden from assistive technology</li>
          <li>Meaningful icons (label provided) have <strong>role="img"</strong> and <strong>aria-label</strong> set — announced by screen readers</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Icon, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const AllIcons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Complete showcase of all available icons from the Lucide Icons library. Click any icon card to copy its name to the clipboard.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="All Available Icons"
        currentState="Displaying all Lucide icons - Click to copy icon name"
      >
        <div class="grid grid-cols-12 gap-4">
          @for (iconName of allIconNames; track iconName) {
            <button
              type="button"
              class="cursor-pointer flex flex-col items-center gap-2 rounded border border-default-color p-3 transition-colors hover:bg-hover focus-visible:bg-hover"
              (click)="copyToClipboard(iconName)"
            >
              <org-icon [name]="iconName"></org-icon>
              <span class="text-xs text-fg">{{ iconName }}</span>
            </button>
          }
        </div>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>All icons are from the Lucide Icons library</li>
          <li>Icons are displayed at base size</li>
          <li>Each icon can be used with any size and color combination</li>
          <li>Click any icon card to copy its name to the clipboard</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Icon, StorybookExampleContainer, StorybookExampleContainerSection],
    },
    props: {
      allIconNames,
      copyToClipboard: async (iconName: string) => {
        try {
          await navigator.clipboard.writeText(iconName);
        } catch (error) {
          console.error('Failed to copy to clipboard:', error);
        }
      },
    },
  }),
};
