import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { DateTime } from 'luxon';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { DateFormat, TimeFormat } from '@organization/shared-utils';
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

/** queries the cdk overlay panel for the date picker. overlays render outside the canvas. */
const queryOverlayPanel = (): HTMLElement | null => document.body.querySelector('.org-date-picker-input-overlay');

/** waits for the overlay panel and returns its root element */
const waitForOverlayPanel = async (): Promise<HTMLElement> => {
  await waitFor(() => expect(queryOverlayPanel()).not.toBeNull());

  return queryOverlayPanel() as HTMLElement;
};

/** waits for the overlay panel to be detached from the document */
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

/** focuses the native input inside the date picker trigger */
const focusTriggerInput = (host: HTMLElement): HTMLInputElement => {
  const nativeInput = host.querySelector('input.native') as HTMLInputElement;
  nativeInput.focus();

  return nativeInput;
};

@Component({
  selector: 'story-date-picker-input-tests-shell',
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-range-on" (click)="allowRangeSelection.set(true)">range-on</button>
      <button type="button" data-testid="ctl-range-off" (click)="allowRangeSelection.set(false)">range-off</button>
      <button type="button" data-testid="ctl-partial-on" (click)="allowPartialRangeSelection.set(true)">
        partial-on
      </button>
      <button type="button" data-testid="ctl-partial-off" (click)="allowPartialRangeSelection.set(false)">
        partial-off
      </button>
      <button type="button" data-testid="ctl-partial-type-range" (click)="partialRangeSelectionType.set('range')">
        partial-type-range
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
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
      <button type="button" data-testid="ctl-allow-clear-on" (click)="allowClear.set(true)">allow-clear-on</button>
      <button type="button" data-testid="ctl-allow-clear-off" (click)="allowClear.set(false)">allow-clear-off</button>
      <button type="button" data-testid="ctl-allow-trigger-clear-on" (click)="allowTriggerClear.set(true)">
        allow-trigger-clear-on
      </button>
      <button type="button" data-testid="ctl-allow-trigger-clear-off" (click)="allowTriggerClear.set(false)">
        allow-trigger-clear-off
      </button>
      <button type="button" data-testid="ctl-commit-mode-auto" (click)="commitMode.set('auto')">
        commit-mode-auto
      </button>
      <button type="button" data-testid="ctl-commit-mode-manual" (click)="commitMode.set('manual')">
        commit-mode-manual
      </button>
      <button type="button" data-testid="ctl-reset-on-mode-change-on" (click)="resetOnModeChange.set(true)">
        reset-on-mode-change-on
      </button>
      <button type="button" data-testid="ctl-reset-on-mode-change-off" (click)="resetOnModeChange.set(false)">
        reset-on-mode-change-off
      </button>
      <button type="button" data-testid="ctl-date-format-standard" (click)="dateFormat.set(DateFormat.STANDARD)">
        date-format-standard
      </button>
      <button type="button" data-testid="ctl-date-format-sql" (click)="dateFormat.set(DateFormat.SQL)">
        date-format-sql
      </button>
      <button type="button" data-testid="ctl-time-format-standard" (click)="timeFormat.set(TimeFormat.STANDARD)">
        time-format-standard
      </button>
      <button type="button" data-testid="ctl-time-format-none" (click)="timeFormat.set(undefined)">
        time-format-none
      </button>
      <button type="button" data-testid="ctl-set-start-day-10" (click)="selectedStartDate.set(fixedDay(10))">
        set-start-day-10
      </button>
      <button type="button" data-testid="ctl-set-end-day-20" (click)="selectedEndDate.set(fixedDay(20))">
        set-end-day-20
      </button>
      <button type="button" data-testid="ctl-clear-selection" (click)="clearSelectionInputs()">clear-selection</button>
    </div>
  `,
})
class StoryDatePickerInputTestsShell {
  protected readonly DateFormat = DateFormat;
  protected readonly TimeFormat = TimeFormat;
  protected readonly fixedDay = fixedDay;

  protected readonly placeholder = signal<string>('Pick a date');
  protected readonly dateFormat = signal<DateFormat>(DateFormat.STANDARD);
  protected readonly timeFormat = signal<TimeFormat | undefined>(undefined);
  protected readonly allowRangeSelection = signal<boolean>(false);
  protected readonly allowPartialRangeSelection = signal<boolean>(false);
  protected readonly partialRangeSelectionType = signal<CalendarPartialRangeSelectionType>('range');
  protected readonly selectedStartDate = signal<DateTime | null>(null);
  protected readonly selectedEndDate = signal<DateTime | null>(null);
  protected readonly defaultDisplayDate = signal<DateTime>(DateTime.now());
  protected readonly disabled = signal<boolean>(false);
  protected readonly allowClear = signal<boolean>(true);
  protected readonly allowTriggerClear = signal<boolean>(false);
  protected readonly commitMode = signal<DatePickerInputCommitMode>('auto');
  protected readonly resetOnModeChange = signal<boolean>(true);

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

  protected clearSelectionInputs(): void {
    this.selectedStartDate.set(null);
    this.selectedEndDate.set(null);
  }
}

@Component({
  selector: 'story-date-picker-input-reactive-form-shell',
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-form-set-day-10" (click)="setFormValueDay10()">form-set-day-10</button>
      <button type="button" data-testid="ctl-form-set-null" (click)="setFormValueNull()">form-set-null</button>
      <button type="button" data-testid="ctl-form-disable" (click)="formControl.disable()">form-disable</button>
      <button type="button" data-testid="ctl-form-enable" (click)="formControl.enable()">form-enable</button>
    </div>
  `,
})
class StoryDatePickerInputReactiveFormShell {
  protected readonly formControl = new FormControl<DatePickerSelection | null>(
    { startDate: null, endDate: null },
    { nonNullable: false }
  );

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

