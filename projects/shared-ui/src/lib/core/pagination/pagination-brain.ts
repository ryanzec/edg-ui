import { Directive, computed, effect, input, model, untracked } from '@angular/core';
import { logManager } from '@organization/shared-utils';
import type { SelectionValue } from '../drop-down-selector/drop-down-selector-brain';

/** default value for the totalItems input */
export const PAGINATION_TOTAL_ITEMS_DEFAULT = 0;

/** default value for the visiblePages input */
export const PAGINATION_VISIBLE_PAGES_DEFAULT = 7;

/** default value for the itemsPerPageOptions input */
export const PAGINATION_ITEMS_PER_PAGE_OPTIONS_DEFAULT: number[] = [5, 10, 20, 50];

/** default value for the disabled input */
export const PAGINATION_DISABLED_DEFAULT = false;

/** default value for the currentPage model */
export const PAGINATION_CURRENT_PAGE_DEFAULT = 1;

/** default value for the itemsPerPage model */
export const PAGINATION_ITEMS_PER_PAGE_DEFAULT = 10;

/** default value for the ariaLabel input */
export const PAGINATION_ARIA_LABEL_DEFAULT = 'pagination';

/** default value for the firstPageAriaLabel input */
export const PAGINATION_FIRST_PAGE_ARIA_LABEL_DEFAULT = 'First page';

/** default value for the previousPageAriaLabel input */
export const PAGINATION_PREVIOUS_PAGE_ARIA_LABEL_DEFAULT = 'Previous page';

/** default value for the nextPageAriaLabel input */
export const PAGINATION_NEXT_PAGE_ARIA_LABEL_DEFAULT = 'Next page';

/** default value for the lastPageAriaLabel input */
export const PAGINATION_LAST_PAGE_ARIA_LABEL_DEFAULT = 'Last page';

/** default value for the itemsPerPageAriaLabel input */
export const PAGINATION_ITEMS_PER_PAGE_ARIA_LABEL_DEFAULT = 'Rows per page';

/** default value for the pageAriaLabelFn input */
export const PAGINATION_PAGE_ARIA_LABEL_FN_DEFAULT: (page: number) => string = (page) => `Page ${page}`;

/** represents a single item in the visible pages list, either a page number or an ellipsis */
export type VisiblePage = {
  type: 'page' | 'ellipsis';
  value: number | null;
  isActive: boolean;
};

/**
 * headless brain directive for the pagination component. owns the active-page and items-per-page state
 * (both two-way bindable models), the validation/clamping rules that keep the current page in range when
 * total items or items-per-page change, the visible-page-items computation (numbers and ellipsis
 * placeholders), all per-button derived disabled signals, the keyboard navigation handler
 * (arrow-left/right and home/end change the active page), and the pagination accessibility surface
 * (navigation role, aria-label, aria-disabled, configurable per-button labels). carries no styling,
 * template, or markup — apply alongside a presentation that renders the navigation buttons and the
 * items-per-page selector.
 */
@Directive({
  selector: '[orgPaginationBrain]',
  exportAs: 'orgPaginationBrain',
  host: {
    role: 'navigation',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-disabled]': 'ariaDisabled()',
  },
})
export class PaginationBrainDirective {
  /** total number of items in the dataset */
  public readonly totalItems = input<number>(PAGINATION_TOTAL_ITEMS_DEFAULT);

  /** number of visible page buttons to display; odd numbers recommended */
  public readonly visiblePages = input<number>(PAGINATION_VISIBLE_PAGES_DEFAULT);

  /** available items-per-page options */
  public readonly itemsPerPageOptions = input<number[]>(PAGINATION_ITEMS_PER_PAGE_OPTIONS_DEFAULT);

  /** whether all pagination interaction is disabled */
  public readonly disabled = input<boolean>(PAGINATION_DISABLED_DEFAULT);

  /** the current active page number; supports two-way binding */
  public readonly currentPage = model<number>(PAGINATION_CURRENT_PAGE_DEFAULT);

  /** the number of items per page; supports two-way binding */
  public readonly itemsPerPage = model<number>(PAGINATION_ITEMS_PER_PAGE_DEFAULT);

  /** accessible label applied to the navigation landmark */
  public readonly ariaLabel = input<string>(PAGINATION_ARIA_LABEL_DEFAULT);

