import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMessage } from '../types/error-message';

/** the current logging mode of the application */
export type LogMode = 'production' | 'development';

/** options for customizing error message extraction */
export type ErrorMessageOptions = {
  defaultMessage?: string;
  overrideMessage?: string;
};

export type LogLevel = 'log' | 'warn' | 'error';

type LogManagerState = {
  loggingMode: LogMode;
};

class LogManager {
  /** unified internal state */
  private _state: LogManagerState = {
    loggingMode: 'development',
  };

  /** logs a message only when not in production mode */
  // match native api
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public log(...args: any[]): void {
    if (this._state.loggingMode !== 'production') {
      console.log(...args);
    }
  }

  /** logs a warning in all modes */
  // match native api
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public warn(...args: any[]): void {
    // TODO: integrate posthog to capture warnings in production
    // posthog.capture('$exception', {
    //   $exception_type: 'console_warning',
    //   $exception_message: 'Something went wrong',
    //   $exception_stack_trace_raw: console.trace(),
    //   console_arguments: args,
    // });

    console.warn(...args);
  }

  /** logs an error in all modes */
  // match native api
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public error(...args: any[]): void {
    // TODO: integrate posthog to capture errors in production
    // posthog.capture('$exception', {
    //   $exception_type: 'console_error',
    //   $exception_message: 'Something went wrong',
    //   $exception_stack_trace_raw: console.trace(),
    //   console_arguments: args,
    // });

    console.error(...args);
  }

  /** sets the current logging mode */
  public setLoggingMode(mode: LogMode): void {
    this._state = { loggingMode: mode };
  }

  /** extracts a human-readable error message from an error, with fallback support */
  public getErrorMessage(err: Error, options: ErrorMessageOptions = {}) {
    if (options.overrideMessage) {
      return options.overrideMessage;
    }

    if (err instanceof HttpErrorResponse && err.error?.error?.message) {
      return err.error?.error?.message;
    }

    if (err.message) {
      return err.message;
    }

    return options.defaultMessage !== undefined ? options.defaultMessage : ErrorMessage.UNKNOWN;
  }
}

export const logManager = new LogManager();