  protected setFormValueDay10(): void {
    this.formControl.setValue({ startDate: fixedDay(10), endDate: null });
  }

  protected setFormValueNull(): void {
    this.formControl.setValue(null);
  }
}

const meta: Meta = {
  title: 'Core/Components/Date Picker Input/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-date-picker-input-tests-shell />`,
  moduleMetadata: { imports: [StoryDatePickerInputTestsShell] },
});

const renderReactiveShell: Story['render'] = () => ({
  template: `<story-date-picker-input-reactive-form-shell />`,
  moduleMetadata: { imports: [StoryDatePickerInputReactiveFormShell] },
});

// host attributes

export const RendersDefaultDateFormatHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await expect(host.getAttribute('data-date-format')).toBe(DateFormat.STANDARD);
  },
};

export const ReflectsCustomDateFormatHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-date-format-sql'));

    await waitFor(() => expect(host.getAttribute('data-date-format')).toBe(DateFormat.SQL));
  },
};

export const OmitsAllowRangeSelectionHostAttributeByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await expect(host.getAttribute('data-allow-range-selection')).toBeNull();
  },
};

export const ReflectsAllowRangeSelectionHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-range-on'));

    await waitFor(() => expect(host.getAttribute('data-allow-range-selection')).toBe(''));
  },
};

export const ReflectsAllowPartialRangeSelectionHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-partial-on'));

    await waitFor(() => expect(host.getAttribute('data-allow-partial-range-selection')).toBe(''));
  },
};

export const ReflectsPartialRangeSelectionTypeHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await expect(host.getAttribute('data-partial-range-selection-type')).toBe('range');

    await userEvent.click(canvas.getByTestId('ctl-partial-type-on-or-after'));

    await waitFor(() => expect(host.getAttribute('data-partial-range-selection-type')).toBe('onOrAfter'));
  },
};

export const ReflectsAllowClearHostAttributeOnByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await expect(host.getAttribute('data-allow-clear')).toBe('');
  },
};

export const OmitsAllowClearHostAttributeWhenOff: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-allow-clear-off'));

    await waitFor(() => expect(host.getAttribute('data-allow-clear')).toBeNull());
  },
};

export const ReflectsAllowTriggerClearHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await expect(host.getAttribute('data-allow-trigger-clear')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-allow-trigger-clear-on'));

    await waitFor(() => expect(host.getAttribute('data-allow-trigger-clear')).toBe(''));
  },
};

export const ReflectsCommitModeHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await expect(host.getAttribute('data-commit-mode')).toBe('auto');

    await userEvent.click(canvas.getByTestId('ctl-commit-mode-manual'));

    await waitFor(() => expect(host.getAttribute('data-commit-mode')).toBe('manual'));
  },
};

// brain a11y attributes

