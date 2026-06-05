import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { Avatar } from '../avatar/avatar';
import { Button } from '../button/button';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Icon } from '../icon/icon';
import { allColorStrengths, allComponentColors } from '../types/component-types';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import {
  Indicator,
  IndicatorColor,
  IndicatorColorStrength,
  IndicatorMode,
  IndicatorPosition,
  IndicatorShape,
  IndicatorSize,
  allIndicatorModes,
  allIndicatorPositions,
  allIndicatorShapes,
  allIndicatorSizes,
} from './indicator';
import { IndicatorAnchor } from './indicator-anchor';

const liveDemoModeItems: ButtonToggleItem[] = allIndicatorModes.map((mode) => ({
  label: mode,
  value: mode,
  buttonColor: 'primary',
}));

const liveDemoColorItems: ButtonToggleItem[] = allComponentColors.map((color) => ({
  label: color,
  value: color,
  buttonColor: 'primary',
}));

const liveDemoSizeItems: ButtonToggleItem[] = allIndicatorSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

const liveDemoShapeItems: ButtonToggleItem[] = allIndicatorShapes.map((shape) => ({
  label: shape,
  value: shape,
  buttonColor: 'primary',
}));

const liveDemoColorStrengthItems: ButtonToggleItem[] = allColorStrengths.map((colorStrength) => ({
  label: colorStrength,
  value: colorStrength,
  buttonColor: 'primary',
}));

const meta: Meta<Indicator> = {
  title: 'Core/Components/Indicator',
  component: Indicator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Indicator Component

  A small status badge that renders as a bare colored circle, a numeric pill, or a glyph pill. Three sizes, eight semantic colors, an optional outline ring for sitting over imagery, an optional pulse animation for live status, and optional pin-to-corner positioning that places it at one of four corners of an anchor.

  ### Modes
  - **dot** (default for empty indicators): a bare colored circle
  - **number**: a numeric pill — values >= 100 render as "99+"
  - **icon**: a glyph pill wrapping a single projected \`<org-icon>\`

  ### Sizes
  - **sm**: 6px dot / 14px pill — fits inline with small text
  - **base** (default): 8px dot / 16px pill
  - **lg**: 10px dot / 20px pill

  ### Colors
  Eight semantic ramps — \`primary\` (default), \`secondary\`, \`neutral\`, \`safe\`, \`info\`, \`caution\`, \`warning\`, \`danger\`.

  ### Pinning to an anchor
  Wrap the anchor in \`<org-indicator-anchor>\` (or any \`position: relative\` container) and set \`[position]\` on the indicator. Add \`[ring]="true"\` when the anchor's background could compete with the indicator (common for avatars).

  ### Pulse
  Set \`[pulse]="true"\` to convey live, refreshing state. Suppressed under \`prefers-reduced-motion: reduce\`.

  ### Usage Examples
  \`\`\`html
  <!-- Standalone dot -->
  <org-indicator color="danger" ariaLabel="3 unread" />

  <!-- Number pill -->
  <org-indicator color="primary" [number]="12" />
  <org-indicator color="primary" [number]="150" /> <!-- renders 99+ -->

  <!-- Icon pill -->
  <org-indicator color="safe">
    <org-icon name="check" size="2xs" />
  </org-indicator>

  <!-- Pinned to an avatar corner -->
  <org-indicator-anchor>
    <org-avatar label="Sam Carter" />
    <org-indicator color="safe" position="bottom-right" [ring]="true" ariaLabel="online" />
  </org-indicator-anchor>
</div>
        `,
      },
    },
  },
};

export default meta;

// the number / ariaLabel inputs come from the host-directive forwarding on `Indicator`, which storybook's
// signal-input type extraction does not see, so they are augmented onto the args type here.
type Story = StoryObj<Indicator & { number: number | null; ariaLabel: string | null }>;

