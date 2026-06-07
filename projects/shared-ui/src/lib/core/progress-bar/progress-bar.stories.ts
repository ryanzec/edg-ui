import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { SliderInput } from '../slider-input/slider-input';
import { allComponentColors } from '../types/component-types';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlInput } from '../../example/design-system-demo/design-system-demo-control-input';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import {
  ProgressBar,
  ProgressBarColor,
  ProgressBarShape,
  ProgressBarSize,
  allProgressBarShapes,
  allProgressBarSizes,
} from './progress-bar';

const liveDemoColorItems: ButtonToggleItem[] = allComponentColors.map((color) => ({
  label: color,
  value: color,
  buttonColor: 'primary',
}));

const liveDemoShapeItems: ButtonToggleItem[] = allProgressBarShapes.map((shape) => ({
  label: shape,
  value: shape,
  buttonColor: 'primary',
}));

const liveDemoSizeItems: ButtonToggleItem[] = allProgressBarSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

const meta: Meta<ProgressBar> = {
  title: 'Core/Components/Progress Bar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Progress Bar Component

  A horizontal bar that fills to a given percentage to convey determinate progress. The track is fixed to the neutral palette while the fill takes any of the eight semantic colors. Two shapes, three heights, and a fill clamped to the 0–100 range.

  ### Colors
  The filled portion accepts the eight semantic ramps — \`primary\` (default), \`secondary\`, \`neutral\`, \`safe\`, \`info\`, \`caution\`, \`warning\`, \`danger\`. The unfilled track is always neutral.

  ### Shape
  - **pill** (default): fully-rounded pill ends
  - **rounded**: a subtle xs corner radius

  ### Size
  The width always fills its parent; the height is controlled by size — \`sm\` (8px) · \`base\` (12px, default) · \`lg\` (16px).

  ### Fill
  Set \`[percentage]\` to a number between 0 and 100. Out-of-range values are clamped.

  ### Accessibility
  Renders with \`role="progressbar"\` and \`aria-valuemin\`/\`aria-valuemax\`/\`aria-valuenow\`. Provide an \`ariaLabel\` when there is no associated visible label.

  ### Usage Examples
  \`\`\`html
  <org-progress-bar [percentage]="65" ariaLabel="Upload progress" />
  <org-progress-bar color="safe" shape="rounded" size="lg" [percentage]="100" ariaLabel="Complete" />
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;

// the percentage / ariaLabel inputs come from the host-directive forwarding on `ProgressBar`, which
// storybook's signal-input type extraction does not see, so they are augmented onto the args type here.
type Story = StoryObj<ProgressBar & { percentage: number; ariaLabel: string | null }>;

export const Default: Story = {
  args: {
    color: 'primary',
    shape: 'pill',
    size: 'base',
    percentage: 65,
    ariaLabel: 'Progress',
  },
  argTypes: {
    color: {
      control: 'select',
      options: allComponentColors,
      description: 'The color of the filled portion of the progress bar',
    },
    shape: {
      control: 'select',
      options: allProgressBarShapes,
      description: "The corner shape of the progress bar; 'rounded' swaps the pill radius for the xs radius",
    },
    size: {
      control: 'select',
      options: allProgressBarSizes,
      description: 'The height of the progress bar',
    },
    percentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'The fill percentage (clamped to 0–100)',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for the progress bar',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default progress bar with primary fill. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 24rem;">
        <org-progress-bar
          [color]="color"
          [shape]="shape"
          [size]="size"
          [percentage]="percentage"
          [ariaLabel]="ariaLabel"
        />
      </div>
    `,
    moduleMetadata: {
      imports: [ProgressBar],
    },
  }),
};

@Component({
  selector: 'story-progress-bar-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ProgressBar,
    ButtonToggle,
    SliderInput,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlInput,
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
        padding-inline: var(--spacing-8);
      }
      .bar-wrapper {
        width: 100%;
        max-width: 32rem; /* 512px */
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Drag the fill slider and toggle the color, shape, and size to walk every combination. The track stays neutral while the fill takes the chosen color."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-input label="Color">
            <org-button-toggle [items]="colorItems" formControlName="color" buttonSize="sm" />
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Shape">
            <org-button-toggle [items]="shapeItems" formControlName="shape" buttonSize="sm" />
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Size">
            <org-button-toggle [items]="sizeItems" formControlName="size" buttonSize="sm" />
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Fill">
            <org-slider-input
              formControlName="percentage"
              direction="horizontal"
              [min]="0"
              [max]="100"
              [step]="1"
              ariaLabel="Fill percentage"
            />
          </org-design-system-demo-control-input>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <div class="bar-wrapper">
              <org-progress-bar
                [color]="liveDemoForm.controls.color.value"
                [shape]="liveDemoForm.controls.shape.value"
                [size]="liveDemoForm.controls.size.value"
                [percentage]="liveDemoForm.controls.percentage.value[0]"
                ariaLabel="Live demo progress"
              />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class ProgressBarLiveDemoStory {
  protected readonly colorItems = liveDemoColorItems;
  protected readonly shapeItems = liveDemoShapeItems;
  protected readonly sizeItems = liveDemoSizeItems;

  protected readonly liveDemoForm = new FormGroup({
    color: new FormControl<ProgressBarColor>('primary', { nonNullable: true }),
    shape: new FormControl<ProgressBarShape>('pill', { nonNullable: true }),
    size: new FormControl<ProgressBarSize>('base', { nonNullable: true }),
    percentage: new FormControl<number[]>([65], { nonNullable: true }),
  });
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to drive every input on the progress bar (color, shape, size, fill percentage) and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: `<story-progress-bar-live-demo />`,
    moduleMetadata: {
      imports: [ProgressBarLiveDemoStory],
    },
  }),
};

