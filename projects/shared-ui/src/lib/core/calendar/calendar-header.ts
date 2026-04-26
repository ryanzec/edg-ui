import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button } from '../button/button';
import { ButtonIcon } from '../button/button-icon';
import { Calendar } from './calendar';

/**
 * calendar header component with year/month dropdowns and navigation
 */
@Component({
  selector: 'org-calendar-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ButtonIcon],
  templateUrl: './calendar-header.html',
  styleUrl: './calendar-header.css',
})
export class CalendarHeader {
  /**
   * reference to the parent calendar for shared state and handlers
   */
  protected readonly calendarComponent = inject(Calendar, { host: true });

  /**
   * handles year dropdown change
   */
  protected onYearChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const year = parseInt(target.value, 10);
    this.calendarComponent.onYearChange(year);
  }

  /**
   * handles month dropdown change
   */
  protected onMonthChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const month = parseInt(target.value, 10);
    this.calendarComponent.onMonthChange(month);
  }

  /**
   * handles previous month click
   */
  protected onPreviousClick(): void {
    this.calendarComponent.onPreviousMonth();
  }

  /**
   * handles next month click
   */
  protected onNextClick(): void {
    this.calendarComponent.onNextMonth();
  }
}
