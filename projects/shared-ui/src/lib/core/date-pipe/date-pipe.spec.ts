import { DateTime } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DateFormat, TimeFormat } from '@organization/shared-utils';

import { DATE_PIPE_INVALID_PLACEHOLDER, DatePipe } from './date-pipe';

describe('DatePipe', () => {
  let pipe: DatePipe;

  beforeEach(() => {
    pipe = new DatePipe();
  });

  describe('invalid input', () => {
    it('returns the placeholder when the date is null', () => {
      expect(pipe.transform(null)).toBe(DATE_PIPE_INVALID_PLACEHOLDER);
    });

    it('returns the placeholder when the date is undefined', () => {
      expect(pipe.transform(undefined)).toBe(DATE_PIPE_INVALID_PLACEHOLDER);
    });

    it('returns the placeholder when the DateTime is invalid', () => {
      const invalid = DateTime.invalid('test invalid');

      expect(pipe.transform(invalid)).toBe(DATE_PIPE_INVALID_PLACEHOLDER);
    });

    it('returns the placeholder for invalid input even when relative is true', () => {
      expect(pipe.transform(null, { relative: true })).toBe(DATE_PIPE_INVALID_PLACEHOLDER);
    });
  });

  describe('date formatting without time', () => {
    const sampleDate = DateTime.fromISO('2024-03-15T14:30:00', { zone: 'America/New_York' });

    it('applies the standard date format by default when no options are provided', () => {
      expect(pipe.transform(sampleDate)).toBe('3/15/24');
    });

    it('applies the standard date format by default when an empty options object is provided', () => {
      expect(pipe.transform(sampleDate, {})).toBe('3/15/24');
    });

    it('applies a custom MONTH_YEAR date format', () => {
      expect(pipe.transform(sampleDate, { dateFormat: DateFormat.MONTH_YEAR })).toBe('Mar 2024');
    });

    it('applies a custom SQL date format', () => {
      expect(pipe.transform(sampleDate, { dateFormat: DateFormat.SQL })).toBe('2024-03-15');
    });

    it('applies a custom DAY date format', () => {
      expect(pipe.transform(sampleDate, { dateFormat: DateFormat.DAY })).toBe('15');
    });

    it('omits time when timeFormat is null', () => {
      expect(pipe.transform(sampleDate, { timeFormat: null })).toBe('3/15/24');
    });
  });

  describe('date formatting with time', () => {
    const sampleDate = DateTime.fromISO('2024-03-15T14:30:00', { zone: 'America/New_York' });

    it('includes the timezone by default when timeFormat is provided', () => {
      expect(pipe.transform(sampleDate, { timeFormat: TimeFormat.STANDARD })).toBe('3/15/24 2:30 PM EDT');
    });

    it('omits the timezone when showTimezone is false', () => {
      expect(pipe.transform(sampleDate, { timeFormat: TimeFormat.STANDARD, showTimezone: false })).toBe(
        '3/15/24 2:30 PM'
      );
    });

    it('includes the timezone when showTimezone is explicitly true', () => {
      expect(pipe.transform(sampleDate, { timeFormat: TimeFormat.STANDARD, showTimezone: true })).toBe(
        '3/15/24 2:30 PM EDT'
      );
    });

    it('supports the STANDARD_WITH_SECONDS time format', () => {
      expect(pipe.transform(sampleDate, { timeFormat: TimeFormat.STANDARD_WITH_SECONDS, showTimezone: false })).toBe(
        '3/15/24 2:30:00 PM'
      );
    });

    it('supports the SQL time format', () => {
      expect(pipe.transform(sampleDate, { timeFormat: TimeFormat.SQL, showTimezone: false })).toBe('3/15/24 14:30:00');
    });

    it('combines a custom dateFormat with a timeFormat', () => {
      expect(
        pipe.transform(sampleDate, {
          dateFormat: DateFormat.SQL,
          timeFormat: TimeFormat.SQL,
          showTimezone: false,
        })
      ).toBe('2024-03-15 14:30:00');
    });
  });

  describe('relative mode', () => {
    const fixedNow = new Date('2026-04-19T12:00:00.000Z');

    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(fixedNow);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns "moments ago" when the date is 30 seconds in the past', () => {
      const past = DateTime.fromJSDate(fixedNow).minus({ seconds: 30 });

      expect(pipe.transform(past, { relative: true })).toBe('moments ago');
    });

    it('returns "in moments" when the date is 30 seconds in the future', () => {
      const future = DateTime.fromJSDate(fixedNow).plus({ seconds: 30 });

      expect(pipe.transform(future, { relative: true })).toBe('in moments');
    });

    it('returns the luxon relative string for past dates beyond one minute', () => {
      const past = DateTime.fromJSDate(fixedNow).minus({ minutes: 5 });

      expect(pipe.transform(past, { relative: true })).toBe('5 minutes ago');
    });

    it('returns the luxon relative string for future dates beyond one minute', () => {
      const future = DateTime.fromJSDate(fixedNow).plus({ minutes: 5 });

      expect(pipe.transform(future, { relative: true })).toBe('in 5 minutes');
    });

    it('ignores dateFormat, timeFormat, and showTimezone when relative is true', () => {
      const past = DateTime.fromJSDate(fixedNow).minus({ minutes: 5 });

      expect(
        pipe.transform(past, {
          relative: true,
          dateFormat: DateFormat.SQL,
          timeFormat: TimeFormat.STANDARD,
          showTimezone: true,
        })
      ).toBe('5 minutes ago');
    });
  });
});
