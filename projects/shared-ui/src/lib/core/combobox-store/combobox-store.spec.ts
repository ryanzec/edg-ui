import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { logManager } from '@organization/shared-utils';
import { ComboboxStore, type ComboboxOption, type ComboboxOptionInput } from './combobox-store';

const simpleOptions: ComboboxOptionInput[] = [
  { label: 'Banana', value: 'banana' },
  { label: 'Apple', value: 'apple' },
  { label: 'Cherry', value: 'cherry' },
];

const groupedOptions: ComboboxOptionInput[] = [
  { label: 'Banana', value: 'banana', groupLabel: 'Fruits' },
  { label: 'Apple', value: 'apple', groupLabel: 'Fruits' },
  { label: 'Carrot', value: 'carrot', groupLabel: 'Vegetables' },
  { label: 'Broccoli', value: 'broccoli', groupLabel: 'Vegetables' },
];

describe('ComboboxStore', () => {
  let store: ComboboxStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComboboxStore],
    });
    store = TestBed.inject(ComboboxStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('initial state', () => {
    it('starts uninitialized', () => {
      expect(store.isInitialized()).toBe(false);
    });

    it('exposes empty options', () => {
      expect(store.options()).toEqual([]);
    });

    it('exposes empty selected values', () => {
      expect(store.selectedValues()).toEqual([]);
    });

    it('exposes empty input value', () => {
      expect(store.inputValue()).toBe('');
    });

    it('exposes null focused option', () => {
      expect(store.focusedOption()).toBeNull();
    });

    it('exposes default config flags', () => {
      const config = store.config();

      expect(config.isMultiSelect).toBe(false);
      expect(config.allowNewOptions).toBe(false);
      expect(config.filterSelectedOptions).toBe(true);
      expect(config.optionFilter).toBeNull();
    });

    it('starts closed', () => {
      expect(store.isOpened()).toBe(false);
    });
  });

  describe('initialization guard', () => {
    beforeEach(() => {
      // suppress expected diagnostic output from the not-initialized guard these tests intentionally trigger
      vi.spyOn(logManager, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('blocks setOptions before initialize', () => {
      store.setOptions(simpleOptions);

      expect(store.options()).toEqual([]);
    });

    it('blocks setSelectedValues before initialize', () => {
      store.setSelectedValues(['anything']);

      expect(store.selectedValues()).toEqual([]);
    });

    it('blocks setInputValue before initialize', () => {
      store.setInputValue('typed');

      expect(store.inputValue()).toBe('');
    });

    it('blocks clearInputValue before initialize', () => {
      store.clearInputValue();

      expect(store.inputValue()).toBe('');
    });

    it('blocks setFocusedOption before initialize', () => {
      const option: ComboboxOption = {
        label: 'A',
        value: 'a',
        disabled: false,
        groupLabel: 'Uncategorized',
      };

      store.setFocusedOption(option);

      expect(store.focusedOption()).toBeNull();
    });

    it('blocks setIsOpened before initialize', () => {
      store.setIsOpened(true);

      expect(store.isOpened()).toBe(false);
    });

    it('blocks open before initialize', () => {
      store.open();

      expect(store.isOpened()).toBe(false);
    });

    it('blocks close before initialize', () => {
      store.close();

      expect(store.isOpened()).toBe(false);
    });

    it('blocks toggle before initialize', () => {
      store.toggle();

      expect(store.isOpened()).toBe(false);
    });

    it('returns -1 from getFocusedOptionIndex before initialize', () => {
      expect(store.getFocusedOptionIndex()).toBe(-1);
    });

    it('returns sentinel from getFocusedOptionGroupIndex before initialize', () => {
      expect(store.getFocusedOptionGroupIndex()).toEqual({ groupIndex: -1, optionIndex: -1 });
    });

    it('no-ops focusNext before initialize', () => {
      store.focusNext();

      expect(store.focusedOption()).toBeNull();
    });

    it('no-ops focusPrevious before initialize', () => {
      store.focusPrevious();

      expect(store.focusedOption()).toBeNull();
    });

    it('no-ops focusFirst before initialize', () => {
      store.focusFirst();

      expect(store.focusedOption()).toBeNull();
    });

    it('no-ops focusLast before initialize', () => {
      store.focusLast();

      expect(store.focusedOption()).toBeNull();
    });

    it('no-ops groupFocusNext before initialize', () => {
      store.groupFocusNext();

      expect(store.focusedOption()).toBeNull();
    });

    it('no-ops groupFocusPrevious before initialize', () => {
      store.groupFocusPrevious();

      expect(store.focusedOption()).toBeNull();
    });

    it('no-ops groupFocusFirst before initialize', () => {
      store.groupFocusFirst();

      expect(store.focusedOption()).toBeNull();
    });

    it('no-ops groupFocusLast before initialize', () => {
      store.groupFocusLast();

      expect(store.focusedOption()).toBeNull();
    });
  });

  describe('initialize', () => {
    it('flips isInitialized to true', () => {
      store.initialize(simpleOptions);

      expect(store.isInitialized()).toBe(true);
    });

    it('sorts options alphabetically by label', () => {
      store.initialize(simpleOptions);

      expect(store.options().map((opt) => opt.label)).toEqual(['Apple', 'Banana', 'Cherry']);
    });

    it('defaults disabled to false when omitted', () => {
      store.initialize([{ label: 'A', value: 'a' }]);

      expect(store.options()[0].disabled).toBe(false);
    });

    it('preserves an explicit disabled value', () => {
      store.initialize([{ label: 'A', value: 'a', disabled: true }]);

      expect(store.options()[0].disabled).toBe(true);
    });

    it('defaults groupLabel to Uncategorized when omitted', () => {
      store.initialize([{ label: 'A', value: 'a' }]);

      expect(store.options()[0].groupLabel).toBe('Uncategorized');
    });

    it('preserves an explicit groupLabel', () => {
      store.initialize([{ label: 'A', value: 'a', groupLabel: 'Fruits' }]);

      expect(store.options()[0].groupLabel).toBe('Fruits');
    });

    it('applies provided config over defaults', () => {
      const filter = (input: string, option: ComboboxOption) => option.label.includes(input);
      store.initialize(simpleOptions, {
        isMultiSelect: true,
        allowNewOptions: true,
        filterSelectedOptions: false,
        optionFilter: filter,
      });

      const config = store.config();

      expect(config.isMultiSelect).toBe(true);
      expect(config.allowNewOptions).toBe(true);
      expect(config.filterSelectedOptions).toBe(false);
      expect(config.optionFilter).toBe(filter);
    });

    it('resets prior state on re-initialize', () => {
      store.initialize(simpleOptions);
      store.setSelectedValues(['apple']);
      store.setInputValue('something');

      store.initialize([{ label: 'X', value: 'x' }]);

      expect(store.selectedValues()).toEqual([]);
      expect(store.inputValue()).toBe('');
      expect(store.focusedOption()).toBeNull();
      expect(store.isOpened()).toBe(false);
    });
  });

  describe('setOptions', () => {
    beforeEach(() => {
      store.initialize(simpleOptions, { isMultiSelect: true });
    });

    it('replaces options with new normalized and sorted entries', () => {
      store.setOptions([
        { label: 'Zebra', value: 'z' },
        { label: 'Alpha', value: 'a' },
      ]);

      expect(store.options().map((opt) => opt.label)).toEqual(['Alpha', 'Zebra']);
    });

    it('maintains selections that still exist in new options', () => {
      store.setSelectedValues(['apple', 'banana']);

      store.setOptions([
        { label: 'Apple', value: 'apple' },
        { label: 'Date', value: 'date' },
      ]);

      expect(store.selectedValues()).toEqual(['apple']);
    });

    it('keeps selections not in new options when allowNewOptions is true', () => {
      store.setConfig({ allowNewOptions: true });
      store.setSelectedValues(['apple', 'banana']);

      store.setOptions([{ label: 'Date', value: 'date' }]);

      expect(store.selectedValues()).toEqual(['apple', 'banana']);
    });

    it('clears the focused option when it is no longer in options', () => {
      const apple = store.options().find((opt) => opt.value === 'apple')!;
      store.setFocusedOption(apple);

      store.setOptions([{ label: 'Date', value: 'date' }]);

      expect(store.focusedOption()).toBeNull();
    });

    it('keeps the focused option when it still exists in new options', () => {
      const apple = store.options().find((opt) => opt.value === 'apple')!;
      store.setFocusedOption(apple);

      store.setOptions([{ label: 'Apple', value: 'apple' }]);

      expect(store.focusedOption()?.value).toBe('apple');
    });

    it('emits selectedValuesChanged when selections are pruned', () => {
      store.setSelectedValues(['apple', 'banana']);
      const emissions: (string | number)[][] = [];
      store.selectedValuesChanged$.subscribe((values) => emissions.push(values));

      store.setOptions([{ label: 'Apple', value: 'apple' }]);

      expect(emissions).toEqual([['apple']]);
    });

    it('does not emit selectedValuesChanged when selections are preserved', () => {
      store.setSelectedValues(['apple']);
      const emissions: (string | number)[][] = [];
      store.selectedValuesChanged$.subscribe((values) => emissions.push(values));

      store.setOptions([
        { label: 'Apple', value: 'apple' },
        { label: 'Date', value: 'date' },
      ]);

      expect(emissions).toEqual([]);
    });

    it('emits focusedOptionChanged with null when focused option is dropped', () => {
      const apple = store.options().find((opt) => opt.value === 'apple')!;
      store.setFocusedOption(apple);
      const emissions: (ComboboxOption | null)[] = [];
      store.focusedOptionChanged$.subscribe((option) => emissions.push(option));

      store.setOptions([{ label: 'Date', value: 'date' }]);

      expect(emissions).toEqual([null]);
    });

    it('does not emit focusedOptionChanged when there was no focused option', () => {
      const emissions: (ComboboxOption | null)[] = [];
      store.focusedOptionChanged$.subscribe((option) => emissions.push(option));

      store.setOptions([{ label: 'Date', value: 'date' }]);

      expect(emissions).toEqual([]);
    });
  });

  describe('getOptionByValue', () => {
    beforeEach(() => {
      store.initialize(simpleOptions);
    });

    it('returns the matching option', () => {
      const option = store.getOptionByValue('apple');

      expect(option?.label).toBe('Apple');
    });

    it('returns undefined when no option matches', () => {
      expect(store.getOptionByValue('not-there')).toBeUndefined();
    });
  });

  describe('setSelectedValues', () => {
    beforeEach(() => {
      // suppress expected diagnostic output from the invalid-selection/values branches these tests intentionally trigger
      vi.spyOn(logManager, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    describe('single-select mode', () => {
      beforeEach(() => {
        store.initialize(simpleOptions);
      });

      it('keeps only the first value when multiple values are provided', () => {
        store.setSelectedValues(['apple', 'banana']);

        expect(store.selectedValues()).toEqual(['apple']);
      });

      it('updates input value to the selected option label', () => {
        store.setSelectedValues(['apple']);

        expect(store.inputValue()).toBe('Apple');
      });

      it('does not change input value when selection is cleared', () => {
        store.setSelectedValues(['apple']);

        store.setSelectedValues([]);

        expect(store.inputValue()).toBe('Apple');
      });
    });

    describe('multi-select mode', () => {
      beforeEach(() => {
        store.initialize(simpleOptions, { isMultiSelect: true });
      });

      it('keeps every provided value', () => {
        store.setSelectedValues(['apple', 'banana']);

        expect(store.selectedValues()).toEqual(['apple', 'banana']);
      });

      it('clears input value when selection count changes', () => {
        store.setInputValue('typing');

        store.setSelectedValues(['apple']);

        expect(store.inputValue()).toBe('');
      });

      it('keeps input value when selection count is unchanged', () => {
        store.setSelectedValues(['apple']);
        store.setInputValue('typing');

        store.setSelectedValues(['banana']);

        expect(store.inputValue()).toBe('typing');
      });
    });

    describe('option validation', () => {
      it('drops values not in options when allowNewOptions is false', () => {
        store.initialize(simpleOptions, { isMultiSelect: true });

        store.setSelectedValues(['apple', 'unknown']);

        expect(store.selectedValues()).toEqual(['apple']);
      });

      it('keeps values not in options when allowNewOptions is true', () => {
        store.initialize(simpleOptions, { isMultiSelect: true, allowNewOptions: true });

        store.setSelectedValues(['apple', 'custom-value']);

        expect(store.selectedValues()).toEqual(['apple', 'custom-value']);
      });

      it('falls back to stringified value in input when label is missing in single-select', () => {
        store.initialize(simpleOptions, { allowNewOptions: true });

        store.setSelectedValues(['custom-value']);

        expect(store.inputValue()).toBe('custom-value');
      });
    });

    describe('event emissions', () => {
      beforeEach(() => {
        store.initialize(simpleOptions, { isMultiSelect: true });
      });

      it('emits selectedValuesChanged with the final values', () => {
        const emissions: (string | number)[][] = [];
        store.selectedValuesChanged$.subscribe((values) => emissions.push(values));

        store.setSelectedValues(['apple', 'banana']);

        expect(emissions).toEqual([['apple', 'banana']]);
      });

      it('emits inputValueChanged when input value changes as a side effect', () => {
        const emissions: string[] = [];
        store.inputValueChanged$.subscribe((value) => emissions.push(value));
        store.setInputValue('typing');

        store.setSelectedValues(['apple']);

        expect(emissions).toEqual(['typing', '']);
      });

      it('does not emit inputValueChanged when input value is unchanged', () => {
        const emissions: string[] = [];
        store.setSelectedValues(['apple']);
        store.inputValueChanged$.subscribe((value) => emissions.push(value));

        store.setSelectedValues(['apple']);

        expect(emissions).toEqual([]);
      });
    });
  });

  describe('setInputValue', () => {
    beforeEach(() => {
      store.initialize(simpleOptions);
    });

    it('updates the input value', () => {
      store.setInputValue('typed');

      expect(store.inputValue()).toBe('typed');
    });

    it('emits inputValueChanged when the value changes', () => {
      const emissions: string[] = [];
      store.inputValueChanged$.subscribe((value) => emissions.push(value));

      store.setInputValue('typed');

      expect(emissions).toEqual(['typed']);
    });

    it('does not emit inputValueChanged when the value is unchanged', () => {
      store.setInputValue('typed');
      const emissions: string[] = [];
      store.inputValueChanged$.subscribe((value) => emissions.push(value));

      store.setInputValue('typed');

      expect(emissions).toEqual([]);
    });

    it('updates the input value but suppresses the emission when emitChange is false', () => {
      const emissions: string[] = [];
      store.inputValueChanged$.subscribe((value) => emissions.push(value));

      store.setInputValue('typed', false);

      expect(store.inputValue()).toBe('typed');
      expect(emissions).toEqual([]);
    });
  });

  describe('clearInputValue', () => {
    beforeEach(() => {
      store.initialize(simpleOptions);
      store.setInputValue('typed');
    });

    it('resets the input value to empty string', () => {
      store.clearInputValue();

      expect(store.inputValue()).toBe('');
    });

    it('emits inputValueChanged when the input was not already empty', () => {
      const emissions: string[] = [];
      store.inputValueChanged$.subscribe((value) => emissions.push(value));

      store.clearInputValue();

      expect(emissions).toEqual(['']);
    });
  });

  describe('setFocusedOption', () => {
    beforeEach(() => {
      store.initialize(simpleOptions);
    });

    it('updates the focused option', () => {
      const apple = store.options().find((opt) => opt.value === 'apple')!;

      store.setFocusedOption(apple);

      expect(store.focusedOption()).toBe(apple);
    });

    it('emits focusedOptionChanged when the option changes', () => {
      const apple = store.options().find((opt) => opt.value === 'apple')!;
      const emissions: (ComboboxOption | null)[] = [];
      store.focusedOptionChanged$.subscribe((option) => emissions.push(option));

      store.setFocusedOption(apple);

      expect(emissions).toEqual([apple]);
    });

    it('does not emit focusedOptionChanged when the option is unchanged', () => {
      const apple = store.options().find((opt) => opt.value === 'apple')!;
      store.setFocusedOption(apple);
      const emissions: (ComboboxOption | null)[] = [];
      store.focusedOptionChanged$.subscribe((option) => emissions.push(option));

      store.setFocusedOption(apple);

      expect(emissions).toEqual([]);
    });
  });

  describe('getFocusedOptionIndex', () => {
    beforeEach(() => {
      store.initialize(simpleOptions);
    });

    it('returns -1 when nothing is focused', () => {
      expect(store.getFocusedOptionIndex()).toBe(-1);
    });

    it('returns the index of the focused option in the filtered list', () => {
      const banana = store.options().find((opt) => opt.value === 'banana')!;
      store.setFocusedOption(banana);

      expect(store.getFocusedOptionIndex()).toBe(1);
    });

    it('returns -1 when the focused option is not in the filtered list', () => {
      const apple = store.options().find((opt) => opt.value === 'apple')!;
      store.setFocusedOption(apple);
      store.setInputValue('xxx');

      expect(store.getFocusedOptionIndex()).toBe(-1);
    });
  });

  describe('getFocusedOptionGroupIndex', () => {
    beforeEach(() => {
      store.initialize(groupedOptions);
    });

    it('returns sentinel indices when nothing is focused', () => {
      expect(store.getFocusedOptionGroupIndex()).toEqual({ groupIndex: -1, optionIndex: -1 });
    });

    it('returns the group and option indices of the focused option', () => {
      const carrot = store.options().find((opt) => opt.value === 'carrot')!;
      store.setFocusedOption(carrot);

      // Fruits (Apple, Banana) sorted before Vegetables (Broccoli, Carrot)
      expect(store.getFocusedOptionGroupIndex()).toEqual({ groupIndex: 1, optionIndex: 1 });
    });

    it('returns sentinel indices when focused option is filtered out', () => {
      const carrot = store.options().find((opt) => opt.value === 'carrot')!;
      store.setFocusedOption(carrot);
      store.setInputValue('apple');

      expect(store.getFocusedOptionGroupIndex()).toEqual({ groupIndex: -1, optionIndex: -1 });
    });
  });

  describe('flat focus navigation', () => {
    beforeEach(() => {
      store.initialize(simpleOptions);
    });

    describe('focusNext', () => {
      it('focuses the first option when nothing is focused', () => {
        store.focusNext();

        expect(store.focusedOption()?.value).toBe('apple');
      });

      it('moves to the next option in the filtered list', () => {
        const apple = store.options().find((opt) => opt.value === 'apple')!;
        store.setFocusedOption(apple);

        store.focusNext();

        expect(store.focusedOption()?.value).toBe('banana');
      });

      it('wraps to the first option from the last', () => {
        const cherry = store.options().find((opt) => opt.value === 'cherry')!;
        store.setFocusedOption(cherry);

        store.focusNext();

        expect(store.focusedOption()?.value).toBe('apple');
      });

      it('is a no-op when filtered list is empty', () => {
        store.setInputValue('xxx');

        store.focusNext();

        expect(store.focusedOption()).toBeNull();
      });
    });

    describe('focusPrevious', () => {
      it('focuses the last option when nothing is focused', () => {
        store.focusPrevious();

        expect(store.focusedOption()?.value).toBe('cherry');
      });

      it('moves to the previous option in the filtered list', () => {
        const banana = store.options().find((opt) => opt.value === 'banana')!;
        store.setFocusedOption(banana);

        store.focusPrevious();

        expect(store.focusedOption()?.value).toBe('apple');
      });

      it('wraps to the last option from the first', () => {
        const apple = store.options().find((opt) => opt.value === 'apple')!;
        store.setFocusedOption(apple);

        store.focusPrevious();

        expect(store.focusedOption()?.value).toBe('cherry');
      });

      it('is a no-op when filtered list is empty', () => {
        store.setInputValue('xxx');

        store.focusPrevious();

        expect(store.focusedOption()).toBeNull();
      });
    });

    describe('focusFirst', () => {
      it('focuses the first option in the filtered list', () => {
        store.focusFirst();

        expect(store.focusedOption()?.value).toBe('apple');
      });

      it('is a no-op when filtered list is empty', () => {
        store.setInputValue('xxx');

        store.focusFirst();

        expect(store.focusedOption()).toBeNull();
      });
    });

    describe('focusLast', () => {
      it('focuses the last option in the filtered list', () => {
        store.focusLast();

        expect(store.focusedOption()?.value).toBe('cherry');
      });

      it('is a no-op when filtered list is empty', () => {
        store.setInputValue('xxx');

        store.focusLast();

        expect(store.focusedOption()).toBeNull();
      });
    });
  });

  describe('grouped focus navigation', () => {
    beforeEach(() => {
      store.initialize(groupedOptions);
    });

    describe('groupFocusNext', () => {
      it('focuses the first option of the first group when nothing is focused', () => {
        store.groupFocusNext();

        expect(store.focusedOption()?.value).toBe('apple');
      });

      it('moves to the next option in the same group', () => {
        const apple = store.options().find((opt) => opt.value === 'apple')!;
        store.setFocusedOption(apple);

        store.groupFocusNext();

        expect(store.focusedOption()?.value).toBe('banana');
      });

      it('moves to the first option of the next group at group end', () => {
        const banana = store.options().find((opt) => opt.value === 'banana')!;
        store.setFocusedOption(banana);

        store.groupFocusNext();

        expect(store.focusedOption()?.value).toBe('broccoli');
      });

      it('wraps to the first option of the first group from the last group end', () => {
        const carrot = store.options().find((opt) => opt.value === 'carrot')!;
        store.setFocusedOption(carrot);

        store.groupFocusNext();

        expect(store.focusedOption()?.value).toBe('apple');
      });

      it('is a no-op when filtered grouped list is empty', () => {
        store.setInputValue('xxx');

        store.groupFocusNext();

        expect(store.focusedOption()).toBeNull();
      });
    });

    describe('groupFocusPrevious', () => {
      it('focuses the last option of the last group when nothing is focused', () => {
        store.groupFocusPrevious();

        expect(store.focusedOption()?.value).toBe('carrot');
      });

      it('moves to the previous option in the same group', () => {
        const banana = store.options().find((opt) => opt.value === 'banana')!;
        store.setFocusedOption(banana);

        store.groupFocusPrevious();

        expect(store.focusedOption()?.value).toBe('apple');
      });

      it('moves to the last option of the previous group at group start', () => {
        const broccoli = store.options().find((opt) => opt.value === 'broccoli')!;
        store.setFocusedOption(broccoli);

        store.groupFocusPrevious();

        expect(store.focusedOption()?.value).toBe('banana');
      });

      it('wraps to the last option of the last group from the first group start', () => {
        const apple = store.options().find((opt) => opt.value === 'apple')!;
        store.setFocusedOption(apple);

        store.groupFocusPrevious();

        expect(store.focusedOption()?.value).toBe('carrot');
      });

      it('is a no-op when filtered grouped list is empty', () => {
        store.setInputValue('xxx');

        store.groupFocusPrevious();

        expect(store.focusedOption()).toBeNull();
      });
    });

    describe('groupFocusFirst', () => {
      it('focuses the first option of the first group', () => {
        store.groupFocusFirst();

        expect(store.focusedOption()?.value).toBe('apple');
      });

      it('is a no-op when filtered grouped list is empty', () => {
        store.setInputValue('xxx');

        store.groupFocusFirst();

        expect(store.focusedOption()).toBeNull();
      });
    });

    describe('groupFocusLast', () => {
      it('focuses the last option of the last group', () => {
        store.groupFocusLast();

        expect(store.focusedOption()?.value).toBe('carrot');
      });

      it('is a no-op when filtered grouped list is empty', () => {
        store.setInputValue('xxx');

        store.groupFocusLast();

        expect(store.focusedOption()).toBeNull();
      });
    });
  });

  describe('config setters', () => {
    beforeEach(() => {
      store.initialize(simpleOptions);
    });

    describe('setConfig', () => {
      it('partially merges the provided config over existing values', () => {
        store.setConfig({ isMultiSelect: true });

        const config = store.config();

        expect(config.isMultiSelect).toBe(true);
        expect(config.allowNewOptions).toBe(false);
        expect(config.filterSelectedOptions).toBe(true);
      });
    });

    describe('setIsMultiSelect', () => {
      it('enables multi-select mode', () => {
        store.setIsMultiSelect(true);

        expect(store.isMultiSelect()).toBe(true);
      });

      it('drops extra selections to the first when switching multi-select off', () => {
        store.setConfig({ isMultiSelect: true });
        store.setSelectedValues(['apple', 'banana']);

        store.setIsMultiSelect(false);

        expect(store.selectedValues()).toEqual(['apple']);
        expect(store.isMultiSelect()).toBe(false);
      });
    });

    describe('setAllowNewOptions', () => {
      it('updates the allowNewOptions flag', () => {
        store.setAllowNewOptions(true);

        expect(store.allowNewOptions()).toBe(true);
      });
    });

    describe('setFilterSelectedOptions', () => {
      it('updates the filterSelectedOptions flag', () => {
        store.setFilterSelectedOptions(false);

        expect(store.config().filterSelectedOptions).toBe(false);
      });
    });

    describe('setOptionFilter', () => {
      it('updates the option filter function', () => {
        const filter = (input: string, option: ComboboxOption) => option.label.startsWith(input);

        store.setOptionFilter(filter);

        expect(store.config().optionFilter).toBe(filter);
      });

      it('accepts null to clear the filter', () => {
        store.setOptionFilter((_input, _option) => true);

        store.setOptionFilter(null);

        expect(store.config().optionFilter).toBeNull();
      });
    });
  });

  describe('opened state', () => {
    beforeEach(() => {
      store.initialize(simpleOptions);
    });

    describe('setIsOpened', () => {
      it('updates the opened state', () => {
        store.setIsOpened(true);

        expect(store.isOpened()).toBe(true);
      });

      it('emits isOpenedChanged when the state changes', () => {
        const emissions: boolean[] = [];
        store.isOpenedChanged$.subscribe((value) => emissions.push(value));

        store.setIsOpened(true);

        expect(emissions).toEqual([true]);
      });

      it('does not emit isOpenedChanged when the state is unchanged', () => {
        store.setIsOpened(true);
        const emissions: boolean[] = [];
        store.isOpenedChanged$.subscribe((value) => emissions.push(value));

        store.setIsOpened(true);

        expect(emissions).toEqual([]);
      });

      it('clears the focused option when closing', () => {
        const apple = store.options().find((opt) => opt.value === 'apple')!;
        store.setIsOpened(true);
        store.setFocusedOption(apple);

        store.setIsOpened(false);

        expect(store.focusedOption()).toBeNull();
      });

      it('emits focusedOptionChanged with null when focused option is cleared on close', () => {
        const apple = store.options().find((opt) => opt.value === 'apple')!;
        store.setIsOpened(true);
        store.setFocusedOption(apple);
        const emissions: (ComboboxOption | null)[] = [];
        store.focusedOptionChanged$.subscribe((option) => emissions.push(option));

        store.setIsOpened(false);

        expect(emissions).toEqual([null]);
      });

      it('does not emit focusedOptionChanged on close when no option was focused', () => {
        store.setIsOpened(true);
        const emissions: (ComboboxOption | null)[] = [];
        store.focusedOptionChanged$.subscribe((option) => emissions.push(option));

        store.setIsOpened(false);

        expect(emissions).toEqual([]);
      });

      it('preserves the focused option when opening', () => {
        const apple = store.options().find((opt) => opt.value === 'apple')!;
        store.setIsOpened(true);
        store.setFocusedOption(apple);

        store.setIsOpened(true);

        expect(store.focusedOption()?.value).toBe('apple');
      });
    });

    describe('open', () => {
      it('sets the opened state to true', () => {
        store.open();

        expect(store.isOpened()).toBe(true);
      });
    });

    describe('close', () => {
      it('sets the opened state to false', () => {
        store.open();

        store.close();

        expect(store.isOpened()).toBe(false);
      });
    });

    describe('toggle', () => {
      it('opens when closed', () => {
        store.toggle();

        expect(store.isOpened()).toBe(true);
      });

      it('closes when open', () => {
        store.open();

        store.toggle();

        expect(store.isOpened()).toBe(false);
      });
    });
  });

  describe('selectedOptions computed', () => {
    it('returns full option objects for known selected values', () => {
      store.initialize(simpleOptions, { isMultiSelect: true });
      store.setSelectedValues(['apple', 'cherry']);

      const selected = store.selectedOptions();

      expect(selected.map((opt) => opt.label)).toEqual(['Apple', 'Cherry']);
    });

    it('synthesizes options for values not in options when allowNewOptions is true', () => {
      store.initialize(simpleOptions, { isMultiSelect: true, allowNewOptions: true });
      store.setSelectedValues(['apple', 'custom-value']);

      const selected = store.selectedOptions();

      expect(selected.length).toBe(2);
      expect(selected[0].label).toBe('Apple');
      expect(selected[1]).toEqual({
        label: 'custom-value',
        value: 'custom-value',
        disabled: false,
        groupLabel: 'Uncategorized',
        isNew: true,
      });
    });

    it('skips values not in options when allowNewOptions becomes false after selection', () => {
      store.initialize(simpleOptions, { isMultiSelect: true, allowNewOptions: true });
      store.setSelectedValues(['apple', 'custom-value']);

      store.setAllowNewOptions(false);

      expect(store.selectedOptions().map((opt) => opt.label)).toEqual(['Apple']);
    });

    it('preserves the order of selectedValues', () => {
      store.initialize(simpleOptions, { isMultiSelect: true });

      store.setSelectedValues(['cherry', 'apple']);

      expect(store.selectedOptions().map((opt) => opt.value)).toEqual(['cherry', 'apple']);
    });
  });

  describe('filteredOptions computed', () => {
    it('returns all options when no filter or input value is set', () => {
      store.initialize(simpleOptions, { filterSelectedOptions: false });

      expect(store.filteredOptions().map((opt) => opt.value)).toEqual(['apple', 'banana', 'cherry']);
    });

    it('applies the custom optionFilter when present', () => {
      store.initialize(simpleOptions, {
        filterSelectedOptions: false,
        optionFilter: (input, option) => option.label.toLowerCase().startsWith(input.toLowerCase()),
      });
      store.setInputValue('b');

      expect(store.filteredOptions().map((opt) => opt.value)).toEqual(['banana']);
    });

    it('applies a default case-insensitive label search when no optionFilter is set', () => {
      store.initialize(simpleOptions, { filterSelectedOptions: false });

      store.setInputValue('APP');

      expect(store.filteredOptions().map((opt) => opt.value)).toEqual(['apple']);
    });

    it('does not apply the default label search when input value is empty', () => {
      store.initialize(simpleOptions, { filterSelectedOptions: false });

      expect(store.filteredOptions().map((opt) => opt.value)).toEqual(['apple', 'banana', 'cherry']);
    });

    it('filters out selected options when filterSelectedOptions is true', () => {
      store.initialize(simpleOptions, { isMultiSelect: true, filterSelectedOptions: true });

      store.setSelectedValues(['apple']);

      expect(store.filteredOptions().map((opt) => opt.value)).toEqual(['banana', 'cherry']);
    });

    it('keeps selected options visible when filterSelectedOptions is false', () => {
      store.initialize(simpleOptions, { isMultiSelect: true, filterSelectedOptions: false });

      store.setSelectedValues(['apple']);

      expect(store.filteredOptions().map((opt) => opt.value)).toEqual(['apple', 'banana', 'cherry']);
    });

    it('skips the default label search when enableFiltering is false', () => {
      store.initialize(simpleOptions, { filterSelectedOptions: false, enableFiltering: false });

      store.setInputValue('APP');

      expect(store.filteredOptions().map((opt) => opt.value)).toEqual(['apple', 'banana', 'cherry']);
    });

    it('skips the custom optionFilter when enableFiltering is false', () => {
      store.initialize(simpleOptions, {
        filterSelectedOptions: false,
        enableFiltering: false,
        optionFilter: (input, option) => option.label.toLowerCase().startsWith(input.toLowerCase()),
      });

      store.setInputValue('b');

      expect(store.filteredOptions().map((opt) => opt.value)).toEqual(['apple', 'banana', 'cherry']);
    });

    it('still filters out selected options when enableFiltering is false', () => {
      store.initialize(simpleOptions, { isMultiSelect: true, filterSelectedOptions: true, enableFiltering: false });

      store.setSelectedValues(['apple']);

      expect(store.filteredOptions().map((opt) => opt.value)).toEqual(['banana', 'cherry']);
    });
  });

  describe('groupedOptions computed', () => {
    it('groups options by groupLabel sorted alphabetically', () => {
      store.initialize(groupedOptions);

      const groups = store.groupedOptions();

      expect(groups.map((group) => group.groupLabel)).toEqual(['Fruits', 'Vegetables']);
    });

    it('keeps options within groups in the underlying sorted order', () => {
      store.initialize(groupedOptions);

      const groups = store.groupedOptions();

      expect(groups[0].options.map((opt) => opt.label)).toEqual(['Apple', 'Banana']);
      expect(groups[1].options.map((opt) => opt.label)).toEqual(['Broccoli', 'Carrot']);
    });

    it('does not apply filtering to groupedOptions', () => {
      store.initialize(groupedOptions, { filterSelectedOptions: true, isMultiSelect: true });
      store.setSelectedValues(['apple']);
      store.setInputValue('apple');

      const groups = store.groupedOptions();

      expect(groups[0].options.map((opt) => opt.value)).toEqual(['apple', 'banana']);
    });
  });

  describe('filteredGroupedOptions computed', () => {
    it('groups the filtered options', () => {
      store.initialize(groupedOptions, { filterSelectedOptions: false });
      store.setInputValue('a');

      const groups = store.filteredGroupedOptions();

      expect(
        groups.map((group) => ({ label: group.groupLabel, items: group.options.map((opt) => opt.value) }))
      ).toEqual([
        { label: 'Fruits', items: ['apple', 'banana'] },
        { label: 'Vegetables', items: ['carrot'] },
      ]);
    });

    it('omits groups whose options are entirely filtered out', () => {
      store.initialize(groupedOptions, { filterSelectedOptions: false });

      store.setInputValue('apple');

      const groups = store.filteredGroupedOptions();

      expect(groups.length).toBe(1);
      expect(groups[0].groupLabel).toBe('Fruits');
    });
  });
});
