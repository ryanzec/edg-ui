import { Directive, computed, inject } from '@angular/core';
import { domUtils } from '@organization/shared-utils';
import { ComboboxBrainDirective } from './combobox-brain';

/** static a11y role applied to the listbox container */
export const COMBOBOX_OPTIONS_LISTBOX_ROLE = 'listbox';

/** static a11y aria-label applied to the listbox container */
export const COMBOBOX_OPTIONS_LISTBOX_ARIA_LABEL = 'Options';

/** static a11y role applied to a group wrapper */
export const COMBOBOX_OPTIONS_GROUP_ROLE = 'group';

/**
 * headless brain directive for the combobox-options component. owns the scroll-needed state, the focused-option
 * scroll-into-view algorithm, and the static a11y attribute values applied to the listbox / group elements.
 * proxies the parent combobox brain's `listboxId` so the listbox dom id stays in sync with the input's
 * `aria-controls`.
 */
@Directive({
  selector: '[orgComboboxOptionsBrain]',
  exportAs: 'orgComboboxOptionsBrain',
})
export class ComboboxOptionsBrainDirective {
  private readonly _comboboxBrain = inject(ComboboxBrainDirective);

  /** static a11y role applied to the listbox container */
  public readonly listboxRole = COMBOBOX_OPTIONS_LISTBOX_ROLE;

  /** static a11y aria-label applied to the listbox container */
  public readonly listboxAriaLabel = COMBOBOX_OPTIONS_LISTBOX_ARIA_LABEL;

  /** static a11y role applied to a group wrapper */
  public readonly groupRole = COMBOBOX_OPTIONS_GROUP_ROLE;

  /** dom id for the listbox element, proxied from the parent combobox brain */
  public readonly listboxId = computed<string>(() => this._comboboxBrain.listboxId());

  /** scrolls the option matching `data-option-value="<value>"` into view if it is completely out of view */
  public scrollOptionIntoViewIfNeeded(container: HTMLElement | null, optionValue: string | number): void {
    if (!container) {
      return;
    }

    const focusedElement = container.querySelector(`[data-option-value="${optionValue}"]`);

    if (!focusedElement) {
      return;
    }

    const isCompletelyOutOfView = domUtils.isElementOutOfView(container, focusedElement as HTMLElement);

    if (!isCompletelyOutOfView) {
      return;
    }

    focusedElement.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  }
}
