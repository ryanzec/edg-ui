import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  ViewChild,
  forwardRef,
  afterNextRender,
  inject,
  Injector,
  DestroyRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { DateTime } from 'luxon';
import { Input } from '../input/input';
import { Calendar } from '../calendar/calendar';
import { CalendarFooter } from '../calendar/calendar-footer';
import { CalendarFooterLeftActions } from '../calendar/calendar-footer-left-actions';
import { CalendarFooterRightActions } from '../calendar/calendar-footer-right-actions';
import { Button } from '../button/button';
import { angularUtils, DateFormat, TimeFormat } from '@organization/shared-utils';
import {
  DatePickerInputBrainDirective,
  type DatePickerInputCommitMode,
  DATE_PICKER_INPUT_COMMIT_MODE_DEFAULT,
  DATE_PICKER_INPUT_RESET_ON_MODE_CHANGE_DEFAULT,
} from '../date-picker-input/date-picker-input-brain';
import { DatePickerInputDialogBrainDirective } from '../date-picker-input/date-picker-input-dialog-brain';
import { type CalendarPartialRangeSelectionType } from '../calendar/calendar-brain';
import { Icon } from '../icon/icon';

export const DATE_PICKER_INPUT_DATE_FORMAT_DEFAULT: DateFormat = DateFormat.STANDARD;
export const DATE_PICKER_INPUT_TIME_FORMAT_DEFAULT: TimeFormat | undefined = undefined;
export const DATE_PICKER_INPUT_ALLOW_PARTIAL_RANGE_SELECTION_DEFAULT = false;
export const DATE_PICKER_INPUT_PARTIAL_RANGE_SELECTION_TYPE_DEFAULT: CalendarPartialRangeSelectionType = 'range';
export const DATE_PICKER_INPUT_PLACEHOLDER_DEFAULT = 'Select date...';
export const DATE_PICKER_INPUT_AUTO_FOCUS_DEFAULT = false;
export const DATE_PICKER_INPUT_DEFAULT_DISPLAY_DATE_DEFAULT: DateTime = DateTime.now();
export const DATE_PICKER_INPUT_START_YEAR_DEFAULT: number = DateTime.now().year - 100;
export const DATE_PICKER_INPUT_END_YEAR_DEFAULT: number = DateTime.now().year + 20;
export const DATE_PICKER_INPUT_SELECTED_START_DATE_DEFAULT: DateTime | undefined = undefined;
export const DATE_PICKER_INPUT_SELECTED_END_DATE_DEFAULT: DateTime | undefined = undefined;
export const DATE_PICKER_INPUT_ALLOW_RANGE_SELECTION_DEFAULT = false;
export const DATE_PICKER_INPUT_DISABLE_BEFORE_DEFAULT: DateTime | undefined = undefined;
export const DATE_PICKER_INPUT_DISABLE_AFTER_DEFAULT: DateTime | undefined = undefined;
export const DATE_PICKER_INPUT_ALLOWED_DATE_RANGE_DEFAULT = 0;
export const DATE_PICKER_INPUT_DISABLED_DEFAULT = false;
export const DATE_PICKER_INPUT_ALLOW_CLEAR_DEFAULT = true;
export const DATE_PICKER_INPUT_ALLOW_TRIGGER_CLEAR_DEFAULT = false;

// re-export the brain's commit-mode public surface so consumers can import from the presentation entry point
export {
  type DatePickerInputCommitMode,
  DATE_PICKER_INPUT_COMMIT_MODE_DEFAULT,
  DATE_PICKER_INPUT_RESET_ON_MODE_CHANGE_DEFAULT,
};

/**
 * date picker input component for date selection in forms
 */
