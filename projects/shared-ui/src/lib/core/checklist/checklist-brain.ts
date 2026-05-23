import { Directive, computed, input, model, signal } from '@angular/core';
import type { BaseChecklistItemData, ChecklistItemData, ChecklistItemStatus } from '../checklist/checklist';

/** the internal state shape for the checklist brain directive */
type ChecklistState = {
  expandedIds: Set<string>;
};

/** default value for the isEditable input */
export const CHECKLIST_IS_EDITABLE_DEFAULT = false;

/**
 * headless brain directive for the checklist component. owns the items model (two-way bound from the
 * presentation host), the editable flag, the set of currently expanded item ids, and all status-toggle
 * event handling. children read the expanded state and call toggle through the presentation, which
 * proxies both through to the brain. when editable, the brain handles click-to-toggle on leaf items
 * (top-level non-nested rows and nested children) and auto-recomputes the parent status from its
 * children's statuses; parent rows themselves are not directly togglable.
 */
@Directive({
  selector: '[orgChecklistBrain]',
  exportAs: 'orgChecklistBrain',
})
export class ChecklistBrainDirective {
  private readonly _state = signal<ChecklistState>({
    expandedIds: new Set<string>(),
  });

  /** the items rendered by the checklist; two-way bound by the presentation host */
  public readonly items = model.required<ChecklistItemData[]>();

  /** when true, leaf rows accept click-to-toggle between not-started and valid */
  public readonly isEditable = input<boolean>(CHECKLIST_IS_EDITABLE_DEFAULT);

  /** the set of currently expanded item ids */
  public readonly expandedIds = computed<ReadonlySet<string>>(() => this._state().expandedIds);

  /** toggles the expanded state of the item with the given id */
  public toggleExpanded(id: string): void {
    this._state.update((state) => {
      const newExpandedIds = new Set(state.expandedIds);

      if (newExpandedIds.has(id)) {
        newExpandedIds.delete(id);
      } else {
        newExpandedIds.add(id);
      }

      return {
        ...state,
        expandedIds: newExpandedIds,
      };
    });
  }

  /**
   * toggles the status of the item with the given id between `not-started` and `valid`. no-ops when:
   * - editable mode is off
   * - the item is a top-level parent (has children) — parents derive their status from children
   * - the item's current status is `in-progress` or `invalid`
   * when a nested child is toggled, the owning parent's status is recomputed from its children.
   */
  public toggleStatus(id: string): void {
    if (!this.isEditable()) {
      return;
    }

    const currentItems = this.items();

    const topLevelIndex = currentItems.findIndex((item) => item.id === id);

    if (topLevelIndex !== -1) {
      this._toggleTopLevelItem(currentItems, topLevelIndex);

      return;
    }

    this._toggleNestedItem(currentItems, id);
  }

  /** toggles a top-level (non-nested) item's status and writes the result back to the items model */
  private _toggleTopLevelItem(currentItems: ChecklistItemData[], index: number): void {
    const item = currentItems[index];

    // parent rows are controlled by their children, never directly togglable
    if (item.items && item.items.length > 0) {
      return;
    }

    if (!this._isTogglableStatus(item.status)) {
      return;
    }

    const newItems = [...currentItems];

    newItems[index] = {
      ...item,
      status: this._nextStatus(item.status),
    };

    this.items.set(newItems);
  }

  /** finds and toggles a nested child by id, then recomputes the owning parent's status */
  private _toggleNestedItem(currentItems: ChecklistItemData[], childId: string): void {
    for (let parentIndex = 0; parentIndex < currentItems.length; parentIndex++) {
      const parent = currentItems[parentIndex];

      if (!parent.items || parent.items.length === 0) {
        continue;
      }

      const childIndex = parent.items.findIndex((child) => child.id === childId);

      if (childIndex === -1) {
        continue;
      }

      const child = parent.items[childIndex];

      if (!this._isTogglableStatus(child.status)) {
        return;
      }

      const newChildren = [...parent.items];

      newChildren[childIndex] = {
        ...child,
        status: this._nextStatus(child.status),
      };

      const newItems = [...currentItems];

      newItems[parentIndex] = {
        ...parent,
        items: newChildren,
        status: this._computeParentStatus(newChildren),
      };

      this.items.set(newItems);

      return;
    }
  }

  /** true when the status is one we allow editable click-to-toggle on */
  private _isTogglableStatus(status: ChecklistItemStatus): boolean {
    return status === 'not-started' || status === 'valid';
  }

  /** returns the next status when a togglable item is clicked */
  private _nextStatus(current: ChecklistItemStatus): ChecklistItemStatus {
    return current === 'valid' ? 'not-started' : 'valid';
  }

  /**
   * derives a parent's status from the resolved statuses of its children:
   * - any child invalid → invalid
   * - any child in-progress → in-progress
   * - all valid → valid
   * - all not-started → not-started
   * - mixed valid + not-started → in-progress
   */
  private _computeParentStatus(children: BaseChecklistItemData[]): ChecklistItemStatus {
    const hasInvalid = children.some((child) => child.status === 'invalid');

    if (hasInvalid) {
      return 'invalid';
    }

    const hasInProgress = children.some((child) => child.status === 'in-progress');

    if (hasInProgress) {
      return 'in-progress';
    }

    const allValid = children.every((child) => child.status === 'valid');

    if (allValid) {
      return 'valid';
    }

    const allNotStarted = children.every((child) => child.status === 'not-started');

    if (allNotStarted) {
      return 'not-started';
    }

    return 'in-progress';
  }
}