  /** accessible label applied to the first-page button */
  public readonly firstPageAriaLabel = input<string>(PAGINATION_FIRST_PAGE_ARIA_LABEL_DEFAULT);

  /** accessible label applied to the previous-page button */
  public readonly previousPageAriaLabel = input<string>(PAGINATION_PREVIOUS_PAGE_ARIA_LABEL_DEFAULT);

  /** accessible label applied to the next-page button */
  public readonly nextPageAriaLabel = input<string>(PAGINATION_NEXT_PAGE_ARIA_LABEL_DEFAULT);

  /** accessible label applied to the last-page button */
  public readonly lastPageAriaLabel = input<string>(PAGINATION_LAST_PAGE_ARIA_LABEL_DEFAULT);

  /** accessible label applied to the items-per-page selector trigger */
  public readonly itemsPerPageAriaLabel = input<string>(PAGINATION_ITEMS_PER_PAGE_ARIA_LABEL_DEFAULT);

  /** function that produces the accessible label for a numeric page button given its page number */
  public readonly pageAriaLabelFn = input<(page: number) => string>(PAGINATION_PAGE_ARIA_LABEL_FN_DEFAULT);

  /** static aria-hidden value applied to the ellipsis placeholders */
  public readonly ellipsisAriaHidden = 'true' as const;

  /** the current active page number */
  public readonly activePage = computed<number>(() => this.currentPage());

  /** the current items-per-page value */
  public readonly activeItemsPerPage = computed<number>(() => this.itemsPerPage());

  /** total number of pages based on totalItems and itemsPerPage */
  public readonly totalPages = computed<number>(() => Math.ceil(this.totalItems() / this.itemsPerPage()) || 1);

  /** 0-based starting index of the current page */
  public readonly startIndex = computed<number>(() => (this.currentPage() - 1) * this.itemsPerPage());

  /** 0-based ending index of the current page */
  public readonly endIndex = computed<number>(() =>
    Math.min(this.startIndex() + this.itemsPerPage(), this.totalItems())
  );

  /** whether a previous page exists */
  public readonly hasPrevious = computed<boolean>(() => this.currentPage() > 1);

  /** whether a next page exists */
  public readonly hasNext = computed<boolean>(() => this.currentPage() < this.totalPages());

  /** whether the first-page button is disabled */
  public readonly firstPageDisabled = computed<boolean>(() => this.disabled() || !this.hasPrevious());

  /** whether the previous-page button is disabled */
  public readonly previousPageDisabled = computed<boolean>(() => this.disabled() || !this.hasPrevious());

  /** whether the next-page button is disabled */
  public readonly nextPageDisabled = computed<boolean>(() => this.disabled() || !this.hasNext());

  /** whether the last-page button is disabled */
  public readonly lastPageDisabled = computed<boolean>(() => this.disabled() || !this.hasNext());

  /** whether the items-per-page selector is disabled */
  public readonly itemsPerPageSelectDisabled = computed<boolean>(() => this.disabled());

  /** the resolved aria-disabled value, returning 'true' when disabled and null otherwise */
  public readonly ariaDisabled = computed<'true' | null>(() => {
    if (this.disabled()) {
      return 'true';
    }

    return null;
  });

