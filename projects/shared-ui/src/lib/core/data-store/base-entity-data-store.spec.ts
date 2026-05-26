import { beforeEach, describe, expect, it } from 'vitest';
import { BaseEntityDataStore } from './base-entity-data-store';

type TestEntity = {
  id: string;
  name: string;
};

type TestEntityMeta = {
  fetchedAt: string;
};

class TestEntityDataStore<T, TMeta = unknown> extends BaseEntityDataStore<T, TMeta> {}

describe('BaseEntityDataStore', () => {
  let store: TestEntityDataStore<TestEntity, TestEntityMeta>;

  beforeEach(() => {
    store = new TestEntityDataStore<TestEntity, TestEntityMeta>();
  });

  describe('initial state', () => {
    it('exposes undefined data', () => {
      expect(store.data()).toBeUndefined();
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

    it('reports mutationState idle', () => {
      expect(store.mutationState()).toBe('idle');
    });
  });

  describe('reset', () => {
    it('returns the store to its default state after mutations', () => {
      store.setLocalData({ id: 'a', name: 'alpha' });
      store.setLocalMeta({ fetchedAt: '2026-05-25' });
      store.setError('boom');
      store.setError('field error', 'fieldA');
      store.markAsStale();

      store.reset();

      expect(store.data()).toBeUndefined();
      expect(store.meta()).toBeUndefined();
      expect(store.error()).toBeNull();
      expect(store.errors()).toEqual({});
      expect(store.isStale()).toBe(false);
      expect(store.loadingState()).toBe('uninitialized');
    });
  });

  describe('updateLocalData', () => {
    it('replaces the entity data', () => {
      store.setLocalData({ id: 'a', name: 'alpha' });

      store.updateLocalData({ id: 'a', name: 'alpha-updated' });

      expect(store.data()).toEqual({ id: 'a', name: 'alpha-updated' });
    });

    it('works as the first write when no data exists yet', () => {
      store.updateLocalData({ id: 'a', name: 'alpha' });

      expect(store.data()).toEqual({ id: 'a', name: 'alpha' });
    });
  });

  describe('setLocalData', () => {
    it('replaces the entity data', () => {
      store.setLocalData({ id: 'a', name: 'alpha' });

      expect(store.data()).toEqual({ id: 'a', name: 'alpha' });
    });

    it('accepts undefined to clear the entity', () => {
      store.setLocalData({ id: 'a', name: 'alpha' });

      store.setLocalData(undefined);

      expect(store.data()).toBeUndefined();
    });
  });

  describe('setLocalMeta', () => {
    it('replaces the meta value', () => {
      store.setLocalMeta({ fetchedAt: '2026-05-25' });

      expect(store.meta()).toEqual({ fetchedAt: '2026-05-25' });
    });

    it('accepts undefined to clear the meta', () => {
      store.setLocalMeta({ fetchedAt: '2026-05-25' });

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
