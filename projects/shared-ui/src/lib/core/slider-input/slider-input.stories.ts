import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { map } from 'rxjs';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { FormField } from '../form-fields/form-field';
import { FormFields } from '../form-fields/form-fields';
import { Label } from '../label/label';
import { allComponentColors } from '../types/component-types';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlInput } from '../../example/design-system-demo/design-system-demo-control-input';
import { DesignSystemDemoControlsGroup } from '../../example/design-system-demo/design-system-demo-controls-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import {
  SliderInput,
  SliderInputColor,
  SliderInputSize,
  allSliderInputSizes,
  type SliderInputDirection,
} from './slider-input';

const liveDemoDirectionItems: ButtonToggleItem[] = [
  { label: 'horizontal', value: 'horizontal', buttonColor: 'primary' },
  { label: 'vertical', value: 'vertical', buttonColor: 'primary' },
];

const liveDemoColorItems: ButtonToggleItem[] = allComponentColors.map((color) => ({
  label: color,
  value: color,
  buttonColor: 'primary',
}));

const liveDemoSizeItems: ButtonToggleItem[] = allSliderInputSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

type LiveDemoThumbChoice = 'single' | 'two' | 'three';

const allLiveDemoThumbChoices: LiveDemoThumbChoice[] = ['single', 'two', 'three'];

const liveDemoThumbItems: ButtonToggleItem[] = allLiveDemoThumbChoices.map((choice) => ({
  label: choice,
  value: choice,
  buttonColor: 'primary',
}));

const meta: Meta<SliderInput> = {
  title: 'Core/Components/Slider Input',
  component: SliderInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Slider Input Component

  A slider input that lets the user click and drag one or more thumbs along a track to select numeric values.

  ### Features
  - 1 or more thumbs, each representing an independent value
  - Configurable min, max, and step
  - Horizontal or vertical orientation
  - Optional tick marks (min / max / configurable intermediate ticks) with linear value labels
  - Optional thumb crossing (\`allowCrossing\`) — when off, each thumb is constrained between its neighbors
  - Disabled state (disables all thumbs)
  - 8 color variants and 3 size variants
  - Full keyboard support per the W3C slider pattern
  - Form integration via Angular reactive forms (ControlValueAccessor) — value is a \`number[]\`

  ### Keyboard Shortcuts
  - **Arrow keys** (← → ↑ ↓): nudge the focused thumb by \`step\`
  - **Shift + Arrow keys**: nudge by 10× \`step\`
  - **PageUp / PageDown**: nudge by 10% of the range
  - **Home / End**: jump to the (constrained) min / max for the focused thumb
  - **Tab**: move focus between thumbs

  ### Accessibility
  - Each thumb is a \`role="slider"\` button with \`aria-valuemin\`, \`aria-valuemax\`, \`aria-valuenow\`, \`aria-orientation\`, and \`aria-disabled\`
  - When \`allowCrossing="false"\`, each thumb's \`aria-valuemin / aria-valuemax\` reflects its neighbor constraints
  - Track click jumps the nearest thumb to the click position and starts a drag

  ### Usage Examples
  \`\`\`html
  <!-- Single-thumb horizontal slider -->
  <org-slider-input direction="horizontal" [values]="[40]" (valuesChange)="onChange($event)" />

  <!-- Multi-thumb range with tick marks -->
  <org-slider-input
    direction="horizontal"
    [values]="[20, 80]"
    [min]="0"
    [max]="100"
    [step]="5"
    [showTicks]="true"
    [tickCount]="4"
  />

  <!-- Vertical slider -->
  <org-slider-input direction="vertical" [values]="[50]" />

  <!-- Reactive form integration -->
  <org-slider-input direction="horizontal" formControlName="volume" />
</div>
  \`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SliderInput>;

export const Default: Story = {
  args: {
    direction: 'horizontal',
    min: 0,
    max: 100,
    step: 1,
    values: [50],
    disabled: false,
    allowCrossing: true,
    color: 'primary',
    size: 'base',
    showTicks: false,
    tickCount: 0,
    ariaLabel: 'slider',
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the slider',
    },
    min: { control: 'number', description: 'The minimum selectable value' },
    max: { control: 'number', description: 'The maximum selectable value' },
    step: { control: 'number', description: 'The granularity by which values can change' },
    values: { control: 'object', description: 'The current value(s) for each thumb' },
    disabled: { control: 'boolean', description: 'Whether the slider is disabled' },
    allowCrossing: { control: 'boolean', description: 'When true, thumbs may pass through each other' },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'neutral', 'safe', 'info', 'caution', 'warning', 'danger'],
      description: 'The color variant applied to the fill and thumbs',
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'The size of the slider',
    },
    showTicks: { control: 'boolean', description: 'Whether to render tick marks along the track' },
    tickCount: { control: 'number', description: 'The number of ticks rendered between min and max' },
    ariaLabel: { control: 'text', description: 'Accessible label applied to every thumb' },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default slider with primary color. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div [style.width.px]="direction === 'horizontal' ? 400 : null" [style.height.px]="direction === 'vertical' ? 300 : null">
        <org-slider-input
          [direction]="direction"
          [min]="min"
          [max]="max"
          [step]="step"
          [values]="values"
          [disabled]="disabled"
          [allowCrossing]="allowCrossing"
          [color]="color"
          [size]="size"
          [showTicks]="showTicks"
          [tickCount]="tickCount"
          [ariaLabel]="ariaLabel"
        />
      </div>
    `,
    moduleMetadata: {
      imports: [SliderInput],
    },
  }),
};

