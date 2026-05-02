import { Directive, DestroyRef, computed, effect, inject, input, output, signal } from '@angular/core';

/** the per-notification configuration the brain needs to drive its timers */
export type GlobalNotificationConfig = {
  id: string;
  autoCloseIn?: number;
  animationDuration: number;
};

/**
 * headless brain directive for the global-notification component. owns the removing state, the auto-close timer
 * effect, the fade-out scheduling, and timer cleanup on destroy.
 */
@Directive({
  selector: '[orgGlobalNotificationBrain]',
  exportAs: 'orgGlobalNotificationBrain',
})
export class GlobalNotificationBrainDirective {
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _isRemoving = signal<boolean>(false);

  private _autoCloseTimer: ReturnType<typeof setTimeout> | undefined;
  private _removeTimer: ReturnType<typeof setTimeout> | undefined;

  /** the per-notification config the brain uses to drive auto-close + fade-out timers */
  public readonly config = input.required<GlobalNotificationConfig>();

  /** emitted with the notification id once the fade-out animation completes */
  public readonly closed = output<string>();

  /** whether the fade-out animation is currently running */
  public readonly isRemoving = computed<boolean>(() => this._isRemoving());

  constructor() {
    /**
     * starts the auto-close timer whenever the config has a positive autoCloseIn value, and clears any prior timer
     * when the config changes or the brain is destroyed.
     */
    effect((onCleanup) => {
      const config = this.config();

      if (config.autoCloseIn === undefined || config.autoCloseIn <= 0) {
        return;
      }

      this._autoCloseTimer = setTimeout(() => {
        this._autoCloseTimer = undefined;
        this.startClose();
      }, config.autoCloseIn);

      onCleanup(() => {
        if (this._autoCloseTimer === undefined) {
          return;
        }

        clearTimeout(this._autoCloseTimer);
        this._autoCloseTimer = undefined;
      });
    });

    this._destroyRef.onDestroy(() => {
      if (this._removeTimer === undefined) {
        return;
      }

      clearTimeout(this._removeTimer);
      this._removeTimer = undefined;
    });
  }

  /** triggers the fade-out animation and emits closed once it completes */
  public startClose(): void {
    if (this._isRemoving()) {
      return;
    }

    this._isRemoving.set(true);

    const config = this.config();
    const delayMs = config.animationDuration * 1000;

    this._removeTimer = setTimeout(() => {
      this._removeTimer = undefined;
      this.closed.emit(config.id);
    }, delayMs);
  }
}
