import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { allColorStrengths } from '../types/component-types';
import {
  Box,
  BoxBackground,
  BoxBorder,
  BoxColor,
  BoxColorStrength,
  BoxPadding,
  BoxShape,
  allBoxBackgrounds,
  allBoxBorders,
  allBoxColors,
  allBoxPaddings,
  allBoxShapes,
} from './box';

type LiveDemoColorChoice = 'none' | BoxColor;

const allLiveDemoColorChoices = ['none', ...allBoxColors] as const;

const liveDemoColorItems: ButtonToggleItem[] = allLiveDemoColorChoices.map((color) => ({
  label: color,
  value: color,
  buttonColor: 'primary',
}));

const liveDemoColorStrengthItems: ButtonToggleItem[] = allColorStrengths.map((colorStrength) => ({
  label: colorStrength,
  value: colorStrength,
  buttonColor: 'primary',
}));

const liveDemoBorderItems: ButtonToggleItem[] = allBoxBorders.map((border) => ({
  label: border,
  value: border,
  buttonColor: 'primary',
}));

const liveDemoPaddingItems: ButtonToggleItem[] = allBoxPaddings.map((padding) => ({
  label: padding,
  value: padding,
  buttonColor: 'primary',
}));

const liveDemoBackgroundItems: ButtonToggleItem[] = allBoxBackgrounds.map((background) => ({
  label: background,
  value: background,
  buttonColor: 'primary',
}));

const liveDemoShapeItems: ButtonToggleItem[] = allBoxShapes.map((shape) => ({
  label: shape,
  value: shape,
  buttonColor: 'primary',
}));

