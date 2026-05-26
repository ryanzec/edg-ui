import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SortingStore } from './sorting-store';

describe('SortingStore', () => {
  let store: SortingStore;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SortingStore] });
    store = TestBed.inject(SortingStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('initial state', () => {
    it('exposes a null key', () => {
      expect(store.key()).toBeNull();
    });

    it('exposes a null direction', () => {
      expect(store.direction()).toBeNull();
    });

    it('reports isSorting as false', () => {
      expect(store.isSorting()).toBe(false);
    });
  });

  describe('setSort', () => {
    it('sets the key and direction when both are provided', () => {
      store.setSort('name', 'asc');

      expect(store.key()).toBe('name');
      expect(store.direction()).toBe('asc');
    });

    it('defaults direction to null when omitted', () => {
      store.setSort('name');

      expect(store.key()).toBe('name');
      expect(store.direction()).toBeNull();
    });

    it('clears direction when key is null even if a direction is passed', () => {
      store.setSort(null, 'asc');

      expect(store.key()).toBeNull();
      expect(store.direction()).toBeNull();
    });

    it('overwrites a previous sort state', () => {
      store.setSort('name', 'asc');
      store.setSort('date', 'desc');

      expect(store.key()).toBe('date');
      expect(store.direction()).toBe('desc');
    });
  });

  describe('toggleSort', () => {
    it('sets direction to asc for a new key', () => {
      store.toggleSort('name');

      expect(store.key()).toBe('name');
      expect(store.direction()).toBe('asc');
    });

    it('resets to asc when switching keys', () => {
      store.toggleSort('name');
      store.toggleSort('name');
      store.toggleSort('date');

      expect(store.key()).toBe('date');
      expect(store.direction()).toBe('asc');
    });

    it('cycles from asc to desc on the same key', () => {
      store.toggleSort('name');
      store.toggleSort('name');

      expect(store.key()).toBe('name');
      expect(store.direction()).toBe('desc');
    });

    it('cycles from desc to null on the same key', () => {
      store.toggleSort('name');
      store.toggleSort('name');
      store.toggleSort('name');

      expect(store.key()).toBe('name');
      expect(store.direction()).toBeNull();
    });

    it('cycles from null direction back to asc on the same key', () => {
      store.setSort('name', null);

      store.toggleSort('name');

      expect(store.key()).toBe('name');
      expect(store.direction()).toBe('asc');
    });
  });

  describe('clearSort', () => {
    it('resets key and direction to null from an active sort state', () => {
      store.setSort('name', 'asc');

      store.clearSort();

      expect(store.key()).toBeNull();
      expect(store.direction()).toBeNull();
    });
  });

  describe('isSorting', () => {
    it('reports true when both key and direction are set', () => {
      store.setSort('name', 'asc');

      expect(store.isSorting()).toBe(true);
    });

    it('reports false when key is set but direction is null', () => {
      store.setSort('name', null);

      expect(store.isSorting()).toBe(false);
    });

    it('reports false after clearSort', () => {
      store.setSort('name', 'asc');
      store.clearSort();

      expect(store.isSorting()).toBe(false);
    });
  });
});
