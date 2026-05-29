import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DateTime } from 'luxon';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Calendar } from './calendar';
import { CalendarFooter } from './calendar-footer';
import { CalendarFooterLeftActions } from './calendar-footer-left-actions';
import { CalendarFooterRightActions } from './calendar-footer-right-actions';
import { type CalendarPartialRangeSelectionType } from './calendar-brain';

const DAY = (day: number): DateTime => DateTime.now().set({ day });
const dayLabel = (day: number): string => DAY(day).toFormat('MMMM d, yyyy');

const findDayCell = (host: HTMLElement, day: number): HTMLButtonElement => {
  const cell = host.querySelector(`[aria-label="${dayLabel(day)}"]`);

  if (!cell) {
    throw new Error(`could not find day cell for "${dayLabel(day)}"`);
  }

  return cell as HTMLButtonElement;
};

const getDropdownTrigger = (host: HTMLElement, label: 'Month' | 'Year'): HTMLButtonElement => {
  const selector = host.querySelector(`org-calendar-header org-drop-down-selector[label="${label}"]`);

  if (!selector) {
    throw new Error(`could not find ${label} drop-down selector`);
  }

  return selector.querySelector('button') as HTMLButtonElement;
};

const findOverlayOptionByText = (panel: HTMLElement, text: string): HTMLButtonElement => {
  const options = Array.from(panel.querySelectorAll<HTMLButtonElement>('button[role="option"]'));
  const option = options.find((opt) => opt.textContent?.trim() === text);

  if (!option) {
    throw new Error(`could not find drop-down option with text "${text}"`);
  }

  return option;
};

const findPartialRangeButton = (
  host: HTMLElement,
  label: 'Range' | 'On or Before' | 'On or After'
): HTMLButtonElement => {
  const buttons = Array.from(
    host.querySelectorAll<HTMLButtonElement>('org-calendar-partial-range-selector org-button-toggle button')
  );
  const button = buttons.find((b) => b.textContent?.trim() === label);

  if (!button) {
    throw new Error(`could not find partial-range button "${label}"`);
  }

  return button;
};

const hoverDay = (cell: HTMLElement): void => {
  cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
};

const pressKey = (element: HTMLElement, key: string): void => {
  element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
};

