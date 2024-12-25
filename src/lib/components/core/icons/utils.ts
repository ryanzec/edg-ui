import type { Component } from 'svelte';
import AlignJustifiedIcon from '$lib/components/core/icons/align-justified-icon.svelte';
import CheckIcon from '$lib/components/core/icons/check-icon.svelte';
import ChevronDownIcon from '$lib/components/core/icons/chevron-down-icon.svelte';
import ChevronLeftIcon from '$lib/components/core/icons/chevron-left-icon.svelte';
import ChevronRightIcon from '$lib/components/core/icons/chevron-right-icon.svelte';
import ChevronUpIcon from '$lib/components/core/icons/chevron-up-icon.svelte';
import ChevronSelectorIcon from '$lib/components/core/icons/chevron-selector-icon.svelte';
import CircleCheckIcon from '$lib/components/core/icons/circle-check-icon.svelte';
import CircleDotIcon from '$lib/components/core/icons/circle-dot-icon.svelte';
import CircleIcon from '$lib/components/core/icons/circle-icon.svelte';
import LoaderIcon from '$lib/components/core/icons/loader-icon.svelte';
import PlusIcon from '$lib/components/core/icons/plus-icon.svelte';
import SquareCheckIcon from '$lib/components/core/icons/square-check-icon.svelte';
import SquareIcon from '$lib/components/core/icons/square-icon.svelte';
import SquareMinusIcon from '$lib/components/core/icons/square-minus-icon.svelte';
import XIcon from '$lib/components/core/icons/x-icon.svelte';

// this is not typed as we want to have the types be dynamically generated so by doing this we can add to the object
// and the IconName type will be updated automatically and also make sure the values passed in here are of type
// Component since what we export is properly typed
const internalIconComponents = {
  'align-justified': AlignJustifiedIcon,
  check: CheckIcon,
  'chevron-down': ChevronDownIcon,
  'chevron-left': ChevronLeftIcon,
  'chevron-right': ChevronRightIcon,
  'chevron-up': ChevronUpIcon,
  'chevron-selector': ChevronSelectorIcon,
  'circle-check': CircleCheckIcon,
  'circle-dot': CircleDotIcon,
  circle: CircleIcon,
  loader: LoaderIcon,
  plus: PlusIcon,
  'square-check': SquareCheckIcon,
  square: SquareIcon,
  'square-minus': SquareMinusIcon,
  x: XIcon,
};

export type IconName = keyof typeof internalIconComponents;
export const iconComponents: Record<IconName, Component> = internalIconComponents;
