import { Directive, computed, effect, input, output, signal } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';

/** available time segments for the time input brain */
export type TimeInputSegment = 'hours' | 'minutes' | 'meridiem';

/** ordered list of every time-input segment */
export const allTimeInputSegments: TimeInputSegment[] = ['hours', 'minutes', 'meridiem'];

/** available clock formats — drives segment count and digit-validation rules */
export type TimeInputFormat = '12-hour' | '24-hour';

/** ordered list of every supported clock format */
export const allTimeInputFormats: TimeInputFormat[] = ['12-hour', '24-hour'];

/** meridiem value when the meridiem segment carries a value */
export type TimeInputMeridiem = 'am' | 'pm';

/** the internal state shape for the time input brain directive */
type TimeInputState = {
  hours: string;
  minutes: string;
  meridiem: TimeInputMeridiem | '';
  activeSegment: TimeInputSegment;
  firstDigitEntered: boolean;
  isFocused: boolean;
  isDisabledFromForms: boolean;
  hasReceivedCvaValue: boolean;
};

/** default value for the format input */
export const TIME_INPUT_FORMAT_DEFAULT: TimeInputFormat = '12-hour';

/** default value for the disabled input */
export const TIME_INPUT_DISABLED_DEFAULT = false;

/** default value for the readonly input */
export const TIME_INPUT_READONLY_DEFAULT = false;

/** default value for the autoFocus input */
export const TIME_INPUT_AUTO_FOCUS_DEFAULT = false;

/** default value for the ariaLabel input */
export const TIME_INPUT_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/**
 * headless brain directive for the time-input component. owns the segmented time-state machine
 * (hours / minutes / optional meridiem), segment navigation, the keyboard handlers, value parsing / formatting,
 * the form-controlled disabled state, the form CVA callbacks, auto-focus behaviour, the accessible label, and
 * the focused-marker signal that drives the highlight paint.
 *
 * the presentation registers its host element with the brain so auto-focus can be applied to the shell (the shell
 * is the single tab stop; arrow keys move the active segment marker).
 */
@Directive({
  selector: '[orgTimeInputBrain]',
  exportAs: 'orgTimeInputBrain',
})
export class TimeInputBrainDirective {
  private readonly _state = signal<TimeInputState>({
    hours: '',
    minutes: '',
    meridiem: '',
    activeSegment: 'hours',
    firstDigitEntered: false,
    isFocused: false,
    isDisabledFromForms: false,
    hasReceivedCvaValue: false,
  });

  private readonly _hostElementSignal = signal<HTMLElement | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  private _hasAppliedAutoFocus = false;

  /** clock format — `'12-hour'` shows three segments (hh / mm / meridiem); `'24-hour'` shows two (HH / mm) */
  public readonly format = input<TimeInputFormat>(TIME_INPUT_FORMAT_DEFAULT);

  /** whether the time-input is disabled by its consumer (combined with form-controlled disabled state) */
  public readonly disabled = input<boolean>(TIME_INPUT_DISABLED_DEFAULT);

  /** whether the time-input is readonly (interaction is suppressed but the shell remains focusable) */
  public readonly readonly = input<boolean>(TIME_INPUT_READONLY_DEFAULT);

  /** whether the time-input should automatically focus its host shell on first commit */
  public readonly autoFocus = input<boolean>(TIME_INPUT_AUTO_FOCUS_DEFAULT);

