// proxy methods for some console.* so need to allow any here

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

export const loggerUtils = {
  log,
  warn,
  error,
};
