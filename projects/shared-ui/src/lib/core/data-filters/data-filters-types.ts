import type { ComboboxOptionInput } from '../combobox-store/combobox-store';

/** all supported data-filter types */
export const allDataFilterTypes = ['text', 'toggle', 'array'] as const;

/** the input-type discriminator for a data filter */
export type DataFilterType = (typeof allDataFilterTypes)[number];

/** value type for a text filter */
export type DataFilterTextValue = string;

/** value type for a toggle filter */
export type DataFilterToggleValue = boolean;

/** value type for an array (multi-select combobox) filter */
export type DataFilterArrayValue = (string | number)[];

/** any possible filter value */
export type DataFilterValue = DataFilterTextValue | DataFilterToggleValue | DataFilterArrayValue;

/** shared properties for every filter variant */
type DataFilterBase = {
  /** form control name — must be unique within a single data-filters component */
  name: string;

  /** visible label rendered next to the input */
  label: string;

  /** forwarded to the underlying input's disabled state */
  disabled?: boolean;

  /** forwarded to the underlying input's readonly state — only honored by text */
  readonly?: boolean;
};

/** text filter — renders an org-input */
export type DataFilterText = DataFilterBase & {
  type: 'text';

  /** default value for the form control */
  defaultValue: DataFilterTextValue;
};

/** toggle filter — renders an org-checkbox-toggle (positive label only) */
export type DataFilterToggle = DataFilterBase & {
  type: 'toggle';

  /** default value for the form control */
  defaultValue: DataFilterToggleValue;
};

/** array filter — renders an org-combobox in multi-select mode */
export type DataFilterArray = DataFilterBase & {
  type: 'array';

  /** default value for the form control */
  defaultValue: DataFilterArrayValue;

  /** option list shown in the combobox */
  options: ComboboxOptionInput[];
};

/** declarative definition of a single filter */
export type DataFilter = DataFilterText | DataFilterToggle | DataFilterArray;

/** value emitted by the (filtersChanged) output */
export type DataFiltersValue = Record<string, DataFilterValue>;
