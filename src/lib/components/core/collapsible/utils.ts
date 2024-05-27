import type { CreateCollapsibleProps } from '@melt-ui/svelte';

const buildCreateOptions = (overrideOptions: CreateCollapsibleProps = {}) => {
  return {
    forceVisible: true,
    ...overrideOptions,
  };
};

export const collapsibleUtils = { buildCreateOptions };
