import { browser } from '$app/environment';
import { domUtils } from '$lib/utils/dom';

export type ClickOutsideActionOptions = {
  callback: (clickedElement: HTMLElement) => void;
};

export const clickOutsideAction = (element: HTMLElement, options: ClickOutsideActionOptions) => {
  if (!browser) {
    return;
  }

  const onClick = (event: MouseEvent) => {
    const targetElement = event.target as HTMLElement;

    if (domUtils.isElementChildOf(targetElement, element)) {
      return;
    }

    options.callback(targetElement);
  };

  window.addEventListener('mousedown', onClick);

  return {
    destroy: () => {
      window.removeEventListener('mousedown', onClick);
    },
  };
};
