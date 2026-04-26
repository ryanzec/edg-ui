import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button } from '../button/button';
import { ButtonIcon } from '../button/button-icon';
import { PaginationStore } from '../pagination-store/pagination-store';

@Component({
  selector: 'org-pagination-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ButtonIcon],
  templateUrl: './pagination-navigation.html',
  styleUrl: './pagination-navigation.css',
})
export class PaginationNavigation {
  /** the pagination store shared with the parent pagination component. */
  protected readonly paginationStore = inject(PaginationStore);
}
