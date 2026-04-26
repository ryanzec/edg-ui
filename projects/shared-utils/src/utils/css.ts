import { type ClassValue, clsx } from 'clsx';

const merge = (...inputs: ClassValue[]) => {
  return clsx(inputs);
};

export const cssUtils = {
  merge,
};