@Component({
  selector: 'test-calendar-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Calendar],
  host: { class: 'block' },
  template: `
    <org-calendar
      data-testid="calendar"
      [allowRangeSelection]="allowRangeSelection()"
      [allowPartialRangeSelection]="allowPartialRangeSelection()"
      [partialRangeSelectionType]="partialRangeSelectionType()"
      [enableDeselection]="enableDeselection()"
      [disabled]="disabled()"
      [containerClass]="containerClass()"
      [selectedStartDate]="selectedStartDate()"
      [selectedEndDate]="selectedEndDate()"
      [disableBefore]="disableBefore()"
      [disableAfter]="disableAfter()"
      [allowedDateRange]="allowedDateRange()"
      (dateSelected)="onDateSelected($event)"
      (partialRangeSelectionTypeChange)="onPartialRangeTypeChange($event)"
      (displayMonthChanged)="onDisplayMonthChanged($event)"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class CalendarInteractiveHost {
  public readonly allowRangeSelection = signal<boolean>(false);
  public readonly allowPartialRangeSelection = signal<boolean>(false);
  public readonly partialRangeSelectionType = signal<CalendarPartialRangeSelectionType>('range');
  public readonly enableDeselection = signal<boolean>(true);
  public readonly disabled = signal<boolean>(false);
  public readonly containerClass = signal<string>('');
  public readonly selectedStartDate = signal<DateTime | null | undefined>(undefined);
  public readonly selectedEndDate = signal<DateTime | null | undefined>(undefined);
  public readonly disableBefore = signal<DateTime | null | undefined>(undefined);
  public readonly disableAfter = signal<DateTime | null | undefined>(undefined);
  public readonly allowedDateRange = signal<number>(0);

  protected readonly dateSelectedCount = signal<number>(0);
  protected readonly lastDateSelectedStart = signal<string>('none');
  protected readonly lastDateSelectedEnd = signal<string>('none');
  protected readonly displayMonthChangedCount = signal<number>(0);
  protected readonly lastDisplayCurrent = signal<string>('none');
  protected readonly lastDisplayPrevious = signal<string>('none');
  protected readonly partialRangeChangedCount = signal<number>(0);
  protected readonly lastPartialRangeType = signal<string>('none');

  protected readout(): string {
    return [
      `dateSelected=${this.dateSelectedCount()}`,
      `lastStart=${this.lastDateSelectedStart()}`,
      `lastEnd=${this.lastDateSelectedEnd()}`,
      `displayMonthChanged=${this.displayMonthChangedCount()}`,
      `lastCurrent=${this.lastDisplayCurrent()}`,
      `lastPrevious=${this.lastDisplayPrevious()}`,
      `partialRangeChanged=${this.partialRangeChangedCount()}`,
      `lastPartialType=${this.lastPartialRangeType()}`,
    ].join(' ');
  }

  protected onDateSelected(payload: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.selectedStartDate.set(payload.startDate);
    this.selectedEndDate.set(payload.endDate);
    this.lastDateSelectedStart.set(payload.startDate?.toISODate() ?? 'null');
    this.lastDateSelectedEnd.set(payload.endDate?.toISODate() ?? 'null');
    this.dateSelectedCount.update((value) => value + 1);
  }

  protected onPartialRangeTypeChange(type: CalendarPartialRangeSelectionType): void {
    this.partialRangeSelectionType.set(type);
    this.lastPartialRangeType.set(type);
    this.partialRangeChangedCount.update((value) => value + 1);
  }

  protected onDisplayMonthChanged(payload: {
    currentMonth: number;
    currentYear: number;
    previousMonth: number;
    previousYear: number;
  }): void {
    this.lastDisplayCurrent.set(`${payload.currentMonth}/${payload.currentYear}`);
    this.lastDisplayPrevious.set(`${payload.previousMonth}/${payload.previousYear}`);
    this.displayMonthChangedCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'test-calendar-footer-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Calendar, CalendarFooter, CalendarFooterLeftActions, CalendarFooterRightActions],
  host: { class: 'block' },
  template: `
    <org-calendar data-testid="calendar">
      <org-calendar-footer data-testid="footer" [containerClass]="containerClass()">
        <org-calendar-footer-left-actions>
          <span data-testid="left-projected">left</span>
        </org-calendar-footer-left-actions>
        <org-calendar-footer-right-actions>
          <span data-testid="right-projected">right</span>
        </org-calendar-footer-right-actions>
      </org-calendar-footer>
    </org-calendar>
  `,
})
class CalendarFooterHost {
  public readonly containerClass = signal<string>('');
}

@Component({
  selector: 'test-calendar-footer-left-actions-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarFooterLeftActions],
  host: { class: 'block' },
  template: `
    <org-calendar-footer-left-actions data-testid="left-actions">
      <span data-testid="projected">projected</span>
    </org-calendar-footer-left-actions>
  `,
})
class CalendarFooterLeftActionsHost {}

@Component({
  selector: 'test-calendar-footer-right-actions-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarFooterRightActions],
  host: { class: 'block' },
  template: `
    <org-calendar-footer-right-actions data-testid="right-actions">
      <span data-testid="projected">projected</span>
    </org-calendar-footer-right-actions>
  `,
})
class CalendarFooterRightActionsHost {}

type CalendarHostConfig = {
  allowRangeSelection?: boolean;
  allowPartialRangeSelection?: boolean;
  partialRangeSelectionType?: CalendarPartialRangeSelectionType;
  enableDeselection?: boolean;
  disabled?: boolean;
  containerClass?: string;
  selectedStartDate?: DateTime | null;
  selectedEndDate?: DateTime | null;
  disableBefore?: DateTime | null;
  disableAfter?: DateTime | null;
  allowedDateRange?: number;
};

describe('Calendar (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createCalendar = (config: CalendarHostConfig = {}): ComponentFixture<CalendarInteractiveHost> =>
    createFixture(CalendarInteractiveHost, (instance) => {
      if (config.allowRangeSelection !== undefined) {
        instance.allowRangeSelection.set(config.allowRangeSelection);
      }

      if (config.allowPartialRangeSelection !== undefined) {
        instance.allowPartialRangeSelection.set(config.allowPartialRangeSelection);
      }

      if (config.partialRangeSelectionType !== undefined) {
        instance.partialRangeSelectionType.set(config.partialRangeSelectionType);
      }

      if (config.enableDeselection !== undefined) {
        instance.enableDeselection.set(config.enableDeselection);
      }

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }

      if (config.containerClass !== undefined) {
        instance.containerClass.set(config.containerClass);
      }

      if (config.selectedStartDate !== undefined) {
        instance.selectedStartDate.set(config.selectedStartDate);
      }

      if (config.selectedEndDate !== undefined) {
        instance.selectedEndDate.set(config.selectedEndDate);
      }

      if (config.disableBefore !== undefined) {
        instance.disableBefore.set(config.disableBefore);
      }

      if (config.disableAfter !== undefined) {
        instance.disableAfter.set(config.disableAfter);
      }

      if (config.allowedDateRange !== undefined) {
        instance.allowedDateRange.set(config.allowedDateRange);
      }
    });

  // the cdk overlay panel for the month / year dropdowns renders outside the fixture, attached to document.body
  const queryOverlayPanel = (): HTMLElement | null => document.body.querySelector('.org-drop-down-selector-overlay');

  const waitForOverlayPanel = async (): Promise<HTMLElement> => {
    await waitFor(() => expect(queryOverlayPanel()).not.toBeNull());

    return queryOverlayPanel() as HTMLElement;
  };

  beforeEach(setupTestBed);

  afterEach(() => {
    destroyFixture();

    // defensively clear any overlay panes left in the body so a stale panel can't leak into the next test
    document.querySelectorAll('.org-drop-down-selector-overlay').forEach((panel) => panel.remove());
  });

  describe('host attribute reflection', () => {
    it('renders the default partial-range-selection-type attribute', () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');

      expect(host.getAttribute('data-partial-range-selection-type')).toBe('range');
    });

    it('omits the boolean host attributes by default', () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');

      expect(host.getAttribute('data-allow-range-selection')).toBeNull();
      expect(host.getAttribute('data-allow-partial-range-selection')).toBeNull();
      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(host.getAttribute('aria-disabled')).toBeNull();
    });

    it('reflects enable-deselection as an empty attribute by default', () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');

      expect(host.getAttribute('data-enable-deselection')).toBe('');
    });

    it('uses tabindex 0 on the container by default', () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const container = host.querySelector('.container') as HTMLDivElement;

      expect(container.getAttribute('tabindex')).toBe('0');
    });

    it('renders the live announcement region', () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const live = host.querySelector('[aria-live="polite"]');

      expect(live).not.toBeNull();
      expect(live?.getAttribute('aria-atomic')).toBe('true');
    });

    it('reflects the allow-range and allow-partial-range attributes', () => {
      const fixture = createCalendar({ allowRangeSelection: true, allowPartialRangeSelection: true });
      const host = queryByTestId(fixture, 'calendar');

      expect(host.getAttribute('data-allow-range-selection')).toBe('');
      expect(host.getAttribute('data-allow-partial-range-selection')).toBe('');
    });

    it('reflects the partial-range-selection-type verbatim', () => {
      const fixture = createCalendar({ partialRangeSelectionType: 'onOrAfter' });
      const host = queryByTestId(fixture, 'calendar');

      expect(host.getAttribute('data-partial-range-selection-type')).toBe('onOrAfter');
    });

    it('omits data-enable-deselection when false', () => {
      const fixture = createCalendar({ enableDeselection: false });
      const host = queryByTestId(fixture, 'calendar');

      expect(host.getAttribute('data-enable-deselection')).toBeNull();
    });

    it('applies data-disabled and aria-disabled when disabled', () => {
      const fixture = createCalendar({ disabled: true });
      const host = queryByTestId(fixture, 'calendar');

      expect(host.getAttribute('data-disabled')).toBe('');
      expect(host.getAttribute('aria-disabled')).toBe('true');
    });

    it('sets the container tabindex to -1 when disabled', () => {
      const fixture = createCalendar({ disabled: true });
      const host = queryByTestId(fixture, 'calendar');
      const container = host.querySelector('.container') as HTMLDivElement;

      expect(container.getAttribute('tabindex')).toBe('-1');
    });

    it('applies the container class to the container', () => {
      const fixture = createCalendar({ containerClass: 'custom-container' });
      const host = queryByTestId(fixture, 'calendar');
      const container = host.querySelector('.container') as HTMLDivElement;

      expect(container.classList.contains('custom-container')).toBe(true);
    });
  });

  describe('structure and rendering', () => {
    it('renders seven weekday labels', () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const weekdays = host.querySelectorAll('.weekdays .weekday');

      expect(weekdays.length).toBe(7);
    });

    it('renders the sr-only weekday column headers', () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const headers = host.querySelectorAll('[role="row"].sr-only [role="columnheader"]');

      expect(headers.length).toBe(7);
      expect(headers[0].textContent?.trim()).toBe('Sunday');
      expect(headers[6].textContent?.trim()).toBe('Saturday');
    });

    it('renders day buttons with numeric content', () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const cells = host.querySelectorAll('.day');

      expect(cells.length).toBeGreaterThanOrEqual(28);
      cells.forEach((cell) => {
        const num = cell.querySelector('.day-num');

        expect(num?.textContent?.trim()).toMatch(/^\d+$/);
      });
    });

    it('applies aria-current to the today cell only', () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const todayCell = host.querySelector('[data-today]');
      const otherCell = host.querySelector('.day:not([data-today])');

      expect(todayCell?.getAttribute('aria-current')).toBe('date');
      expect(otherCell?.getAttribute('aria-current')).toBeNull();
    });

    it('marks outside-month cells with a data attribute', () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const outsideCell = host.querySelector('.day[data-outside-month]');

      expect(outsideCell).not.toBeNull();
    });

    it('renders the previous and next buttons', () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const previous = host.querySelector('org-calendar-header org-button[ariaLabel="Previous month"]');
      const next = host.querySelector('org-calendar-header org-button[ariaLabel="Next month"]');

      expect(previous).not.toBeNull();
      expect(next).not.toBeNull();
    });

    it('renders the month and year drop-down selectors', () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const selectors = host.querySelectorAll('org-calendar-header org-drop-down-selector');

      expect(selectors.length).toBe(2);
    });
  });

  describe('navigation and display-month change', () => {
    it('emits displayMonthChanged on previous click', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');
      const previousButton = host.querySelector(
        'org-calendar-header org-button[ariaLabel="Previous month"] button'
      ) as HTMLButtonElement;
      const today = DateTime.now();
      const expected = today.startOf('month').minus({ months: 1 });

      await userEvent.click(previousButton);

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastCurrent=${expected.month}/${expected.year}`);
        expect(readout.textContent).toContain(`lastPrevious=${today.month}/${today.year}`);
      });
    });

    it('emits displayMonthChanged on next click', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');
      const nextButton = host.querySelector(
        'org-calendar-header org-button[ariaLabel="Next month"] button'
      ) as HTMLButtonElement;
      const today = DateTime.now();
      const expected = today.startOf('month').plus({ months: 1 });

      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastCurrent=${expected.month}/${expected.year}`);
        expect(readout.textContent).toContain(`lastPrevious=${today.month}/${today.year}`);
      });
    });

    it('does not emit on previous / next when disabled', async () => {
      const fixture = createCalendar({ disabled: true });
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);

      const previousButton = host.querySelector(
        'org-calendar-header org-button[ariaLabel="Previous month"] button'
      ) as HTMLButtonElement;
      const nextButton = host.querySelector(
        'org-calendar-header org-button[ariaLabel="Next month"] button'
      ) as HTMLButtonElement;

      previousButton.click();
      nextButton.click();
      await flush(fixture);

      expect(readout.textContent).toContain('displayMonthChanged=0');
    });

    it('nudges the display month when clicking an outside-month cell', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');
      const today = DateTime.now();
      const outsideCell = host.querySelector('.day[data-outside-month]') as HTMLButtonElement;
      const ariaLabel = outsideCell.getAttribute('aria-label') as string;
      const clickedDate = DateTime.fromFormat(ariaLabel, 'MMMM d, yyyy');

      await userEvent.click(outsideCell);

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastCurrent=${clickedDate.month}/${clickedDate.year}`);
        expect(readout.textContent).toContain(`lastPrevious=${today.month}/${today.year}`);
      });
    });

    it('emits displayMonthChanged from the month dropdown', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');
      const today = DateTime.now();
      const targetMonth = today.month === 1 ? 12 : today.month - 1;
      const targetMonthLabel = DateTime.local(2000, targetMonth, 1).toFormat('MMMM');

      await userEvent.click(getDropdownTrigger(host, 'Month'));

      const panel = await waitForOverlayPanel();

      await userEvent.click(findOverlayOptionByText(panel, targetMonthLabel));

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastCurrent=${targetMonth}/${today.year}`);
        expect(readout.textContent).toContain(`lastPrevious=${today.month}/${today.year}`);
      });
    });

    it('emits displayMonthChanged from the year dropdown', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');
      const today = DateTime.now();
      const targetYear = today.year - 1;

      await userEvent.click(getDropdownTrigger(host, 'Year'));

      const panel = await waitForOverlayPanel();

      await userEvent.click(findOverlayOptionByText(panel, targetYear.toString()));

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastCurrent=${today.month}/${targetYear}`);
        expect(readout.textContent).toContain(`lastPrevious=${today.month}/${today.year}`);
      });
    });

    it('does not emit from the month dropdown when disabled', async () => {
      const fixture = createCalendar({ disabled: true });
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);

      getDropdownTrigger(host, 'Month').click();
      await flush(fixture);

      expect(readout.textContent).toContain('displayMonthChanged=0');
    });

    it('does not emit from the year dropdown when disabled', async () => {
      const fixture = createCalendar({ disabled: true });
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);

      getDropdownTrigger(host, 'Year').click();
      await flush(fixture);

      expect(readout.textContent).toContain('displayMonthChanged=0');
    });

    it('crosses the year boundary going to the previous month from January', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');
      const today = DateTime.now();

      await userEvent.click(getDropdownTrigger(host, 'Month'));
      const panel = await waitForOverlayPanel();
      await userEvent.click(findOverlayOptionByText(panel, 'January'));

      await waitFor(() => expect(readout.textContent).toContain(`lastCurrent=1/${today.year}`));

      const previousButton = host.querySelector(
        'org-calendar-header org-button[ariaLabel="Previous month"] button'
      ) as HTMLButtonElement;

      await userEvent.click(previousButton);

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastCurrent=12/${today.year - 1}`);
        expect(readout.textContent).toContain(`lastPrevious=1/${today.year}`);
      });
    });

    it('crosses the year boundary going to the next month from December', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');
      const today = DateTime.now();

      await userEvent.click(getDropdownTrigger(host, 'Month'));
      const panel = await waitForOverlayPanel();
      await userEvent.click(findOverlayOptionByText(panel, 'December'));

      await waitFor(() => expect(readout.textContent).toContain(`lastCurrent=12/${today.year}`));

      const nextButton = host.querySelector(
        'org-calendar-header org-button[ariaLabel="Next month"] button'
      ) as HTMLButtonElement;

      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastCurrent=1/${today.year + 1}`);
        expect(readout.textContent).toContain(`lastPrevious=12/${today.year}`);
      });
    });
  });

  describe('partial-range toggle visibility', () => {
    it('hides the toggle when range selection is disabled', () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const toggle = host.querySelector('org-calendar-partial-range-selector org-button-toggle');

      expect(toggle).toBeNull();
    });

    it('hides the toggle when only partial selection is enabled', () => {
      const fixture = createCalendar({ allowPartialRangeSelection: true });
      const host = queryByTestId(fixture, 'calendar');
      const toggle = host.querySelector('org-calendar-partial-range-selector org-button-toggle');

      expect(toggle).toBeNull();
    });

    it('renders the toggle when both range and partial selection are enabled', async () => {
      const fixture = createCalendar({ allowRangeSelection: true, allowPartialRangeSelection: true });
      const host = queryByTestId(fixture, 'calendar');

      await waitFor(() =>
        expect(host.querySelector('org-calendar-partial-range-selector org-button-toggle')).not.toBeNull()
      );
    });
  });

  describe('selection', () => {
    it('reflects aria-selected on the selected start cell', async () => {
      const fixture = createCalendar({ selectedStartDate: DAY(10) });
      const host = queryByTestId(fixture, 'calendar');

      await waitFor(() => {
        const cell = findDayCell(host, 10);

        expect(cell.getAttribute('aria-selected')).toBe('true');
        expect(cell.getAttribute('data-selected')).toBe('');
      });
    });

    it('reflects aria-selected on the selected end cell', async () => {
      const fixture = createCalendar({
        allowRangeSelection: true,
        selectedStartDate: DAY(5),
        selectedEndDate: DAY(20),
      });
      const host = queryByTestId(fixture, 'calendar');

      await waitFor(() => {
        const endCell = findDayCell(host, 20);

        expect(endCell.getAttribute('aria-selected')).toBe('true');
        expect(endCell.getAttribute('data-selected')).toBe('');
      });
    });

    it('emits dateSelected when clicking a day', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(findDayCell(host, 12));

      await waitFor(() => {
        expect(readout.textContent).toContain('dateSelected=1');
        expect(readout.textContent).toContain(`lastStart=${DAY(12).toISODate()}`);
        expect(readout.textContent).toContain('lastEnd=null');
      });
    });

    it('does not emit dateSelected when clicking a day while disabled', async () => {
      const fixture = createCalendar({ disabled: true });
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);

      findDayCell(host, 12).click();
      await flush(fixture);

      expect(readout.textContent).toContain('dateSelected=0');
    });

    it('deselects the start when clicking it again and deselection is enabled', async () => {
      const fixture = createCalendar({ selectedStartDate: DAY(10) });
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(findDayCell(host, 10).getAttribute('aria-selected')).toBe('true'));

      await userEvent.click(findDayCell(host, 10));

      await waitFor(() => {
        expect(readout.textContent).toContain('lastStart=null');
        expect(readout.textContent).toContain('lastEnd=null');
      });
    });

    it('does not deselect when enable-deselection is false', async () => {
      const fixture = createCalendar({ enableDeselection: false, selectedStartDate: DAY(10) });
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(findDayCell(host, 10).getAttribute('aria-selected')).toBe('true'));

      await userEvent.click(findDayCell(host, 10));

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastStart=${DAY(10).toISODate()}`);
        expect(readout.textContent).not.toContain('lastStart=null');
      });
    });

    it('completes the range when clicking after the start in range mode', async () => {
      const fixture = createCalendar({ allowRangeSelection: true, selectedStartDate: DAY(5) });
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(findDayCell(host, 5).getAttribute('aria-selected')).toBe('true'));

      await userEvent.click(findDayCell(host, 12));

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastStart=${DAY(5).toISODate()}`);
        expect(readout.textContent).toContain(`lastEnd=${DAY(12).toISODate()}`);
      });
    });

    it('reverses the range when clicking before the start in range mode', async () => {
      const fixture = createCalendar({ allowRangeSelection: true, selectedStartDate: DAY(15) });
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(findDayCell(host, 15).getAttribute('aria-selected')).toBe('true'));

      await userEvent.click(findDayCell(host, 5));

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastStart=${DAY(5).toISODate()}`);
        expect(readout.textContent).toContain(`lastEnd=${DAY(15).toISODate()}`);
      });
    });

    it('updates the end when clicking inside a committed range', async () => {
      const fixture = createCalendar({
        allowRangeSelection: true,
        selectedStartDate: DAY(5),
        selectedEndDate: DAY(20),
      });
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(findDayCell(host, 5).getAttribute('aria-selected')).toBe('true'));

      await userEvent.click(findDayCell(host, 12));

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastStart=${DAY(5).toISODate()}`);
        expect(readout.textContent).toContain(`lastEnd=${DAY(12).toISODate()}`);
      });
    });

    it('emits start-only in the on-or-after partial range mode', async () => {
      const fixture = createCalendar({
        allowRangeSelection: true,
        allowPartialRangeSelection: true,
        partialRangeSelectionType: 'onOrAfter',
      });
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(findDayCell(host, 12));

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastStart=${DAY(12).toISODate()}`);
        expect(readout.textContent).toContain('lastEnd=null');
      });
    });

    it('emits end-only in the on-or-before partial range mode', async () => {
      const fixture = createCalendar({
        allowRangeSelection: true,
        allowPartialRangeSelection: true,
        partialRangeSelectionType: 'onOrBefore',
      });
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(findDayCell(host, 12));

      await waitFor(() => {
        expect(readout.textContent).toContain('lastStart=null');
        expect(readout.textContent).toContain(`lastEnd=${DAY(12).toISODate()}`);
      });
    });

    it('deselects the end only when clicking the selected end', async () => {
      const fixture = createCalendar({
        allowRangeSelection: true,
        selectedStartDate: DAY(5),
        selectedEndDate: DAY(20),
      });
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(findDayCell(host, 20).getAttribute('aria-selected')).toBe('true'));

      await userEvent.click(findDayCell(host, 20));

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastStart=${DAY(5).toISODate()}`);
        expect(readout.textContent).toContain('lastEnd=null');
      });
    });
  });

  describe('disabled dates', () => {
    it('marks earlier dates disabled with disable-before', async () => {
      const fixture = createCalendar({ disableBefore: DAY(10) });
      const host = queryByTestId(fixture, 'calendar');

      await waitFor(() => {
        expect(findDayCell(host, 9).getAttribute('aria-disabled')).toBe('true');
        expect(findDayCell(host, 10).getAttribute('aria-disabled')).toBeNull();
        expect(findDayCell(host, 11).getAttribute('aria-disabled')).toBeNull();
      });
    });

    it('marks later dates disabled with disable-after', async () => {
      const fixture = createCalendar({ disableAfter: DAY(20) });
      const host = queryByTestId(fixture, 'calendar');

      await waitFor(() => {
        expect(findDayCell(host, 19).getAttribute('aria-disabled')).toBeNull();
        expect(findDayCell(host, 20).getAttribute('aria-disabled')).toBeNull();
        expect(findDayCell(host, 21).getAttribute('aria-disabled')).toBe('true');
      });
    });

    it('ignores an invalid disable range', async () => {
      const fixture = createCalendar({ disableBefore: DAY(20), disableAfter: DAY(10) });
      const host = queryByTestId(fixture, 'calendar');

      await waitFor(() => {
        expect(findDayCell(host, 5).getAttribute('aria-disabled')).toBeNull();
        expect(findDayCell(host, 15).getAttribute('aria-disabled')).toBeNull();
        expect(findDayCell(host, 25).getAttribute('aria-disabled')).toBeNull();
      });
    });

    it('limits clickable dates with allowed-date-range and a start', async () => {
      const fixture = createCalendar({ selectedStartDate: DAY(10), allowedDateRange: 3 });
      const host = queryByTestId(fixture, 'calendar');

      await waitFor(() => {
        expect(findDayCell(host, 12).getAttribute('aria-disabled')).toBeNull();
        expect(findDayCell(host, 13).getAttribute('aria-disabled')).toBe('true');
        expect(findDayCell(host, 8).getAttribute('aria-disabled')).toBeNull();
        expect(findDayCell(host, 7).getAttribute('aria-disabled')).toBe('true');
      });
    });

    it('limits clickable dates with allowed-date-range and an end only', async () => {
      const fixture = createCalendar({ selectedEndDate: DAY(20), allowedDateRange: 3 });
      const host = queryByTestId(fixture, 'calendar');

      await waitFor(() => {
        expect(findDayCell(host, 18).getAttribute('aria-disabled')).toBeNull();
        expect(findDayCell(host, 17).getAttribute('aria-disabled')).toBe('true');
        expect(findDayCell(host, 22).getAttribute('aria-disabled')).toBeNull();
        expect(findDayCell(host, 23).getAttribute('aria-disabled')).toBe('true');
      });
    });

    it('limits clickable dates with allowed-date-range and both ends', async () => {
      const fixture = createCalendar({
        allowRangeSelection: true,
        selectedStartDate: DAY(10),
        selectedEndDate: DAY(20),
        allowedDateRange: 3,
      });
      const host = queryByTestId(fixture, 'calendar');

      await waitFor(() => {
        expect(findDayCell(host, 10).getAttribute('aria-disabled')).toBeNull();
        expect(findDayCell(host, 11).getAttribute('aria-disabled')).toBeNull();
        expect(findDayCell(host, 15).getAttribute('aria-disabled')).toBe('true');
        expect(findDayCell(host, 19).getAttribute('aria-disabled')).toBeNull();
        expect(findDayCell(host, 20).getAttribute('aria-disabled')).toBeNull();
      });
    });

    it('does not emit when clicking a disabled cell', async () => {
      const fixture = createCalendar({ disableBefore: DAY(20) });
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(findDayCell(host, 10).getAttribute('aria-disabled')).toBe('true'));

      findDayCell(host, 10).click();
      await flush(fixture);

      expect(readout.textContent).toContain('dateSelected=0');
    });
  });

  describe('keyboard navigation', () => {
    it('moves focus back one day on ArrowLeft', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const container = host.querySelector('.container') as HTMLDivElement;

      hoverDay(findDayCell(host, 15));
      await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

      pressKey(container, 'ArrowLeft');

      await waitFor(() => expect(findDayCell(host, 14).getAttribute('data-focused')).toBe(''));
    });

    it('moves focus forward one day on ArrowRight', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const container = host.querySelector('.container') as HTMLDivElement;

      hoverDay(findDayCell(host, 15));
      await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

      pressKey(container, 'ArrowRight');

      await waitFor(() => expect(findDayCell(host, 16).getAttribute('data-focused')).toBe(''));
    });

    it('moves focus back one week on ArrowUp', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const container = host.querySelector('.container') as HTMLDivElement;
      const expected = DateTime.now().set({ day: 15 }).minus({ weeks: 1 });

      hoverDay(findDayCell(host, 15));
      await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

      pressKey(container, 'ArrowUp');

      await waitFor(() =>
        expect(host.querySelector(`[aria-label="${expected.toFormat('MMMM d, yyyy')}"][data-focused]`)).not.toBeNull()
      );
    });

    it('moves focus forward one week on ArrowDown', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const container = host.querySelector('.container') as HTMLDivElement;
      const expected = DateTime.now().set({ day: 15 }).plus({ weeks: 1 });

      hoverDay(findDayCell(host, 15));
      await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

      pressKey(container, 'ArrowDown');

      await waitFor(() =>
        expect(host.querySelector(`[aria-label="${expected.toFormat('MMMM d, yyyy')}"][data-focused]`)).not.toBeNull()
      );
    });

    it('moves focus back one month on PageUp', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const container = host.querySelector('.container') as HTMLDivElement;
      const expected = DateTime.now().set({ day: 15 }).minus({ months: 1 });

      hoverDay(findDayCell(host, 15));
      await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

      pressKey(container, 'PageUp');

      await waitFor(() =>
        expect(host.querySelector(`[aria-label="${expected.toFormat('MMMM d, yyyy')}"][data-focused]`)).not.toBeNull()
      );
    });

    it('moves focus forward one month on PageDown', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const container = host.querySelector('.container') as HTMLDivElement;
      const expected = DateTime.now().set({ day: 15 }).plus({ months: 1 });

      hoverDay(findDayCell(host, 15));
      await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

      pressKey(container, 'PageDown');

      await waitFor(() =>
        expect(host.querySelector(`[aria-label="${expected.toFormat('MMMM d, yyyy')}"][data-focused]`)).not.toBeNull()
      );
    });

    it('moves focus to the start of the month on Home', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const container = host.querySelector('.container') as HTMLDivElement;
      const expectedDay = DateTime.now().startOf('month').day;

      hoverDay(findDayCell(host, 15));
      await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

      pressKey(container, 'Home');

      await waitFor(() => expect(findDayCell(host, expectedDay).getAttribute('data-focused')).toBe(''));
    });

    it('moves focus to the end of the month on End', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const container = host.querySelector('.container') as HTMLDivElement;
      const expectedDay = DateTime.now().endOf('month').day;

      hoverDay(findDayCell(host, 15));
      await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

      pressKey(container, 'End');

      await waitFor(() => expect(findDayCell(host, expectedDay).getAttribute('data-focused')).toBe(''));
    });

    it('selects the focused date on Enter', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');
      const container = host.querySelector('.container') as HTMLDivElement;

      hoverDay(findDayCell(host, 12));
      await waitFor(() => expect(findDayCell(host, 12).getAttribute('data-focused')).toBe(''));

      pressKey(container, 'Enter');

      await waitFor(() => {
        expect(readout.textContent).toContain('dateSelected=1');
        expect(readout.textContent).toContain(`lastStart=${DAY(12).toISODate()}`);
      });
    });

    it('selects the focused date on Space', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');
      const container = host.querySelector('.container') as HTMLDivElement;

      hoverDay(findDayCell(host, 12));
      await waitFor(() => expect(findDayCell(host, 12).getAttribute('data-focused')).toBe(''));

      pressKey(container, ' ');

      await waitFor(() => {
        expect(readout.textContent).toContain('dateSelected=1');
        expect(readout.textContent).toContain(`lastStart=${DAY(12).toISODate()}`);
      });
    });

    it('changes the display month when navigation crosses a boundary', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');
      const container = host.querySelector('.container') as HTMLDivElement;
      const today = DateTime.now();
      const firstOfMonthDay = today.startOf('month').day;
      const expected = today.startOf('month').minus({ days: 1 });

      hoverDay(findDayCell(host, firstOfMonthDay));
      await waitFor(() => expect(findDayCell(host, firstOfMonthDay).getAttribute('data-focused')).toBe(''));

      pressKey(container, 'ArrowLeft');

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastCurrent=${expected.month}/${expected.year}`);
        expect(readout.textContent).toContain(`lastPrevious=${today.month}/${today.year}`);
      });
    });

    it('does nothing on keyboard navigation when disabled', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const container = host.querySelector('.container') as HTMLDivElement;

      hoverDay(findDayCell(host, 15));
      await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

      fixture.componentInstance.disabled.set(true);
      await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

      pressKey(container, 'ArrowLeft');
      await flush(fixture);

      expect(findDayCell(host, 15).getAttribute('data-focused')).toBe('');
      expect(findDayCell(host, 14).getAttribute('data-focused')).toBeNull();
    });

    it('returns focus to the container after a boundary crossing', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');
      const container = host.querySelector('.container') as HTMLDivElement;
      const firstOfMonthDay = DateTime.now().startOf('month').day;

      hoverDay(findDayCell(host, firstOfMonthDay));
      await waitFor(() => expect(findDayCell(host, firstOfMonthDay).getAttribute('data-focused')).toBe(''));

      pressKey(container, 'ArrowLeft');

      await waitFor(() => expect(document.activeElement).toBe(container));
    });
  });

  describe('hover and range-pos preview', () => {
    it('moves the focused state on hover', async () => {
      const fixture = createCalendar();
      const host = queryByTestId(fixture, 'calendar');

      hoverDay(findDayCell(host, 12));

      await waitFor(() => expect(findDayCell(host, 12).getAttribute('data-focused')).toBe(''));
    });

    it('does nothing on hover when disabled', async () => {
      const fixture = createCalendar({ disabled: true });
      const host = queryByTestId(fixture, 'calendar');

      await flush(fixture);

      hoverDay(findDayCell(host, 12));
      await flush(fixture);

      expect(findDayCell(host, 12).getAttribute('data-focused')).toBeNull();
    });

    it('clears the preview state on grid mouse leave', async () => {
      const fixture = createCalendar({ allowRangeSelection: true, selectedStartDate: DAY(5) });
      const host = queryByTestId(fixture, 'calendar');

      await waitFor(() => expect(findDayCell(host, 5).getAttribute('aria-selected')).toBe('true'));

      hoverDay(findDayCell(host, 12));
      await waitFor(() => expect(findDayCell(host, 12).getAttribute('data-range-pos')).toBe('preview-end'));

      const grid = host.querySelector('[role="grid"]') as HTMLDivElement;
      grid.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

      await waitFor(() => expect(findDayCell(host, 12).getAttribute('data-range-pos')).toBeNull());
    });

    it('applies start / middle / end range-pos to a committed range', async () => {
      const fixture = createCalendar({
        allowRangeSelection: true,
        selectedStartDate: DAY(5),
        selectedEndDate: DAY(10),
      });
      const host = queryByTestId(fixture, 'calendar');

      await waitFor(() => {
        expect(findDayCell(host, 5).getAttribute('data-range-pos')).toBe('start');
        expect(findDayCell(host, 10).getAttribute('data-range-pos')).toBe('end');
        expect(findDayCell(host, 7).getAttribute('data-range-pos')).toBe('middle');
      });
    });

    it('applies a single range-pos when start and end are the same day', async () => {
      const fixture = createCalendar({
        allowRangeSelection: true,
        selectedStartDate: DAY(10),
        selectedEndDate: DAY(10),
      });
      const host = queryByTestId(fixture, 'calendar');

      await waitFor(() => expect(findDayCell(host, 10).getAttribute('data-range-pos')).toBe('single'));
    });

    it('applies preview-end and preview when hovering after the start', async () => {
      const fixture = createCalendar({ allowRangeSelection: true, selectedStartDate: DAY(5) });
      const host = queryByTestId(fixture, 'calendar');

      await waitFor(() => expect(findDayCell(host, 5).getAttribute('aria-selected')).toBe('true'));

      hoverDay(findDayCell(host, 10));

      await waitFor(() => {
        expect(findDayCell(host, 5).getAttribute('data-range-pos')).toBe('start');
        expect(findDayCell(host, 10).getAttribute('data-range-pos')).toBe('preview-end');
        expect(findDayCell(host, 7).getAttribute('data-range-pos')).toBe('preview');
      });
    });

    it('applies preview-start and preview when hovering before the start', async () => {
      const fixture = createCalendar({ allowRangeSelection: true, selectedStartDate: DAY(15) });
      const host = queryByTestId(fixture, 'calendar');

      await waitFor(() => expect(findDayCell(host, 15).getAttribute('aria-selected')).toBe('true'));

      hoverDay(findDayCell(host, 10));

      await waitFor(() => {
        expect(findDayCell(host, 15).getAttribute('data-range-pos')).toBe('end');
        expect(findDayCell(host, 10).getAttribute('data-range-pos')).toBe('preview-start');
        expect(findDayCell(host, 12).getAttribute('data-range-pos')).toBe('preview');
      });
    });
  });

  describe('partial-range type switching', () => {
    it('reshapes a committed range to start-only when switching to on-or-after', async () => {
      const fixture = createCalendar({
        allowRangeSelection: true,
        allowPartialRangeSelection: true,
        selectedStartDate: DAY(5),
        selectedEndDate: DAY(20),
      });
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(findDayCell(host, 5).getAttribute('aria-selected')).toBe('true'));

      fixture.componentInstance.partialRangeSelectionType.set('onOrAfter');

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastStart=${DAY(5).toISODate()}`);
        expect(readout.textContent).toContain('lastEnd=null');
      });
    });

    it('reshapes a committed range to end-only when switching to on-or-before', async () => {
      const fixture = createCalendar({
        allowRangeSelection: true,
        allowPartialRangeSelection: true,
        selectedStartDate: DAY(5),
        selectedEndDate: DAY(20),
      });
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(findDayCell(host, 5).getAttribute('aria-selected')).toBe('true'));

      fixture.componentInstance.partialRangeSelectionType.set('onOrBefore');

      await waitFor(() => {
        expect(readout.textContent).toContain('lastStart=null');
        expect(readout.textContent).toContain(`lastEnd=${DAY(20).toISODate()}`);
      });
    });

    it('does nothing when switching type without a selection', async () => {
      const fixture = createCalendar({ allowRangeSelection: true, allowPartialRangeSelection: true });
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.partialRangeSelectionType.set('onOrAfter');
      await flush(fixture);

      expect(readout.textContent).toContain('dateSelected=0');
    });

    it('switches the type when clicking the on-or-after toggle', async () => {
      const fixture = createCalendar({ allowRangeSelection: true, allowPartialRangeSelection: true });
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() =>
        expect(host.querySelector('org-calendar-partial-range-selector org-button-toggle')).not.toBeNull()
      );

      await userEvent.click(findPartialRangeButton(host, 'On or After'));

      await waitFor(() => {
        expect(host.getAttribute('data-partial-range-selection-type')).toBe('onOrAfter');
        expect(readout.textContent).toContain('lastPartialType=onOrAfter');
      });
    });

    it('does not emit from the toggle when disabled', async () => {
      const fixture = createCalendar({ allowRangeSelection: true, allowPartialRangeSelection: true });
      const host = queryByTestId(fixture, 'calendar');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() =>
        expect(host.querySelector('org-calendar-partial-range-selector org-button-toggle')).not.toBeNull()
      );

      fixture.componentInstance.disabled.set(true);
      await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

      findPartialRangeButton(host, 'On or After').click();
      await flush(fixture);

      expect(readout.textContent).toContain('partialRangeChanged=0');
    });
  });

  describe('footer and content projection', () => {
    it('applies the container class to the footer', async () => {
      const fixture = createFixture(CalendarFooterHost, (instance) => {
        instance.containerClass.set('extra-class');
      });

      await waitFor(() => {
        const footer = queryByTestId(fixture, 'footer').querySelector('.footer') as HTMLElement;

        expect(footer.classList.contains('extra-class')).toBe(true);
      });
    });

    it('projects the footer left actions content', () => {
      const fixture = createFixture(CalendarFooterHost);
      const footer = queryByTestId(fixture, 'footer');
      const leftSlot = footer.querySelector('.actions-left') as HTMLElement;

      expect(leftSlot.querySelector('[data-testid="left-projected"]')).not.toBeNull();
    });

    it('projects the footer right actions content', () => {
      const fixture = createFixture(CalendarFooterHost);
      const footer = queryByTestId(fixture, 'footer');
      const rightSlot = footer.querySelector('.actions-right') as HTMLElement;

      expect(rightSlot.querySelector('[data-testid="right-projected"]')).not.toBeNull();
    });

    it('projects content through the footer left actions component', () => {
      const fixture = createFixture(CalendarFooterLeftActionsHost);
      const host = queryByTestId(fixture, 'left-actions');

      expect(host.querySelector('[data-testid="projected"]')).not.toBeNull();
    });

    it('projects content through the footer right actions component', () => {
      const fixture = createFixture(CalendarFooterRightActionsHost);
      const host = queryByTestId(fixture, 'right-actions');

      expect(host.querySelector('[data-testid="projected"]')).not.toBeNull();
    });
  });
});
