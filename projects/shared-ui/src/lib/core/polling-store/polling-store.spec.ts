import { TestBed } from '@angular/core/testing';
import { logManager } from '@organization/shared-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { _DEFAULT_POLLING_INTERVAL, _MAX_CONSECUTIVE_FAILURES, PollingStore } from './polling-store';

const TEST_INTERVAL = 1000;

describe('PollingStore', () => {
  let service: PollingStore;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({ providers: [PollingStore] });
    service = TestBed.inject(PollingStore);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('is inactive', () => {
      expect(service.isActive()).toBe(false);
    });

    it('uses the default polling interval', () => {
      expect(service.pollingInterval()).toBe(_DEFAULT_POLLING_INTERVAL);
    });
  });

  describe('initialize', () => {
    it('sets the callback used by polling', () => {
      const callback = vi.fn(() => false);

      service.initialize({ callback });
      service.startPolling();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('applies a provided interval', () => {
      service.initialize({ callback: () => false, interval: 2000 });

      expect(service.pollingInterval()).toBe(2000);
    });

    it('falls back to the default interval when the provided interval is zero', () => {
      service.initialize({ callback: () => false, interval: 0 });

      expect(service.pollingInterval()).toBe(_DEFAULT_POLLING_INTERVAL);
    });

    it('leaves the default interval when no interval is provided', () => {
      service.initialize({ callback: () => false });

      expect(service.pollingInterval()).toBe(_DEFAULT_POLLING_INTERVAL);
    });

    it('starts polling immediately when isActive is true', () => {
      const callback = vi.fn(() => false);

      service.initialize({ callback, isActive: true });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(service.isActive()).toBe(true);
    });

    it('does not start polling when isActive is omitted', () => {
      const callback = vi.fn(() => false);

      service.initialize({ callback });

      expect(callback).not.toHaveBeenCalled();
      expect(service.isActive()).toBe(false);
    });
  });

  describe('setCallback', () => {
    it('sets the callback used by polling', () => {
      const callback = vi.fn(() => false);

      service.setCallback(callback);
      service.startPolling();

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('setInterval', () => {
    it('updates the polling interval', () => {
      service.setInterval(3000);

      expect(service.pollingInterval()).toBe(3000);
    });
  });

  describe('startPolling', () => {
    it('sets the store active and polls immediately when no delay is provided', () => {
      const callback = vi.fn(() => false);

      service.setCallback(callback);
      service.startPolling();

      expect(service.isActive()).toBe(true);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('waits the provided delay before the first poll', async () => {
      const callback = vi.fn(() => false);

      service.setCallback(callback);
      service.startPolling(500);

      expect(callback).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(500);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('is a no-op when already active', () => {
      const callback = vi.fn(() => true);

      service.setCallback(callback);
      service.startPolling();
      service.startPolling();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('stays inactive and does not poll when no callback is set', () => {
      vi.spyOn(logManager, 'log').mockImplementation(() => undefined);

      service.startPolling();

      expect(service.isActive()).toBe(false);
    });
  });

  describe('endPolling', () => {
    it('sets the store inactive and cancels the pending poll', async () => {
      const callback = vi.fn(() => true);

      service.setCallback(callback);
      service.setInterval(TEST_INTERVAL);
      service.startPolling();

      expect(callback).toHaveBeenCalledTimes(1);

      service.endPolling();

      expect(service.isActive()).toBe(false);

      await vi.advanceTimersByTimeAsync(TEST_INTERVAL * 2);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('is a no-op when not active', () => {
      service.endPolling();

      expect(service.isActive()).toBe(false);
    });
  });

  describe('polling loop', () => {
    it('re-invokes the callback after the interval when it returns true', async () => {
      const callback = vi.fn(() => true);

      service.setCallback(callback);
      service.setInterval(TEST_INTERVAL);
      service.startPolling();

      expect(callback).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(TEST_INTERVAL);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(service.isActive()).toBe(true);
    });

    it('stops polling when the callback returns false', async () => {
      const callback = vi.fn(() => false);

      service.setCallback(callback);
      service.setInterval(TEST_INTERVAL);
      service.startPolling();

      await vi.advanceTimersByTimeAsync(TEST_INTERVAL * 2);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(service.isActive()).toBe(false);
    });

    it('continues polling after a thrown error and resets the failure count on a later success', async () => {
      vi.spyOn(logManager, 'error').mockImplementation(() => undefined);

      const callback = vi
        .fn<() => boolean>()
        .mockImplementationOnce(() => {
          throw new Error('first failure');
        })
        .mockImplementation(() => true);

      service.setCallback(callback);
      service.setInterval(TEST_INTERVAL);
      service.startPolling();

      await vi.advanceTimersByTimeAsync(TEST_INTERVAL);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(service.isActive()).toBe(true);
    });

    it('stops polling after the max consecutive failures is reached', async () => {
      vi.spyOn(logManager, 'error').mockImplementation(() => undefined);

      const callback = vi.fn(() => {
        throw new Error('always failing');
      });

      service.setCallback(callback);
      service.setInterval(TEST_INTERVAL);
      service.startPolling();

      await vi.advanceTimersByTimeAsync(TEST_INTERVAL * _MAX_CONSECUTIVE_FAILURES);

      expect(callback).toHaveBeenCalledTimes(_MAX_CONSECUTIVE_FAILURES);
      expect(service.isActive()).toBe(false);
    });
  });

  describe('ngOnDestroy', () => {
    it('cancels the pending poll so the callback does not fire again', async () => {
      const callback = vi.fn(() => true);

      service.setCallback(callback);
      service.setInterval(TEST_INTERVAL);
      service.startPolling();

      expect(callback).toHaveBeenCalledTimes(1);

      service.ngOnDestroy();

      await vi.advanceTimersByTimeAsync(TEST_INTERVAL * 2);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('stops polling when destroyed while a callback is in progress', async () => {
      let resolveCallback: (shouldContinue: boolean) => void = () => undefined;
      const callback = vi.fn(
        () =>
          new Promise<boolean>((resolve) => {
            resolveCallback = resolve;
          })
      );

      service.setCallback(callback);
      service.setInterval(TEST_INTERVAL);
      service.startPolling();

      expect(callback).toHaveBeenCalledTimes(1);

      service.ngOnDestroy();
      resolveCallback(true);

      await vi.advanceTimersByTimeAsync(TEST_INTERVAL * 2);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(service.isActive()).toBe(false);
    });
  });
});
