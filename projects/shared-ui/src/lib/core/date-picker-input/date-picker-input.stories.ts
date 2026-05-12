import type { Meta, StoryObj } from '@storybook/angular';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DateTime } from 'luxon';
import { DatePickerInput, type DatePickerInputCommitMode } from './date-picker-input';
import { DateFormat, TimeFormat } from '@organization/shared-utils';
import { Button } from '../button/button';
import { ButtonToggle, type ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { FormField } from '../form-fields/form-field';
import { FormFields } from '../form-fields/form-fields';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import type { CalendarPartialRangeSelectionType } from '../../brain/calendar-brain/calendar-brain';

type LiveDemoMode = 'single' | 'range' | 'partial-range';
type LiveDemoTimeFormat = TimeFormat | 'none';

const liveDemoModeItems: ButtonToggleItem[] = [
  { label: 'Single', value: 'single', buttonColor: 'primary' },
  { label: 'Range', value: 'range', buttonColor: 'primary' },
  { label: 'Partial Range', value: 'partial-range', buttonColor: 'primary' },
];

const liveDemoCommitModeItems: ButtonToggleItem[] = [
  { label: 'Auto', value: 'auto', buttonColor: 'primary' },
  { label: 'Manual', value: 'manual', buttonColor: 'primary' },
];

const liveDemoDateFormatItems: ButtonToggleItem[] = [
  { label: 'M/D/YY', value: DateFormat.STANDARD, buttonColor: 'primary' },
  { label: 'YYYY-MM-DD', value: DateFormat.SQL, buttonColor: 'primary' },
  { label: 'MMM YYYY', value: DateFormat.MONTH_YEAR, buttonColor: 'primary' },
];

const liveDemoTimeFormatItems: ButtonToggleItem[] = [
  { label: 'None', value: 'none', buttonColor: 'primary' },
  { label: 'h:mm a', value: TimeFormat.STANDARD, buttonColor: 'primary' },
  { label: 'h:mm:ss a', value: TimeFormat.STANDARD_WITH_SECONDS, buttonColor: 'primary' },
];

const liveDemoPartialTypeItems: ButtonToggleItem[] = [
  { label: 'Range', value: 'range', buttonColor: 'primary' },
  { label: 'On or Before', value: 'onOrBefore', buttonColor: 'primary' },
  { label: 'On or After', value: 'onOrAfter', buttonColor: 'primary' },
];

@Component({
  selector: 'story-date-picker-input-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePickerInput,
    ButtonToggle,
    CheckboxToggle,
    ReactiveFormsModule,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlGroup,
    DesignSystemDemoCanvas,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .canvas-stage {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 6rem; /* 96px */
      }
      .picker-width {
        width: 18rem; /* 288px */
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="All date picker inputs below are real and interactive — open the popover, switch modes, toggle Apply/Cancel, and watch every visual axis."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Mode">
            <org-button-toggle [items]="modeItems" formControlName="mode" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Commit mode">
            <org-button-toggle [items]="commitModeItems" formControlName="commitMode" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Date format">
            <org-button-toggle [items]="dateFormatItems" formControlName="dateFormat" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Time format">
            <org-button-toggle [items]="timeFormatItems" formControlName="timeFormat" buttonSize="sm" />
          </org-design-system-demo-control-group>
          @if (mode() === 'partial-range') {
            <org-design-system-demo-control-group label="Partial type">
              <org-button-toggle [items]="partialTypeItems" formControlName="partialRangeType" buttonSize="sm" />
            </org-design-system-demo-control-group>
          }
          <org-design-system-demo-control-group label="Disabled">
            <org-checkbox-toggle name="live-demo-disabled" value="disabled" formControlName="disabled">
              {{ liveDemoForm.controls.disabled.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Allow popover clear">
            <org-checkbox-toggle name="live-demo-allow-clear" value="allow-clear" formControlName="allowClear">
              {{ liveDemoForm.controls.allowClear.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Allow trigger clear">
            <org-checkbox-toggle
              name="live-demo-allow-trigger-clear"
              value="allow-trigger-clear"
              formControlName="allowTriggerClear"
            >
              {{ liveDemoForm.controls.allowTriggerClear.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Reset on mode change">
            <org-checkbox-toggle
              name="live-demo-reset-on-mode-change"
              value="reset-on-mode-change"
              formControlName="resetOnModeChange"
            >
              {{ liveDemoForm.controls.resetOnModeChange.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <div class="picker-width">
              <org-date-picker-input
                name="live-demo"
                placeholder="Select a date..."
                [dateFormat]="liveDemoForm.controls.dateFormat.value"
                [timeFormat]="resolvedTimeFormat()"
                [allowRangeSelection]="mode() !== 'single'"
                [allowPartialRangeSelection]="mode() === 'partial-range'"
                [partialRangeSelectionType]="liveDemoForm.controls.partialRangeType.value"
                [allowClear]="liveDemoForm.controls.allowClear.value"
                [allowTriggerClear]="liveDemoForm.controls.allowTriggerClear.value"
                [commitMode]="liveDemoForm.controls.commitMode.value"
                [resetOnModeChange]="liveDemoForm.controls.resetOnModeChange.value"
                [disabled]="liveDemoForm.controls.disabled.value"
                [selectedStartDate]="startDate()"
                [selectedEndDate]="endDate()"
                (dateSelected)="onDateSelected($event)"
              />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class DatePickerInputLiveDemoStory {
  protected readonly modeItems = liveDemoModeItems;
  protected readonly commitModeItems = liveDemoCommitModeItems;
  protected readonly dateFormatItems = liveDemoDateFormatItems;
  protected readonly timeFormatItems = liveDemoTimeFormatItems;
  protected readonly partialTypeItems = liveDemoPartialTypeItems;

  protected readonly startDate = signal<DateTime | null>(null);
  protected readonly endDate = signal<DateTime | null>(null);

  protected readonly liveDemoForm = new FormGroup({
    mode: new FormControl<LiveDemoMode>('single', { nonNullable: true }),
    commitMode: new FormControl<DatePickerInputCommitMode>('auto', { nonNullable: true }),
    dateFormat: new FormControl<DateFormat>(DateFormat.STANDARD, { nonNullable: true }),
    timeFormat: new FormControl<LiveDemoTimeFormat>('none', { nonNullable: true }),
    partialRangeType: new FormControl<CalendarPartialRangeSelectionType>('range', { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
    allowClear: new FormControl<boolean>(true, { nonNullable: true }),
    allowTriggerClear: new FormControl<boolean>(false, { nonNullable: true }),
    resetOnModeChange: new FormControl<boolean>(true, { nonNullable: true }),
  });

  protected readonly mode = toSignal(this.liveDemoForm.controls.mode.valueChanges, {
    initialValue: this.liveDemoForm.controls.mode.value,
  });

  protected readonly resolvedTimeFormat = computed<TimeFormat | null>(() => {
    const value = this.timeFormatValue();

    if (value === 'none') {
      return null;
    }

    return value;
  });

  private readonly timeFormatValue = toSignal(this.liveDemoForm.controls.timeFormat.valueChanges, {
    initialValue: this.liveDemoForm.controls.timeFormat.value,
  });

  protected onDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.startDate.set(dates.startDate);
    this.endDate.set(dates.endDate);
  }
}

@Component({
  selector: 'story-date-picker-input-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePickerInput,
    FormField,
    FormFields,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .picker-row {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }
      .picker-cell {
        width: 18rem; /* 288px */
      }
    `,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Single Date Selection" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="picker-row">
            <div class="picker-cell">
              <org-date-picker-input
                name="showcase-single-empty"
                placeholder="Pick a date"
                [selectedStartDate]="singleEmpty()"
                (dateSelected)="onSingleEmptyChanged($event)"
              />
            </div>
            <div class="picker-cell">
              <org-date-picker-input
                name="showcase-single-value"
                [selectedStartDate]="singleValue()"
                (dateSelected)="onSingleValueChanged($event)"
              />
            </div>
            <div class="picker-cell">
              <org-date-picker-input name="showcase-single-disabled" [disabled]="true" [selectedStartDate]="now" />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Empty input reads the placeholder at the muted foreground color</li>
          <li>Clicking the trigger or the chevron opens the popover; selecting a date commits and closes</li>
          <li>Disabled trigger is non-interactive and rendered at reduced opacity</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Range Selection" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="picker-row">
            <div class="picker-cell">
              <org-date-picker-input
                name="showcase-range-empty"
                placeholder="Pick a range"
                [allowRangeSelection]="true"
                [selectedStartDate]="rangeEmptyStart()"
                [selectedEndDate]="rangeEmptyEnd()"
                (dateSelected)="onRangeEmptyChanged($event)"
              />
            </div>
            <div class="picker-cell">
              <org-date-picker-input
                name="showcase-range-value"
                [allowRangeSelection]="true"
                [selectedStartDate]="rangeValueStart()"
                [selectedEndDate]="rangeValueEnd()"
                (dateSelected)="onRangeValueChanged($event)"
              />
            </div>
            <div class="picker-cell">
              <org-date-picker-input
                name="showcase-range-in-progress"
                [allowRangeSelection]="true"
                [selectedStartDate]="rangeInProgressStart"
                [selectedEndDate]="null"
              />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Committed ranges render as <strong>start → end</strong></li>
          <li>An in-progress range (start picked, end pending) renders as <strong>start —</strong></li>
          <li>Selecting the second date commits the range and closes the popover</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Partial Range Selection" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="picker-row">
            <div class="picker-cell">
              <org-date-picker-input
                name="showcase-partial-on-or-after"
                [allowRangeSelection]="true"
                [allowPartialRangeSelection]="true"
                partialRangeSelectionType="onOrAfter"
                [selectedStartDate]="now"
                [selectedEndDate]="null"
              />
            </div>
            <div class="picker-cell">
              <org-date-picker-input
                name="showcase-partial-on-or-before"
                [allowRangeSelection]="true"
                [allowPartialRangeSelection]="true"
                partialRangeSelectionType="onOrBefore"
                [selectedStartDate]="null"
                [selectedEndDate]="nowPlus7"
              />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>On or after</strong> commits a start-only selection and reads as "On or after {{ '{date}' }}"</li>
          <li>
            <strong>On or before</strong> commits an end-only selection and reads as "On or before {{ '{date}' }}"
          </li>
          <li>The calendar exposes a radio selector to switch modes inside the popover</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Popover Clear Action" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="picker-row">
            <div class="picker-cell">
              <org-date-picker-input
                name="showcase-clear-on"
                [allowClear]="true"
                [selectedStartDate]="clearOnDate()"
                (dateSelected)="onClearOnChanged($event)"
              />
            </div>
            <div class="picker-cell">
              <org-date-picker-input
                name="showcase-clear-off"
                [allowClear]="false"
                [selectedStartDate]="clearOffDate()"
                (dateSelected)="onClearOffChanged($event)"
              />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>When <strong>allowClear</strong> is true, the calendar footer renders a Clear button</li>
          <li>The Clear button is disabled while no date is selected</li>
          <li>Pressing Delete or Backspace while the calendar is focused triggers the same clear path</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Trigger-Edge Clear Button" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="picker-row">
            <div class="picker-cell">
              <org-date-picker-input
                name="showcase-trigger-clear"
                [allowTriggerClear]="true"
                [selectedStartDate]="triggerClearDate()"
                (dateSelected)="onTriggerClearChanged($event)"
              />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>The inline X button appears only when a value is present and the trigger is not disabled</li>
          <li>Clicking the X clears the value <strong>without</strong> opening the popover</li>
          <li>The chevron toggles the popover even when the trigger-edge clear is on</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Manual Commit Mode (Apply / Cancel)" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="picker-row">
            <div class="picker-cell">
              <org-date-picker-input
                name="showcase-manual-single"
                commitMode="manual"
                [selectedStartDate]="manualSingleDate()"
                (dateSelected)="onManualSingleChanged($event)"
              />
            </div>
            <div class="picker-cell">
              <org-date-picker-input
                name="showcase-manual-range"
                commitMode="manual"
                [allowRangeSelection]="true"
                [selectedStartDate]="manualRangeStart()"
                [selectedEndDate]="manualRangeEnd()"
                (dateSelected)="onManualRangeChanged($event)"
              />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Auto-commit is disabled — picking dates only stages an in-progress selection</li>
          <li><strong>Apply</strong> commits the staged selection and closes the popover</li>
          <li><strong>Cancel</strong> closes the popover and reverts to the previously committed value</li>
          <li>Apply is disabled until the staged selection is complete (both dates in range mode)</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Prepopulated Values" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="picker-row">
            <div class="picker-cell">
              <org-date-picker-input
                name="showcase-prepop-single"
                [selectedStartDate]="now"
                (dateSelected)="onPrepopSingleChanged($event)"
              />
            </div>
            <div class="picker-cell">
              <org-date-picker-input
                name="showcase-prepop-range"
                [allowRangeSelection]="true"
                [selectedStartDate]="now"
                [selectedEndDate]="nowPlus7"
                (dateSelected)="onPrepopRangeChanged($event)"
              />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Initial values render in the trigger immediately on first mount</li>
          <li>Opening the popover surfaces the same dates as the in-progress selection</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Validation" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="picker-row">
            <div class="picker-cell">
              <org-form-field validationMessage="Date is required">
                <org-date-picker-input name="showcase-validation-single" placeholder="Select a date" />
              </org-form-field>
            </div>
            <div class="picker-cell">
              <org-form-field validationMessage="At least one date is required">
                <org-date-picker-input
                  name="showcase-validation-either"
                  placeholder="Select at least one date"
                  [allowRangeSelection]="true"
                  [allowPartialRangeSelection]="true"
                />
              </org-form-field>
            </div>
            <div class="picker-cell">
              <org-form-field validationMessage="Both start and end dates are required">
                <org-date-picker-input
                  name="showcase-validation-both"
                  placeholder="Select both dates"
                  [allowRangeSelection]="true"
                />
              </org-form-field>
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Validation messages surface beneath the trigger via the form-field wrapper</li>
          <li>The trigger renders the error border treatment while a validation message is present</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Validation Space Reservation" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="picker-row">
            <div class="picker-cell">
              <org-form-fields>
                <org-form-field [reserveValidationSpace]="true">
                  <org-date-picker-input name="reserve-true-1" placeholder="No error" />
                </org-form-field>
                <org-form-field [reserveValidationSpace]="true" validationMessage="This field has an error">
                  <org-date-picker-input name="reserve-true-2" placeholder="With error" />
                </org-form-field>
                <org-form-field [reserveValidationSpace]="true">
                  <org-date-picker-input name="reserve-true-3" placeholder="No error" />
                </org-form-field>
              </org-form-fields>
            </div>
            <div class="picker-cell">
              <org-form-fields>
                <org-form-field [reserveValidationSpace]="false">
                  <org-date-picker-input name="reserve-false-1" placeholder="No error" />
                </org-form-field>
                <org-form-field [reserveValidationSpace]="false" validationMessage="This field has an error">
                  <org-date-picker-input name="reserve-false-2" placeholder="With error" />
                </org-form-field>
                <org-form-field [reserveValidationSpace]="false">
                  <org-date-picker-input name="reserve-false-3" placeholder="No error" />
                </org-form-field>
              </org-form-fields>
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>reserveValidationSpace=true</strong> always reserves space so layout never shifts</li>
          <li>
            <strong>reserveValidationSpace=false</strong> collapses to the trigger height when no message is shown
          </li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class DatePickerInputShowcaseStory {
  protected readonly now = DateTime.now().startOf('day');
  protected readonly nowPlus7 = DateTime.now().plus({ days: 7 }).endOf('day');
  // intentionally a plain DateTime — the in-progress range cell demonstrates the trigger's "start —" treatment
  protected readonly rangeInProgressStart = DateTime.now().startOf('day');

  protected readonly singleEmpty = signal<DateTime | null>(null);
  protected readonly singleValue = signal<DateTime | null>(DateTime.now().startOf('day'));
  protected readonly rangeEmptyStart = signal<DateTime | null>(null);
  protected readonly rangeEmptyEnd = signal<DateTime | null>(null);
  protected readonly rangeValueStart = signal<DateTime | null>(DateTime.now().startOf('day'));
  protected readonly rangeValueEnd = signal<DateTime | null>(DateTime.now().plus({ days: 7 }).endOf('day'));
  protected readonly clearOnDate = signal<DateTime | null>(DateTime.now().startOf('day'));
  protected readonly clearOffDate = signal<DateTime | null>(DateTime.now().startOf('day'));
  protected readonly triggerClearDate = signal<DateTime | null>(DateTime.now().startOf('day'));
  protected readonly manualSingleDate = signal<DateTime | null>(null);
  protected readonly manualRangeStart = signal<DateTime | null>(null);
  protected readonly manualRangeEnd = signal<DateTime | null>(null);

  protected onSingleEmptyChanged(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.singleEmpty.set(dates.startDate);
  }

  protected onSingleValueChanged(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.singleValue.set(dates.startDate);
  }

  protected onRangeEmptyChanged(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.rangeEmptyStart.set(dates.startDate);
    this.rangeEmptyEnd.set(dates.endDate);
  }

  protected onRangeValueChanged(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.rangeValueStart.set(dates.startDate);
    this.rangeValueEnd.set(dates.endDate);
  }

  protected onClearOnChanged(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.clearOnDate.set(dates.startDate);
  }

  protected onClearOffChanged(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.clearOffDate.set(dates.startDate);
  }

  protected onTriggerClearChanged(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.triggerClearDate.set(dates.startDate);
  }

  protected onManualSingleChanged(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.manualSingleDate.set(dates.startDate);
  }

  protected onManualRangeChanged(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.manualRangeStart.set(dates.startDate);
    this.manualRangeEnd.set(dates.endDate);
  }

  protected onPrepopSingleChanged(_dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    // showcase keeps the prepopulated cell static — handler exists so the brain treats this as non-form
  }

  protected onPrepopRangeChanged(_dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    // same — keeps the prepopulated range cell static for the showcase snapshot
  }
}

@Component({
  selector: 'story-date-picker-input-reactive-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePickerInput,
    Button,
    FormField,
    FormFields,
    ReactiveFormsModule,
    JsonPipe,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .picker-width {
        width: 18rem; /* 288px */
      }
    `,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Reactive Form Integration"
          [description]="'Form value: ' + formValueDisplay()"
        />
        <org-design-system-demo-canvas slot="canvas">
          <form [formGroup]="form">
            <org-form-fields>
              <org-form-field>
                <div class="picker-width">
                  <org-date-picker-input
                    name="reactive-form-single-date"
                    formControlName="singleDate"
                    placeholder="Select a date"
                  />
                </div>
              </org-form-field>
              <org-form-field>
                <div class="picker-width">
                  <org-date-picker-input
                    name="reactive-form-range"
                    formControlName="range"
                    [allowRangeSelection]="true"
                    placeholder="Select a range"
                  />
                </div>
              </org-form-field>
              <org-form-field>
                <div class="picker-width">
                  <org-date-picker-input
                    name="reactive-form-partial-range"
                    formControlName="partialRange"
                    [allowRangeSelection]="true"
                    [allowPartialRangeSelection]="true"
                    placeholder="Select a partial range"
                  />
                </div>
              </org-form-field>
            </org-form-fields>
            <div class="flex flex-wrap gap-2 mt-2">
              <org-button color="primary" size="sm" label="Set Single to Today" (clicked)="setSingleToday()" />
              <org-button color="primary" size="sm" label="Set Range to This Week" (clicked)="setRangeThisWeek()" />
              <org-button color="primary" size="sm" label="Set Partial to On or After" (clicked)="setPartialAfter()" />
              <org-button color="neutral" size="sm" label="Clear All" (clicked)="clearAll()" />
              <org-button color="neutral" size="sm" label="Disable All" (clicked)="disableAll()" />
              <org-button color="neutral" size="sm" label="Enable All" (clicked)="enableAll()" />
            </div>
            <pre class="mt-2 p-2 bg-app rounded-sm text-xs">{{ form.value | json }}</pre>
          </form>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>
            The component implements <strong>ControlValueAccessor</strong> and pairs with <code>formControlName</code>
          </li>
          <li>Each form control value is an object with <code>startDate</code> and <code>endDate</code> properties</li>
          <li>Form value updates immediately when the selection commits</li>
          <li>The form is marked as touched when the popover closes for any reason</li>
          <li><code>form.disable()</code> / <code>form.enable()</code> reflect in the trigger</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class DatePickerInputReactiveFormStory {
  protected readonly now = DateTime.now().startOf('day');
  protected readonly nowPlus7 = DateTime.now().plus({ days: 7 }).endOf('day');

  protected readonly form = new FormGroup({
    singleDate: new FormControl<{ startDate: DateTime | null; endDate: DateTime | null }>({
      startDate: this.now,
      endDate: null,
    }),
    range: new FormControl<{ startDate: DateTime | null; endDate: DateTime | null }>({
      startDate: this.now,
      endDate: this.nowPlus7,
    }),
    partialRange: new FormControl<{ startDate: DateTime | null; endDate: DateTime | null }>({
      startDate: this.now,
      endDate: null,
    }),
  });

  protected readonly formValueDisplay = toSignal(this.form.valueChanges.pipe(map((value) => JSON.stringify(value))), {
    initialValue: JSON.stringify(this.form.value),
  });

  protected setSingleToday(): void {
    this.form.controls.singleDate.setValue({ startDate: this.now, endDate: null });
  }

  protected setRangeThisWeek(): void {
    this.form.controls.range.setValue({ startDate: this.now, endDate: this.nowPlus7 });
  }

  protected setPartialAfter(): void {
    this.form.controls.partialRange.setValue({ startDate: this.now, endDate: null });
  }

  protected clearAll(): void {
    this.form.controls.singleDate.setValue({ startDate: null, endDate: null });
    this.form.controls.range.setValue({ startDate: null, endDate: null });
    this.form.controls.partialRange.setValue({ startDate: null, endDate: null });
  }

  protected disableAll(): void {
    this.form.disable();
  }

  protected enableAll(): void {
    this.form.enable();
  }
}

@Component({
  selector: 'story-date-picker-input-non-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePickerInput,
    Button,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .picker-width {
        width: 18rem; /* 288px */
      }
    `,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Non-Form Usage" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="picker-width">
            <org-date-picker-input
              name="non-form-single"
              placeholder="Pick a date"
              [selectedStartDate]="singleDate()"
              (dateSelected)="onSingleSelected($event)"
            />
          </div>
          <div class="picker-width">
            <org-date-picker-input
              name="non-form-range"
              placeholder="Pick a range"
              [allowRangeSelection]="true"
              [selectedStartDate]="rangeStart()"
              [selectedEndDate]="rangeEnd()"
              (dateSelected)="onRangeSelected($event)"
            />
          </div>
          <div class="flex flex-wrap gap-2">
            <org-button color="primary" size="sm" label="Set Single Today" (clicked)="setSingleToday()" />
            <org-button color="primary" size="sm" label="Set Range This Week" (clicked)="setRangeThisWeek()" />
            <org-button color="neutral" size="sm" label="Clear All" (clicked)="clearAll()" />
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>
            Drives the picker without reactive forms via <code>[selectedStartDate]</code> + <code>(dateSelected)</code>
          </li>
          <li>The parent owns the signal that backs the picker's selected dates</li>
          <li>The <code>dateSelected</code> output fires immediately when a selection commits</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class DatePickerInputNonFormStory {
  protected readonly singleDate = signal<DateTime | null>(null);
  protected readonly rangeStart = signal<DateTime | null>(null);
  protected readonly rangeEnd = signal<DateTime | null>(null);

  protected onSingleSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.singleDate.set(dates.startDate);
  }

  protected onRangeSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.rangeStart.set(dates.startDate);
    this.rangeEnd.set(dates.endDate);
  }

  protected setSingleToday(): void {
    this.singleDate.set(DateTime.now().startOf('day'));
  }

  protected setRangeThisWeek(): void {
    const now = DateTime.now();

    this.rangeStart.set(now.startOf('week').startOf('day'));
    this.rangeEnd.set(now.endOf('week').endOf('day'));
  }

  protected clearAll(): void {
    this.singleDate.set(null);
    this.rangeStart.set(null);
    this.rangeEnd.set(null);
  }
}

@Component({
  selector: 'story-date-picker-input-focused-blurred',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePickerInput, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  styles: [
    `
      :host {
        display: block;
      }
      .picker-width {
        width: 18rem; /* 288px */
      }
    `,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header slot="header" title="Focused / Blurred" />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-2">
          <div class="picker-width">
            <org-date-picker-input
              name="focused-blurred"
              placeholder="Tab into me..."
              (focused)="onFocused()"
              (blurred)="onBlurred()"
            />
          </div>
          <p>
            isFocused: <strong>{{ isFocused() }}</strong>
          </p>
          <p>
            Last event: <strong>{{ lastEvent() }}</strong>
          </p>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class DatePickerInputFocusedBlurredStory {
  protected readonly isFocused = signal<boolean>(false);
  protected readonly lastEvent = signal<string>('none');

  protected onFocused(): void {
    this.isFocused.set(true);
    this.lastEvent.set('focused');
  }

  protected onBlurred(): void {
    this.isFocused.set(false);
    this.lastEvent.set('blurred');
  }
}

const meta: Meta<DatePickerInput> = {
  title: 'Core/Components/Date Picker Input',
  component: DatePickerInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## DatePickerInput Component

  A composed date input — a real \`org-input\` trigger anchored to an \`org-calendar\` popover. Supports single date, full range, and partial range (\`on or after\` / \`on or before\`) selections, opt-in trigger-edge clear, and an opt-in manual commit flow with Apply / Cancel.

  ### Features
  - Single date, full range, and partial range selection modes
  - Auto-commit (default) or manual commit with Apply / Cancel in the calendar footer
  - Optional in-popover Clear button and an opt-in trigger-edge Clear icon button
  - Reactive forms integration via \`ControlValueAccessor\`
  - Customisable date / time formats
  - Validation surface via \`org-form-field\`
  - Keyboard support — Enter / Space to open, Esc to cancel, Delete / Backspace to clear inside the calendar
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<DatePickerInput>;

export const Default: Story = {
  args: {
    name: 'date-picker',
    dateFormat: DateFormat.STANDARD,
    timeFormat: TimeFormat.STANDARD,
    allowPartialRangeSelection: false,
    partialRangeSelectionType: 'range',
    placeholder: 'Select date...',
    autoFocus: false,
    defaultDisplayDate: DateTime.now(),
    startYear: DateTime.now().year - 100,
    endYear: DateTime.now().year + 20,
    selectedStartDate: null,
    selectedEndDate: null,
    allowRangeSelection: false,
    disableBefore: null,
    disableAfter: null,
    allowedDateRange: 0,
    disabled: false,
    allowClear: true,
    allowTriggerClear: false,
    commitMode: 'auto',
    resetOnModeChange: true,
  },
  argTypes: {
    name: { control: 'text', description: 'The name attribute for the input element' },
    dateFormat: {
      control: 'select',
      options: Object.values(DateFormat),
      description: 'The date format for display',
    },
    timeFormat: {
      control: 'select',
      options: Object.values(TimeFormat),
      description: 'The time format for display',
    },
    allowPartialRangeSelection: {
      control: 'boolean',
      description: 'Allow partial range selection (on or after/before)',
    },
    partialRangeSelectionType: {
      control: 'select',
      options: ['range', 'onOrBefore', 'onOrAfter'],
      description: 'The partial range selection type',
    },
    placeholder: { control: 'text', description: 'Placeholder text for the input' },
    autoFocus: { control: 'boolean', description: 'Automatically focus the input on mount' },
    allowRangeSelection: { control: 'boolean', description: 'Enable date range selection' },
    disabled: { control: 'boolean', description: 'Disable the date picker' },
    allowClear: { control: 'boolean', description: 'Show clear button in calendar footer' },
    allowTriggerClear: {
      control: 'boolean',
      description: 'Render the inline clear button at the trigger post edge',
    },
    commitMode: {
      control: 'select',
      options: ['auto', 'manual'],
      description: 'Auto commits on selection completion; manual waits for the Apply action',
    },
    resetOnModeChange: {
      control: 'boolean',
      description: 'When true, switching mode-related inputs clears the current selection',
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-sm">
        <org-date-picker-input
          [name]="name"
          [dateFormat]="dateFormat"
          [timeFormat]="timeFormat"
          [allowPartialRangeSelection]="allowPartialRangeSelection"
          [partialRangeSelectionType]="partialRangeSelectionType"
          [placeholder]="placeholder"
          [autoFocus]="autoFocus"
          [defaultDisplayDate]="defaultDisplayDate"
          [startYear]="startYear"
          [endYear]="endYear"
          [selectedStartDate]="selectedStartDate"
          [selectedEndDate]="selectedEndDate"
          [allowRangeSelection]="allowRangeSelection"
          [disableBefore]="disableBefore"
          [disableAfter]="disableAfter"
          [allowedDateRange]="allowedDateRange"
          [disabled]="disabled"
          [allowClear]="allowClear"
          [allowTriggerClear]="allowTriggerClear"
          [commitMode]="commitMode"
          [resetOnModeChange]="resetOnModeChange"
        />
      </div>
    `,
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo — drive every visual axis of the date picker (mode, commit mode, date / time format, allow-clear, allow-trigger-clear, disabled) and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: '<story-date-picker-input-live-demo />',
    moduleMetadata: {
      imports: [DatePickerInputLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every date-picker-input axis — single / range / partial-range modes, popover clear, trigger-edge clear, manual commit, prepopulated values, validation surface, and reservation behaviour — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: '<story-date-picker-input-showcase />',
    moduleMetadata: {
      imports: [DatePickerInputShowcaseStory],
    },
  }),
};

export const ReactiveFormIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example of integrating the date picker with Angular reactive forms via ControlValueAccessor.',
      },
    },
  },
  render: () => ({
    template: '<story-date-picker-input-reactive-form />',
    moduleMetadata: {
      imports: [DatePickerInputReactiveFormStory],
    },
  }),
};

export const NonFormUsage: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Driving the date picker outside of reactive forms using `[selectedStartDate]` + `(dateSelected)`.',
      },
    },
  },
  render: () => ({
    template: '<story-date-picker-input-non-form />',
    moduleMetadata: {
      imports: [DatePickerInputNonFormStory],
    },
  }),
};

export const FocusedBlurred: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the `focused` / `blurred` outputs firing as the trigger gains and loses keyboard focus.',
      },
    },
  },
  render: () => ({
    template: '<story-date-picker-input-focused-blurred />',
    moduleMetadata: {
      imports: [DatePickerInputFocusedBlurredStory],
    },
  }),
};
