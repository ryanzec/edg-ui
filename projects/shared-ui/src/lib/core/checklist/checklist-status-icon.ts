import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';
import type { ChecklistItemStatus } from './checklist';

@Component({
  selector: 'org-checklist-status-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
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
