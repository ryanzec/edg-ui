import { Directive, computed, input, signal } from '@angular/core';
import { angularUtils, domUtils } from '@organization/shared-utils';
import { DataSelectionStore } from '../../core/data-selection-store/data-selection-store';

/** the internal state shape for the table brain directive */
type TableState = {
  isScrollNeeded: boolean;
};

/** default value for the isLoading input */
export const TABLE_IS_LOADING_DEFAULT = false;

/** default value for the isBackgroundLoading input */
export const TABLE_IS_BACKGROUND_LOADING_DEFAULT = false;

/** default value for the selectionData input */
export const TABLE_SELECTION_DATA_DEFAULT: DataSelectionStore<{ id: string }> | undefined = undefined;

/** default value for the expandedData input */
export const TABLE_EXPANDED_DATA_DEFAULT: DataSelectionStore<{ id: string }> | undefined = undefined;

/** the routing mode for a body row click; the presentation chooses behavior from this */
export type TableRowClickMode = 'expand' | 'select' | 'emit' | 'none';

/**
 * headless brain directive for the table component. owns the loading state, selection state, scroll-needed
 * state, the static / dynamic accessibility surface (aria-busy), and the clear-selection event handler.
 * presentation runs its own data-changed effect and calls `recalcScrollNeeded(container)` after the dom has
 * settled (typically via afterNextRender).
 */
@Directive({
  selector: '[orgTableBrain]',
  exportAs: 'orgTableBrain',
  host: {
    '[attr.aria-busy]': 'ariaBusy()',
  },
})
export class TableBrainDirective {
  private readonly _state = signal<TableState>({
    isScrollNeeded: false,
  });

  /** whether the blocking loading overlay should be shown (drives aria-busy) */
  public readonly isLoading = input<boolean>(TABLE_IS_LOADING_DEFAULT);

  /** whether the background loading indicator should be shown (e.g. data refresh) */
  public readonly isBackgroundLoading = input<boolean>(TABLE_IS_BACKGROUND_LOADING_DEFAULT);

  /** selection store driving the built-in selection column and selected actions bar */
  public readonly selectionData = input<
    DataSelectionStore<{ id: string }> | undefined,
    DataSelectionStore<{ id: string }> | null | undefined
  >(TABLE_SELECTION_DATA_DEFAULT, { transform: angularUtils.transformNullToUndefined });

  /** expansion store driving which rows render their expanded section */
  public readonly expandedData = input<
    DataSelectionStore<{ id: string }> | undefined,
    DataSelectionStore<{ id: string }> | null | undefined
  >(TABLE_EXPANDED_DATA_DEFAULT, { transform: angularUtils.transformNullToUndefined });

  /** whether either scroll axis currently needs scrolling */
  public readonly isScrollNeeded = computed<boolean>(() => this._state().isScrollNeeded);

  /** number of currently selected rows (derived from selectionData) */
  public readonly selectedCount = computed<number>(() => this.selectionData()?.selectedCount() ?? 0);

  /** whether any rows are currently selected */
  public readonly hasSelection = computed<boolean>(() => this.selectionData()?.hasSelection() ?? false);

  /** whether selection mode is active (selectionData was supplied) */
  public readonly hasSelectionEnabled = computed<boolean>(() => !!this.selectionData());

  /** whether expansion mode is active (expandedData was supplied) */
  public readonly hasExpansionEnabled = computed<boolean>(() => !!this.expandedData());

  /** the resolved aria-busy value, returning 'true' when loading and null otherwise */
  public readonly ariaBusy = computed<'true' | null>(() => {
    if (this.isLoading()) {
      return 'true';
    }

    return null;
  });

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

  /** clears the current selection via the provided selectionData store */
  public clearSelection(): void {
    this.selectionData()?.clear();
  }

  /** clears the current expansion via the provided expandedData store */
  public clearExpansion(): void {
    this.expandedData()?.clear();
  }
}
