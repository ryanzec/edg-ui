import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';
import { afterEach, describe, it, expect, vi } from 'vitest';

import {
  CALENDAR_DEFAULT_DISPLAY_DATE_DEFAULT,
  CalendarBrainDirective,
  type CalendarDateData,
  type CalendarPartialRangeSelectionType,
} from './calendar-brain';

// the brain reads its initial state from its own default input value because signal-based inputs are not bound
// at construction time. anchoring test dates to that default keeps every assertion stable regardless of when
// the suite is run.
const ANCHOR = CALENDAR_DEFAULT_DISPLAY_DATE_DEFAULT.set({ day: 15 });
const DAY = (day: number): DateTime => ANCHOR.set({ day });

@Component({
  selector: 'test-calendar-brain-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarBrainDirective],
  template: `
    <div
      orgCalendarBrain
      #brainDirective="orgCalendarBrain"
      [startYear]="startYear()"
      [endYear]="endYear()"
      [selectedStartDate]="selectedStartDate()"
      [selectedEndDate]="selectedEndDate()"
      [allowRangeSelection]="allowRangeSelection()"
      [allowPartialRangeSelection]="allowPartialRangeSelection()"
      [partialRangeSelectionType]="partialRangeSelectionType()"
      [disableBefore]="disableBefore()"
      [disableAfter]="disableAfter()"
      [allowedDateRange]="allowedDateRange()"
      [enableDeselection]="enableDeselection()"
      [disabled]="disabled()"
      (dateSelected)="onDateSelected($event)"
      (partialRangeSelectionTypeChanged)="onPartialRangeSelectionTypeChanged($event)"
      (displayMonthChanged)="onDisplayMonthChanged($event)"
      (focusContainerRequested)="onFocusContainerRequested()"
    ></div>
  `,
})
class CalendarBrainHost {
  public readonly startYear = signal<number>(ANCHOR.year - 5);
  public readonly endYear = signal<number>(ANCHOR.year + 5);
  public readonly selectedStartDate = signal<DateTime | null | undefined>(undefined);
  public readonly selectedEndDate = signal<DateTime | null | undefined>(undefined);
  public readonly allowRangeSelection = signal<boolean>(false);
  public readonly allowPartialRangeSelection = signal<boolean>(false);
  public readonly partialRangeSelectionType = signal<CalendarPartialRangeSelectionType>('range');
  public readonly disableBefore = signal<DateTime | null | undefined>(undefined);
  public readonly disableAfter = signal<DateTime | null | undefined>(undefined);
  public readonly allowedDateRange = signal<number>(0);
  public readonly enableDeselection = signal<boolean>(true);
  public readonly disabled = signal<boolean>(false);

  public onDateSelected = vi.fn<(event: { startDate: DateTime | null; endDate: DateTime | null }) => void>();
  public onPartialRangeSelectionTypeChanged = vi.fn<(value: CalendarPartialRangeSelectionType) => void>();
  public onDisplayMonthChanged =
    vi.fn<
      (event: { currentMonth: number; currentYear: number; previousMonth: number; previousYear: number }) => void
    >();
  public onFocusContainerRequested = vi.fn();

  public readonly brainDirective = viewChild.required<CalendarBrainDirective>('brainDirective');
}

const createHost = async (
  setup?: (host: CalendarBrainHost) => void
): Promise<{
  fixture: ComponentFixture<CalendarBrainHost>;
  host: CalendarBrainHost;
  brain: CalendarBrainDirective;
}> => {
  await TestBed.configureTestingModule({
    imports: [CalendarBrainHost],
  }).compileComponents();

  const fixture = TestBed.createComponent(CalendarBrainHost);
  const host = fixture.componentInstance;

  setup?.(host);

  fixture.detectChanges();
  await fixture.whenStable();

  return { fixture, host, brain: host.brainDirective() };
};

const findDateInGrid = (brain: CalendarBrainDirective, target: DateTime): CalendarDateData => {
  for (const week of brain.calendarDates()) {
    for (const cell of week) {
      if (cell.date.hasSame(target, 'day')) {
        return cell;
      }
    }
  }

  throw new Error(`could not find ${target.toISO()} in the current grid`);
};

const focusDate = async (
  brain: CalendarBrainDirective,
  fixture: ComponentFixture<CalendarBrainHost>,
  date: DateTime
): Promise<void> => {
  const cell = findDateInGrid(brain, date);

  brain.onDateHover(cell);
  fixture.detectChanges();
  await fixture.whenStable();
};

