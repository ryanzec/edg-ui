import { Injectable, computed, signal } from '@angular/core';
import { logManager } from '@organization/shared-utils';

/** state shape for the pagination store */
export type PaginationState = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  visiblePages: number;
  itemsPerPageOptions: number[];
  disabled: boolean;
};

/** represents a single item in the visible pages list, either a page number or an ellipsis */
export type VisiblePage = {
  type: 'page' | 'ellipsis';
  value: number | null;
  isActive: boolean;
};

@Injectable()
export class PaginationStore {
  private _hasInitialized = false;

  private readonly _state = signal<PaginationState>({
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 10,
    visiblePages: 7,
    itemsPerPageOptions: [5, 10, 20, 50],
    disabled: false,
  });

  /** the current active page number */
  public readonly activePage = computed<number>(() => this._state().currentPage);

  /** the current items per page setting */
  public readonly activeItemsPerPage = computed<number>(() => this._state().itemsPerPage);

  /** total number of items across all pages */
  public readonly totalItems = computed<number>(() => this._state().totalItems);

  /** whether pagination interaction is disabled */
  public readonly disabled = computed<boolean>(() => this._state().disabled);

  /** available items-per-page options */
  public readonly itemsPerPageOptions = computed<number[]>(() => this._state().itemsPerPageOptions);

  /** number of visible page buttons to display */
  public readonly visiblePages = computed<number>(() => this._state().visiblePages);

  /** total number of pages based on totalItems and itemsPerPage */
  public readonly totalPages = computed<number>(
    () => Math.ceil(this._state().totalItems / this._state().itemsPerPage) || 1
  );

  /** 0-based starting index of the current page */
  public readonly startIndex = computed<number>(() => (this._state().currentPage - 1) * this._state().itemsPerPage);

  /** 0-based ending index of the current page */
  public readonly endIndex = computed<number>(() =>
    Math.min(this.startIndex() + this._state().itemsPerPage, this._state().totalItems)
  );

  /** whether a previous page exists */
  public readonly hasPrevious = computed<boolean>(() => this._state().currentPage > 1);

  /** whether a next page exists */
  public readonly hasNext = computed<boolean>(() => this._state().currentPage < this.totalPages());

  /** ordered list of page items to render, including ellipsis placeholders */
  public readonly visiblePageItems = computed<VisiblePage[]>(() => {
    const totalPages = this.totalPages();
    const currentPage = this._state().currentPage;
    let visiblePages = this._state().visiblePages;

    if (visiblePages % 2 === 0) {
      logManager.warn({
        type: 'pagination-store-visible-pages-even',
        message: `it is recommended to use an odd number to avoid uneven numbers of the left / right`,
        setVisiblePages: visiblePages,
      });
      visiblePages = visiblePages + 1;
    }

    if (totalPages <= visiblePages) {
      return Array.from({ length: totalPages }, (_, i) => ({
        type: 'page',
        value: i + 1,
        isActive: i + 1 === currentPage,
      }));
    }

    const pages: VisiblePage[] = [];

    pages.push({
      type: 'page',
      value: 1,
      isActive: currentPage === 1,
    });

    // calculate how many pages we can show in the middle (excluding first and last)
    const middlePages = visiblePages - 2; // reserve space for first and last page
    const halfMiddle = Math.floor(middlePages / 2);

    // determine the range of pages to show around current
    let startPage = Math.max(2, currentPage - halfMiddle);
    let endPage = Math.min(totalPages - 1, currentPage + halfMiddle);

    // adjust range to always show exactly middlePages when possible
    if (endPage - startPage + 1 < middlePages) {
      if (startPage === 2) {
        // we're at the beginning, extend to the right
        endPage = Math.min(totalPages - 1, startPage + middlePages - 1);
      } else if (endPage === totalPages - 1) {
        // we're at the end, extend to the left
        startPage = Math.max(2, endPage - middlePages + 1);
      }
    }

    if (startPage > 2) {
      pages.push({
        type: 'ellipsis',
        value: null,
        isActive: false,
      });
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push({
        type: 'page',
        value: i,
        isActive: i === currentPage,
      });
    }

    if (endPage < totalPages - 1) {
      pages.push({
        type: 'ellipsis',
        value: null,
        isActive: false,
      });
    }

    if (totalPages > 1) {
      pages.push({
        type: 'page',
        value: totalPages,
        isActive: currentPage === totalPages,
      });
    }

    return pages;
  });

