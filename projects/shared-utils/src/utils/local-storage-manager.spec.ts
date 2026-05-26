import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { localStorageManager } from './local-storage-manager';

describe('localStorageManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('get', () => {
    it('returns undefined when the key is undefined', () => {
      expect(localStorageManager.get(undefined)).toBeUndefined();
    });

    it('returns undefined when the key has no entry', () => {
      expect(localStorageManager.get('missing')).toBeUndefined();
    });

    it('returns the stored value when present and not expired', () => {
      localStorageManager.set('user', { id: 1, name: 'rz' });

      expect(localStorageManager.get<{ id: number; name: string }>('user')).toEqual({ id: 1, name: 'rz' });
    });

    it('returns the value when the stored entry has no expiration', () => {
      localStorage.setItem('forever', JSON.stringify({ value: 'kept', expires: null }));

      expect(localStorageManager.get<string>('forever')).toBe('kept');
    });

    it('removes the entry and returns undefined when expired', () => {
      const past = new Date().getTime() - 1000;

      localStorage.setItem('expired', JSON.stringify({ value: 'gone', expires: past }));

      expect(localStorageManager.get('expired')).toBeUndefined();
      expect(localStorage.getItem('expired')).toBeNull();
    });

    it('removes the entry and returns undefined when the raw value is not valid JSON', () => {
      localStorage.setItem('corrupt', '{not json');

      expect(localStorageManager.get('corrupt')).toBeUndefined();
      expect(localStorage.getItem('corrupt')).toBeNull();
    });
  });

  describe('set', () => {
    it('is a no-op when the key is undefined', () => {
      localStorageManager.set(undefined, 'value');

      expect(localStorage.length).toBe(0);
    });

    it('stores a value with a null expiration when no ttl is provided', () => {
      localStorageManager.set('key', 'value');

      const raw = localStorage.getItem('key');

      expect(raw).not.toBeNull();
      expect(JSON.parse(raw as string)).toEqual({ value: 'value', expires: null });
    });

    it('stores a value with a future expiration when a positive ttl is provided', () => {
      const now = 1_000_000;

      vi.useFakeTimers();
      vi.setSystemTime(new Date(now));

      localStorageManager.set('key', 'value', 5000);

      const raw = localStorage.getItem('key');

      expect(JSON.parse(raw as string)).toEqual({ value: 'value', expires: now + 5000 });

      vi.useRealTimers();
    });

    it('stores a value with a null expiration when ttl is zero', () => {
      localStorageManager.set('key', 'value', 0);

      const raw = localStorage.getItem('key');

      expect(JSON.parse(raw as string).expires).toBeNull();
    });

    it('does not throw when the value cannot be serialized', () => {
      const circular: Record<string, unknown> = {};

      circular.self = circular;

      expect(() => localStorageManager.set('circular', circular)).not.toThrow();
      expect(localStorage.getItem('circular')).toBeNull();
    });
  });

  describe('remove', () => {
    it('removes a stored entry', () => {
      localStorageManager.set('key', 'value');
      localStorageManager.remove('key');

      expect(localStorage.getItem('key')).toBeNull();
    });

    it('is a no-op when the key is undefined', () => {
      localStorageManager.set('key', 'value');
      localStorageManager.remove(undefined);

      expect(localStorage.getItem('key')).not.toBeNull();
    });
  });

  describe('clear', () => {
    it('removes every entry', () => {
      localStorageManager.set('a', 1);
      localStorageManager.set('b', 2);

      localStorageManager.clear();

      expect(localStorage.length).toBe(0);
    });
  });

  describe('has', () => {
    it('returns true when the entry exists and is not expired', () => {
      localStorageManager.set('key', 'value');

      expect(localStorageManager.has('key')).toBe(true);
    });

    it('returns false when the entry does not exist', () => {
      expect(localStorageManager.has('missing')).toBe(false);
    });

    it('returns false when the entry has expired', () => {
      const past = new Date().getTime() - 1000;

      localStorage.setItem('expired', JSON.stringify({ value: 'gone', expires: past }));

      expect(localStorageManager.has('expired')).toBe(false);
    });

    it('returns false when the key is undefined', () => {
      expect(localStorageManager.has(undefined)).toBe(false);
    });
  });

  describe('getAllKeys', () => {
    it('returns an empty array when storage is empty', () => {
      expect(localStorageManager.getAllKeys()).toEqual([]);
    });

    it('returns every stored key', () => {
      localStorageManager.set('a', 1);
      localStorageManager.set('b', 2);

      expect(localStorageManager.getAllKeys().sort()).toEqual(['a', 'b']);
    });
  });

  describe('size', () => {
    it('returns 0 when storage is empty', () => {
      expect(localStorageManager.size()).toBe(0);
    });

    it('returns the number of stored entries', () => {
      localStorageManager.set('a', 1);
      localStorageManager.set('b', 2);
      localStorageManager.set('c', 3);

      expect(localStorageManager.size()).toBe(3);
    });
  });

  afterEach(() => {
    localStorage.clear();
  });
});
