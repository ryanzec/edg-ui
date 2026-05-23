import { Directive, ElementRef, computed, inject, input, model, output, signal } from '@angular/core';

/** all available slider input direction values */
export const allSliderInputDirections = ['horizontal', 'vertical'] as const;

/** the orientation of the slider */
export type SliderInputDirection = (typeof allSliderInputDirections)[number];

/** default value for the min input */
export const SLIDER_INPUT_MIN_DEFAULT = 0;

/** default value for the max input */
export const SLIDER_INPUT_MAX_DEFAULT = 100;

/** default value for the step input */
export const SLIDER_INPUT_STEP_DEFAULT = 1;

/** default value for the values model */
export const SLIDER_INPUT_VALUES_DEFAULT: number[] = [50];

/** default value for the disabled input */
export const SLIDER_INPUT_DISABLED_DEFAULT = false;

/** default value for the allowCrossing input */
export const SLIDER_INPUT_ALLOW_CROSSING_DEFAULT = true;

/** the internal state shape for the slider input brain directive */
type SliderInputState = {
  draggingThumbIndex: number | null;
  isDisabledFromForms: boolean;
};

/**
 * headless brain directive for the slider input component. owns the values model (the source of truth for
 * each thumb position), pointer and keyboard event handlers, the dragging state, and the accessibility
 * surface (role, aria-valuemin / valuemax / valuenow, aria-orientation, aria-disabled). injects its own
 * ElementRef which (when applied as a hostDirective on org-slider-input) is the slider container — used
 * for getBoundingClientRect math during pointer interactions and track clicks.
 *
 * the presentation component renders the track, fill bar, optional tick marks, and the thumb buttons,
 * binding their pointer / keyboard events to the public methods exposed by this directive.
 */
@Directive({
  selector: '[orgSliderInputBrain]',
  exportAs: 'orgSliderInputBrain',
  host: {
    '[attr.data-direction]': 'direction()',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-dragging]': 'isDragging() ? "" : null',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
  },
})
export class SliderInputBrainDirective {
  private readonly _containerElementRef = inject(ElementRef<HTMLElement>);

  private readonly _state = signal<SliderInputState>({
    draggingThumbIndex: null,
    isDisabledFromForms: false,
  });

  /** the orientation of the slider; drives keyboard mapping and aria-orientation */
  public readonly direction = input.required<SliderInputDirection>();

  /** the minimum selectable value */
  public readonly min = input<number>(SLIDER_INPUT_MIN_DEFAULT);

  /** the maximum selectable value */
  public readonly max = input<number>(SLIDER_INPUT_MAX_DEFAULT);

  /** the granularity by which values can change via keyboard or pointer */
  public readonly step = input<number>(SLIDER_INPUT_STEP_DEFAULT);

  /** the current value for each thumb; updated by drag and keyboard interactions */
  public readonly values = model<number[]>(SLIDER_INPUT_VALUES_DEFAULT);

  /** whether the slider is disabled (all thumbs non-interactive) */
  public readonly disabled = input<boolean>(SLIDER_INPUT_DISABLED_DEFAULT);

  /** when true, thumbs may pass through each other and values are sorted on every change; when false, each thumb is constrained between its neighbors */
  public readonly allowCrossing = input<boolean>(SLIDER_INPUT_ALLOW_CROSSING_DEFAULT);

  /** emitted with the thumb index when a drag interaction begins */
  public readonly dragStarted = output<number>();

  /** emitted with the thumb index when a drag interaction ends, including pointer cancel */
  public readonly dragCompleted = output<number>();

  /** emitted with the new values array whenever a user interaction (drag / keyboard / track click) changes the values */
  public readonly changed = output<number[]>();

  /** emitted whenever a user interaction completes (i.e. the equivalent of blur for ControlValueAccessor onTouched) */
  public readonly touched = output<void>();

  /** the index of the thumb currently being dragged, or null when no drag is active */
  public readonly draggingThumbIndex = computed<number | null>(() => this._state().draggingThumbIndex);

  /** whether any thumb is currently being dragged */
  public readonly isDragging = computed<boolean>(() => this._state().draggingThumbIndex !== null);

  /** the resolved disabled state, combining the disabled input with the reactive-forms disabled state */
  public readonly isDisabled = computed<boolean>(() => this.disabled() || this._state().isDisabledFromForms);

  /** the resolved aria-orientation value derived from direction */
  public readonly ariaOrientation = computed<'horizontal' | 'vertical'>(() => this.direction());

  /** the resolved tabindex value, returning -1 when disabled and 0 otherwise */
  public readonly tabIndex = computed<number>(() => {
    if (this.isDisabled()) {
      return -1;
    }

    return 0;
  });

