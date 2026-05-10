import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { allComponentColors, type ComponentColor } from '../types/component-types';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import {
  Divider,
  allDividerDirections,
  allDividerPaddings,
  allDividerStyles,
  allDividerWeights,
  type DividerDirection,
  type DividerPadding,
  type DividerStyle,
  type DividerWeight,
} from './divider';

type LiveDemoColorChoice = 'none' | ComponentColor;

const allLiveDemoColorChoices = ['none', ...allComponentColors] as const satisfies readonly LiveDemoColorChoice[];

const liveDemoDirectionItems: ButtonToggleItem[] = allDividerDirections.map((direction) => ({
  label: direction,
  value: direction,
  buttonColor: 'primary',
}));

const liveDemoLineStyleItems: ButtonToggleItem[] = allDividerStyles.map((lineStyle) => ({
  label: lineStyle,
  value: lineStyle,
  buttonColor: 'primary',
}));

const liveDemoWeightItems: ButtonToggleItem[] = allDividerWeights.map((weight) => ({
  label: weight,
  value: weight,
  buttonColor: 'primary',
}));

const liveDemoPaddingItems: ButtonToggleItem[] = allDividerPaddings.map((padding) => ({
  label: padding,
  value: padding,
  buttonColor: 'primary',
}));

const liveDemoColorItems: ButtonToggleItem[] = allLiveDemoColorChoices.map((color) => ({
  label: color,
  value: color,
  buttonColor: 'primary',
}));