describe('CalendarBrainDirective', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('initializes displayYear, displayMonth, and focusedDate from the default display date', async () => {
      const { brain } = await createHost();

      expect(brain.displayYear()).toBe(CALENDAR_DEFAULT_DISPLAY_DATE_DEFAULT.year);
      expect(brain.displayMonth()).toBe(CALENDAR_DEFAULT_DISPLAY_DATE_DEFAULT.month);
      expect(brain.focusedDate()).not.toBeNull();
    });
  });

  describe('static day and month data', () => {
    it('exposes 7 day labels in Sunday-Saturday order', async () => {
      const { brain } = await createHost();

      expect(brain.dayLabels).toHaveLength(7);
      expect(brain.dayLabels[0].label).toBe('Sunday');
      expect(brain.dayLabels[6].label).toBe('Saturday');
    });

    it('exposes 12 month options labeled January through December', async () => {
      const { brain } = await createHost();

      expect(brain.monthOptions).toHaveLength(12);
      expect(brain.monthOptions[0]).toEqual({ value: 1, label: 'January' });
      expect(brain.monthOptions[11]).toEqual({ value: 12, label: 'December' });
    });
  });

  describe('yearOptions', () => {
    it('generates years in descending order from endYear to startYear', async () => {
      const { brain } = await createHost((host) => {
        host.startYear.set(2020);
        host.endYear.set(2023);
      });

      expect(brain.yearOptions()).toEqual([2023, 2022, 2021, 2020]);
    });

    it('swaps start and end when startYear is greater than endYear', async () => {
      const { brain } = await createHost((host) => {
        host.startYear.set(2025);
        host.endYear.set(2022);
      });

      expect(brain.yearOptions()).toEqual([2025, 2024, 2023, 2022]);
    });
  });

  describe('calendarDates', () => {
    it('marks isCurrentMonth false for spillover dates from adjacent months', async () => {
      const { brain } = await createHost();

      const grid = brain.calendarDates();
      const flat = grid.flat();
      const inMonth = flat.filter((cell) => cell.isCurrentMonth);
      const outMonth = flat.filter((cell) => !cell.isCurrentMonth);

      expect(inMonth.length).toBe(ANCHOR.daysInMonth);
      expect(outMonth.length).toBeGreaterThan(0);
    });

    it('marks isSelected for the selected start and end dates', async () => {
      const start = DAY(5);
      const end = DAY(20);
      const { brain } = await createHost((host) => {
        host.selectedStartDate.set(start);
        host.selectedEndDate.set(end);
        host.allowRangeSelection.set(true);
      });

      expect(findDateInGrid(brain, start).isSelected).toBe(true);
      expect(findDateInGrid(brain, end).isSelected).toBe(true);
      expect(findDateInGrid(brain, DAY(10)).isSelected).toBe(false);
    });

    it('marks isInRange only for dates strictly between start and end', async () => {
      const start = DAY(5).startOf('day');
      const end = DAY(10).startOf('day');
      const { brain } = await createHost((host) => {
        host.selectedStartDate.set(start);
        host.selectedEndDate.set(end);
        host.allowRangeSelection.set(true);
      });

      expect(findDateInGrid(brain, DAY(7)).isInRange).toBe(true);
      expect(findDateInGrid(brain, start).isInRange).toBe(false);
      expect(findDateInGrid(brain, end).isInRange).toBe(false);
    });

    it('computes rangePos start, middle, and end for a committed range', async () => {
      const start = DAY(5);
      const end = DAY(10);
      const { brain } = await createHost((host) => {
        host.selectedStartDate.set(start);
        host.selectedEndDate.set(end);
        host.allowRangeSelection.set(true);
      });

      expect(findDateInGrid(brain, start).rangePos).toBe('start');
      expect(findDateInGrid(brain, end).rangePos).toBe('end');
      expect(findDateInGrid(brain, DAY(7)).rangePos).toBe('middle');
    });

    it('computes rangePos single for a same-day start and end selection', async () => {
      const sameDay = DAY(5);
      const { brain } = await createHost((host) => {
        host.selectedStartDate.set(sameDay);
        host.selectedEndDate.set(sameDay);
        host.allowRangeSelection.set(true);
      });

      expect(findDateInGrid(brain, sameDay).rangePos).toBe('single');
    });

    it('computes preview rangePos when hovering after the start in range mode', async () => {
      const start = DAY(5);
      const hover = DAY(10);
      const { brain } = await createHost((host) => {
        host.selectedStartDate.set(start);
        host.allowRangeSelection.set(true);
      });

      brain.onDateHover(findDateInGrid(brain, hover));

      expect(findDateInGrid(brain, start).rangePos).toBe('start');
      expect(findDateInGrid(brain, hover).rangePos).toBe('preview-end');
      expect(findDateInGrid(brain, DAY(7)).rangePos).toBe('preview');
    });

    it('computes preview rangePos when hovering before the start in range mode', async () => {
      const start = DAY(15);
      const hover = DAY(10);
      const { brain } = await createHost((host) => {
        host.selectedStartDate.set(start);
        host.allowRangeSelection.set(true);
      });

      brain.onDateHover(findDateInGrid(brain, hover));

      expect(findDateInGrid(brain, start).rangePos).toBe('end');
      expect(findDateInGrid(brain, hover).rangePos).toBe('preview-start');
      expect(findDateInGrid(brain, DAY(12)).rangePos).toBe('preview');
    });
  });

  describe('disabled date flags', () => {
    it('disables dates before disableBefore', async () => {
      const { brain } = await createHost((host) => {
        host.disableBefore.set(DAY(10));
      });

      expect(findDateInGrid(brain, DAY(9)).isDisabled).toBe(true);
      expect(findDateInGrid(brain, DAY(10)).isDisabled).toBe(false);
      expect(findDateInGrid(brain, DAY(11)).isDisabled).toBe(false);
    });

    it('disables dates after disableAfter', async () => {
      const { brain } = await createHost((host) => {
        host.disableAfter.set(DAY(20));
      });

      expect(findDateInGrid(brain, DAY(19)).isDisabled).toBe(false);
      expect(findDateInGrid(brain, DAY(20)).isDisabled).toBe(false);
      expect(findDateInGrid(brain, DAY(21)).isDisabled).toBe(true);
    });

    it('ignores the disable range entirely when before is after the after value', async () => {
      const { brain } = await createHost((host) => {
        host.disableBefore.set(DAY(20));
        host.disableAfter.set(DAY(10));
      });

      expect(findDateInGrid(brain, DAY(1)).isDisabled).toBe(false);
      expect(findDateInGrid(brain, DAY(15)).isDisabled).toBe(false);
      expect(findDateInGrid(brain, DAY(25)).isDisabled).toBe(false);
    });

    it('disables dates outside the allowedDateRange window when only start is set', async () => {
      const start = DAY(10);
      const { brain } = await createHost((host) => {
        host.selectedStartDate.set(start);
        host.allowedDateRange.set(3);
      });

      expect(findDateInGrid(brain, DAY(12)).isDisabled).toBe(false);
      expect(findDateInGrid(brain, DAY(13)).isDisabled).toBe(true);
      expect(findDateInGrid(brain, DAY(8)).isDisabled).toBe(false);
      expect(findDateInGrid(brain, DAY(7)).isDisabled).toBe(true);
    });

    it('disables dates outside the allowedDateRange window when only end is set', async () => {
      const end = DAY(20);
      const { brain } = await createHost((host) => {
        host.selectedEndDate.set(end);
        host.allowedDateRange.set(3);
      });

      expect(findDateInGrid(brain, DAY(18)).isDisabled).toBe(false);
      expect(findDateInGrid(brain, DAY(17)).isDisabled).toBe(true);
      expect(findDateInGrid(brain, DAY(22)).isDisabled).toBe(false);
      expect(findDateInGrid(brain, DAY(23)).isDisabled).toBe(true);
    });

    it('disables dates outside the allowedDateRange windows when both start and end are set', async () => {
      const start = DAY(10);
      const end = DAY(20);
      const { brain } = await createHost((host) => {
        host.selectedStartDate.set(start);
        host.selectedEndDate.set(end);
        host.allowedDateRange.set(2);
        host.allowRangeSelection.set(true);
      });

      expect(findDateInGrid(brain, DAY(10)).isDisabled).toBe(false);
      expect(findDateInGrid(brain, DAY(11)).isDisabled).toBe(false);
      expect(findDateInGrid(brain, DAY(15)).isDisabled).toBe(true);
      expect(findDateInGrid(brain, DAY(19)).isDisabled).toBe(false);
      expect(findDateInGrid(brain, DAY(20)).isDisabled).toBe(false);
    });
  });

  describe('setDisplayDate', () => {
    it('updates displayYear, displayMonth, and liveAnnouncement', async () => {
      const target = DateTime.local(2025, 11, 1);
      const { brain } = await createHost();

      brain.setDisplayDate(target);

      expect(brain.displayYear()).toBe(2025);
      expect(brain.displayMonth()).toBe(11);
      expect(brain.liveAnnouncement()).toBe('November 2025');
    });

    it('emits displayMonthChanged with previous and current values', async () => {
      const target = DateTime.local(2025, 11, 1);
      const { brain, host } = await createHost();
      const previousMonth = brain.displayMonth();
      const previousYear = brain.displayYear();
      host.onDisplayMonthChanged.mockClear();

      brain.setDisplayDate(target);

      expect(host.onDisplayMonthChanged).toHaveBeenCalledWith({
        currentMonth: 11,
        currentYear: 2025,
        previousMonth,
        previousYear,
      });
    });

    it('is a no-op when disabled', async () => {
      const target = DateTime.local(2025, 11, 1);
      const { brain, host } = await createHost((h) => h.disabled.set(true));
      const previousMonth = brain.displayMonth();
      const previousYear = brain.displayYear();
      host.onDisplayMonthChanged.mockClear();

      brain.setDisplayDate(target);

      expect(brain.displayMonth()).toBe(previousMonth);
      expect(brain.displayYear()).toBe(previousYear);
      expect(host.onDisplayMonthChanged).not.toHaveBeenCalled();
    });
  });

  describe('onYearChange', () => {
    it('updates displayYear and emits displayMonthChanged', async () => {
      const { brain, host } = await createHost();
      const previousYear = brain.displayYear();
      host.onDisplayMonthChanged.mockClear();

      brain.onYearChange(2027);

      expect(brain.displayYear()).toBe(2027);
      expect(host.onDisplayMonthChanged).toHaveBeenCalledWith(
        expect.objectContaining({ currentYear: 2027, previousYear })
      );
    });

    it('is a no-op when disabled', async () => {
      const { brain, host } = await createHost((h) => h.disabled.set(true));
      const previousYear = brain.displayYear();
      host.onDisplayMonthChanged.mockClear();

      brain.onYearChange(2027);

      expect(brain.displayYear()).toBe(previousYear);
      expect(host.onDisplayMonthChanged).not.toHaveBeenCalled();
    });
  });

  describe('onMonthChange', () => {
    it('updates displayMonth and emits displayMonthChanged', async () => {
      const { brain, host } = await createHost();
      const previousMonth = brain.displayMonth();
      const targetMonth = previousMonth === 1 ? 12 : 1;
      host.onDisplayMonthChanged.mockClear();

      brain.onMonthChange(targetMonth);

      expect(brain.displayMonth()).toBe(targetMonth);
      expect(host.onDisplayMonthChanged).toHaveBeenCalledWith(
        expect.objectContaining({ currentMonth: targetMonth, previousMonth })
      );
    });

    it('is a no-op when disabled', async () => {
      const { brain, host } = await createHost((h) => h.disabled.set(true));
      const previousMonth = brain.displayMonth();
      host.onDisplayMonthChanged.mockClear();

      brain.onMonthChange(previousMonth === 1 ? 12 : 1);

      expect(brain.displayMonth()).toBe(previousMonth);
      expect(host.onDisplayMonthChanged).not.toHaveBeenCalled();
    });
  });

  describe('onPreviousMonth', () => {
    it('moves the display back one month', async () => {
      const { brain } = await createHost();
      const expected = DateTime.local(brain.displayYear(), brain.displayMonth(), 1).minus({ months: 1 });

      brain.onPreviousMonth();

      expect(brain.displayMonth()).toBe(expected.month);
      expect(brain.displayYear()).toBe(expected.year);
    });

    it('crosses the year boundary when going back from January', async () => {
      const { brain } = await createHost();
      brain.setDisplayDate(DateTime.local(2024, 1, 15));

      brain.onPreviousMonth();

      expect(brain.displayMonth()).toBe(12);
      expect(brain.displayYear()).toBe(2023);
    });

    it('is a no-op when disabled', async () => {
      const { brain } = await createHost((host) => host.disabled.set(true));
      const previousMonth = brain.displayMonth();

      brain.onPreviousMonth();

      expect(brain.displayMonth()).toBe(previousMonth);
    });
  });

  describe('onNextMonth', () => {
    it('moves the display forward one month', async () => {
      const { brain } = await createHost();
      const expected = DateTime.local(brain.displayYear(), brain.displayMonth(), 1).plus({ months: 1 });

      brain.onNextMonth();

      expect(brain.displayMonth()).toBe(expected.month);
      expect(brain.displayYear()).toBe(expected.year);
    });

    it('crosses the year boundary when going forward from December', async () => {
      const { brain } = await createHost();
      brain.setDisplayDate(DateTime.local(2024, 12, 15));

      brain.onNextMonth();

      expect(brain.displayMonth()).toBe(1);
      expect(brain.displayYear()).toBe(2025);
    });

    it('is a no-op when disabled', async () => {
      const { brain } = await createHost((host) => host.disabled.set(true));
      const previousMonth = brain.displayMonth();

      brain.onNextMonth();

      expect(brain.displayMonth()).toBe(previousMonth);
    });
  });

  describe('onDateClick', () => {
    it('is a no-op when calendar is disabled', async () => {
      const { brain, host, fixture } = await createHost();
      const cell = findDateInGrid(brain, DAY(12));
      host.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();
      host.onDateSelected.mockClear();

      brain.onDateClick(cell);

      expect(host.onDateSelected).not.toHaveBeenCalled();
    });

    it('is a no-op when the date cell is disabled', async () => {
      const { brain, host } = await createHost((h) => h.disableBefore.set(DAY(20)));
      const cell = findDateInGrid(brain, DAY(10));

      brain.onDateClick(cell);

      expect(host.onDateSelected).not.toHaveBeenCalled();
    });

    describe('deselection', () => {
      it('emits null start when clicking the current start and enableDeselection is true', async () => {
        const start = DAY(10);
        const { brain, host } = await createHost((h) => h.selectedStartDate.set(start));
        host.onDateSelected.mockClear();

        brain.onDateClick(findDateInGrid(brain, start));

        expect(host.onDateSelected).toHaveBeenCalledWith({ startDate: null, endDate: null });
      });

      it('emits null end when clicking the current end and enableDeselection is true', async () => {
        const start = DAY(5);
        const end = DAY(20);
        const { brain, host } = await createHost((h) => {
          h.selectedStartDate.set(start);
          h.selectedEndDate.set(end);
          h.allowRangeSelection.set(true);
        });
        host.onDateSelected.mockClear();

        brain.onDateClick(findDateInGrid(brain, end));

        expect(host.onDateSelected).toHaveBeenCalledWith({ startDate: start, endDate: null });
      });

      it('does not deselect when enableDeselection is false', async () => {
        const start = DAY(10);
        const { brain, host } = await createHost((h) => {
          h.selectedStartDate.set(start);
          h.enableDeselection.set(false);
        });
        host.onDateSelected.mockClear();

        brain.onDateClick(findDateInGrid(brain, start));

        expect(host.onDateSelected).not.toHaveBeenCalledWith({ startDate: null, endDate: null });
      });
    });

    describe('partial-range mode', () => {
      it('emits startDate only when partialRangeSelectionType is onOrAfter', async () => {
        const clicked = DAY(12);
        const { brain, host } = await createHost((h) => {
          h.allowRangeSelection.set(true);
          h.allowPartialRangeSelection.set(true);
          h.partialRangeSelectionType.set('onOrAfter');
        });
        host.onDateSelected.mockClear();

        brain.onDateClick(findDateInGrid(brain, clicked));

        expect(host.onDateSelected).toHaveBeenCalledTimes(1);
        const payload = host.onDateSelected.mock.calls[0][0];
        expect(payload.startDate?.toISODate()).toBe(clicked.toISODate());
        expect(payload.endDate).toBeNull();
      });

      it('emits endDate only when partialRangeSelectionType is onOrBefore', async () => {
        const clicked = DAY(12);
        const { brain, host } = await createHost((h) => {
          h.allowRangeSelection.set(true);
          h.allowPartialRangeSelection.set(true);
          h.partialRangeSelectionType.set('onOrBefore');
        });
        host.onDateSelected.mockClear();

        brain.onDateClick(findDateInGrid(brain, clicked));

        expect(host.onDateSelected).toHaveBeenCalledTimes(1);
        const payload = host.onDateSelected.mock.calls[0][0];
        expect(payload.startDate).toBeNull();
        expect(payload.endDate?.toISODate()).toBe(clicked.toISODate());
      });
    });

    describe('single-date mode (range disabled)', () => {
      it('emits startDate only with a null endDate', async () => {
        const clicked = DAY(12);
        const { brain, host } = await createHost();
        host.onDateSelected.mockClear();

        brain.onDateClick(findDateInGrid(brain, clicked));

        expect(host.onDateSelected).toHaveBeenCalledTimes(1);
        const payload = host.onDateSelected.mock.calls[0][0];
        expect(payload.startDate?.toISODate()).toBe(clicked.toISODate());
        expect(payload.endDate).toBeNull();
      });
    });

    describe('range mode', () => {
      it('sets startDate when no selection exists yet', async () => {
        const clicked = DAY(12);
        const { brain, host } = await createHost((h) => h.allowRangeSelection.set(true));
        host.onDateSelected.mockClear();

        brain.onDateClick(findDateInGrid(brain, clicked));

        const payload = host.onDateSelected.mock.calls[0][0];
        expect(payload.startDate?.toISODate()).toBe(clicked.toISODate());
        expect(payload.endDate).toBeNull();
      });

      it('completes the range when start is set and clicking a later date', async () => {
        const start = DAY(5);
        const clicked = DAY(12);
        const { brain, host } = await createHost((h) => {
          h.allowRangeSelection.set(true);
          h.selectedStartDate.set(start);
        });
        host.onDateSelected.mockClear();

        brain.onDateClick(findDateInGrid(brain, clicked));

        const payload = host.onDateSelected.mock.calls[0][0];
        expect(payload.startDate?.toISODate()).toBe(start.toISODate());
        expect(payload.endDate?.toISODate()).toBe(clicked.toISODate());
      });

      it('uses the clicked date as the new start when clicking before the existing start', async () => {
        const start = DAY(15);
        const clicked = DAY(5);
        const { brain, host } = await createHost((h) => {
          h.allowRangeSelection.set(true);
          h.selectedStartDate.set(start);
        });
        host.onDateSelected.mockClear();

        brain.onDateClick(findDateInGrid(brain, clicked));

        const payload = host.onDateSelected.mock.calls[0][0];
        expect(payload.startDate?.toISODate()).toBe(clicked.toISODate());
        expect(payload.endDate?.toISODate()).toBe(start.toISODate());
      });

      it('updates the endDate when clicking inside an existing range', async () => {
        const start = DAY(5);
        const end = DAY(20);
        const clicked = DAY(12);
        const { brain, host } = await createHost((h) => {
          h.allowRangeSelection.set(true);
          h.selectedStartDate.set(start);
          h.selectedEndDate.set(end);
        });
        host.onDateSelected.mockClear();

        brain.onDateClick(findDateInGrid(brain, clicked));

        const payload = host.onDateSelected.mock.calls[0][0];
        expect(payload.startDate?.toISODate()).toBe(start.toISODate());
        expect(payload.endDate?.toISODate()).toBe(clicked.toISODate());
      });
    });

    describe('clicking outside the current month', () => {
      it('nudges the display month to the clicked cell month', async () => {
        const { brain } = await createHost();
        const cell = brain.calendarDates()[0].find((c) => !c.isCurrentMonth);

        expect(cell).toBeDefined();

        brain.onDateClick(cell!);

        expect(brain.displayMonth()).toBe(cell!.date.month);
        expect(brain.displayYear()).toBe(cell!.date.year);
      });
    });
  });

  describe('onKeyDown', () => {
    const buildEvent = (key: string): KeyboardEvent => {
      const event = new KeyboardEvent('keydown', { key });
      vi.spyOn(event, 'preventDefault');

      return event;
    };

    it('moves focus left by 1 day on ArrowLeft', async () => {
      const { brain, fixture } = await createHost();
      await focusDate(brain, fixture, DAY(15));
      const initialFocus = brain.focusedDate()!;

      brain.onKeyDown(buildEvent('ArrowLeft'));

      expect(brain.focusedDate()?.toISODate()).toBe(initialFocus.minus({ days: 1 }).toISODate());
    });

    it('moves focus right by 1 day on ArrowRight', async () => {
      const { brain, fixture } = await createHost();
      await focusDate(brain, fixture, DAY(15));
      const initialFocus = brain.focusedDate()!;

      brain.onKeyDown(buildEvent('ArrowRight'));

      expect(brain.focusedDate()?.toISODate()).toBe(initialFocus.plus({ days: 1 }).toISODate());
    });

    it('moves focus up by 1 week on ArrowUp', async () => {
      const { brain, fixture } = await createHost();
      await focusDate(brain, fixture, DAY(15));
      const initialFocus = brain.focusedDate()!;

      brain.onKeyDown(buildEvent('ArrowUp'));

      expect(brain.focusedDate()?.toISODate()).toBe(initialFocus.minus({ weeks: 1 }).toISODate());
    });

    it('moves focus down by 1 week on ArrowDown', async () => {
      const { brain, fixture } = await createHost();
      await focusDate(brain, fixture, DAY(15));
      const initialFocus = brain.focusedDate()!;

      brain.onKeyDown(buildEvent('ArrowDown'));

      expect(brain.focusedDate()?.toISODate()).toBe(initialFocus.plus({ weeks: 1 }).toISODate());
    });

    it('moves focus back 1 month on PageUp', async () => {
      const { brain, fixture } = await createHost();
      await focusDate(brain, fixture, DAY(15));
      const initialFocus = brain.focusedDate()!;

      brain.onKeyDown(buildEvent('PageUp'));

      expect(brain.focusedDate()?.toISODate()).toBe(initialFocus.minus({ months: 1 }).toISODate());
    });

    it('moves focus forward 1 month on PageDown', async () => {
      const { brain, fixture } = await createHost();
      await focusDate(brain, fixture, DAY(15));
      const initialFocus = brain.focusedDate()!;

      brain.onKeyDown(buildEvent('PageDown'));

      expect(brain.focusedDate()?.toISODate()).toBe(initialFocus.plus({ months: 1 }).toISODate());
    });

    it('moves focus to the start of the month on Home', async () => {
      const { brain, fixture } = await createHost();
      await focusDate(brain, fixture, DAY(15));

      brain.onKeyDown(buildEvent('Home'));

      expect(brain.focusedDate()?.toISODate()).toBe(ANCHOR.startOf('month').toISODate());
    });

    it('moves focus to the end of the month on End', async () => {
      const { brain, fixture } = await createHost();
      await focusDate(brain, fixture, DAY(15));

      brain.onKeyDown(buildEvent('End'));

      expect(brain.focusedDate()?.toISODate()).toBe(ANCHOR.endOf('month').toISODate());
    });

    it('selects the focused date on Enter', async () => {
      const target = DAY(12);
      const { brain, host, fixture } = await createHost();
      await focusDate(brain, fixture, target);
      host.onDateSelected.mockClear();

      brain.onKeyDown(buildEvent('Enter'));

      expect(host.onDateSelected).toHaveBeenCalledTimes(1);
      const payload = host.onDateSelected.mock.calls[0][0];
      expect(payload.startDate?.toISODate()).toBe(target.toISODate());
    });

    it('selects the focused date on Space', async () => {
      const target = DAY(12);
      const { brain, host, fixture } = await createHost();
      await focusDate(brain, fixture, target);
      host.onDateSelected.mockClear();

      brain.onKeyDown(buildEvent(' '));

      expect(host.onDateSelected).toHaveBeenCalledTimes(1);
    });

    it('updates the display month and emits displayMonthChanged when focus crosses a month boundary', async () => {
      const { brain, host, fixture } = await createHost();
      await focusDate(brain, fixture, ANCHOR.startOf('month'));
      const previousMonth = brain.displayMonth();
      const expected = ANCHOR.startOf('month').minus({ days: 1 });
      host.onDisplayMonthChanged.mockClear();

      brain.onKeyDown(buildEvent('ArrowLeft'));

      expect(brain.displayMonth()).toBe(expected.month);
      expect(host.onDisplayMonthChanged).toHaveBeenCalledWith(
        expect.objectContaining({ currentMonth: expected.month, previousMonth })
      );
    });

    it('is a no-op when disabled', async () => {
      const { brain } = await createHost((h) => h.disabled.set(true));
      const initialFocus = brain.focusedDate()!;

      brain.onKeyDown(buildEvent('ArrowLeft'));

      expect(brain.focusedDate()?.toISODate()).toBe(initialFocus.toISODate());
    });
  });

  describe('onDateHover', () => {
    it('updates focusedDate and hoveredDate', async () => {
      const { brain } = await createHost();
      const target = DAY(12);

      brain.onDateHover(findDateInGrid(brain, target));

      expect(brain.focusedDate()?.toISODate()).toBe(target.toISODate());
      expect(brain.hoveredDate()?.toISODate()).toBe(target.toISODate());
    });

    it('is a no-op when disabled', async () => {
      const { brain, host, fixture } = await createHost();
      const cell = findDateInGrid(brain, DAY(12));
      const initialFocus = brain.focusedDate();
      host.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      brain.onDateHover(cell);

      expect(brain.focusedDate()?.toISODate()).toBe(initialFocus?.toISODate());
      expect(brain.hoveredDate()).toBeNull();
    });
  });

  describe('onMouseLeave', () => {
    it('clears the hoveredDate', async () => {
      const { brain } = await createHost();
      brain.onDateHover(findDateInGrid(brain, DAY(12)));
      expect(brain.hoveredDate()).not.toBeNull();

      brain.onMouseLeave();

      expect(brain.hoveredDate()).toBeNull();
    });
  });

  describe('onPartialRangeSelectionTypeChange', () => {
    it('emits partialRangeSelectionTypeChanged for valid values', async () => {
      const { brain, host } = await createHost();
      host.onPartialRangeSelectionTypeChanged.mockClear();

      brain.onPartialRangeSelectionTypeChange('onOrAfter');

      expect(host.onPartialRangeSelectionTypeChanged).toHaveBeenCalledWith('onOrAfter');
    });

    it('ignores invalid values', async () => {
      const { brain, host } = await createHost();
      host.onPartialRangeSelectionTypeChanged.mockClear();

      brain.onPartialRangeSelectionTypeChange('not-a-real-type');

      expect(host.onPartialRangeSelectionTypeChanged).not.toHaveBeenCalled();
    });

    it('is a no-op when disabled', async () => {
      const { brain, host } = await createHost((h) => h.disabled.set(true));
      host.onPartialRangeSelectionTypeChanged.mockClear();

      brain.onPartialRangeSelectionTypeChange('onOrAfter');

      expect(host.onPartialRangeSelectionTypeChanged).not.toHaveBeenCalled();
    });
  });

  describe('partial-range-selection-type switching effect', () => {
    it('reshapes a committed range to start-only when switching to onOrAfter', async () => {
      const start = DAY(5);
      const end = DAY(20);
      const { fixture, host } = await createHost((h) => {
        h.allowRangeSelection.set(true);
        h.allowPartialRangeSelection.set(true);
        h.partialRangeSelectionType.set('range');
        h.selectedStartDate.set(start);
        h.selectedEndDate.set(end);
      });
      host.onDateSelected.mockClear();

      host.partialRangeSelectionType.set('onOrAfter');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(host.onDateSelected).toHaveBeenCalledTimes(1);
      const payload = host.onDateSelected.mock.calls[0][0];
      expect(payload.startDate?.toISODate()).toBe(start.toISODate());
      expect(payload.endDate).toBeNull();
    });

    it('reshapes a committed range to end-only when switching to onOrBefore', async () => {
      const start = DAY(5);
      const end = DAY(20);
      const { fixture, host } = await createHost((h) => {
        h.allowRangeSelection.set(true);
        h.allowPartialRangeSelection.set(true);
        h.partialRangeSelectionType.set('range');
        h.selectedStartDate.set(start);
        h.selectedEndDate.set(end);
      });
      host.onDateSelected.mockClear();

      host.partialRangeSelectionType.set('onOrBefore');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(host.onDateSelected).toHaveBeenCalledTimes(1);
      const payload = host.onDateSelected.mock.calls[0][0];
      expect(payload.startDate).toBeNull();
      expect(payload.endDate?.toISODate()).toBe(end.toISODate());
    });

    it('does not emit when no selection exists', async () => {
      const { fixture, host } = await createHost((h) => {
        h.allowRangeSelection.set(true);
        h.allowPartialRangeSelection.set(true);
        h.partialRangeSelectionType.set('range');
      });
      host.onDateSelected.mockClear();

      host.partialRangeSelectionType.set('onOrAfter');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(host.onDateSelected).not.toHaveBeenCalled();
    });
  });
});