  /** the lower aria-valuemin for the thumb at the given index (constrained by previous thumb when allowCrossing is false) */
  public thumbAriaValueMin(index: number): number {
    if (this.allowCrossing()) {
      return this.min();
    }

    const previous = this.values()[index - 1];

    if (previous === undefined) {
      return this.min();
    }

    return previous;
  }

  /** the upper aria-valuemax for the thumb at the given index (constrained by next thumb when allowCrossing is false) */
  public thumbAriaValueMax(index: number): number {
    if (this.allowCrossing()) {
      return this.max();
    }

    const next = this.values()[index + 1];

    if (next === undefined) {
      return this.max();
    }

    return next;
  }

  /** the position of the thumb at the given index as a percentage of the [min, max] range */
  public thumbPercent(index: number): number {
    const value = this.values()[index];

    if (value === undefined) {
      return 0;
    }

    return this._valueToPercent(value);
  }

  /** the starting percentage of the filled track segment */
  public readonly fillStartPercent = computed<number>(() => {
    const sorted = [...this.values()].sort((a, b) => a - b);

    if (sorted.length === 1) {
      return 0;
    }

    return this._valueToPercent(sorted[0]);
  });

  /** the ending percentage of the filled track segment */
  public readonly fillEndPercent = computed<number>(() => {
    const sorted = [...this.values()].sort((a, b) => a - b);

    if (sorted.length === 1) {
      return this._valueToPercent(sorted[0]);
    }

    return this._valueToPercent(sorted[sorted.length - 1]);
  });

  /** initiates a drag on the thumb at the given index, capturing pointer events for smooth tracking */
  public onThumbPointerDown(event: PointerEvent, index: number): void {
    if (this.isDisabled()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const target = event.currentTarget as HTMLElement;

    target.setPointerCapture(event.pointerId);
    target.focus();

    this._state.update((state) => ({
      ...state,
      draggingThumbIndex: index,
    }));

    this.dragStarted.emit(index);
  }

  /** updates the dragged thumb's value as the pointer moves during an active drag */
  public onThumbPointerMove(event: PointerEvent): void {
    const draggingIndex = this._state().draggingThumbIndex;

    if (draggingIndex === null) {
      return;
    }

    const percent = this._pointerToPercent(event);
    const rawValue = this._percentToValue(percent);

    this._updateValueAtIndex(draggingIndex, rawValue);
  }

  /** ends the drag and releases pointer capture */
  public onThumbPointerUp(event: PointerEvent): void {
    const draggingIndex = this._state().draggingThumbIndex;

    if (draggingIndex === null) {
      return;
    }

    const target = event.currentTarget as HTMLElement;

    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }

    this._state.update((state) => ({
      ...state,
      draggingThumbIndex: null,
    }));

    this.dragCompleted.emit(draggingIndex);
    this.touched.emit();
  }

  /** cancels an active drag and clears the dragging state */
  public onThumbPointerCancel(): void {
    const draggingIndex = this._state().draggingThumbIndex;

    if (draggingIndex === null) {
      return;
    }

    this._state.update((state) => ({
      ...state,
      draggingThumbIndex: null,
    }));

    this.dragCompleted.emit(draggingIndex);
  }

  /** handles keyboard interaction on the thumb at the given index per the W3C slider pattern */
  public onThumbKeyDown(event: KeyboardEvent, index: number): void {
    if (this.isDisabled()) {
      return;
    }

    const currentValue = this.values()[index];

    if (currentValue === undefined) {
      return;
    }

    const step = this.step();
    const shiftStep = step * 10;
    const pageStep = Math.max(step, (this.max() - this.min()) / 10);
    const isHorizontal = this.direction() === 'horizontal';
    const isShift = event.shiftKey;
    const arrowStep = isShift ? shiftStep : step;
    const increaseKey = isHorizontal ? 'ArrowRight' : 'ArrowUp';
    const decreaseKey = isHorizontal ? 'ArrowLeft' : 'ArrowDown';

    let newValue = currentValue;

    if (
      event.key === increaseKey ||
      (isHorizontal && event.key === 'ArrowUp') ||
      (!isHorizontal && event.key === 'ArrowRight')
    ) {
      newValue = currentValue + arrowStep;
    } else if (
      event.key === decreaseKey ||
      (isHorizontal && event.key === 'ArrowDown') ||
      (!isHorizontal && event.key === 'ArrowLeft')
    ) {
      newValue = currentValue - arrowStep;
    } else if (event.key === 'PageUp') {
      newValue = currentValue + pageStep;
    } else if (event.key === 'PageDown') {
      newValue = currentValue - pageStep;
    } else if (event.key === 'Home') {
      newValue = this.thumbAriaValueMin(index);
    } else if (event.key === 'End') {
      newValue = this.thumbAriaValueMax(index);
    } else {
      return;
    }

    event.preventDefault();
    this._updateValueAtIndex(index, newValue);
    this.touched.emit();
  }

