import { Directive, computed, input, output } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';

/** all available divider direction values */
export const allDividerDirections = ['horizontal', 'vertical'] as const;

/** orientation of the divider line itself; horizontal = a horizontal line, vertical = a vertical line */
export type DividerDirection = (typeof allDividerDirections)[number];

/** default value for the direction input */
export const DIVIDER_DIRECTION_DEFAULT: DividerDirection = 'horizontal';

/** default value for the isResizable input */
export const DIVIDER_IS_RESIZABLE_DEFAULT = false;

/** default value for the value input */
export const DIVIDER_VALUE_DEFAULT: number | undefined = undefined;

/** default value for the min input */
export const DIVIDER_MIN_DEFAULT = 0;

/** default value for the max input */
export const DIVIDER_MAX_DEFAULT = 100;

/** default value for the isInteractive input */
export const DIVIDER_IS_INTERACTIVE_DEFAULT = true;

/**
 * headless brain directive for divider elements — both the simple visual `org-divider` and the interactive
 * resize divider used inside `org-splitter`. always owns the static `role="separator"` semantics, the
 * `aria-orientation` derivation from the line direction, and a `data-direction` styling hook for css. when
 * configured as resizable it additionally owns the aria-value*, focus management (tabindex), and forwards
 * pointer / keyboard dom events as outputs so consumers can drive their own resize logic.
 */
@Directive({
  selector: '[orgDividerBrain]',
  exportAs: 'orgDividerBrain',
  host: {
    role: 'separator',
    '[attr.aria-orientation]': 'direction()',
    '[attr.data-direction]': 'direction()',
    '[attr.aria-valuenow]': 'isResizable() ? value() : null',
    '[attr.aria-valuemin]': 'isResizable() ? min() : null',
    '[attr.aria-valuemax]': 'isResizable() ? max() : null',
    '[attr.tabindex]': 'tabindexValue()',
    '(pointerdown)': 'handlePointerDown($event)',
    '(pointermove)': 'handlePointerMove($event)',
    '(pointerup)': 'handlePointerUp($event)',
    '(pointercancel)': 'handlePointerCancel($event)',
    '(keydown)': 'handleKeyDown($event)',
  },
})
export class DividerBrainDirective {
  /** orientation of the divider line itself: 'horizontal' for a horizontal line; 'vertical' for a vertical line */
  public readonly direction = input<DividerDirection>(DIVIDER_DIRECTION_DEFAULT);

  /** whether the divider supports user-driven resize, gating aria-value*, tabindex, and event forwarding */
  public readonly isResizable = input<boolean>(DIVIDER_IS_RESIZABLE_DEFAULT);

  /** current resize value as a percentage (0–100); set as aria-valuenow when isResizable is true */
  public readonly value = input<number | undefined, number | null | undefined>(DIVIDER_VALUE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** minimum resize value as a percentage; set as aria-valuemin when isResizable is true */
  public readonly min = input<number>(DIVIDER_MIN_DEFAULT);

  /** maximum resize value as a percentage; set as aria-valuemax when isResizable is true */
  public readonly max = input<number>(DIVIDER_MAX_DEFAULT);

  /** whether the resizable divider is currently interactive; drives tabindex (0 when interactive, -1 otherwise) */
  public readonly isInteractive = input<boolean>(DIVIDER_IS_INTERACTIVE_DEFAULT);

  /** emitted when a pointerdown event occurs on the divider while resizable */
  public readonly pointerDown = output<PointerEvent>();

  /** emitted when a pointermove event occurs on the divider while resizable */
  public readonly pointerMove = output<PointerEvent>();

  /** emitted when a pointerup event occurs on the divider while resizable */
  public readonly pointerUp = output<PointerEvent>();

  /** emitted when a pointercancel event occurs on the divider while resizable */
  public readonly pointerCancel = output<PointerEvent>();

  /** emitted when a keydown event occurs on the divider while resizable */
  public readonly keyDown = output<KeyboardEvent>();

  /** resolved tabindex attribute value: null when non-resizable, 0 when interactive, -1 otherwise */
  public readonly tabindexValue = computed<number | null>(() => {
    if (!this.isResizable()) {
      return null;
    }

    return this.isInteractive() ? 0 : -1;
  });

  /** forwards pointerdown to the pointerDown output when resizable */
  protected handlePointerDown(event: PointerEvent): void {
    if (!this.isResizable()) {
      return;
    }

    this.pointerDown.emit(event);
  }

  /** forwards pointermove to the pointerMove output when resizable */
  protected handlePointerMove(event: PointerEvent): void {
    if (!this.isResizable()) {
      return;
    }

    this.pointerMove.emit(event);
  }

  /** forwards pointerup to the pointerUp output when resizable */
  protected handlePointerUp(event: PointerEvent): void {
    if (!this.isResizable()) {
      return;
    }

    this.pointerUp.emit(event);
  }

  /** forwards pointercancel to the pointerCancel output when resizable */
  protected handlePointerCancel(event: PointerEvent): void {
    if (!this.isResizable()) {
      return;
    }

    this.pointerCancel.emit(event);
  }

  /** forwards keydown to the keyDown output when resizable */
  protected handleKeyDown(event: KeyboardEvent): void {
    if (!this.isResizable()) {
      return;
    }

    this.keyDown.emit(event);
  }
}
