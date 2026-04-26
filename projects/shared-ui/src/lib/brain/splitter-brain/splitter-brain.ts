import { Directive, ElementRef, computed, inject, input, signal } from '@angular/core';

/** all available splitter direction values */
export const allSplitterDirections = ['horizontal', 'vertical'] as const;

/** the orientation of the split layout */
export type SplitterDirection = (typeof allSplitterDirections)[number];

/** all available splitter collapsed side values */
export const allSplitterCollapsedSides = ['first', 'second'] as const;

/** which section is collapsed to take up no space */
export type SplitterCollapsedSide = (typeof allSplitterCollapsedSides)[number];

/** default value for the splitterMinimumSize input */
export const SPLITTER_MINIMUM_SIZE_DEFAULT: number[] = [0];

/** default value for the splitterDefaultSize input */
export const SPLITTER_DEFAULT_SIZE_DEFAULT: number[] = [50];

/** default value for the splitterIsEnabled input */
export const SPLITTER_IS_ENABLED_DEFAULT = true;

/** default value for the splitterCollapsedSide input */
export const SPLITTER_COLLAPSED_SIDE_DEFAULT: SplitterCollapsedSide | null = null;

/** the internal state shape for the splitter brain directive */
type SplitterState = {
  splitPosition: number | null;
  isDragging: boolean;
};

/**
 * headless brain directive for the splitter component. owns the split position state, the dragging state, the
 * pointer and keyboard event handlers, and the min / default size resolution. the directive injects its own
 * ElementRef which (when applied as a hostDirective on org-splitter) is the splitter container — used for
 * getBoundingClientRect during pointer / keyboard math.
 *
 * the presentation component renders the divider element and binds its pointer / keyboard events to the public
 * methods exposed by this directive.
 */
@Directive({
  selector: '[orgSplitterBrain]',
  exportAs: 'orgSplitterBrain',
})
export class SplitterBrainDirective {
  private readonly _containerElementRef = inject(ElementRef<HTMLElement>);

  private readonly _state = signal<SplitterState>({
    splitPosition: null,
    isDragging: false,
  });

  /** the orientation of the split layout */
  public readonly splitterDirection = input.required<SplitterDirection>();

  /** the minimum size in pixels for each section; single value applies to both sides */
  public readonly splitterMinimumSize = input<number[]>(SPLITTER_MINIMUM_SIZE_DEFAULT);

  /** the initial size as a percentage for the first section; single value sets first with remainder for second */
  public readonly splitterDefaultSize = input<number[]>(SPLITTER_DEFAULT_SIZE_DEFAULT);

  /** whether the divider is interactive and draggable */
  public readonly splitterIsEnabled = input<boolean>(SPLITTER_IS_ENABLED_DEFAULT);

  /** which section is collapsed to take up all space, null means neither section is collapsed */
  public readonly splitterCollapsedSide = input<SplitterCollapsedSide | null>(SPLITTER_COLLAPSED_SIDE_DEFAULT);

  /** the resolved minimum size tuple [first, second] in pixels */
  public readonly resolvedMinimumSize = computed<[number, number]>(() => {
    const sizes = this.splitterMinimumSize();

    if (sizes.length === 1) {
      return [sizes[0], sizes[0]];
    }

    return [sizes[0], sizes[1]];
  });

  /** the resolved default size tuple [first, second] as percentages */
  public readonly resolvedDefaultSize = computed<[number, number]>(() => {
    const sizes = this.splitterDefaultSize();

    if (sizes.length === 1) {
      return [sizes[0], 100 - sizes[0]];
    }

    return [sizes[0], sizes[1]];
  });

  /** whether the divider can be dragged to resize sections */
  public readonly isDraggable = computed<boolean>(() => {
    return this.splitterIsEnabled() && this.splitterCollapsedSide() === null;
  });

  /** whether the divider is currently being dragged */
  public readonly isDragging = computed<boolean>(() => this._state().isDragging);

  /** the size of the first section as a percentage of the container */
  public readonly firstSectionSize = computed<number>(() => {
    if (this.splitterCollapsedSide() === 'second') {
      return 100;
    }

    if (this.splitterCollapsedSide() === 'first') {
      return 0;
    }

    return this._state().splitPosition ?? this.resolvedDefaultSize()[0];
  });