export const AppliesRoleComboboxAndAriaHaspopupDialog: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await expect(host.getAttribute('role')).toBe('combobox');
    await expect(host.getAttribute('aria-haspopup')).toBe('dialog');
  },
};

export const AppliesAriaExpandedFalseWhenClosed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await expect(host.getAttribute('aria-expanded')).toBe('false');
  },
};

export const AppliesAriaExpandedTrueWhenOpen: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(nativeInput);
    await waitForOverlayPanel();

    await waitFor(() => expect(host.getAttribute('aria-expanded')).toBe('true'));
  },
};

export const AppliesAriaControlsPointingAtOverlayDialog: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    const ariaControls = host.getAttribute('aria-controls');

    await expect(ariaControls).toMatch(/^date-picker-overlay-/);

    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    const dialog = panel.querySelector(`#${ariaControls}`);

    await expect(dialog).not.toBeNull();
    await expect(dialog?.getAttribute('role')).toBe('dialog');
    await expect(dialog?.getAttribute('aria-modal')).toBe('true');
  },
};

export const AppliesDataStateClosedWhenClosed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await expect(host.getAttribute('data-state')).toBe('closed');
  },
};

export const AppliesDataStateOpenWhenOpen: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(nativeInput);
    await waitForOverlayPanel();

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
  },
};

// trigger display formatting

export const ShowsPlaceholderWhenEmpty: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await expect(nativeInput.placeholder).toBe('Pick a date');
    await expect(nativeInput.value).toBe('');
  },
};

export const ShowsSingleDateFormatted: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-set-start-day-10'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.value).toBe(fixedDay(10).toFormat(DateFormat.STANDARD));
    });
  },
};

export const ShowsCommittedRangeWithArrow: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-set-start-day-10'));
    await userEvent.click(canvas.getByTestId('ctl-set-end-day-20'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;
      const expected = `${fixedDay(10).toFormat(DateFormat.STANDARD)} → ${fixedDay(20).toFormat(DateFormat.STANDARD)}`;

      expect(nativeInput.value).toBe(expected);
    });
  },
};

export const ShowsInProgressRangeStartWithEmDash: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-set-start-day-10'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.value).toBe(`${fixedDay(10).toFormat(DateFormat.STANDARD)} —`);
    });
  },
};

export const ShowsInProgressRangeEndWithLeadingEmDash: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-set-end-day-20'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.value).toBe(`— ${fixedDay(20).toFormat(DateFormat.STANDARD)}`);
    });
  },
};

export const ShowsOnOrAfterPrefixForPartialRange: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-partial-on'));
    await userEvent.click(canvas.getByTestId('ctl-partial-type-on-or-after'));
    await userEvent.click(canvas.getByTestId('ctl-set-start-day-10'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.value).toBe(`On or after ${fixedDay(10).toFormat(DateFormat.STANDARD)}`);
    });
  },
};

export const ShowsOnOrBeforePrefixForPartialRange: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-partial-on'));
    await userEvent.click(canvas.getByTestId('ctl-partial-type-on-or-before'));
    await userEvent.click(canvas.getByTestId('ctl-set-end-day-20'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.value).toBe(`On or before ${fixedDay(20).toFormat(DateFormat.STANDARD)}`);
    });
  },
};

export const ShowsDateAndTimeWhenTimeFormatProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-time-format-standard'));
    await userEvent.click(canvas.getByTestId('ctl-set-start-day-10'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;
      const expected = fixedDay(10).toFormat(`${DateFormat.STANDARD} ${TimeFormat.STANDARD}`);

      expect(nativeInput.value).toBe(expected);
    });
  },
};

export const SwitchingDateFormatRerendersDisplayValue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-set-start-day-10'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.value).toBe(fixedDay(10).toFormat(DateFormat.STANDARD));
    });

    await userEvent.click(canvas.getByTestId('ctl-date-format-sql'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.value).toBe(fixedDay(10).toFormat(DateFormat.SQL));
    });
  },
};

// open / close behavior

export const OpensOverlayOnInputClick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(nativeInput);

    await waitForOverlayPanel();
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
  },
};

export const OpensOverlayOnEnterKey: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    focusTriggerInput(host);
    await userEvent.keyboard('{Enter}');

    await waitForOverlayPanel();
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
  },
};

export const OpensOverlayOnSpaceKey: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    focusTriggerInput(host);
    await userEvent.keyboard(' ');

    await waitForOverlayPanel();
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));
  },
};