  /** accessible label for the time-input shell */
  public readonly ariaLabel = input<string | undefined, string | null | undefined>(TIME_INPUT_ARIA_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** emitted with the new formatted value whenever a user interaction changes the time */
  public readonly valueChanged = output<string>();

  /** emitted when the shell receives focus */
  public readonly focused = output<void>();

  /** emitted when the shell loses focus */
  public readonly blurred = output<void>();

  /** the two-digit hours string (empty when no value entered yet) */
  public readonly hours = computed<string>(() => this._state().hours);

  /** the two-digit minutes string (empty when no value entered yet) */
  public readonly minutes = computed<string>(() => this._state().minutes);

  /** the meridiem value, or empty when no value entered yet (only meaningful in 12-hour format) */
  public readonly meridiem = computed<TimeInputMeridiem | ''>(() => this._state().meridiem);

  /** the segment currently taking keystrokes */
  public readonly activeSegment = computed<TimeInputSegment>(() => this._state().activeSegment);

  /** whether the shell currently owns focus — drives the highlight band paint */
  public readonly isFocused = computed<boolean>(() => this._state().isFocused);

  /** whether the hours segment has no value yet */
  public readonly isHoursEmpty = computed<boolean>(() => this._state().hours === '');

  /** whether the minutes segment has no value yet */
  public readonly isMinutesEmpty = computed<boolean>(() => this._state().minutes === '');

  /** whether the meridiem segment has no value yet (only meaningful in 12-hour format) */
  public readonly isMeridiemEmpty = computed<boolean>(() => this._state().meridiem === '');

  /** the resolved disabled state (consumer-disabled OR form-disabled) */
  public readonly isDisabled = computed<boolean>(() => this.disabled() || this._state().isDisabledFromForms);

  /** whether writeValue has been called from reactive forms */
  public readonly hasReceivedCvaValue = computed<boolean>(() => this._state().hasReceivedCvaValue);

  /**
   * the form-emittable value: a full formatted string when every segment is filled, or empty string otherwise.
   * 12-hour emits `"hh:mm am/pm"`. 24-hour emits `"HH:mm"`.
   */
  public readonly formattedValue = computed<string>(() => {
    const state = this._state();
    const format = this.format();

    if (state.hours === '' || state.minutes === '') {
      return '';
    }

    if (format === '24-hour') {
      return `${state.hours}:${state.minutes}`;
    }

    if (state.meridiem === '') {
      return '';
    }

    return `${state.hours}:${state.minutes} ${state.meridiem}`;
  });

  constructor() {
    // applies auto-focus exactly once on the first true value after the host element is registered
    effect(() => {
      if (this._hasAppliedAutoFocus || !this.autoFocus()) {
        return;
      }

      const element = this._hostElementSignal();

      if (!element) {
        return;
      }

      this._hasAppliedAutoFocus = true;
      element.focus();
    });

    // if the format flips to 24-hour while the active segment is meridiem, snap focus back to minutes
    effect(() => {
      if (this.format() !== '24-hour') {
        return;
      }

      const current = this._state().activeSegment;

      if (current === 'meridiem') {
        this._state.update((state) => ({ ...state, activeSegment: 'minutes', firstDigitEntered: false }));
      }
    });
  }

  /** registers the host element so the brain can apply auto-focus to the shell */
  public setHostElement(element: HTMLElement | null): void {
    this._hostElementSignal.set(element);
  }

  /** sets the form-controlled disabled state (called by setDisabledState from reactive forms) */
  public setFormDisabled(disabled: boolean): void {
    this._state.update((state) => ({ ...state, isDisabledFromForms: disabled }));
  }

  /** registers the form's onChange callback */
  public setOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  /** registers the form's onTouched callback */
  public setOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /** writes a value into the brain from a reactive form, marking the cva value flag and parsing the value */
  public writeValue(value: string | null | undefined): void {
    this._state.update((state) => ({ ...state, hasReceivedCvaValue: true }));

    if (!value) {
      this._state.update((state) => ({
        ...state,
        hours: '',
        minutes: '',
        meridiem: '',
        firstDigitEntered: false,
      }));

      return;
    }

    this.parseAndSetValue(value);
  }

  /** parses a `"hh:mm am/pm"` or `"HH:mm"` string and applies it to the internal state */
  public parseAndSetValue(value: string): void {
    const format = this.format();

    if (format === '24-hour') {
      const match = value.match(/^(\d{1,2}):(\d{2})$/);

      if (!match) {
        return;
      }

      let hours = parseInt(match[1], 10);
      let minutes = parseInt(match[2], 10);

      if (hours < 0 || hours > 23) {
        hours = 0;
      }

      if (minutes < 0 || minutes > 59) {
        minutes = 0;
      }

      this._state.update((state) => ({
        ...state,
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        meridiem: '',
      }));

      return;
    }

    const match = value.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);

    if (!match) {
      return;
    }

    let hours = parseInt(match[1], 10);
    let minutes = parseInt(match[2], 10);
    const meridiem = match[3].toLowerCase() as TimeInputMeridiem;

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
      meridiem,
    }));
  }

  /** marks the shell as focused, snapping the active segment to hours and emitting `focused` */
  public handleFocus(): void {
    this._state.update((state) => ({
      ...state,
      isFocused: true,
      activeSegment: 'hours',
      firstDigitEntered: false,
    }));

    this.focused.emit();
  }

  /** marks the shell as blurred, fires the form-touched callback, and emits `blurred` */
  public handleBlur(): void {
    this._state.update((state) => ({ ...state, isFocused: false, firstDigitEntered: false }));
    this._onTouched();
    this.blurred.emit();
  }

  /** selects a segment programmatically (used by segment click handlers in the presentation) */
  public selectSegment(segment: TimeInputSegment): void {
    if (this.isDisabled() || this.readonly()) {
      return;
    }

    if (segment === 'meridiem' && this.format() === '24-hour') {
      return;
    }

    this._state.update((state) => ({ ...state, activeSegment: segment, firstDigitEntered: false }));
  }

  /** handles keydown for segment navigation, value entry, and meridiem keystrokes (A / P) */
  public handleKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled() || this.readonly()) {
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
      this._clearActiveSegment();

      return;
    }

    const state = this._state();

    if (state.activeSegment === 'meridiem' && !hasModifier) {
      if (key === 'a' || key === 'A') {
        this._updateMeridiem('am');

        return;
      }

      if (key === 'p' || key === 'P') {
        this._updateMeridiem('pm');

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

      return;
    }

    if (state.activeSegment === 'minutes') {
      this._onMinutesInput(digit);
    }
  }

  private _onHoursInput(digit: string): void {
    if (this.format() === '24-hour') {
      this._onHoursInput24(digit);

      return;
    }

    this._onHoursInput12(digit);
  }

  private _onHoursInput12(digit: string): void {
    const state = this._state();
    const num = parseInt(digit, 10);

    if (!state.firstDigitEntered) {
      if (num === 0 || num === 1) {
        this._state.update((s) => ({ ...s, hours: `0${digit}`, firstDigitEntered: true }));
        this._emitValue();

        return;
      }

      this._state.update((s) => ({
        ...s,
        hours: `0${digit}`,
        activeSegment: 'minutes',
        firstDigitEntered: false,
      }));
      this._emitValue();

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
  }

  private _onHoursInput24(digit: string): void {
    const state = this._state();
    const num = parseInt(digit, 10);

    if (!state.firstDigitEntered) {
      if (num <= 2) {
        this._state.update((s) => ({ ...s, hours: `0${digit}`, firstDigitEntered: true }));
        this._emitValue();

        return;
      }

      this._state.update((s) => ({
        ...s,
        hours: `0${digit}`,
        activeSegment: 'minutes',
        firstDigitEntered: false,
      }));
      this._emitValue();

      return;
    }

    const firstDigit = state.hours[1];
    let newHours = `${firstDigit}${digit}`;
    const hoursNum = parseInt(newHours, 10);

    if (hoursNum > 23) {
      newHours = '23';
    }

    this._state.update((s) => ({
      ...s,
      hours: newHours.padStart(2, '0'),
      activeSegment: 'minutes',
      firstDigitEntered: false,
    }));
    this._emitValue();
  }

  private _onMinutesInput(digit: string): void {
    const state = this._state();
    const num = parseInt(digit, 10);

    if (!state.firstDigitEntered) {
      if (num <= 5) {
        this._state.update((s) => ({ ...s, minutes: `0${digit}`, firstDigitEntered: true }));
        this._emitValue();

        return;
      }

      const nextSegment: TimeInputSegment = this.format() === '24-hour' ? 'minutes' : 'meridiem';

      this._state.update((s) => ({
        ...s,
        minutes: `0${digit}`,
        activeSegment: nextSegment,
        firstDigitEntered: false,
      }));
      this._emitValue();

      return;
    }

    const firstDigit = state.minutes[1];
    const newMinutes = `${firstDigit}${digit}`;
    const nextSegment: TimeInputSegment = this.format() === '24-hour' ? 'minutes' : 'meridiem';

    this._state.update((s) => ({
      ...s,
      minutes: newMinutes,
      activeSegment: nextSegment,
      firstDigitEntered: false,
    }));
    this._emitValue();
  }

  private _updateMeridiem(value: TimeInputMeridiem): void {
    this._state.update((state) => ({ ...state, meridiem: value }));
    this._emitValue();
  }

  private _moveToPreviousSegment(): void {
    const state = this._state();
    const order = this._segmentOrder();
    const index = order.indexOf(state.activeSegment);
    const newSegment = order[(index - 1 + order.length) % order.length];

    this._state.update((s) => ({ ...s, activeSegment: newSegment, firstDigitEntered: false }));
  }

  private _moveToNextSegment(): void {
    const state = this._state();
    const order = this._segmentOrder();
    const index = order.indexOf(state.activeSegment);
    const newSegment = order[(index + 1) % order.length];

    this._state.update((s) => ({ ...s, activeSegment: newSegment, firstDigitEntered: false }));
  }

  private _segmentOrder(): TimeInputSegment[] {
    if (this.format() === '24-hour') {
      return ['hours', 'minutes'];
    }

    return ['hours', 'minutes', 'meridiem'];
  }

  private _incrementSegment(): void {
    const state = this._state();

    if (state.activeSegment === 'hours') {
      this._state.update((s) => ({ ...s, hours: this._stepHours(s.hours, 1), firstDigitEntered: false }));
      this._emitValue();

      return;
    }

    if (state.activeSegment === 'minutes') {
      this._state.update((s) => ({ ...s, minutes: this._stepMinutes(s.minutes, 1), firstDigitEntered: false }));
      this._emitValue();

      return;
    }

    this._state.update((s) => ({ ...s, meridiem: s.meridiem === 'pm' ? 'am' : 'pm' }));
    this._emitValue();
  }

  private _decrementSegment(): void {
    const state = this._state();

    if (state.activeSegment === 'hours') {
      this._state.update((s) => ({ ...s, hours: this._stepHours(s.hours, -1), firstDigitEntered: false }));
      this._emitValue();

      return;
    }

    if (state.activeSegment === 'minutes') {
      this._state.update((s) => ({ ...s, minutes: this._stepMinutes(s.minutes, -1), firstDigitEntered: false }));
      this._emitValue();

      return;
    }

    this._state.update((s) => ({ ...s, meridiem: s.meridiem === 'pm' ? 'am' : 'pm' }));
    this._emitValue();
  }

  private _stepHours(current: string, delta: 1 | -1): string {
    if (this.format() === '24-hour') {
      if (current === '') {
        return delta === 1 ? '00' : '23';
      }

      const next = (parseInt(current, 10) + delta + 24) % 24;

      return next.toString().padStart(2, '0');
    }

    if (current === '') {
      return delta === 1 ? '01' : '12';
    }

    const currentNum = parseInt(current, 10);
    let next = currentNum + delta;

    if (next > 12) {
      next = 1;
    }

    if (next < 1) {
      next = 12;
    }

    return next.toString().padStart(2, '0');
  }

  private _stepMinutes(current: string, delta: 1 | -1): string {
    if (current === '') {
      return delta === 1 ? '00' : '59';
    }

    const next = (parseInt(current, 10) + delta + 60) % 60;

    return next.toString().padStart(2, '0');
  }

  private _clearActiveSegment(): void {
    const state = this._state();

    if (state.activeSegment === 'hours') {
      this._state.update((s) => ({ ...s, hours: '', firstDigitEntered: false }));
      this._emitValue();

      return;
    }

    if (state.activeSegment === 'minutes') {
      this._state.update((s) => ({ ...s, minutes: '', firstDigitEntered: false }));
      this._emitValue();

      return;
    }

    this._state.update((s) => ({ ...s, meridiem: '' }));
    this._emitValue();
  }

  private _emitValue(): void {
    const value = this.formattedValue();

    this.valueChanged.emit(value);
    this._onChange(value);
  }
}
