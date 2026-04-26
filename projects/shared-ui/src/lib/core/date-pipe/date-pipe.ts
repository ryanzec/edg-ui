import { Pipe, type PipeTransform } from '@angular/core';
import { type DateTime } from 'luxon';
import { DateFormat, dateUtils, type TimeFormat } from '@organization/shared-utils';

/** default value for the dateFormat option */
export const DATE_PIPE_DATE_FORMAT_DEFAULT: DateFormat = DateFormat.STANDARD;

/** default value for the timeFormat option */
export const DATE_PIPE_TIME_FORMAT_DEFAULT: TimeFormat | null = null;

/** default value for the showTimezone option */
export const DATE_PIPE_SHOW_TIMEZONE_DEFAULT = true;

/** default value for the relative option */
export const DATE_PIPE_RELATIVE_DEFAULT = false;

/** placeholder rendered when the given date is null, undefined, or invalid */
export const DATE_PIPE_INVALID_PLACEHOLDER = '----';

/** options accepted by the orgDate pipe */
export type DatePipeOptions = {
  dateFormat?: DateFormat;
  timeFormat?: TimeFormat | null;
  showTimezone?: boolean;
  relative?: boolean;
};

/** formats a luxon DateTime into a human readable date string */
@Pipe({
  name: 'orgDate',
  pure: true,
})
export class DatePipe implements PipeTransform {
  /**
   * transforms a luxon DateTime into a formatted date string using the provided options
   * returns a placeholder for null, undefined, or invalid dates
   * when `relative` is true, returns a relative time string via `dateUtils.fromNow()` and all other
   * formatting options are ignored
   */
  public transform(date: DateTime | null | undefined, options?: DatePipeOptions): string {
    if (!date || !date.isValid) {
      return DATE_PIPE_INVALID_PLACEHOLDER;
    }

    const relative = options?.relative ?? DATE_PIPE_RELATIVE_DEFAULT;

    if (relative) {
      return dateUtils.fromNow(date);
    }

    const dateFormat = options?.dateFormat ?? DATE_PIPE_DATE_FORMAT_DEFAULT;
    const timeFormat = options?.timeFormat ?? DATE_PIPE_TIME_FORMAT_DEFAULT;
    const showTimezone = options?.showTimezone ?? DATE_PIPE_SHOW_TIMEZONE_DEFAULT;

    const dateString = date.toFormat(dateFormat);

    if (!timeFormat) {
      return dateString;
    }

    let timeString = date.toFormat(timeFormat);

    if (showTimezone) {
      timeString += ` ${date.toFormat('ZZZZ')}`;
    }

    return `${dateString} ${timeString}`;
  }
}
