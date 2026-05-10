import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Calendar } from './calendar';
import { type CalendarDateData } from '../../brain/calendar-brain/calendar-brain';

/**
 * calendar dates grid component — renders the weekday strip and the day cells with the band / chip / num
 * three-layer structure used by the range visualisation.
 */
@Component({
  selector: 'org-calendar-dates',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './calendar-dates.html',
  styleUrl: './calendar-dates.css',
  host: {
    '[attr.data-disabled]': 'calendarComponent.disabled() ? "" : null',
  },
})
export class CalendarDates {
  /**
   * reference to the parent calendar for shared state and handlers
   */
  public readonly calendarComponent = inject(Calendar);

  /**
   * gets the day number from a date
   */
  protected getDay(dateData: CalendarDateData): string {
    return dateData.date.day.toString();
  }
}
