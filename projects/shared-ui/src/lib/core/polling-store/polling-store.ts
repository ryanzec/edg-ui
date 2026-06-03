import { computed, Injectable, OnDestroy, signal } from '@angular/core';
import { logManager } from '@organization/shared-utils';

type PollingStoreState = {
  isActive: boolean;
  pollingInterval: number;
};

export type PollingStoreInitializeOptions = {
  callback: () => boolean | Promise<boolean>;
  interval?: number;
  isActive?: boolean;
};

/**
 * @internal only exposed for testing purposes
 */
export const _MAX_CONSECUTIVE_FAILURES = 5;

/**
 * @internal only exposed for testing purposes
 */
export const _DEFAULT_POLLING_INTERVAL = 10000;

/**
 * manages polling logic with configurable intervals and callbacks
 */
@Injectable()
export class PollingStore implements OnDestroy {
  private _state = signal<PollingStoreState>({
    isActive: false,
    pollingInterval: _DEFAULT_POLLING_INTERVAL,
  });

  private _callback: (() => boolean | Promise<boolean>) | null = null;
  private _timeoutId: number | null = null;
  private _consecutiveFailures = 0;

  /**
   * indicates whether the polling store has been destroyed which is useful to know in certain contexts (like if the
   * polling store was destory in the middle of a polling callback call)
   *
   * @returns {boolean} whether the polling store has been destroyed
   */
  private _isDestroyed = false;

  /**
   * indicates whether polling is currently active
   *
   * @returns {boolean} whether polling is currently active
   */
  public isActive = computed<boolean>(() => this._state().isActive);

  /**
   * the current polling interval in milliseconds
   *
   * @returns {number} the current polling interval in milliseconds
   */
  public pollingInterval = computed<number>(() => this._state().pollingInterval);

  /**
   * initializes the polling store with callback and optional configuration
   *
   * @param {PollingStoreInitializeOptions} options the options to initialize the polling store with
   * @returns {void} void
   */
  public initialize(options: PollingStoreInitializeOptions): void {
    this._callback = options.callback;

    if (options.interval !== undefined) {
      this._state.update((state) => ({ ...state, pollingInterval: options.interval || _DEFAULT_POLLING_INTERVAL }));
    }

    if (options.isActive) {
      this.startPolling();
    }
  }

  /**
   * sets the callback function to be executed during polling
   *
   * @param {() => boolean | Promise<boolean>} callback the callback function to be executed during polling
   * @returns {void} void
   */
  public setCallback(callback: () => boolean | Promise<boolean>): void {
    this._callback = callback;
  }

  /**
   * sets the polling interval in milliseconds
   *
   * @param {number} interval the polling interval in milliseconds
   * @returns {void} void
   */
  public setInterval(interval: number): void {
    this._state.update((state) => ({ ...state, pollingInterval: interval }));
  }

  /**
   * starts the polling process
   *
   * @param {number} delay optional delay in milliseconds before the first poll (default: 0)
   * @returns {void} void
   */
  public startPolling(delay = 0): void {
    if (this._state().isActive) {
      return;
    }

    if (!this._callback) {
      logManager.log({
        type: 'polling-store-no-callback',
        message: 'attempted to start polling without a callback set',
      });

      return;
    }

    this._state.update((state) => ({ ...state, isActive: true }));
    this._consecutiveFailures = 0;

    if (delay > 0) {
      this._timeoutId = window.setTimeout(() => this._poll(), delay);

      return;
    }

    this._poll();
  }

  /**
   * stops the polling process
   *
   * @returns {void} void
   */
  public endPolling(): void {
    if (!this._state().isActive) {
      return;
    }

    this._state.update((state) => ({ ...state, isActive: false }));
    this._cancelPendingPoll();
  }

  public ngOnDestroy(): void {
    this._isDestroyed = true;
    this._cancelPendingPoll();
  }

  /**
   * polls the callback function
   *
   * @returns {Promise<void>} void
   */
  private async _poll(): Promise<void> {
    if (!this._callback) {
      logManager.log({
        type: 'polling-store-no-callback',
        message: 'attempted to poll without a callback set',
      });

      return;
    }

    if (!this._state().isActive) {
      return;
    }

    let shouldContinue = false;

    try {
      shouldContinue = await this._callback();

      if (shouldContinue) {
        this._consecutiveFailures = 0;
      }
    } catch (error) {
      this._consecutiveFailures++;

      logManager.error({
        type: 'polling-store-callback-error',
        message: 'polling callback threw an error',
        error,
        consecutiveFailures: this._consecutiveFailures,
      });

      if (this._consecutiveFailures >= _MAX_CONSECUTIVE_FAILURES) {
        logManager.error({
          type: 'polling-store-max-failures',
          message: `polling stopped after ${_MAX_CONSECUTIVE_FAILURES} consecutive failures`,
        });

        this._state.update((state) => ({ ...state, isActive: false }));

        return;
      }

      shouldContinue = true;
    }

    if (!shouldContinue || this._isDestroyed) {
      this._state.update((state) => ({ ...state, isActive: false }));

      return;
    }

    this._timeoutId = window.setTimeout(() => {
      this._poll();
    }, this._state().pollingInterval);
  }

  /**
   * cancels any pending poll
   *
   * @returns {void} void
   */
  private _cancelPendingPoll(): void {
    if (this._timeoutId !== null) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  }
}
