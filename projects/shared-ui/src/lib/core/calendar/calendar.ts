import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  ViewChild,
  ElementRef,
  inject,
  Injector,
} from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { DateTime } from 'luxon';
import { CalendarHeader } from './calendar-header';
import { CalendarDates } from './calendar-dates';
import { CalendarPartialRangeSelector } from './calendar-partial-range-selector';
import {
  CalendarBrainDirective,
  type CalendarDateData as BrainCalendarDateData,
  type CalendarPartialRangeSelectionType as BrainCalendarPartialRangeSelectionType,
} from '../../brain/calendar-brain/calendar-brain';

/**
 * array of all partial range selection types
 */
export const allPartialRangeSelectionTypes = ['range', 'onOrBefore', 'onOrAfter'] as const;

/**
 * partial range selection type
 */
export type CalendarPartialRangeSelectionType = BrainCalendarPartialRangeSelectionType;

/**
 * data structure for a calendar date cell
 */
export type CalendarDateData = BrainCalendarDateData;

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
export const CALENDAR_CONTAINER_CLASS_DEFAULT = '';

/**
 * calendar component for date selection with range support
 */
@Component({
  selector: 'org-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarHeader, CalendarDates, CalendarPartialRangeSelector],
  templateUrl: './calendar.html',
  hostDirectives: [
    {
      directive: CalendarBrainDirective,
      inputs: [
        'defaultDisplayDate',
        'startYear',
        'endYear',
        'selectedStartDate',
        'selectedEndDate',
        'allowRangeSelection',
        'allowPartialRangeSelection',
        'partialRangeSelectionType',
        'disableBefore',
        'disableAfter',
        'allowedDateRange',
        'enableDeselection',
      ],
      outputs: [
        'dateSelected',
        'partialRangeSelectionTypeChanged: partialRangeSelectionTypeChange',
        'displayMonthChanged',
      ],
    },
  ],
  styleUrl: './calendar.css',
  host: {
    '[attr.data-allow-range-selection]': 'allowRangeSelection() ? "" : null',
    '[attr.data-allow-partial-range-selection]': 'allowPartialRangeSelection() ? "" : null',
    '[attr.data-partial-range-selection-type]': 'partialRangeSelectionType()',
    '[attr.data-enable-deselection]': 'enableDeselection() ? "" : null',
  },
})
export class Calendar {
  private readonly _injector = inject(Injector);
  protected readonly brain = inject(CalendarBrainDirective, { self: true });

  @ViewChild('calendarContainerRef')
  public readonly calendarContainerRef?: ElementRef<HTMLDivElement>;

  // input properties (mapped through to the brain via hostDirectives)
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
  public readonly containerClass = input<string>(CALENDAR_CONTAINER_CLASS_DEFAULT);

  // output events (mapped through to the brain via hostDirectives, but redeclared so consumers see them on Calendar)
  public readonly dateSelected = output<{ startDate: DateTime | null; endDate: DateTime | null }>();
  public readonly partialRangeSelectionTypeChange = output<CalendarPartialRangeSelectionType>();
  public readonly displayMonthChanged = output<{
    currentMonth: number;
    currentYear: number;
    previousMonth: number;
    previousYear: number;
  }>();

  // computed properties (proxied from the brain)
  public readonly displayYear = computed<number>(() => this.brain.displayYear());
  public readonly displayMonth = computed<number>(() => this.brain.displayMonth());
  public readonly focusedDate = computed<DateTime | null>(() => this.brain.focusedDate());
  public readonly yearOptions = computed<number[]>(() => this.brain.yearOptions());
  public readonly calendarDates = computed<CalendarDateData[][]>(() => this.brain.calendarDates());

  /** show partial range selection type when both range selection and partial range selection are enabled */
  public readonly showPartialRangeSelectionType = computed<boolean>(() => {
    return this.allowRangeSelection() && this.allowPartialRangeSelection();
  });

  /** generates array of months for dropdown */
  public readonly monthOptions: CalendarMonthOption[] = (() => {
    const months: CalendarMonthOption[] = [];

    for (let month = 1; month <= 12; month++) {
      const date = DateTime.local(2000, month, 1);
      months.push({ value: month, label: date.toFormat('MMMM') });
    }

    return months;
  })();

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

  /** live region announcement text for screen readers when the displayed month changes (proxied from brain) */
  protected readonly _liveAnnouncement = computed<string>(() => this.brain.liveAnnouncement());

  constructor() {
    // when the brain requests container focus (typically after keyboard nav crossed a month boundary), apply it
    this.brain.focusContainerRequested.subscribe(() => {
      this.calendarContainerRef?.nativeElement.focus();
    });
  }

  /**
   * public api: set the current display date (delegates to the brain)
   */
  public setDisplayDate(date: DateTime): void {
    this.brain.setDisplayDate(date);
  }

  /** handles year change from dropdown */
  public onYearChange(year: number): void {
    this.brain.onYearChange(year);
  }

  /** handles month change from dropdown */
  public onMonthChange(month: number): void {
    this.brain.onMonthChange(month);
  }

  /** handles previous month navigation */
  public onPreviousMonth(): void {
    this.brain.onPreviousMonth();
  }

  /** handles next month navigation */
  public onNextMonth(): void {
    this.brain.onNextMonth();
  }

  /** handles date click */
  public onDateClick(dateData: CalendarDateData): void {
    this.brain.onDateClick(dateData);
  }

  /** updates focused date when date is hovered */
  public onDateHover(dateData: CalendarDateData): void {
    this.brain.onDateHover(dateData);
  }

  /** handles partial range selection type change from radio group */
  public onPartialRangeSelectionTypeChange(type: string): void {
    this.brain.onPartialRangeSelectionTypeChange(type);
  }

  /** handles keyboard navigation */
  protected onKeyDown(event: KeyboardEvent): void {
    this.brain.onKeyDown(event);
  }
}
