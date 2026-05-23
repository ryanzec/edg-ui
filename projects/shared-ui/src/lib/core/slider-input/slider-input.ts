import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentColor, ComponentSize } from '../types/component-types';
import {
  SLIDER_INPUT_ALLOW_CROSSING_DEFAULT,
  SLIDER_INPUT_DISABLED_DEFAULT,
  SLIDER_INPUT_MAX_DEFAULT,
  SLIDER_INPUT_MIN_DEFAULT,
  SLIDER_INPUT_STEP_DEFAULT,
  SLIDER_INPUT_VALUES_DEFAULT,
  SliderInputBrainDirective,
  type SliderInputDirection,
} from '../slider-input/slider-input-brain';

export {
  type SliderInputDirection,
  allSliderInputDirections,
  SLIDER_INPUT_MIN_DEFAULT,
  SLIDER_INPUT_MAX_DEFAULT,
  SLIDER_INPUT_STEP_DEFAULT,
  SLIDER_INPUT_VALUES_DEFAULT,
  SLIDER_INPUT_DISABLED_DEFAULT,
  SLIDER_INPUT_ALLOW_CROSSING_DEFAULT,
} from '../slider-input/slider-input-brain';

/** the color variant of the slider input */
export type SliderInputColor = ComponentColor;

/** all available slider input size values */
export const allSliderInputSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** the size variant of the slider input */
export type SliderInputSize = (typeof allSliderInputSizes)[number];

/** the default color of the slider input */
export const SLIDER_INPUT_COLOR_DEFAULT: SliderInputColor = 'primary';

/** the default size of the slider input */
export const SLIDER_INPUT_SIZE_DEFAULT: SliderInputSize = 'base';

/** default value for the showTicks input */
export const SLIDER_INPUT_SHOW_TICKS_DEFAULT = false;

/** default value for the tickCount input — number of ticks BETWEEN min and max (exclusive of both) */
export const SLIDER_INPUT_TICK_COUNT_DEFAULT = 0;

/** default value for the ariaLabel input */
export const SLIDER_INPUT_ARIA_LABEL_DEFAULT = 'slider';

/** a single rendered tick mark with its computed position and display value */
export type SliderInputTick = {
  percent: number;
  value: number;
};

@Component({
  selector: 'org-slider-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './slider-input.html',
  styleUrl: './slider-input.css',
  hostDirectives: [
    {
      directive: SliderInputBrainDirective,
      inputs: ['direction', 'min', 'max', 'step', 'values', 'disabled', 'allowCrossing'],
      outputs: ['valuesChange', 'changed', 'dragStarted', 'dragCompleted'],
    },
  ],
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[attr.data-show-ticks]': 'showTicks() ? "" : null',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderInput),
      multi: true,
    },
  ],
})
export class SliderInput implements ControlValueAccessor {
  protected readonly brain = inject(SliderInputBrainDirective, { self: true });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: number[]) => void = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  /** the orientation of the slider */
  public readonly direction = input.required<SliderInputDirection>();

  /** the minimum selectable value */
  public readonly min = input<number>(SLIDER_INPUT_MIN_DEFAULT);

  /** the maximum selectable value */
  public readonly max = input<number>(SLIDER_INPUT_MAX_DEFAULT);

  /** the granularity by which values can change via keyboard or pointer */
  public readonly step = input<number>(SLIDER_INPUT_STEP_DEFAULT);

  /** the current value for each thumb */
  public readonly values = input<number[]>(SLIDER_INPUT_VALUES_DEFAULT);

  /** whether the slider is disabled */
  public readonly disabled = input<boolean>(SLIDER_INPUT_DISABLED_DEFAULT);

  /** when true, thumbs may pass through each other; when false, each thumb is constrained between its neighbors */
  public readonly allowCrossing = input<boolean>(SLIDER_INPUT_ALLOW_CROSSING_DEFAULT);

  /** the color variant applied to the filled track and thumbs */
  public readonly color = input<SliderInputColor>(SLIDER_INPUT_COLOR_DEFAULT);

  /** the size of the slider (drives track thickness and thumb size) */
  public readonly size = input<SliderInputSize>(SLIDER_INPUT_SIZE_DEFAULT);

  /** whether to render tick marks along the track (min, max, and tickCount intermediate ticks) */
  public readonly showTicks = input<boolean>(SLIDER_INPUT_SHOW_TICKS_DEFAULT);

  /** the number of ticks rendered BETWEEN min and max (total visible ticks = tickCount + 2) */
  public readonly tickCount = input<number>(SLIDER_INPUT_TICK_COUNT_DEFAULT);

  /** accessible label applied to every thumb (used as `${ariaLabel} ${index + 1}` when more than one thumb is present) */
  public readonly ariaLabel = input<string>(SLIDER_INPUT_ARIA_LABEL_DEFAULT);

  /** the rendered tick marks (positions as percentages and the value at each position) */
  protected readonly ticks = computed<SliderInputTick[]>(() => {
    if (!this.showTicks()) {
      return [];
    }

    const min = this.min();
    const max = this.max();
    const total = Math.max(0, this.tickCount()) + 2;
    const range = max - min;

    if (range <= 0) {
      return [];
    }

    const result: SliderInputTick[] = [];

    for (let index = 0; index < total; index += 1) {
      const ratio = index / (total - 1);
      const percent = ratio * 100;
      const value = min + ratio * range;

      result.push({ percent, value });
    }

    return result;
  });

  /** the resolved accessible label for the thumb at the given index */
  protected thumbAriaLabel(index: number): string {
    const baseLabel = this.ariaLabel();
    const totalThumbs = this.brain.values().length;

    if (totalThumbs <= 1) {
      return baseLabel;
    }

    return `${baseLabel} ${index + 1}`;
  }

  constructor() {
    // forward brain user-interaction events to the reactive-forms callbacks
    this.brain.changed.subscribe((newValues) => {
      this._onChange(newValues);
    });

    this.brain.touched.subscribe(() => {
      this._onTouched();
    });
  }

  /** sets the values from the reactive forms api */
  public writeValue(value: number[] | null): void {
    if (value === null || value === undefined) {
      return;
    }

    this.brain.values.set(value);
  }

  /** registers the on-change callback for reactive forms */
  public registerOnChange(fn: (value: number[]) => void): void {
    this._onChange = fn;
  }

  /** registers the on-touched callback for reactive forms */
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /** receives the form-disabled state from reactive forms */
  public setDisabledState(isDisabled: boolean): void {
    this.brain.setFormDisabled(isDisabled);
  }
}
