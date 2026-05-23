import { Directive, input } from '@angular/core';

/** default value for the ariaLabel input */
export const SKELETON_ARIA_LABEL_DEFAULT = 'loading';

/**
 * headless brain directive for the skeleton component. owns the accessibility surface (role="status",
 * aria-busy="true", aria-label) for the presentation to bind. carries no styling or template — apply it
 * to the host of a presentation component via hostDirectives.
 */
@Directive({
  selector: '[orgSkeletonBrain]',
  exportAs: 'orgSkeletonBrain',
  host: {
    role: 'status',
    'aria-busy': 'true',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class SkeletonBrainDirective {
  /** accessible label announced by assistive tech while the skeleton is shown; defaults to 'loading' */
  public readonly ariaLabel = input<string>(SKELETON_ARIA_LABEL_DEFAULT);
}
