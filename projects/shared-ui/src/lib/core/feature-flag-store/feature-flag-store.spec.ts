import { TestBed } from '@angular/core/testing';
import * as LDClient from 'launchdarkly-js-client-sdk';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { logManager } from '@organization/shared-utils';
import { allFeatureFlags, FeatureFlag, FeatureFlagStore } from './feature-flag-store';

type ReadyHandler = () => void;
type ChangeHandler = (changes: LDClient.LDFlagChangeset) => void;
type ErrorHandler = (error: Error) => void;

type FakeLDClient = {
  client: LDClient.LDClient;
  triggerReady: () => void;
  triggerChange: (changes: LDClient.LDFlagChangeset) => void;
  triggerError: (error: Error) => void;
  setVariation: (flag: string, value: unknown) => void;
  closeSpy: ReturnType<typeof vi.fn>;
};

const createFakeLDClient = (initialVariations: Partial<Record<FeatureFlag, unknown>> = {}): FakeLDClient => {
  const readyHandlers: ReadyHandler[] = [];
  const changeHandlers: ChangeHandler[] = [];
  const errorHandlers: ErrorHandler[] = [];
  const variations = new Map<string, unknown>(Object.entries(initialVariations));
  const closeSpy = vi.fn();

  const client = {
    on: (eventName: string, handler: (...args: unknown[]) => void): void => {
      if (eventName === 'ready') {
        readyHandlers.push(handler as ReadyHandler);

        return;
      }

      if (eventName === 'change') {
        changeHandlers.push(handler as ChangeHandler);

        return;
      }

      if (eventName === 'error') {
        errorHandlers.push(handler as ErrorHandler);
      }
    },
    variation: (flag: string, defaultValue: unknown): unknown => {
      return variations.has(flag) ? variations.get(flag) : defaultValue;
    },
    close: closeSpy,
  } as unknown as LDClient.LDClient;

  return {
    client,
    triggerReady: () => {
      for (const handler of readyHandlers) {
        handler();
      }
    },
    triggerChange: (changes) => {
      for (const handler of changeHandlers) {
        handler(changes);
      }
    },
    triggerError: (error) => {
      for (const handler of errorHandlers) {
        handler(error);
      }
    },
    setVariation: (flag, value) => {
      variations.set(flag, value);
    },
    closeSpy,
  };
};

describe('FeatureFlagStore', () => {
  let store: FeatureFlagStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(FeatureFlagStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('initial state', () => {
    it('reports as not initialized', () => {
      expect(store.isInitialized()).toBe(false);
    });

    it('returns false for every known feature flag', () => {
      for (const flag of allFeatureFlags) {
        expect(store.has(flag)).toBe(false);
      }
    });
  });

  describe('initialize', () => {
    beforeEach(() => {
      // suppress expected diagnostic output from the ready/change/error handlers these tests intentionally trigger
      vi.spyOn(logManager, 'log').mockImplementation(() => {});
      vi.spyOn(logManager, 'warn').mockImplementation(() => {});
      vi.spyOn(logManager, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('registers ready, change, and error handlers on the provided client', () => {
      const fake = createFakeLDClient();
      const onSpy = vi.spyOn(fake.client, 'on');

      store.initialize(fake.client);

      const registeredEvents = onSpy.mock.calls.map((call) => call[0]);

      expect(registeredEvents).toContain('ready');
      expect(registeredEvents).toContain('change');
      expect(registeredEvents).toContain('error');
    });

    describe('on ready event', () => {
      it('flips isInitialized to true', () => {
        const fake = createFakeLDClient();

        store.initialize(fake.client);
        fake.triggerReady();

        expect(store.isInitialized()).toBe(true);
      });

      it('populates feature flags from the client variations', () => {
        const fake = createFakeLDClient({
          'internal-tools': true,
          'work-in-progress': false,
        });

        store.initialize(fake.client);
        fake.triggerReady();

        expect(store.has('internal-tools')).toBe(true);
        expect(store.has('work-in-progress')).toBe(false);
      });

      it('falls back to false for flags the client has no value for', () => {
        const fake = createFakeLDClient();

        store.initialize(fake.client);
        fake.triggerReady();

        for (const flag of allFeatureFlags) {
          expect(store.has(flag)).toBe(false);
        }
      });
    });

    describe('on change event', () => {
      let fake: FakeLDClient;

      beforeEach(() => {
        fake = createFakeLDClient({
          'internal-tools': true,
          'work-in-progress': false,
        });

        store.initialize(fake.client);
        fake.triggerReady();
      });

      it('applies valid boolean changes to known flags', () => {
        fake.triggerChange({
          'work-in-progress': { current: true, previous: false },
        });

        expect(store.has('work-in-progress')).toBe(true);
      });

      it('preserves untouched flags when applying a change', () => {
        fake.triggerChange({
          'work-in-progress': { current: true, previous: false },
        });

        expect(store.has('internal-tools')).toBe(true);
      });

      it('ignores unknown keys in the changeset', () => {
        fake.triggerChange({
          'unknown-flag': { current: true, previous: false },
        } as unknown as LDClient.LDFlagChangeset);

        expect(store.has('internal-tools')).toBe(true);
        expect(store.has('work-in-progress')).toBe(false);
      });

      it('ignores non-boolean values for known flags', () => {
        fake.triggerChange({
          'work-in-progress': { current: 'yes', previous: false },
        } as unknown as LDClient.LDFlagChangeset);

        expect(store.has('work-in-progress')).toBe(false);
      });

      it('applies valid changes from a mixed valid + invalid changeset', () => {
        fake.triggerChange({
          'work-in-progress': { current: true, previous: false },
          'internal-tools': { current: 'nope', previous: true },
          'unknown-flag': { current: true, previous: false },
        } as unknown as LDClient.LDFlagChangeset);

        expect(store.has('work-in-progress')).toBe(true);
        expect(store.has('internal-tools')).toBe(true);
      });
    });

    describe('on error event', () => {
      it('does not throw and leaves the store state intact', () => {
        const fake = createFakeLDClient({ 'internal-tools': true });

        store.initialize(fake.client);
        fake.triggerReady();

        expect(() => fake.triggerError(new Error('boom'))).not.toThrow();
        expect(store.isInitialized()).toBe(true);
        expect(store.has('internal-tools')).toBe(true);
      });
    });
  });

  describe('reset', () => {
    beforeEach(() => {
      // suppress expected diagnostic output from the ready handler this test intentionally triggers
      vi.spyOn(logManager, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('restores defaults and marks the store as uninitialized', () => {
      const fake = createFakeLDClient({
        'internal-tools': true,
        'work-in-progress': true,
      });

      store.initialize(fake.client);
      fake.triggerReady();

      store.reset();

      expect(store.isInitialized()).toBe(false);

      for (const flag of allFeatureFlags) {
        expect(store.has(flag)).toBe(false);
      }
    });
  });

  describe('ngOnDestroy', () => {
    it('closes the client when one was initialized', () => {
      const fake = createFakeLDClient();

      store.initialize(fake.client);
      store.ngOnDestroy();

      expect(fake.closeSpy).toHaveBeenCalledTimes(1);
    });

    it('is a no-op when no client was initialized', () => {
      expect(() => store.ngOnDestroy()).not.toThrow();
    });
  });
});