@Component({
  selector: 'story-box-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Box,
    ButtonToggle,
    CheckboxToggle,
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
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Toggle the inputs to see every visual combination. Flip the 'clickable' toggle to set [isClickable]=true — the box gains cursor, hover, pressed, and focus-visible affordances along with role=button + keyboard activation, and emits (clicked)."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Color">
            <org-button-toggle [items]="colorItems" formControlName="color" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Color strength">
            <org-button-toggle [items]="colorStrengthItems" formControlName="colorStrength" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Border">
            <org-button-toggle [items]="borderItems" formControlName="border" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Padding">
            <org-button-toggle [items]="paddingItems" formControlName="padding" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Background">
            <org-button-toggle [items]="backgroundItems" formControlName="background" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Shape">
            <org-button-toggle [items]="shapeItems" formControlName="shape" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Clickable">
            <org-checkbox-toggle name="live-demo-clickable" value="clickable" formControlName="clickable">
              {{ liveDemoForm.controls.clickable.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-box
              [color]="liveDemoForm.controls.color.value === 'none' ? null : liveDemoForm.controls.color.value"
              [colorStrength]="liveDemoForm.controls.colorStrength.value"
              [border]="liveDemoForm.controls.border.value"
              [padding]="liveDemoForm.controls.padding.value"
              [background]="liveDemoForm.controls.background.value"
              [shape]="liveDemoForm.controls.shape.value"
              [isClickable]="liveDemoForm.controls.clickable.value"
              (clicked)="onBoxClicked()"
            >
              @if (liveDemoForm.controls.clickable.value) {
                <div class="flex flex-col gap-1">
                  <strong>Clickable box</strong>
                  <span>Click count: {{ clickCount() }}</span>
                </div>
              } @else {
                <div class="flex flex-col gap-1">
                  <strong>Box content</strong>
                  <span
                    >This is a foundational container. Drop any composition inside — text, controls, key/value rows, or
                    another component.</span
                  >
                </div>
              }
            </org-box>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class BoxLiveDemoStory {
  protected readonly colorItems = liveDemoColorItems;
  protected readonly colorStrengthItems = liveDemoColorStrengthItems;
  protected readonly borderItems = liveDemoBorderItems;
  protected readonly paddingItems = liveDemoPaddingItems;
  protected readonly backgroundItems = liveDemoBackgroundItems;
  protected readonly shapeItems = liveDemoShapeItems;

  protected readonly clickCount = signal<number>(0);

  protected readonly liveDemoForm = new FormGroup({
    color: new FormControl<LiveDemoColorChoice>('info', { nonNullable: true }),
    colorStrength: new FormControl<BoxColorStrength>('soft', { nonNullable: true }),
    border: new FormControl<BoxBorder>('bordered', { nonNullable: true }),
    padding: new FormControl<BoxPadding>('base', { nonNullable: true }),
    background: new FormControl<BoxBackground>('colored', { nonNullable: true }),
    shape: new FormControl<BoxShape>('rounded', { nonNullable: true }),
    clickable: new FormControl<boolean>(false, { nonNullable: true }),
  });

  protected onBoxClicked(): void {
    this.clickCount.update((count) => count + 1);
  }
}

@Component({
  selector: 'story-box-clickable-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas, DesignSystemDemoExpectedBehaviour],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Clickable"
        description="Setting [isClickable]=true flips the box into an interactive surface. Compare the static and clickable boxes — only the clickable ones gain cursor, hover/pressed tint, focus-visible ring, role=button, tabindex=0, and Enter/Space activation."
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-3 max-w-md">
          <org-box>
            <div class="flex flex-col gap-1">
              <strong>Static box</strong>
              <span>No click handler — purely presentational. Hovering and focusing change nothing.</span>
            </div>
          </org-box>
          <org-box color="info" [isClickable]="true" (clicked)="onClicked('info')">
            <div class="flex flex-col gap-1">
              <strong>Clickable · info</strong>
              <span>Try clicking, hovering, or tab-then-Enter / Space.</span>
            </div>
          </org-box>
          <org-box color="safe" border="border-emphasize" [isClickable]="true" (clicked)="onClicked('safe')">
            <div class="flex flex-col gap-1">
              <strong>Clickable · safe · border-emphasize</strong>
              <span>The clickable affordance respects every other visual variant.</span>
            </div>
          </org-box>
          <org-box color="danger" background="colorless" [isClickable]="true" (clicked)="onClicked('danger')">
            <div class="flex flex-col gap-1">
              <strong>Clickable · danger · colorless</strong>
              <span>Hover/pressed tints fall back to the neutral background slot in colorless mode.</span>
            </div>
          </org-box>
          <div class="text-xs text-fg-muted">
            Last activation: <strong>{{ lastActivated() ?? '—' }}</strong> · Total clicks:
            <strong>{{ totalClicks() }}</strong>
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
    <org-design-system-demo-expected-behaviour>
      <ul class="list-inside list-disc flex flex-col gap-1">
        <li>
          <strong>Explicit opt-in</strong>: setting [isClickable]=true flips the box into clickable mode and emits
          (clicked)
        </li>
        <li><strong>Cursor</strong>: pointer cursor over clickable boxes only</li>
        <li>
          <strong>Hover / Pressed</strong>: background shifts to the color variant's *-soft-hover / *-soft-active token
          (or neutral hover/active for colorless / no-color)
        </li>
        <li><strong>Focus-visible</strong>: visible focus ring via box-shadow on keyboard focus</li>
        <li><strong>Keyboard</strong>: Enter and Space activate, Space's default page scroll is suppressed</li>
        <li><strong>Aria</strong>: role="button" and tabindex="0" applied automatically</li>
      </ul>
    </org-design-system-demo-expected-behaviour>
  `,
})
class BoxClickableShowcaseStory {
  protected readonly totalClicks = signal<number>(0);

  protected readonly lastActivated = signal<string | null>(null);

  protected onClicked(label: string): void {
    this.totalClicks.update((count) => count + 1);
    this.lastActivated.set(label);
  }
}

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
  - Explicit clickable mode: set \`[isClickable]="true"\` to flip the box into an interactive surface that emits \`clicked\`
    (cursor, hover/pressed tint, focus-visible ring, role=button, tabindex=0, Enter/Space activation)

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

  ### Shape Options
  - **rounded**: Rounded corners using the base radius (default)
  - **square**: Drops the corner radius to 0 for a square container

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

  <!-- clickable box — set [isClickable]="true" to turn on the interactive affordance -->
  <org-box color="info" [isClickable]="true" (clicked)="onSelect()">
    Click anywhere on this surface.
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
    colorStrength: 'soft',
    border: 'bordered',
    padding: 'base',
    background: 'colored',
    shape: 'rounded',
  },
  argTypes: {
    color: {
      control: 'select',
      options: [null, ...allBoxColors],
      description: 'the color variant applied to the border and background',
    },
    colorStrength: {
      control: 'select',
      options: allColorStrengths,
      description:
        "the color intensity of the box; 'strong' renders a solid fill while 'soft' renders the soft tint (only applies when background is 'colored')",
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
    shape: {
      control: 'select',
      options: allBoxShapes,
      description: "the corner shape of the box; 'square' drops the rounded radius to 0",
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
        <org-box
          [color]="color"
          [colorStrength]="colorStrength"
          [border]="border"
          [padding]="padding"
          [background]="background"
          [shape]="shape"
        >
          Box content.
        </org-box>
      </div>
    `,
    moduleMetadata: {
      imports: [Box],
    },
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to drive every visual input on the box (color, border, padding, background) and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: `<story-box-live-demo />`,
    moduleMetadata: {
      imports: [BoxLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every box variant axis — color, border, background, padding — plus a color × border matrix and realistic content fillings to show how the primitive carries different compositions.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Color Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <org-box>Default box.</org-box>
            <org-box color="primary">Primary box.</org-box>
            <org-box color="secondary">Secondary box.</org-box>
            <org-box color="neutral">Neutral box.</org-box>
            <org-box color="safe">Safe box.</org-box>
            <org-box color="info">Info box.</org-box>
            <org-box color="caution">Caution box.</org-box>
            <org-box color="warning">Warning box.</org-box>
            <org-box color="danger">Danger box.</org-box>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
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
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Color strength" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-2 max-w-sm">
              <org-box color="primary" colorStrength="soft">Primary soft.</org-box>
              <org-box color="secondary" colorStrength="soft">Secondary soft.</org-box>
              <org-box color="neutral" colorStrength="soft">Neutral soft.</org-box>
              <org-box color="safe" colorStrength="soft">Safe soft.</org-box>
              <org-box color="info" colorStrength="soft">Info soft.</org-box>
              <org-box color="caution" colorStrength="soft">Caution soft.</org-box>
              <org-box color="warning" colorStrength="soft">Warning soft.</org-box>
              <org-box color="danger" colorStrength="soft">Danger soft.</org-box>
            </div>
            <div class="flex flex-col gap-2 max-w-sm">
              <org-box color="primary" colorStrength="strong">Primary strong.</org-box>
              <org-box color="secondary" colorStrength="strong">Secondary strong.</org-box>
              <org-box color="neutral" colorStrength="strong">Neutral strong.</org-box>
              <org-box color="safe" colorStrength="strong">Safe strong.</org-box>
              <org-box color="info" colorStrength="strong">Info strong.</org-box>
              <org-box color="caution" colorStrength="strong">Caution strong.</org-box>
              <org-box color="warning" colorStrength="strong">Warning strong.</org-box>
              <org-box color="danger" colorStrength="strong">Danger strong.</org-box>
            </div>
            <div class="flex flex-col gap-2 max-w-sm">
              <org-box color="primary" colorStrength="strong" background="colorless">
                Primary strong colorless.
              </org-box>
              <org-box color="safe" colorStrength="strong" background="colorless">Safe strong colorless.</org-box>
              <org-box color="danger" colorStrength="strong" background="colorless">Danger strong colorless.</org-box>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Soft</strong> (default): the soft tinted background with standard foreground text</li>
            <li><strong>Strong</strong>: a solid saturated fill with the matching on-color foreground and border</li>
            <li>
              <strong>Strong + Colorless</strong>: colorless wins — the background and foreground revert to the neutral
              default, so strength only affects the <code>colored</code> background
            </li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Borders" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-2 max-w-sm">
              <org-box>Default bordered.</org-box>
              <org-box color="primary">Primary bordered.</org-box>
              <org-box color="safe">Safe bordered.</org-box>
              <org-box color="danger">Danger bordered.</org-box>
            </div>
            <div class="flex flex-col gap-2 max-w-sm">
              <org-box border="borderless">Default borderless.</org-box>
              <org-box color="primary" border="borderless">Primary borderless.</org-box>
              <org-box color="safe" border="borderless">Safe borderless.</org-box>
              <org-box color="danger" border="borderless">Danger borderless.</org-box>
            </div>
            <div class="flex flex-col gap-2 max-w-sm">
              <org-box border="border-thick">Default border-thick.</org-box>
              <org-box color="primary" border="border-thick">Primary border-thick.</org-box>
              <org-box color="safe" border="border-thick">Safe border-thick.</org-box>
              <org-box color="danger" border="border-thick">Danger border-thick.</org-box>
            </div>
            <div class="flex flex-col gap-2 max-w-sm">
              <org-box border="border-emphasize">Default border-emphasize.</org-box>
              <org-box color="primary" border="border-emphasize">Primary border-emphasize.</org-box>
              <org-box color="safe" border="border-emphasize">Safe border-emphasize.</org-box>
              <org-box color="danger" border="border-emphasize">Danger border-emphasize.</org-box>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Bordered</strong>: Visible colored border with matching subtle background</li>
            <li><strong>Borderless</strong>: Transparent border — only the background color is applied</li>
            <li><strong>Border Thick</strong>: Thicker (2px) visible border with matching subtle background</li>
            <li><strong>Border Emphasize</strong>: Top/right/bottom borders use the default border color; the left border is 7px and matches the color input</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Background" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-2 max-w-sm">
              <org-box color="primary" border="bordered">Primary bordered colored.</org-box>
              <org-box color="safe" border="bordered">Safe bordered colored.</org-box>
              <org-box color="warning" border="bordered">Warning bordered colored.</org-box>
              <org-box color="danger" border="bordered">Danger bordered colored.</org-box>
            </div>
            <div class="flex flex-col gap-2 max-w-sm">
              <org-box color="primary" border="bordered" background="colorless">Primary bordered colorless.</org-box>
              <org-box color="safe" border="bordered" background="colorless">Safe bordered colorless.</org-box>
              <org-box color="warning" border="bordered" background="colorless">Warning bordered colorless.</org-box>
              <org-box color="danger" border="bordered" background="colorless">Danger bordered colorless.</org-box>
            </div>
            <div class="flex flex-col gap-2 max-w-sm">
              <org-box color="primary" border="border-emphasize">Primary border-emphasize colored.</org-box>
              <org-box color="safe" border="border-emphasize">Safe border-emphasize colored.</org-box>
              <org-box color="warning" border="border-emphasize">Warning border-emphasize colored.</org-box>
              <org-box color="danger" border="border-emphasize">Danger border-emphasize colored.</org-box>
            </div>
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
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Colored</strong>: The color input tints both the border and the background (default)</li>
            <li><strong>Colorless</strong>: The color input only affects the border; the background stays at the default</li>
            <li><strong>Bordered + Colorless</strong>: Useful when you want a subtle neutral container with a semantic border accent</li>
            <li><strong>Border Emphasize + Colorless</strong>: Useful for call-out style containers where only the left accent bar is colored</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Padding" />
          <org-design-system-demo-canvas slot="canvas">
            <org-box padding="none">Box with no padding.</org-box>
            <org-box padding="sm">Box with small padding.</org-box>
            <org-box padding="base">Box with base padding.</org-box>
            <org-box padding="lg">Box with large padding.</org-box>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>None</strong>: No internal padding applied</li>
            <li><strong>Small</strong>: Small padding</li>
            <li><strong>Base</strong>: Base padding — the default value</li>
            <li><strong>Large</strong>: Large padding for spacious content areas</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Shape" />
          <org-design-system-demo-canvas slot="canvas">
            <org-box color="info" shape="rounded">Rounded box (default).</org-box>
            <org-box color="info" shape="square">Square box.</org-box>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Rounded</strong>: rounded corners using the base radius (default)</li>
            <li><strong>Square</strong>: drops the corner radius to 0 for a flush, square container</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Color × border matrix" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-2">
              <div class="flex gap-2">
                <org-box color="primary" border="bordered">Bordered</org-box>
                <org-box color="primary" border="border-thick">Thick</org-box>
                <org-box color="primary" border="border-emphasize">Emphasize</org-box>
                <org-box color="primary" border="borderless">Borderless</org-box>
              </div>
              <div class="flex gap-2">
                <org-box color="secondary" border="bordered">Bordered</org-box>
                <org-box color="secondary" border="border-thick">Thick</org-box>
                <org-box color="secondary" border="border-emphasize">Emphasize</org-box>
                <org-box color="secondary" border="borderless">Borderless</org-box>
              </div>
              <div class="flex gap-2">
                <org-box color="neutral" border="bordered">Bordered</org-box>
                <org-box color="neutral" border="border-thick">Thick</org-box>
                <org-box color="neutral" border="border-emphasize">Emphasize</org-box>
                <org-box color="neutral" border="borderless">Borderless</org-box>
              </div>
              <div class="flex gap-2">
                <org-box color="safe" border="bordered">Bordered</org-box>
                <org-box color="safe" border="border-thick">Thick</org-box>
                <org-box color="safe" border="border-emphasize">Emphasize</org-box>
                <org-box color="safe" border="borderless">Borderless</org-box>
              </div>
              <div class="flex gap-2">
                <org-box color="info" border="bordered">Bordered</org-box>
                <org-box color="info" border="border-thick">Thick</org-box>
                <org-box color="info" border="border-emphasize">Emphasize</org-box>
                <org-box color="info" border="borderless">Borderless</org-box>
              </div>
              <div class="flex gap-2">
                <org-box color="caution" border="bordered">Bordered</org-box>
                <org-box color="caution" border="border-thick">Thick</org-box>
                <org-box color="caution" border="border-emphasize">Emphasize</org-box>
                <org-box color="caution" border="borderless">Borderless</org-box>
              </div>
              <div class="flex gap-2">
                <org-box color="warning" border="bordered">Bordered</org-box>
                <org-box color="warning" border="border-thick">Thick</org-box>
                <org-box color="warning" border="border-emphasize">Emphasize</org-box>
                <org-box color="warning" border="borderless">Borderless</org-box>
              </div>
              <div class="flex gap-2">
                <org-box color="danger" border="bordered">Bordered</org-box>
                <org-box color="danger" border="border-thick">Thick</org-box>
                <org-box color="danger" border="border-emphasize">Emphasize</org-box>
                <org-box color="danger" border="borderless">Borderless</org-box>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Eight semantic colors × four border treatments</strong>: every combination is valid</li>
            <li><strong>Bordered / Thick</strong>: hairline and 2px frames carry the color on all four sides</li>
            <li><strong>Emphasize</strong>: the left edge widens to a 7px accent rail in the semantic color</li>
            <li><strong>Borderless</strong>: only the soft tinted background carries the color signal</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Realistic fillings" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-2">
              <org-box color="caution" border="border-emphasize">
                <div class="flex flex-col gap-1">
                  <strong>Heads up</strong>
                  <span>Your trial expires in 4 days. Add a payment method to keep your project running.</span>
                </div>
              </org-box>
              <org-box>
                <div class="flex flex-col gap-1">
                  <div class="flex justify-between gap-4">
                    <span>Plan</span>
                    <span>Team · Annual</span>
                  </div>
                  <div class="flex justify-between gap-4">
                    <span>Seats</span>
                    <span>12 / 15</span>
                  </div>
                  <div class="flex justify-between gap-4">
                    <span>Renews</span>
                    <span>Mar 4, 2026</span>
                  </div>
                </div>
              </org-box>
            </div>
            <div class="flex gap-2">
              <org-box color="safe" border="border-emphasize">
                <div class="flex flex-col gap-1">
                  <strong>Deploy succeeded</strong>
                  <span>web · main · 2.4 MB · 1m 12s</span>
                  <span>commit 9f3a01c · by ada</span>
                </div>
              </org-box>
              <org-box color="danger" border="border-emphasize" background="colorless">
                <div class="flex flex-col gap-1">
                  <strong>Build failed</strong>
                  <span>3 type errors in src/checkout/payment.ts. The previous successful build was 14 minutes ago.</span>
                </div>
              </org-box>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Box accepts any content</strong>: short prose, key/value rows, stacked metadata, or multi-element blocks</li>
            <li><strong>Semantic color carries meaning</strong>: pair caution / safe / danger with text content, never color alone</li>
            <li><strong>Composition is the consumer's job</strong>: Box only frames the content; inner layout is up to you</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-box-clickable-showcase />
      </div>
    `,
    moduleMetadata: {
      imports: [
        Box,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
        BoxClickableShowcaseStory,
      ],
    },
  }),
};
