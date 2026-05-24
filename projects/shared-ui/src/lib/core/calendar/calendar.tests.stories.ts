import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { DateTime } from 'luxon';

import { Calendar } from './calendar';
import { CalendarFooter } from './calendar-footer';
import { CalendarFooterLeftActions } from './calendar-footer-left-actions';
import { CalendarFooterRightActions } from './calendar-footer-right-actions';
import { type CalendarPartialRangeSelectionType } from './calendar-brain';

const DAY = (day: number): DateTime => DateTime.now().set({ day });
const dayLabel = (day: number): string => DAY(day).toFormat('MMMM d, yyyy');

@Component({
  selector: 'story-calendar-tests-shell',
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-allow-range-on" (click)="allowRangeSelection.set(true)">
        allow-range-on
      </button>
      <button type="button" data-testid="ctl-allow-range-off" (click)="allowRangeSelection.set(false)">
        allow-range-off
      </button>
      <button type="button" data-testid="ctl-allow-partial-on" (click)="allowPartialRangeSelection.set(true)">
        allow-partial-on
      </button>
      <button type="button" data-testid="ctl-allow-partial-off" (click)="allowPartialRangeSelection.set(false)">
        allow-partial-off
      </button>
      <button
        type="button"
        data-testid="ctl-partial-type-on-or-after"
        (click)="partialRangeSelectionType.set('onOrAfter')"
      >
        partial-type-on-or-after
      </button>
      <button
        type="button"
        data-testid="ctl-partial-type-on-or-before"
        (click)="partialRangeSelectionType.set('onOrBefore')"
      >
        partial-type-on-or-before
      </button>
      <button type="button" data-testid="ctl-partial-type-range" (click)="partialRangeSelectionType.set('range')">
        partial-type-range
      </button>
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
      <button type="button" data-testid="ctl-enable-deselection-off" (click)="enableDeselection.set(false)">
        enable-deselection-off
      </button>
      <button type="button" data-testid="ctl-container-class-extra" (click)="containerClass.set('custom-container')">
        container-class-extra
      </button>
      <button type="button" data-testid="ctl-selected-start-day-5" (click)="setSelectedStart(DAY(5))">
        selected-start-day-5
      </button>
      <button type="button" data-testid="ctl-selected-start-day-10" (click)="setSelectedStart(DAY(10))">
        selected-start-day-10
      </button>
      <button type="button" data-testid="ctl-selected-start-day-15" (click)="setSelectedStart(DAY(15))">
        selected-start-day-15
      </button>
      <button type="button" data-testid="ctl-selected-end-day-10" (click)="setSelectedEnd(DAY(10))">
        selected-end-day-10
      </button>
      <button type="button" data-testid="ctl-selected-end-day-20" (click)="setSelectedEnd(DAY(20))">
        selected-end-day-20
      </button>
      <button type="button" data-testid="ctl-selected-clear" (click)="clearSelection()">selected-clear</button>
      <button type="button" data-testid="ctl-disable-before-day-10" (click)="disableBefore.set(DAY(10))">
        disable-before-day-10
      </button>
      <button type="button" data-testid="ctl-disable-before-day-20" (click)="disableBefore.set(DAY(20))">
        disable-before-day-20
      </button>
      <button type="button" data-testid="ctl-disable-after-day-10" (click)="disableAfter.set(DAY(10))">
        disable-after-day-10
      </button>
      <button type="button" data-testid="ctl-disable-after-day-20" (click)="disableAfter.set(DAY(20))">
        disable-after-day-20
      </button>
      <button type="button" data-testid="ctl-allowed-range-3" (click)="allowedDateRange.set(3)">allowed-range-3</button>
    </div>
  `,
})
class StoryCalendarTestsShell {
  protected readonly DAY = DAY;

  protected readonly allowRangeSelection = signal<boolean>(false);
  protected readonly allowPartialRangeSelection = signal<boolean>(false);
  protected readonly partialRangeSelectionType = signal<CalendarPartialRangeSelectionType>('range');
  protected readonly enableDeselection = signal<boolean>(true);
  protected readonly disabled = signal<boolean>(false);
  protected readonly containerClass = signal<string>('');
  protected readonly selectedStartDate = signal<DateTime | null | undefined>(undefined);
  protected readonly selectedEndDate = signal<DateTime | null | undefined>(undefined);
  protected readonly disableBefore = signal<DateTime | null | undefined>(undefined);
  protected readonly disableAfter = signal<DateTime | null | undefined>(undefined);
  protected readonly allowedDateRange = signal<number>(0);

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

  protected setSelectedStart(date: DateTime): void {
    this.selectedStartDate.set(date);
  }

  protected setSelectedEnd(date: DateTime): void {
    this.selectedEndDate.set(date);
  }

  protected clearSelection(): void {
    this.selectedStartDate.set(null);
    this.selectedEndDate.set(null);
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
  selector: 'story-calendar-footer-shell',
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
    <button type="button" data-testid="ctl-footer-class-extra" (click)="containerClass.set('extra-class')">
      footer-class-extra
    </button>
  `,
})
class StoryCalendarFooterShell {
  protected readonly containerClass = signal<string>('');
}

