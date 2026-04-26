import { Directive, computed, effect, input, output, signal } from '@angular/core';
import { DateTime } from 'luxon';
import type { CalendarPartialRangeSelectionType } from '../calendar-brain/calendar-brain';

/** the per-selection value emitted by the brain when a selection is committed or cancelled */
export type DatePickerInputSelection = {
  startDate: DateTime | null;
  endDate: DateTime | null;
};

/** default value for the datePickerInputAllowPartialRangeSelection input */
export const DATE_PICKER_INPUT_ALLOW_PARTIAL_RANGE_SELECTION_DEFAULT = false;

/** default value for the datePickerInputPartialRangeSelectionType input */
export const DATE_PICKER_INPUT_PARTIAL_RANGE_SELECTION_TYPE_DEFAULT: CalendarPartialRangeSelectionType = 'range';

/** default value for the datePickerInputSelectedStartDate input */
export const DATE_PICKER_INPUT_SELECTED_START_DATE_DEFAULT: DateTime | null = null;

/** default value for the datePickerInputSelectedEndDate input */
export const DATE_PICKER_INPUT_SELECTED_END_DATE_DEFAULT: DateTime | null = null;

/** default value for the datePickerInputAllowRangeSelection input */
export const DATE_PICKER_INPUT_ALLOW_RANGE_SELECTION_DEFAULT = false;

/** default value for the datePickerInputDisabled input */
export const DATE_PICKER_INPUT_DISABLED_DEFAULT = false;

/** the internal state shape for the date-picker-input brain directive */
type DatePickerInputState = {
  // committed values (shown in input field, sent to form control)
  committedStartDate: DateTime | null;
  committedEndDate: DateTime | null;
  committedPartialRangeSelectionType: CalendarPartialRangeSelectionType;
  // in-progress values (being selected in calendar)
  inProgressStartDate: DateTime | null;
  inProgressEndDate: DateTime | null;
  inProgressPartialRangeSelectionType: CalendarPartialRangeSelectionType;
  // snapshot when overlay opened (for cancel behavior)
  snapshotStartDate: DateTime | null;
  snapshotEndDate: DateTime | null;
  snapshotPartialRangeSelectionType: CalendarPartialRangeSelectionType;
  // track if first selection in range mode has been made
  hasFirstRangeSelection: boolean;
  disabled: boolean;
};

/**
 * headless brain directive for the date-picker-input component. owns the 3-state model
 * (committed / in-progress / snapshot), the overlay-open state, the form-controlled flag, the
 * closing-after-commit flag, and all selection logic — open / close, on-date-selected with first-range detection,
 * partial-range-type switching with clearing, clear, commit, revert / clear on cancel, completion detection, and
 * the writeValue / setDisabled hooks for ControlValueAccessor.
 *
 * the brain emits abstract events (dateSelectedNotified for form-controlled, dateSelectedEmitted for non-form,
 * touchedNotified, focusCalendarRequested) that the presentation routes to callbacks / outputs.
 */
@Directive({
  selector: '[orgDatePickerInputBrain]',
  exportAs: 'orgDatePickerInputBrain',
})
export class DatePickerInputBrainDirective {
  private readonly _isFormControlled = signal<boolean>(false);
  private readonly _isOverlayOpenSignal = signal<boolean>(false);
  private _isClosingAfterCommit = false;
  private _isDestroyed = false;

  private readonly _state = signal<DatePickerInputState>({
    committedStartDate: null,
    committedEndDate: null,
    committedPartialRangeSelectionType: 'range',
    inProgressStartDate: null,
    inProgressEndDate: null,
    inProgressPartialRangeSelectionType: 'range',
    snapshotStartDate: null,
    snapshotEndDate: null,
    snapshotPartialRangeSelectionType: 'range',
    hasFirstRangeSelection: false,
    disabled: false,
  });

  // inputs
  public readonly datePickerInputSelectedStartDate = input<DateTime | null>(
    DATE_PICKER_INPUT_SELECTED_START_DATE_DEFAULT
  );
  public readonly datePickerInputSelectedEndDate = input<DateTime | null>(DATE_PICKER_INPUT_SELECTED_END_DATE_DEFAULT);
  public readonly datePickerInputAllowRangeSelection = input<boolean>(DATE_PICKER_INPUT_ALLOW_RANGE_SELECTION_DEFAULT);
  public readonly datePickerInputAllowPartialRangeSelection = input<boolean>(
    DATE_PICKER_INPUT_ALLOW_PARTIAL_RANGE_SELECTION_DEFAULT
  );
  public readonly datePickerInputPartialRangeSelectionType = input<CalendarPartialRangeSelectionType>(
    DATE_PICKER_INPUT_PARTIAL_RANGE_SELECTION_TYPE_DEFAULT
  );
  public readonly datePickerInputDisabled = input<boolean>(DATE_PICKER_INPUT_DISABLED_DEFAULT);