  /** initiates drag on the divider, capturing pointer events for smooth resize */
  public onDividerPointerDown(event: PointerEvent): void {
    if (!this.isDraggable()) {
      return;
    }

    const target = event.currentTarget as HTMLElement;
    target.setPointerCapture(event.pointerId);

    this._state.update((state) => ({
      ...state,
      isDragging: true,
    }));
  }

  /** updates the split position as the pointer moves during an active drag */
  public onDividerPointerMove(event: PointerEvent): void {
    if (!this._state().isDragging) {
      return;
    }

    const containerRect = this._containerElementRef.nativeElement.getBoundingClientRect();
    const [minFirst, minSecond] = this.resolvedMinimumSize();

    let newPosition: number;

    if (this.splitterDirection() === 'horizontal') {
      const containerWidth = containerRect.width;
      newPosition = ((event.clientX - containerRect.left) / containerWidth) * 100;
      const minFirstPercent = (minFirst / containerWidth) * 100;
      const minSecondPercent = (minSecond / containerWidth) * 100;
      newPosition = Math.max(minFirstPercent, Math.min(100 - minSecondPercent, newPosition));
    } else {
      const containerHeight = containerRect.height;
      newPosition = ((event.clientY - containerRect.top) / containerHeight) * 100;
      const minFirstPercent = (minFirst / containerHeight) * 100;
      const minSecondPercent = (minSecond / containerHeight) * 100;
      newPosition = Math.max(minFirstPercent, Math.min(100 - minSecondPercent, newPosition));
    }

    this._state.update((state) => ({
      ...state,
      splitPosition: newPosition,
    }));
  }

  /** ends the drag and releases pointer capture */
  public onDividerPointerUp(event: PointerEvent): void {
    if (!this._state().isDragging) {
      return;
    }

    const target = event.currentTarget as HTMLElement;

    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }

    this._state.update((state) => ({
      ...state,
      isDragging: false,
    }));
  }

  /** cancels the drag and clears dragging state */
  public onDividerPointerCancel(): void {
    this._state.update((state) => ({
      ...state,
      isDragging: false,
    }));
  }

  /** adjusts split position via keyboard when the divider is focused */
  public onDividerKeyDown(event: KeyboardEvent): void {
    if (!this.isDraggable()) {
      return;
    }

    const step = 5;
    const current = this._state().splitPosition ?? this.resolvedDefaultSize()[0];
    const containerRect = this._containerElementRef.nativeElement.getBoundingClientRect();
    const [minFirst, minSecond] = this.resolvedMinimumSize();

    let newPosition = current;

    if (this.splitterDirection() === 'horizontal') {
      const containerWidth = containerRect.width;
      const minFirstPercent = (minFirst / containerWidth) * 100;
      const minSecondPercent = (minSecond / containerWidth) * 100;

      if (event.key === 'ArrowLeft') {
        newPosition = Math.max(minFirstPercent, current - step);
        event.preventDefault();
      } else if (event.key === 'ArrowRight') {
        newPosition = Math.min(100 - minSecondPercent, current + step);
        event.preventDefault();
      } else if (event.key === 'Home') {
        newPosition = minFirstPercent;
        event.preventDefault();
      } else if (event.key === 'End') {
        newPosition = 100 - minSecondPercent;
        event.preventDefault();
      }
    } else {
      const containerHeight = containerRect.height;
      const minFirstPercent = (minFirst / containerHeight) * 100;
      const minSecondPercent = (minSecond / containerHeight) * 100;

      if (event.key === 'ArrowUp') {
        newPosition = Math.max(minFirstPercent, current - step);
        event.preventDefault();
      } else if (event.key === 'ArrowDown') {
        newPosition = Math.min(100 - minSecondPercent, current + step);
        event.preventDefault();
      } else if (event.key === 'Home') {
        newPosition = minFirstPercent;
        event.preventDefault();
      } else if (event.key === 'End') {
        newPosition = 100 - minSecondPercent;
        event.preventDefault();
      }
    }

    if (newPosition === current) {
      return;
    }

    this._state.update((state) => ({
      ...state,
      splitPosition: newPosition,
    }));
  }
}