@Component({
  selector: 'story-calendar-footer-left-actions-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarFooterLeftActions],
  host: { class: 'block' },
  template: `
    <org-calendar-footer-left-actions data-testid="left-actions">
      <span data-testid="projected">projected</span>
    </org-calendar-footer-left-actions>
  `,
})
class StoryCalendarFooterLeftActionsShell {}

@Component({
  selector: 'story-calendar-footer-right-actions-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarFooterRightActions],
  host: { class: 'block' },
  template: `
    <org-calendar-footer-right-actions data-testid="right-actions">
      <span data-testid="projected">projected</span>
    </org-calendar-footer-right-actions>
  `,
})
class StoryCalendarFooterRightActionsShell {}

const meta: Meta = {
  title: 'Core/Components/Calendar/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-calendar-tests-shell />`,
  moduleMetadata: { imports: [StoryCalendarTestsShell] },
});

const renderFooterShell: Story['render'] = () => ({
  template: `<story-calendar-footer-shell />`,
  moduleMetadata: { imports: [StoryCalendarFooterShell] },
});

const renderLeftActionsShell: Story['render'] = () => ({
  template: `<story-calendar-footer-left-actions-shell />`,
  moduleMetadata: { imports: [StoryCalendarFooterLeftActionsShell] },
});

const renderRightActionsShell: Story['render'] = () => ({
  template: `<story-calendar-footer-right-actions-shell />`,
  moduleMetadata: { imports: [StoryCalendarFooterRightActionsShell] },
});

const findDayCell = (host: HTMLElement, day: number): HTMLButtonElement => {
  const cell = host.querySelector(`[aria-label="${dayLabel(day)}"]`);

  if (!cell) {
    throw new Error(`could not find day cell for "${dayLabel(day)}"`);
  }

  return cell as HTMLButtonElement;
};

export const RendersDefaultPartialRangeSelectionTypeAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await expect(host.getAttribute('data-partial-range-selection-type')).toBe('range');
  },
};

export const OmitsBooleanHostAttributesByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await expect(host.getAttribute('data-allow-range-selection')).toBeNull();
    await expect(host.getAttribute('data-allow-partial-range-selection')).toBeNull();
    await expect(host.getAttribute('data-disabled')).toBeNull();
    await expect(host.getAttribute('aria-disabled')).toBeNull();
  },
};

export const ReflectsEnableDeselectionAsEmptyAttributeByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await expect(host.getAttribute('data-enable-deselection')).toBe('');
  },
};

export const ContainerUsesTabindexZeroByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const container = host.querySelector('.container') as HTMLDivElement;

    await expect(container.getAttribute('tabindex')).toBe('0');
  },
};

export const RendersLiveAnnouncementRegion: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const live = host.querySelector('[aria-live="polite"]');

    await expect(live).not.toBeNull();
    await expect(live?.getAttribute('aria-atomic')).toBe('true');
  },
};

