import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import type { ChecklistItemStatus } from './checklist';

@Component({
  selector: 'org-checklist-status-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, LoadingSpinner],
  templateUrl: './checklist-status-icon.html',
  styleUrl: './checklist-status-icon.css',
  host: {
    '[attr.data-status]': 'status()',
  },
})
export class ChecklistStatusIcon {
  /** the status to render an icon for. */
  public readonly status = input.required<ChecklistItemStatus>();
}
