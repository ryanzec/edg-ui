import { flip, computePosition } from '@floating-ui/dom';
import type { BaseComboboxOptionValue } from '$lib/components/core/combobox/utils';
import { get, writable, type Writable } from 'svelte/store';
import * as _ from 'lodash-es';

const dataAttributes = {
  HIGHLIGHTED: 'data-combobox-highlighted',
  DROP_DOWN_SELECTED: 'data-combobox-drop-down-selected',
  OPTION: 'data-combobox-option',
  SKIP_BLUR: 'data-skip-blur',
  INPUT: 'data-combobox-input',
  INPUT_FOCUSED: 'data-combobox-input-focused',
};

export type OptionActionOptions<TOptionValue extends BaseComboboxOptionValue> = {
  option: TOptionValue;
  optionIndex: number;
};

export type ComboboxUtils<TOptionValue extends BaseComboboxOptionValue> = {
  increaseActiveOption: () => void;
  decreaseActiveOption: () => void;
  setActiveOption: (index: number) => void;
  selectActiveOption: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  clearSelected: () => void;
  removeOption: (option: TOptionValue) => void;
  // return true if added and false if removed
  selectOption: (option: TOptionValue) => boolean;
  isOptionSelected: (option: TOptionValue) => boolean;
};

export type ComboboxStore<TOptionValue extends BaseComboboxOptionValue> = {
  isOpened: Writable<boolean>;
  inputValue: Writable<string>;
  inputElement: Writable<HTMLInputElement | undefined>;
  optionsElement: Writable<HTMLElement | undefined>;
  labelAction: (element: HTMLLabelElement) => void;
  inputAction: (element: HTMLInputElement) => void;
  optionsAttachedAction: (element: HTMLElement) => void;
  optionsAction: (element: HTMLElement) => void;
  optionAction: (element: HTMLLIElement, options: OptionActionOptions<TOptionValue>) => void;
  comboboxUtils: ComboboxUtils<TOptionValue>;
};

export type CreateComboboxStoreOptions<TOptionValue extends BaseComboboxOptionValue> = {
  selected: Writable<TOptionValue[]>;
  isMultiple: boolean;
};