export const Default: Story = {
  args: {
    color: 'primary',
    colorStrength: 'strong',
    size: 'base',
    shape: 'circle',
    number: null,
    pulse: false,
    ring: false,
    hasFade: false,
    position: undefined,
    ariaLabel: null,
  },
  argTypes: {
    color: {
      control: 'select',
      options: allComponentColors,
      description: 'The semantic color of the indicator',
    },
    colorStrength: {
      control: 'select',
      options: allColorStrengths,
      description: "The color intensity of the indicator; 'soft' swaps the solid fill for its soft equivalent",
    },
    size: {
      control: 'select',
      options: allIndicatorSizes,
      description: 'The size of the indicator',
    },
    shape: {
      control: 'select',
      options: allIndicatorShapes,
      description: "The outer shape of the indicator; 'rounded' swaps the pill radius for a rounded-box radius",
    },
    number: {
      control: 'number',
      description: 'Optional number to display (renders as "99+" for values >= 100)',
    },
    pulse: {
      control: 'boolean',
      description: 'When true, plays a live pulse animation behind the indicator',
    },
    ring: {
      control: 'boolean',
      description: 'When true, paints a 2px outline ring around the indicator',
    },
    hasFade: {
      control: 'boolean',
      description:
        'When true, paints a 4px halo around the indicator using the matching soft color to give the illusion of a fade',
    },
    position: {
      control: 'select',
      options: [undefined, ...allIndicatorPositions],
      description: 'When set, pins the indicator to the named corner of its positioned ancestor',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for the indicator (recommended for dot mode)',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default indicator with primary color. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-indicator
        [color]="color"
        [colorStrength]="colorStrength"
        [size]="size"
        [shape]="shape"
        [number]="number"
        [pulse]="pulse"
        [ring]="ring"
        [hasFade]="hasFade"
        [position]="position"
        [ariaLabel]="ariaLabel"
      />
    `,
    moduleMetadata: {
      imports: [Indicator],
    },
  }),
};

@Component({
  selector: 'story-indicator-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Indicator,
    IndicatorAnchor,
    Icon,
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
      .anchor-placeholder {
        width: 2.5rem; /* 40px */
        height: 2.5rem; /* 40px */
        border-radius: var(--radius-pill);
        background: var(--color-secondary);
      }
      .number-input {
        width: 4rem; /* 64px */
        padding: var(--spacing-1) var(--spacing-2);
        border: var(--border-width) solid var(--color-border);
        border-radius: var(--radius-sm);
        background: var(--color-bg-surface);
        color: var(--color-fg);
        font-family: inherit;
        font-size: var(--font-size-sm);
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Toggle the inputs to walk every combination — mode, color, size, and the optional pulse and outline-ring flags. The 'Pin to anchor' toggle wraps the indicator in an anchor so you can see how positioning behaves."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Mode">
            <org-button-toggle [items]="modeItems" formControlName="mode" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Color">
            <org-button-toggle [items]="colorItems" formControlName="color" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Color strength">
            <org-button-toggle [items]="colorStrengthItems" formControlName="colorStrength" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Size">
            <org-button-toggle [items]="sizeItems" formControlName="size" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Shape">
            <org-button-toggle [items]="shapeItems" formControlName="shape" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Number">
            <input class="number-input" type="number" formControlName="number" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Pulse">
            <org-checkbox-toggle name="live-demo-pulse" value="pulse" formControlName="pulse">
              {{ liveDemoForm.controls.pulse.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Outline ring">
            <org-checkbox-toggle name="live-demo-ring" value="ring" formControlName="ring">
              {{ liveDemoForm.controls.ring.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Fade">
            <org-checkbox-toggle name="live-demo-has-fade" value="hasFade" formControlName="hasFade">
              {{ liveDemoForm.controls.hasFade.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Pin to anchor">
            <org-checkbox-toggle name="live-demo-pinned" value="pinned" formControlName="pinned">
              {{ liveDemoForm.controls.pinned.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            @if (liveDemoForm.controls.pinned.value) {
              <org-indicator-anchor>
                <span class="anchor-placeholder"></span>
                @switch (liveDemoForm.controls.mode.value) {
                  @case ('number') {
                    <org-indicator
                      [color]="liveDemoForm.controls.color.value"
                      [colorStrength]="liveDemoForm.controls.colorStrength.value"
                      [size]="liveDemoForm.controls.size.value"
                      [shape]="liveDemoForm.controls.shape.value"
                      [number]="liveDemoForm.controls.number.value"
                      [pulse]="liveDemoForm.controls.pulse.value"
                      [ring]="liveDemoForm.controls.ring.value"
                      [hasFade]="liveDemoForm.controls.hasFade.value"
                      position="bottom-right"
                    />
                  }
                  @case ('icon') {
                    <org-indicator
                      [color]="liveDemoForm.controls.color.value"
                      [colorStrength]="liveDemoForm.controls.colorStrength.value"
                      [size]="liveDemoForm.controls.size.value"
                      [shape]="liveDemoForm.controls.shape.value"
                      [pulse]="liveDemoForm.controls.pulse.value"
                      [ring]="liveDemoForm.controls.ring.value"
                      [hasFade]="liveDemoForm.controls.hasFade.value"
                      position="bottom-right"
                    >
                      <org-icon name="check" size="2xs" />
                    </org-indicator>
                  }
                  @default {
                    <org-indicator
                      [color]="liveDemoForm.controls.color.value"
                      [colorStrength]="liveDemoForm.controls.colorStrength.value"
                      [size]="liveDemoForm.controls.size.value"
                      [shape]="liveDemoForm.controls.shape.value"
                      [pulse]="liveDemoForm.controls.pulse.value"
                      [ring]="liveDemoForm.controls.ring.value"
                      [hasFade]="liveDemoForm.controls.hasFade.value"
                      position="bottom-right"
                      ariaLabel="status"
                    />
                  }
                }
              </org-indicator-anchor>
            } @else {
              @switch (liveDemoForm.controls.mode.value) {
                @case ('number') {
                  <org-indicator
                    [color]="liveDemoForm.controls.color.value"
                    [colorStrength]="liveDemoForm.controls.colorStrength.value"
                    [size]="liveDemoForm.controls.size.value"
                    [shape]="liveDemoForm.controls.shape.value"
                    [number]="liveDemoForm.controls.number.value"
                    [pulse]="liveDemoForm.controls.pulse.value"
                    [ring]="liveDemoForm.controls.ring.value"
                    [hasFade]="liveDemoForm.controls.hasFade.value"
                  />
                }
                @case ('icon') {
                  <org-indicator
                    [color]="liveDemoForm.controls.color.value"
                    [colorStrength]="liveDemoForm.controls.colorStrength.value"
                    [size]="liveDemoForm.controls.size.value"
                    [shape]="liveDemoForm.controls.shape.value"
                    [pulse]="liveDemoForm.controls.pulse.value"
                    [ring]="liveDemoForm.controls.ring.value"
                    [hasFade]="liveDemoForm.controls.hasFade.value"
                  >
                    <org-icon name="check" size="2xs" />
                  </org-indicator>
                }
                @default {
                  <org-indicator
                    [color]="liveDemoForm.controls.color.value"
                    [colorStrength]="liveDemoForm.controls.colorStrength.value"
                    [size]="liveDemoForm.controls.size.value"
                    [shape]="liveDemoForm.controls.shape.value"
                    [pulse]="liveDemoForm.controls.pulse.value"
                    [ring]="liveDemoForm.controls.ring.value"
                    [hasFade]="liveDemoForm.controls.hasFade.value"
                    ariaLabel="status"
                  />
                }
              }
            }
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class IndicatorLiveDemoStory {
  protected readonly modeItems = liveDemoModeItems;
  protected readonly colorItems = liveDemoColorItems;
  protected readonly colorStrengthItems = liveDemoColorStrengthItems;
  protected readonly sizeItems = liveDemoSizeItems;
  protected readonly shapeItems = liveDemoShapeItems;

  protected readonly liveDemoForm = new FormGroup({
    mode: new FormControl<IndicatorMode>('dot', { nonNullable: true }),
    color: new FormControl<IndicatorColor>('primary', { nonNullable: true }),
    colorStrength: new FormControl<IndicatorColorStrength>('strong', { nonNullable: true }),
    size: new FormControl<IndicatorSize>('base', { nonNullable: true }),
    shape: new FormControl<IndicatorShape>('circle', { nonNullable: true }),
    number: new FormControl<number>(12, { nonNullable: true }),
    pulse: new FormControl<boolean>(false, { nonNullable: true }),
    ring: new FormControl<boolean>(false, { nonNullable: true }),
    hasFade: new FormControl<boolean>(false, { nonNullable: true }),
    pinned: new FormControl<boolean>(false, { nonNullable: true }),
  });
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to drive every input on the indicator (mode, color, size, number, pulse, outline ring, pin-to-anchor) and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: `<story-indicator-live-demo />`,
    moduleMetadata: {
      imports: [IndicatorLiveDemoStory],
    },
  }),
};

const showcaseColors: IndicatorColor[] = [...allComponentColors];
const showcaseColorStrengths: IndicatorColorStrength[] = [...allColorStrengths];
const showcaseSizes: IndicatorSize[] = [...allIndicatorSizes];
const showcaseShapes: IndicatorShape[] = [...allIndicatorShapes];
const showcasePositions: IndicatorPosition[] = [...allIndicatorPositions];

@Component({
  selector: 'story-indicator-color-size-dot-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Indicator],
  styles: [
    `
      :host {
        display: block;
      }
      .grid {
        display: grid;
        grid-template-columns: 6rem repeat(3, 1fr);
        align-items: center;
        row-gap: var(--spacing-2);
        column-gap: var(--spacing-4);
      }
      .col-header {
        text-transform: uppercase;
        font-size: var(--font-size-2xs);
        letter-spacing: 0.06em;
        color: var(--color-fg-muted);
      }
      .row-label {
        text-transform: capitalize;
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        color: var(--color-fg-muted);
      }
      .cell {
        display: flex;
        align-items: center;
      }
    `,
  ],
  template: `
    <div class="grid">
      <span></span>
      @for (size of sizes; track size) {
        <span class="col-header">{{ size }}</span>
      }

      @for (color of colors; track color) {
        <span class="row-label">{{ color }}</span>
        @for (size of sizes; track size) {
          <span class="cell">
            <org-indicator [color]="color" [size]="size" />
          </span>
        }
      }
    </div>
  `,
})
class IndicatorColorSizeDotGridSection {
  protected readonly colors = showcaseColors;
  protected readonly sizes = showcaseSizes;
}

@Component({
  selector: 'story-indicator-color-size-number-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Indicator],
  styles: [
    `
      :host {
        display: block;
      }
      .grid {
        display: grid;
        grid-template-columns: 6rem repeat(3, 1fr);
        align-items: center;
        row-gap: var(--spacing-2);
        column-gap: var(--spacing-4);
      }
      .col-header {
        text-transform: uppercase;
        font-size: var(--font-size-2xs);
        letter-spacing: 0.06em;
        color: var(--color-fg-muted);
      }
      .row-label {
        text-transform: capitalize;
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        color: var(--color-fg-muted);
      }
      .cell {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
      }
    `,
  ],
  template: `
    <div class="grid">
      <span></span>
      @for (size of sizes; track size) {
        <span class="col-header">{{ size }}</span>
      }

      @for (color of colors; track color) {
        <span class="row-label">{{ color }}</span>
        @for (size of sizes; track size) {
          <span class="cell">
            <org-indicator [color]="color" [size]="size" [number]="3" />
            <org-indicator [color]="color" [size]="size" [number]="12" />
            <org-indicator [color]="color" [size]="size" [number]="150" />
          </span>
        }
      }
    </div>
  `,
})
class IndicatorColorSizeNumberGridSection {
  protected readonly colors = showcaseColors;
  protected readonly sizes = showcaseSizes;
}

@Component({
  selector: 'story-indicator-color-strength-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Indicator],
  styles: [
    `
      :host {
        display: block;
      }
      .grid {
        display: grid;
        grid-template-columns: 6rem repeat(2, 1fr);
        align-items: center;
        row-gap: var(--spacing-2);
        column-gap: var(--spacing-4);
      }
      .col-header {
        text-transform: uppercase;
        font-size: var(--font-size-2xs);
        letter-spacing: 0.06em;
        color: var(--color-fg-muted);
      }
      .row-label {
        text-transform: capitalize;
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        color: var(--color-fg-muted);
      }
      .cell {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
      }
    `,
  ],
  template: `
    <div class="grid">
      <span></span>
      @for (strength of strengths; track strength) {
        <span class="col-header">{{ strength }}</span>
      }

      @for (color of colors; track color) {
        <span class="row-label">{{ color }}</span>
        @for (strength of strengths; track strength) {
          <span class="cell">
            <org-indicator [color]="color" [colorStrength]="strength" ariaLabel="status" />
            <org-indicator [color]="color" [colorStrength]="strength" [number]="12" />
            <org-indicator [color]="color" [colorStrength]="strength">
              <org-icon name="check" size="2xs" />
            </org-indicator>
          </span>
        }
      }
    </div>
  `,
})
class IndicatorColorStrengthGridSection {
  protected readonly colors = showcaseColors;
  protected readonly strengths = showcaseColorStrengths;
}

@Component({
  selector: 'story-indicator-fade-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Indicator],
  styles: [
    `
      :host {
        display: block;
      }
      .grid {
        display: grid;
        grid-template-columns: 6rem repeat(3, 1fr);
        align-items: center;
        row-gap: var(--spacing-3);
        column-gap: var(--spacing-4);
      }
      .col-header {
        text-transform: uppercase;
        font-size: var(--font-size-2xs);
        letter-spacing: 0.06em;
        color: var(--color-fg-muted);
      }
      .row-label {
        text-transform: capitalize;
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        color: var(--color-fg-muted);
      }
      .cell {
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
      }
    `,
  ],
  template: `
    <div class="grid">
      <span></span>
      @for (size of sizes; track size) {
        <span class="col-header">{{ size }}</span>
      }

      @for (color of colors; track color) {
        <span class="row-label">{{ color }}</span>
        @for (size of sizes; track size) {
          <span class="cell">
            <org-indicator [color]="color" [size]="size" [hasFade]="true" ariaLabel="status" />
            <org-indicator [color]="color" [size]="size" [number]="3" [hasFade]="true" />
            <org-indicator [color]="color" [size]="size" [hasFade]="true">
              <org-icon name="check" size="2xs" />
            </org-indicator>
          </span>
        }
      }
    </div>
  `,
})
class IndicatorFadeGridSection {
  protected readonly colors = showcaseColors;
  protected readonly sizes = showcaseSizes;
}

@Component({
  selector: 'story-indicator-shape-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Indicator],
  styles: [
    `
      :host {
        display: block;
      }
      .grid {
        display: grid;
        grid-template-columns: 6rem repeat(3, 1fr);
        align-items: center;
        row-gap: var(--spacing-3);
        column-gap: var(--spacing-4);
      }
      .col-header {
        text-transform: uppercase;
        font-size: var(--font-size-2xs);
        letter-spacing: 0.06em;
        color: var(--color-fg-muted);
      }
      .row-label {
        text-transform: capitalize;
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        color: var(--color-fg-muted);
      }
      .cell {
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
      }
    `,
  ],
  template: `
    <div class="grid">
      <span></span>
      @for (size of sizes; track size) {
        <span class="col-header">{{ size }}</span>
      }

      @for (shape of shapes; track shape) {
        <span class="row-label">{{ shape }}</span>
        @for (size of sizes; track size) {
          <span class="cell">
            <org-indicator color="primary" [size]="size" [shape]="shape" ariaLabel="status" />
            <org-indicator color="primary" [size]="size" [shape]="shape" [number]="12" />
            <org-indicator color="primary" [size]="size" [shape]="shape">
              <org-icon name="check" size="2xs" />
            </org-indicator>
          </span>
        }
      }
    </div>
  `,
})
class IndicatorShapeGridSection {
  protected readonly shapes = showcaseShapes;
  protected readonly sizes = showcaseSizes;
}

@Component({
  selector: 'story-indicator-pinned-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Button, Indicator, IndicatorAnchor],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-6);
      }
      .row {
        display: flex;
        gap: var(--spacing-8);
        flex-wrap: wrap;
      }
      .group {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
      }
      .group-label {
        text-transform: uppercase;
        font-size: var(--font-size-2xs);
        letter-spacing: 0.06em;
        color: var(--color-fg-muted);
      }
      .group-row {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
      }
      .group-caption {
        font-size: var(--font-size-xs);
        color: var(--color-fg-muted);
      }
      .positions-row {
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
      }
    `,
  ],
  template: `
    <div class="row">
      <div class="group">
        <span class="group-label">Avatars · Status pip</span>
        <div class="group-row">
          <org-indicator-anchor>
            <org-avatar label="Sam Carter" />
            <org-indicator color="safe" position="bottom-right" [ring]="true" ariaLabel="online" />
          </org-indicator-anchor>
          <org-indicator-anchor>
            <org-avatar label="Jamie Kim" />
            <org-indicator color="caution" position="bottom-right" [ring]="true" ariaLabel="away" />
          </org-indicator-anchor>
          <org-indicator-anchor>
            <org-avatar label="Robin Mendez" />
            <org-indicator color="neutral" position="bottom-right" [ring]="true" ariaLabel="offline" />
          </org-indicator-anchor>
          <org-indicator-anchor>
            <org-avatar label="Avery Tran" />
            <org-indicator color="danger" position="bottom-right" [ring]="true" ariaLabel="do not disturb" />
          </org-indicator-anchor>
        </div>
        <span class="group-caption"
          >Online · Away · Offline · Do not disturb. The ring lifts the dot off the avatar's gradient.</span
        >
      </div>

      <div class="group">
        <span class="group-label">Icon button · Unread count</span>
        <div class="group-row">
          <org-indicator-anchor>
            <org-button
              color="neutral"
              variant="ghost"
              label="Notifications"
              preIcon="notification"
              [iconOnly]="true"
              ariaLabel="Notifications"
            />
            <org-indicator color="danger" position="top-right" [number]="3" ariaLabel="3 unread" />
          </org-indicator-anchor>
          <org-indicator-anchor>
            <org-button
              color="neutral"
              variant="ghost"
              label="Inbox"
              preIcon="mail"
              [iconOnly]="true"
              ariaLabel="Inbox"
            />
            <org-indicator color="neutral" position="top-right" [number]="12" ariaLabel="12 messages" />
          </org-indicator-anchor>
          <org-indicator-anchor>
            <org-button
              color="neutral"
              variant="ghost"
              label="Notifications"
              preIcon="notification"
              [iconOnly]="true"
              ariaLabel="Notifications"
            />
            <org-indicator color="info" position="top-right" [number]="150" ariaLabel="99 or more notifications" />
          </org-indicator-anchor>
          <org-indicator-anchor>
            <org-button
              color="neutral"
              variant="ghost"
              label="Notifications"
              preIcon="notification"
              [iconOnly]="true"
              ariaLabel="Notifications"
            />
            <org-indicator color="safe" position="top-right" [pulse]="true" ariaLabel="active stream" />
          </org-indicator-anchor>
        </div>
        <span class="group-caption"
          >Numbered counts pin to top-right; the rightmost button shows a live pulsing dot for "active stream".</span
        >
      </div>
    </div>

    <div class="group">
      <span class="group-label">All four positions</span>
      <div class="positions-row">
        @for (position of positions; track position) {
          <org-indicator-anchor>
            <org-avatar [label]="positionLabel(position)" />
            <org-indicator color="safe" [position]="position" [ring]="true" [ariaLabel]="position" />
          </org-indicator-anchor>
        }
      </div>
      <span class="group-caption">Labels reflect each position: top-left, top-right, bottom-left, bottom-right.</span>
    </div>
  `,
})
class IndicatorPinnedSection {
  protected readonly positions = showcasePositions;