  /** ordered list of page items to render, including ellipsis placeholders */
  public readonly visiblePageItems = computed<VisiblePage[]>(() => {
    const totalPages = this.totalPages();
    const currentPage = this.currentPage();
    let visiblePages = this.visiblePages();

    if (visiblePages % 2 === 0) {
      logManager.warn({
        type: 'pagination-brain-visible-pages-even',
        message: 'it is recommended to use an odd number to avoid uneven numbers of the left / right',
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
    const middlePages = visiblePages - 2;
    const halfMiddle = Math.floor(middlePages / 2);

    // determine the range of pages to show around current
    let startPage = Math.max(2, currentPage - halfMiddle);
    let endPage = Math.min(totalPages - 1, currentPage + halfMiddle);

    // adjust range to always show exactly middlePages when possible
    if (endPage - startPage + 1 < middlePages) {
      if (startPage === 2) {
        endPage = Math.min(totalPages - 1, startPage + middlePages - 1);
      } else if (endPage === totalPages - 1) {
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

  /** items-per-page options shaped for the drop-down-selector items input */
  public readonly itemsPerPageSelectionItems = computed<SelectionValue<number>[]>(() =>
    this.itemsPerPageOptions().map((option) => ({
      value: option,
      display: String(option),
    }))
  );

  /** currently selected items-per-page item shaped for the drop-down-selector selectedItems model */
  public readonly itemsPerPageSelectedItems = computed<SelectionValue<number>[]>(() => {
    const active = this.itemsPerPage();
    const match = this.itemsPerPageSelectionItems().find((item) => item.value === active);

    if (!match) {
      return [];
    }

    return [match];
  });

  public constructor() {
    /** clamps the current page back into range when totalPages drops below it */
    effect(() => {
      const totalPages = this.totalPages();
      const current = untracked(() => this.currentPage());

      if (current < 1) {
        this.currentPage.set(1);

        return;
      }

      if (current > totalPages) {
        this.currentPage.set(Math.max(1, totalPages));
      }
    });

    /** resets items-per-page to the first available option when the active value is no longer offered */
    effect(() => {
      const options = this.itemsPerPageOptions();
      const current = untracked(() => this.itemsPerPage());

      if (options.includes(current)) {
        return;
      }

      this.itemsPerPage.set(options[0] ?? PAGINATION_ITEMS_PER_PAGE_DEFAULT);
    });
  }

  /** returns the accessible label for the numeric page button at the given page number */
  public pageButtonAriaLabel(page: number): string {
    return this.pageAriaLabelFn()(page);
  }

  /**
   * navigates to the given page number; returns the page navigated to.
   * no-op when disabled.
   */
  public goToPage(page: number): number {
    if (this.disabled()) {
      return this.currentPage();
    }

    const totalPages = this.totalPages();
    const validPage = Math.max(1, Math.min(page, totalPages));

    this.currentPage.set(validPage);

    return validPage;
  }

  /**
   * navigates to the previous page; returns the page navigated to.
   * no-op when disabled or when there is no previous page.
   */
  public goToPreviousPage(): number {
    if (this.disabled()) {
      return this.currentPage();
    }

    if (!this.hasPrevious()) {
      return this.currentPage();
    }

    const newPage = this.currentPage() - 1;
    this.currentPage.set(newPage);

    return newPage;
  }

  /**
   * navigates to the next page; returns the page navigated to.
   * no-op when disabled or when there is no next page.
   */
  public goToNextPage(): number {
    if (this.disabled()) {
      return this.currentPage();
    }

    if (!this.hasNext()) {
      return this.currentPage();
    }

    const newPage = this.currentPage() + 1;
    this.currentPage.set(newPage);

    return newPage;
  }

  /**
   * navigates to the first page; returns 1.
   * no-op when disabled.
   */
  public goToFirstPage(): number {
    if (this.disabled()) {
      return this.currentPage();
    }

    this.currentPage.set(1);

    return 1;
  }

  /**
   * navigates to the last page; returns the last page number.
   * no-op when disabled.
   */
  public goToLastPage(): number {
    if (this.disabled()) {
      return this.currentPage();
    }

    const lastPage = this.totalPages();
    this.currentPage.set(lastPage);

    return lastPage;
  }

  /**
   * sets the items-per-page value; only applies when the value is one of the allowed options. resets
   * the current page back to 1 so the user lands on the first page of the resized result set.
   * no-op when disabled.
   */
  public setItemsPerPage(value: number): void {
    if (this.disabled()) {
      return;
    }

    if (!this.itemsPerPageOptions().includes(value)) {
      return;
    }

    this.itemsPerPage.set(value);
    this.currentPage.set(1);
  }

  /** unwraps a drop-down-selector single-selection change into a setItemsPerPage call */
  public handleItemsPerPageSelectionChange(items: SelectionValue<number>[]): void {
    const next = items[0];

    if (!next) {
      return;
    }

    this.setItemsPerPage(next.value);
  }

  /**
   * keyboard navigation handler for the navigation buttons. arrow-left / arrow-right move active page
   * back / forward, home / end jump to the first / last page. focus stays on the user's currently
   * focused button so native enter / space activation continues to work.
   */
  public handleKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft': {
        event.preventDefault();
        this.goToPreviousPage();

        return;
      }

      case 'ArrowRight': {
        event.preventDefault();
        this.goToNextPage();

        return;
      }

      case 'Home': {
        event.preventDefault();
        this.goToFirstPage();

        return;
      }

      case 'End': {
        event.preventDefault();
        this.goToLastPage();

        return;
      }
    }
  }
}
