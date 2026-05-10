import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PaginationBrainDirective } from '../../brain/pagination-brain/pagination-brain';
import { Button } from '../button/button';

@Component({
  selector: 'org-pagination-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  templateUrl: './pagination-navigation.html',
  styleUrl: './pagination-navigation.css',
  host: {
    '(keydown)': 'brain.handleKeyDown($event)',
  },
})
export class PaginationNavigation {
  /** the pagination brain directive applied to the parent org-pagination element */
  protected readonly brain = inject(PaginationBrainDirective);
}
