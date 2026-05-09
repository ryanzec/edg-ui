import { Directive, input } from '@angular/core';

/** default value for the label input */
export const LOADING_SPINNER_LABEL_DEFAULT = 'Loading';

/**
 * headless brain directive for the loading-spinner component. owns the accessibility surface
 * (role="status", aria-label) and the label input that drives it. carries no styling or template —
 * apply it to the host of a presentation component via hostDirectives.
 */
@Directive({
  selector: '[orgLoadingSpinnerBrain]',
  exportAs: 'orgLoadingSpinnerBrain',
  host: {
    role: 'status',
    '[attr.aria-label]': 'label()',
  },
})
export class LoadingSpinnerBrainDirective {
  /** accessible label announced by screen readers */
  public readonly label = input<string>(LOADING_SPINNER_LABEL_DEFAULT);
}
