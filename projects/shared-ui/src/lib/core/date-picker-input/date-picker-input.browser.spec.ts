import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DateTime } from 'luxon';
import { DateFormat, TimeFormat } from '@organization/shared-utils';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { DatePickerInput, type DatePickerInputCommitMode } from './date-picker-input';
import type { CalendarPartialRangeSelectionType } from '../calendar/calendar-brain';

type DatePickerSelection = { startDate: DateTime | null; endDate: DateTime | null };

const FIXED_HOUR = 14;
const FIXED_MINUTE = 30;

/** returns a stable DateTime in the current month at a fixed time of day */
const fixedDay = (day: number): DateTime =>
  DateTime.now().set({ day, hour: FIXED_HOUR, minute: FIXED_MINUTE, second: 0, millisecond: 0 });

/** returns the calendar day-cell aria-label for a given day of the current month */
const dayLabelFor = (day: number): string => fixedDay(day).toFormat('MMMM d, yyyy');

/** returns the iso date string for a given day of the current month (used in readouts) */
const isoDateFor = (day: number): string => fixedDay(day).toISODate() ?? '';

@Component({
  selector: 'test-date-picker-input-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePickerInput],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
      }
      .picker-wrapper {
        width: 22rem; /* 352px */
      }
    `,
  ],
  template: `
    <div class="picker-wrapper">
      <org-date-picker-input
        data-testid="date-picker"
        name="test-date-picker"
        [placeholder]="placeholder()"
        [dateFormat]="dateFormat()"
        [timeFormat]="timeFormat()"
        [allowRangeSelection]="allowRangeSelection()"
        [allowPartialRangeSelection]="allowPartialRangeSelection()"
        [partialRangeSelectionType]="partialRangeSelectionType()"
        [selectedStartDate]="selectedStartDate()"
        [selectedEndDate]="selectedEndDate()"
        [defaultDisplayDate]="defaultDisplayDate()"
        [disabled]="disabled()"
        [allowClear]="allowClear()"
        [allowTriggerClear]="allowTriggerClear()"
        [commitMode]="commitMode()"
        [resetOnModeChange]="resetOnModeChange()"
        (dateSelected)="onDateSelected($event)"
        (partialRangeSelectionTypeChange)="onPartialRangeSelectionTypeChange($event)"
        (focused)="onFocused()"
        (blurred)="onBlurred()"
      />
    </div>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class DatePickerInputInteractiveHost {
  public readonly placeholder = signal<string>('Pick a date');
  public readonly dateFormat = signal<DateFormat>(DateFormat.STANDARD);
  public readonly timeFormat = signal<TimeFormat | undefined>(undefined);
  public readonly allowRangeSelection = signal<boolean>(false);
  public readonly allowPartialRangeSelection = signal<boolean>(false);
  public readonly partialRangeSelectionType = signal<CalendarPartialRangeSelectionType>('range');
  public readonly selectedStartDate = signal<DateTime | null>(null);
  public readonly selectedEndDate = signal<DateTime | null>(null);
  public readonly defaultDisplayDate = signal<DateTime>(DateTime.now());
  public readonly disabled = signal<boolean>(false);
  public readonly allowClear = signal<boolean>(true);
  public readonly allowTriggerClear = signal<boolean>(false);
  public readonly commitMode = signal<DatePickerInputCommitMode>('auto');
  public readonly resetOnModeChange = signal<boolean>(true);

  protected readonly lastStart = signal<string>('none');
  protected readonly lastEnd = signal<string>('none');
  protected readonly lastPartialType = signal<string>('none');
  protected readonly dateSelectedCount = signal<number>(0);
  protected readonly partialRangeTypeChangeCount = signal<number>(0);
  protected readonly focusedCount = signal<number>(0);
  protected readonly blurredCount = signal<number>(0);

  protected readout(): string {
    return [
      `lastStart=${this.lastStart()}`,
      `lastEnd=${this.lastEnd()}`,
      `lastPartialType=${this.lastPartialType()}`,
      `dateSelectedCount=${this.dateSelectedCount()}`,
      `partialRangeTypeChangeCount=${this.partialRangeTypeChangeCount()}`,
      `focusedCount=${this.focusedCount()}`,
      `blurredCount=${this.blurredCount()}`,
    ].join(' ');
  }

  protected onDateSelected(selection: DatePickerSelection): void {
    this.lastStart.set(selection.startDate ? (selection.startDate.toISODate() ?? 'invalid') : 'null');
    this.lastEnd.set(selection.endDate ? (selection.endDate.toISODate() ?? 'invalid') : 'null');
    this.dateSelectedCount.update((value) => value + 1);

    // mirror the committed selection back into the bound inputs so the trigger reflects it
    this.selectedStartDate.set(selection.startDate);
    this.selectedEndDate.set(selection.endDate);
  }

  protected onPartialRangeSelectionTypeChange(type: CalendarPartialRangeSelectionType): void {
    this.lastPartialType.set(type);
    this.partialRangeTypeChangeCount.update((value) => value + 1);
  }

  protected onFocused(): void {
    this.focusedCount.update((value) => value + 1);
  }

  protected onBlurred(): void {
    this.blurredCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'test-date-picker-input-reactive-form-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePickerInput, ReactiveFormsModule],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
      }
      .picker-wrapper {
        width: 22rem; /* 352px */
      }
    `,
  ],
  template: `
    <div class="picker-wrapper">
      <org-date-picker-input
        data-testid="date-picker"
        name="reactive-form-date-picker"
        placeholder="Pick a date"
        [formControl]="formControl"
        [allowRangeSelection]="false"
      />
    </div>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class DatePickerInputReactiveFormHost {
  public readonly formControl = new FormControl<DatePickerSelection | null>(
    { startDate: null, endDate: null },
    { nonNullable: false }
  );

  /**
   * subscribes to every form-control event so OnPush change detection re-runs the readout after the cva chain
   * finishes pushing into the formControl, avoiding a stale read of formControl.value
   */
  private readonly _formEvents = toSignal(this.formControl.events, { initialValue: null });

  protected readout(): string {
    this._formEvents();

    const value = this.formControl.value;
    const startIso = value?.startDate ? (value.startDate.toISODate() ?? 'invalid') : 'null';
    const endIso = value?.endDate ? (value.endDate.toISODate() ?? 'invalid') : 'null';

    return [
      `start=${startIso}`,
      `end=${endIso}`,
      `disabled=${this.formControl.disabled}`,
      `touched=${this.formControl.touched}`,
      `dirty=${this.formControl.dirty}`,
    ].join(' ');
  }

  public setFormValueDay10(): void {
    this.formControl.setValue({ startDate: fixedDay(10), endDate: null });
  }

  public setFormValueNull(): void {
    this.formControl.setValue(null);
  }
}

type DatePickerInputHostConfig = {
  placeholder?: string;
  dateFormat?: DateFormat;
  timeFormat?: TimeFormat | undefined;
  allowRangeSelection?: boolean;
  allowPartialRangeSelection?: boolean;
  partialRangeSelectionType?: CalendarPartialRangeSelectionType;
  selectedStartDate?: DateTime | null;
  selectedEndDate?: DateTime | null;
  disabled?: boolean;
  allowClear?: boolean;
  allowTriggerClear?: boolean;
  commitMode?: DatePickerInputCommitMode;
  resetOnModeChange?: boolean;
};

describe('DatePickerInput (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractivePicker = (
    config: DatePickerInputHostConfig = {}
  ): ComponentFixture<DatePickerInputInteractiveHost> =>
    createFixture(DatePickerInputInteractiveHost, (instance) => {
      if (config.placeholder !== undefined) {
        instance.placeholder.set(config.placeholder);
      }

      if (config.dateFormat !== undefined) {
        instance.dateFormat.set(config.dateFormat);
      }

      if (config.timeFormat !== undefined) {
        instance.timeFormat.set(config.timeFormat);
      }

      if (config.allowRangeSelection !== undefined) {
        instance.allowRangeSelection.set(config.allowRangeSelection);
      }

      if (config.allowPartialRangeSelection !== undefined) {
        instance.allowPartialRangeSelection.set(config.allowPartialRangeSelection);
      }

      if (config.partialRangeSelectionType !== undefined) {
        instance.partialRangeSelectionType.set(config.partialRangeSelectionType);
      }

      if (config.selectedStartDate !== undefined) {
        instance.selectedStartDate.set(config.selectedStartDate);
      }

      if (config.selectedEndDate !== undefined) {
        instance.selectedEndDate.set(config.selectedEndDate);
      }

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }

      if (config.allowClear !== undefined) {
        instance.allowClear.set(config.allowClear);
      }

      if (config.allowTriggerClear !== undefined) {
        instance.allowTriggerClear.set(config.allowTriggerClear);
      }

      if (config.commitMode !== undefined) {
        instance.commitMode.set(config.commitMode);
      }

      if (config.resetOnModeChange !== undefined) {
        instance.resetOnModeChange.set(config.resetOnModeChange);
      }
    });

  // the cdk overlay panel renders outside the fixture, attached to document.body
  const queryOverlayPanel = (): HTMLElement | null => document.body.querySelector('.org-date-picker-input-overlay');

  const waitForOverlayPanel = async (): Promise<HTMLElement> => {
    await waitFor(() => expect(queryOverlayPanel()).not.toBeNull());

    return queryOverlayPanel() as HTMLElement;
  };

  const waitForOverlayDetached = async (): Promise<void> => {
    await waitFor(() => expect(queryOverlayPanel()).toBeNull());
  };

  /** finds a calendar day cell button inside the given root by day-of-month */
  const findDayCell = (root: HTMLElement, day: number): HTMLButtonElement => {
    const cell = root.querySelector(`[aria-label="${dayLabelFor(day)}"]`);

    if (!cell) {
      throw new Error(`could not find day cell for "${dayLabelFor(day)}"`);
    }

    return cell as HTMLButtonElement;
  };

  /** finds a partial-range-selector button inside the overlay by its visible label */
  const findPartialRangeButton = (panel: HTMLElement, label: string): HTMLElement => {
    const buttons = panel.querySelectorAll('org-calendar-partial-range-selector button');
    const button = Array.from(buttons).find((candidate) => candidate.textContent?.trim() === label);

    if (!button) {
      throw new Error(`could not find partial-range button with label "${label}"`);
    }

    return button as HTMLElement;
  };

  /** finds a calendar footer button (Clear / Apply / Cancel) by its visible label */
  const findFooterButton = (panel: HTMLElement, label: string): HTMLElement => {
    const buttons = panel.querySelectorAll('org-calendar-footer button');
    const button = Array.from(buttons).find((candidate) => candidate.textContent?.trim() === label);

    if (!button) {
      throw new Error(`could not find footer button with label "${label}"`);
    }

    return button as HTMLElement;
  };

  /** finds the trigger-edge clear button (X icon) rendered when allowTriggerClear is on */
  const findTriggerClearButton = (host: HTMLElement): HTMLElement | null => {
    return host.querySelector('org-input button[aria-label="Clear date"]');
  };

  /** finds the trigger chevron button rendered when allowTriggerClear is on */
  const findTriggerChevronButton = (host: HTMLElement): HTMLElement | null => {
    return host.querySelector('org-input button.trigger-chevron');
  };

  /** parks the cursor on the trigger input then opens via click */
  const openViaInputClick = async (host: HTMLElement): Promise<void> => {
    await vitestBrowserUtils.focusInput(host, 'input.native');

    const nativeInput = host.querySelector('input.native') as HTMLInputElement;
    await userEvent.click(nativeInput);
  };

  beforeEach(setupTestBed);

  afterEach(() => {
    destroyFixture();

    // defensively clear any overlay panes / backdrops left in the body so a stale panel can't leak into the next test
    document.querySelectorAll('.org-date-picker-input-overlay').forEach((panel) => panel.remove());
    document.querySelectorAll('.cdk-overlay-backdrop').forEach((backdrop) => backdrop.remove());
  });

  describe('host data attributes', () => {
    it('renders the default date-format host attribute', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await flush(fixture);

      expect(host.getAttribute('data-date-format')).toBe(DateFormat.STANDARD);
    });

    it('reflects a custom date-format host attribute', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      fixture.componentInstance.dateFormat.set(DateFormat.SQL);

      await waitFor(() => expect(host.getAttribute('data-date-format')).toBe(DateFormat.SQL));
    });

    it('omits the allow-range-selection host attribute by default', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await flush(fixture);

      expect(host.getAttribute('data-allow-range-selection')).toBeNull();
    });

    it('reflects the allow-range-selection host attribute', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      fixture.componentInstance.allowRangeSelection.set(true);

      await waitFor(() => expect(host.getAttribute('data-allow-range-selection')).toBe(''));
    });

    it('reflects the allow-partial-range-selection host attribute', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      fixture.componentInstance.allowPartialRangeSelection.set(true);

      await waitFor(() => expect(host.getAttribute('data-allow-partial-range-selection')).toBe(''));
    });

    it('reflects the partial-range-selection-type host attribute', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await flush(fixture);
      expect(host.getAttribute('data-partial-range-selection-type')).toBe('range');

      fixture.componentInstance.partialRangeSelectionType.set('onOrAfter');

      await waitFor(() => expect(host.getAttribute('data-partial-range-selection-type')).toBe('onOrAfter'));
    });

    it('reflects the allow-clear host attribute on by default', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await flush(fixture);

      expect(host.getAttribute('data-allow-clear')).toBe('');
    });

    it('omits the allow-clear host attribute when off', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      fixture.componentInstance.allowClear.set(false);

      await waitFor(() => expect(host.getAttribute('data-allow-clear')).toBeNull());
    });

    it('reflects the allow-trigger-clear host attribute', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await flush(fixture);
      expect(host.getAttribute('data-allow-trigger-clear')).toBeNull();

      fixture.componentInstance.allowTriggerClear.set(true);

      await waitFor(() => expect(host.getAttribute('data-allow-trigger-clear')).toBe(''));
    });

    it('reflects the commit-mode host attribute', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await flush(fixture);
      expect(host.getAttribute('data-commit-mode')).toBe('auto');

      fixture.componentInstance.commitMode.set('manual');

      await waitFor(() => expect(host.getAttribute('data-commit-mode')).toBe('manual'));
    });
  });

  describe('brain a11y attributes', () => {
    it('applies role combobox and aria-haspopup dialog', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await flush(fixture);

      expect(host.getAttribute('role')).toBe('combobox');
      expect(host.getAttribute('aria-haspopup')).toBe('dialog');
    });

    it('applies aria-expanded false when closed', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await flush(fixture);

      expect(host.getAttribute('aria-expanded')).toBe('false');
    });

    it('applies aria-expanded true when open', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await openViaInputClick(host);
      await waitForOverlayPanel();

      await waitFor(() => expect(host.getAttribute('aria-expanded')).toBe('true'));
    });

    it('applies aria-controls pointing at the overlay dialog', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      const ariaControls = host.getAttribute('aria-controls');

      expect(ariaControls).toMatch(/^date-picker-overlay-/);

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      const dialog = panel.querySelector(`#${ariaControls}`);

      expect(dialog).not.toBeNull();
      expect(dialog?.getAttribute('role')).toBe('dialog');
      expect(dialog?.getAttribute('aria-modal')).toBe('true');
    });

    it('applies data-state closed when closed', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await flush(fixture);

      expect(host.getAttribute('data-state')).toBe('closed');
    });

    it('applies data-state open when open', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await openViaInputClick(host);
      await waitForOverlayPanel();

      await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
    });
  });

  describe('trigger display formatting', () => {
    it('shows the placeholder when empty', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await flush(fixture);

      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.placeholder).toBe('Pick a date');
      expect(nativeInput.value).toBe('');
    });

    it('shows a single date formatted', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      fixture.componentInstance.selectedStartDate.set(fixedDay(10));

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.value).toBe(fixedDay(10).toFormat(DateFormat.STANDARD));
      });
    });

    it('shows a committed range with a right arrow', async () => {
      const fixture = createInteractivePicker({ allowRangeSelection: true });
      const host = queryByTestId(fixture, 'date-picker');

      fixture.componentInstance.selectedStartDate.set(fixedDay(10));
      fixture.componentInstance.selectedEndDate.set(fixedDay(20));

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;
        const expected = `${fixedDay(10).toFormat(DateFormat.STANDARD)} → ${fixedDay(20).toFormat(DateFormat.STANDARD)}`;

        expect(nativeInput.value).toBe(expected);
      });
    });

    it('shows an in-progress range start with a trailing em-dash', async () => {
      const fixture = createInteractivePicker({ allowRangeSelection: true });
      const host = queryByTestId(fixture, 'date-picker');

      fixture.componentInstance.selectedStartDate.set(fixedDay(10));

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.value).toBe(`${fixedDay(10).toFormat(DateFormat.STANDARD)} —`);
      });
    });

    it('shows an in-progress range end with a leading em-dash', async () => {
      const fixture = createInteractivePicker({ allowRangeSelection: true });
      const host = queryByTestId(fixture, 'date-picker');

      fixture.componentInstance.selectedEndDate.set(fixedDay(20));

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.value).toBe(`— ${fixedDay(20).toFormat(DateFormat.STANDARD)}`);
      });
    });

    it('shows the "On or after" prefix for a partial range', async () => {
      const fixture = createInteractivePicker({
        allowRangeSelection: true,
        allowPartialRangeSelection: true,
        partialRangeSelectionType: 'onOrAfter',
      });
      const host = queryByTestId(fixture, 'date-picker');

      fixture.componentInstance.selectedStartDate.set(fixedDay(10));

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.value).toBe(`On or after ${fixedDay(10).toFormat(DateFormat.STANDARD)}`);
      });
    });

    it('shows the "On or before" prefix for a partial range', async () => {
      const fixture = createInteractivePicker({
        allowRangeSelection: true,
        allowPartialRangeSelection: true,
        partialRangeSelectionType: 'onOrBefore',
      });
      const host = queryByTestId(fixture, 'date-picker');

      fixture.componentInstance.selectedEndDate.set(fixedDay(20));

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.value).toBe(`On or before ${fixedDay(20).toFormat(DateFormat.STANDARD)}`);
      });
    });

    it('shows date and time when a time format is provided', async () => {
      const fixture = createInteractivePicker({ timeFormat: TimeFormat.STANDARD });
      const host = queryByTestId(fixture, 'date-picker');

      fixture.componentInstance.selectedStartDate.set(fixedDay(10));

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;
        const expected = fixedDay(10).toFormat(`${DateFormat.STANDARD} ${TimeFormat.STANDARD}`);

        expect(nativeInput.value).toBe(expected);
      });
    });

    it('re-renders the display value when switching date format', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      fixture.componentInstance.selectedStartDate.set(fixedDay(10));

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.value).toBe(fixedDay(10).toFormat(DateFormat.STANDARD));
      });

      fixture.componentInstance.dateFormat.set(DateFormat.SQL);

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.value).toBe(fixedDay(10).toFormat(DateFormat.SQL));
      });
    });
  });

  describe('open / close behavior', () => {
    it('opens the overlay on input click', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await openViaInputClick(host);

      await waitForOverlayPanel();
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
    });

    it('opens the overlay on the Enter key', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await vitestBrowserUtils.focusInput(host, 'input.native');
      await userEvent.keyboard('{Enter}');

      await waitForOverlayPanel();
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
    });

    it('opens the overlay on the Space key', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await vitestBrowserUtils.focusInput(host, 'input.native');
      await userEvent.keyboard(' ');

      await waitForOverlayPanel();
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
    });

    it('closes the overlay on a backdrop click', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await openViaInputClick(host);
      await waitForOverlayPanel();

      const backdrop = vitestBrowserUtils.queryCdkOverlayBackdrop() as HTMLElement;
      // a centered click would hit the overlay pane; offset to the corner so the backdrop receives it
      await userEvent.click(backdrop, { position: { x: 5, y: 5 } });

      await waitForOverlayDetached();
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('closed'));
    });

    it('does not open the overlay when disabled', async () => {
      const fixture = createInteractivePicker({ disabled: true });
      const host = queryByTestId(fixture, 'date-picker');

      await flush(fixture);

      // playwright refuses to click a disabled native input; dispatch a raw click on the org-input wrapper
      // so the brain's isDisabled() guard is exercised
      const orgInput = host.querySelector('org-input') as HTMLElement;
      orgInput.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

      await flush(fixture);

      expect(queryOverlayPanel()).toBeNull();
      expect(host.getAttribute('data-state')).toBe('closed');
    });

    it('renders a chevron-down post icon on the default trigger', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await flush(fixture);

      const chevronIcon = host.querySelector('org-input .post org-icon[data-icon="chevron-down"]');

      expect(chevronIcon).not.toBeNull();
    });
  });

  describe('selection — auto commit single', () => {
    it('auto-commits a single date on selection', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      await userEvent.click(findDayCell(panel, 15));

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastStart=${isoDateFor(15)}`);
        expect(readout.textContent).toContain('lastEnd=null');
        expect(readout.textContent).toContain('dateSelectedCount=1');
      });
    });

    it('closes the overlay after selecting a date in auto mode', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      await userEvent.click(findDayCell(panel, 15));

      await waitForOverlayDetached();
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('closed'));
    });
  });

  describe('selection — auto commit range', () => {
    it('picks the first date and waits for the second in range mode', async () => {
      const fixture = createInteractivePicker({ resetOnModeChange: false, allowRangeSelection: true });
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      await userEvent.click(findDayCell(panel, 10));

      // first click in range mode does not commit — overlay stays open and no emission
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
      expect(readout.textContent).toContain('dateSelectedCount=0');
    });

    it('auto-commits on the second date in range mode', async () => {
      const fixture = createInteractivePicker({ resetOnModeChange: false, allowRangeSelection: true });
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      await userEvent.click(findDayCell(panel, 10));
      await userEvent.click(findDayCell(panel, 20));

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastStart=${isoDateFor(10)}`);
        expect(readout.textContent).toContain(`lastEnd=${isoDateFor(20)}`);
        expect(readout.textContent).toContain('dateSelectedCount=1');
      });

      await waitForOverlayDetached();
    });
  });

  describe('selection — partial range', () => {
    it('auto-commits a single date for partial range "On or after"', async () => {
      const fixture = createInteractivePicker({
        resetOnModeChange: false,
        allowRangeSelection: true,
        allowPartialRangeSelection: true,
        partialRangeSelectionType: 'onOrAfter',
      });
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      await userEvent.click(findDayCell(panel, 12));

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastStart=${isoDateFor(12)}`);
        expect(readout.textContent).toContain('lastEnd=null');
        expect(readout.textContent).toContain('dateSelectedCount=1');
      });

      await waitForOverlayDetached();
    });

    it('auto-commits a single date for partial range "On or before"', async () => {
      const fixture = createInteractivePicker({
        resetOnModeChange: false,
        allowRangeSelection: true,
        allowPartialRangeSelection: true,
        partialRangeSelectionType: 'onOrBefore',
      });
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      await userEvent.click(findDayCell(panel, 22));

      await waitFor(() => {
        expect(readout.textContent).toContain('lastStart=null');
        expect(readout.textContent).toContain(`lastEnd=${isoDateFor(22)}`);
        expect(readout.textContent).toContain('dateSelectedCount=1');
      });

      await waitForOverlayDetached();
    });

    it('clears the in-progress selection when switching partial-range type in the popover', async () => {
      const fixture = createInteractivePicker({
        allowRangeSelection: true,
        allowPartialRangeSelection: true,
        partialRangeSelectionType: 'onOrAfter',
        commitMode: 'manual',
      });
      const host = queryByTestId(fixture, 'date-picker');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      // make an in-progress selection (manual mode keeps it staged)
      await userEvent.click(findDayCell(panel, 12));

      await waitFor(() => expect(findDayCell(panel, 12).getAttribute('aria-selected')).toBe('true'));

      // switch partial type — the brain clears the in-progress dates when crossing modes
      await userEvent.click(findPartialRangeButton(panel, 'On or Before'));

      await waitFor(() => expect(findDayCell(panel, 12).getAttribute('aria-selected')).toBe('false'));
    });
  });

  describe('manual commit mode', () => {
    it('does not auto-commit on selection in manual mode', async () => {
      const fixture = createInteractivePicker({ commitMode: 'manual' });
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      await userEvent.click(findDayCell(panel, 15));

      // overlay still open and no commit emitted
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
      expect(readout.textContent).toContain('dateSelectedCount=0');
    });

    it('disables the Apply button until the selection is complete', async () => {
      const fixture = createInteractivePicker({ commitMode: 'manual' });
      const host = queryByTestId(fixture, 'date-picker');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      const applyButton = findFooterButton(panel, 'Apply') as HTMLButtonElement;

      expect(applyButton.disabled).toBe(true);

      await userEvent.click(findDayCell(panel, 15));

      await waitFor(() => expect((findFooterButton(panel, 'Apply') as HTMLButtonElement).disabled).toBe(false));
    });

    it('commits the in-progress selection on Apply', async () => {
      const fixture = createInteractivePicker({ commitMode: 'manual' });
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      await userEvent.click(findDayCell(panel, 15));
      await userEvent.click(findFooterButton(panel, 'Apply'));

      await waitFor(() => {
        expect(readout.textContent).toContain(`lastStart=${isoDateFor(15)}`);
        expect(readout.textContent).toContain('dateSelectedCount=1');
      });

      await waitForOverlayDetached();
    });

    it('closes without committing on Cancel', async () => {
      const fixture = createInteractivePicker({ commitMode: 'manual' });
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      await userEvent.click(findDayCell(panel, 15));
      await userEvent.click(findFooterButton(panel, 'Cancel'));

      await waitForOverlayDetached();

      // no auto-commit emission for the in-progress selection
      expect(readout.textContent).toContain('dateSelectedCount=0');
    });

    it('renders Apply and Cancel buttons in manual mode', async () => {
      const fixture = createInteractivePicker({ commitMode: 'manual' });
      const host = queryByTestId(fixture, 'date-picker');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      expect(findFooterButton(panel, 'Apply')).not.toBeNull();
      expect(findFooterButton(panel, 'Cancel')).not.toBeNull();
    });

    it('does not render Apply and Cancel buttons in auto mode', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      // default commit mode is auto — open the popover and assert apply / cancel are absent
      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      const buttons = panel.querySelectorAll('org-calendar-footer button');
      const labels = Array.from(buttons).map((button) => button.textContent?.trim());

      expect(labels).not.toContain('Apply');
      expect(labels).not.toContain('Cancel');
    });
  });

  describe('clear behavior', () => {
    it('shows the Clear button when allow-clear is on and the overlay is open', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      expect(findFooterButton(panel, 'Clear')).not.toBeNull();
    });

    it('hides the Clear button when allow-clear is off', async () => {
      const fixture = createInteractivePicker({ allowClear: false });
      const host = queryByTestId(fixture, 'date-picker');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      // footer only renders when allowClear or manual mode is on — in auto mode + no clear, no footer at all
      const footer = panel.querySelector('org-calendar-footer');

      expect(footer).toBeNull();
    });

    it('disables the Clear button when no value is selected', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      const clearButton = findFooterButton(panel, 'Clear') as HTMLButtonElement;

      expect(clearButton.disabled).toBe(true);
    });

    it('enables the Clear button when a value is present', async () => {
      const fixture = createInteractivePicker({ selectedStartDate: fixedDay(10) });
      const host = queryByTestId(fixture, 'date-picker');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      await waitFor(() => {
        const clearButton = findFooterButton(panel, 'Clear') as HTMLButtonElement;

        expect(clearButton.disabled).toBe(false);
      });
    });

    it('clears the committed value via the Clear button', async () => {
      const fixture = createInteractivePicker({ selectedStartDate: fixedDay(10) });
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      await userEvent.click(findFooterButton(panel, 'Clear'));

      await waitFor(() => {
        expect(readout.textContent).toContain('lastStart=null');
        expect(readout.textContent).toContain('lastEnd=null');
      });

      await waitForOverlayDetached();
    });

    it('clears the value with the Delete key when the calendar is focused', async () => {
      const fixture = createInteractivePicker({ selectedStartDate: fixedDay(10) });
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      // dispatch keydown directly on the dialog wrapper so the brain's keydown router fires
      const dialog = panel.querySelector('[role="dialog"]') as HTMLElement;
      dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true }));

      await waitFor(() => {
        expect(readout.textContent).toContain('lastStart=null');
        expect(readout.textContent).toContain('lastEnd=null');
      });
    });

    it('clears the value with the Backspace key when the calendar is focused', async () => {
      const fixture = createInteractivePicker({ selectedStartDate: fixedDay(10) });
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      const dialog = panel.querySelector('[role="dialog"]') as HTMLElement;
      dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true }));

      await waitFor(() => {
        expect(readout.textContent).toContain('lastStart=null');
        expect(readout.textContent).toContain('lastEnd=null');
      });
    });
  });

  describe('trigger-edge clear', () => {
    it('hides the trigger clear button when there is no value', async () => {
      const fixture = createInteractivePicker({ allowTriggerClear: true });
      const host = queryByTestId(fixture, 'date-picker');

      await waitFor(() => expect(findTriggerClearButton(host)).toBeNull());
    });

    it('shows the trigger clear button when a value is present and allowed', async () => {
      const fixture = createInteractivePicker({ allowTriggerClear: true, selectedStartDate: fixedDay(10) });
      const host = queryByTestId(fixture, 'date-picker');

      await waitFor(() => expect(findTriggerClearButton(host)).not.toBeNull());
    });

    it('hides the trigger clear button when disabled', async () => {
      const fixture = createInteractivePicker({ allowTriggerClear: true, selectedStartDate: fixedDay(10) });
      const host = queryByTestId(fixture, 'date-picker');

      await waitFor(() => expect(findTriggerClearButton(host)).not.toBeNull());

      fixture.componentInstance.disabled.set(true);

      await waitFor(() => expect(findTriggerClearButton(host)).toBeNull());
    });

    it('clears the value via the trigger clear button without opening the overlay', async () => {
      const fixture = createInteractivePicker({ allowTriggerClear: true, selectedStartDate: fixedDay(10) });
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(findTriggerClearButton(host)).not.toBeNull());

      const clearButton = findTriggerClearButton(host) as HTMLElement;

      await userEvent.click(clearButton);

      await waitFor(() => {
        expect(readout.textContent).toContain('lastStart=null');
        expect(readout.textContent).toContain('lastEnd=null');
      });

      // overlay should not have been opened by the click
      expect(queryOverlayPanel()).toBeNull();
    });

    it('toggles the overlay with the trigger chevron when allow-trigger-clear is on', async () => {
      const fixture = createInteractivePicker({ allowTriggerClear: true });
      const host = queryByTestId(fixture, 'date-picker');

      await waitFor(() => expect(findTriggerChevronButton(host)).not.toBeNull());

      const chevronButton = findTriggerChevronButton(host) as HTMLElement;

      await userEvent.click(chevronButton);

      await waitForOverlayPanel();
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));

      // once open, the transparent backdrop covers the trigger chevron, so playwright's click is
      // intercepted; dispatch a raw click to exercise the toggle-closed path
      chevronButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

      await waitForOverlayDetached();
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('closed'));
    });

    it('does nothing on the trigger chevron when disabled', async () => {
      const fixture = createInteractivePicker({ allowTriggerClear: true, disabled: true });
      const host = queryByTestId(fixture, 'date-picker');

      await flush(fixture);

      const chevronButton = findTriggerChevronButton(host) as HTMLButtonElement;
      // playwright refuses to click a disabled button; dispatch a raw click to exercise the guard
      chevronButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

      await flush(fixture);

      expect(queryOverlayPanel()).toBeNull();
    });
  });

  describe('disabled state', () => {
    it('disables the native input when disabled', async () => {
      const fixture = createInteractivePicker({ disabled: true });
      const host = queryByTestId(fixture, 'date-picker');

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.disabled).toBe(true);
      });
    });
  });

  describe('outputs', () => {
    it('emits dateSelected on commit', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();
      await userEvent.click(findDayCell(panel, 15));

      await waitFor(() => expect(readout.textContent).toContain('dateSelectedCount=1'));
    });

    it('emits focused on input focus', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      await vitestBrowserUtils.focusInput(host, 'input.native');

      await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));
    });

    it('emits blurred on input blur', async () => {
      const fixture = createInteractivePicker();
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      const nativeInput = await vitestBrowserUtils.focusInput(host, 'input.native');
      await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));

      nativeInput.blur();

      await waitFor(() => expect(readout.textContent).toContain('blurredCount=1'));
    });

    it('emits partialRangeSelectionTypeChange on commit', async () => {
      const fixture = createInteractivePicker({ allowRangeSelection: true, allowPartialRangeSelection: true });
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      // start in partial range mode with type "range", switch to "onOrAfter" inside the popover and commit a
      // date — the brain emits the new type at commit time
      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();

      await userEvent.click(findPartialRangeButton(panel, 'On or After'));
      await userEvent.click(findDayCell(panel, 12));

      await waitFor(() => {
        expect(readout.textContent).toContain('lastPartialType=onOrAfter');
        expect(readout.textContent).toContain('partialRangeTypeChangeCount=1');
      });
    });
  });

  describe('reactive form integration', () => {
    it('syncs a form-control setValue to the trigger', async () => {
      const fixture = createFixture(DatePickerInputReactiveFormHost);
      const host = queryByTestId(fixture, 'date-picker');

      fixture.componentInstance.setFormValueDay10();

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.value).toBe(fixedDay(10).toFormat(DateFormat.STANDARD));
      });
    });

    it('disables the trigger when the form control is disabled', async () => {
      const fixture = createFixture(DatePickerInputReactiveFormHost);
      const host = queryByTestId(fixture, 'date-picker');

      fixture.componentInstance.formControl.disable();

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.disabled).toBe(true);
      });
    });

    it('re-enables the trigger when the form control is enabled', async () => {
      const fixture = createFixture(DatePickerInputReactiveFormHost);
      const host = queryByTestId(fixture, 'date-picker');

      fixture.componentInstance.formControl.disable();

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.disabled).toBe(true);
      });

      fixture.componentInstance.formControl.enable();

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.disabled).toBe(false);
      });
    });

    it('emits a selection to the form-control value', async () => {
      const fixture = createFixture(DatePickerInputReactiveFormHost);
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      await openViaInputClick(host);
      const panel = await waitForOverlayPanel();
      await userEvent.click(findDayCell(panel, 15));

      await waitFor(() => expect(readout.textContent).toContain(`start=${isoDateFor(15)}`));
    });

    it('marks the form control touched when the overlay closes', async () => {
      const fixture = createFixture(DatePickerInputReactiveFormHost);
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);
      expect(readout.textContent).toContain('touched=false');

      await openViaInputClick(host);
      await waitForOverlayPanel();

      const backdrop = vitestBrowserUtils.queryCdkOverlayBackdrop() as HTMLElement;
      await userEvent.click(backdrop, { position: { x: 5, y: 5 } });

      await waitForOverlayDetached();
      await waitFor(() => expect(readout.textContent).toContain('touched=true'));
    });

    it('clears the trigger value when writeValue receives null', async () => {
      const fixture = createFixture(DatePickerInputReactiveFormHost);
      const host = queryByTestId(fixture, 'date-picker');

      fixture.componentInstance.setFormValueDay10();

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.value).toBe(fixedDay(10).toFormat(DateFormat.STANDARD));
      });

      fixture.componentInstance.setFormValueNull();

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.value).toBe('');
      });
    });
  });

  describe('resetOnModeChange', () => {
    it('clears the value when switching mode and resetOnModeChange is on', async () => {
      const fixture = createInteractivePicker({ selectedStartDate: fixedDay(10) });
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      // resetOnModeChange defaults to true — seed a value, then flip allowRangeSelection
      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.value).toBe(fixedDay(10).toFormat(DateFormat.STANDARD));
      });

      fixture.componentInstance.allowRangeSelection.set(true);

      await waitFor(() => expect(readout.textContent).toContain('dateSelectedCount=1'));
      // mode change emits a cleared selection via the non-form output path
      expect(readout.textContent).toContain('lastStart=null');
      expect(readout.textContent).toContain('lastEnd=null');
    });

    it('keeps the value when switching mode and resetOnModeChange is off', async () => {
      const fixture = createInteractivePicker({ resetOnModeChange: false, selectedStartDate: fixedDay(10) });
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.value).toBe(fixedDay(10).toFormat(DateFormat.STANDARD));
      });

      fixture.componentInstance.allowRangeSelection.set(true);

      // no cleared emission and the bound input value stays intact
      expect(readout.textContent).toContain('dateSelectedCount=0');

      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        // range mode with only a start renders the "start —" in-progress form
        expect(nativeInput.value).toBe(`${fixedDay(10).toFormat(DateFormat.STANDARD)} —`);
      });
    });

    it('does not clear on the first mode-effect run at mount', async () => {
      const fixture = createInteractivePicker({ selectedStartDate: fixedDay(10) });
      const host = queryByTestId(fixture, 'date-picker');
      const readout = queryByTestId(fixture, 'readout');

      // initial mount runs the mode-effect once, which is skipped — so the seeded value survives without
      // any cleared emission
      await waitFor(() => {
        const nativeInput = host.querySelector('input.native') as HTMLInputElement;

        expect(nativeInput.value).toBe(fixedDay(10).toFormat(DateFormat.STANDARD));
      });

      expect(readout.textContent).toContain('dateSelectedCount=0');
      expect(readout.textContent).toContain('lastStart=none');
    });
  });
});
