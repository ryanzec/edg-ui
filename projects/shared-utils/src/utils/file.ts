const BYTES_PER_KB = 1024;

const sizeUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;

/**
 * Formats a byte count into a human-readable string using binary multiples (1024).
 * Returns values like "1.5 MB", "184 KB", "12 B". Single-digit unit results are rounded to one decimal
 * place; larger values are rounded to the nearest whole number.
 */
const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(BYTES_PER_KB)), sizeUnits.length - 1);
  const value = bytes / Math.pow(BYTES_PER_KB, exponent);
  const formatted = value >= 10 || exponent === 0 ? Math.round(value).toString() : value.toFixed(1);

  return `${formatted} ${sizeUnits[exponent]}`;
};

/**
 * Extracts a file's extension (uppercased, no pre dot) from its name.
 * Returns the empty string when no extension is present.
 */
const getFileExtension = (fileName: string): string => {
  const lastDot = fileName.lastIndexOf('.');

  if (lastDot <= 0 || lastDot === fileName.length - 1) {
    return '';
  }

  return fileName.slice(lastDot + 1).toUpperCase();
};

export const fileUtils = {
  formatBytes,
  getFileExtension,
};
