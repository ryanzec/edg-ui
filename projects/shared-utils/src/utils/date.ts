import { DateTime, Settings } from 'luxon';

export const TimezoneFormat = {
  STANDARD: 'ZZZZ',
} as const;

export type TimezoneFormat = (typeof TimezoneFormat)[keyof typeof TimezoneFormat];

export const DateFormat = {
  STANDARD: 'M/d/yy',
  STANDARD_TIMEZONE: `M/d/yy ${TimezoneFormat.STANDARD}`,
  COMPARE: 'yyyyLLdd',
  MONTH_YEAR: 'LLL yyyy',
  DAY: 'd',
  SQL: 'yyyy-MM-dd',
} as const;

export type DateFormat = (typeof DateFormat)[keyof typeof DateFormat];

export const TimeFormat = {
  STANDARD: 'h:mm a',
  STANDARD_TIMEZONE: `h:mm a ${TimezoneFormat.STANDARD}`,
  STANDARD_WITH_SECONDS: 'h:mm:ss a',
  STANDARD_WITH_SECONDS_TIMEZONE: `h:mm:ss a ${TimezoneFormat.STANDARD}`,
  SQL: 'HH:mm:ss',
} as const;

export type TimeFormat = (typeof TimeFormat)[keyof typeof TimeFormat];

export const DateTimeFormat = {
  STANDARD: `${DateFormat.STANDARD} ${TimeFormat.STANDARD}`,
  STANDARD_TIMEZONE: `${DateFormat.STANDARD} ${TimeFormat.STANDARD_TIMEZONE}`,
  STANDARD_WITH_SECONDS: `${DateFormat.STANDARD} ${TimeFormat.STANDARD_WITH_SECONDS}`,
  STANDARD_WITH_SECONDS_TIMEZONE: `${DateFormat.STANDARD} ${TimeFormat.STANDARD_WITH_SECONDS_TIMEZONE}`,
  SQL: `${DateFormat.SQL} ${TimeFormat.SQL}`,
} as const;

export type DateTimeFormat = (typeof DateTimeFormat)[keyof typeof DateTimeFormat];

const getDaysBetweenDates = (startDate: DateTime, endDate: DateTime) => {
  return endDate.diff(startDate, 'days').days + 1;
};

const configureTimezone = (timezone: string) => {
  Settings.defaultZone = timezone;

  // since firefox does not support weekinfo for intl locale, we are just going to force sun -> sat as the week for
  // all users until we decide it is worth the effort to address (or Firefox support this) or just make this
  // configurable on by the user
  Settings.defaultWeekSettings = { firstDay: 7, minimalDays: 1, weekend: [6, 7] };
};

export type ConvertLocalToUTCOptions = {
  keepLocalTime?: boolean;
};

const defaultConvertLocalToUTCOptions: ConvertLocalToUTCOptions = {
  keepLocalTime: false,
};

/**
 * Converts a native Date's local wall-clock components into a UTC DateTime with the same
 * year/month/day/hour/minute/second/millisecond values (e.g., local `2020-01-01T12:23:34-0400`
 * becomes `2020-01-01T12:23:34Z`). Returns `----` if the date is invalid.
 */
const convertLocalToUTC = (date: Date, options: ConvertLocalToUTCOptions = {}): DateTime | '----' => {
  const finalOptions = { ...defaultConvertLocalToUTCOptions, ...options };

  if (Number.isNaN(date.getTime())) {
    return '----';
  }

  if (finalOptions.keepLocalTime) {
    return DateTime.utc(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );
  }

  return DateTime.fromJSDate(date).setZone('utc', { keepLocalTime: false });
};

/**
 * Returns a human-readable relative time string (e.g., "5 minutes ago", "in 3 days") for the given date time.
 * When the difference is within one minute, returns `moments ago` (past) or `in moments` (future).
 * Returns `----` if the date time is invalid or a relative string cannot be generated.
 */
const fromNow = (dateTime: DateTime): string => {
  if (!dateTime.isValid) {
    return '----';
  }

  const diffInMinutes = dateTime.diffNow('minutes').minutes;

  if (diffInMinutes > -1 && diffInMinutes <= 0) {
    return 'moments ago';
  }

  if (diffInMinutes > 0 && diffInMinutes <= 1) {
    return 'in moments';
  }

  return dateTime.toRelative() ?? '----';
};

export const dateUtils = {
  configureTimezone,
  convertLocalToUTC,
  fromNow,
  getDaysBetweenDates,
};
