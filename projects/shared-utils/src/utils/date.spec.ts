import { DateTime } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { dateUtils } from './date';

describe('dateUtils', () => {
  describe('convertLocalToUTC', () => {
    it('returns `----` when the date is invalid', () => {
      const invalidDate = new Date('not-a-date');

      expect(dateUtils.convertLocalToUTC(invalidDate)).toBe('----');
    });

    it('preserves local wall-clock components when converting to UTC', () => {
      const date = new Date('2020-01-01T12:23:34.567-0400');

      const result = dateUtils.convertLocalToUTC(date);

      expect(result).not.toBe('----');

      const dateTime = result as DateTime;

      expect(dateTime.year).toBe(date.getFullYear());
      expect(dateTime.month).toBe(date.getMonth() + 1);
      expect(dateTime.day).toBe(date.getDate());
      expect(dateTime.hour).toBe(date.getHours());
      expect(dateTime.minute).toBe(date.getMinutes());
      expect(dateTime.second).toBe(date.getSeconds());
      expect(dateTime.millisecond).toBe(date.getMilliseconds());
    });

    it('returns a DateTime in the UTC zone', () => {
      const date = new Date('2020-06-15T09:00:00-0500');

      const result = dateUtils.convertLocalToUTC(date) as DateTime;

      expect(result.zoneName).toBe('UTC');
      expect(result.offset).toBe(0);
    });
  });

  describe('fromNow', () => {
    const fixedNow = new Date('2026-04-19T12:00:00.000Z');

    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(fixedNow);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns `----` when the date time is invalid', () => {
      const invalid = DateTime.fromISO('not-a-date');

      expect(dateUtils.fromNow(invalid)).toBe('----');
    });

    it('returns `moments ago` when the date time is exactly now (diff of 0)', () => {
      const now = DateTime.fromJSDate(fixedNow);

      expect(dateUtils.fromNow(now)).toBe('moments ago');
    });

    it('returns `moments ago` when the date time is 30 seconds in the past', () => {
      const past = DateTime.fromJSDate(fixedNow).minus({ seconds: 30 });

      expect(dateUtils.fromNow(past)).toBe('moments ago');
    });

    it('returns `in moments` when the date time is 30 seconds in the future', () => {
      const future = DateTime.fromJSDate(fixedNow).plus({ seconds: 30 });

      expect(dateUtils.fromNow(future)).toBe('in moments');
    });

    it('returns `in moments` when the date time is exactly 1 minute in the future (inclusive boundary)', () => {
      const future = DateTime.fromJSDate(fixedNow).plus({ minutes: 1 });

      expect(dateUtils.fromNow(future)).toBe('in moments');
    });

    it('falls through to luxon `toRelative` when the date time is exactly 1 minute in the past (exclusive boundary)', () => {
      const past = DateTime.fromJSDate(fixedNow).minus({ minutes: 1 });

      expect(dateUtils.fromNow(past)).toBe('1 minute ago');
    });

    it('returns a luxon relative string when the date time is further in the past', () => {
      const past = DateTime.fromJSDate(fixedNow).minus({ minutes: 5 });

      expect(dateUtils.fromNow(past)).toBe('5 minutes ago');
    });

    it('returns a luxon relative string when the date time is further in the future', () => {
      const future = DateTime.fromJSDate(fixedNow).plus({ minutes: 5 });

      expect(dateUtils.fromNow(future)).toBe('in 5 minutes');
    });
  });
});
