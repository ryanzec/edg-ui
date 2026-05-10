import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { PaginationBrainDirective } from '../../brain/pagination-brain/pagination-brain';
import { Button } from '../button/button';
import { DropDownSelector } from '../drop-down-selector/drop-down-selector';

@Component({
  selector: 'org-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DropDownSelector],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
  hostDirectives: [
    {
      directive: PaginationBrainDirective,
      inputs: [
        'totalItems',
        'visiblePages',
        'itemsPerPageOptions',
        'disabled',
        'currentPage',
        'itemsPerPage',
        'ariaLabel',
        'firstPageAriaLabel',
        'previousPageAriaLabel',
        'nextPageAriaLabel',
        'lastPageAriaLabel',
        'itemsPerPageAriaLabel',
        'pageAriaLabelFn',
      ],
      outputs: ['currentPageChange', 'itemsPerPageChange'],
    },
  ],
  host: {
    '[attr.data-disabled]': 'brain.disabled() ? "" : null',
  },
})
export class Pagination {
  protected readonly brain = inject(PaginationBrainDirective, { self: true });

  /** the 1-based starting index of the current page, or 0 when totalItems is 0 */
  protected readonly displayStart = computed<number>(() => {
    if (this.brain.totalItems() === 0) {
      return 0;
    }

    return this.brain.startIndex() + 1;
  });

  /** the 1-based ending index of the current page (clamped to totalItems) */
  protected readonly displayEnd = computed<number>(() => this.brain.endIndex());

  /** the total number of items in the dataset */
  protected readonly displayTotal = computed<number>(() => this.brain.totalItems());
}
