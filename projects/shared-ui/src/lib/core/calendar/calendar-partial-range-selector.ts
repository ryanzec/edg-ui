import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Calendar } from './calendar';
import { RadioGroup } from '../radio/radio-group';
import { Radio } from '../radio/radio';

/**
 * partial range selection type radio group for the calendar component
 */
@Component({
  selector: 'org-calendar-partial-range-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RadioGroup, Radio],
  templateUrl: './calendar-partial-range-selector.html',
  styleUrl: './calendar-partial-range-selector.css',
})
export class CalendarPartialRangeSelector {
  /**
   * reference to the parent calendar for shared state and handlers
   */
  protected readonly calendarComponent = inject(Calendar, { host: true });
}