  // outputs — abstract events the presentation routes to its public api / cva callbacks
  public readonly datePickerInputDateSelectedNotified = output<DatePickerInputSelection>();
  public readonly datePickerInputDateSelectedEmitted = output<DatePickerInputSelection>();
  public readonly datePickerInputPartialRangeSelectionTypeEmitted = output<CalendarPartialRangeSelectionType>();
  public readonly datePickerInputTouchedNotified = output<void>();
  public readonly datePickerInputFocusCalendarRequested = output<void>();

  /** whether the overlay is currently open */
  public readonly isOverlayOpen = computed<boolean>(() => this._isOverlayOpenSignal());

  /** whether the date-picker is disabled (form-controlled disabled state when form-controlled, else input) */
  public readonly isDisabled = computed<boolean>(() => {
    if (this._isFormControlled()) {
      return this._state().disabled;
    }

    return this.datePickerInputDisabled();
  });

  /** the committed start date (form-controlled internal state when form-controlled, else input) */
  public readonly committedStartDate = computed<DateTime | null>(() => {
    if (this._isFormControlled()) {
      return this._state().committedStartDate;
    }

    return this.datePickerInputSelectedStartDate();
  });

  /** the committed end date (form-controlled internal state when form-controlled, else input) */
  public readonly committedEndDate = computed<DateTime | null>(() => {
    if (this._isFormControlled()) {
      return this._state().committedEndDate;
    }

    return this.datePickerInputSelectedEndDate();
  });

  /** the committed partial-range type (form-controlled internal state when form-controlled, else input) */
  public readonly committedPartialRangeSelectionType = computed<CalendarPartialRangeSelectionType>(() => {
    if (this._isFormControlled()) {
      return this._state().committedPartialRangeSelectionType;
    }

    return this.datePickerInputPartialRangeSelectionType();
  });

  /** the in-progress start date (always from internal state) */
  public readonly inProgressStartDate = computed<DateTime | null>(() => this._state().inProgressStartDate);

  /** the in-progress end date (always from internal state) */
  public readonly inProgressEndDate = computed<DateTime | null>(() => this._state().inProgressEndDate);

  /** the in-progress partial-range type (always from internal state) */
  public readonly inProgressPartialRangeSelectionType = computed<CalendarPartialRangeSelectionType>(
    () => this._state().inProgressPartialRangeSelectionType
  );

  /** whether the clear button should be disabled (no committed dates) */
  public readonly isClearDisabled = computed<boolean>(
    () => this.committedStartDate() === null && this.committedEndDate() === null
  );

  constructor() {
    // sync the partialRangeSelectionType input to internal state for form-controlled components
    effect(() => {
      const type = this.datePickerInputPartialRangeSelectionType();
      this._state.update((state) => ({
        ...state,
        committedPartialRangeSelectionType: type,
        inProgressPartialRangeSelectionType: type,
        snapshotPartialRangeSelectionType: type,
      }));
    });
  }

  /** marks the date-picker as form-controlled (called by registerOnChange in the presentation) */
  public setFormControlled(): void {
    this._isFormControlled.set(true);
  }

  /** sets the form-controlled disabled state (called by setDisabledState in the presentation) */
  public setFormDisabled(disabled: boolean): void {
    this._state.update((state) => ({ ...state, disabled }));
  }

  /** marks the brain as destroyed so late overlay-detach events are ignored */
  public markDestroyed(): void {
    this._isDestroyed = true;
  }

  /** returns the current committed selection (public api) */
  public getSelectedDates(): DatePickerInputSelection {
    return {
      startDate: this.committedStartDate(),
      endDate: this.committedEndDate(),
    };
  }

  /** updates internal committed state from a writeValue call */
  public writeValue(value: DatePickerInputSelection | null): void {
    const sanitize = (date: unknown): DateTime | null => {
      if (date === null || date === undefined) {
        return null;
      }

      if (DateTime.isDateTime(date) && date.isValid) {
        return date;
      }

      return null;
    };

    const startDate = sanitize(value?.startDate);
    const endDate = sanitize(value?.endDate);

    this._state.update((state) => ({
      ...state,
      committedStartDate: startDate,
      committedEndDate: endDate,
    }));
  }