export const ReflectsAllowRangeAndAllowPartialRangeAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-allow-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-allow-partial-on'));

    await waitFor(() => {
      expect(host.getAttribute('data-allow-range-selection')).toBe('');
      expect(host.getAttribute('data-allow-partial-range-selection')).toBe('');
    });
  },
};

export const ReflectsPartialRangeSelectionTypeVerbatim: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-partial-type-on-or-after'));

    await waitFor(() => expect(host.getAttribute('data-partial-range-selection-type')).toBe('onOrAfter'));
  },
};

export const OmitsDataEnableDeselectionWhenFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-enable-deselection-off'));

    await waitFor(() => expect(host.getAttribute('data-enable-deselection')).toBeNull());
  },
};

export const AppliesDataDisabledAndAriaDisabledWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => {
      expect(host.getAttribute('data-disabled')).toBe('');
      expect(host.getAttribute('aria-disabled')).toBe('true');
    });
  },
};

export const SetsContainerTabindexNegativeOneWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => {
      const container = host.querySelector('.container') as HTMLDivElement;

      expect(container.getAttribute('tabindex')).toBe('-1');
    });
  },
};

export const AppliesContainerClassToContainer: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-container-class-extra'));

    await waitFor(() => {
      const container = host.querySelector('.container') as HTMLDivElement;

      expect(container.classList.contains('custom-container')).toBe(true);
    });
  },
};

export const RendersSevenWeekdayLabels: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const weekdays = host.querySelectorAll('.weekdays .weekday');

    await expect(weekdays.length).toBe(7);
  },
};

export const RendersSrOnlyWeekdayColumnHeaders: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const headers = host.querySelectorAll('[role="row"].sr-only [role="columnheader"]');

    await expect(headers.length).toBe(7);
    await expect(headers[0].textContent?.trim()).toBe('Sunday');
    await expect(headers[6].textContent?.trim()).toBe('Saturday');
  },
};

export const RendersDayButtonsWithNumericContent: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const cells = host.querySelectorAll('.day');

    await expect(cells.length).toBeGreaterThanOrEqual(28);
    cells.forEach((cell) => {
      const num = cell.querySelector('.day-num');

      expect(num?.textContent?.trim()).toMatch(/^\d+$/);
    });
  },
};

export const AppliesAriaCurrentToTodayCell: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const todayCell = host.querySelector('[data-today]');
    const otherCell = host.querySelector('.day:not([data-today])');

    await expect(todayCell?.getAttribute('aria-current')).toBe('date');
    await expect(otherCell?.getAttribute('aria-current')).toBeNull();
  },
};

export const MarksOutsideMonthCellsWithDataAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const outsideCell = host.querySelector('.day[data-outside-month]');

    await expect(outsideCell).not.toBeNull();
  },
};

export const ReflectsAriaSelectedOnSelectedStartCell: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-selected-start-day-10'));

    await waitFor(() => {
      const cell = findDayCell(host, 10);

      expect(cell.getAttribute('aria-selected')).toBe('true');
      expect(cell.getAttribute('data-selected')).toBe('');
    });
  },
};

export const RendersPreviousAndNextButtons: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const previous = host.querySelector('org-calendar-header org-button[ariaLabel="Previous month"]');
    const next = host.querySelector('org-calendar-header org-button[ariaLabel="Next month"]');

    await expect(previous).not.toBeNull();
    await expect(next).not.toBeNull();
  },
};

export const RendersMonthAndYearDropDownSelectors: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const selectors = host.querySelectorAll('org-calendar-header org-drop-down-selector');

    await expect(selectors.length).toBe(2);
  },
};

export const EmitsDisplayMonthChangedOnPreviousClick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');
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
  },
};

export const EmitsDisplayMonthChangedOnNextClick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');
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
  },
};

export const PreviousAndNextDoNotEmitWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

    const previousButton = host.querySelector(
      'org-calendar-header org-button[ariaLabel="Previous month"] button'
    ) as HTMLButtonElement;
    const nextButton = host.querySelector(
      'org-calendar-header org-button[ariaLabel="Next month"] button'
    ) as HTMLButtonElement;

    previousButton.click();
    nextButton.click();

    await expect(readout.textContent).toContain('displayMonthChanged=0');
  },
};

export const PartialRangeToggleHiddenWhenRangeDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const toggle = host.querySelector('org-calendar-partial-range-selector org-button-toggle');

    await expect(toggle).toBeNull();
  },
};

export const PartialRangeToggleHiddenWhenOnlyPartialEnabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-allow-partial-on'));

    const toggle = host.querySelector('org-calendar-partial-range-selector org-button-toggle');

    await expect(toggle).toBeNull();
  },
};

export const PartialRangeToggleRenderedWhenBothEnabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-allow-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-allow-partial-on'));

    await waitFor(() => {
      const toggle = host.querySelector('org-calendar-partial-range-selector org-button-toggle');

      expect(toggle).not.toBeNull();
    });
  },
};

export const ClickingDayEmitsDateSelected: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(findDayCell(host, 12));

    await waitFor(() => {
      expect(readout.textContent).toContain('dateSelected=1');
      expect(readout.textContent).toContain(`lastStart=${DAY(12).toISODate()}`);
      expect(readout.textContent).toContain('lastEnd=null');
    });
  },
};

export const ClickingDayDoesNotEmitWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));
    await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

    findDayCell(host, 12).click();

    await expect(readout.textContent).toContain('dateSelected=0');
  },
};

export const ClickingSelectedStartDeselectsWhenEnabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-selected-start-day-10'));
    await waitFor(() => expect(findDayCell(host, 10).getAttribute('aria-selected')).toBe('true'));

    await userEvent.click(findDayCell(host, 10));

    await waitFor(() => {
      expect(readout.textContent).toContain('lastStart=null');
      expect(readout.textContent).toContain('lastEnd=null');
    });
  },
};

export const DoesNotDeselectWhenEnableDeselectionFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-enable-deselection-off'));
    await userEvent.click(canvas.getByTestId('ctl-selected-start-day-10'));
    await waitFor(() => expect(findDayCell(host, 10).getAttribute('aria-selected')).toBe('true'));

    await userEvent.click(findDayCell(host, 10));

    await waitFor(() => {
      expect(readout.textContent).toContain(`lastStart=${DAY(10).toISODate()}`);
      expect(readout.textContent).not.toContain('lastStart=null');
    });
  },
};

export const RangeModeClickAfterStartCompletesRange: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-allow-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-selected-start-day-5'));
    await waitFor(() => expect(findDayCell(host, 5).getAttribute('aria-selected')).toBe('true'));

    await userEvent.click(findDayCell(host, 12));

    await waitFor(() => {
      expect(readout.textContent).toContain(`lastStart=${DAY(5).toISODate()}`);
      expect(readout.textContent).toContain(`lastEnd=${DAY(12).toISODate()}`);
    });
  },
};

export const RangeModeClickBeforeStartReversesRange: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-allow-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-selected-start-day-15'));
    await waitFor(() => expect(findDayCell(host, 15).getAttribute('aria-selected')).toBe('true'));

    await userEvent.click(findDayCell(host, 5));

    await waitFor(() => {
      expect(readout.textContent).toContain(`lastStart=${DAY(5).toISODate()}`);
      expect(readout.textContent).toContain(`lastEnd=${DAY(15).toISODate()}`);
    });
  },
};

export const RangeModeClickInsideRangeUpdatesEnd: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-allow-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-selected-start-day-5'));
    await userEvent.click(canvas.getByTestId('ctl-selected-end-day-20'));
    await waitFor(() => expect(findDayCell(host, 5).getAttribute('aria-selected')).toBe('true'));

    await userEvent.click(findDayCell(host, 12));

    await waitFor(() => {
      expect(readout.textContent).toContain(`lastStart=${DAY(5).toISODate()}`);
      expect(readout.textContent).toContain(`lastEnd=${DAY(12).toISODate()}`);
    });
  },
};

