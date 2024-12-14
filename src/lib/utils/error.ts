export const DEFAULT_ERROR_MESSAGE = 'Something went wrong, please try again later.';

export enum HttpStatusCode {
  UNAUTHORIZED = 401,
  RATE_LIMITED = 429,
  INTERNAL_ERROR = 500,
  FORBIDDEN = 403,
}

export const httpStatusCodeMessage: Record<HttpStatusCode, string> = {
  [HttpStatusCode.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatusCode.RATE_LIMITED]: 'Too Many Requests',
  [HttpStatusCode.INTERNAL_ERROR]: 'Unknown Error Occurred',
  [HttpStatusCode.FORBIDDEN]: 'Forbidden',
};

// this can be able data so it needs to support any

export type HttpErrorContext = Record<string, any>;

export type HttpErrorOptions = {
  message?: string;
  context?: HttpErrorContext;
};

// using a class here as it seems to be standard practice for errors
export class HttpError extends Error {
  statusCode: number;

  context: HttpErrorContext;

  constructor(statusCode: HttpStatusCode, options: HttpErrorOptions = {}) {
    super(options.message ?? httpStatusCodeMessage[statusCode]);

    this.statusCode = statusCode;
    this.context = options.context ?? {};
  }
}
