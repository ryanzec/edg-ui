import { Directive, computed, input } from '@angular/core';

/** all valid status values */
export const allLastUpdatedStatuses = ['active', 'inactive'] as const;

/** the status driving the last-updated indicator */
export type LastUpdatedStatus = (typeof allLastUpdatedStatuses)[number];

/** default value for the isLoading input */
export const LAST_UPDATED_IS_LOADING_DEFAULT = false;

/**
 * headless brain directive for the last-updated component. owns the status / loading state and the
 * accessibility surface (role, aria-label) for the presentation to bind. carries no styling or template —
 * apply it to the host of a presentation component via hostDirectives.
 */
@Directive({
  selector: '[orgLastUpdatedBrain]',
  exportAs: 'orgLastUpdatedBrain',
  host: {
    role: 'status',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class LastUpdatedBrainDirective {
  /** the current status */
  public readonly status = input.required<LastUpdatedStatus>();

  /** whether the indicator is in a loading state */
  public readonly isLoading = input<boolean>(LAST_UPDATED_IS_LOADING_DEFAULT);

  /** accessible label describing the current state for screen readers */
  public readonly ariaLabel = computed<string>(() => {
    if (this.isLoading()) {
      return 'loading last updated';
    }

    return `last updated status: ${this.status()}`;
  });
}
