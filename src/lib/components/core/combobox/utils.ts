import type { ComboboxStore } from '$lib/components/core/combobox/store';
import type { ComponentType, SvelteComponent } from 'svelte';

export type BaseComboboxOptionValue = {
  display: string;
};

export type ComboboxOptionComponent<TOptionValue extends BaseComboboxOptionValue> = ComponentType<
  SvelteComponent<{
    option: TOptionValue;
    optionIndex: number;
    optionAction: ComboboxStore<TOptionValue>['optionAction'];
  }>
>;

export const COMBOBOX_DEFAULT_DELAY = 300;

const defaultFilter = <TOptionValue extends BaseComboboxOptionValue>(inputValue: string, options: TOptionValue[]) => {
  return options.filter((option) => option.display.toLowerCase().includes(inputValue.toLowerCase()));
};

const removeSelectedOptions = <TOptionValue extends BaseComboboxOptionValue>(
  options: TOptionValue[],
  selected: TOptionValue[],
) => {
  const selectedLabels = selected.map((selectedOption) => selectedOption.display.toLowerCase());

  return options.filter((option) => {
    const normalizedLabel = option.display.toLowerCase();

    return selectedLabels.includes(normalizedLabel) === false;
  });
};

const removeGroupedSelectedOptions = <TOptionValue extends BaseComboboxOptionValue>(
  options: Record<string, TOptionValue[]>,
  selected: TOptionValue[],
) => {
  return Object.keys(options).reduce<Record<string, TOptionValue[]>>((collector, groupName) => {
    collector[groupName] = removeSelectedOptions(options[groupName], selected);
    return collector;
  }, {});
};

export const comboboxComponentUtils = {
  defaultFilter,
  removeSelectedOptions,
  removeGroupedSelectedOptions,
};
