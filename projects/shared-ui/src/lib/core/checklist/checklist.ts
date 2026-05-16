import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ChecklistBrainDirective } from '../../brain/checklist-brain/checklist-brain';
import { ChecklistItem } from './checklist-item';

/** all possible status values for a checklist item */
export const allChecklistItemStatuses = ['not-started', 'in-progress', 'valid', 'invalid'] as const;

/** status of a single checklist item */
export type ChecklistItemStatus = (typeof allChecklistItemStatuses)[number];

/** base data structure for a checklist item without nesting support */
export type BaseChecklistItemData = {
  id: string;
  label: string;
  status: ChecklistItemStatus;
  /** optional post detail (durations, tail status, free-form). renders in the meta slot. */
  meta?: string;
  /** optional count pill content (e.g. `2/4`). only meaningful on parent rows. */
  count?: string;
};

/** data structure for a checklist item, optionally supporting one level of nested sub-items */
export type ChecklistItemData = BaseChecklistItemData & {
  items?: BaseChecklistItemData[];
};

/** default value for the emphasizeInvalid input */
export const CHECKLIST_EMPHASIZE_INVALID_DEFAULT = false;

/** default value for the showStatusBackground input */
export const CHECKLIST_SHOW_STATUS_BACKGROUND_DEFAULT = false;

@Component({
  selector: 'org-checklist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChecklistItem],
  templateUrl: './checklist.html',
  styleUrl: './checklist.css',
  hostDirectives: [
    {
      directive: ChecklistBrainDirective,
      inputs: ['items', 'isEditable'],
      outputs: ['itemsChange'],
    },
  ],
  host: {
    role: 'list',
    '[attr.data-emphasize-invalid]': 'emphasizeInvalid() ? "" : null',
    '[attr.data-status-background]': 'showStatusBackground() ? "" : null',
    '[attr.data-editable]': 'brain.isEditable() ? "" : null',
  },
})
export class Checklist {
  protected readonly brain = inject(ChecklistBrainDirective, { self: true });

  /** when true, invalid rows paint their label in the danger color */
  public readonly emphasizeInvalid = input<boolean>(CHECKLIST_EMPHASIZE_INVALID_DEFAULT);

  /** when true, every status slot paints a soft tile background matching its status */
  public readonly showStatusBackground = input<boolean>(CHECKLIST_SHOW_STATUS_BACKGROUND_DEFAULT);
}
