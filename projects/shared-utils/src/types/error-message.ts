export const DEFAULT_ERROR_MESSAGE = 'Something went wrong, please try again later.';

export const ErrorMessage = {
  UNKNOWN: 'An unknown error occurred',
  UNAUTHENTICATED: 'unable to authenticate',
  AUTHENTICATION_EXPIRED: 'Logged in session expired',
} as const;

export type ErrorMessage = (typeof ErrorMessage)[keyof typeof ErrorMessage];
