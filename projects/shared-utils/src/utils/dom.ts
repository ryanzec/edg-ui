import DOMPurify from 'dompurify';

/**
 * Checks if an element is out of view of a container element
 * @param containerElement - The container element
 * @param checkElement - The element to check
 * @param offset - The offset to use in detection, defaults to 2 in order to account for issue that can arise when
 * scrolling an element with `scrollIntoView()` which can leave adjacent element slightly in view
 * @returns True if the element is out of view, false otherwise
 */
const isElementOutOfView = (containerElement: HTMLElement, checkElement: HTMLElement, offset = 2) => {
  const containerRect = containerElement.getBoundingClientRect();
  const elementRect = checkElement.getBoundingClientRect();

  // Check if the element is past the container's top boundary + offset
  const isPastTop = elementRect.bottom <= containerRect.top + offset;

  // Check if the element is past the container's bottom boundary - offset
  const isPastBottom = elementRect.top >= containerRect.bottom - offset;

  // Check if the element is past the container's left boundary + offset
  const isPastLeft = elementRect.right <= containerRect.left + offset;

  // Check if the element is past the container's right boundary - offset
  const isPastRight = elementRect.left >= containerRect.right - offset;

  return isPastTop || isPastBottom || isPastLeft || isPastRight;
};

const hasScrollableContent = (element: HTMLElement, direction: 'vertical' | 'horizontal' = 'vertical'): boolean => {
  if (direction === 'vertical') {
    return element.scrollHeight > element.clientHeight;
  }

  return element.scrollWidth > element.clientWidth;
};

/**
 * Sanitizes an HTML string using DOMPurify to prevent XSS attacks
 * @param html - The raw HTML string to sanitize
 * @returns A sanitized HTML string safe for injection into the DOM
 */
const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html);
};

/**
 * Escapes special characters in a string for safe use as an HTML attribute value
 * @param value - The raw string to escape
 * @returns A string with &, <, >, ", and ' replaced with their HTML entities
 */
const escapeHtmlAttribute = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export const domUtils = {
  isElementOutOfView,
  hasScrollableContent,
  sanitizeHtml,
  escapeHtmlAttribute,
};
