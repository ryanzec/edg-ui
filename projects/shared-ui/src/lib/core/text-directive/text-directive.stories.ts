import type { Meta, StoryObj } from '@storybook/angular';
import { TextDirective, textColors, textSizes } from './text-directive';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';

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
  - Seven size options: 2xs, xs, sm, lg, xl, 2xl, 3xl
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
  - **lg**: Large (1rem / 16px)
  - **xl**: Extra large (1.125rem / 18px)
  - **2xl**: 2x extra large (1.25rem / 20px)
  - **3xl**: 3x extra large (1.5rem / 24px)

  ### Usage Examples
  \`\`\`html
  <!-- Text with color only -->
  <div orgText textColor="primary">Primary colored text</div>

  <!-- Text with size only -->
  <div orgText textSize="xl">Large text</div>

  <!-- Text with both color and size -->
  <div orgText textColor="danger" textSize="2xl">Danger extra large text</div>

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
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Color Variants" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Default</div>
            <div orgText>Default text color</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Primary</div>
            <div orgText textColor="primary">Primary text color</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Secondary</div>
            <div orgText textColor="secondary">Secondary text color</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Neutral</div>
            <div orgText textColor="neutral">Neutral text color</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Safe</div>
            <div orgText textColor="safe">Safe text color</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Info</div>
            <div orgText textColor="info">Info text color</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Caution</div>
            <div orgText textColor="caution">Caution text color</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Warning</div>
            <div orgText textColor="warning">Warning text color</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Danger</div>
            <div orgText textColor="danger">Danger text color</div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>primary</strong>: Primary color</li>
          <li><strong>secondary</strong>: Secondary accent color</li>
          <li><strong>neutral</strong>: Neutral color</li>
          <li><strong>safe</strong>: Success/positive state (green)</li>
          <li><strong>info</strong>: Informational state (blue)</li>
          <li><strong>caution</strong>: Caution state (yellow)</li>
          <li><strong>warning</strong>: Warning state (orange)</li>
          <li><strong>danger</strong>: Error/danger state (red)</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        TextDirective,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
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
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Size Variants" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">2x Extra Small (2xs)</div>
            <div orgText textSize="2xs">2x extra small text (0.625rem / 10px)</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Extra Small (xs)</div>
            <div orgText textSize="xs">Extra small text (0.75rem / 12px)</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Small (sm)</div>
            <div orgText textSize="sm">Small text (0.875rem / 14px)</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Large (lg)</div>
            <div orgText textSize="lg">Large text (1rem / 16px)</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Extra Large (xl)</div>
            <div orgText textSize="xl">Extra large text (1.125rem / 18px)</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">2x Extra Large (2xl)</div>
            <div orgText textSize="2xl">2xl text (1.25rem / 20px)</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">3x Extra Large (3xl)</div>
            <div orgText textSize="3xl">3xl text (1.5rem / 24px)</div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>2xs</strong>: 0.625rem / 10px</li>
          <li><strong>xs</strong>: 0.75rem / 12px</li>
          <li><strong>sm</strong>: 0.875rem / 14px</li>
          <li><strong>lg</strong>: 1rem / 16px</li>
          <li><strong>xl</strong>: 1.125rem / 18px</li>
          <li><strong>2xl</strong>: 1.25rem / 20px</li>
          <li><strong>3xl</strong>: 1.5rem / 24px</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        TextDirective,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
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
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Combined Color and Size" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Primary + Large</div>
            <div orgText textColor="primary" textSize="xl">Primary large text</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Danger + Extra Large</div>
            <div orgText textColor="danger" textSize="2xl">Danger extra large text</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Safe + Small</div>
            <div orgText textColor="safe" textSize="sm">Safe small text</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Neutral + Large</div>
            <div orgText textColor="neutral" textSize="xl">Neutral large text</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Info + 2xl</div>
            <div orgText textColor="info" textSize="3xl">Info 2xl text</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Warning + Extra Small</div>
            <div orgText textColor="warning" textSize="xs">Warning extra small text</div>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Secondary + Medium</div>
            <div orgText textColor="secondary" textSize="lg">Secondary medium text</div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Color and size can be used independently or together</li>
          <li>Both properties are optional and default to null</li>
          <li>When null, the element uses its inherited or default styling</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        TextDirective,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};
