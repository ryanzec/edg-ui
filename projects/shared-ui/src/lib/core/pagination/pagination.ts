import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { PaginationBrainDirective } from '../../brain/pagination-brain/pagination-brain';
import { DropDownSelector } from '../drop-down-selector/drop-down-selector';
import { PaginationNavigation } from './pagination-navigation';

@Component({
  selector: 'org-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaginationNavigation, DropDownSelector],
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

  /** formatted text describing the current result range, e.g. "result 1 - 10 of 250" */
  protected readonly resultText = computed<string>(() => {
    const total = this.brain.totalItems();

    if (total === 0) {
      return 'result 0 - 0 of 0';
    }

    const start = this.brain.startIndex() + 1;
    const end = this.brain.endIndex();

    return `result ${start} - ${end} of ${total}`;
  });
}