  /** opens the overlay if not disabled; snapshots current state and initialises in-progress */
  public openOverlay(): void {
    if (this.isDisabled()) {
      return;
    }

    if (this._isOverlayOpenSignal()) {
      return;
    }

    const currentStart = this.committedStartDate();
    const currentEnd = this.committedEndDate();
    const currentMode = this.committedPartialRangeSelectionType();

    this._state.update((state) => ({
      ...state,
      snapshotStartDate: currentStart,
      snapshotEndDate: currentEnd,
      snapshotPartialRangeSelectionType: currentMode,
      inProgressStartDate: currentStart,
      inProgressEndDate: currentEnd,
      inProgressPartialRangeSelectionType: currentMode,
      hasFirstRangeSelection: false,
    }));

    this._isOverlayOpenSignal.set(true);
  }

  /** closes the overlay; the actual revert/clear logic runs in onOverlayDetach */
  public closeOverlay(): void {
    this._isOverlayOpenSignal.set(false);
  }

  /** handles input click — opens overlay when not already open */
  public handleInputClick(): void {
    if (this.isDisabled()) {
      return;
    }

    if (!this._isOverlayOpenSignal()) {
      this.openOverlay();
    }
  }

  /** handles post-icon (caret) click — toggles overlay or focuses input */
  public handlePostIconClick(focusInput: () => void): void {
    if (this.isDisabled()) {
      return;
    }

    if (this._isOverlayOpenSignal()) {
      this.closeOverlay();

      return;
    }

    focusInput();
  }

  /** handles input keydown — opens overlay on enter / space */
  public handleInputKeyDown(event: KeyboardEvent): void {
    if ((event.key === 'Enter' || event.key === ' ') && !this._isOverlayOpenSignal()) {
      event.preventDefault();
      this.openOverlay();
    }
  }

  /** handles calendar keyboard events — clears on delete / backspace when allowed */
  public handleCalendarKeyDown(event: KeyboardEvent, allowClear: boolean): void {
    if ((event.key === 'Delete' || event.key === 'Backspace') && allowClear && !this.isClearDisabled()) {
      event.preventDefault();
      this.handleClearClick();
    }
  }

  /** handles date selection from the calendar */
  public handleDateSelected(dates: DatePickerInputSelection): void {
    const isRange = this.datePickerInputAllowRangeSelection();
    const currentState = this._state();
    const selectionType = currentState.inProgressPartialRangeSelectionType;

    // first selection in range mode — detect which date was actually clicked
    if (isRange && !currentState.hasFirstRangeSelection && selectionType === 'range') {
      let clickedDate: DateTime | null = null;

      const startChanged = dates.startDate?.toMillis() !== currentState.inProgressStartDate?.toMillis();
      const endChanged = dates.endDate?.toMillis() !== currentState.inProgressEndDate?.toMillis();

      if (startChanged && dates.startDate) {
        clickedDate = dates.startDate;
      } else if (endChanged && dates.endDate) {
        clickedDate = dates.endDate;
      } else if (dates.startDate) {
        clickedDate = dates.startDate;
      }

      this._state.update((state) => ({
        ...state,
        inProgressStartDate: clickedDate,
        inProgressEndDate: null,
        hasFirstRangeSelection: true,
      }));

      return;
    }

    this._state.update((state) => ({
      ...state,
      inProgressStartDate: dates.startDate,
      inProgressEndDate: dates.endDate,
    }));

    if (this._isSelectionComplete(dates.startDate, dates.endDate)) {
      this._commitSelection(dates.startDate, dates.endDate);
    }
  }

  /** handles partial range type change from the calendar; updates in-progress only (commits later) */
  public handlePartialRangeSelectionTypeChange(type: CalendarPartialRangeSelectionType): void {
    const currentType = this._state().inProgressPartialRangeSelectionType;

    const shouldClear =
      (currentType === 'range' && type !== 'range') ||
      (currentType === 'onOrBefore' && type === 'onOrAfter') ||
      (currentType === 'onOrAfter' && type === 'onOrBefore') ||
      (currentType !== 'range' && type === 'range');

    if (shouldClear) {
      this._state.update((state) => ({
        ...state,
        inProgressPartialRangeSelectionType: type,
        inProgressStartDate: null,
        inProgressEndDate: null,
        hasFirstRangeSelection: false,
      }));

      return;
    }

    this._state.update((state) => ({
      ...state,
      inProgressPartialRangeSelectionType: type,
    }));
  }

