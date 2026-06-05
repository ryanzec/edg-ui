import { Directive, computed, input } from '@angular/core';
import { angularUtils, logManager } from '@organization/shared-utils';

/** default value for the percentage input */
export const PROGRESS_BAR_PERCENTAGE_DEFAULT = 0;

/** default value for the ariaLabel input */
export const PROGRESS_BAR_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/** the lowest value the progress bar can represent */
export const PROGRESS_BAR_PERCENTAGE_MIN = 0;

/** the highest value the progress bar can represent */
export const PROGRESS_BAR_PERCENTAGE_MAX = 100;

/**
 * headless brain directive for the progress bar component. owns the fill percentage, its clamped
 * effective value, and the accessibility surface (role, aria-value*, aria-label) for the presentation to
 * bind. carries no styling or template — apply it to the host of a presentation component via hostDirectives.
 */
@Directive({
  selector: '[orgProgressBarBrain]',
  exportAs: 'orgProgressBarBrain',
  host: {
    role: 'progressbar',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    '[attr.aria-valuenow]': 'effectivePercentage()',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class ProgressBarBrainDirective {
  /** the fill percentage; values are clamped to the 0–100 range via effectivePercentage */
  public readonly percentage = input<number>(PROGRESS_BAR_PERCENTAGE_DEFAULT);

  /** accessible label for the progress bar; recommended when there is no associated visible label */
  public readonly ariaLabel = input<string | undefined, string | null | undefined>(PROGRESS_BAR_ARIA_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the percentage clamped to the valid 0–100 range, used for both the aria value and the visual fill width */
  public readonly effectivePercentage = computed<number>(() => {
    const percentage = this.percentage();

    if (Number.isFinite(percentage) === false) {
      logManager.warn({
        type: 'progress-bar-invalid-percentage',
        percentage,
      });

      return PROGRESS_BAR_PERCENTAGE_MIN;
    }

    return Math.min(PROGRESS_BAR_PERCENTAGE_MAX, Math.max(PROGRESS_BAR_PERCENTAGE_MIN, percentage));
  });
}
