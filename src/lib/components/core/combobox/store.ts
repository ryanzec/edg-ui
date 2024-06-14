import { flip, offset, computePosition } from '@floating-ui/dom';
import type { BaseComboboxOptionValue, ComboboxOptionsActionOptions } from '$lib/components/core/combobox/utils';
import { get, writable, type Writable } from 'svelte/store';
import * as _ from 'lodash-es';
import { domUtils } from '$lib/utils/dom';
import type { Action, ActionReturn } from 'svelte/action';

const dataAttributes = {
  HIGHLIGHTED: 'data-combobox-highlighted',
  DROP_DOWN_SELECTED: 'data-combobox-drop-down-selected',
  OPTION: 'data-combobox-option',
  CLEAR_OPTION: 'data-combobox-clear-option',
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
  clearActiveOption: () => void;
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
  inputIsDirty: Writable<boolean>;
  inputIsFocused: Writable<boolean>;
  containerElement: Writable<HTMLElement | undefined>;
  inputElement: Writable<HTMLInputElement | undefined>;
  optionsElement: Writable<HTMLElement | undefined>;
  containerAction: Action<HTMLElement>;
  labelAction: (element: HTMLLabelElement) => void;
  inputAction: (element: HTMLInputElement) => void;
  optionsAttachedAction: (element: HTMLElement) => void;
  optionsAction: Action<HTMLElement, ComboboxOptionsActionOptions>;
  optionAction: (element: HTMLLIElement, options: OptionActionOptions<TOptionValue>) => void;
  clearOptionAction: Action<HTMLElement>;
  comboboxUtils: ComboboxUtils<TOptionValue>;
};

export type CreateComboboxStoreOptions<TOptionValue extends BaseComboboxOptionValue> = {
  selected: Writable<TOptionValue[]>;
  isMultiple: boolean;
};

