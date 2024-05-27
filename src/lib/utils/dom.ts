import getScrollParent from 'scrollparent';

const inputNodeNames = ['INPUT', 'SELECT', 'TEXTAREA'];

export enum InputType {
  NONE = 'none',
  TEXT = 'text',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SELECT = 'select',
  TEXTAREA = 'textarea',
}

const isFormInputElement = (element?: Element) => {
  if (!element) {
    return false;
  }

  return inputNodeNames.includes(element.nodeName);
};

const isElement = (element?: Element) => {
  return element?.nodeType === Node.ELEMENT_NODE;
};

const getInputType = (element?: Element) => {
  if (!element) {
    return InputType.NONE;
  }

  if (element.nodeName === 'SELECT') {
    return InputType.SELECT;
  }

  if (element.nodeName === 'TEXTAREA') {
    return InputType.TEXTAREA;
  }

  const inputType = element.attributes.getNamedItem('type')?.value;

  switch (inputType) {
    case 'checkbox':
      return InputType.CHECKBOX;

    case 'radio':
      return InputType.RADIO;
  }

  return InputType.TEXT;
};

const getFormInputElementsRecursive = (element: Element) => {
  const formInputs: Element[] = [];
  const elementsToCheck: Element[] = [element];
  let currentElement: Element | undefined;

  while (elementsToCheck.length > 0) {
    currentElement = elementsToCheck.shift();

    if (!currentElement || !currentElement.children) {
      continue;
    }

    // this while recursively process all children elements
    for (const child of currentElement.children) {
      elementsToCheck.push(child);
    }

    if (!isFormInputElement(currentElement)) {
      continue;
    }

    formInputs.push(currentElement);
  }

  return formInputs;
};

export enum ViewCutoffLocation {
  NONE = 'none',
  TOP = 'top',
  BOTTOM = 'bottom',
}

const elementInView = (parent: HTMLElement, element: HTMLElement, completelyViewable = true): ViewCutoffLocation => {
  const scrollAreaTop = parent.scrollTop;
  const scrollAreaBottom = scrollAreaTop + parent.clientHeight;
  const elementTop = element.offsetTop;
  const elementBottom = elementTop + element.clientHeight;

  if (completelyViewable) {
    if (scrollAreaTop > elementTop) {
      return ViewCutoffLocation.BOTTOM;
    }

    if (scrollAreaBottom < elementBottom) {
      return ViewCutoffLocation.TOP;
    }
  } else {
    if (elementTop >= scrollAreaBottom) {
      return ViewCutoffLocation.BOTTOM;
    }

    if (elementBottom <= scrollAreaTop) {
      return ViewCutoffLocation.TOP;
    }
  }

  return ViewCutoffLocation.NONE;
};

const scrollToElement = (elementToScrollTo: HTMLElement) => {
  if (!elementToScrollTo) {
    return;
  }

  const scrollParentElement = getScrollParent(elementToScrollTo);

  if (!scrollParentElement) {
    return;
  }

  const viewCutoffPosition = elementInView(scrollParentElement, elementToScrollTo);

  if (viewCutoffPosition === ViewCutoffLocation.NONE) {
    return;
  }

  let top = elementToScrollTo.offsetTop;

  if (viewCutoffPosition === ViewCutoffLocation.TOP) {
    top -= scrollParentElement.getBoundingClientRect().height - elementToScrollTo.clientHeight;
  }

  scrollParentElement.scrollTo({
    top,
    behavior: 'auto',
  });
};

const isElementChildOf = (child: HTMLElement, parent: HTMLElement) => {
  if (!child || !parent) {
    return false;
  }

  return parent.contains(child);
};

export const domUtils = {
  isFormInputElement,
  isElement,
  getInputType,
  getFormInputElementsRecursive,
  elementInView,
  scrollToElement,
  isElementChildOf,
};