  /** formatted text describing the current result range, e.g. "result 1 - 10 of 250" */
  public readonly resultText = computed<string>(() => {
    const total = this._state().totalItems;

    if (total === 0) {
      return 'result 0 - 0 of 0';
    }

    const start = this.startIndex() + 1;
    const end = this.endIndex();

    return `result ${start} - ${end} of ${total}`;
  });

  /**
   * initializes the store with the given partial state; subsequent calls are ignored
   */
  public initialize(state: Partial<PaginationState>): void {
    if (this._hasInitialized) {
      return;
    }

    this._hasInitialized = true;

    this.setState(state);
  }

  /**
   * merges the given partial state into the current state, applying validation rules
   */
  public setState(partialState: Partial<PaginationState>): void {
    this._state.update((currentState) => {
      const newState = { ...currentState };

      // update itemsPerPageOptions first if provided, as it's needed for validation
      if (partialState.itemsPerPageOptions !== undefined) {
        newState.itemsPerPageOptions = partialState.itemsPerPageOptions;
      }

      if (partialState.itemsPerPage !== undefined) {
        if (newState.itemsPerPageOptions.includes(partialState.itemsPerPage)) {
          newState.itemsPerPage = partialState.itemsPerPage;
        }
      }

      if (partialState.totalItems !== undefined) {
        newState.totalItems = Math.max(0, partialState.totalItems);
      }

      if (partialState.visiblePages !== undefined) {
        newState.visiblePages = partialState.visiblePages;
      }

      if (partialState.disabled !== undefined) {
        newState.disabled = partialState.disabled;
      }

      // calculate total pages with potentially updated values
      const newTotalPages = Math.ceil(newState.totalItems / newState.itemsPerPage) || 1;

      // validate and update currentPage last, as it depends on totalPages
      if (partialState.currentPage !== undefined) {
        newState.currentPage = Math.max(1, Math.min(partialState.currentPage, newTotalPages));
      }

      // adjust current page if it exceeds new total pages (even if not explicitly updated)
      if (newState.currentPage > newTotalPages) {
        newState.currentPage = Math.max(1, newTotalPages);
      }

      return newState;
    });
  }

  /**
   * navigates to the given page number; returns the page navigated to
   * no-op if the store is disabled
   */
  public goToPage(page: number): number {
    if (this._state().disabled) {
      return this._state().currentPage;
    }

    const totalPages = this.totalPages();
    const validPage = Math.max(1, Math.min(page, totalPages));
    this.setState({ currentPage: validPage });

    return validPage;
  }

  /**
   * navigates to the previous page; returns the page navigated to
   * no-op if the store is disabled or there is no previous page
   */
  public goToPreviousPage(): number {
    if (this._state().disabled) {
      return this.activePage();
    }

    if (this.hasPrevious()) {
      const newPage = this.activePage() - 1;
      this.setState({ currentPage: newPage });

      return newPage;
    }

    return this.activePage();
  }

  /**
   * navigates to the next page; returns the page navigated to
   * no-op if the store is disabled or there is no next page
   */
  public goToNextPage(): number {
    if (this._state().disabled) {
      return this.activePage();
    }

    if (this.hasNext()) {
      const newPage = this.activePage() + 1;
      this.setState({ currentPage: newPage });

      return newPage;
    }

    return this.activePage();
  }

  /**
   * navigates to the first page; returns 1
   * no-op if the store is disabled
   */
  public goToFirstPage(): number {
    if (this._state().disabled) {
      return this.activePage();
    }

    this.setState({ currentPage: 1 });

    return 1;
  }

  /**
   * navigates to the last page; returns the last page number
   * no-op if the store is disabled
   */
  public goToLastPage(): number {
    if (this._state().disabled) {
      return this.activePage();
    }

    const lastPage = this.totalPages();
    this.setState({ currentPage: lastPage });

    return lastPage;
  }
}