@Component({
  selector: 'org-date-picker-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Input,
    CdkOverlayOrigin,
    CdkConnectedOverlay,
    Calendar,
    CalendarFooter,
    CalendarFooterLeftActions,
    CalendarFooterRightActions,
    Button,
    Icon,
    DatePickerInputDialogBrainDirective,
  ],
  templateUrl: './date-picker-input.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerInput),
      multi: true,
    },
  ],
  hostDirectives: [
    {
      directive: DatePickerInputBrainDirective,
      inputs: [
        'selectedStartDate',
        'selectedEndDate',
        'allowRangeSelection',
        'allowPartialRangeSelection',
        'partialRangeSelectionType',
        'disabled',
        'allowClear',
        'autoFocus',
        'commitMode',
        'resetOnModeChange',
      ],
    },
  ],
  styleUrl: './date-picker-input.css',
  host: {
    '[attr.data-date-format]': 'dateFormat()',
    '[attr.data-allow-range-selection]': 'allowRangeSelection() ? "" : null',
    '[attr.data-allow-partial-range-selection]': 'allowPartialRangeSelection() ? "" : null',
    '[attr.data-partial-range-selection-type]': 'partialRangeSelectionType()',
    '[attr.data-allow-clear]': 'allowClear() ? "" : null',
    '[attr.data-allow-trigger-clear]': 'allowTriggerClear() ? "" : null',
    '[attr.data-commit-mode]': 'commitMode()',
  },
})
export class DatePickerInput implements ControlValueAccessor {
  private readonly _injector = inject(Injector);
  private readonly _destroyRef = inject(DestroyRef);
  protected readonly brain = inject(DatePickerInputBrainDirective, { self: true });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: { startDate: DateTime | null; endDate: DateTime | null }) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  @ViewChild('inputComponent', { static: true })
  protected readonly inputComponent!: Input;

  @ViewChild('calendarComponent')
  protected readonly calendarComponent?: Calendar;

  @ViewChild(CdkConnectedOverlay)
  protected readonly connectedOverlayDirective?: CdkConnectedOverlay;

  // custom input properties
  public readonly dateFormat = input<DateFormat>(DATE_PICKER_INPUT_DATE_FORMAT_DEFAULT);
  public readonly timeFormat = input<TimeFormat | undefined, TimeFormat | null | undefined>(
    DATE_PICKER_INPUT_TIME_FORMAT_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );
  public readonly allowPartialRangeSelection = input<boolean>(DATE_PICKER_INPUT_ALLOW_PARTIAL_RANGE_SELECTION_DEFAULT);
  public readonly partialRangeSelectionType = input<CalendarPartialRangeSelectionType>(
    DATE_PICKER_INPUT_PARTIAL_RANGE_SELECTION_TYPE_DEFAULT
  );

  // proxied input properties - input component
  public readonly placeholder = input<string>(DATE_PICKER_INPUT_PLACEHOLDER_DEFAULT);
  public readonly autoFocus = input<boolean>(DATE_PICKER_INPUT_AUTO_FOCUS_DEFAULT);
  public readonly name = input.required<string>();

  // proxied input properties - calendar component
  public readonly defaultDisplayDate = input<DateTime>(DATE_PICKER_INPUT_DEFAULT_DISPLAY_DATE_DEFAULT);
  public readonly startYear = input<number>(DATE_PICKER_INPUT_START_YEAR_DEFAULT);
  public readonly endYear = input<number>(DATE_PICKER_INPUT_END_YEAR_DEFAULT);
  public readonly selectedStartDate = input<DateTime | undefined, DateTime | null | undefined>(
    DATE_PICKER_INPUT_SELECTED_START_DATE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );
  public readonly selectedEndDate = input<DateTime | undefined, DateTime | null | undefined>(
    DATE_PICKER_INPUT_SELECTED_END_DATE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );
  public readonly allowRangeSelection = input<boolean>(DATE_PICKER_INPUT_ALLOW_RANGE_SELECTION_DEFAULT);
  public readonly disableBefore = input<DateTime | undefined, DateTime | null | undefined>(
    DATE_PICKER_INPUT_DISABLE_BEFORE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );
  public readonly disableAfter = input<DateTime | undefined, DateTime | null | undefined>(
    DATE_PICKER_INPUT_DISABLE_AFTER_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );
  public readonly allowedDateRange = input<number>(DATE_PICKER_INPUT_ALLOWED_DATE_RANGE_DEFAULT);

  // additional input properties
  public readonly disabled = input<boolean>(DATE_PICKER_INPUT_DISABLED_DEFAULT);
  public readonly allowClear = input<boolean>(DATE_PICKER_INPUT_ALLOW_CLEAR_DEFAULT);
  /** when true, renders an inline clear button at the trigger's post edge that wipes the value without opening the popover */
  public readonly allowTriggerClear = input<boolean>(DATE_PICKER_INPUT_ALLOW_TRIGGER_CLEAR_DEFAULT);
  /** auto commits on completion of the calendar selection; manual requires the user to press Apply in the popover footer */
  public readonly commitMode = input<DatePickerInputCommitMode>(DATE_PICKER_INPUT_COMMIT_MODE_DEFAULT);
  /** when true, switching the mode-related inputs clears the current selection and notifies the parent */
  public readonly resetOnModeChange = input<boolean>(DATE_PICKER_INPUT_RESET_ON_MODE_CHANGE_DEFAULT);

  // output events - proxied from input
  public readonly focused = output<void>();
  public readonly blurred = output<void>();

  // output events - custom
  public readonly dateSelected = output<{ startDate: DateTime | null; endDate: DateTime | null }>();
  public readonly partialRangeSelectionTypeChange = output<CalendarPartialRangeSelectionType>();

  // computed properties (proxied from brain)
  protected readonly isOverlayOpen = computed<boolean>(() => this.brain.isOverlayOpen());
  protected readonly isDisabled = computed<boolean>(() => this.brain.isDisabled());
  protected readonly committedStartDate = computed<DateTime | null>(() => this.brain.committedStartDate());
  protected readonly committedEndDate = computed<DateTime | null>(() => this.brain.committedEndDate());
  protected readonly inProgressStartDate = computed<DateTime | null>(() => this.brain.inProgressStartDate());
  protected readonly inProgressEndDate = computed<DateTime | null>(() => this.brain.inProgressEndDate());
  protected readonly inProgressPartialRangeSelectionType = computed<CalendarPartialRangeSelectionType>(() =>
    this.brain.inProgressPartialRangeSelectionType()
  );
  protected readonly isClearDisabled = computed<boolean>(() => this.brain.isClearDisabled());
  protected readonly canApply = computed<boolean>(() => this.brain.canApply());
  protected readonly isManualCommitMode = computed<boolean>(() => this.commitMode() === 'manual');
  /** true when the post trigger clear-button slot should render (opt-in via allowTriggerClear, gated by value + disabled) */
  protected readonly showTriggerClearButton = computed<boolean>(
    () => this.allowTriggerClear() && !this.isClearDisabled() && !this.isDisabled()
  );

  /** formatted display value for the input (uses committed values only) */
  protected readonly displayValue = computed<string>(() => {
    const startDate = this.committedStartDate();
    const endDate = this.committedEndDate();
    const dateFormat = this.dateFormat();
    const timeFormat = this.timeFormat() ? ` ${this.timeFormat()}` : '';
    const allowPartial = this.allowPartialRangeSelection();
    const selectionType = this.brain.committedPartialRangeSelectionType();
    const isRange = this.allowRangeSelection();
    const format = `${dateFormat}${timeFormat}`;

    if (!isRange) {
      if (!startDate) {
        return '';
      }

      return startDate.toFormat(format);
    }

    if (!startDate && !endDate) {
      return '';
    }

    if (startDate && !endDate) {
      if (allowPartial && selectionType === 'onOrAfter') {
        return `On or after ${startDate.toFormat(format)}`;
      }

      // in-progress / pending end — post em-dash reads as "and ..."
      return `${startDate.toFormat(format)} —`;
    }

    if (!startDate && endDate) {
      if (allowPartial && selectionType === 'onOrBefore') {
        return `On or before ${endDate.toFormat(format)}`;
      }

      return `— ${endDate.toFormat(format)}`;
    }

    // committed range — right arrow separator
    return `${startDate!.toFormat(format)} → ${endDate!.toFormat(format)}`;
  });

  /** overlay position configurations */
  protected readonly overlayPositions = [
    {
      originX: 'start' as const,
      originY: 'bottom' as const,
      overlayX: 'start' as const,
      overlayY: 'top' as const,
      offsetY: 4,
    },
    {
      originX: 'end' as const,
      originY: 'bottom' as const,
      overlayX: 'end' as const,
      overlayY: 'top' as const,
      offsetY: 4,
    },
    {
      originX: 'start' as const,
      originY: 'top' as const,
      overlayX: 'start' as const,
      overlayY: 'bottom' as const,
      offsetY: -4,
    },
    {
      originX: 'end' as const,
      originY: 'top' as const,
      overlayX: 'end' as const,
      overlayY: 'bottom' as const,
      offsetY: -4,
    },
  ];

  constructor() {
    this._destroyRef.onDestroy(() => {
      this.brain.markDestroyed();
    });

    // forward brain's form-controlled date-selected to the cva _onChange callback
    this.brain.dateSelectedNotified.subscribe((selection) => {
      this._onChange(selection);
    });

    // forward brain's non-form date-selected emissions to the public dateSelected output
    this.brain.dateSelectedEmitted.subscribe((selection) => {
      this.dateSelected.emit(selection);
    });

    // forward brain's partial-range type change emissions to the public output
    this.brain.partialRangeSelectionTypeEmitted.subscribe((type) => {
      this.partialRangeSelectionTypeChange.emit(type);
    });

    // forward brain's touched-notified events to the cva _onTouched callback
    this.brain.touchedNotified.subscribe(() => {
      this._onTouched();
    });

    // when the brain wants the calendar focused (after overlay attach), apply it
    this.brain.focusCalendarRequested.subscribe(() => {
      afterNextRender(
        () => {
          if (this.calendarComponent?.calendarContainerRef) {
            this.calendarComponent.calendarContainerRef.nativeElement.focus();
          }
        },
        { injector: this._injector }
      );
    });
  }

  // template event handlers — all delegate to the brain
  protected onInputClick(): void {
    this.brain.handleInputClick();
  }

  protected onPostIconClick(): void {
    this.brain.handlePostIconClick(() => this.inputComponent.focusInput());
  }

  protected onDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.brain.handleDateSelected(dates);
  }

  protected onPartialRangeSelectionTypeChange(type: CalendarPartialRangeSelectionType): void {
    this.brain.handlePartialRangeSelectionTypeChange(type);
  }

  protected onInputKeyDown(event: KeyboardEvent): void {
    this.brain.handleInputKeyDown(event);
  }

  protected onClearClick(): void {
    this.brain.handleClearClick();
  }

  protected onTriggerClearClick(event: Event): void {
    // prevent click from bubbling to the trigger and re-opening the overlay
    event.stopPropagation();
    this.brain.handleClearClick();
  }

  protected onTriggerChevronClick(event: Event): void {
    // prevent click from bubbling to the trigger; chevron-only buttons must drive a single toggle action
    event.stopPropagation();

    if (this.isDisabled()) {
      return;
    }

    if (this.isOverlayOpen()) {
      this.brain.closeOverlay();

      return;
    }

    this.brain.openOverlay();
  }

  protected onApplyClick(): void {
    this.brain.handleApplyClick();
  }

  protected onCancelClick(): void {
    this.brain.handleCancelClick();
  }

  protected onBackdropClick(): void {
    this.brain.handleBackdropClick();
  }

  protected onOverlayAttach(): void {
    this.brain.handleOverlayAttach();
  }

  protected onOverlayDetach(): void {
    this.brain.handleOverlayDetach();
  }

  protected onInputFocused(): void {
    this.focused.emit();
  }

  protected onInputBlurred(): void {
    this.blurred.emit();
  }

  /** public api: get committed selected dates */
  public getSelectedDates(): { startDate: DateTime | null; endDate: DateTime | null } {
    return this.brain.getSelectedDates();
  }

  // control value accessor implementation
  public writeValue(value: { startDate: DateTime | null; endDate: DateTime | null } | null): void {
    this.brain.writeValue(value);
  }

  public registerOnChange(fn: (value: { startDate: DateTime | null; endDate: DateTime | null }) => void): void {
    this.brain.setFormControlled();
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.brain.setFormDisabled(isDisabled);
  }
}
