import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { ComponentColor, ComponentSize } from '../types/component-types';
import { IndicatorBrainDirective } from '../../brain/indicator-brain/indicator-brain';

/** color options for the indicator component */
export type IndicatorColor = ComponentColor;

/** size options for the indicator component */
export type IndicatorSize = Extract<ComponentSize, 'sm' | 'base' | 'lg'>;

/** default value for the color input */
export const INDICATOR_COLOR_DEFAULT: IndicatorColor = 'primary';

/** default value for the size input */
export const INDICATOR_SIZE_DEFAULT: IndicatorSize = 'base';

@Component({
  selector: 'org-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './indicator.html',
  styleUrl: './indicator.css',
  hostDirectives: [
    {
      directive: IndicatorBrainDirective,
      inputs: ['number', 'ariaLabel'],
    },
  ],
  host: {
    '[attr.data-color]': 'color()',
    '[attr.data-size]': 'size()',
    '[attr.data-has-number]': 'brain.hasNumber() ? "" : null',
  },
})
export class Indicator {
  /** reference to the host indicator brain directive owning numbered state and the a11y surface */
  protected readonly brain = inject(IndicatorBrainDirective, { self: true });

  /** the semantic color of the indicator */
  public color = input<IndicatorColor>(INDICATOR_COLOR_DEFAULT);

  /** the size of the indicator */
  public size = input<IndicatorSize>(INDICATOR_SIZE_DEFAULT);
}