export const ClosesOverlayOnBackdropClick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(nativeInput);
    await waitForOverlayPanel();

    const backdrop = document.body.querySelector('.cdk-overlay-backdrop') as HTMLElement;
    await userEvent.click(backdrop);

    await waitForOverlayDetached();
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('closed'));
  },
};

export const DoesNotOpenOverlayWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    // user-event refuses to click a disabled native input; fireEvent on the org-input wrapper still
    // fires the (click) handler so the brain's isDisabled() guard is exercised
    const orgInput = host.querySelector('org-input') as HTMLElement;
    fireEvent.click(orgInput);

    await expect(queryOverlayPanel()).toBeNull();
    await expect(host.getAttribute('data-state')).toBe('closed');
  },
};

export const DefaultTriggerRendersChevronDownPostIcon: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    const chevronIcon = host.querySelector('org-input .post org-icon[data-icon="chevron-down"]');

    await expect(chevronIcon).not.toBeNull();
  },
};

// selection — auto commit single

export const AutoCommitsSingleDateOnSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    await userEvent.click(findDayCell(panel, 15));

    await waitFor(() => {
      expect(readout.textContent).toContain(`lastStart=${isoDateFor(15)}`);
      expect(readout.textContent).toContain('lastEnd=null');
      expect(readout.textContent).toContain('dateSelectedCount=1');
    });
  },
};

export const SelectingDateClosesOverlayInAutoMode: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    await userEvent.click(findDayCell(panel, 15));

    await waitForOverlayDetached();
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('closed'));
  },
};

// selection — auto commit range

export const RangeModePicksFirstDateAndWaitsForSecond: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    // suppress the cleared emission that mode toggles fire when resetOnModeChange is on
    await userEvent.click(canvas.getByTestId('ctl-reset-on-mode-change-off'));
    await userEvent.click(canvas.getByTestId('ctl-range-on'));
    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    await userEvent.click(findDayCell(panel, 10));

    // first click in range mode does not commit — overlay stays open and no emission
    await expect(host.getAttribute('data-state')).toBe('open');
    await expect(readout.textContent).toContain('dateSelectedCount=0');
  },
};

export const RangeModeAutoCommitsOnSecondDate: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    // suppress the cleared emission that mode toggles fire when resetOnModeChange is on
    await userEvent.click(canvas.getByTestId('ctl-reset-on-mode-change-off'));
    await userEvent.click(canvas.getByTestId('ctl-range-on'));
    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    await userEvent.click(findDayCell(panel, 10));
    await userEvent.click(findDayCell(panel, 20));

    await waitFor(() => {
      expect(readout.textContent).toContain(`lastStart=${isoDateFor(10)}`);
      expect(readout.textContent).toContain(`lastEnd=${isoDateFor(20)}`);
      expect(readout.textContent).toContain('dateSelectedCount=1');
    });

    await waitForOverlayDetached();
  },
};

// selection — partial range

export const PartialRangeOnOrAfterAutoCommitsOnSingleDate: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    // suppress the cleared emissions that mode toggles fire when resetOnModeChange is on
    await userEvent.click(canvas.getByTestId('ctl-reset-on-mode-change-off'));
    await userEvent.click(canvas.getByTestId('ctl-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-partial-on'));
    await userEvent.click(canvas.getByTestId('ctl-partial-type-on-or-after'));
    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    await userEvent.click(findDayCell(panel, 12));

    await waitFor(() => {
      expect(readout.textContent).toContain(`lastStart=${isoDateFor(12)}`);
      expect(readout.textContent).toContain('lastEnd=null');
      expect(readout.textContent).toContain('dateSelectedCount=1');
    });

    await waitForOverlayDetached();
  },
};

export const PartialRangeOnOrBeforeAutoCommitsOnSingleDate: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    // suppress the cleared emissions that mode toggles fire when resetOnModeChange is on
    await userEvent.click(canvas.getByTestId('ctl-reset-on-mode-change-off'));
    await userEvent.click(canvas.getByTestId('ctl-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-partial-on'));
    await userEvent.click(canvas.getByTestId('ctl-partial-type-on-or-before'));
    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    await userEvent.click(findDayCell(panel, 22));

    await waitFor(() => {
      expect(readout.textContent).toContain('lastStart=null');
      expect(readout.textContent).toContain(`lastEnd=${isoDateFor(22)}`);
      expect(readout.textContent).toContain('dateSelectedCount=1');
    });

    await waitForOverlayDetached();
  },
};

