/**
 * Transforms a `null` value to `undefined` while passing every other value through unchanged. Intended for use as the
 * `transform` option on Angular `input()` declarations so that callers may pass `null` (e.g. from a reactive form
 * control's value) but the resolved input type can be `T | undefined` only.
 */
const transformNullToUndefined = <T>(value: T | null | undefined): T | undefined => {
  return value ?? undefined;
};

export const angularUtils = {
  transformNullToUndefined,
};
