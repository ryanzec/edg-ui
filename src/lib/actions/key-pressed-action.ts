import { browser } from '$app/environment';

export type KeyPressedActionOptions = {
  key: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  event?: 'keydown' | 'keyup' | 'keypress';
  callback: () => void;
};

const defaultOptions: Partial<KeyPressedActionOptions> = {
  preventDefault: true,
  stopPropagation: false,
  event: 'keydown',
};

export const keyPressedAction = (element: HTMLElement, options: KeyPressedActionOptions) => {
  const { callback, ...resetOfOptions } = options;
  const finalOptions = structuredClone({
    ...defaultOptions,
    ...resetOfOptions,
  });

  if (!browser) {
    return;
  }

  const onClick = (event: KeyboardEvent) => {
    if (event.key !== finalOptions.key) {
      return;
    }

    if (finalOptions.stopPropagation) {
      event.stopPropagation();
    }

    if (finalOptions.preventDefault) {
      event.preventDefault();
    }

    callback();
  };

  element.addEventListener('keydown', onClick);

  return {
    destroy: () => {
      element.removeEventListener('keydown', onClick);
    },
  };
};