export const SwitchingPartialRangeTypeInPopoverClearsInProgressSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-partial-on'));
    await userEvent.click(canvas.getByTestId('ctl-partial-type-on-or-after'));
    await userEvent.click(canvas.getByTestId('ctl-commit-mode-manual'));
    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    // make an in-progress selection (manual mode keeps it staged)
    await userEvent.click(findDayCell(panel, 12));

    await waitFor(() => expect(findDayCell(panel, 12).getAttribute('aria-selected')).toBe('true'));

    // switch partial type — the brain clears the in-progress dates when crossing modes
    await userEvent.click(findPartialRangeButton(panel, 'On or Before'));

    await waitFor(() => expect(findDayCell(panel, 12).getAttribute('aria-selected')).toBe('false'));
  },
};

// manual commit mode

export const ManualModeDoesNotAutoCommitOnSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-commit-mode-manual'));
    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    await userEvent.click(findDayCell(panel, 15));

    // overlay still open and no commit emitted
    await expect(host.getAttribute('data-state')).toBe('open');
    await expect(readout.textContent).toContain('dateSelectedCount=0');
  },
};

export const ManualModeApplyButtonDisabledUntilSelectionComplete: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-commit-mode-manual'));
    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    const applyButton = findFooterButton(panel, 'Apply') as HTMLButtonElement;

    await expect(applyButton.disabled).toBe(true);

    await userEvent.click(findDayCell(panel, 15));

    await waitFor(() => expect((findFooterButton(panel, 'Apply') as HTMLButtonElement).disabled).toBe(false));
  },
};

export const ManualModeApplyCommitsInProgressSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-commit-mode-manual'));
    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    await userEvent.click(findDayCell(panel, 15));
    await userEvent.click(findFooterButton(panel, 'Apply'));

    await waitFor(() => {
      expect(readout.textContent).toContain(`lastStart=${isoDateFor(15)}`);
      expect(readout.textContent).toContain('dateSelectedCount=1');
    });

    await waitForOverlayDetached();
  },
};

export const ManualModeCancelClosesWithoutCommitting: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-commit-mode-manual'));
    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    await userEvent.click(findDayCell(panel, 15));
    await userEvent.click(findFooterButton(panel, 'Cancel'));

    await waitForOverlayDetached();

    // no auto-commit emission for the in-progress selection
    await expect(readout.textContent).toContain('dateSelectedCount=0');
  },
};

export const ManualModeRendersApplyAndCancelButtons: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-commit-mode-manual'));
    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    await expect(findFooterButton(panel, 'Apply')).not.toBeNull();
    await expect(findFooterButton(panel, 'Cancel')).not.toBeNull();
  },
};

export const AutoModeDoesNotRenderApplyAndCancelButtons: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    // default commit mode is auto — open the popover and assert apply / cancel are absent
    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    const buttons = panel.querySelectorAll('org-calendar-footer button');
    const labels = Array.from(buttons).map((button) => button.textContent?.trim());

    await expect(labels).not.toContain('Apply');
    await expect(labels).not.toContain('Cancel');
  },
};

// clear behavior

export const ClearButtonShownWhenAllowClearAndOpen: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    await expect(findFooterButton(panel, 'Clear')).not.toBeNull();
  },
};

export const ClearButtonHiddenWhenAllowClearOff: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-allow-clear-off'));
    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    // footer only renders when allowClear or manual mode is on — in auto mode + no clear, no footer at all
    const footer = panel.querySelector('org-calendar-footer');

    await expect(footer).toBeNull();
  },
};

export const ClearButtonDisabledWhenNoValueSelected: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    const clearButton = findFooterButton(panel, 'Clear') as HTMLButtonElement;

    await expect(clearButton.disabled).toBe(true);
  },
};

export const ClearButtonEnabledWhenValuePresent: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-set-start-day-10'));
    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    await waitFor(() => {
      const clearButton = findFooterButton(panel, 'Clear') as HTMLButtonElement;

      expect(clearButton.disabled).toBe(false);
    });
  },
};