export const createComboboxStore = <TOptionValue extends BaseComboboxOptionValue>(
  options: CreateComboboxStoreOptions<TOptionValue>,
): ComboboxStore<TOptionValue> => {
  const { selected, isMultiple = false } = options;
  const selectedValue = get(selected);

  // external state
  const isOpened = writable(false);
  const inputValue = writable(selectedValue.length === 0 || isMultiple ? '' : selectedValue[0].display);
  const labelElement: Writable<HTMLLabelElement | undefined> = writable(undefined);
  const inputElement: Writable<HTMLInputElement | undefined> = writable(undefined);
  const optionsElement: Writable<HTMLElement | undefined> = writable(undefined);

  // internal state
  const optionsAttachedElement: Writable<HTMLElement | undefined> = writable(undefined);
  const activeOptionIndex: Writable<number | undefined> = writable(undefined);
  let totalOptionsCount = 0;

  const increaseActiveOption = () => {
    activeOptionIndex.update((value) => {
      if (value === undefined) {
        return 0;
      }

      return value >= totalOptionsCount - 1 ? 0 : value + 1;
    });
  };

  const decreaseActiveOption = () => {
    activeOptionIndex.update((value) => {
      if (value === undefined) {
        return totalOptionsCount - 1;
      }

      return value <= 0 ? totalOptionsCount - 1 : value - 1;
    });
  };

  const setActiveOption = (index: number) => {
    activeOptionIndex.set(index);
  };

  const clearHighlightedOptionDataAttributes = () => {
    const $optionsElement = get(optionsElement);

    if (!$optionsElement) {
      return;
    }

    const highlightedElement = $optionsElement.querySelector(`[${dataAttributes.HIGHLIGHTED}]`) as HTMLElement;

    if (!highlightedElement) {
      return;
    }

    highlightedElement.removeAttribute(dataAttributes.HIGHLIGHTED);
  };

  const selectActiveOption = () => {
    const $activeOptionIndex = get(activeOptionIndex);

    if ($activeOptionIndex === undefined) {
      return;
    }

    const $optionsElement = get(optionsElement);

    if (!$optionsElement) {
      return;
    }

    const highlightedElement = $optionsElement.querySelector(`[${dataAttributes.HIGHLIGHTED}]`) as HTMLElement;

    if (!highlightedElement) {
      return;
    }

    highlightedElement.click();
  };

  const openMenu = () => {
    isOpened.set(true);
  };

  const closeMenu = () => {
    isOpened.set(false);
  };

  const toggleMenu = () => {
    isOpened.update((value) => !value);
  };

  const clearSelected = () => {
    selected.set([]);
  };

  const removeOption = (option: TOptionValue) => {
    selected.update((currentSelected) => {
      const currentIndex = _.findIndex(currentSelected, (selectedOption) => {
        return selectedOption.display === option.display;
      });

      if (currentIndex === -1) {
        return currentSelected;
      }

      return currentSelected.filter((_, index) => index !== currentIndex);
    });
  };

  const selectOption = (option: TOptionValue) => {
    const currentSelected = get(selected);
    let wasAdded = false;
    const currentIndex = _.findIndex(currentSelected, (selectedOption) => {
      return selectedOption.display === option.display;
    });

    if (!isMultiple && currentIndex === 0) {
      return wasAdded;
    }

    selected.update((currentSelected) => {
      const currentIndex = _.findIndex(currentSelected, (selectedOption) => {
        return selectedOption.display === option.display;
      });

      if (currentIndex === -1) {
        wasAdded = isMultiple;
        return isMultiple ? [...currentSelected, option] : [option];
      } else {
        return currentSelected.filter((_, index) => index !== currentIndex);
      }
    });

    return wasAdded;
  };

  const isOptionSelected = (option: TOptionValue) => {
    const $selected = get(selected);
    return (
      _.findIndex($selected, (selectedOption) => {
        return selectedOption.display === option.display;
      }) !== -1
    );
  };

  const labelAction = (element: HTMLLabelElement) => {
    labelElement.set(element);
  };

  const inputAction = (element: HTMLInputElement) => {
    inputElement.set(element);

    element.setAttribute(dataAttributes.INPUT, '');

    element.addEventListener('focus', () => {
      isOpened.set(true);

      get(inputElement)?.setAttribute(dataAttributes.INPUT_FOCUSED, '');
    });

    element.addEventListener('mousedown', () => {
      isOpened.update((value) => !value);
    });

    element.addEventListener('input', () => {
      inputValue.set(element.value);
      isOpened.set(true);
    });

    element.addEventListener('blur', () => {
      const highlightedElement = get(optionsElement)?.querySelector(`[${dataAttributes.HIGHLIGHTED}]`);

      // if the user click on an element, we don't want to close as we want to allow the user to select that value
      // so this conditional of setting the opened state handles that issue
      isOpened.set(!!highlightedElement);

      get(inputElement)?.removeAttribute(dataAttributes.INPUT_FOCUSED);

      if (isMultiple) {
        inputValue.set('');
      }
    });

    inputValue.subscribe((value) => {
      element.value = value;
    });
  };

  const optionsAttachedAction = (element: HTMLElement) => {
    optionsAttachedElement.set(element);
  };

  const optionsAction = (element: HTMLElement) => {
    optionsElement.set(element);

    const $attachedElement = get(optionsAttachedElement);

    if (!$attachedElement) {
      return;
    }

    const updateTooltipPosition = async () => {
      const computedPosition = await computePosition($attachedElement, element, {
        placement: 'bottom-start',
        middleware: [flip()],
      });

      Object.assign(element.style, {
        left: `${computedPosition.x}px`,
        top: `${computedPosition.y}px`,
        width: `${$attachedElement.getClientRects()[0].width}px`,
      });
    };

    updateTooltipPosition();
  };

  const optionAction = (element: HTMLElement, options: OptionActionOptions<TOptionValue>) => {
    let elementIndex = options.optionIndex;
    let option = options.option;

    element.setAttribute(dataAttributes.OPTION, elementIndex.toString());

    if (isOptionSelected(option)) {
      element.setAttribute(dataAttributes.DROP_DOWN_SELECTED, '');
    }

    element.addEventListener('mouseenter', () => {
      activeOptionIndex.set(elementIndex);
    });

    element.addEventListener('click', () => {
      selectOption(option);

      if (!isMultiple) {
        inputValue.set(option.display);
      }

      // to make it easier to select multiple options, we want to keep the options visible after selection of one
      if (isMultiple) {
        activeOptionIndex.set(0);

        return;
      }

      isOpened.set(false);
    });

    // it is possible for the active option to be set before the option is rendered so this makes sure if it is
    // it will be highlighted when created
    if (get(activeOptionIndex) === elementIndex) {
      element.setAttribute(dataAttributes.HIGHLIGHTED, '');
    }

    totalOptionsCount += 1;

    return {
      update: (value: OptionActionOptions<TOptionValue>) => {
        elementIndex = value.optionIndex;
        option = value.option;

        // when these update, the options index might change that would require the highlighted option to be updated
        if (get(activeOptionIndex) === elementIndex) {
          element.setAttribute(dataAttributes.HIGHLIGHTED, '');
        } else {
          element.removeAttribute(dataAttributes.HIGHLIGHTED);
        }
      },
    };
  };

  isOpened.subscribe((newIsOpened) => {
    const $inputElement = get(inputElement);

    if (newIsOpened) {
      $inputElement?.setAttribute(dataAttributes.SKIP_BLUR, '');

      return;
    }

    activeOptionIndex.set(undefined);
    $inputElement?.removeAttribute(dataAttributes.SKIP_BLUR);
    optionsElement.set(undefined);
  });

  activeOptionIndex.subscribe((newActiveOptionIndex) => {
    const $optionsElement = get(optionsElement);

    if (!$optionsElement || newActiveOptionIndex === undefined) {
      return;
    }

    const matchingElement = $optionsElement.querySelector(`[${dataAttributes.OPTION}]:nth-child(${newActiveOptionIndex + 1})`) as HTMLElement;

    if (!matchingElement) {
      return;
    }

    clearHighlightedOptionDataAttributes();
    matchingElement.setAttribute(dataAttributes.HIGHLIGHTED, '');
  });

  optionsElement.subscribe((newOptionsElement) => {
    if (newOptionsElement) {
      return;
    }

    totalOptionsCount = 0;
  });

  selected.subscribe((newSelected) => {
    const $inputElement = get(inputElement);

    if (!$inputElement) {
      return;
    }

    if (newSelected.length === 0) {
      $inputElement.value = '';
    }

    // since management of the value of this component is unique, we want to manally trigger the change event
    // to allow code outside to be able to hook into native dom events (for things like validation)
    $inputElement.dispatchEvent(new Event('change', { bubbles: true }));
  });

  return {
    // state
    isOpened,
    inputValue,

    // elements
    inputElement,
    optionsElement,

    // actions
    labelAction,
    inputAction,
    optionsAttachedAction,
    optionsAction,
    optionAction,

    comboboxUtils: {
      increaseActiveOption,
      decreaseActiveOption,
      setActiveOption,
      selectActiveOption,
      openMenu,
      closeMenu,
      toggleMenu,
      clearSelected,
      removeOption,
      selectOption,
      isOptionSelected,
    },
  };
};
