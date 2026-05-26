import { beforeEach, describe, expect, it } from 'vitest';
import { ResponseMeta } from '@organization/shared-utils';
import { BaseCursorDataStore } from './base-cursor-data-store';

type TestItem = {
  id: string;
  name: string;
};

class TestCursorDataStore extends BaseCursorDataStore<TestItem> {}

describe('BaseCursorDataStore', () => {
  describe('constructor', () => {
    it('applies built-in defaults when no overrides are provided', () => {
      const store = new TestCursorDataStore('id');

      expect(store.currentCursor()).toBeNull();
      expect(store.nextCursor()).toBeNull();
      expect(store.previousCursor()).toBeNull();
      expect(store.limit()).toBe(10);
      expect(store.totalItemCount()).toBe(0);
    });

    it('applies provided override values', () => {
      const store = new TestCursorDataStore('id', {
        currentCursor: 'cursor-current',
        nextCursor: 'cursor-next',
        previousCursor: 'cursor-prev',
        limit: 25,
        totalItemCount: 100,
      });

      expect(store.currentCursor()).toBe('cursor-current');
      expect(store.nextCursor()).toBe('cursor-next');
      expect(store.previousCursor()).toBe('cursor-prev');
      expect(store.limit()).toBe(25);
      expect(store.totalItemCount()).toBe(100);
    });

    it('partial overrides fall back to defaults for omitted fields', () => {
      const store = new TestCursorDataStore('id', { limit: 50 });

      expect(store.limit()).toBe(50);
      expect(store.currentCursor()).toBeNull();
      expect(store.nextCursor()).toBeNull();
      expect(store.previousCursor()).toBeNull();
      expect(store.totalItemCount()).toBe(0);
    });

    it('accepts an undefined idField', () => {
      const store = new TestCursorDataStore(undefined);

      expect(store.currentCursor()).toBeNull();
    });
  });

  describe('hasNext / hasPrevious', () => {
    it('hasNext is false when nextCursor is null', () => {
      const store = new TestCursorDataStore('id');

      expect(store.hasNext()).toBe(false);
    });

    it('hasNext is true when nextCursor is set', () => {
      const store = new TestCursorDataStore('id', { nextCursor: 'cursor-next' });

      expect(store.hasNext()).toBe(true);
    });

    it('hasPrevious is false when previousCursor is null', () => {
      const store = new TestCursorDataStore('id');

      expect(store.hasPrevious()).toBe(false);
    });

    it('hasPrevious is true when previousCursor is set', () => {
      const store = new TestCursorDataStore('id', { previousCursor: 'cursor-prev' });

      expect(store.hasPrevious()).toBe(true);
    });
  });

  describe('setLocalMeta', () => {
    let store: TestCursorDataStore;

    beforeEach(() => {
      store = new TestCursorDataStore('id');
    });

    it('updates cursor state from response metadata', () => {
      const meta = {
        currentCursor: 'cursor-current',
        nextCursor: 'cursor-next',
        previousCursor: 'cursor-prev',
        itemsPerPage: 20,
        totalItemCount: 80,
      } as ResponseMeta;

      store.setLocalMeta(meta);

      expect(store.currentCursor()).toBe('cursor-current');
      expect(store.nextCursor()).toBe('cursor-next');
      expect(store.previousCursor()).toBe('cursor-prev');
      expect(store.limit()).toBe(20);
      expect(store.totalItemCount()).toBe(80);
    });

    it('forwards the meta to the base data store', () => {
      const meta = {
        nextCursor: 'cursor-next',
        itemsPerPage: 20,
        totalItemCount: 80,
      } as ResponseMeta;

      store.setLocalMeta(meta);

      expect(store.meta()).toEqual(meta);
    });

    it('falls back to defaults when meta fields are missing', () => {
      store.setLocalMeta({});

      expect(store.currentCursor()).toBeNull();
      expect(store.nextCursor()).toBeNull();
      expect(store.previousCursor()).toBeNull();
      expect(store.limit()).toBe(10);
      expect(store.totalItemCount()).toBe(0);
    });

    it('falls back to defaults when meta is undefined', () => {
      store.setLocalMeta({
        nextCursor: 'cursor-next',
        itemsPerPage: 20,
        totalItemCount: 80,
      } as ResponseMeta);

      store.setLocalMeta(undefined);

      expect(store.currentCursor()).toBeNull();
      expect(store.nextCursor()).toBeNull();
      expect(store.previousCursor()).toBeNull();
      expect(store.limit()).toBe(10);
      expect(store.totalItemCount()).toBe(0);
      expect(store.meta()).toBeUndefined();
    });

    it('reflects updated cursors through hasNext / hasPrevious', () => {
      store.setLocalMeta({
        nextCursor: 'cursor-next',
        previousCursor: 'cursor-prev',
      } as ResponseMeta);

      expect(store.hasNext()).toBe(true);
      expect(store.hasPrevious()).toBe(true);
    });
  });

  describe('reset', () => {
    it('resets cursor state back to defaults', () => {
      const store = new TestCursorDataStore('id');
      store.setLocalMeta({
        currentCursor: 'cursor-current',
        nextCursor: 'cursor-next',
        previousCursor: 'cursor-prev',
        itemsPerPage: 20,
        totalItemCount: 80,
      } as ResponseMeta);

      store.reset();

      expect(store.currentCursor()).toBeNull();
      expect(store.nextCursor()).toBeNull();
      expect(store.previousCursor()).toBeNull();
      expect(store.limit()).toBe(10);
      expect(store.totalItemCount()).toBe(0);
    });

    it('also resets the inherited base data store state', () => {
      const store = new TestCursorDataStore('id');
      store.pushLocalData([{ id: 'a', name: 'alpha' }]);
      store.setError('boom');

      store.reset();

      expect(store.data()).toEqual([]);
      expect(store.error()).toBeNull();
    });
  });
});