export const ClearButtonClearsCommittedValue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-set-start-day-10'));
    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    await userEvent.click(findFooterButton(panel, 'Clear'));

    await waitFor(() => {
      expect(readout.textContent).toContain('lastStart=null');
      expect(readout.textContent).toContain('lastEnd=null');
    });

    await waitForOverlayDetached();
  },
};

export const DeleteKeyClearsValueWhenCalendarFocused: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-set-start-day-10'));
    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    // dispatch keydown directly on the dialog wrapper so the brain's keydown router fires
    const dialog = panel.querySelector('[role="dialog"]') as HTMLElement;
    fireEvent.keyDown(dialog, { key: 'Delete' });

    await waitFor(() => {
      expect(readout.textContent).toContain('lastStart=null');
      expect(readout.textContent).toContain('lastEnd=null');
    });
  },
};

export const BackspaceKeyClearsValueWhenCalendarFocused: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-set-start-day-10'));
    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    const dialog = panel.querySelector('[role="dialog"]') as HTMLElement;
    fireEvent.keyDown(dialog, { key: 'Backspace' });

    await waitFor(() => {
      expect(readout.textContent).toContain('lastStart=null');
      expect(readout.textContent).toContain('lastEnd=null');
    });
  },
};

// trigger-edge clear

export const TriggerClearButtonHiddenWhenNoValue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-allow-trigger-clear-on'));

    await waitFor(() => expect(findTriggerClearButton(host)).toBeNull());
  },
};

export const TriggerClearButtonShownWhenValuePresentAndAllowed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-allow-trigger-clear-on'));
    await userEvent.click(canvas.getByTestId('ctl-set-start-day-10'));

    await waitFor(() => expect(findTriggerClearButton(host)).not.toBeNull());
  },
};

export const TriggerClearButtonHiddenWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-allow-trigger-clear-on'));
    await userEvent.click(canvas.getByTestId('ctl-set-start-day-10'));

    await waitFor(() => expect(findTriggerClearButton(host)).not.toBeNull());

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => expect(findTriggerClearButton(host)).toBeNull());
  },
};

export const TriggerClearButtonClearsValueWithoutOpeningOverlay: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-allow-trigger-clear-on'));
    await userEvent.click(canvas.getByTestId('ctl-set-start-day-10'));

    const clearButton = await waitFor(() => {
      const button = findTriggerClearButton(host);

      expect(button).not.toBeNull();

      return button as HTMLElement;
    });

    await userEvent.click(clearButton);

    await waitFor(() => {
      expect(readout.textContent).toContain('lastStart=null');
      expect(readout.textContent).toContain('lastEnd=null');
    });

    // overlay should not have been opened by the click
    await expect(queryOverlayPanel()).toBeNull();
  },
};

export const TriggerChevronTogglesOverlayWhenAllowTriggerClearOn: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-allow-trigger-clear-on'));

    const chevronButton = await waitFor(() => {
      const button = findTriggerChevronButton(host);

      expect(button).not.toBeNull();

      return button as HTMLElement;
    });

    await userEvent.click(chevronButton);

    await waitForOverlayPanel();
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('open'));

    await userEvent.click(chevronButton);

    await waitForOverlayDetached();
    await waitFor(() => expect(host.getAttribute('data-state')).toBe('closed'));
  },
};

export const TriggerChevronDoesNothingWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-allow-trigger-clear-on'));
    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const chevronButton = findTriggerChevronButton(host) as HTMLButtonElement;
    fireEvent.click(chevronButton);

    await expect(queryOverlayPanel()).toBeNull();
  },
};

// disabled state

export const DisabledStateDisablesNativeInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.disabled).toBe(true);
    });
  },
};

// outputs

export const EmitsDateSelectedOnCommit: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();
    await userEvent.click(findDayCell(panel, 15));

    await waitFor(() => expect(readout.textContent).toContain('dateSelectedCount=1'));
  },
};

export const EmitsFocusedOnInputFocus: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');

    focusTriggerInput(host);

    await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));
  },
};

export const EmitsBlurredOnInputBlur: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');

    const nativeInput = focusTriggerInput(host);
    await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));

    nativeInput.blur();

    await waitFor(() => expect(readout.textContent).toContain('blurredCount=1'));
  },
};