  protected positionLabel(position: IndicatorPosition): string {
    const map: Record<IndicatorPosition, string> = {
      'top-left': 'TL',
      'top-right': 'TR',
      'bottom-left': 'BL',
      'bottom-right': 'BR',
    };

    return map[position];
  }
}

@Component({
  selector: 'story-indicator-inline-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Indicator],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-6);
      }
      .row {
        display: flex;
        gap: var(--spacing-8);
        flex-wrap: wrap;
      }
      .group {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
        min-width: 18rem;
      }
      .group-label {
        text-transform: uppercase;
        font-size: var(--font-size-2xs);
        letter-spacing: 0.06em;
        color: var(--color-fg-muted);
      }
      .group-caption {
        font-size: var(--font-size-xs);
        color: var(--color-fg-muted);
      }

      .tabs {
        display: flex;
        gap: var(--spacing-4);
        border-bottom: var(--border-width) solid var(--color-border);
      }
      .tab {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-1_5);
        padding: var(--spacing-2) var(--spacing-1);
        font-size: var(--font-size-sm);
        color: var(--color-fg-muted);
        border-bottom: 0.125rem solid transparent;
      }
      .tab[data-active] {
        color: var(--color-fg);
        border-bottom-color: var(--color-fg);
      }

      .sidebar {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-1);
        padding: var(--spacing-2);
        background: var(--color-bg-surface);
        border-radius: var(--radius-base);
      }
      .nav-row {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
        padding: var(--spacing-2) var(--spacing-3);
        font-size: var(--font-size-sm);
        color: var(--color-fg);
        border-radius: var(--radius-sm);
      }
      .nav-row[data-active] {
        background: var(--color-bg-hover);
      }
      .nav-spacer {
        flex: 1;
      }

      .chip-row {
        display: flex;
        gap: var(--spacing-3);
        flex-wrap: wrap;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-2);
        padding: var(--spacing-1_5) var(--spacing-3);
        background: var(--color-bg-surface);
        border: var(--border-width) solid var(--color-border);
        border-radius: var(--radius-pill);
        font-size: var(--font-size-xs);
        color: var(--color-fg);
      }
      .chip-meta {
        color: var(--color-fg-muted);
      }
    `,
  ],
  template: `
    <div class="row">
      <div class="group">
        <span class="group-label">Tabs · count</span>
        <div class="tabs">
          <span class="tab" data-active>
            Inbox
            <org-indicator color="neutral" size="sm" [number]="12" />
          </span>
          <span class="tab">
            Mentions
            <org-indicator color="danger" size="sm" [number]="3" />
          </span>
          <span class="tab">Drafts</span>
          <span class="tab">Archive</span>
        </div>
        <span class="group-caption">Tab counts use size="sm" so they fit the 13px label height without crowding.</span>
      </div>

      <div class="group">
        <span class="group-label">Sidebar nav · unread</span>
        <div class="sidebar">
          <span class="nav-row" data-active>
            <org-icon name="mail" size="sm" />
            Inbox
            <span class="nav-spacer"></span>
            <org-indicator color="neutral" size="sm" [number]="12" />
          </span>
          <span class="nav-row">
            <org-icon name="notification" size="sm" />
            Notifications
            <span class="nav-spacer"></span>
            <org-indicator color="danger" size="sm" [number]="3" />
          </span>
          <span class="nav-row">
            <org-icon name="users" size="sm" />
            Team
            <span class="nav-spacer"></span>
          </span>
          <span class="nav-row">
            <org-icon name="file-text" size="sm" />
            Drafts
            <span class="nav-spacer"></span>
            <org-indicator color="neutral" size="sm" ariaLabel="has drafts" />
          </span>
          <span class="nav-row">
            <org-icon name="calendar" size="sm" />
            Calendar
            <span class="nav-spacer"></span>
          </span>
        </div>
      </div>
    </div>

    <div class="group">
      <span class="group-label">Live status · pulse</span>
      <div class="chip-row">
        <span class="chip">
          <org-indicator color="safe" [pulse]="true" ariaLabel="live" />
          Live
          <span class="chip-meta">· streaming since 10:24</span>
        </span>
        <span class="chip">
          <org-indicator color="info" [pulse]="true" ariaLabel="recording" />
          Recording
          <span class="chip-meta">· 02:14 elapsed</span>
        </span>
        <span class="chip">
          <org-indicator color="neutral" ariaLabel="idle" />
          Idle
          <span class="chip-meta">· last refresh 12 min ago</span>
        </span>
        <span class="chip">
          <org-indicator color="danger" [pulse]="true" ariaLabel="alert" />
          Alert
          <span class="chip-meta">· 3 services degraded</span>
        </span>
      </div>
      <span class="group-caption">The pulse animation is suppressed under prefers-reduced-motion: reduce.</span>
    </div>
  `,
})
class IndicatorInlineSection {}

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every indicator variant axis — modes, color × size matrices for both dot and number, pinned-to-anchor placements, and inline label use cases.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Modes"
            description="Three rendering modes. Dot is the default when there's no inner content. Number shows a count, capped at 99+. Icon wraps a single org-icon (e.g. a check for a 'verified' pip)."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-12 items-center justify-center">
              <div class="flex flex-col items-center gap-2">
                <org-indicator ariaLabel="status" />
                <span class="text-2xs uppercase">Dot</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <org-indicator color="neutral" [number]="12" />
                <span class="text-2xs uppercase">Number</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <org-indicator color="safe">
                  <org-icon name="check" size="2xs" />
                </org-indicator>
                <span class="text-2xs uppercase">Icon</span>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Color × size · dot"
            description="Eight semantic colors at three sizes. Use semantic colors purposefully — safe for online/active, danger for unread/error, caution for warnings, neutral for de-emphasized status."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-indicator-color-size-dot-grid />
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Color × size · number"
            description="Same matrix in number mode. Single-digit, double-digit, and the 99+ overflow shown side by side so you can sanity-check padding and alignment."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-indicator-color-size-number-grid />
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Color strength"
            description="Set [colorStrength]='soft' to swap the solid fill for the matching soft tint with neutral foreground text. Strong (default) is the saturated fill; soft suits lower-emphasis status. Shown across all colors for dot, number, and icon modes."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-indicator-color-strength-grid />
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Shape"
            description="Set [shape]='rounded' to swap the default pill/circle radius for a rounded-box radius that scales per size (sm 4px · base 6px · lg 8px). Applies across all three modes. Shown against the default 'circle' shape."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-indicator-shape-grid />
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="With fade"
            description="Set [hasFade]='true' to paint a 4px halo around the indicator using the matching soft color — softens the edge so the dot reads as 'fading' into its surroundings. Composes with [ring], [pulse], and [position]."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-indicator-fade-grid />
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Pinned to an anchor"
            description="Wrap the anchor in org-indicator-anchor (or any element with position: relative) and set [position] on the indicator. Add [ring]='true' when the anchor's background could compete with the dot — common for avatars."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-indicator-pinned-section />
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Inline labels"
            description="Indicators sit cleanly next to text — in tab labels, sidebar nav rows, or any list item. No positioning needed; they're inline-flex by default."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-indicator-inline-section />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
      </div>
    `,
    moduleMetadata: {
      imports: [
        Indicator,
        IndicatorAnchor,
        Icon,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        IndicatorColorSizeDotGridSection,
        IndicatorColorSizeNumberGridSection,
        IndicatorColorStrengthGridSection,
        IndicatorShapeGridSection,
        IndicatorFadeGridSection,
        IndicatorPinnedSection,
        IndicatorInlineSection,
      ],
    },
  }),
};
