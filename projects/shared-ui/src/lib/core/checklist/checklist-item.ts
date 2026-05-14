import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ChecklistItemBrainDirective } from '../../brain/checklist-brain/checklist-item-brain';
import { Icon } from '../icon/icon';
import { type ChecklistItemData } from './checklist';
import { ChecklistStatusIcon } from './checklist-status-icon';

@Component({
  selector: 'org-checklist-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, ChecklistStatusIcon],
  templateUrl: './checklist-item.html',
  styleUrl: './checklist-item.css',
  hostDirectives: [
    {
      directive: ChecklistItemBrainDirective,
      inputs: ['id: itemId'],
    },
  ],
  host: {
    role: 'listitem',
    '[attr.data-status]': 'item().status',
    '[attr.data-expanded]': 'brain.isExpanded() ? "" : null',
  },
})
export class ChecklistItem {
  protected readonly brain = inject(ChecklistItemBrainDirective, { self: true });

  /** the item data to render. */
  public readonly item = input.required<ChecklistItemData>();

  /** the id of this item, forwarded to the brain to derive its expanded state */
  public readonly itemId = input.required<string>();

  /** true when the item has nested sub-items. */
  protected readonly hasNestedItems = computed<boolean>(() => {
    const items = this.item().items;

    return !!items && items.length > 0;
  });
}
