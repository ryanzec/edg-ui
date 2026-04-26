import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Calendar, type CalendarDateData } from './calendar';

/**
 * calendar dates grid component
 */
@Component({
  selector: 'org-calendar-dates',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './calendar-dates.html',
  styleUrl: './calendar-dates.css',
})
export class CalendarDates {
  /**
   * reference to the parent calendar for shared state and handlers
   */
  protected readonly calendarComponent = inject(Calendar, { host: true });

  /**
   * gets the day number from a date
   */
  protected getDay(dateData: CalendarDateData): string {
    return dateData.date.day.toString();
  }
}
