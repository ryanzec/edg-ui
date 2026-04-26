import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Icon } from '../icon/icon';
import { Checklist, type ChecklistItemData } from './checklist';
import { ChecklistStatusIcon } from './checklist-status-icon';

@Component({
  selector: 'org-checklist-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, ChecklistStatusIcon],
  templateUrl: './checklist-item.html',
  styleUrl: './checklist-item.css',
  host: {
    role: 'listitem',
    '[attr.data-expanded]': 'isItemExpanded() ? "" : null',
  },
})
export class ChecklistItem {
  /** @internal reference to the parent checklist for shared expand state. */
  private readonly _checklistComponent = inject(Checklist, { host: true });

  /** the item data to render. */
  public readonly item = input.required<ChecklistItemData>();

  /** true when the item has nested sub-items. */
  protected readonly hasNestedItems = computed<boolean>(() => {
    const items = this.item().items;

    return !!items && items.length > 0;
  });

  /** number of nested sub-items for this item. */
  protected readonly nestedItemCount = computed<number>(() => this.item().items?.length ?? 0);

  /** true when this item is currently expanded. */
  protected readonly isItemExpanded = computed<boolean>(() =>
    this._checklistComponent.expandedIds().has(this.item().id)
  );

  /** toggles the expanded state of this item. */
  protected toggle(): void {
    this._checklistComponent.toggleExpanded(this.item().id);
  }
}
