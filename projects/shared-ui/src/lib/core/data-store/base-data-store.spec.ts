import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { logManager, ResponseMeta } from '@organization/shared-utils';
import { BaseDataStore } from './base-data-store';

type TestItem = {
  id: string;
  name: string;
};

class TestDataStore<T> extends BaseDataStore<T> {
  public constructor(idField: keyof T | undefined) {
    super(idField);
  }
}

describe('BaseDataStore', () => {
  let store: TestDataStore<TestItem>;

  beforeEach(() => {
    store = new TestDataStore<TestItem>('id');
  });

  describe('initial state', () => {
    it('exposes an empty data array', () => {
      expect(store.data()).toEqual([]);
    });

    it('exposes undefined meta', () => {
      expect(store.meta()).toBeUndefined();
    });

    it('exposes a null top-level error', () => {
      expect(store.error()).toBeNull();
    });

    it('exposes an empty keyed errors object', () => {
      expect(store.errors()).toEqual({});
    });

    it('starts uninitialized', () => {
      expect(store.hasInitialized()).toBe(false);
    });

    it('starts non-stale', () => {
      expect(store.isStale()).toBe(false);
    });

    it('has no previous or active mutation', () => {
      expect(store.previousMutation()).toBeNull();
      expect(store.activeMutation()).toBeNull();
    });

    it('reports remoteType null and remoteState idle', () => {
      expect(store.remoteType()).toBeNull();
      expect(store.remoteState()).toBe('idle');
    });

    it('reports loadingState as uninitialized and isLoading false', () => {
      expect(store.loadingState()).toBe('uninitialized');
      expect(store.isLoading()).toBe(false);
    });

    it('reports mutationState idle and isMutating false', () => {
      expect(store.mutationState()).toBe('idle');
      expect(store.isMutating()).toBe(false);
    });
  });

  describe('markAsInitialized', () => {
    it('flips hasInitialized to true', () => {
      store.markAsInitialized();

      expect(store.hasInitialized()).toBe(true);
    });

    it('transitions loadingState to idle once initialized', () => {
      store.markAsInitialized();

      expect(store.loadingState()).toBe('idle');
      expect(store.isLoading()).toBe(false);
    });
  });

  describe('reset', () => {
    it('returns the store to its default state after mutations', () => {
      store.pushLocalData([{ id: 'a', name: 'alpha' }]);
      store.setLocalMeta({ totalItemCount: 5 });
      store.setError('boom');
      store.setError('field error', 'fieldA');
      store.markAsInitialized();
      store.markAsStale();

      store.reset();

      expect(store.data()).toEqual([]);
      expect(store.meta()).toBeUndefined();
      expect(store.error()).toBeNull();
      expect(store.errors()).toEqual({});
      expect(store.hasInitialized()).toBe(false);
      expect(store.isStale()).toBe(false);
      expect(store.loadingState()).toBe('uninitialized');
    });
  });

  describe('unshiftLocalData', () => {
    it('prepends items to an empty data array', () => {
      store.unshiftLocalData([
        { id: 'a', name: 'alpha' },
        { id: 'b', name: 'beta' },
      ]);

      expect(store.data()).toEqual([
        { id: 'a', name: 'alpha' },
        { id: 'b', name: 'beta' },
      ]);
    });

    it('prepends items before existing data', () => {
      store.pushLocalData([{ id: 'b', name: 'beta' }]);

      store.unshiftLocalData([{ id: 'a', name: 'alpha' }]);

      expect(store.data()).toEqual([
        { id: 'a', name: 'alpha' },
        { id: 'b', name: 'beta' },
      ]);
    });

    it('produces a new array reference (immutability)', () => {
      const initialReference = store.data();

      store.unshiftLocalData([{ id: 'a', name: 'alpha' }]);

      expect(store.data()).not.toBe(initialReference);
    });
  });

  describe('pushLocalData', () => {
    it('appends items to an empty data array', () => {
      store.pushLocalData([
        { id: 'a', name: 'alpha' },
        { id: 'b', name: 'beta' },
      ]);

      expect(store.data()).toEqual([
        { id: 'a', name: 'alpha' },
        { id: 'b', name: 'beta' },
      ]);
    });

    it('appends items after existing data', () => {
      store.pushLocalData([{ id: 'a', name: 'alpha' }]);

      store.pushLocalData([{ id: 'b', name: 'beta' }]);

      expect(store.data()).toEqual([
        { id: 'a', name: 'alpha' },
        { id: 'b', name: 'beta' },
      ]);
    });
  });

  describe('updateLocalData', () => {
    beforeEach(() => {
      // suppress expected diagnostic output for the no-idField branch this block intentionally triggers
      vi.spyOn(logManager, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('merges fields into the matching item by id', () => {
      store.pushLocalData([
        { id: 'a', name: 'alpha' },
        { id: 'b', name: 'beta' },
      ]);

      store.updateLocalData({ id: 'a', name: 'alpha-updated' });

      expect(store.data()).toEqual([
        { id: 'a', name: 'alpha-updated' },
        { id: 'b', name: 'beta' },
      ]);
    });

    it('is a no-op when no item matches the id', () => {
      store.pushLocalData([{ id: 'a', name: 'alpha' }]);

      store.updateLocalData({ id: 'missing', name: 'nope' });

      expect(store.data()).toEqual([{ id: 'a', name: 'alpha' }]);
    });

    it('is a no-op when no idField is configured', () => {
      const idLessStore = new TestDataStore<TestItem>(undefined);
      idLessStore.pushLocalData([{ id: 'a', name: 'alpha' }]);

      idLessStore.updateLocalData({ id: 'a', name: 'alpha-updated' });

      expect(idLessStore.data()).toEqual([{ id: 'a', name: 'alpha' }]);
    });
  });

  describe('deleteLocalData', () => {
    beforeEach(() => {
      // suppress expected diagnostic output for the no-idField branch this block intentionally triggers
      vi.spyOn(logManager, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('removes the matching item by id', () => {
      store.pushLocalData([
        { id: 'a', name: 'alpha' },
        { id: 'b', name: 'beta' },
      ]);

      store.deleteLocalData('a');

      expect(store.data()).toEqual([{ id: 'b', name: 'beta' }]);
    });

    it('is a no-op when no item matches the id', () => {
      store.pushLocalData([{ id: 'a', name: 'alpha' }]);

      store.deleteLocalData('missing');

      expect(store.data()).toEqual([{ id: 'a', name: 'alpha' }]);
    });

    it('is a no-op when no idField is configured', () => {
      const idLessStore = new TestDataStore<TestItem>(undefined);
      idLessStore.pushLocalData([{ id: 'a', name: 'alpha' }]);

      idLessStore.deleteLocalData('a');

      expect(idLessStore.data()).toEqual([{ id: 'a', name: 'alpha' }]);
    });
  });

  describe('setLocalData', () => {
    it('replaces the entire data array', () => {
      store.pushLocalData([{ id: 'a', name: 'alpha' }]);

      store.setLocalData([
        { id: 'b', name: 'beta' },
        { id: 'c', name: 'charlie' },
      ]);

      expect(store.data()).toEqual([
        { id: 'b', name: 'beta' },
        { id: 'c', name: 'charlie' },
      ]);
    });

    it('accepts an empty array', () => {
      store.pushLocalData([{ id: 'a', name: 'alpha' }]);

      store.setLocalData([]);

      expect(store.data()).toEqual([]);
    });
  });

  describe('setLocalMeta', () => {
    it('replaces the meta value', () => {
      const meta: ResponseMeta = { totalItemCount: 42, currentPage: 2 };

      store.setLocalMeta(meta);

      expect(store.meta()).toEqual(meta);
    });

    it('accepts undefined to clear the meta', () => {
      store.setLocalMeta({ totalItemCount: 1 });

      store.setLocalMeta(undefined);

      expect(store.meta()).toBeUndefined();
    });
  });

  describe('setError', () => {
    it('sets the top-level error when no key is provided', () => {
      store.setError('something broke');

      expect(store.error()).toBe('something broke');
      expect(store.errors()).toEqual({});
    });

    it('sets a keyed error and leaves the top-level error untouched', () => {
      store.setError('field error', 'fieldA');

      expect(store.error()).toBeNull();
      expect(store.errors()).toEqual({ fieldA: 'field error' });
    });

    it('accumulates multiple keyed errors', () => {
      store.setError('error a', 'fieldA');
      store.setError('error b', 'fieldB');

      expect(store.errors()).toEqual({ fieldA: 'error a', fieldB: 'error b' });
    });
  });

  describe('clearError', () => {
    it('clears the top-level error when no key is provided', () => {
      store.setError('boom');

      store.clearError();

      expect(store.error()).toBeNull();
    });

    it('clears a keyed error without clearing the top-level error', () => {
      store.setError('top-level boom');
      store.setError('field error', 'fieldA');

      store.clearError('fieldA');

      expect(store.error()).toBe('top-level boom');
      expect(store.errors()).toEqual({ fieldA: null });
    });
  });

  describe('clearErrors', () => {
    it('clears all keyed errors and the top-level error', () => {
      store.setError('top-level');
      store.setError('field error a', 'fieldA');
      store.setError('field error b', 'fieldB');

      store.clearErrors();

      expect(store.error()).toBeNull();
      expect(store.errors()).toEqual({});
    });
  });

  describe('markAsStale / markAsFresh', () => {
    it('markAsStale flips isStale to true', () => {
      store.markAsStale();

      expect(store.isStale()).toBe(true);
    });

    it('markAsFresh flips isStale back to false', () => {
      store.markAsStale();

      store.markAsFresh();

      expect(store.isStale()).toBe(false);
    });
  });
});