  /** sets the form-driven disabled state from the presentation's reactive-forms ControlValueAccessor */
  public setFormDisabled(isDisabled: boolean): void {
    this._state.update((state) => ({ ...state, isDisabledFromForms: isDisabled }));
  }

  /** handles a pointer-down on the track: finds the nearest thumb, jumps it to the pointer, and starts a drag */
  public onTrackPointerDown(event: PointerEvent): void {
    if (this.isDisabled()) {
      return;
    }

    const percent = this._pointerToPercent(event);
    const targetValue = this._percentToValue(percent);
    const nearestIndex = this._findNearestThumbIndex(targetValue);

    if (nearestIndex === null) {
      return;
    }

    const thumbElement = this._findThumbElement(nearestIndex);

    if (thumbElement === null) {
      return;
    }

    this._updateValueAtIndex(nearestIndex, targetValue);

    thumbElement.setPointerCapture(event.pointerId);
    thumbElement.focus();

    this._state.update((state) => ({
      ...state,
      draggingThumbIndex: nearestIndex,
    }));

    this.dragStarted.emit(nearestIndex);
  }

  /** converts a value into a percentage position along the [min, max] range, clamped to [0, 100] */
  private _valueToPercent(value: number): number {
    const min = this.min();
    const max = this.max();
    const range = max - min;

    if (range <= 0) {
      return 0;
    }

    const percent = ((value - min) / range) * 100;

    return Math.max(0, Math.min(100, percent));
  }

  /** converts a percentage position along the track into a value in the [min, max] range */
  private _percentToValue(percent: number): number {
    const min = this.min();
    const max = this.max();
    const clampedPercent = Math.max(0, Math.min(100, percent));

    return min + (clampedPercent / 100) * (max - min);
  }

  /** converts a pointer event's client coordinates into a percentage along the track */
  private _pointerToPercent(event: PointerEvent): number {
    const containerRect = this._containerElementRef.nativeElement.getBoundingClientRect();

    if (this.direction() === 'horizontal') {
      if (containerRect.width <= 0) {
        return 0;
      }

      return ((event.clientX - containerRect.left) / containerRect.width) * 100;
    }

    if (containerRect.height <= 0) {
      return 0;
    }

    // vertical sliders are inverted: top of the track represents max, bottom represents min
    return ((containerRect.bottom - event.clientY) / containerRect.height) * 100;
  }

  /** snaps a value to the nearest step increment within [min, max] */
  private _snapToStep(value: number): number {
    const min = this.min();
    const max = this.max();
    const step = this.step();

    if (step <= 0) {
      return Math.max(min, Math.min(max, value));
    }

    const snapped = min + Math.round((value - min) / step) * step;

    return Math.max(min, Math.min(max, snapped));
  }

  /** updates the value at the given index, snapping to step, enforcing neighbor constraints, and sorting when allowCrossing is true */
  private _updateValueAtIndex(index: number, rawValue: number): void {
    const snapped = this._snapToStep(rawValue);
    const allowCrossing = this.allowCrossing();
    const currentValues = this.values();

    let finalValue = snapped;

    if (!allowCrossing) {
      const previous = currentValues[index - 1];
      const next = currentValues[index + 1];

      if (previous !== undefined) {
        finalValue = Math.max(previous, finalValue);
      }

      if (next !== undefined) {
        finalValue = Math.min(next, finalValue);
      }
    }

    if (finalValue === currentValues[index]) {
      return;
    }

    const newValues = [...currentValues];

    newValues[index] = finalValue;

    // when allowCrossing is true, values are NEVER sorted — each thumb keeps its own
    // independent value so the dragged / focused thumb identity stays stable as thumbs
    // pass through each other. when allowCrossing is false, the neighbor constraint
    // above already enforces ordering, so no sort is needed either way.
    this.values.set(newValues);
    this.changed.emit(newValues);
  }

  /** returns the index of the thumb whose value is closest to the given target value */
  private _findNearestThumbIndex(targetValue: number): number | null {
    const currentValues = this.values();

    if (currentValues.length === 0) {
      return null;
    }

    let nearestIndex = 0;
    let smallestDistance = Math.abs(currentValues[0] - targetValue);

    for (let index = 1; index < currentValues.length; index++) {
      const distance = Math.abs(currentValues[index] - targetValue);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearestIndex = index;
      }
    }

    return nearestIndex;
  }

  /** finds the thumb element in the container by its data-thumb-index attribute */
  private _findThumbElement(index: number): HTMLElement | null {
    return this._containerElementRef.nativeElement.querySelector(`[data-thumb-index="${index}"]`) as HTMLElement | null;
  }
}
