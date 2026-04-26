import { Directive, computed, input, output, signal } from '@angular/core';

/** available time segments for the time input brain */
export type TimeInputSegment = 'hours' | 'minutes' | 'ampm';

/** the internal state shape for the time input brain directive */
type TimeInputState = {
  hours: string;
  minutes: string;
  ampm: 'am' | 'pm';
  activeSegment: TimeInputSegment;
  firstDigitEntered: boolean;
  isDisabledFromForms: boolean;
  hasReceivedCvaValue: boolean;
};

/** default value for the timeInputDisabled input */
export const TIME_INPUT_DISABLED_DEFAULT = false;

/** default value for the timeInputReadonly input */
export const TIME_INPUT_READONLY_DEFAULT = false;

/**
 * headless brain directive for the time-input component. owns the segmented time-state machine
 * (hours / minutes / am-pm), the segment-switching, the keyboard handlers, the value parsing / formatting, and the
 * form-controlled disabled state. emits `timeInputValueChanged` whenever a user interaction completes a
 * segment or rolls a value via arrow keys.
 *
 * the presentation pushes the native input element into the brain so the brain can call `setSelectionRange` to
 * highlight the active segment after each interaction.
 */
@Directive({
  selector: '[orgTimeInputBrain]',
  exportAs: 'orgTimeInputBrain',
})
export class TimeInputBrainDirective {
  private readonly _state = signal<TimeInputState>({
    hours: '12',
    minutes: '00',
    ampm: 'am',
    activeSegment: 'hours',
    firstDigitEntered: false,
    isDisabledFromForms: false,
    hasReceivedCvaValue: false,
  });

  private _inputElement: HTMLInputElement | null = null;

  /** whether the time-input is disabled by its consumer (combined with form-controlled disabled state) */
  public readonly timeInputDisabled = input<boolean>(TIME_INPUT_DISABLED_DEFAULT);

  /** whether the time-input is readonly (interaction is suppressed but it remains focusable) */
  public readonly timeInputReadonly = input<boolean>(TIME_INPUT_READONLY_DEFAULT);

  /** emitted with the new "hh:mm aa" value whenever a user interaction changes the time */
  public readonly timeInputValueChanged = output<string>();

  /** emitted when the focus event fires (presentation forwards from the inner input) */
  public readonly timeInputFocused = output<void>();

  /** emitted when the blur event fires (presentation forwards from the inner input) */
  public readonly timeInputBlurred = output<void>();

  /** emitted when the inner input is touched (so the presentation can call ControlValueAccessor onTouched) */
  public readonly timeInputTouched = output<void>();

  /** the formatted "hh:mm aa" representation of the current internal state */
  public readonly formattedValue = computed<string>(() => {
    const state = this._state();

    return `${state.hours}:${state.minutes} ${state.ampm}`;
  });

  /** the resolved disabled state (consumer-disabled OR form-disabled) */
  public readonly isDisabled = computed<boolean>(() => this.timeInputDisabled() || this._state().isDisabledFromForms);

  /** whether writeValue has been called from reactive forms */
  public readonly hasReceivedCvaValue = computed<boolean>(() => this._state().hasReceivedCvaValue);

  /** registers the native input element so the brain can highlight the active segment */
  public setInputElement(element: HTMLInputElement | null): void {
    this._inputElement = element;
  }

  /** sets the form-controlled disabled state (called by setDisabledState from reactive forms) */
  public setFormDisabled(disabled: boolean): void {
    this._state.update((state) => ({ ...state, isDisabledFromForms: disabled }));
  }

  /** marks that writeValue was called from reactive forms */
  public markReceivedCvaValue(): void {
    this._state.update((state) => ({ ...state, hasReceivedCvaValue: true }));
  }

  /** parses an "hh:mm aa" string and applies it to the internal state */
  public parseAndSetValue(value: string): void {
    const match = value.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);

    if (!match) {
      return;
    }

    let hours = parseInt(match[1], 10);
    let minutes = parseInt(match[2], 10);
    const ampm = match[3].toLowerCase() as 'am' | 'pm';

    if (hours < 1 || hours > 12) {
      hours = 12;
    }

