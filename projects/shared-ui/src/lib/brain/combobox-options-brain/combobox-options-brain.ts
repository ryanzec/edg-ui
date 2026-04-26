import { Directive, computed, signal } from '@angular/core';
import { domUtils } from '@organization/shared-utils';

/** the internal state shape for the combobox-options brain directive */
type ComboboxOptionsState = {
  isScrollNeeded: boolean;
};

/**
 * headless brain directive for the combobox-options component. owns the scroll-needed state and the focused-option
 * scroll-into-view algorithm. brain stays decoupled from the parent combobox — the presentation runs the reactive
 * effects against parent state and calls these methods after the dom has settled.
 */
@Directive({
  selector: '[orgComboboxOptionsBrain]',
  exportAs: 'orgComboboxOptionsBrain',
})
export class ComboboxOptionsBrainDirective {
  private readonly _state = signal<ComboboxOptionsState>({
    isScrollNeeded: false,
  });

  /** whether the options container currently needs scrolling */
  public readonly isScrollNeeded = computed<boolean>(() => this._state().isScrollNeeded);

  /** recomputes whether the provided container needs vertical scrolling */
  public recalcScrollNeeded(container: HTMLElement | null): void {
    if (!container) {
      this._state.update((state) => ({ ...state, isScrollNeeded: false }));

      return;
    }

    const isScrollNeeded = domUtils.hasScrollableContent(container, 'vertical');

    this._state.update((state) => ({ ...state, isScrollNeeded }));
  }

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
