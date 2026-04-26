import type { Meta, StoryObj } from '@storybook/angular';
import { Tooltip, allTooltipXPositionValues, allTooltipYPositionValues } from './tooltip';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { Button } from '../button/button';

const meta: Meta<Tooltip> = {
  title: 'Core/Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Tooltip Component

  A flexible tooltip component that displays content in an overlay attached to a trigger element. Uses Angular CDK's Overlay feature for robust positioning and rendering.

  ### Features
  - Hover or click trigger modes
  - Customizable open/close delays
  - Optional keep-open-on-hover behavior
  - Template-based content for maximum flexibility
  - Smart positioning with automatic fallback positions
  - Event callbacks for open and close actions

  ### Trigger Types
  - **hover**: Tooltip appears on mouse enter and disappears on mouse leave
  - **click**: Tooltip toggles on click

  ### Usage Examples
  \`\`\`html
  <!-- Basic hover tooltip -->
  <ng-template #tooltipContent>
    <div class="bg-background-level2 text-text px-2 py-1 rounded-md">
      Tooltip text
    </div>
  </ng-template>

  <org-tooltip [templateRef]="tooltipContent">
    <button>Hover me</button>
  </org-tooltip>

  <!-- Click trigger tooltip -->
  <org-tooltip
    [templateRef]="tooltipContent"
    triggerType="click"
  >
    <button>Click me</button>
  </org-tooltip>

  <!-- Custom delays -->
  <org-tooltip
    [templateRef]="tooltipContent"
    [openDelay]="500"
    [closeDelay]="100"
  >
    <button>Slow open, fast close</button>
  </org-tooltip>

  <!-- Keep open on hover -->
  <org-tooltip
    [templateRef]="tooltipContent"
    [keepOpenOnHover]="true"
  >
    <button>Hover me or the tooltip</button>
  </org-tooltip>
</div>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Tooltip>;

export const Default: Story = {
  args: {
    triggerType: 'hover',
    openDelay: 200,
    closeDelay: 200,
    keepOpenOnHover: false,
    xPosition: 'center',
    yPosition: 'bottom',
  },
  argTypes: {
    triggerType: {
      control: 'select',
      options: ['hover', 'click'],
      description: 'How the tooltip is triggered',
    },
    openDelay: {
      control: 'number',
      description: 'Delay in milliseconds before showing the tooltip',
    },
    closeDelay: {
      control: 'number',
      description: 'Delay in milliseconds before hiding the tooltip',
    },
    keepOpenOnHover: {
      control: 'boolean',
      description: 'Whether to keep the tooltip open when hovering over it',
    },
    xPosition: {
      control: 'select',
      options: allTooltipXPositionValues,
      description: 'Horizontal position of tooltip relative to trigger',
    },
    yPosition: {
      control: 'select',
      options: allTooltipYPositionValues,
      description: 'Vertical position of tooltip relative to trigger',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default tooltip with hover trigger. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
    },
    template: `
      <ng-template #tooltipContent>
        <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
          This is a tooltip
        </div>
      </ng-template>

      <div class="flex items-center justify-center h-5xs">
        <org-tooltip
          [triggerType]="triggerType"
          [templateRef]="tooltipContent"
          [openDelay]="openDelay"
          [closeDelay]="closeDelay"
          [keepOpenOnHover]="keepOpenOnHover"
          [xPosition]="xPosition"
          [yPosition]="yPosition"
        >
          <org-button color="primary">Hover or click me</org-button>
        </org-tooltip>
      </div>
    `,
    moduleMetadata: {
      imports: [Tooltip, Button],
    },
  }),
};

export const TriggerTypes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of hover and click trigger types.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Trigger Types"
        currentState="Comparing hover and click triggers"
      >
        <org-storybook-example-container-section label="Hover Trigger">
          <ng-template #hoverTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Hover trigger tooltip
            </div>
          </ng-template>

          <org-tooltip
            triggerType="hover"
            [templateRef]="hoverTooltip"
          >
            <org-button color="primary">Hover me</org-button>
          </org-tooltip>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Click Trigger">
          <ng-template #clickTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Click trigger tooltip
            </div>
          </ng-template>

          <org-tooltip
            triggerType="click"
            [templateRef]="clickTooltip"
          >
            <org-button color="secondary">Click me</org-button>
          </org-tooltip>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Hover</strong>: Tooltip appears on mouse enter, disappears on mouse leave</li>
          <li><strong>Click</strong>: Tooltip toggles on click</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Tooltip, Button, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Delays: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different delay configurations for hover tooltips.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Delay Configurations"
        currentState="Comparing different open and close delays"
      >
        <org-storybook-example-container-section label="Default Delays (200ms / 200ms)">
          <ng-template #defaultDelayTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Default delays
            </div>
          </ng-template>

          <org-tooltip
            [templateRef]="defaultDelayTooltip"
            [openDelay]="200"
            [closeDelay]="200"
          >
            <org-button color="primary">Hover me</org-button>
          </org-tooltip>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="No Delays (0ms / 0ms)">
          <ng-template #noDelayTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Instant tooltip
            </div>
          </ng-template>

          <org-tooltip
            [templateRef]="noDelayTooltip"
            [openDelay]="0"
            [closeDelay]="0"
          >
            <org-button color="primary">Hover me</org-button>
          </org-tooltip>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Slow Open (500ms / 200ms)">
          <ng-template #slowOpenTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Slow to appear
            </div>
          </ng-template>

          <org-tooltip
            [templateRef]="slowOpenTooltip"
            [openDelay]="500"
            [closeDelay]="200"
          >
            <org-button color="primary">Hover me</org-button>
          </org-tooltip>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Fast Close (200ms / 50ms)">
          <ng-template #fastCloseTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Quick to disappear
            </div>
          </ng-template>

          <org-tooltip
            [templateRef]="fastCloseTooltip"
            [openDelay]="200"
            [closeDelay]="50"
          >
            <org-button color="primary">Hover me</org-button>
          </org-tooltip>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>openDelay</strong>: Time to wait before showing tooltip on hover</li>
          <li><strong>closeDelay</strong>: Time to wait before hiding tooltip after mouse leave</li>
          <li>Delays only apply to hover trigger type</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Tooltip, Button, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const KeepOpenOnHover: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of tooltip behavior with and without keepOpenOnHover. When enabled, the tooltip stays open when you hover over it, useful for interactive tooltip content.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Keep Open On Hover"
        currentState="Comparing keepOpenOnHover behavior"
      >
        <org-storybook-example-container-section label="Default (false)">
          <ng-template #normalTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              This will close when you move away
            </div>
          </ng-template>

          <org-tooltip
            [templateRef]="normalTooltip"
            [keepOpenOnHover]="false"
          >
            <org-button color="primary">Hover me</org-button>
          </org-tooltip>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Keep Open On Hover (true)">
          <ng-template #keepOpenTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Try hovering over this tooltip content!
            </div>
          </ng-template>

          <org-tooltip
            [templateRef]="keepOpenTooltip"
            [keepOpenOnHover]="true"
          >
            <org-button color="secondary">Hover me</org-button>
          </org-tooltip>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>false</strong>: Tooltip closes immediately when mouse leaves trigger element</li>
          <li><strong>true</strong>: Tooltip stays open when hovering over it, closes when leaving both trigger and tooltip</li>
          <li>Useful for interactive tooltip content (links, buttons, etc.)</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Tooltip, Button, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const RichContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Examples of tooltips with rich content including multiple elements, formatting, and interactive elements.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Rich Content"
        currentState="Demonstrating various content styles"
      >
        <org-storybook-example-container-section label="Simple Text">
          <ng-template #simpleTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Simple tooltip text
            </div>
          </ng-template>

          <org-tooltip [templateRef]="simpleTooltip">
            <org-button color="primary">Simple</org-button>
          </org-tooltip>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Multi-line Content">
          <ng-template #multilineTooltip>
            <div class="bg-background-level2 text-text px-2.5 py-1.5 rounded-md border border-border max-w-5xs">
              <div class="font-bold text-sm">Tooltip Title</div>
              <div class="text-xs text-text-subtle mt-1">
                This is a longer tooltip with multiple lines of content to demonstrate how it handles text wrapping.
              </div>
            </div>
          </ng-template>

          <org-tooltip [templateRef]="multilineTooltip">
            <org-button color="primary">Multi-line</org-button>
          </org-tooltip>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Formatted Content">
          <ng-template #formattedTooltip>
            <div class="bg-background-level2 text-text px-2.5 py-1.5 rounded-md border border-border max-w-3xs">
              <div class="font-bold text-md mb-1">User Information</div>
              <div class="flex flex-col gap-1 text-sm">
                <div><span class="text-text-subtle">Name:</span> John Doe</div>
                <div><span class="text-text-subtle">Role:</span> Administrator</div>
                <div><span class="text-text-subtle">Status:</span> <span class="text-safe-text">Active</span></div>
              </div>
            </div>
          </ng-template>

          <org-tooltip [templateRef]="formattedTooltip">
            <org-button color="primary">Formatted</org-button>
          </org-tooltip>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Action Button">
          <ng-template #interactiveTooltip>
            <div class="bg-background-level2 text-text px-2.5 py-1.5 rounded-md border border-border max-w-5xs">
              <div class="text-sm mb-1.5">This tooltip has interactive content</div>
              <org-button
                color="primary"
                size="sm"
              >
                Click me
              </org-button>
            </div>
          </ng-template>

          <org-tooltip
            [templateRef]="interactiveTooltip"
            [keepOpenOnHover]="true"
          >
            <org-button color="secondary">Interactive</org-button>
          </org-tooltip>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Tooltip content is completely customizable via templates</li>
          <li>Can include any Angular content, components, directives, etc.</li>
          <li>Use keepOpenOnHover for interactive content</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Tooltip, Button, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Positioning: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Control tooltip position with xPosition and yPosition inputs. Tooltips automatically fall back to alternative positions if there is insufficient space.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Positioning"
        currentState="Demonstrating different tooltip positions"
      >
        <org-storybook-example-container-section label="Vertical Positions">
          <ng-template #topTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Top position
            </div>
          </ng-template>
          <ng-template #bottomTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Bottom position
            </div>
          </ng-template>

          <div class="flex gap-4">
            <org-tooltip [templateRef]="topTooltip" xPosition="center" yPosition="top">
              <org-button color="primary">Top</org-button>
            </org-tooltip>

            <org-tooltip [templateRef]="bottomTooltip" xPosition="center" yPosition="bottom">
              <org-button color="primary">Bottom</org-button>
            </org-tooltip>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Horizontal Positions">
          <ng-template #leftTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Left position
            </div>
          </ng-template>

          <ng-template #rightTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Right position
            </div>
          </ng-template>

          <div class="flex gap-4 flex-col items-start">
            <div>
              This text provides padding above the trigger so the left-positioned tooltip has room to render.
              <org-tooltip [templateRef]="leftTooltip" xPosition="left" yPosition="center">
                <org-button color="primary">Left</org-button>
              </org-tooltip>
            </div>

            <org-tooltip [templateRef]="rightTooltip" xPosition="right" yPosition="center">
              <org-button color="primary">Right</org-button>
            </org-tooltip>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Combined Positions">
          <ng-template #topLeftTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Top Left
            </div>
          </ng-template>

          <ng-template #topRightTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Top Right
            </div>
          </ng-template>

          <ng-template #bottomLeftTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Bottom Left
            </div>
          </ng-template>

          <ng-template #bottomRightTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Bottom Right
            </div>
          </ng-template>

          <div class="flex gap-4">
            <org-tooltip [templateRef]="topRightTooltip" xPosition="right" yPosition="top">
              <org-button color="primary">Top Right</org-button>
            </org-tooltip>

            <org-tooltip [templateRef]="bottomLeftTooltip" xPosition="left" yPosition="bottom">
              <org-button color="primary">Bottom Left</org-button>
            </org-tooltip>

            <org-tooltip [templateRef]="bottomRightTooltip" xPosition="right" yPosition="bottom">
              <org-button color="primary">Bottom Right</org-button>
            </org-tooltip>

            <org-tooltip [templateRef]="topLeftTooltip" xPosition="left" yPosition="top">
              <org-button color="primary">Top Left</org-button>
            </org-tooltip>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>xPosition</strong>: Controls horizontal positioning (left, center, right)</li>
          <li><strong>yPosition</strong>: Controls vertical positioning (top, center, bottom)</li>
          <li>Tooltips automatically fall back to alternative positions if insufficient space</li>
          <li>Default position is center/bottom (below the trigger element)</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Tooltip, Button, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Events: StoryObj<Tooltip> = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the opened and closed output events. Open your browser devtools console to see events logged when the tooltip opens and closes.',
      },
    },
  },
  render: () => ({
    props: {
      handleOpened: () => console.log('tooltip opened'),
      handleClosed: () => console.log('tooltip closed'),
    },
    template: `
      <org-storybook-example-container
        title="Output Events"
        currentState="Open devtools console to observe opened and closed events"
      >
        <org-storybook-example-container-section label="Hover Trigger Events">
          <ng-template #hoverEventTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Hover tooltip
            </div>
          </ng-template>

          <org-tooltip
            [templateRef]="hoverEventTooltip"
            (opened)="handleOpened()"
            (closed)="handleClosed()"
          >
            <org-button color="primary">Hover me</org-button>
          </org-tooltip>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Click Trigger Events">
          <ng-template #clickEventTooltip>
            <div class="bg-background-level2 text-text px-2 py-1 rounded-md border border-border">
              Click tooltip
            </div>
          </ng-template>

          <org-tooltip
            triggerType="click"
            [templateRef]="clickEventTooltip"
            (opened)="handleOpened()"
            (closed)="handleClosed()"
          >
            <org-button color="secondary">Click me</org-button>
          </org-tooltip>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>opened</strong>: Emitted each time the tooltip becomes visible</li>
          <li><strong>closed</strong>: Emitted each time the tooltip is hidden</li>
          <li>Check the browser devtools console to see the events fire</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Tooltip, Button, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
