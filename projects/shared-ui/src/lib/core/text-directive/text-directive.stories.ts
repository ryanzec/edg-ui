import type { Meta, StoryObj } from '@storybook/angular';
import { TextDirective, textColors, textSizes } from './text-directive';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<TextDirective> = {
  title: 'Core/Directives/Text',
  component: TextDirective,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Text Directive

  A directive for applying consistent text colors and sizes across the application.

  ### Features
  - Eight semantic color options: primary, secondary, neutral, safe, info, caution, warning, danger
  - Seven size options: 2xs, xs, sm, md, lg, xl, 2xl
  - Can be used independently or combined
  - Null values use default styling

  ### Color Options
  - **primary**: Primary color
  - **secondary**: Secondary accent color
  - **neutral**: Neutral color
  - **safe**: Success/positive state (green)
  - **info**: Informational state (blue)
  - **caution**: Caution state (yellow)
  - **warning**: Warning state (orange)
  - **danger**: Error/danger state (red)

  ### Size Options
  - **2xs**: 2x extra small (0.625rem / 10px)
  - **xs**: Extra small (0.75rem / 12px)
  - **sm**: Small (0.875rem / 14px)
  - **md**: Medium (1rem / 16px)
  - **lg**: Large (1.125rem / 18px)
  - **xl**: Extra large (1.25rem / 20px)
  - **2xl**: 2x extra large (1.5rem / 24px)

  ### Usage Examples
  \`\`\`html
  <!-- Text with color only -->
  <div orgText textColor="primary">Primary colored text</div>

  <!-- Text with size only -->
  <div orgText textSize="lg">Large text</div>

  <!-- Text with both color and size -->
  <div orgText textColor="danger" textSize="xl">Danger extra large text</div>

  <!-- Text with no styling (uses defaults) -->
  <div orgText>Default text</div>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<TextDirective>;

export const Default: Story = {
  args: {
    textColor: null,
    textSize: null,
  },
  argTypes: {
    textColor: {
      control: 'select',
      options: [null, ...textColors],
      description: 'The semantic color to apply to the text',
    },
    textSize: {
      control: 'select',
      options: [null, ...textSizes],
      description: 'The size to apply to the text',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default text directive with no color or size applied. Use the controls below to interact with the directive.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div orgText [textColor]="textColor" [textSize]="textSize">
        This is sample text with the text directive applied.
      </div>
    `,
    moduleMetadata: {
      imports: [TextDirective],
    },
  }),
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all 8 semantic color options.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Color Variants"
        currentState="Comparing all 8 semantic color options"
      >
        <org-storybook-example-container-section label="Default">
          <div orgText>Default text color</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Primary">
          <div orgText textColor="primary">Primary text color</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Secondary">
          <div orgText textColor="secondary">Secondary text color</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Neutral">
          <div orgText textColor="neutral">Neutral text color</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Safe">
          <div orgText textColor="safe">Safe text color</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Info">
          <div orgText textColor="info">Info text color</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Caution">
          <div orgText textColor="caution">Caution text color</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Warning">
          <div orgText textColor="warning">Warning text color</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Danger">
          <div orgText textColor="danger">Danger text color</div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>primary</strong>: Primary color</li>
          <li><strong>secondary</strong>: Secondary accent color</li>
          <li><strong>neutral</strong>: Neutral color</li>
          <li><strong>safe</strong>: Success/positive state (green)</li>
          <li><strong>info</strong>: Informational state (blue)</li>
          <li><strong>caution</strong>: Caution state (yellow)</li>
          <li><strong>warning</strong>: Warning state (orange)</li>
          <li><strong>danger</strong>: Error/danger state (red)</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [TextDirective, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all 7 size options.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Size Variants"
        currentState="Comparing all 7 size options"
      >
        <org-storybook-example-container-section label="2x Extra Small (2xs)">
          <div orgText textSize="2xs">2x extra small text (0.625rem / 10px)</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Extra Small (xs)">
          <div orgText textSize="xs">Extra small text (0.75rem / 12px)</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Small (sm)">
          <div orgText textSize="sm">Small text (0.875rem / 14px)</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Medium (md)">
          <div orgText textSize="md">Medium text (1rem / 16px)</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Large (lg)">
          <div orgText textSize="lg">Large text (1.125rem / 18px)</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Extra Large (xl)">
          <div orgText textSize="xl">Extra large text (1.25rem / 20px)</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="2x Extra Large (2xl)">
          <div orgText textSize="2xl">2xl text (1.5rem / 24px)</div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>2xs</strong>: 0.625rem / 10px</li>
          <li><strong>xs</strong>: 0.75rem / 12px</li>
          <li><strong>sm</strong>: 0.875rem / 14px</li>
          <li><strong>md</strong>: 1rem / 16px</li>
          <li><strong>lg</strong>: 1.125rem / 18px</li>
          <li><strong>xl</strong>: 1.25rem / 20px</li>
          <li><strong>2xl</strong>: 1.5rem / 24px</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [TextDirective, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Combined: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Examples of combining color and size options.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Combined Color and Size"
        currentState="Demonstrating color and size combinations"
      >
        <org-storybook-example-container-section label="Primary + Large">
          <div orgText textColor="primary" textSize="lg">Primary large text</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Danger + Extra Large">
          <div orgText textColor="danger" textSize="xl">Danger extra large text</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Safe + Small">
          <div orgText textColor="safe" textSize="sm">Safe small text</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Neutral + Large">
          <div orgText textColor="neutral" textSize="lg">Neutral large text</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Info + 2xl">
          <div orgText textColor="info" textSize="2xl">Info 2xl text</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Warning + Extra Small">
          <div orgText textColor="warning" textSize="xs">Warning extra small text</div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Secondary + Medium">
          <div orgText textColor="secondary" textSize="md">Secondary medium text</div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Color and size can be used independently or together</li>
          <li>Both properties are optional and default to null</li>
          <li>When null, the element uses its inherited or default styling</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [TextDirective, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