export const PartialRangeOnOrAfterEmitsStartOnly: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-allow-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-allow-partial-on'));
    await userEvent.click(canvas.getByTestId('ctl-partial-type-on-or-after'));

    await userEvent.click(findDayCell(host, 12));

    await waitFor(() => {
      expect(readout.textContent).toContain(`lastStart=${DAY(12).toISODate()}`);
      expect(readout.textContent).toContain('lastEnd=null');
    });
  },
};

export const PartialRangeOnOrBeforeEmitsEndOnly: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-allow-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-allow-partial-on'));
    await userEvent.click(canvas.getByTestId('ctl-partial-type-on-or-before'));

    await userEvent.click(findDayCell(host, 12));

    await waitFor(() => {
      expect(readout.textContent).toContain('lastStart=null');
      expect(readout.textContent).toContain(`lastEnd=${DAY(12).toISODate()}`);
    });
  },
};

export const ClickingOutsideMonthNudgesDisplay: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');
    const today = DateTime.now();
    const outsideCell = host.querySelector('.day[data-outside-month]') as HTMLButtonElement;
    const ariaLabel = outsideCell.getAttribute('aria-label') as string;
    const clickedDate = DateTime.fromFormat(ariaLabel, 'MMMM d, yyyy');

    await userEvent.click(outsideCell);

    await waitFor(() => {
      expect(readout.textContent).toContain(`lastCurrent=${clickedDate.month}/${clickedDate.year}`);
      expect(readout.textContent).toContain(`lastPrevious=${today.month}/${today.year}`);
    });
  },
};

export const DisableBeforeMarksEarlierDatesDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-disable-before-day-10'));

    await waitFor(() => {
      expect(findDayCell(host, 9).getAttribute('aria-disabled')).toBe('true');
      expect(findDayCell(host, 10).getAttribute('aria-disabled')).toBeNull();
      expect(findDayCell(host, 11).getAttribute('aria-disabled')).toBeNull();
    });
  },
};

export const DisableAfterMarksLaterDatesDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-disable-after-day-20'));

    await waitFor(() => {
      expect(findDayCell(host, 19).getAttribute('aria-disabled')).toBeNull();
      expect(findDayCell(host, 20).getAttribute('aria-disabled')).toBeNull();
      expect(findDayCell(host, 21).getAttribute('aria-disabled')).toBe('true');
    });
  },
};

export const InvalidDisableRangeIsIgnored: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-disable-before-day-20'));
    await userEvent.click(canvas.getByTestId('ctl-disable-after-day-10'));

    await waitFor(() => {
      expect(findDayCell(host, 5).getAttribute('aria-disabled')).toBeNull();
      expect(findDayCell(host, 15).getAttribute('aria-disabled')).toBeNull();
      expect(findDayCell(host, 25).getAttribute('aria-disabled')).toBeNull();
    });
  },
};

export const AllowedDateRangeLimitsClicksWithStart: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-selected-start-day-10'));
    await userEvent.click(canvas.getByTestId('ctl-allowed-range-3'));

    await waitFor(() => {
      expect(findDayCell(host, 12).getAttribute('aria-disabled')).toBeNull();
      expect(findDayCell(host, 13).getAttribute('aria-disabled')).toBe('true');
      expect(findDayCell(host, 8).getAttribute('aria-disabled')).toBeNull();
      expect(findDayCell(host, 7).getAttribute('aria-disabled')).toBe('true');
    });
  },
};

export const ClickingDisabledCellDoesNotEmit: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-disable-before-day-20'));
    await waitFor(() => expect(findDayCell(host, 10).getAttribute('aria-disabled')).toBe('true'));

    findDayCell(host, 10).click();

    await expect(readout.textContent).toContain('dateSelected=0');
  },
};

export const ArrowLeftMovesFocusBackOneDay: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const container = host.querySelector('.container') as HTMLDivElement;

    fireEvent.mouseEnter(findDayCell(host, 15));
    await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

    fireEvent.keyDown(container, { key: 'ArrowLeft' });

    await waitFor(() => expect(findDayCell(host, 14).getAttribute('data-focused')).toBe(''));
  },
};

