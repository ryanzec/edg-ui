import { describe, expect, it } from 'vitest';

import { angularUtils } from './angular';

describe('angularUtils', () => {
  describe('transformNullToUndefined', () => {
    it('returns `undefined` when the value is `null`', () => {
      expect(angularUtils.transformNullToUndefined(null)).toBeUndefined();
    });

    it('returns `undefined` when the value is `undefined`', () => {
      expect(angularUtils.transformNullToUndefined(undefined)).toBeUndefined();
    });

    it('returns the value unchanged when the value is a non-empty string', () => {
      expect(angularUtils.transformNullToUndefined('hello')).toBe('hello');
    });

    it('returns the value unchanged when the value is an empty string', () => {
      expect(angularUtils.transformNullToUndefined('')).toBe('');
    });

    it('returns the value unchanged when the value is the number `0`', () => {
      expect(angularUtils.transformNullToUndefined(0)).toBe(0);
    });

    it('returns the value unchanged when the value is a positive number', () => {
      expect(angularUtils.transformNullToUndefined(42)).toBe(42);
    });

    it('returns the value unchanged when the value is `false`', () => {
      expect(angularUtils.transformNullToUndefined(false)).toBe(false);
    });

    it('returns the value unchanged when the value is `true`', () => {
      expect(angularUtils.transformNullToUndefined(true)).toBe(true);
    });

    it('returns the value unchanged when the value is an object reference', () => {
      const value = { foo: 'bar' };

      expect(angularUtils.transformNullToUndefined(value)).toBe(value);
    });

    it('returns the value unchanged when the value is an array reference', () => {
      const value = [1, 2, 3];

      expect(angularUtils.transformNullToUndefined(value)).toBe(value);
    });
  });
});