@Component({
  selector: 'story-divider-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Divider,
    ButtonToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlGroup,
    DesignSystemDemoCanvas,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .canvas-stage {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 6rem; /* 96px */
      }
      .horizontal-stage {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      .vertical-stage {
        display: flex;
        align-self: stretch;
        align-items: stretch;
        height: 6rem; /* 96px */
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="The divider below is real and reacts to every input. Toggle direction, style, weight, padding, and color to see each axis in isolation."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Direction">
            <org-button-toggle [items]="directionItems" formControlName="direction" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Line style">
            <org-button-toggle [items]="lineStyleItems" formControlName="lineStyle" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Weight">
            <org-button-toggle [items]="weightItems" formControlName="weight" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Padding">
            <org-button-toggle [items]="paddingItems" formControlName="padding" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Color">
            <org-button-toggle [items]="colorItems" formControlName="color" buttonSize="sm" />
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            @if (liveDemoForm.controls.direction.value === 'horizontal') {
              <div class="horizontal-stage">
                <org-divider
                  direction="horizontal"
                  [lineStyle]="liveDemoForm.controls.lineStyle.value"
                  [weight]="liveDemoForm.controls.weight.value"
                  [padding]="liveDemoForm.controls.padding.value"
                  [color]="resolveColor()"
                />
              </div>
            } @else {
              <div class="vertical-stage">
                <org-divider
                  direction="vertical"
                  [lineStyle]="liveDemoForm.controls.lineStyle.value"
                  [weight]="liveDemoForm.controls.weight.value"
                  [padding]="liveDemoForm.controls.padding.value"
                  [color]="resolveColor()"
                />
              </div>
            }
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class DividerLiveDemoStory {
  protected readonly directionItems = liveDemoDirectionItems;
  protected readonly lineStyleItems = liveDemoLineStyleItems;
  protected readonly weightItems = liveDemoWeightItems;
  protected readonly paddingItems = liveDemoPaddingItems;
  protected readonly colorItems = liveDemoColorItems;

  protected readonly liveDemoForm = new FormGroup({
    direction: new FormControl<DividerDirection>('horizontal', { nonNullable: true }),
    lineStyle: new FormControl<DividerStyle>('solid', { nonNullable: true }),
    weight: new FormControl<DividerWeight>('thin', { nonNullable: true }),
    padding: new FormControl<DividerPadding>('sm', { nonNullable: true }),
    color: new FormControl<LiveDemoColorChoice>('none', { nonNullable: true }),
  });

  protected resolveColor(): ComponentColor | undefined {
    const choice = this.liveDemoForm.controls.color.value;

    return choice === 'none' ? undefined : choice;
  }
}

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

  A thin separator line between sections, list rows, or columns. Renders horizontal or vertical, in three styles (solid / dashed / dotted), two weights (thin / thick), and any of the semantic component colors. The line is implemented as a real CSS border so it renders as a true 1-device-pixel hairline at any zoom and contributes nothing else to the box model.

  ### Features
  - Two directions: horizontal and vertical
  - Three line styles: solid, dashed, dotted
  - Two line weights: thin (1px) and thick (2px)
  - Four padding sizes for cross-axis breathing room: none, sm, base, lg
  - Optional semantic color override (primary, secondary, neutral, safe, info, caution, warning, danger); defaults to the standard border color
  - Decorative chrome — never accepts focus or hover affordances

  ### Direction Options
  - **horizontal** (default): Line spans left to right via a top border; element fills 100% width
  - **vertical**: Line spans top to bottom via a left border; relies on a flex parent to stretch the element

  ### Usage Examples
  \`\`\`html
  <!-- default: horizontal · solid · thin · default border color · sm padding -->
  <org-divider />

  <!-- vertical, dashed, danger-tinted, no surrounding padding -->
  <org-divider direction="vertical" lineStyle="dashed" color="danger" padding="none" />
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
    lineStyle: 'solid',
    weight: 'thin',
    padding: 'sm',
    color: undefined,
  },
  argTypes: {
    direction: {
      control: 'select',
      options: allDividerDirections,
      description: 'The orientation of the divider line',
    },
    lineStyle: {
      control: 'select',
      options: allDividerStyles,
      description: 'The line style of the divider (solid / dashed / dotted)',
    },
    weight: {
      control: 'select',
      options: allDividerWeights,
      description: 'The line weight (thickness) of the divider',
    },
    padding: {
      control: 'select',
      options: allDividerPaddings,
      description: 'Cross-axis breathing room around the divider line',
    },
    color: {
      control: 'select',
      options: [undefined, ...allComponentColors],
      description: 'The semantic color of the divider line — when omitted the default border color is used',
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
        <org-divider
          [direction]="direction"
          [lineStyle]="lineStyle"
          [weight]="weight"
          [padding]="padding"
          [color]="color"
        />
      </div>
    `,
    moduleMetadata: {
      imports: [Divider],
    },
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to drive every visual input on the divider (direction, style, weight, padding, color) and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: `<story-divider-live-demo />`,
    moduleMetadata: {
      imports: [DividerLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every divider variant axis — direction, style, weight, padding, and color — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Direction Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="size-lg">
              <org-divider direction="horizontal" />
            </div>
            <div class="flex" style="height: 4rem;">
              <span>Left</span>
              <org-divider direction="vertical" />
              <span>Right</span>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Horizontal</strong>: Spans the full width of its container with a top border line</li>
            <li><strong>Vertical</strong>: Spans the full height of its flex container with a left border line</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Line Style Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="size-lg">
              <org-divider lineStyle="solid" />
            </div>
            <div class="size-lg">
              <org-divider lineStyle="dashed" />
            </div>
            <div class="size-lg">
              <org-divider lineStyle="dotted" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Solid</strong>: Continuous unbroken line (default)</li>
            <li><strong>Dashed</strong>: Line composed of evenly spaced dashes</li>
            <li><strong>Dotted</strong>: Line composed of evenly spaced dots</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Weight Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="size-lg">
              <org-divider weight="thin" />
            </div>
            <div class="size-lg">
              <org-divider weight="thick" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Thin</strong>: 1px hairline (default)</li>
            <li><strong>Thick</strong>: 2px line for stronger separation</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Padding Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="size-lg">
              <span>Above</span>
              <org-divider padding="none" />
              <span>Below</span>
            </div>
            <div class="size-lg">
              <span>Above</span>
              <org-divider padding="sm" />
              <span>Below</span>
            </div>
            <div class="size-lg">
              <span>Above</span>
              <org-divider padding="base" />
              <span>Below</span>
            </div>
            <div class="size-lg">
              <span>Above</span>
              <org-divider padding="lg" />
              <span>Below</span>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>None</strong>: Line sits flush against surrounding content</li>
            <li><strong>Sm</strong>: Default cross-axis breathing room</li>
            <li><strong>Base</strong>: Medium breathing room around the line</li>
            <li><strong>Lg</strong>: Large breathing room around the line</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Color Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="size-lg">
              <org-divider />
            </div>
            <div class="size-lg">
              <org-divider color="primary" />
            </div>
            <div class="size-lg">
              <org-divider color="secondary" />
            </div>
            <div class="size-lg">
              <org-divider color="neutral" />
            </div>
            <div class="size-lg">
              <org-divider color="safe" />
            </div>
            <div class="size-lg">
              <org-divider color="info" />
            </div>
            <div class="size-lg">
              <org-divider color="caution" />
            </div>
            <div class="size-lg">
              <org-divider color="warning" />
            </div>
            <div class="size-lg">
              <org-divider color="danger" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Default (border)</strong>: Resolves to the standard border color when no color is set</li>
            <li><strong>Primary</strong>: Primary color</li>
            <li><strong>Secondary</strong>: Secondary accent color</li>
            <li><strong>Neutral</strong>: Neutral gray for low-emphasis separation</li>
            <li><strong>Safe</strong>: Green for success/positive sections</li>
            <li><strong>Info</strong>: Blue for informational sections</li>
            <li><strong>Caution</strong>: Yellow for caution/warning sections</li>
            <li><strong>Warning</strong>: Orange for important warnings</li>
            <li><strong>Danger</strong>: Red for destructive/dangerous sections</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [Divider, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas, DesignSystemDemoExpectedBehaviour],
    },
  }),
};