export const ArrowRightMovesFocusForwardOneDay: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const container = host.querySelector('.container') as HTMLDivElement;

    fireEvent.mouseEnter(findDayCell(host, 15));
    await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

    fireEvent.keyDown(container, { key: 'ArrowRight' });

    await waitFor(() => expect(findDayCell(host, 16).getAttribute('data-focused')).toBe(''));
  },
};

export const ArrowUpMovesFocusBackOneWeek: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const container = host.querySelector('.container') as HTMLDivElement;
    const today = DateTime.now();
    const start = today.set({ day: 15 });
    const expected = start.minus({ weeks: 1 });

    fireEvent.mouseEnter(findDayCell(host, 15));
    await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

    fireEvent.keyDown(container, { key: 'ArrowUp' });

    await waitFor(() =>
      expect(host.querySelector(`[aria-label="${expected.toFormat('MMMM d, yyyy')}"][data-focused]`)).not.toBeNull()
    );
  },
};

export const ArrowDownMovesFocusForwardOneWeek: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const container = host.querySelector('.container') as HTMLDivElement;
    const today = DateTime.now();
    const start = today.set({ day: 15 });
    const expected = start.plus({ weeks: 1 });

    fireEvent.mouseEnter(findDayCell(host, 15));
    await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

    fireEvent.keyDown(container, { key: 'ArrowDown' });

    await waitFor(() =>
      expect(host.querySelector(`[aria-label="${expected.toFormat('MMMM d, yyyy')}"][data-focused]`)).not.toBeNull()
    );
  },
};

export const PageUpMovesFocusBackOneMonth: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const container = host.querySelector('.container') as HTMLDivElement;
    const today = DateTime.now();
    const start = today.set({ day: 15 });
    const expected = start.minus({ months: 1 });

    fireEvent.mouseEnter(findDayCell(host, 15));
    await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

    fireEvent.keyDown(container, { key: 'PageUp' });

    await waitFor(() =>
      expect(host.querySelector(`[aria-label="${expected.toFormat('MMMM d, yyyy')}"][data-focused]`)).not.toBeNull()
    );
  },
};

export const PageDownMovesFocusForwardOneMonth: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const container = host.querySelector('.container') as HTMLDivElement;
    const today = DateTime.now();
    const start = today.set({ day: 15 });
    const expected = start.plus({ months: 1 });

    fireEvent.mouseEnter(findDayCell(host, 15));
    await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

    fireEvent.keyDown(container, { key: 'PageDown' });

    await waitFor(() =>
      expect(host.querySelector(`[aria-label="${expected.toFormat('MMMM d, yyyy')}"][data-focused]`)).not.toBeNull()
    );
  },
};

export const HomeMovesFocusToStartOfMonth: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const container = host.querySelector('.container') as HTMLDivElement;
    const expectedDay = DateTime.now().startOf('month').day;

    fireEvent.mouseEnter(findDayCell(host, 15));
    await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

    fireEvent.keyDown(container, { key: 'Home' });

    await waitFor(() => expect(findDayCell(host, expectedDay).getAttribute('data-focused')).toBe(''));
  },
};

export const EndMovesFocusToEndOfMonth: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const container = host.querySelector('.container') as HTMLDivElement;
    const expectedDay = DateTime.now().endOf('month').day;

    fireEvent.mouseEnter(findDayCell(host, 15));
    await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

    fireEvent.keyDown(container, { key: 'End' });

    await waitFor(() => expect(findDayCell(host, expectedDay).getAttribute('data-focused')).toBe(''));
  },
};

export const EnterSelectsFocusedDate: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');
    const container = host.querySelector('.container') as HTMLDivElement;

    fireEvent.mouseEnter(findDayCell(host, 12));
    await waitFor(() => expect(findDayCell(host, 12).getAttribute('data-focused')).toBe(''));

    fireEvent.keyDown(container, { key: 'Enter' });

    await waitFor(() => {
      expect(readout.textContent).toContain('dateSelected=1');
      expect(readout.textContent).toContain(`lastStart=${DAY(12).toISODate()}`);
    });
  },
};