@Component({
  selector: 'story-slider-input-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SliderInput,
    ButtonToggle,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlsGroup,
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
        min-height: 12rem;
      }
      .horizontal-host {
        width: 25rem;
      }
      .vertical-host {
        height: 12rem;
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Every input is wired to the slider — drag, focus, and use the keyboard arrows / PageUp / PageDown / Home / End to interact."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-controls-group label="Presentation">
            <org-design-system-demo-control-input label="Direction">
              <org-button-toggle [items]="directionItems" formControlName="direction" buttonSize="sm" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Color">
              <org-button-toggle [items]="colorItems" formControlName="color" buttonSize="sm" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Size">
              <org-button-toggle [items]="sizeItems" formControlName="size" buttonSize="sm" />
            </org-design-system-demo-control-input>
          </org-design-system-demo-controls-group>
          <org-design-system-demo-controls-group label="Behavior">
            <org-design-system-demo-control-input label="Thumbs">
              <org-button-toggle [items]="thumbItems" formControlName="thumbs" buttonSize="sm" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Disabled">
              <org-checkbox-toggle name="live-demo-disabled" value="disabled" formControlName="disabled">
                {{ liveDemoForm.controls.disabled.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Allow Crossing">
              <org-checkbox-toggle
                name="live-demo-allow-crossing"
                value="allow-crossing"
                formControlName="allowCrossing"
              >
                {{ liveDemoForm.controls.allowCrossing.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
          </org-design-system-demo-controls-group>
          <org-design-system-demo-controls-group label="Ticks">
            <org-design-system-demo-control-input label="Show Ticks">
              <org-checkbox-toggle name="live-demo-show-ticks" value="show-ticks" formControlName="showTicks">
                {{ liveDemoForm.controls.showTicks.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Tick Count">
              <input
                type="number"
                min="0"
                max="10"
                formControlName="tickCount"
                class="border border-default-color rounded-base p-1 w-16"
              />
            </org-design-system-demo-control-input>
          </org-design-system-demo-controls-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            @if (liveDemoForm.controls.direction.value === 'horizontal') {
              <div class="horizontal-host">
                <org-slider-input
                  direction="horizontal"
                  [color]="liveDemoForm.controls.color.value"
                  [size]="liveDemoForm.controls.size.value"
                  [disabled]="liveDemoForm.controls.disabled.value"
                  [showTicks]="liveDemoForm.controls.showTicks.value"
                  [tickCount]="liveDemoForm.controls.tickCount.value"
                  [allowCrossing]="liveDemoForm.controls.allowCrossing.value"
                  [values]="resolvedValues()"
                  (valuesChange)="onValuesChange($event)"
                />
              </div>
            } @else {
              <div class="vertical-host">
                <org-slider-input
                  direction="vertical"
                  [color]="liveDemoForm.controls.color.value"
                  [size]="liveDemoForm.controls.size.value"
                  [disabled]="liveDemoForm.controls.disabled.value"
                  [showTicks]="liveDemoForm.controls.showTicks.value"
                  [tickCount]="liveDemoForm.controls.tickCount.value"
                  [allowCrossing]="liveDemoForm.controls.allowCrossing.value"
                  [values]="resolvedValues()"
                  (valuesChange)="onValuesChange($event)"
                />
              </div>
            }
          </div>
          <p class="mt-4">
            Current values: <strong>{{ valuesDisplay() }}</strong>
          </p>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class SliderInputLiveDemoStory {
  protected readonly directionItems = liveDemoDirectionItems;
  protected readonly colorItems = liveDemoColorItems;
  protected readonly sizeItems = liveDemoSizeItems;
  protected readonly thumbItems = liveDemoThumbItems;

  protected readonly liveDemoForm = new FormGroup({
    direction: new FormControl<SliderInputDirection>('horizontal', { nonNullable: true }),
    color: new FormControl<SliderInputColor>('primary', { nonNullable: true }),
    size: new FormControl<SliderInputSize>('base', { nonNullable: true }),
    thumbs: new FormControl<LiveDemoThumbChoice>('single', { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
    showTicks: new FormControl<boolean>(false, { nonNullable: true }),
    tickCount: new FormControl<number>(3, { nonNullable: true }),
    allowCrossing: new FormControl<boolean>(true, { nonNullable: true }),
  });

  private readonly _singleValues = signal<number[]>([50]);
  private readonly _twoValues = signal<number[]>([25, 75]);
  private readonly _threeValues = signal<number[]>([20, 50, 80]);

  protected readonly resolvedValues = toSignal(
    this.liveDemoForm.controls.thumbs.valueChanges.pipe(map(() => this._currentValuesForChoice())),
    { initialValue: this._currentValuesForChoice() }
  );

  protected readonly valuesDisplay = toSignal(
    this.liveDemoForm.controls.thumbs.valueChanges.pipe(map(() => JSON.stringify(this._currentValuesForChoice()))),
    { initialValue: JSON.stringify(this._currentValuesForChoice()) }
  );

  protected onValuesChange(newValues: number[]): void {
    const choice = this.liveDemoForm.controls.thumbs.value;

    if (choice === 'single') {
      this._singleValues.set(newValues);
    } else if (choice === 'two') {
      this._twoValues.set(newValues);
    } else {
      this._threeValues.set(newValues);
    }
  }

  private _currentValuesForChoice(): number[] {
    const choice = this.liveDemoForm.controls.thumbs.value;

    if (choice === 'single') {
      return this._singleValues();
    }

    if (choice === 'two') {
      return this._twoValues();
    }

    return this._threeValues();
  }
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Drive every visual input (direction, color, size, thumb count, disabled, ticks, allowCrossing) and observe the live result.',
      },
    },
  },
  render: () => ({
    template: `<story-slider-input-live-demo />`,
    moduleMetadata: {
      imports: [SliderInputLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every slider variant axis — direction, single vs multi-thumb, ticks, size, color, disabled, step, and crossing — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Direction" />
          <org-design-system-demo-canvas slot="canvas">
            <div style="width: 25rem;">
              <org-slider-input direction="horizontal" [values]="[40]" />
            </div>
            <div style="height: 12rem;">
              <org-slider-input direction="vertical" [values]="[60]" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Horizontal</strong>: arrows ←/→ and ↑/↓ all work; the track grows to fill its container</li>
            <li><strong>Vertical</strong>: arrows ↑/↓ and ←/→ all work; the track grows to fill its container</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Single vs Multi-Thumb" />
          <org-design-system-demo-canvas slot="canvas">
            <div style="width: 25rem;">
              <org-slider-input direction="horizontal" [values]="[35]" />
            </div>
            <div style="width: 25rem;">
              <org-slider-input direction="horizontal" [values]="[20, 80]" />
            </div>
            <div style="width: 25rem;">
              <org-slider-input direction="horizontal" [values]="[15, 50, 85]" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Single thumb</strong>: fill spans from min to the thumb</li>
            <li><strong>Multi-thumb</strong>: fill spans from the lowest thumb to the highest</li>
            <li>Each thumb gets its own <code>aria-valuemin/max/now</code> per the W3C slider pattern</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Ticks" />
          <org-design-system-demo-canvas slot="canvas">
            <div style="width: 25rem;">
              <org-slider-input direction="horizontal" [values]="[50]" [showTicks]="true" [tickCount]="0" />
            </div>
            <div style="width: 25rem;">
              <org-slider-input direction="horizontal" [values]="[50]" [showTicks]="true" [tickCount]="3" />
            </div>
            <div style="width: 25rem;">
              <org-slider-input direction="horizontal" [values]="[50]" [showTicks]="true" [tickCount]="9" />
            </div>
            <div style="height: 12rem;">
              <org-slider-input direction="vertical" [values]="[50]" [showTicks]="true" [tickCount]="3" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>tickCount=0</strong>: only min and max ticks are rendered</li>
            <li><strong>tickCount=N</strong>: N intermediate ticks are added between min and max (total ticks = N + 2)</li>
            <li>Tick values are computed on a linear scale between min and max</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Size Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <div style="width: 25rem;">
              <org-slider-input direction="horizontal" size="sm" [values]="[50]" />
            </div>
            <div style="width: 25rem;">
              <org-slider-input direction="horizontal" size="base" [values]="[50]" />
            </div>
            <div style="width: 25rem;">
              <org-slider-input direction="horizontal" size="lg" [values]="[50]" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>sm</strong>: thinner track and smaller thumbs for compact contexts</li>
            <li><strong>base</strong>: the standard slider size</li>
            <li><strong>lg</strong>: thicker track and larger thumbs for prominent use</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Color Variants" />
          <org-design-system-demo-canvas slot="canvas">
            @for (color of allColors; track color) {
              <div style="width: 25rem;">
                <org-slider-input direction="horizontal" [color]="color" [values]="[50]" />
              </div>
            }
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Color drives the filled-track background and the thumb border / hover / active states</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Disabled" />
          <org-design-system-demo-canvas slot="canvas">
            <div style="width: 25rem;">
              <org-slider-input direction="horizontal" [values]="[40]" [disabled]="true" />
            </div>
            <div style="width: 25rem;">
              <org-slider-input direction="horizontal" [values]="[25, 75]" [disabled]="true" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>All thumbs are non-interactive — pointer, click, and keyboard are no-ops</li>
            <li>Visual treatment uses the standard disabled opacity</li>
            <li>Thumbs are removed from the tab order (<code>tabindex="-1"</code>)</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Step Granularity" />
          <org-design-system-demo-canvas slot="canvas">
            <div style="width: 25rem;">
              <org-slider-input direction="horizontal" [values]="[50]" [step]="1" [showTicks]="true" [tickCount]="9" />
            </div>
            <div style="width: 25rem;">
              <org-slider-input direction="horizontal" [values]="[50]" [step]="10" [showTicks]="true" [tickCount]="9" />
            </div>
            <div style="width: 25rem;">
              <org-slider-input direction="horizontal" [values]="[50]" [step]="25" [showTicks]="true" [tickCount]="3" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>step</strong> snaps both keyboard and pointer changes to the nearest increment</li>
            <li>Shift + Arrow nudges by 10× step (e.g. step=1 → 10, step=5 → 50)</li>
            <li>PageUp / PageDown always nudges by ~10% of the range, regardless of step</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Allow Crossing" />
          <org-design-system-demo-canvas slot="canvas">
            <div style="width: 25rem;">
              <org-slider-input direction="horizontal" [values]="[30, 70]" [allowCrossing]="true" />
            </div>
            <div style="width: 25rem;">
              <org-slider-input direction="horizontal" [values]="[30, 70]" [allowCrossing]="false" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>allowCrossing=true</strong> (default): thumbs may pass each other; the values array is sorted on every change</li>
            <li><strong>allowCrossing=false</strong>: each thumb is constrained by its neighbors; <code>aria-valuemin/max</code> reflect those bounds</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    props: {
      allColors: allComponentColors,
    },
    moduleMetadata: {
      imports: [
        SliderInput,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

@Component({
  selector: 'story-slider-input-non-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Non-Form Usage" />
        <org-design-system-demo-canvas slot="canvas">
          <div style="width: 25rem;">
            <org-slider-input direction="horizontal" [values]="selected()" (valuesChange)="selected.set($event)" />
          </div>
          <p>
            Selected: <strong>{{ selected().join(', ') }}</strong>
          </p>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Drag the thumb or use arrow keys to update the value</li>
          <li>The host listens to the <code>valuesChange</code> output to update its own signal state</li>
          <li>Passing a different array to <code>[values]</code> writes the new state into the slider</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
  imports: [
    SliderInput,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
})
class SliderInputNonFormStory {
  protected readonly selected = signal<number[]>([35, 70]);
}

export const NonFormUsage: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Driving the slider outside of a reactive form using `[values]` + `(valuesChange)`.',
      },
    },
  },
  render: () => ({
    template: `<story-slider-input-non-form />`,
    moduleMetadata: {
      imports: [SliderInputNonFormStory],
    },
  }),
};

@Component({
  selector: 'story-slider-input-reactive-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Reactive Form Integration"
          [description]="'Form Valid: ' + sliderForm.valid + ', Form Value: ' + formValueDisplay()"
        />
        <org-design-system-demo-canvas slot="canvas">
          <form [formGroup]="sliderForm" class="flex flex-col gap-4" style="width: 25rem;">
            <org-form-fields>
              <org-form-field>
                <org-label text="Volume" />
                <org-slider-input direction="horizontal" formControlName="volume" />
              </org-form-field>
              <org-form-field>
                <org-label text="Price Range" />
                <org-slider-input
                  direction="horizontal"
                  [min]="0"
                  [max]="1000"
                  [step]="25"
                  [allowCrossing]="false"
                  [showTicks]="true"
                  [tickCount]="3"
                  formControlName="priceRange"
                />
              </org-form-field>
            </org-form-fields>
          </form>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Uses <strong>formControlName</strong> for reactive forms integration via ControlValueAccessor</li>
          <li>Form state updates automatically as the thumb is dragged — no manual change handlers needed</li>
          <li>
            Programmatic <strong>form.disable()</strong> and <strong>control.disable()</strong> reflect in the slider
          </li>
          <li>The form value is a <code>number[]</code> matching the thumb count</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
  imports: [
    SliderInput,
    FormFields,
    FormField,
    Label,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
    ReactiveFormsModule,
  ],
})
class SliderInputReactiveFormStory {
  protected readonly sliderForm = new FormGroup({
    volume: new FormControl<number[]>([40], { nonNullable: true }),
    priceRange: new FormControl<number[]>([200, 750], { nonNullable: true }),
  });

  protected readonly formValueDisplay = toSignal(
    this.sliderForm.valueChanges.pipe(map((value) => JSON.stringify(value))),
    { initialValue: JSON.stringify(this.sliderForm.value) }
  );
}

export const ReactiveFormIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example of integrating the slider with Angular reactive forms via ControlValueAccessor.',
      },
    },
  },
  render: () => ({
    template: `<story-slider-input-reactive-form />`,
    moduleMetadata: {
      imports: [SliderInputReactiveFormStory],
    },
  }),
};
