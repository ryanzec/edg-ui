import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { ComponentColor, ComponentSize } from '../types/component-types';

/** color options for the indicator component */
export type IndicatorColor = ComponentColor;

/** size options for the indicator component */
export type IndicatorSize = Extract<ComponentSize, 'sm' | 'base' | 'lg'>;

/** default value for the color input */
export const INDICATOR_COLOR_DEFAULT: IndicatorColor = 'primary';

/** default value for the size input */
export const INDICATOR_SIZE_DEFAULT: IndicatorSize = 'base';

/** default value for the number input */
export const INDICATOR_NUMBER_DEFAULT: number | undefined = undefined;

/** default value for the ariaLabel input */
export const INDICATOR_ARIA_LABEL_DEFAULT: string | undefined = undefined;

@Component({
  selector: 'org-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './indicator.html',
  styleUrl: './indicator.css',
  host: {
    '[attr.data-color]': 'color()',
    '[attr.data-size]': 'size()',
    '[attr.data-has-number]': 'hasNumber() ? "" : null',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class Indicator {
  /** the semantic color of the indicator */
  public color = input<IndicatorColor>(INDICATOR_COLOR_DEFAULT);

  /** optional number to display; values >= 100 render as "99+" */
  public number = input<number | undefined, number | null | undefined>(INDICATOR_NUMBER_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the size of the indicator */
  public size = input<IndicatorSize>(INDICATOR_SIZE_DEFAULT);

  /** accessible label for the indicator; recommended when used as a standalone dot with no visible text */
  public ariaLabel = input<string | undefined, string | null | undefined>(INDICATOR_ARIA_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the formatted string to render inside the badge */
  protected readonly displayValue = computed<string>(() => {
    const num = this.number();

    if (num === undefined) {
      return '';
    }

    if (num >= 100) {
      return '99+';
    }

    return num.toString();
  });

  /** whether the indicator is in the numbered badge state */
  protected readonly hasNumber = computed<boolean>(() => {
    return this.number() !== undefined;
  });
}