const showcaseColors: ProgressBarColor[] = [...allComponentColors];
const showcaseShapes: ProgressBarShape[] = [...allProgressBarShapes];
const showcaseSizes: ProgressBarSize[] = [...allProgressBarSizes];

@Component({
  selector: 'story-progress-bar-color-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressBar],
  styles: [
    `
      :host {
        display: block;
      }
      .grid {
        display: grid;
        grid-template-columns: 6rem 1fr;
        align-items: center;
        row-gap: var(--spacing-3);
        column-gap: var(--spacing-4);
      }
      .row-label {
        text-transform: capitalize;
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        color: var(--color-fg-muted);
      }
    `,
  ],
  template: `
    <div class="grid">
      @for (color of colors; track color) {
        <span class="row-label">{{ color }}</span>
        <org-progress-bar [color]="color" [percentage]="65" [ariaLabel]="color + ' progress'" />
      }
    </div>
  `,
})
class ProgressBarColorGridSection {
  protected readonly colors = showcaseColors;
}

@Component({
  selector: 'story-progress-bar-size-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressBar],
  styles: [
    `
      :host {
        display: block;
      }
      .grid {
        display: grid;
        grid-template-columns: 6rem 1fr;
        align-items: center;
        row-gap: var(--spacing-3);
        column-gap: var(--spacing-4);
      }
      .row-label {
        text-transform: uppercase;
        font-size: var(--font-size-2xs);
        letter-spacing: 0.06em;
        color: var(--color-fg-muted);
      }
    `,
  ],
  template: `
    <div class="grid">
      @for (size of sizes; track size) {
        <span class="row-label">{{ size }}</span>
        <org-progress-bar color="primary" [size]="size" [percentage]="65" [ariaLabel]="size + ' progress'" />
      }
    </div>
  `,
})
class ProgressBarSizeGridSection {
  protected readonly sizes = showcaseSizes;
}

@Component({
  selector: 'story-progress-bar-shape-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressBar],
  styles: [
    `
      :host {
        display: block;
      }
      .grid {
        display: grid;
        grid-template-columns: 6rem 1fr;
        align-items: center;
        row-gap: var(--spacing-3);
        column-gap: var(--spacing-4);
      }
      .row-label {
        text-transform: capitalize;
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        color: var(--color-fg-muted);
      }
    `,
  ],
  template: `
    <div class="grid">
      @for (shape of shapes; track shape) {
        <span class="row-label">{{ shape }}</span>
        <org-progress-bar
          color="primary"
          size="lg"
          [shape]="shape"
          [percentage]="65"
          [ariaLabel]="shape + ' progress'"
        />
      }
    </div>
  `,
})
class ProgressBarShapeGridSection {
  protected readonly shapes = showcaseShapes;
}

@Component({
  selector: 'story-progress-bar-fill-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressBar],
  styles: [
    `
      :host {
        display: block;
      }
      .grid {
        display: grid;
        grid-template-columns: 6rem 1fr;
        align-items: center;
        row-gap: var(--spacing-3);
        column-gap: var(--spacing-4);
      }
      .row-label {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        color: var(--color-fg-muted);
      }
    `,
  ],
  template: `
    <div class="grid">
      @for (fill of fills; track fill) {
        <span class="row-label">{{ fill }}%</span>
        <org-progress-bar color="primary" [percentage]="fill" [ariaLabel]="fill + '% progress'" />
      }
    </div>
  `,
})
class ProgressBarFillGridSection {
  protected readonly fills = [0, 25, 50, 75, 100];
}

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every progress bar variant axis — the eight semantic fill colors, the three heights, both shapes, and a fill ramp from 0 to 100.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Colors"
            description="The filled portion accepts the eight semantic colors while the track stays neutral. Shown at a 65% fill."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-progress-bar-color-grid />
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Sizes"
            description="Three heights — sm (8px), base (12px, default), and lg (16px). The width always fills the parent."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-progress-bar-size-grid />
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Shape"
            description="Set [shape]='rounded' to swap the default pill ends for a subtle xs corner radius."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-progress-bar-shape-grid />
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Fill"
            description="Set [percentage] to a number between 0 and 100. Out-of-range values are clamped to that range."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-progress-bar-fill-grid />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
      </div>
    `,
    moduleMetadata: {
      imports: [
        ProgressBar,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        ProgressBarColorGridSection,
        ProgressBarSizeGridSection,
        ProgressBarShapeGridSection,
        ProgressBarFillGridSection,
      ],
    },
  }),
};
