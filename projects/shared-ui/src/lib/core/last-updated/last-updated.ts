import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { type DateTime } from 'luxon';
import { Indicator, type IndicatorColor } from '../indicator/indicator';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { DatePipe } from '../date-pipe/date-pipe';
import { TextDirective } from '../text-directive/text-directive';
import { DateFormat, TimeFormat } from '@organization/shared-utils';

/** all valid last updated statuses */
export const lastUpdatedStatuses = ['active', 'inactive'] as const;

/** the status of the last updated indicator */
export type LastUpdatedStatus = 'active' | 'inactive';

/** default value for the isLoading input */
export const LAST_UPDATED_IS_LOADING_DEFAULT = false;

@Component({
  selector: 'org-last-updated',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Indicator, LoadingSpinner, DatePipe, TextDirective],
  templateUrl: './last-updated.html',
  styleUrl: './last-updated.css',
  host: {
    role: 'status',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.data-status]': 'status()',
    '[attr.data-is-loading]': 'isLoading() ? "" : null',
  },
})
export class LastUpdated {
  /** the current status */
  public status = input.required<LastUpdatedStatus>();

  /** whether the indicator is in a loading state */
  public isLoading = input<boolean>(LAST_UPDATED_IS_LOADING_DEFAULT);

  /** the last time the data was updated */
  public lastUpdatedAt = input.required<DateTime>();

  /** date format constants exposed to the template */
  protected readonly DateFormat = DateFormat;

  /** time format constants exposed to the template */
  protected readonly TimeFormat = TimeFormat;

  /** the indicator color derived from the current status */
  protected readonly indicatorColor = computed<IndicatorColor>(() => {
    return this.status() === 'active' ? 'safe' : 'neutral';
  });

  /** accessible label describing the current state for screen readers */
  protected readonly ariaLabel = computed<string>(() => {
    if (this.isLoading()) {
      return 'loading last updated';
    }

    return `last updated status: ${this.status()}`;
  });
}
