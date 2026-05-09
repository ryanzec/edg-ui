import type { Meta, StoryObj } from '@storybook/angular';
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DateTime } from 'luxon';
import { DatePickerInput } from './date-picker-input';
import { DateFormat, TimeFormat } from '@organization/shared-utils';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { Button } from '../button/button';
import { JsonPipe } from '@angular/common';
import { FormFields } from '../form-fields/form-fields';
import { FormField } from '../form-fields/form-field';
import type { CalendarPartialRangeSelectionType } from '../../brain/calendar-brain/calendar-brain';

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

  A comprehensive date picker component designed for date selection in forms with support for single date and date range selection.

  ### Features
  - Single date selection mode
  - Date range selection mode
  - Partial range selection support (on or after/before)
  - Customizable date and time formatting
  - Reactive forms integration with ControlValueAccessor
  - Simple forms integration with event handling
  - Validation support
  - Calendar keyboard navigation
  - Date constraints (disable before/after, allowed range)
  - Readonly input with calendar-only interaction

  ### Usage Examples
  \`\`\`html
  <!-- Basic single date -->
  <org-date-picker-input
    placeholder="Select date..."
    [selectedStartDate]="startDate"
    (dateSelected)="onDateSelected($event)"
  />

  <!-- Date range -->
  <org-date-picker-input
    placeholder="Select date range..."
    [allowRangeSelection]="true"
    [selectedStartDate]="startDate"
    [selectedEndDate]="endDate"
    (dateSelected)="onDateSelected($event)"
  />

  <!-- With reactive forms -->
  <org-date-picker-input
    [formControl]="dateFormControl"
    [allowRangeSelection]="true"
    placeholder="Select date range..."
  />

  <!-- With validation -->
  <org-date-picker-input
    placeholder="Select date..."
    (dateSelected)="onDateSelected($event)"
  />
</div>
\`\`\`
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
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'The name attribute for the input element',
    },
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
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    autoFocus: {
      control: 'boolean',
      description: 'Automatically focus the input on mount',
    },
    allowRangeSelection: {
      control: 'boolean',
      description: 'Enable date range selection',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the date picker',
    },
    allowClear: {
      control: 'boolean',
      description: 'Show clear button in calendar footer',
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
        />
      </div>
    `,
  }),
};