  /** handles clear button click */
  public handleClearClick(): void {
    if (this.isClearDisabled()) {
      return;
    }

    this._state.update((state) => ({
      ...state,
      committedStartDate: null,
      committedEndDate: null,
      inProgressStartDate: null,
      inProgressEndDate: null,
      hasFirstRangeSelection: false,
    }));

    if (this._isFormControlled()) {
      this.datePickerInputDateSelectedNotified.emit({ startDate: null, endDate: null });
      this.datePickerInputTouchedNotified.emit();
    } else {
      this.datePickerInputDateSelectedEmitted.emit({ startDate: null, endDate: null });
    }

    this._isClosingAfterCommit = true;
    this.closeOverlay();
  }

  /** handles backdrop click — just close, revert/clear logic is in onOverlayDetach */
  public handleBackdropClick(): void {
    this.closeOverlay();
  }

  /** handles overlay attach event from cdk */
  public handleOverlayAttach(): void {
    this._isOverlayOpenSignal.set(true);
    this.datePickerInputFocusCalendarRequested.emit();
  }

  /** handles overlay detach event from cdk; reverts/clears if closing without an explicit commit */
  public handleOverlayDetach(): void {
    if (this._isDestroyed) {
      return;
    }

    if (!this._isClosingAfterCommit) {
      this._revertOrClearSelection();
    }

    this._isClosingAfterCommit = false;
    this._isOverlayOpenSignal.set(false);
    this.datePickerInputTouchedNotified.emit();
  }

  private _isSelectionComplete(startDate: DateTime | null, endDate: DateTime | null): boolean {
    const isRange = this.datePickerInputAllowRangeSelection();
    const allowPartial = this.datePickerInputAllowPartialRangeSelection();
    const selectionType = this._state().inProgressPartialRangeSelectionType;

    if (!isRange) {
      return startDate !== null;
    }

    if (allowPartial) {
      if (selectionType === 'onOrAfter') {
        return startDate !== null;
      }

      if (selectionType === 'onOrBefore') {
        return endDate !== null;
      }
    }

    return startDate !== null && endDate !== null;
  }

  private _shouldClearIncompleteRange(): boolean {
    const isRange = this.datePickerInputAllowRangeSelection();
    const allowPartial = this.datePickerInputAllowPartialRangeSelection();
    const state = this._state();
    const selectionType = state.inProgressPartialRangeSelectionType;

    if (!isRange) {
      return false;
    }

    const hasSnapshot = state.snapshotStartDate !== null || state.snapshotEndDate !== null;

    if (hasSnapshot) {
      return false;
    }

    if (!allowPartial || (allowPartial && selectionType === 'range')) {
      return (state.inProgressStartDate !== null) !== (state.inProgressEndDate !== null);
    }

    return false;
  }

  private _revertOrClearSelection(): void {
    const state = this._state();
    const shouldClear = this._shouldClearIncompleteRange();

    if (shouldClear) {
      if (this._isFormControlled()) {
        this._state.update((s) => ({
          ...s,
          committedStartDate: null,
          committedEndDate: null,
        }));

        this.datePickerInputDateSelectedNotified.emit({ startDate: null, endDate: null });

        return;
      }

      this.datePickerInputDateSelectedEmitted.emit({ startDate: null, endDate: null });

      return;
    }

    if (!this._isFormControlled()) {
      return;
    }

    this._state.update((s) => ({
      ...s,
      committedStartDate: state.snapshotStartDate,
      committedEndDate: state.snapshotEndDate,
      committedPartialRangeSelectionType: state.snapshotPartialRangeSelectionType,
    }));

    this.datePickerInputDateSelectedNotified.emit({
      startDate: state.snapshotStartDate,
      endDate: state.snapshotEndDate,
    });
  }

  private _commitSelection(startDate: DateTime | null, endDate: DateTime | null): void {
    const state = this._state();
    const inProgressMode = state.inProgressPartialRangeSelectionType;
    const committedMode = state.committedPartialRangeSelectionType;

    if (this._isFormControlled()) {
      this._state.update((s) => ({
        ...s,
        committedStartDate: startDate,
        committedEndDate: endDate,
        committedPartialRangeSelectionType: inProgressMode,
      }));

      this.datePickerInputDateSelectedNotified.emit({ startDate, endDate });
    } else {
      this._state.update((s) => ({
        ...s,
        committedPartialRangeSelectionType: inProgressMode,
      }));
      this.datePickerInputDateSelectedEmitted.emit({ startDate, endDate });
    }

    if (inProgressMode !== committedMode) {
      this.datePickerInputPartialRangeSelectionTypeEmitted.emit(inProgressMode);
    }

    this._isClosingAfterCommit = true;
    this.closeOverlay();
  }
}
