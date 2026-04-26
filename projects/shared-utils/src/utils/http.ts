import { HttpParams } from '@angular/common/http';
import { logManager } from './log-manager';

/**
 * builds http params from an object, filtering out undefined and null values
 * arrays are converted to comma-separated strings
 * objects are logged as errors and skipped
 */
const buildHttpParams = (params: Record<string, unknown>): HttpParams => {
  let httpParams = new HttpParams();

  Object.keys(params).forEach((key) => {
    const value = params[key];

    if (value === undefined || value === null) {
      return;
    }

    // check if value is an array
    if (Array.isArray(value)) {
      httpParams = httpParams.set(key, value.join(','));

      return;
    }

    // check if value is an object (but not an array or null)
    if (typeof value === 'object') {
      logManager.error(`buildHttpParams: object values are not supported for key "${key}"`, value);

      return;
    }

    httpParams = httpParams.set(key, String(value));
  });

  return httpParams;
};

export const httpUtils = {
  buildHttpParams,
};
