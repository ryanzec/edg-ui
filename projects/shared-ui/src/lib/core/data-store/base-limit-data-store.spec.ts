import { beforeEach, describe, expect, it } from 'vitest';
import { BaseLimitDataStore } from './base-limit-data-store';

type TestItem = {
  id: string;
  name: string;
};

class TestLimitDataStore extends BaseLimitDataStore<TestItem> {}

describe('BaseLimitDataStore', () => {
  describe('constructor', () => {
    it('applies built-in defaults when no overrides are provided', () => {
      const store = new TestLimitDataStore('id');

      expect(store.offset()).toBe(0);
      expect(store.limit()).toBe(10);
      expect(store.totalItemCount()).toBe(0);
      expect(store.currentPage()).toBe(1);
    });

    it('applies provided override values', () => {
      const store = new TestLimitDataStore('id', {
        offset: 50,
        limit: 25,
        totalItemCount: 200,
        currentPage: 3,
      });

      expect(store.offset()).toBe(50);
      expect(store.limit()).toBe(25);
      expect(store.totalItemCount()).toBe(200);
      expect(store.currentPage()).toBe(3);
    });

    it('partial overrides fall back to defaults for omitted fields', () => {
      const store = new TestLimitDataStore('id', { limit: 50 });

      expect(store.limit()).toBe(50);
      expect(store.offset()).toBe(0);
      expect(store.totalItemCount()).toBe(0);
      expect(store.currentPage()).toBe(1);
    });
  });

  describe('totalPages', () => {
    it('is 0 when there are no items', () => {
      const store = new TestLimitDataStore('id');

      expect(store.totalPages()).toBe(0);
    });

    it('divides cleanly when totalItemCount is a multiple of limit', () => {
      const store = new TestLimitDataStore('id', { limit: 10, totalItemCount: 50 });

      expect(store.totalPages()).toBe(5);
    });

    it('rounds up when the last page is partial', () => {
      const store = new TestLimitDataStore('id', { limit: 10, totalItemCount: 55 });

      expect(store.totalPages()).toBe(6);
    });

    it('returns 1 when totalItemCount is less than limit', () => {
      const store = new TestLimitDataStore('id', { limit: 10, totalItemCount: 3 });

      expect(store.totalPages()).toBe(1);
    });
  });

  describe('setLocalMeta', () => {
    let store: TestLimitDataStore;

    beforeEach(() => {
      store = new TestLimitDataStore('id');
    });

    it('updates the pagination state from response metadata', () => {
      store.setLocalMeta({
        offset: 30,
        itemsPerPage: 15,
        totalItemCount: 120,
        currentPage: 3,
      });

      expect(store.offset()).toBe(30);
      expect(store.limit()).toBe(15);
      expect(store.totalItemCount()).toBe(120);
      expect(store.currentPage()).toBe(3);
    });

    it('forwards the meta to the base data store', () => {
      const meta = {
        offset: 30,
        itemsPerPage: 15,
        totalItemCount: 120,
        currentPage: 3,
      };

      store.setLocalMeta(meta);

      expect(store.meta()).toEqual(meta);
    });

    it('falls back to defaults when meta fields are missing', () => {
      store.setLocalMeta({});

      expect(store.offset()).toBe(0);
      expect(store.limit()).toBe(10);
      expect(store.totalItemCount()).toBe(0);
      expect(store.currentPage()).toBe(1);
    });

    it('falls back to defaults when meta is undefined', () => {
      store.setLocalMeta({ offset: 30, itemsPerPage: 15, totalItemCount: 120, currentPage: 3 });

      store.setLocalMeta(undefined);

      expect(store.offset()).toBe(0);
      expect(store.limit()).toBe(10);
      expect(store.totalItemCount()).toBe(0);
      expect(store.currentPage()).toBe(1);
      expect(store.meta()).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('resets pagination state back to defaults', () => {
      const store = new TestLimitDataStore('id');
      store.setLocalMeta({
        offset: 30,
        itemsPerPage: 15,
        totalItemCount: 120,
        currentPage: 3,
      });

      store.reset();

      expect(store.offset()).toBe(0);
      expect(store.limit()).toBe(10);
      expect(store.totalItemCount()).toBe(0);
      expect(store.currentPage()).toBe(1);
    });

    it('also resets the inherited base data store state', () => {
      const store = new TestLimitDataStore('id');
      store.pushLocalData([{ id: 'a', name: 'alpha' }]);
      store.setError('boom');

      store.reset();

      expect(store.data()).toEqual([]);
      expect(store.error()).toBeNull();
    });
  });
});
