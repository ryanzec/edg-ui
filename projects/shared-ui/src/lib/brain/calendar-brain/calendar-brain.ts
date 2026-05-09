import {
  Directive,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { DateTime } from 'luxon';

/**
 * array of all partial range selection types
 */
export const allCalendarPartialRangeSelectionTypes = ['range', 'onOrBefore', 'onOrAfter'] as const;

/**
 * partial range selection type
 */
export type CalendarPartialRangeSelectionType = (typeof allCalendarPartialRangeSelectionTypes)[number];

/**
 * data structure for a calendar date cell
 */
export type CalendarDateData = {
  date: DateTime;
  isCurrentMonth: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isFocused: boolean;
  isToday: boolean;
};

/**
 * day label data structure with short display text and accessible full name
 */
export type CalendarDayLabel = {
  short: string;
  label: string;
};

/**
 * month option data for the month dropdown
 */
export type CalendarMonthOption = {
  value: number;
  label: string;
};

/** the internal state shape for the calendar brain directive */
type CalendarState = {
  displayYear: number;
  displayMonth: number;
  focusedDate: DateTime | null;
};

// input defaults
export const CALENDAR_DEFAULT_DISPLAY_DATE_DEFAULT = DateTime.now();
export const CALENDAR_START_YEAR_DEFAULT = DateTime.now().year - 100;
export const CALENDAR_END_YEAR_DEFAULT = DateTime.now().year + 20;
export const CALENDAR_SELECTED_START_DATE_DEFAULT: DateTime | undefined = undefined;
export const CALENDAR_SELECTED_END_DATE_DEFAULT: DateTime | undefined = undefined;
export const CALENDAR_ALLOW_RANGE_SELECTION_DEFAULT = false;
export const CALENDAR_ALLOW_PARTIAL_RANGE_SELECTION_DEFAULT = false;
export const CALENDAR_PARTIAL_RANGE_SELECTION_TYPE_DEFAULT: CalendarPartialRangeSelectionType = 'range';
export const CALENDAR_DISABLE_BEFORE_DEFAULT: DateTime | undefined = undefined;
export const CALENDAR_DISABLE_AFTER_DEFAULT: DateTime | undefined = undefined;
export const CALENDAR_ALLOWED_DATE_RANGE_DEFAULT = 0;
export const CALENDAR_ENABLE_DESELECTION_DEFAULT = true;

/**
 * headless brain directive for the calendar component. owns the displayed-month / focused-date state, the
 * date-cell construction, the year / month dropdown options, all date-selection logic (incl. partial-range mode),
 * all keyboard navigation, the live-announcement string for screen readers, and the partial-range-selection-type
 * switching effect that adjusts the selection on type changes.
 *
 * the brain takes the initial display date in its `initializeFromDefaults` lifecycle so the presentation can run
 * it once after the inputs are bound (constructor ordering with hostDirectives is signal-based, so initialization
 * happens during the presentation's constructor / ngAfterViewInit).
 */
@Directive({
  selector: '[orgCalendarBrain]',
  exportAs: 'orgCalendarBrain',
})
export class CalendarBrainDirective {
  private readonly _injector = inject(Injector);
  private readonly _isInitialized = signal<boolean>(false);

  private readonly _state = signal<CalendarState>({
    displayYear: DateTime.now().year,
    displayMonth: DateTime.now().month,
    focusedDate: null,
  });

  private readonly _liveAnnouncementSignal = signal<string>('');

  /** day of week labels with accessible full names */
  public readonly dayLabels: CalendarDayLabel[] = [
    { short: 'S', label: 'Sunday' },
    { short: 'M', label: 'Monday' },
    { short: 'T', label: 'Tuesday' },
    { short: 'W', label: 'Wednesday' },
    { short: 'T', label: 'Thursday' },
    { short: 'F', label: 'Friday' },
    { short: 'S', label: 'Saturday' },
  ];

  /** localized month options for the month selector dropdown */
  public readonly monthOptions: CalendarMonthOption[] = (() => {
    const months: CalendarMonthOption[] = [];

    for (let month = 1; month <= 12; month++) {
      months.push({ value: month, label: DateTime.local(2000, month, 1).toFormat('MMMM') });
    }

    return months;
  })();

  // input properties
  public readonly defaultDisplayDate = input<DateTime>(CALENDAR_DEFAULT_DISPLAY_DATE_DEFAULT);
  public readonly startYear = input<number>(CALENDAR_START_YEAR_DEFAULT);
  public readonly endYear = input<number>(CALENDAR_END_YEAR_DEFAULT);
  public readonly selectedStartDate = input<DateTime | undefined, DateTime | null | undefined>(
    CALENDAR_SELECTED_START_DATE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );
  public readonly selectedEndDate = input<DateTime | undefined, DateTime | null | undefined>(
    CALENDAR_SELECTED_END_DATE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );
  public readonly allowRangeSelection = input<boolean>(CALENDAR_ALLOW_RANGE_SELECTION_DEFAULT);
  public readonly allowPartialRangeSelection = input<boolean>(CALENDAR_ALLOW_PARTIAL_RANGE_SELECTION_DEFAULT);
  public readonly partialRangeSelectionType = input<CalendarPartialRangeSelectionType>(
    CALENDAR_PARTIAL_RANGE_SELECTION_TYPE_DEFAULT
  );
  public readonly disableBefore = input<DateTime | undefined, DateTime | null | undefined>(
    CALENDAR_DISABLE_BEFORE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );
  public readonly disableAfter = input<DateTime | undefined, DateTime | null | undefined>(
    CALENDAR_DISABLE_AFTER_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );
  public readonly allowedDateRange = input<number>(CALENDAR_ALLOWED_DATE_RANGE_DEFAULT);
  public readonly enableDeselection = input<boolean>(CALENDAR_ENABLE_DESELECTION_DEFAULT);

  // outputs
  public readonly dateSelected = output<{ startDate: DateTime | null; endDate: DateTime | null }>();
  public readonly partialRangeSelectionTypeChanged = output<CalendarPartialRangeSelectionType>();
  public readonly displayMonthChanged = output<{
    currentMonth: number;
    currentYear: number;
    previousMonth: number;
    previousYear: number;
  }>();
  public readonly focusContainerRequested = output<void>();

  // computed properties
  public readonly displayYear = computed<number>(() => this._state().displayYear);
  public readonly displayMonth = computed<number>(() => this._state().displayMonth);
  public readonly focusedDate = computed<DateTime | null>(() => this._state().focusedDate);
  public readonly liveAnnouncement = computed<string>(() => this._liveAnnouncementSignal());

  private readonly _effectiveStartYear = computed<number>(() => Math.min(this.startYear(), this.endYear()));

  private readonly _effectiveEndYear = computed<number>(() => Math.max(this.startYear(), this.endYear()));

  private readonly _effectiveAllowedDateRange = computed<number>(() => Math.max(0, this.allowedDateRange()));

  private readonly _effectiveDisableRange = computed<{ before: DateTime | undefined; after: DateTime | undefined }>(
    () => {
      const before = this.disableBefore();
      const after = this.disableAfter();

      if (before && after && before.startOf('day') > after.startOf('day')) {
        return { before: undefined, after: undefined };
      }

      return { before, after };
    }
  );

  /** generates array of years for dropdown */
  public readonly yearOptions = computed<number[]>(() => {
    const start = this._effectiveStartYear();
    const end = this._effectiveEndYear();
    const years: number[] = [];

    for (let year = end; year >= start; year--) {
      years.push(year);
    }

    return years;
  });

  /** generates calendar grid data for the current display month */
  public readonly calendarDates = computed<CalendarDateData[][]>(() => {
    const year = this.displayYear();
    const month = this.displayMonth();
    const startDate = this.selectedStartDate();
    const endDate = this.selectedEndDate();
    const focusedDate = this.focusedDate();
    const { before: disableBefore, after: disableAfter } = this._effectiveDisableRange();
    const allowedRange = this._effectiveAllowedDateRange();
    const today = DateTime.now();

    const firstDayOfMonth = DateTime.local(year, month, 1);
    const startOfGrid = firstDayOfMonth.startOf('week');

    const weeks: CalendarDateData[][] = [];
    let currentDate = startOfGrid;

    for (let week = 0; week < 6; week++) {
      const weekDays: CalendarDateData[] = [];

      for (let day = 0; day < 7; day++) {
        const isCurrentMonth = currentDate.month === month;
        const isDisabled = this._isDateDisabled(
          currentDate,
          startDate,
          endDate,
          disableBefore,
          disableAfter,
          allowedRange
        );
        const isSelected = this._isDateSelected(currentDate, startDate, endDate);
        const isInRange = this._isDateInRange(currentDate, startDate, endDate);
        const isFocused = focusedDate ? currentDate.hasSame(focusedDate, 'day') : false;
        const isToday = currentDate.hasSame(today, 'day');

        weekDays.push({
          date: currentDate,
          isCurrentMonth,
          isDisabled,
          isSelected,
          isInRange,
          isFocused,
          isToday,
        });

        currentDate = currentDate.plus({ days: 1 });
      }

      weeks.push(weekDays);
    }

    return weeks.filter((week) => week.some((dateData) => dateData.isCurrentMonth));
  });

  constructor() {
    // inputs are available synchronously on signal-based components
    const initialDate = this.selectedStartDate() ?? this.defaultDisplayDate();

    this._state.update((state) => ({
      ...state,
      displayYear: initialDate.year,
      displayMonth: initialDate.month,
      focusedDate: initialDate,
    }));

    afterNextRender(
      () => {
        this._isInitialized.set(true);
      },
      { injector: this._injector }
    );

    // handle partial range selection type switching
    effect(() => {
      const selectionType = this.partialRangeSelectionType();
      const allowPartial = this.allowPartialRangeSelection();
      const allowRange = this.allowRangeSelection();

      if (!allowPartial || !allowRange) {
        return;
      }

      if (!untracked(() => this._isInitialized())) {
        return;
      }

      untracked(() => {
        const currentStart = this.selectedStartDate();
        const currentEnd = this.selectedEndDate();

        if (!currentStart && !currentEnd) {
          return;
        }

        let newStart: DateTime | null = currentStart ?? null;
        let newEnd: DateTime | null = currentEnd ?? null;

        if (selectionType === 'range') {
          if (currentStart && !currentEnd) {
            newStart = currentStart;
            newEnd = null;
          } else if (!currentStart && currentEnd) {
            newStart = currentEnd.startOf('day');
            newEnd = null;
          }
        } else if (selectionType === 'onOrAfter') {
          if (currentStart && currentEnd) {
            newStart = currentStart;
            newEnd = null;
          } else if (!currentStart && currentEnd) {
            newStart = currentEnd.startOf('day');
            newEnd = null;
          }
        } else if (selectionType === 'onOrBefore') {
          if (currentStart && currentEnd) {
            newStart = null;
            newEnd = currentEnd;
          } else if (currentStart && !currentEnd) {
            newStart = null;
            newEnd = currentStart.endOf('day');
          }
        }

        const needsUpdate =
          newStart?.toMillis() !== currentStart?.toMillis() || newEnd?.toMillis() !== currentEnd?.toMillis();

        if (needsUpdate) {
          afterNextRender(
            () => {
              this.dateSelected.emit({ startDate: newStart, endDate: newEnd });
            },
            { injector: this._injector }
          );
        }
      });
    });
  }

  /** sets the current display date */
  public setDisplayDate(date: DateTime): void {
    const previousYear = this._state().displayYear;
    const previousMonth = this._state().displayMonth;

    this._state.update((state) => ({
      ...state,
      displayYear: date.year,
      displayMonth: date.month,
    }));

    this._liveAnnouncementSignal.set(date.toFormat('MMMM yyyy'));

    this.displayMonthChanged.emit({
      currentMonth: date.month,
      currentYear: date.year,
      previousMonth,
      previousYear,
    });
  }

  /** handles year change from the year dropdown */
  public onYearChange(year: number): void {
    const previousYear = this._state().displayYear;
    const previousMonth = this._state().displayMonth;

    this._state.update((state) => ({
      ...state,
      displayYear: year,
    }));

    const currentMonth = this._state().displayMonth;

    this._liveAnnouncementSignal.set(DateTime.local(year, currentMonth, 1).toFormat('MMMM yyyy'));

    this.displayMonthChanged.emit({
      currentMonth,
      currentYear: year,
      previousMonth,
      previousYear,
    });
  }

  /** handles month change from the month dropdown */
  public onMonthChange(month: number): void {
    const previousYear = this._state().displayYear;
    const previousMonth = this._state().displayMonth;

    this._state.update((state) => ({
      ...state,
      displayMonth: month,
    }));

    const currentYear = this._state().displayYear;

    this._liveAnnouncementSignal.set(DateTime.local(currentYear, month, 1).toFormat('MMMM yyyy'));

    this.displayMonthChanged.emit({
      currentMonth: month,
      currentYear,
      previousMonth,
      previousYear,
    });
  }

  /** navigates to the previous month */
  public onPreviousMonth(): void {
    const currentYear = this._state().displayYear;
    const currentMonth = this._state().displayMonth;

    const newDate = DateTime.local(currentYear, currentMonth, 1).minus({ months: 1 });

    this._state.update((state) => ({
      ...state,
      displayYear: newDate.year,
      displayMonth: newDate.month,
    }));

    this._liveAnnouncementSignal.set(newDate.toFormat('MMMM yyyy'));

    this.displayMonthChanged.emit({
      currentMonth: newDate.month,
      currentYear: newDate.year,
      previousMonth: currentMonth,
      previousYear: currentYear,
    });
  }

  /** navigates to the next month */
  public onNextMonth(): void {
    const currentYear = this._state().displayYear;
    const currentMonth = this._state().displayMonth;

    const newDate = DateTime.local(currentYear, currentMonth, 1).plus({ months: 1 });

    this._state.update((state) => ({
      ...state,
      displayYear: newDate.year,
      displayMonth: newDate.month,
    }));

    this._liveAnnouncementSignal.set(newDate.toFormat('MMMM yyyy'));

    this.displayMonthChanged.emit({
      currentMonth: newDate.month,
      currentYear: newDate.year,
      previousMonth: currentMonth,
      previousYear: currentYear,
    });
  }

  /** handles date selection click */
  public onDateClick(dateData: CalendarDateData): void {
    if (dateData.isDisabled) {
      return;
    }

    const clickedDate = dateData.date;
    const currentStart = this.selectedStartDate() ?? null;
    const currentEnd = this.selectedEndDate() ?? null;
    const selectionType = this.partialRangeSelectionType();

    if (this.enableDeselection()) {
      if (currentStart && clickedDate.hasSame(currentStart, 'day')) {
        this.dateSelected.emit({ startDate: null, endDate: currentEnd });

        return;
      }

      if (currentEnd && clickedDate.hasSame(currentEnd, 'day')) {
        this.dateSelected.emit({ startDate: currentStart, endDate: null });

        return;
      }
    }

    if (this.allowRangeSelection() && this.allowPartialRangeSelection()) {
      if (selectionType === 'onOrAfter') {
        const startDate = clickedDate.startOf('day');
        this.dateSelected.emit({ startDate, endDate: null });

        return;
      }

      if (selectionType === 'onOrBefore') {
        const endDate = clickedDate.endOf('day');
        this.dateSelected.emit({ startDate: null, endDate });

        return;
      }
    }

    if (!currentStart) {
      const startDate = clickedDate.startOf('day');
      this.dateSelected.emit({ startDate, endDate: currentEnd });

      return;
    }

    if (!currentEnd) {
      if (this.allowRangeSelection()) {
        if (clickedDate > currentStart) {
          const endDate = clickedDate.endOf('day');
          this.dateSelected.emit({ startDate: currentStart, endDate });
        } else if (clickedDate < currentStart) {
          const startDate = clickedDate.startOf('day');
          const endDate = currentStart.endOf('day');
          this.dateSelected.emit({ startDate, endDate });
        } else {
          const startDate = clickedDate.startOf('day');
          const endDate = clickedDate.endOf('day');
          this.dateSelected.emit({ startDate, endDate });
        }
      } else {
        const startDate = clickedDate.startOf('day');
        this.dateSelected.emit({ startDate, endDate: null });
      }

      return;
    }

    if (this.allowRangeSelection()) {
      if (clickedDate > currentStart && clickedDate < currentEnd) {
        const endDate = clickedDate.endOf('day');
        this.dateSelected.emit({ startDate: currentStart, endDate });

        return;
      }

      if (clickedDate > currentStart) {
        const endDate = clickedDate.endOf('day');
        this.dateSelected.emit({ startDate: currentStart, endDate });

        return;
      }

      if (clickedDate < currentStart) {
        const startDate = clickedDate.startOf('day');
        const endDate = currentStart.endOf('day');
        this.dateSelected.emit({ startDate, endDate });
      }
    }
  }

  /** handles keyboard navigation */
  public onKeyDown(event: KeyboardEvent): void {
    const currentFocused = this.focusedDate();

    if (!currentFocused) {
      return;
    }

    let newFocused: DateTime | null = null;

    const selectCurrentDate = () => {
      event.preventDefault();
      const dateData = this._findDateData(currentFocused);

      if (dateData) {
        this.onDateClick(dateData);
      }
    };

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newFocused = currentFocused.minus({ days: 1 });
        break;
      case 'ArrowRight':
        event.preventDefault();
        newFocused = currentFocused.plus({ days: 1 });
        break;
      case 'ArrowUp':
        event.preventDefault();
        newFocused = currentFocused.minus({ weeks: 1 });
        break;
      case 'ArrowDown':
        event.preventDefault();
        newFocused = currentFocused.plus({ weeks: 1 });
        break;
      case 'PageUp':
        event.preventDefault();
        newFocused = currentFocused.minus({ months: 1 });
        break;
      case 'PageDown':
        event.preventDefault();
        newFocused = currentFocused.plus({ months: 1 });
        break;
      case 'Home':
        event.preventDefault();
        newFocused = currentFocused.startOf('month');
        break;
      case 'End':
        event.preventDefault();
        newFocused = currentFocused.endOf('month');
        break;

      case 'Enter':
      case ' ':
        selectCurrentDate();

        return;
    }

    if (!newFocused) {
      return;
    }

    this._state.update((state) => ({
      ...state,
      focusedDate: newFocused,
    }));

    if (newFocused.month !== this._state().displayMonth || newFocused.year !== this._state().displayYear) {
      const previousYear = this._state().displayYear;
      const previousMonth = this._state().displayMonth;

      this._state.update((state) => ({
        ...state,
        displayYear: newFocused!.year,
        displayMonth: newFocused!.month,
      }));

      this._liveAnnouncementSignal.set(newFocused.toFormat('MMMM yyyy'));

      this.displayMonthChanged.emit({
        currentMonth: newFocused.month,
        currentYear: newFocused.year,
        previousMonth,
        previousYear,
      });

      afterNextRender(
        () => {
          this.focusContainerRequested.emit();
        },
        { injector: this._injector }
      );
    }
  }

  /** updates focused date when a date is hovered */
  public onDateHover(dateData: CalendarDateData): void {
    this._state.update((state) => ({
      ...state,
      focusedDate: dateData.date,
    }));
  }

  /** handles partial range selection type change from the radio group */
  public onPartialRangeSelectionTypeChange(type: string): void {
    if (allCalendarPartialRangeSelectionTypes.includes(type as CalendarPartialRangeSelectionType)) {
      this.partialRangeSelectionTypeChanged.emit(type as CalendarPartialRangeSelectionType);
    }
  }

  /** checks if a date is disabled */
  private _isDateDisabled(
    date: DateTime,
    startDate: DateTime | undefined,
    endDate: DateTime | undefined,
    disableBefore: DateTime | undefined,
    disableAfter: DateTime | undefined,
    allowedRange: number
  ): boolean {
    if (disableBefore && date < disableBefore.startOf('day')) {
      return true;
    }

    if (disableAfter && date > disableAfter.startOf('day')) {
      return true;
    }

    if (allowedRange > 0) {
      if (startDate && !endDate) {
        const rangeStart = startDate.startOf('day');
        const rangeEnd = rangeStart.plus({ days: allowedRange - 1 }).endOf('day');
        const rangeStartBackward = rangeStart.minus({ days: allowedRange - 1 }).startOf('day');

        if (date > rangeEnd || date < rangeStartBackward) {
          return true;
        }
      } else if (!startDate && endDate) {
        const rangeEnd = endDate.startOf('day');
        const rangeEndForward = rangeEnd.plus({ days: allowedRange - 1 }).endOf('day');
        const rangeEndBackward = rangeEnd.minus({ days: allowedRange - 1 }).startOf('day');

        if (date > rangeEndForward || date < rangeEndBackward) {
          return true;
        }
      } else if (startDate && endDate) {
        const rangeStart = startDate.startOf('day');
        const rangeEnd = endDate.startOf('day');
        const allowedAfterStart = rangeStart.plus({ days: allowedRange - 1 }).endOf('day');
        const allowedBeforeEnd = rangeEnd.minus({ days: allowedRange - 1 }).startOf('day');

        const withinStartRange = date >= rangeStart && date <= allowedAfterStart;
        const withinEndRange = date >= allowedBeforeEnd && date <= rangeEnd;

        if (!withinStartRange && !withinEndRange) {
          return true;
        }
      }
    }

    return false;
  }

  /** checks if a date is selected (matches start or end) */
  private _isDateSelected(date: DateTime, startDate: DateTime | undefined, endDate: DateTime | undefined): boolean {
    if (startDate && date.hasSame(startDate, 'day')) {
      return true;
    }

    if (endDate && date.hasSame(endDate, 'day')) {
      return true;
    }

    return false;
  }

  /** checks if a date is strictly inside the selected range */
  private _isDateInRange(date: DateTime, startDate: DateTime | undefined, endDate: DateTime | undefined): boolean {
    if (!startDate || !endDate) {
      return false;
    }

    return date > startDate && date < endDate;
  }

  /** finds date data for a given date in the current calendar grid */
  private _findDateData(date: DateTime): CalendarDateData | null {
    const weeks = this.calendarDates();

    for (const week of weeks) {
      for (const dateData of week) {
        if (dateData.date.hasSame(date, 'day')) {
          return dateData;
        }
      }
    }

    return null;
  }
}