    if (minutes < 0 || minutes > 59) {
      minutes = 0;
    }

    this._state.update((state) => ({
      ...state,
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      ampm,
    }));
  }

  /** handles focus by selecting the hours segment */
  public handleFocus(): void {
    this._state.update((state) => ({
      ...state,
      activeSegment: 'hours',
      firstDigitEntered: false,
    }));

    this._selectSegment();
    this.timeInputFocused.emit();
  }

  /** handles blur by emitting touched (presentation translates to ControlValueAccessor onTouched) */
  public handleBlur(): void {
    this.timeInputTouched.emit();
    this.timeInputBlurred.emit();
  }

  /** handles a click in the input by detecting and selecting the clicked segment based on caret position */
  public handleClick(): void {
    if (this.isDisabled() || this.timeInputReadonly()) {
      return;
    }

    if (!this._inputElement) {
      return;
    }

    const selectionStart = this._inputElement.selectionStart ?? 0;

    let segment: TimeInputSegment = 'hours';

    if (selectionStart >= 6) {
      segment = 'ampm';
    } else if (selectionStart >= 3) {
      segment = 'minutes';
    }

    this._state.update((state) => ({
      ...state,
      activeSegment: segment,
      firstDigitEntered: false,
    }));

    this._selectSegment();
  }

  /** handles keydown for segment navigation, value entry, and am/pm toggling */
  public handleKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled() || this.timeInputReadonly()) {
      return;
    }

    const key = event.key;
    const hasModifier = event.ctrlKey || event.metaKey || event.altKey;

    if (
      !hasModifier &&
      (key === 'ArrowLeft' ||
        key === 'ArrowRight' ||
        key === 'ArrowUp' ||
        key === 'ArrowDown' ||
        key === 'Backspace' ||
        key === 'Delete' ||
        /^[0-9]$/.test(key) ||
        key === 'a' ||
        key === 'A' ||
        key === 'p' ||
        key === 'P')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (key === 'ArrowLeft') {
      this._moveToPreviousSegment();

      return;
    }

    if (key === 'ArrowRight') {
      this._moveToNextSegment();

      return;
    }

    if (key === 'ArrowUp') {
      this._incrementSegment();

      return;
    }

    if (key === 'ArrowDown') {
      this._decrementSegment();

      return;
    }

    if (key === 'Backspace' || key === 'Delete') {
      return;
    }

    const state = this._state();

    if (state.activeSegment === 'ampm' && !hasModifier) {
      if (key === 'a' || key === 'A') {
        this._updateAmPm('am');

        return;
      }

      if (key === 'p' || key === 'P') {
        this._updateAmPm('pm');

        return;
      }
    }

    if (/^[0-9]$/.test(key)) {
      this._onNumberInput(key);
    }
  }

  private _onNumberInput(digit: string): void {
    const state = this._state();

    if (state.activeSegment === 'hours') {
      this._onHoursInput(digit);
    } else if (state.activeSegment === 'minutes') {
      this._onMinutesInput(digit);
    }
  }

  private _onHoursInput(digit: string): void {
    const state = this._state();
    const num = parseInt(digit, 10);

    if (!state.firstDigitEntered) {
      if (num === 0 || num === 1) {
        this._state.update((s) => ({
          ...s,
          hours: `0${digit}`,
          firstDigitEntered: true,
        }));
        this._selectSegment();

        return;
      }

      this._state.update((s) => ({
        ...s,
        hours: `0${digit}`,
        activeSegment: 'minutes',
        firstDigitEntered: false,
      }));
      this._emitValue();
      this._selectSegment();

      return;
    }

    const firstDigit = state.hours[1];
    let newHours = `${firstDigit}${digit}`;
    const hoursNum = parseInt(newHours, 10);

    if (hoursNum > 12 || hoursNum === 0) {
      newHours = '12';
    }

    this._state.update((s) => ({
      ...s,
      hours: newHours.padStart(2, '0'),
      activeSegment: 'minutes',
      firstDigitEntered: false,
    }));
    this._emitValue();
    this._selectSegment();
  }

  private _onMinutesInput(digit: string): void {
    const state = this._state();
    const num = parseInt(digit, 10);

    if (!state.firstDigitEntered) {
      if (num <= 5) {
        this._state.update((s) => ({
          ...s,
          minutes: `0${digit}`,
          firstDigitEntered: true,
        }));
        this._selectSegment();

        return;
      }

      this._state.update((s) => ({
        ...s,
        minutes: `0${digit}`,
        activeSegment: 'ampm',
        firstDigitEntered: false,
      }));
      this._emitValue();
      this._selectSegment();

      return;
    }

    const firstDigit = state.minutes[1];
    const newMinutes = `${firstDigit}${digit}`;

    this._state.update((s) => ({
      ...s,
      minutes: newMinutes,
      activeSegment: 'ampm',
      firstDigitEntered: false,
    }));
    this._emitValue();
    this._selectSegment();
  }

  private _updateAmPm(value: 'am' | 'pm'): void {
    this._state.update((state) => ({
      ...state,
      ampm: value,
    }));
    this._emitValue();
    this._selectSegment();
  }

  private _moveToPreviousSegment(): void {
    const state = this._state();
    let newSegment: TimeInputSegment;

    if (state.activeSegment === 'hours') {
      newSegment = 'ampm';
    } else if (state.activeSegment === 'minutes') {
      newSegment = 'hours';
    } else {
      newSegment = 'minutes';
    }

    this._state.update((s) => ({
      ...s,
      activeSegment: newSegment,
      firstDigitEntered: false,
    }));

    this._selectSegment();
  }

  private _moveToNextSegment(): void {
    const state = this._state();
    let newSegment: TimeInputSegment;

    if (state.activeSegment === 'hours') {
      newSegment = 'minutes';
    } else if (state.activeSegment === 'minutes') {
      newSegment = 'ampm';
    } else {
      newSegment = 'hours';
    }

    this._state.update((s) => ({
      ...s,
      activeSegment: newSegment,
      firstDigitEntered: false,
    }));

    this._selectSegment();
  }

  private _incrementSegment(): void {
    const state = this._state();

    if (state.activeSegment === 'hours') {
      const hours = parseInt(state.hours, 10);
      const newHours = hours === 12 ? 1 : hours + 1;
      this._state.update((s) => ({
        ...s,
        hours: newHours.toString().padStart(2, '0'),
      }));
    } else if (state.activeSegment === 'minutes') {
      const minutes = parseInt(state.minutes, 10);
      const newMinutes = minutes === 59 ? 0 : minutes + 1;
      this._state.update((s) => ({
        ...s,
        minutes: newMinutes.toString().padStart(2, '0'),
      }));
    } else {
      this._state.update((s) => ({
        ...s,
        ampm: s.ampm === 'am' ? 'pm' : 'am',
      }));
    }

    this._emitValue();
    this._selectSegment();
  }

  private _decrementSegment(): void {
    const state = this._state();

    if (state.activeSegment === 'hours') {
      const hours = parseInt(state.hours, 10);
      const newHours = hours === 1 ? 12 : hours - 1;
      this._state.update((s) => ({
        ...s,
        hours: newHours.toString().padStart(2, '0'),
      }));
    } else if (state.activeSegment === 'minutes') {
      const minutes = parseInt(state.minutes, 10);
      const newMinutes = minutes === 0 ? 59 : minutes - 1;
      this._state.update((s) => ({
        ...s,
        minutes: newMinutes.toString().padStart(2, '0'),
      }));
    } else {
      this._state.update((s) => ({
        ...s,
        ampm: s.ampm === 'am' ? 'pm' : 'am',
      }));
    }

    this._emitValue();
    this._selectSegment();
  }

  private _selectSegment(): void {
    const input = this._inputElement;

    if (!input) {
      return;
    }

    requestAnimationFrame(() => {
      const state = this._state();

      if (state.activeSegment === 'hours') {
        input.setSelectionRange(0, 2);

        return;
      }

      if (state.activeSegment === 'minutes') {
        input.setSelectionRange(3, 5);

        return;
      }

      input.setSelectionRange(6, 8);
    });
  }

  private _emitValue(): void {
    this.timeInputValueChanged.emit(this.formattedValue());
  }
}
