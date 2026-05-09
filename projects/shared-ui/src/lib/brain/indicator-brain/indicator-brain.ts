import { Directive, computed, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';

/** default value for the number input */
export const INDICATOR_NUMBER_DEFAULT: number | undefined = undefined;

/** default value for the ariaLabel input */
export const INDICATOR_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/**
 * headless brain directive for the indicator component. owns the numbered/dot state, the display-value
 * formatting (values >= 100 render as "99+"), and the accessibility surface (role, aria-label) for the
 * presentation to bind. carries no styling or template — apply it to the host of a presentation component
 * via hostDirectives.
 */
@Directive({
  selector: '[orgIndicatorBrain]',
  exportAs: 'orgIndicatorBrain',
  host: {
    role: 'status',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class IndicatorBrainDirective {
  /** optional number to display; values >= 100 render as "99+" */
  public readonly number = input<number | undefined, number | null | undefined>(INDICATOR_NUMBER_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** accessible label for the indicator; recommended when used as a standalone dot with no visible text */
  public readonly ariaLabel = input<string | undefined, string | null | undefined>(INDICATOR_ARIA_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** whether the indicator is in the numbered badge state */
  public readonly hasNumber = computed<boolean>(() => {
    return this.number() !== undefined;
  });

  /** the formatted string to render inside the badge */
  public readonly displayValue = computed<string>(() => {
    const num = this.number();

    if (num === undefined) {
      return '';
    }

    if (num >= 100) {
      return '99+';
    }

    return num.toString();
  });
}
