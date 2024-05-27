// proxy methods for some console.* so need to allow any here
/* eslint-disable @typescript-eslint/no-explicit-any*/
const log = (...args: any) => {
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  console.log(...args);
};

const warn = (...args: any) => {
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  console.warn(...args);
};

const error = (...args: any) => {
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  console.error(...args);
};
/* eslint-enable @typescript-eslint/no-explicit-any*/

export const loggerUtils = {
  log,
  warn,
  error,
};
