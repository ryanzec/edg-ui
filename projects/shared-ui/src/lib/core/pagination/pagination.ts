import { Component, ChangeDetectionStrategy, input, model, inject, computed, effect } from '@angular/core';
import { PaginationStore, type PaginationState } from '../pagination-store/pagination-store';
import { PaginationNavigation } from './pagination-navigation';

// the parent of `org-pagination` is responsible for providing `PaginationStore`; the component does not provide its
// own so that consumers can read pagination state (start/end indices, etc.) from the same store instance

/** default value for the currentPage input */
export const PAGINATION_CURRENT_PAGE_DEFAULT = 1;

/** default value for the totalItems input */
export const PAGINATION_TOTAL_ITEMS_DEFAULT = 0;

/** default value for the itemsPerPage input */
export const PAGINATION_ITEMS_PER_PAGE_DEFAULT = 10;

/** default value for the visiblePages input */
export const PAGINATION_VISIBLE_PAGES_DEFAULT = 7;

/** default value for the itemsPerPageOptions input */
export const PAGINATION_ITEMS_PER_PAGE_OPTIONS_DEFAULT: number[] = [5, 10, 20, 50];

/** default value for the disabled input */
export const PAGINATION_DISABLED_DEFAULT = false;

@Component({
  selector: 'org-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaginationNavigation],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
  host: {
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class Pagination {
  private readonly _paginationStore = inject(PaginationStore);

  /** the current active page number; supports two-way binding */
  public currentPage = model<number>(PAGINATION_CURRENT_PAGE_DEFAULT);

  /** total number of items in the dataset */
  public totalItems = input<number>(PAGINATION_TOTAL_ITEMS_DEFAULT);

  /** number of items per page; supports two-way binding */
  public itemsPerPage = model<number>(PAGINATION_ITEMS_PER_PAGE_DEFAULT);

  /** number of visible page buttons to display; odd numbers recommended */
  public visiblePages = input<number>(PAGINATION_VISIBLE_PAGES_DEFAULT);

  /** available options for the items-per-page selector */
  public itemsPerPageOptions = input<number[]>(PAGINATION_ITEMS_PER_PAGE_OPTIONS_DEFAULT);

  /** whether all pagination interactions are disabled */
  public disabled = input<boolean>(PAGINATION_DISABLED_DEFAULT);

  private readonly _inputState = computed<Partial<PaginationState>>(() => ({
    currentPage: this.currentPage(),
    totalItems: this.totalItems(),
    itemsPerPage: this.itemsPerPage(),
    visiblePages: this.visiblePages(),
    itemsPerPageOptions: this.itemsPerPageOptions(),
    disabled: this.disabled(),
  }));

  constructor() {
    /** synchronizes all component inputs to the pagination store on every change */
    effect(() => {
      this._paginationStore.setState(this._inputState());
    });

    /** keeps the currentPage model in sync when the store's active page changes via sub-component navigation */
    effect(() => {
      this.currentPage.set(this._paginationStore.activePage());
    });
  }

  protected readonly activeItemsPerPage = this._paginationStore.activeItemsPerPage;
  protected readonly resultText = this._paginationStore.resultText;

  /** updates the items-per-page setting and resets to page 1; both are batched into one atomic store update via the effect */
  protected itemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage.set(itemsPerPage);
    this.currentPage.set(1);
  }
}
