import type { CreateDropdownMenuProps } from '@melt-ui/svelte';

const defaultOptions: Partial<CreateDropdownMenuProps> = {
  forceVisible: true,
  loop: true,
  positioning: { placement: 'bottom-end' },
};

const buildCreateOptions = (overrideOptions: CreateDropdownMenuProps = {}) => {
  const finalOptions = structuredClone(defaultOptions);

  if (overrideOptions.positioning) {
    finalOptions.positioning = {
      ...finalOptions.positioning,
      ...overrideOptions.positioning,
    };
  }

  return finalOptions;
};

export const dropDownUtils = { buildCreateOptions };