export const createComboboxStore = <TOptionValue extends BaseComboboxOptionValue>(
  storeOptions: CreateComboboxStoreOptions<TOptionValue>,
): ComboboxStore<TOptionValue> => {
  const { selected, isMultiple = false } = storeOptions;
  const selectedValue = get(selected);

  // external state
  const isOpened = writable<boolean>(false);
  const inputValue = writable<string>(selectedValue.length === 0 || isMultiple ? '' : selectedValue[0].display);
  const inputIsDirty = writable<boolean>(false);
  const inputIsFocused = writable<boolean>(false);
  const containerElement = writable<HTMLElement | undefined>(undefined);
  const labelElement = writable<HTMLLabelElement | undefined>(undefined);
  const inputElement = writable<HTMLInputElement | undefined>(undefined);
  const optionsElement = writable<HTMLElement | undefined>(undefined);

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

  const clearActiveOption = () => {
    activeOptionIndex.set(undefined);
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

  const resetSelectedAttributes = () => {
    const $selected = get(selected);
    const allOptionElements = get(optionsElement)?.querySelectorAll(`[${dataAttributes.OPTION}]`) as NodeListOf<HTMLElement>;

    if (!allOptionElements) {
      return;
    }

    for (const optionElement of allOptionElements) {
      const foundIndex = $selected.findIndex((selectedOption) => {
        return selectedOption.display === optionElement.getAttribute(dataAttributes.OPTION);
      });

      if (foundIndex === -1) {
        optionElement.removeAttribute(dataAttributes.DROP_DOWN_SELECTED);

        continue;
      }

      optionElement.setAttribute(dataAttributes.DROP_DOWN_SELECTED, '');
    }
  };

  const isOptionSelected = (option: TOptionValue) => {
    const $selected = get(selected);
    return (
      _.findIndex($selected, (selectedOption) => {
        return selectedOption.display === option.display;
      }) !== -1
    );
  };

  const containerAction = (element: HTMLElement) => {
    containerElement.set(element);
  };

  const labelAction = (element: HTMLLabelElement) => {
    labelElement.set(element);
  };

  const inputAction = (element: HTMLInputElement) => {
    inputElement.set(element);

    element.setAttribute(dataAttributes.INPUT, '');

    element.addEventListener('focus', () => {
      inputIsFocused.set(true);
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
      const $activeOptionIndex = get(activeOptionIndex);
      // @todo(refactor) I think we should use the internal active option index instead of querying the dom
      const highlightedElement = get(optionsElement)?.querySelector(`[${dataAttributes.HIGHLIGHTED}]`);

      inputIsFocused.set(false);

      // if the user click on an element, we don't want to close as we want to allow the user to select that value
      // so this conditional of setting the opened state handles that issue
      isOpened.set(!!highlightedElement);

      get(inputElement)?.removeAttribute(dataAttributes.INPUT_FOCUSED);

      if (isMultiple && $activeOptionIndex === undefined) {
        inputValue.set('');
      }
    });
  };

  const optionsAttachedAction = (element: HTMLElement) => {
    optionsAttachedElement.set(element);
  };

  const optionsAction: Action<HTMLElement, ComboboxOptionsActionOptions> = (element, options) => {
    // we want to make sure we close the menu if the user tabs to an element that is outside of the combobox
    // otherwise is might block content below that is should not
    const handleDocumentFocusin = () => {
      const $containerElement = get(containerElement);

      if (
        !$containerElement
        || !document.activeElement
        || !domUtils.isElementChildOf(document.activeElement as HTMLElement, $containerElement)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('focusin', handleDocumentFocusin);

    const actionReturn: ActionReturn<ComboboxOptionsActionOptions> = {
      destroy: () => {
        document.removeEventListener('focusin', handleDocumentFocusin);
      },
    };

    optionsElement.set(element);

    const $attachedElement = get(optionsAttachedElement);

    if (!$attachedElement) {
      return actionReturn;
    }

    const updateTooltipPosition = async () => {
      const floatingUiOptions = {
        placement: options.placement || 'bottom-start',
        middleware: [flip()],
      };

      if (options.offset) {
        floatingUiOptions.middleware.push(offset(options.offset));
      }

      const computedPosition = await computePosition($attachedElement, element, floatingUiOptions);

      Object.assign(element.style, {
        left: `${computedPosition.x}px`,
        top: `${computedPosition.y}px`,
        width: `${$attachedElement.getClientRects()[0].width}px`,
      });
    };

    updateTooltipPosition();

    return actionReturn;
  };

  const optionAction = (element: HTMLElement, options: OptionActionOptions<TOptionValue>) => {
    let elementIndex = options.optionIndex;
    let option = options.option;

    element.setAttribute(dataAttributes.OPTION, option.display);

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

  const clearOptionAction: Action<HTMLElement> = (element) => {
    element.setAttribute(dataAttributes.CLEAR_OPTION, '');

    element.addEventListener('mouseenter', () => {
      clearHighlightedOptionDataAttributes();
      element.setAttribute(dataAttributes.HIGHLIGHTED, '');
    });

    element.addEventListener('click', () => {
      clearSelected();
      closeMenu();
    });

    if (get(selected).length === 0) {
      element.setAttribute(dataAttributes.HIGHLIGHTED, '');
    }

    return {
      update: () => {
        if (get(selected).length === 0) {
          element.setAttribute(dataAttributes.HIGHLIGHTED, '');

          return;
        }

        element.removeAttribute(dataAttributes.HIGHLIGHTED);
      },
    };
  };

  inputValue.subscribe((value) => {
    if (isMultiple) {
      inputIsDirty.set(value !== '');

      return;
    }

    const selectedValue = get(selected);

    inputIsDirty.set(selectedValue.length > 0 ? value !== selectedValue[0].display : value !== '');
  });

  isOpened.subscribe((newIsOpened) => {
    const $inputElement = get(inputElement);

    if (newIsOpened) {
      $inputElement?.setAttribute(dataAttributes.SKIP_BLUR, '');

      return;
    }

    activeOptionIndex.set(undefined);
    $inputElement?.removeAttribute(dataAttributes.SKIP_BLUR);
    optionsElement.set(undefined);

    if (isMultiple) {
      return;
    }

    const selectedValue = get(selected);

    if (selectedValue.length !== 0) {
      return;
    }

    inputValue.set('');
  });

  activeOptionIndex.subscribe((newActiveOptionIndex) => {
    const $optionsElement = get(optionsElement);

    if (!$optionsElement || newActiveOptionIndex === undefined) {
      return;
    }

    const allOptionElements = $optionsElement.querySelectorAll(`[${dataAttributes.OPTION}]`) as NodeListOf<HTMLElement>;
    const matchingElement = allOptionElements[newActiveOptionIndex];

    if (!matchingElement) {
      return;
    }

    clearHighlightedOptionDataAttributes();
    matchingElement.setAttribute(dataAttributes.HIGHLIGHTED, '');
    domUtils.scrollToElement(matchingElement);
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
      inputValue.set('');
    }

    resetSelectedAttributes();

    // since management of the value of this component is unique, we want to manally trigger the change event
    // to allow code outside to be able to hook into native dom events (for things like validation)
    $inputElement.dispatchEvent(new Event('change', { bubbles: true }));
  });

  return {
    // state
    isOpened,
    inputValue,
    inputIsDirty,
    inputIsFocused,

    // elements
    containerElement,
    inputElement,
    optionsElement,

    // actions
    containerAction,
    labelAction,
    inputAction,
    optionsAttachedAction,
    optionsAction,
    optionAction,
    clearOptionAction: clearOptionAction,

    comboboxUtils: {
      increaseActiveOption,
      decreaseActiveOption,
      setActiveOption,
      clearActiveOption,
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
