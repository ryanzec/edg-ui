import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ChecklistBrainDirective } from '../checklist/checklist-brain';
import { ChecklistItemBrainDirective } from '../checklist/checklist-item-brain';
import { Icon } from '../icon/icon';
import { type ChecklistItemData, type ChecklistItemStatus } from './checklist';
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
  protected readonly parentBrain = inject(ChecklistBrainDirective);

  /** the item data to render. */
  public readonly item = input.required<ChecklistItemData>();

  /** the id of this item, forwarded to the brain to derive its expanded state */
  public readonly itemId = input.required<string>();

  /** true when the item has nested sub-items. */
  protected readonly hasNestedItems = computed<boolean>(() => {
    const items = this.item().items;

    return !!items && items.length > 0;
  });

  /**
   * true when the top-level leaf row should render as an interactive button. parent rows (with
   * children) are always interactive for expand/collapse and handled separately in the template.
   */
  protected readonly isLeafEditable = computed<boolean>(() => this.brain.isEditable() && !this.hasNestedItems());

  /** true when the leaf row is editable but its current status blocks the click-to-toggle action */
  protected readonly isLeafEditableDisabled = computed<boolean>(
    () => this.isLeafEditable() && !this._isStatusTogglable(this.item().status)
  );

  /** click handler bound to the leaf row when the parent checklist is editable */
  protected toggleStatus(): void {
    this.brain.toggleStatus();
  }

  /** click handler bound to nested child rows when the parent checklist is editable */
  protected toggleNestedStatus(childId: string): void {
    this.parentBrain.toggleStatus(childId);
  }

  /** true when the given nested child should render as an interactive button in editable mode */
  protected isNestedChildEditableDisabled(status: ChecklistItemStatus): boolean {
    return !this._isStatusTogglable(status);
  }

  private _isStatusTogglable(status: ChecklistItemStatus): boolean {
    return status === 'not-started' || status === 'valid';
  }
}
