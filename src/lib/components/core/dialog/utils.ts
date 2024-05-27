import type { CreateDialogProps } from '@melt-ui/svelte';
import type { Writable } from 'svelte/store';

const buildCreateOptions = (isOpened: Writable<boolean>, overrideOptions: CreateDialogProps = {}) => {
  return {
    forceVisible: true,
    ...overrideOptions,
    open: isOpened,
  };
};

export const dialogUtils = { buildCreateOptions };
