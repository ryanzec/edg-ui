import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Button } from '../button/button';
import { DropDownSelector } from '../drop-down-selector/drop-down-selector';
import { type SelectionValue } from '../drop-down-selector/drop-down-selector-brain';
import { Calendar } from './calendar';

/**
 * calendar header component with month / year drop-down selectors and previous / next navigation buttons
 */
@Component({
  selector: 'org-calendar-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DropDownSelector],
  templateUrl: './calendar-header.html',
  styleUrl: './calendar-header.css',
})
export class CalendarHeader {
  /**
   * reference to the parent calendar for shared state and handlers
   */
  protected readonly calendarComponent = inject(Calendar);

  /** the month items rendered in the month drop-down selector */
  protected readonly monthItems = computed<SelectionValue<number>[]>(() =>
    this.calendarComponent.monthOptions.map((option) => ({ value: option.value, display: option.label }))
  );

  /** the year items rendered in the year drop-down selector */
  protected readonly yearItems = computed<SelectionValue<number>[]>(() =>
    this.calendarComponent.yearOptions().map((year) => ({ value: year, display: year.toString() }))
  );

  /** the currently selected month item (single-element array) for the month drop-down selector */
  protected readonly selectedMonthItems = computed<SelectionValue<number>[]>(() => {
    const current = this.calendarComponent.displayMonth();
    const item = this.monthItems().find((option) => option.value === current);

    return item ? [item] : [];
  });

  /** the currently selected year item (single-element array) for the year drop-down selector */
  protected readonly selectedYearItems = computed<SelectionValue<number>[]>(() => {
    const current = this.calendarComponent.displayYear();
    const item = this.yearItems().find((option) => option.value === current);

    return item ? [item] : [];
  });

  /**
   * handles month selector change
   */
  protected onMonthChanged(items: SelectionValue<number>[]): void {
    if (items.length === 0) {
      return;
    }

    this.calendarComponent.onMonthChange(items[0].value);
  }

  /**
   * handles year selector change
   */
  protected onYearChanged(items: SelectionValue<number>[]): void {
    if (items.length === 0) {
      return;
    }

    this.calendarComponent.onYearChange(items[0].value);
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
