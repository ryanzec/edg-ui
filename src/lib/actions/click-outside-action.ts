import { browser } from '$app/environment';
import { domUtils } from '$lib/utils/dom';

export type ClickOutsideActionOptions = {
  callback: (clickedElement: HTMLElement) => void;
};

export const clickOutsideAction = (element: HTMLElement, options: ClickOutsideActionOptions) => {
  if (!browser) {
    return;
  }

  const handleClick = (event: MouseEvent) => {
    const targetElement = event.target as HTMLElement;

    if (domUtils.isElementChildOf(targetElement, element)) {
      return;
    }

    options.callback(targetElement);
  };

  window.addEventListener('mousedown', handleClick);

  return {
    destroy: () => {
      window.removeEventListener('mousedown', handleClick);
    },
  };
};