export const EmitsPartialRangeSelectionTypeChangeOnCommit: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    // start in partial range mode with type "range", then switch to "onOrAfter" inside the popover
    // and commit a date — the brain emits the new type at commit time
    await userEvent.click(canvas.getByTestId('ctl-range-on'));
    await userEvent.click(canvas.getByTestId('ctl-partial-on'));
    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();

    await userEvent.click(findPartialRangeButton(panel, 'On or After'));
    await userEvent.click(findDayCell(panel, 12));

    await waitFor(() => {
      expect(readout.textContent).toContain('lastPartialType=onOrAfter');
      expect(readout.textContent).toContain('partialRangeTypeChangeCount=1');
    });
  },
};

// reactive form integration

export const FormControlSetValueSyncsToTrigger: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-form-set-day-10'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.value).toBe(fixedDay(10).toFormat(DateFormat.STANDARD));
    });
  },
};

export const FormControlDisableDisablesTrigger: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-form-disable'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.disabled).toBe(true);
    });
  },
};

export const FormControlEnableReenablesTrigger: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-form-disable'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.disabled).toBe(true);
    });

    await userEvent.click(canvas.getByTestId('ctl-form-enable'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.disabled).toBe(false);
    });
  },
};

export const SelectionEmitsToFormControlValue: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await userEvent.click(nativeInput);
    const panel = await waitForOverlayPanel();
    await userEvent.click(findDayCell(panel, 15));

    await waitFor(() => expect(readout.textContent).toContain(`start=${isoDateFor(15)}`));
  },
};

export const OverlayCloseMarksFormControlTouched: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');
    const nativeInput = host.querySelector('input.native') as HTMLInputElement;

    await expect(readout.textContent).toContain('touched=false');

    await userEvent.click(nativeInput);
    await waitForOverlayPanel();

    const backdrop = document.body.querySelector('.cdk-overlay-backdrop') as HTMLElement;
    await userEvent.click(backdrop);

    await waitForOverlayDetached();
    await waitFor(() => expect(readout.textContent).toContain('touched=true'));
  },
};

export const WriteValueWithNullClearsTriggerValue: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');

    await userEvent.click(canvas.getByTestId('ctl-form-set-day-10'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.value).toBe(fixedDay(10).toFormat(DateFormat.STANDARD));
    });

    await userEvent.click(canvas.getByTestId('ctl-form-set-null'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.value).toBe('');
    });
  },
};

// resetOnModeChange

export const SwitchingModeClearsValueWhenResetOnModeChangeOn: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');

    // resetOnModeChange defaults to true — seed a value, then flip allowRangeSelection
    await userEvent.click(canvas.getByTestId('ctl-set-start-day-10'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.value).toBe(fixedDay(10).toFormat(DateFormat.STANDARD));
    });

    await userEvent.click(canvas.getByTestId('ctl-range-on'));

    await waitFor(() => expect(readout.textContent).toContain('dateSelectedCount=1'));
    // mode change emits a cleared selection via the non-form output path
    await expect(readout.textContent).toContain('lastStart=null');
    await expect(readout.textContent).toContain('lastEnd=null');
  },
};

export const SwitchingModeKeepsValueWhenResetOnModeChangeOff: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-reset-on-mode-change-off'));
    await userEvent.click(canvas.getByTestId('ctl-set-start-day-10'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.value).toBe(fixedDay(10).toFormat(DateFormat.STANDARD));
    });

    await userEvent.click(canvas.getByTestId('ctl-range-on'));

    // no cleared emission and the bound input value stays intact
    await expect(readout.textContent).toContain('dateSelectedCount=0');

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      // range mode with only a start renders the "start —" in-progress form
      expect(nativeInput.value).toBe(`${fixedDay(10).toFormat(DateFormat.STANDARD)} —`);
    });
  },
};

export const InitialMountDoesNotClearOnFirstModeEffectRun: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('date-picker');
    const readout = await canvas.findByTestId('readout');

    // initial mount runs the mode-effect once, which is skipped — so seeded value survives without
    // any cleared emission
    await userEvent.click(canvas.getByTestId('ctl-set-start-day-10'));

    await waitFor(() => {
      const nativeInput = host.querySelector('input.native') as HTMLInputElement;

      expect(nativeInput.value).toBe(fixedDay(10).toFormat(DateFormat.STANDARD));
    });

    await expect(readout.textContent).toContain('dateSelectedCount=0');
    await expect(readout.textContent).toContain('lastStart=none');
  },
};