export const SpaceSelectsFocusedDate: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');
    const container = host.querySelector('.container') as HTMLDivElement;

    fireEvent.mouseEnter(findDayCell(host, 12));
    await waitFor(() => expect(findDayCell(host, 12).getAttribute('data-focused')).toBe(''));

    fireEvent.keyDown(container, { key: ' ' });

    await waitFor(() => {
      expect(readout.textContent).toContain('dateSelected=1');
      expect(readout.textContent).toContain(`lastStart=${DAY(12).toISODate()}`);
    });
  },
};

export const BoundaryCrossingChangesDisplayMonth: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');
    const container = host.querySelector('.container') as HTMLDivElement;
    const today = DateTime.now();
    const firstOfMonthDay = today.startOf('month').day;
    const expected = today.startOf('month').minus({ days: 1 });

    fireEvent.mouseEnter(findDayCell(host, firstOfMonthDay));
    await waitFor(() => expect(findDayCell(host, firstOfMonthDay).getAttribute('data-focused')).toBe(''));

    fireEvent.keyDown(container, { key: 'ArrowLeft' });

    await waitFor(() => {
      expect(readout.textContent).toContain(`lastCurrent=${expected.month}/${expected.year}`);
      expect(readout.textContent).toContain(`lastPrevious=${today.month}/${today.year}`);
    });
  },
};

export const KeyboardNavigationDoesNothingWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const container = host.querySelector('.container') as HTMLDivElement;

    fireEvent.mouseEnter(findDayCell(host, 15));
    await waitFor(() => expect(findDayCell(host, 15).getAttribute('data-focused')).toBe(''));

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));
    await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

    fireEvent.keyDown(container, { key: 'ArrowLeft' });

    await expect(findDayCell(host, 15).getAttribute('data-focused')).toBe('');
    await expect(findDayCell(host, 14).getAttribute('data-focused')).toBeNull();
  },
};

export const HoveringDateMovesFocusedAndHovered: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    fireEvent.mouseEnter(findDayCell(host, 12));

    await waitFor(() => expect(findDayCell(host, 12).getAttribute('data-focused')).toBe(''));
  },
};

export const HoveringDoesNothingWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));
    await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

    fireEvent.mouseEnter(findDayCell(host, 12));

    await expect(findDayCell(host, 12).getAttribute('data-focused')).toBeNull();
  },
};

export const MouseLeaveOnGridClearsPreviewState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-allow-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-selected-start-day-5'));
    await waitFor(() => expect(findDayCell(host, 5).getAttribute('aria-selected')).toBe('true'));

    fireEvent.mouseEnter(findDayCell(host, 12));
    await waitFor(() => expect(findDayCell(host, 12).getAttribute('data-range-pos')).toBe('preview-end'));

    const grid = host.querySelector('[role="grid"]') as HTMLDivElement;
    fireEvent.mouseLeave(grid);

    await waitFor(() => expect(findDayCell(host, 12).getAttribute('data-range-pos')).toBeNull());
  },
};

export const SwitchingToOnOrAfterReshapesCommittedRangeToStartOnly: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-allow-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-allow-partial-on'));
    await userEvent.click(canvas.getByTestId('ctl-selected-start-day-5'));
    await userEvent.click(canvas.getByTestId('ctl-selected-end-day-20'));
    await waitFor(() => expect(findDayCell(host, 5).getAttribute('aria-selected')).toBe('true'));

    await userEvent.click(canvas.getByTestId('ctl-partial-type-on-or-after'));

    await waitFor(() => {
      expect(readout.textContent).toContain(`lastStart=${DAY(5).toISODate()}`);
      expect(readout.textContent).toContain('lastEnd=null');
    });
  },
};

export const SwitchingToOnOrBeforeReshapesCommittedRangeToEndOnly: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-allow-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-allow-partial-on'));
    await userEvent.click(canvas.getByTestId('ctl-selected-start-day-5'));
    await userEvent.click(canvas.getByTestId('ctl-selected-end-day-20'));
    await waitFor(() => expect(findDayCell(host, 5).getAttribute('aria-selected')).toBe('true'));

    await userEvent.click(canvas.getByTestId('ctl-partial-type-on-or-before'));

    await waitFor(() => {
      expect(readout.textContent).toContain('lastStart=null');
      expect(readout.textContent).toContain(`lastEnd=${DAY(20).toISODate()}`);
    });
  },
};

export const SwitchingTypeDoesNothingWithoutSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-allow-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-allow-partial-on'));

    await userEvent.click(canvas.getByTestId('ctl-partial-type-on-or-after'));

    await expect(readout.textContent).toContain('dateSelected=0');
  },
};

export const CommittedRangeAppliesStartMiddleEndRangePos: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-allow-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-selected-start-day-5'));
    await userEvent.click(canvas.getByTestId('ctl-selected-end-day-10'));

    await waitFor(() => {
      expect(findDayCell(host, 5).getAttribute('data-range-pos')).toBe('start');
      expect(findDayCell(host, 10).getAttribute('data-range-pos')).toBe('end');
      expect(findDayCell(host, 7).getAttribute('data-range-pos')).toBe('middle');
    });
  },
};

export const SameDayStartAndEndAppliesSingleRangePos: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-allow-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-selected-start-day-10'));
    await userEvent.click(canvas.getByTestId('ctl-selected-end-day-10'));

    await waitFor(() => expect(findDayCell(host, 10).getAttribute('data-range-pos')).toBe('single'));
  },
};

export const HoverAfterStartAppliesPreviewEndAndPreview: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-allow-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-selected-start-day-5'));
    await waitFor(() => expect(findDayCell(host, 5).getAttribute('aria-selected')).toBe('true'));

    fireEvent.mouseEnter(findDayCell(host, 10));

    await waitFor(() => {
      expect(findDayCell(host, 5).getAttribute('data-range-pos')).toBe('start');
      expect(findDayCell(host, 10).getAttribute('data-range-pos')).toBe('preview-end');
      expect(findDayCell(host, 7).getAttribute('data-range-pos')).toBe('preview');
    });
  },
};

export const HoverBeforeStartAppliesPreviewStartAndPreview: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('calendar');

    await userEvent.click(canvas.getByTestId('ctl-allow-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-selected-start-day-15'));
    await waitFor(() => expect(findDayCell(host, 15).getAttribute('aria-selected')).toBe('true'));

    fireEvent.mouseEnter(findDayCell(host, 10));

    await waitFor(() => {
      expect(findDayCell(host, 15).getAttribute('data-range-pos')).toBe('end');
      expect(findDayCell(host, 10).getAttribute('data-range-pos')).toBe('preview-start');
      expect(findDayCell(host, 12).getAttribute('data-range-pos')).toBe('preview');
    });
  },
};

export const FooterAppliesContainerClass: Story = {
  render: renderFooterShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-footer-class-extra'));

    await waitFor(() => {
      const footer = canvasElement.querySelector('[data-testid="footer"] .footer') as HTMLElement;

      expect(footer.classList.contains('extra-class')).toBe(true);
    });
  },
};

export const FooterProjectsLeftActionsContent: Story = {
  render: renderFooterShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const footer = await canvas.findByTestId('footer');
    const leftSlot = footer.querySelector('.actions-left') as HTMLElement;

    await expect(leftSlot.querySelector('[data-testid="left-projected"]')).not.toBeNull();
  },
};

export const FooterProjectsRightActionsContent: Story = {
  render: renderFooterShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const footer = await canvas.findByTestId('footer');
    const rightSlot = footer.querySelector('.actions-right') as HTMLElement;

    await expect(rightSlot.querySelector('[data-testid="right-projected"]')).not.toBeNull();
  },
};

export const FooterLeftActionsProjectsContent: Story = {
  render: renderLeftActionsShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('left-actions');

    await expect(host.querySelector('[data-testid="projected"]')).not.toBeNull();
  },
};

export const FooterRightActionsProjectsContent: Story = {
  render: renderRightActionsShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('right-actions');

    await expect(host.querySelector('[data-testid="projected"]')).not.toBeNull();
  },
};
