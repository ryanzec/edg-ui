import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ChecklistBrainDirective } from '../../brain/checklist-brain/checklist-brain';
import { ChecklistItem } from './checklist-item';

/** all possible status values for a checklist item */
export const allChecklistItemStatuses = ['not-started', 'in-progress', 'valid', 'invalid'] as const;

/** status of a single checklist item */
export type ChecklistItemStatus = 'not-started' | 'in-progress' | 'valid' | 'invalid';

/** base data structure for a checklist item without nesting support */
export type BaseChecklistItemData = {
  id: string;
  label: string;
  status: ChecklistItemStatus;
};

/** data structure for a checklist item, optionally supporting one level of nested sub-items */
export type ChecklistItemData = BaseChecklistItemData & {
  items?: BaseChecklistItemData[];
};

@Component({
  selector: 'org-checklist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChecklistItem],
  templateUrl: './checklist.html',
  styleUrl: './checklist.css',
  hostDirectives: [ChecklistBrainDirective],
  host: {
    role: 'list',
  },
})
export class Checklist {
  /** array of checklist items to display */
  public readonly items = input.required<ChecklistItemData[]>();
}
