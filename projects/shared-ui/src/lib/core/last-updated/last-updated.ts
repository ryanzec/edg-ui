import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { type DateTime } from 'luxon';
import { Indicator, type IndicatorColor } from '../indicator/indicator';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { DatePipe } from '../date-pipe/date-pipe';
import { TextDirective } from '../text-directive/text-directive';
import { DateFormat, TimeFormat } from '@organization/shared-utils';
import { LastUpdatedBrainDirective } from '../../brain/last-updated-brain/last-updated-brain';

@Component({
  selector: 'org-last-updated',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Indicator, LoadingSpinner, DatePipe, TextDirective],
  templateUrl: './last-updated.html',
  styleUrl: './last-updated.css',
  hostDirectives: [
    {
      directive: LastUpdatedBrainDirective,
      inputs: ['status', 'isLoading'],
    },
  ],
  host: {
    '[attr.data-status]': 'brain.status()',
    '[attr.data-is-loading]': 'brain.isLoading() ? "" : null',
  },
})
export class LastUpdated {
  /** reference to the host last-updated brain directive owning status / loading state and the a11y surface */
  protected readonly brain = inject(LastUpdatedBrainDirective, { self: true });

  /** the last time the data was updated */
  public lastUpdatedAt = input.required<DateTime>();

  /** date format constants exposed to the template */
  protected readonly DateFormat = DateFormat;

  /** time format constants exposed to the template */
  protected readonly TimeFormat = TimeFormat;

  /** the indicator color derived from the current status */
  protected readonly indicatorColor = computed<IndicatorColor>(() => {
    return this.brain.status() === 'active' ? 'safe' : 'neutral';
  });
}
