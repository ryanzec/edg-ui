import { Directive, computed, signal } from '@angular/core';
import { domUtils } from '@organization/shared-utils';

/** the internal state shape for the table brain directive */
type TableState = {
  isScrollNeeded: boolean;
};

/**
 * headless brain directive for the table component. owns the scroll-needed state for the optional scroll
 * indicators. presentation runs its own data-changed effect and calls `recalcScrollNeeded(container)` after the
 * dom has settled (typically via afterNextRender).
 */
@Directive({
  selector: '[orgTableBrain]',
  exportAs: 'orgTableBrain',
})
export class TableBrainDirective {
  private readonly _state = signal<TableState>({
    isScrollNeeded: false,
  });

  /** whether either scroll axis currently needs scrolling */
  public readonly isScrollNeeded = computed<boolean>(() => this._state().isScrollNeeded);

  /** recomputes whether the provided container needs scrolling on either axis */
  public recalcScrollNeeded(container: HTMLElement | null): void {
    if (!container) {
      this._state.update((state) => ({ ...state, isScrollNeeded: false }));

      return;
    }

    const hasVerticalScroll = domUtils.hasScrollableContent(container, 'vertical');
    const hasHorizontalScroll = domUtils.hasScrollableContent(container, 'horizontal');
    const isScrollNeeded = hasVerticalScroll || hasHorizontalScroll;

    this._state.update((state) => ({ ...state, isScrollNeeded }));
  }
}
