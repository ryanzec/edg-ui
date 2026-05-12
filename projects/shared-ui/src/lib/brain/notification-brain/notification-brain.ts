import { Directive, DestroyRef, computed, effect, inject, input, output, signal } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';

/** default value for the autoCloseIn input */
export const NOTIFICATION_AUTO_CLOSE_IN_DEFAULT: number | undefined = undefined;

/** default value for the closeButtonAriaLabel input */
export const NOTIFICATION_CLOSE_BUTTON_ARIA_LABEL_DEFAULT = 'Close notification';

/** default value for the resetTimerOnHover input */
export const NOTIFICATION_RESET_TIMER_ON_HOVER_DEFAULT = false;

/** cadence (ms) at which the progress signal is ticked while the auto-close timer is running */
const PROGRESS_TICK_INTERVAL_MS = 50;

/**
 * headless brain directive for the notification component. owns the removing state, the auto-close timer
 * effect, pause/resume controls (used for pause-on-hover), the live progress signal that decays from 1 → 0
 * over autoCloseIn, the close lifecycle methods, the close button accessibility label, and timer cleanup
 * on destroy. the presentation drives the actual fade-out animation and calls completeClose() once it ends
 * so the brain stays decoupled from any animation timing.
 */
@Directive({
  selector: '[orgNotificationBrain]',
  exportAs: 'orgNotificationBrain',
})
export class NotificationBrainDirective {
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _isRemoving = signal<boolean>(false);

  private readonly _progress = signal<number>(1);

  private _autoCloseTimer: ReturnType<typeof setTimeout> | undefined;

  private _progressInterval: ReturnType<typeof setInterval> | undefined;

  /** ms remaining on the timer; when paused this is the captured remaining value, when running it is the configured starting amount */
  private _remainingMs = 0;

  /** epoch ms at which the currently-running timer was last (re)started, used to derive elapsed time on pause */
  private _timerStartedAt = 0;

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

  /** when true, pausing the auto-close timer (e.g. on hover) wipes any remaining time so resuming restarts the full duration */
  public readonly resetTimerOnHover = input<boolean>(NOTIFICATION_RESET_TIMER_ON_HOVER_DEFAULT);

  /** emitted with the notification id once the close lifecycle completes */
  public readonly closed = output<string>();

  /** whether the close lifecycle is currently running (e.g. presentation is fading out) */
  public readonly isRemoving = computed<boolean>(() => this._isRemoving());

  /** remaining-time ratio (0 → 1); 1 = full duration remaining, 0 = expired. always 1 when no auto-close is configured */
  public readonly progress = computed<number>(() => this._progress());

  constructor() {
    /**
     * (re)starts the auto-close timer whenever autoCloseIn changes to a positive value, and clears any prior timer
     * when the input changes or the brain is destroyed.
     */
    effect((onCleanup) => {
      const autoCloseIn = this.autoCloseIn();

      this._stopTimer();

      if (autoCloseIn === undefined || autoCloseIn <= 0) {
        this._progress.set(1);

        return;
      }

      this._remainingMs = autoCloseIn;
      this._startTimer();

      onCleanup(() => {
        this._stopTimer();
      });
    });

    this._destroyRef.onDestroy(() => {
      this._stopTimer();
    });
  }

  /** marks the notification as removing so the presentation can run its fade-out */
  public startClose(): void {
    if (this._isRemoving()) {
      return;
    }

    this._stopTimer();
    this._isRemoving.set(true);
  }

  /** called by the presentation once its fade-out animation has finished, emitting the closed output */
  public completeClose(): void {
    if (!this._isRemoving()) {
      return;
    }

    this.closed.emit(this.id());
  }

  /**
   * pauses the auto-close timer; preserves remaining time by default so resuming continues from where it left off.
   * when resetTimerOnHover is true the remaining time is wiped, so the next resume restarts the full duration.
   */
  public pauseAutoClose(): void {
    if (this._autoCloseTimer === undefined) {
      return;
    }

    const elapsed = Date.now() - this._timerStartedAt;

    this._stopTimer();

    if (this.resetTimerOnHover()) {
      const autoCloseIn = this.autoCloseIn();

      this._remainingMs = autoCloseIn !== undefined && autoCloseIn > 0 ? autoCloseIn : 0;
      this._progress.set(1);

      return;
    }

    this._remainingMs = Math.max(0, this._remainingMs - elapsed);
  }

  /** resumes the auto-close timer using the captured remaining time (or full duration after a reset-on-hover pause) */
  public resumeAutoClose(): void {
    if (this._isRemoving() || this._autoCloseTimer !== undefined || this._remainingMs <= 0) {
      return;
    }

    this._startTimer();
  }

  private _startTimer(): void {
    const autoCloseIn = this.autoCloseIn();

    if (autoCloseIn === undefined || autoCloseIn <= 0 || this._remainingMs <= 0) {
      return;
    }

    this._timerStartedAt = Date.now();

    this._autoCloseTimer = setTimeout(() => {
      this._autoCloseTimer = undefined;
      this._stopProgressTicker();
      this._progress.set(0);
      this.startClose();
    }, this._remainingMs);

    this._startProgressTicker(autoCloseIn);
  }

  private _stopTimer(): void {
    if (this._autoCloseTimer !== undefined) {
      clearTimeout(this._autoCloseTimer);
      this._autoCloseTimer = undefined;
    }

    this._stopProgressTicker();
  }

  private _startProgressTicker(autoCloseIn: number): void {
    this._stopProgressTicker();

    const initialRatio = Math.min(1, Math.max(0, this._remainingMs / autoCloseIn));

    this._progress.set(initialRatio);

    this._progressInterval = setInterval(() => {
      const elapsed = Date.now() - this._timerStartedAt;
      const remaining = Math.max(0, this._remainingMs - elapsed);
      const ratio = autoCloseIn > 0 ? Math.min(1, Math.max(0, remaining / autoCloseIn)) : 0;

      this._progress.set(ratio);
    }, PROGRESS_TICK_INTERVAL_MS);
  }

  private _stopProgressTicker(): void {
    if (this._progressInterval === undefined) {
      return;
    }

    clearInterval(this._progressInterval);
    this._progressInterval = undefined;
  }
}