@Component({
  selector: 'story-date-picker-input-single-select-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePickerInput, StorybookExampleContainer, StorybookExampleContainerSection, Button, JsonPipe],
  template: `
    <org-storybook-example-container
      title="Single Date Selection"
      [currentState]="'Selected: ' + (selectedDate() ? selectedDate()!.toISO() : 'None')"
    >
      <org-storybook-example-container-section label="Date Picker">
        <div class="max-w-sm">
          <org-date-picker-input
            #datePicker
            name="single-date"
            placeholder="Select a date..."
            [selectedStartDate]="selectedDate()"
            (dateSelected)="onDateSelected($event)"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (clicked)="setToday()"> Set Today </org-button>
          <org-button color="secondary" size="sm" (clicked)="setYesterday()"> Set Yesterday </org-button>
          <org-button color="secondary" size="sm" (clicked)="clearDate()"> Clear </org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm space-y-1">
          <div>
            <strong>Selected Date:</strong>
            {{ selectedDate() ? selectedDate()!.toISO() : 'None' }}
          </div>
          <div>
            <strong>Public API Result:</strong>
            {{ datePicker.getSelectedDates() | json }}
          </div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
        <li>Input is readonly - dates can only be selected via calendar</li>
        <li>Calendar opens when clicking input, calendar icon, or dropdown caret</li>
        <li>Calendar closes automatically when a date is selected</li>
        <li>Clicking the same date commits that date and closes calendar</li>
        <li>Input value updates only when calendar closes with selection</li>
        <li>Escape key or clicking outside cancels and reverts to previous value</li>
        <li>Focus moves to calendar when opened for keyboard navigation</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class DatePickerInputSingleSelectDemo {
  protected selectedDate = signal<DateTime | null>(null);

  protected onDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    console.log('Date selected:', dates);
    this.selectedDate.set(dates.startDate);
  }

  protected setToday(): void {
    this.selectedDate.set(DateTime.now().startOf('day'));
  }

  protected setYesterday(): void {
    this.selectedDate.set(DateTime.now().minus({ days: 1 }).startOf('day'));
  }

  protected clearDate(): void {
    this.selectedDate.set(null);
  }
}

export const SingleSelect: Story = {
  render: () => ({
    template: '<story-date-picker-input-single-select-demo />',
    moduleMetadata: {
      imports: [DatePickerInputSingleSelectDemo],
    },
  }),
};

@Component({
  selector: 'story-date-picker-input-range-select-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePickerInput, StorybookExampleContainer, StorybookExampleContainerSection, Button, JsonPipe],
  template: `
    <org-storybook-example-container
      title="Date Range Selection"
      [currentState]="
        'Range: ' + (startDate() ? startDate()!.toISO() : 'None') + ' to ' + (endDate() ? endDate()!.toISO() : 'None')
      "
    >
      <org-storybook-example-container-section label="Date Picker">
        <div class="max-w-sm">
          <org-date-picker-input
            name="date-range"
            placeholder="Select date range..."
            [allowRangeSelection]="true"
            [selectedStartDate]="startDate()"
            [selectedEndDate]="endDate()"
            (dateSelected)="onDateSelected($event)"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (clicked)="setThisWeek()"> This Week </org-button>
          <org-button color="secondary" size="sm" (clicked)="setLastWeek()"> Last Week </org-button>
          <org-button color="secondary" size="sm" (clicked)="clearDates()"> Clear </org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm space-y-1">
          <div>
            <strong>Start Date:</strong>
            {{ startDate() ? startDate()!.toISO() : 'None' }}
          </div>
          <div>
            <strong>End Date:</strong>
            {{ endDate() ? endDate()!.toISO() : 'None' }}
          </div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
        <li>Allows selection of start and end dates</li>
        <li>Calendar shows existing range when reopening for visual reference</li>
        <li>First click on any date starts a fresh range with that date as start</li>
        <li>Second click sets end date and closes calendar automatically</li>
        <li>Clicking same date twice creates a same-day range (00:00 - 23:59)</li>
        <li>Input value updates only when calendar closes with complete range</li>
        <li>Escape or clicking outside with incomplete range clears all dates</li>
        <li>Calendar highlights dates in range during selection</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class DatePickerInputRangeSelectDemo {
  protected startDate = signal<DateTime | null>(null);
  protected endDate = signal<DateTime | null>(null);

  protected onDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    console.log('Dates selected:', dates);
    this.startDate.set(dates.startDate);
    this.endDate.set(dates.endDate);
  }

  protected setThisWeek(): void {
    const now = DateTime.now();
    this.startDate.set(now.startOf('week').startOf('day'));
    this.endDate.set(now.endOf('week').endOf('day'));
  }

  protected setLastWeek(): void {
    const lastWeek = DateTime.now().minus({ weeks: 1 });
    this.startDate.set(lastWeek.startOf('week').startOf('day'));
    this.endDate.set(lastWeek.endOf('week').endOf('day'));
  }

  protected clearDates(): void {
    this.startDate.set(null);
    this.endDate.set(null);
  }
}

export const RangeSelect: Story = {
  render: () => ({
    template: '<story-date-picker-input-range-select-demo />',
    moduleMetadata: {
      imports: [DatePickerInputRangeSelectDemo],
    },
  }),
};

@Component({
  selector: 'story-date-picker-input-partial-range-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePickerInput, StorybookExampleContainer, StorybookExampleContainerSection, Button, JsonPipe],
  template: `
    <org-storybook-example-container
      title="Partial Range Selection"
      [currentState]="
        'Type: ' +
        selectionType() +
        ' | Range: ' +
        (startDate() ? startDate()!.toISO() : 'None') +
        ' to ' +
        (endDate() ? endDate()!.toISO() : 'None')
      "
    >
      <org-storybook-example-container-section label="Date Picker">
        <div class="max-w-sm">
          <org-date-picker-input
            name="partial-range"
            placeholder="Select date range..."
            [allowRangeSelection]="true"
            [allowPartialRangeSelection]="true"
            [selectedStartDate]="startDate()"
            [selectedEndDate]="endDate()"
            [partialRangeSelectionType]="selectionType()"
            (dateSelected)="onDateSelected($event)"
            (partialRangeSelectionTypeChange)="onSelectionTypeChange($event)"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (clicked)="setStartOnly()"> Set Start Only </org-button>
          <org-button color="primary" size="sm" (clicked)="setEndOnly()"> Set End Only </org-button>
          <org-button color="primary" size="sm" (clicked)="setRange()"> Set Range </org-button>
          <org-button color="secondary" size="sm" (clicked)="clearDates()"> Clear </org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm space-y-1">
          <div><strong>Selection Type:</strong> {{ selectionType() }}</div>
          <div>
            <strong>Start Date:</strong>
            {{ startDate() ? startDate()!.toISO() : 'None' }}
          </div>
          <div>
            <strong>End Date:</strong>
            {{ endDate() ? endDate()!.toISO() : 'None' }}
          </div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
        <li>Radio group appears below month/year selection in calendar</li>
        <li>Three modes: range, on or before, on or after</li>
        <li>Range mode: standard range selection, closes after second date</li>
        <li>On or after mode: selects start date only, closes immediately, displays "On or after [DATE]"</li>
        <li>On or before mode: selects end date only, closes immediately, displays "On or before [DATE]"</li>
        <li>Switching between ANY modes clears calendar selection</li>
        <li>Input value remains unchanged while switching modes</li>
        <li>Mode change only emits when new date is selected and committed</li>
        <li>Overlay remains open when mode changes</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class DatePickerInputPartialRangeDemo {
  protected startDate = signal<DateTime | null>(null);
  protected endDate = signal<DateTime | null>(null);
  protected selectionType = signal<'range' | 'onOrBefore' | 'onOrAfter'>('range');

  protected onDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    console.log('Dates selected:', dates);
    this.startDate.set(dates.startDate);
    this.endDate.set(dates.endDate);
  }

  protected onSelectionTypeChange(type: 'range' | 'onOrBefore' | 'onOrAfter'): void {
    console.log('Selection type changed:', type);
    this.selectionType.set(type);
  }

  protected setStartOnly(): void {
    this.startDate.set(DateTime.now().startOf('day'));
    this.endDate.set(null);
    this.selectionType.set('onOrAfter');
  }

  protected setEndOnly(): void {
    this.startDate.set(null);
    this.endDate.set(DateTime.now().plus({ days: 7 }).endOf('day'));
    this.selectionType.set('onOrBefore');
  }

  protected setRange(): void {
    this.startDate.set(DateTime.now().startOf('day'));
    this.endDate.set(DateTime.now().plus({ days: 7 }).endOf('day'));
    this.selectionType.set('range');
  }

  protected clearDates(): void {
    this.startDate.set(null);
    this.endDate.set(null);
  }
}

export const PartialRangeSelect: Story = {
  render: () => ({
    template: '<story-date-picker-input-partial-range-demo />',
    moduleMetadata: {
      imports: [DatePickerInputPartialRangeDemo],
    },
  }),
};

@Component({
  selector: 'story-date-picker-input-reactive-forms-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePickerInput,
    ReactiveFormsModule,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    Button,
    JsonPipe,
  ],
  template: `
    <org-storybook-example-container
      title="Reactive Forms Integration"
      currentState="Multiple form controls with different configurations"
    >
      <org-storybook-example-container-section label="Single Date Selection">
        <div class="max-w-sm">
          <org-date-picker-input
            name="reactive-form-single-date"
            [formControl]="singleDateFormControl"
            placeholder="Select a date..."
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Range Selection (No Partial)">
        <div class="max-w-sm">
          <org-date-picker-input
            name="reactive-form-date-range"
            [formControl]="rangeFormControl"
            [allowRangeSelection]="true"
            placeholder="Select date range..."
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Range Selection (With Partial)">
        <div class="max-w-sm">
          <org-date-picker-input
            name="reactive-form-partial-range"
            [formControl]="partialRangeFormControl"
            [allowRangeSelection]="true"
            [allowPartialRangeSelection]="true"
            placeholder="Select date range..."
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (clicked)="setToday()"> Set Single to Today </org-button>
          <org-button color="primary" size="sm" (clicked)="setThisWeek()"> Set Range to This Week </org-button>
          <org-button color="primary" size="sm" (clicked)="setOnOrAfter()"> Set Partial to On or After </org-button>
          <org-button color="secondary" size="sm" (clicked)="clearAll()"> Clear All </org-button>
          <org-button color="secondary" size="sm" (clicked)="disableAll()"> Disable All </org-button>
          <org-button color="secondary" size="sm" (clicked)="enableAll()"> Enable All </org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Form Values">
        <div class="text-sm space-y-3">
          <div>
            <strong>Single Date Value:</strong>
            {{ singleDateFormControl.value | json }}
          </div>
          <div>
            <strong>Range Value:</strong>
            {{ rangeFormControl.value | json }}
          </div>
          <div>
            <strong>Partial Range Value:</strong>
            {{ partialRangeFormControl.value | json }}
          </div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
        <li>Implements ControlValueAccessor for reactive forms</li>
        <li>Each form control value is an object with startDate and endDate</li>
        <li>Single date mode only uses startDate property</li>
        <li>Form value updates immediately when selection completes</li>
        <li>Form marked as touched when calendar closes (any reason)</li>
        <li>Supports setValue, disable, enable</li>
        <li>Calendar closes automatically after complete selection</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class DatePickerInputReactiveFormsDemo {
  protected singleDateFormControl = new FormControl<{ startDate: DateTime | null; endDate: DateTime | null }>({
    startDate: null,
    endDate: null,
  });
  protected rangeFormControl = new FormControl<{ startDate: DateTime | null; endDate: DateTime | null }>({
    startDate: null,
    endDate: null,
  });
  protected partialRangeFormControl = new FormControl<{ startDate: DateTime | null; endDate: DateTime | null }>({
    startDate: null,
    endDate: null,
  });
  protected now = DateTime.now().startOf('day');
  protected nowPlus7 = DateTime.now().plus({ days: 7 }).endOf('day');

  protected setToday(): void {
    this.singleDateFormControl.setValue({ startDate: this.now, endDate: null });
  }

  protected setThisWeek(): void {
    this.rangeFormControl.setValue({ startDate: this.now, endDate: this.nowPlus7 });
  }

  protected setOnOrAfter(): void {
    this.partialRangeFormControl.setValue({ startDate: this.now, endDate: null });
  }

  protected clearAll(): void {
    this.singleDateFormControl.setValue({ startDate: null, endDate: null });
    this.rangeFormControl.setValue({ startDate: null, endDate: null });
    this.partialRangeFormControl.setValue({ startDate: null, endDate: null });
  }

  protected disableAll(): void {
    this.singleDateFormControl.disable();
    this.rangeFormControl.disable();
    this.partialRangeFormControl.disable();
  }

  protected enableAll(): void {
    this.singleDateFormControl.enable();
    this.rangeFormControl.enable();
    this.partialRangeFormControl.enable();
  }
}

export const ReactiveForms: Story = {
  render: () => ({
    template: '<story-date-picker-input-reactive-forms-demo />',
    moduleMetadata: {
      imports: [DatePickerInputReactiveFormsDemo],
    },
  }),
};

@Component({
  selector: 'story-date-picker-input-simple-forms-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePickerInput, StorybookExampleContainer, StorybookExampleContainerSection, Button, JsonPipe],
  template: `
    <org-storybook-example-container
      title="Simple Forms Integration"
      currentState="Multiple date pickers with different configurations"
    >
      <org-storybook-example-container-section label="Single Date Selection">
        <div class="max-w-sm">
          <org-date-picker-input
            name="simple-form-single-date"
            placeholder="Select a date..."
            [selectedStartDate]="singleDate()"
            (dateSelected)="onSingleDateSelected($event)"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Range Selection (No Partial)">
        <div class="max-w-sm">
          <org-date-picker-input
            name="simple-form-date-range"
            placeholder="Select date range..."
            [allowRangeSelection]="true"
            [selectedStartDate]="rangeStartDate()"
            [selectedEndDate]="rangeEndDate()"
            (dateSelected)="onRangeDateSelected($event)"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Range Selection (With Partial)">
        <div class="max-w-sm">
          <org-date-picker-input
            name="simple-form-partial-range"
            placeholder="Select date range..."
            [allowRangeSelection]="true"
            [allowPartialRangeSelection]="true"
            [selectedStartDate]="partialRangeStartDate()"
            [selectedEndDate]="partialRangeEndDate()"
            (dateSelected)="onPartialRangeDateSelected($event)"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (clicked)="setToday()"> Set Single to Today </org-button>
          <org-button color="primary" size="sm" (clicked)="setThisWeek()"> Set Range to This Week </org-button>
          <org-button color="primary" size="sm" (clicked)="setOnOrAfter()"> Set Partial to On or After </org-button>
          <org-button color="secondary" size="sm" (clicked)="clearAll()"> Clear All </org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Current Values">
        <div class="text-sm space-y-3">
          <div>
            <strong>Single Date:</strong>
            {{ singleDate() ? singleDate()!.toISO() : 'None' }}
          </div>
          <div>
            <strong>Range Start:</strong>
            {{ rangeStartDate() ? rangeStartDate()!.toISO() : 'None' }}
          </div>
          <div>
            <strong>Range End:</strong>
            {{ rangeEndDate() ? rangeEndDate()!.toISO() : 'None' }}
          </div>
          <div>
            <strong>Partial Range Start:</strong>
            {{ partialRangeStartDate() ? partialRangeStartDate()!.toISO() : 'None' }}
          </div>
          <div>
            <strong>Partial Range End:</strong>
            {{ partialRangeEndDate() ? partialRangeEndDate()!.toISO() : 'None' }}
          </div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
        <li>Simple event-based integration without forms</li>
        <li>dateSelected event emits immediately when selection completes</li>
        <li>Pass selectedStartDate and selectedEndDate as inputs</li>
        <li>Single date mode only uses startDate</li>
        <li>Calendar closes automatically after complete selection</li>
        <li>Parent component responsible for updating input values</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class DatePickerInputSimpleFormsDemo {
  protected singleDate = signal<DateTime | null>(null);
  protected rangeStartDate = signal<DateTime | null>(null);
  protected rangeEndDate = signal<DateTime | null>(null);
  protected partialRangeStartDate = signal<DateTime | null>(null);
  protected partialRangeEndDate = signal<DateTime | null>(null);

  protected onSingleDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    console.log('Single date selected:', dates);
    this.singleDate.set(dates.startDate);
  }

  protected onRangeDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    console.log('Range dates selected:', dates);
    this.rangeStartDate.set(dates.startDate);
    this.rangeEndDate.set(dates.endDate);
  }

  protected onPartialRangeDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    console.log('Partial range dates selected:', dates);
    this.partialRangeStartDate.set(dates.startDate);
    this.partialRangeEndDate.set(dates.endDate);
  }

  protected setToday(): void {
    this.singleDate.set(DateTime.now().startOf('day'));
  }

  protected setThisWeek(): void {
    const now = DateTime.now();
    this.rangeStartDate.set(now.startOf('week').startOf('day'));
    this.rangeEndDate.set(now.endOf('week').endOf('day'));
  }

  protected setOnOrAfter(): void {
    this.partialRangeStartDate.set(DateTime.now().startOf('day'));
    this.partialRangeEndDate.set(null);
  }

  protected clearAll(): void {
    this.singleDate.set(null);
    this.rangeStartDate.set(null);
    this.rangeEndDate.set(null);
    this.partialRangeStartDate.set(null);
    this.partialRangeEndDate.set(null);
  }
}

export const SimpleForms: Story = {
  render: () => ({
    template: '<story-date-picker-input-simple-forms-demo />',
    moduleMetadata: {
      imports: [DatePickerInputSimpleFormsDemo],
    },
  }),
};

@Component({
  selector: 'story-date-picker-input-reactive-forms-prepopulated-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePickerInput,
    ReactiveFormsModule,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    Button,
    JsonPipe,
  ],
  template: `
    <org-storybook-example-container
      title="Reactive Forms Integration (Prepopulated)"
      currentState="Multiple form controls with different configurations and prepopulated values"
    >
      <org-storybook-example-container-section label="Single Date Selection">
        <div class="max-w-sm">
          <org-date-picker-input
            name="reactive-form-prepopulated-single-date"
            [formControl]="singleDateFormControl"
            placeholder="Select a date..."
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Range Selection (No Partial)">
        <div class="max-w-sm">
          <org-date-picker-input
            name="reactive-form-prepopulated-date-range"
            [formControl]="rangeFormControl"
            [allowRangeSelection]="true"
            placeholder="Select date range..."
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Range Selection (With Partial)">
        <div class="max-w-sm">
          <org-date-picker-input
            name="reactive-form-prepopulated-partial-range"
            [formControl]="partialRangeFormControl"
            [allowRangeSelection]="true"
            [allowPartialRangeSelection]="true"
            [partialRangeSelectionType]="partialRangeSelectionType()"
            (partialRangeSelectionTypeChange)="onPartialRangeSelectionTypeChange($event)"
            placeholder="Select date range..."
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (clicked)="setToday()"> Set Single to Today </org-button>
          <org-button color="primary" size="sm" (clicked)="setThisWeek()"> Set Range to This Week </org-button>
          <org-button color="primary" size="sm" (clicked)="setOnOrAfter()"> Set Partial to On or After </org-button>
          <org-button color="secondary" size="sm" (clicked)="clearAll()"> Clear All </org-button>
          <org-button color="secondary" size="sm" (clicked)="disableAll()"> Disable All </org-button>
          <org-button color="secondary" size="sm" (clicked)="enableAll()"> Enable All </org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Form Values">
        <div class="text-sm space-y-3">
          <div>
            <strong>Single Date Value:</strong>
            {{ singleDateFormControl.value | json }}
          </div>
          <div>
            <strong>Range Value:</strong>
            {{ rangeFormControl.value | json }}
          </div>
          <div>
            <strong>Partial Range Value:</strong>
            {{ partialRangeFormControl.value | json }}
          </div>
          <div>
            <strong>Partial Range Selection Type:</strong>
            {{ partialRangeSelectionType() }}
          </div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
        <li>Implements ControlValueAccessor for reactive forms</li>
        <li>Each form control value is an object with startDate and endDate</li>
        <li>Single date mode only uses startDate property</li>
        <li>All date pickers are prepopulated with values on load</li>
        <li>Form value updates immediately when selection completes</li>
        <li>Form marked as touched when calendar closes (any reason)</li>
        <li>Supports setValue, disable, enable</li>
        <li>Calendar closes automatically after complete selection</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class DatePickerInputReactiveFormsPrepopulatedDemo {
  protected partialRangeSelectionType = signal<CalendarPartialRangeSelectionType>('onOrAfter');

  protected now = DateTime.now().startOf('day');
  protected nowPlus7 = DateTime.now().plus({ days: 7 }).endOf('day');

  protected singleDateFormControl = new FormControl<{ startDate: DateTime | null; endDate: DateTime | null }>({
    startDate: this.now,
    endDate: null,
  });
  protected rangeFormControl = new FormControl<{ startDate: DateTime | null; endDate: DateTime | null }>({
    startDate: DateTime.now().startOf('week').startOf('day'),
    endDate: DateTime.now().endOf('week').endOf('day'),
  });
  protected partialRangeFormControl = new FormControl<{ startDate: DateTime | null; endDate: DateTime | null }>({
    startDate: this.now,
    endDate: null,
  });

  protected setToday(): void {
    this.singleDateFormControl.setValue({ startDate: this.now, endDate: null });
  }

  protected setThisWeek(): void {
    this.rangeFormControl.setValue({ startDate: this.now, endDate: this.nowPlus7 });
  }

  protected setOnOrAfter(): void {
    this.partialRangeFormControl.setValue({ startDate: this.now, endDate: null });
  }

  protected clearAll(): void {
    this.singleDateFormControl.setValue({ startDate: null, endDate: null });
    this.rangeFormControl.setValue({ startDate: null, endDate: null });
    this.partialRangeFormControl.setValue({ startDate: null, endDate: null });
  }

  protected disableAll(): void {
    this.singleDateFormControl.disable();
    this.rangeFormControl.disable();
    this.partialRangeFormControl.disable();
  }

  protected enableAll(): void {
    this.singleDateFormControl.enable();
    this.rangeFormControl.enable();
    this.partialRangeFormControl.enable();
  }

  protected onPartialRangeSelectionTypeChange(type: CalendarPartialRangeSelectionType): void {
    console.log('Partial range selection type changed:', type);
    this.partialRangeSelectionType.set(type);
  }
}

export const ReactiveFormsPrepopulated: Story = {
  render: () => ({
    template: '<story-date-picker-input-reactive-forms-prepopulated-demo />',
    moduleMetadata: {
      imports: [DatePickerInputReactiveFormsPrepopulatedDemo],
    },
  }),
};

@Component({
  selector: 'story-date-picker-input-simple-forms-prepopulated-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePickerInput, StorybookExampleContainer, StorybookExampleContainerSection, Button, JsonPipe],
  template: `
    <org-storybook-example-container
      title="Simple Forms Integration (Prepopulated)"
      currentState="Multiple date pickers with different configurations and prepopulated values"
    >
      <org-storybook-example-container-section label="Single Date Selection">
        <div class="max-w-sm">
          <org-date-picker-input
            name="simple-form-prepopulated-single-date"
            placeholder="Select a date..."
            [selectedStartDate]="singleDate()"
            (dateSelected)="onSingleDateSelected($event)"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Range Selection (No Partial)">
        <div class="max-w-sm">
          <org-date-picker-input
            name="simple-form-prepopulated-date-range"
            placeholder="Select date range..."
            [allowRangeSelection]="true"
            [selectedStartDate]="rangeStartDate()"
            [selectedEndDate]="rangeEndDate()"
            (dateSelected)="onRangeDateSelected($event)"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Range Selection (With Partial)">
        <div class="max-w-sm">
          <org-date-picker-input
            name="simple-form-prepopulated-partial-range"
            placeholder="Select date range..."
            [allowRangeSelection]="true"
            [allowPartialRangeSelection]="true"
            [partialRangeSelectionType]="partialRangeSelectionType()"
            [selectedStartDate]="partialRangeStartDate()"
            [selectedEndDate]="partialRangeEndDate()"
            (dateSelected)="onPartialRangeDateSelected($event)"
            (partialRangeSelectionTypeChange)="onPartialRangeSelectionTypeChange($event)"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (clicked)="setToday()"> Set Single to Today </org-button>
          <org-button color="primary" size="sm" (clicked)="setThisWeek()"> Set Range to This Week </org-button>
          <org-button color="primary" size="sm" (clicked)="setOnOrAfter()"> Set Partial to On or After </org-button>
          <org-button color="secondary" size="sm" (clicked)="clearAll()"> Clear All </org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Current Values">
        <div class="text-sm space-y-3">
          <div>
            <strong>Single Date:</strong>
            {{ singleDate() ? singleDate()!.toISO() : 'None' }}
          </div>
          <div>
            <strong>Range Start:</strong>
            {{ rangeStartDate() ? rangeStartDate()!.toISO() : 'None' }}
          </div>
          <div>
            <strong>Range End:</strong>
            {{ rangeEndDate() ? rangeEndDate()!.toISO() : 'None' }}
          </div>
          <div>
            <strong>Partial Range Start:</strong>
            {{ partialRangeStartDate() ? partialRangeStartDate()!.toISO() : 'None' }}
          </div>
          <div>
            <strong>Partial Range End:</strong>
            {{ partialRangeEndDate() ? partialRangeEndDate()!.toISO() : 'None' }}
          </div>
          <div>
            <strong>Partial Range Selection Type:</strong>
            {{ partialRangeSelectionType() }}
          </div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
        <li>Simple event-based integration without forms</li>
        <li>dateSelected event emits immediately when selection completes</li>
        <li>Pass selectedStartDate and selectedEndDate as inputs</li>
        <li>Single date mode only uses startDate</li>
        <li>All date pickers are prepopulated with values on load</li>
        <li>Calendar closes automatically after complete selection</li>
        <li>Parent component responsible for updating input values</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class DatePickerInputSimpleFormsPrepopulatedDemo {
  protected singleDate = signal<DateTime | null>(DateTime.now().startOf('day'));
  protected rangeStartDate = signal<DateTime | null>(DateTime.now().startOf('week').startOf('day'));
  protected rangeEndDate = signal<DateTime | null>(DateTime.now().endOf('week').endOf('day'));
  protected partialRangeStartDate = signal<DateTime | null>(DateTime.now().startOf('day'));
  protected partialRangeEndDate = signal<DateTime | null>(null);
  protected partialRangeSelectionType = signal<CalendarPartialRangeSelectionType>('onOrAfter');

  protected onSingleDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    console.log('Single date selected:', dates);
    this.singleDate.set(dates.startDate);
  }

  protected onRangeDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    console.log('Range dates selected:', dates);
    this.rangeStartDate.set(dates.startDate);
    this.rangeEndDate.set(dates.endDate);
  }

  protected onPartialRangeDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    console.log('Partial range dates selected:', dates);
    this.partialRangeStartDate.set(dates.startDate);
    this.partialRangeEndDate.set(dates.endDate);
  }

  protected setToday(): void {
    this.singleDate.set(DateTime.now().startOf('day'));
  }

  protected setThisWeek(): void {
    const now = DateTime.now();
    this.rangeStartDate.set(now.startOf('week').startOf('day'));
    this.rangeEndDate.set(now.endOf('week').endOf('day'));
  }

  protected setOnOrAfter(): void {
    this.partialRangeStartDate.set(DateTime.now().startOf('day'));
    this.partialRangeEndDate.set(null);
  }

  protected clearAll(): void {
    this.singleDate.set(null);
    this.rangeStartDate.set(null);
    this.rangeEndDate.set(null);
    this.partialRangeStartDate.set(null);
    this.partialRangeEndDate.set(null);
  }

  protected onPartialRangeSelectionTypeChange(type: CalendarPartialRangeSelectionType): void {
    console.log('Partial range selection type changed:', type);
    this.partialRangeSelectionType.set(type);
  }
}

export const SimpleFormsPrepopulated: Story = {
  render: () => ({
    template: '<story-date-picker-input-simple-forms-prepopulated-demo />',
    moduleMetadata: {
      imports: [DatePickerInputSimpleFormsPrepopulatedDemo],
    },
  }),
};

@Component({
  selector: 'story-date-picker-input-validation-single-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePickerInput, StorybookExampleContainer, StorybookExampleContainerSection, Button, JsonPipe, FormField],
  template: `
    <org-storybook-example-container
      title="Validation - Single Date Required"
      [currentState]="'Has error: ' + hasError()"
    >
      <org-storybook-example-container-section label="Date Picker with Validation">
        <div class="max-w-sm">
          <org-form-field [validationMessage]="validationMessage()">
            <org-date-picker-input
              name="validation-single"
              placeholder="Select a date..."
              [selectedStartDate]="selectedDate()"
              (dateSelected)="onDateSelected($event)"
            />
          </org-form-field>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (clicked)="validateSelection()"> Trigger Validation </org-button>
          <org-button color="secondary" size="sm" (clicked)="clearValidation()"> Clear Validation </org-button>
          <org-button color="secondary" size="sm" (clicked)="clearDate()"> Clear Date </org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm space-y-1">
          <div>
            <strong>Selected Date:</strong>
            {{ selectedDate() ? selectedDate()!.toISO() : 'None' }}
          </div>
          <div><strong>Validation Message:</strong> "{{ validationMessage() }}"</div>
          <div><strong>Has Error:</strong> {{ hasError() }}</div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
        <li>Validation message is displayed when provided</li>
        <li>Date picker shows error state with red border</li>
        <li>Validation message appears below the input</li>
        <li>Validation can be triggered programmatically</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class DatePickerInputValidationSingleDemo {
  protected selectedDate = signal<DateTime | null>(null);
  protected validationMessage = signal<string | null>(null);
  protected hasError = computed<boolean>(() => !!this.validationMessage()?.trim());

  protected onDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    console.log('Date selected:', dates);
    this.selectedDate.set(dates.startDate);

    if (dates.startDate && this.hasError()) {
      this.clearValidation();
    }
  }

  protected validateSelection(): void {
    if (!this.selectedDate()) {
      this.validationMessage.set('Date is required');
    } else {
      this.validationMessage.set('');
    }
  }

  protected clearValidation(): void {
    this.validationMessage.set('');
  }

  protected clearDate(): void {
    this.selectedDate.set(null);
  }
}

export const ValidationSingleRequired: Story = {
  render: () => ({
    template: '<story-date-picker-input-validation-single-demo />',
    moduleMetadata: {
      imports: [DatePickerInputValidationSingleDemo],
    },
  }),
};

@Component({
  selector: 'story-date-picker-input-validation-range-either-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePickerInput, StorybookExampleContainer, StorybookExampleContainerSection, Button, JsonPipe, FormField],
  template: `
    <org-storybook-example-container
      title="Validation - Either Date Required (Range)"
      [currentState]="'Has error: ' + hasError()"
    >
      <org-storybook-example-container-section label="Date Picker with Validation">
        <div class="max-w-sm">
          <org-form-field [validationMessage]="validationMessage()">
            <org-date-picker-input
              name="validation-range-either"
              placeholder="Select at least one date..."
              [allowRangeSelection]="true"
              [allowPartialRangeSelection]="true"
              [selectedStartDate]="startDate()"
              [selectedEndDate]="endDate()"
              (dateSelected)="onDateSelected($event)"
            />
          </org-form-field>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (clicked)="validateSelection()"> Trigger Validation </org-button>
          <org-button color="secondary" size="sm" (clicked)="clearValidation()"> Clear Validation </org-button>
          <org-button color="secondary" size="sm" (clicked)="clearDates()"> Clear Dates </org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm space-y-1">
          <div>
            <strong>Start Date:</strong>
            {{ startDate() ? startDate()!.toISO() : 'None' }}
          </div>
          <div>
            <strong>End Date:</strong>
            {{ endDate() ? endDate()!.toISO() : 'None' }}
          </div>
          <div><strong>Validation Message:</strong> "{{ validationMessage() }}"</div>
          <div><strong>Has Error:</strong> {{ hasError() }}</div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
        <li>At least one date (start or end) must be selected</li>
        <li>Validation message shows when no dates are selected</li>
        <li>Useful for partial range selection validation</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class DatePickerInputValidationRangeEitherDemo {
  protected startDate = signal<DateTime | null>(null);
  protected endDate = signal<DateTime | null>(null);
  protected validationMessage = signal<string | null>(null);
  protected hasError = computed<boolean>(() => !!this.validationMessage()?.trim());

  protected onDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    console.log('Dates selected:', dates);
    this.startDate.set(dates.startDate);
    this.endDate.set(dates.endDate);

    if ((dates.startDate || dates.endDate) && this.hasError()) {
      this.clearValidation();
    }
  }

  protected validateSelection(): void {
    if (!this.startDate() && !this.endDate()) {
      this.validationMessage.set('At least one date is required');
    } else {
      this.validationMessage.set('');
    }
  }

  protected clearValidation(): void {
    this.validationMessage.set('');
  }

  protected clearDates(): void {
    this.startDate.set(null);
    this.endDate.set(null);
  }
}

export const ValidationRangeEitherRequired: Story = {
  render: () => ({
    template: '<story-date-picker-input-validation-range-either-demo />',
    moduleMetadata: {
      imports: [DatePickerInputValidationRangeEitherDemo],
    },
  }),
};

@Component({
  selector: 'story-date-picker-input-validation-range-both-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePickerInput, StorybookExampleContainer, StorybookExampleContainerSection, Button, JsonPipe, FormField],
  template: `
    <org-storybook-example-container
      title="Validation - Both Dates Required (Range)"
      [currentState]="'Has error: ' + hasError()"
    >
      <org-storybook-example-container-section label="Date Picker with Validation">
        <div class="max-w-sm">
          <org-form-field [validationMessage]="validationMessage()">
            <org-date-picker-input
              name="validation-range-both"
              placeholder="Select both dates..."
              [allowRangeSelection]="true"
              [selectedStartDate]="startDate()"
              [selectedEndDate]="endDate()"
              (dateSelected)="onDateSelected($event)"
            />
          </org-form-field>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (clicked)="validateSelection()"> Trigger Validation </org-button>
          <org-button color="secondary" size="sm" (clicked)="clearValidation()"> Clear Validation </org-button>
          <org-button color="secondary" size="sm" (clicked)="clearDates()"> Clear Dates </org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm space-y-1">
          <div>
            <strong>Start Date:</strong>
            {{ startDate() ? startDate()!.toISO() : 'None' }}
          </div>
          <div>
            <strong>End Date:</strong>
            {{ endDate() ? endDate()!.toISO() : 'None' }}
          </div>
          <div><strong>Validation Message:</strong> "{{ validationMessage() }}"</div>
          <div><strong>Has Error:</strong> {{ hasError() }}</div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
        <li>Both start and end dates must be selected</li>
        <li>Validation message shows when either date is missing</li>
        <li>Useful for complete date range validation</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class DatePickerInputValidationRangeBothDemo {
  protected startDate = signal<DateTime | null>(null);
  protected endDate = signal<DateTime | null>(null);
  protected validationMessage = signal<string | null>(null);
  protected hasError = computed<boolean>(() => !!this.validationMessage()?.trim());

  protected onDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    console.log('Dates selected:', dates);
    this.startDate.set(dates.startDate);
    this.endDate.set(dates.endDate);

    if (dates.startDate && dates.endDate && this.hasError()) {
      this.clearValidation();
    }
  }

  protected validateSelection(): void {
    if (!this.startDate() || !this.endDate()) {
      this.validationMessage.set('Both start and end dates are required');
    } else {
      this.validationMessage.set('');
    }
  }

  protected clearValidation(): void {
    this.validationMessage.set('');
  }

  protected clearDates(): void {
    this.startDate.set(null);
    this.endDate.set(null);
  }
}

export const ValidationRangeBothRequired: Story = {
  render: () => ({
    template: '<story-date-picker-input-validation-range-both-demo />',
    moduleMetadata: {
      imports: [DatePickerInputValidationRangeBothDemo],
    },
  }),
};

export const ValidationSpaceReservation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of validation space reservation behavior. When reserveValidationSpace is true, space is always reserved for validation messages to maintain consistent layout. When false, space is only used when a validation message is present.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Validation Space Reservation"
        currentState="Comparing space reservation behaviors"
      >
        <org-storybook-example-container-section label="Reserve Space = true (default)">
          <org-form-fields>
            <org-form-field [reserveValidationSpace]="true">
              <org-date-picker-input
                name="reserve-true-date-picker-1"
                placeholder="Date Picker 1 (no error)"
              />
            </org-form-field>
            <org-form-field [reserveValidationSpace]="true" validationMessage="This field has an error">
              <org-date-picker-input
                name="reserve-true-date-picker-2"
                placeholder="Date Picker 2 (with error)"
              />
            </org-form-field>
            <org-form-field [reserveValidationSpace]="true">
              <org-date-picker-input
                name="reserve-true-date-picker-3"
                placeholder="Date Picker 3 (no error)"
              />
            </org-form-field>
          </org-form-fields>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Reserve Space = false">
          <org-form-fields>
            <org-form-field [reserveValidationSpace]="false">
              <org-date-picker-input
                name="reserve-false-date-picker-1"
                placeholder="Date Picker 1 (no error)"
              />
            </org-form-field>
            <org-form-field [reserveValidationSpace]="false" validationMessage="This field has an error">
              <org-date-picker-input
                name="reserve-false-date-picker-2"
                placeholder="Date Picker 2 (with error)"
              />
            </org-form-field>
            <org-form-field [reserveValidationSpace]="false">
              <org-date-picker-input
                name="reserve-false-date-picker-3"
                placeholder="Date Picker 3 (no error)"
              />
            </org-form-field>
          </org-form-fields>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
          <li><strong>reserveValidationSpace=true</strong>: Space is always reserved for validation messages (maintains consistent spacing between date pickers)</li>
          <li><strong>reserveValidationSpace=false</strong>: Space is only allocated when a validation message is present (date pickers collapse together when no errors)</li>
          <li>Notice how the left column maintains equal spacing between all date pickers</li>
          <li>Notice how the right column's date pickers 1 and 3 are closer together since they have no error messages</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        DatePickerInput,
        FormField,
        FormFields,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
        FormFields,
      ],
    },
  }),
};

@Component({
  selector: 'story-date-picker-input-clear-button-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePickerInput, StorybookExampleContainer, StorybookExampleContainerSection, Button, JsonPipe],
  template: `
    <org-storybook-example-container
      title="Clear Button Feature"
      description="The date picker can include a clear button in the calendar footer to clear selected dates."
    >
      <org-storybook-example-container-section label="With Clear Button (default)">
        <org-date-picker-input
          name="with-clear"
          placeholder="Select date..."
          [selectedStartDate]="singleDateWithClear()"
          (dateSelected)="onSingleDateWithClearChange($event)"
        />
        <div class="mt-2 text-sm">Selected: {{ singleDateWithClear() ? singleDateWithClear()!.toISO() : 'None' }}</div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Without Clear Button">
        <org-date-picker-input
          name="without-clear"
          placeholder="Select date..."
          [allowClear]="false"
          [selectedStartDate]="singleDateWithoutClear()"
          (dateSelected)="onSingleDateWithoutClearChange($event)"
        />
        <div class="mt-2 text-sm">
          Selected: {{ singleDateWithoutClear() ? singleDateWithoutClear()!.toISO() : 'None' }}
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Range Selection With Clear">
        <org-date-picker-input
          name="range-with-clear"
          placeholder="Select date range..."
          [allowRangeSelection]="true"
          [selectedStartDate]="rangeStartDate()"
          [selectedEndDate]="rangeEndDate()"
          (dateSelected)="onRangeDateChange($event)"
        />
        <div class="mt-2 text-sm">
          Start: {{ rangeStartDate() ? rangeStartDate()!.toISO() : 'None' }}<br />
          End: {{ rangeEndDate() ? rangeEndDate()!.toISO() : 'None' }}
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Keyboard Support">
        <div class="mb-2 text-sm">
          Press <kbd class="px-1 py-0.5 bg-neutral rounded border border-neutral">Delete</kbd> or
          <kbd class="px-1 py-0.5 bg-neutral rounded border border-neutral">Backspace</kbd>
          while the calendar is focused to clear the selection.
        </div>
        <org-date-picker-input
          name="keyboard-clear"
          placeholder="Select date..."
          [selectedStartDate]="keyboardClearDate()"
          (dateSelected)="onKeyboardClearDateChange($event)"
        />
        <div class="mt-2 text-sm">Selected: {{ keyboardClearDate() ? keyboardClearDate()!.toISO() : 'None' }}</div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
        <li><strong>Clear button</strong>: Appears in the calendar footer when allowClear is true (default)</li>
        <li><strong>Disabled state</strong>: Clear button is disabled when no date is selected</li>
        <li>
          <strong>Keyboard shortcuts</strong>: Delete and Backspace keys clear the selection when calendar is focused
        </li>
        <li><strong>Close on clear</strong>: The calendar overlay closes automatically after clearing</li>
        <li><strong>Form integration</strong>: Clearing marks the form as dirty and touched in reactive forms</li>
        <li><strong>Works with ranges</strong>: Clear button works for both single date and range selection modes</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class DatePickerInputClearButtonDemo {
  protected singleDateWithClear = signal<DateTime | null>(DateTime.now());
  protected singleDateWithoutClear = signal<DateTime | null>(DateTime.now());
  protected rangeStartDate = signal<DateTime | null>(DateTime.now().minus({ days: 3 }));
  protected rangeEndDate = signal<DateTime | null>(DateTime.now().plus({ days: 3 }));
  protected keyboardClearDate = signal<DateTime | null>(DateTime.now());

  protected onSingleDateWithClearChange(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.singleDateWithClear.set(dates.startDate);
  }

  protected onSingleDateWithoutClearChange(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.singleDateWithoutClear.set(dates.startDate);
  }

  protected onRangeDateChange(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.rangeStartDate.set(dates.startDate);
    this.rangeEndDate.set(dates.endDate);
  }

  protected onKeyboardClearDateChange(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.keyboardClearDate.set(dates.startDate);
  }
}

export const ClearButton: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [DatePickerInputClearButtonDemo],
    },
    template: '<story-date-picker-input-clear-button-demo />',
  }),
};

@Component({
  selector: 'story-date-picker-input-focused-blurred-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePickerInput, StorybookExampleContainer, StorybookExampleContainerSection],
  template: `
    <org-storybook-example-container
      title="Focused / Blurred Events"
      [currentState]="'Focused: ' + isFocused() + ' | Event log: ' + lastEvent()"
    >
      <org-storybook-example-container-section label="Date Picker">
        <div class="max-w-sm">
          <org-date-picker-input
            name="focused-blurred"
            placeholder="Click to focus..."
            (focused)="onFocused()"
            (blurred)="onBlurred()"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm space-y-1">
          <div><strong>Currently Focused:</strong> {{ isFocused() }}</div>
          <div><strong>Last Event:</strong> {{ lastEvent() }}</div>
          <div><strong>Focus Count:</strong> {{ focusCount() }}</div>
          <div><strong>Blur Count:</strong> {{ blurCount() }}</div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc space-y-1">
        <li>The focused event fires when the inner input receives focus</li>
        <li>The blurred event fires when the inner input loses focus</li>
        <li>Focus and blur counts increment with each corresponding event</li>
        <li>Tab into the input to trigger focused, tab away to trigger blurred</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class DatePickerInputFocusedBlurredDemo {
  protected isFocused = signal<boolean>(false);
  protected lastEvent = signal<string>('none');
  protected focusCount = signal<number>(0);
  protected blurCount = signal<number>(0);

  protected onFocused(): void {
    console.log('focused');
    this.isFocused.set(true);
    this.lastEvent.set('focused');
    this.focusCount.update((count) => count + 1);
  }

  protected onBlurred(): void {
    console.log('blurred');
    this.isFocused.set(false);
    this.lastEvent.set('blurred');
    this.blurCount.update((count) => count + 1);
  }
}

export const FocusedBlurred: Story = {
  render: () => ({
    template: '<story-date-picker-input-focused-blurred-demo />',
    moduleMetadata: {
      imports: [DatePickerInputFocusedBlurredDemo],
    },
  }),
};
