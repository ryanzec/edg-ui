import * as uuid from 'uuid';

import { browser } from '$app/environment';
import { domUtils } from '$lib/utils/dom';

export const IGNORE_DATA_ATTRIBUTE_NAME = 'data-ignore-click-outside';

const DEFAULT_EVENT_NAME = 'mousedown';

export type ClickOutsideActionOptions = {
  callback: (clickedElement: HTMLElement) => void;
  eventName?: 'mousedown' | 'mouseup';

  // clicks inside elements with this as a data attribute will not be ignored for clicking outside triggering
  id?: string;
};

export const clickOutsideAction = (element: HTMLElement, options: ClickOutsideActionOptions) => {
  if (!browser) {
    return;
  }

  // since this can be updated when the element is update, making this its own variable makes it easier to work with
  let id = options.id || uuid.v1();

  const onClick = (event: MouseEvent) => {
    const targetElement = event.target as HTMLElement;

    if (domUtils.isElementChildOf(targetElement, element)) {
      return;
    }

    const hasIgnoreDataAttribute = !!targetElement.closest(
      `[${IGNORE_DATA_ATTRIBUTE_NAME}=true], [${IGNORE_DATA_ATTRIBUTE_NAME}="${id}"]`,
    );

    if (hasIgnoreDataAttribute) {
      return;
    }

    options.callback(targetElement);
  };

  window.addEventListener(options.eventName || DEFAULT_EVENT_NAME, onClick);

  return {
    update: (newOptions: ClickOutsideActionOptions) => {
      const previousEventName = options.eventName || DEFAULT_EVENT_NAME;
      options = newOptions;

      if (options.id) {
        id = options.id;
      }

      window.removeEventListener(previousEventName, onClick);
      window.addEventListener(options.eventName || DEFAULT_EVENT_NAME, onClick);
    },

    destroy: () => {
      const eventName = options.eventName || DEFAULT_EVENT_NAME;

      window.removeEventListener(eventName, onClick);
    },
  };
};
