import { Directive, DestroyRef, computed, effect, inject, input, output, signal } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';

/** default value for the autoCloseIn input */
export const NOTIFICATION_AUTO_CLOSE_IN_DEFAULT: number | undefined = undefined;

/** default value for the closeButtonAriaLabel input */
export const NOTIFICATION_CLOSE_BUTTON_ARIA_LABEL_DEFAULT = 'Close notification';

/**
 * headless brain directive for the notification component. owns the removing state, the auto-close timer
 * effect, the close lifecycle methods, the close button accessibility label, and timer cleanup on destroy.
 * the presentation drives the actual fade-out animation and calls completeClose() once it ends so the brain
 * stays decoupled from any animation timing.
 */
@Directive({
  selector: '[orgNotificationBrain]',
  exportAs: 'orgNotificationBrain',
})
export class NotificationBrainDirective {
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _isRemoving = signal<boolean>(false);

  private _autoCloseTimer: ReturnType<typeof setTimeout> | undefined;

  /** stable identifier for the notification, emitted with the closed output once the close lifecycle completes */
  public readonly id = input.required<string>();

  /** auto-close delay in milliseconds; when omitted or non-positive the notification will not auto-close */
  public readonly autoCloseIn = input<number | undefined, number | null | undefined>(
    NOTIFICATION_AUTO_CLOSE_IN_DEFAULT,
    {
      transform: angularUtils.transformNullToUndefined,
    }
  );

  /** accessibility label applied to the presentation's close button */
  public readonly closeButtonAriaLabel = input<string>(NOTIFICATION_CLOSE_BUTTON_ARIA_LABEL_DEFAULT);

  /** emitted with the notification id once the close lifecycle completes */
  public readonly closed = output<string>();

  /** whether the close lifecycle is currently running (e.g. presentation is fading out) */
  public readonly isRemoving = computed<boolean>(() => this._isRemoving());

  constructor() {
    /**
     * starts the auto-close timer whenever autoCloseIn has a positive value, and clears any prior timer when the
     * input changes or the brain is destroyed.
     */
    effect((onCleanup) => {
      const autoCloseIn = this.autoCloseIn();

      if (autoCloseIn === undefined || autoCloseIn <= 0) {
        return;
      }

      this._autoCloseTimer = setTimeout(() => {
        this._autoCloseTimer = undefined;
        this.startClose();
      }, autoCloseIn);

      onCleanup(() => {
        if (this._autoCloseTimer === undefined) {
          return;
        }

        clearTimeout(this._autoCloseTimer);
        this._autoCloseTimer = undefined;
      });
    });

    this._destroyRef.onDestroy(() => {
      if (this._autoCloseTimer === undefined) {
        return;
      }

      clearTimeout(this._autoCloseTimer);
      this._autoCloseTimer = undefined;
    });
  }

  /** marks the notification as removing so the presentation can run its fade-out */
  public startClose(): void {
    if (this._isRemoving()) {
      return;
    }

    this._isRemoving.set(true);
  }

  /** called by the presentation once its fade-out animation has finished, emitting the closed output */
  public completeClose(): void {
    if (!this._isRemoving()) {
      return;
    }

    this.closed.emit(this.id());
  }
}
