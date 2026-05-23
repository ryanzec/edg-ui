import { Directive, computed, inject, input } from '@angular/core';
import { ChecklistBrainDirective } from './checklist-brain';

/**
 * headless brain directive for an item within a checklist. injects the parent checklist brain to derive
 * its own expanded state from the shared expanded-id set, surface the parent's editable flag, and
 * delegate both expand-toggle and status-toggle interactions back to the parent. the presentation
 * reads `isExpanded` for both the aria-expanded attribute and the chevron icon direction, reads
 * `isEditable` to know when leaf rows accept click-to-toggle, and binds click handlers directly to
 * `toggle()` and `toggleStatus()`.
 */
@Directive({
  selector: '[orgChecklistItemBrain]',
  exportAs: 'orgChecklistItemBrain',
})
export class ChecklistItemBrainDirective {
  private readonly _parentBrain = inject(ChecklistBrainDirective);

  /** the id of the checklist item this brain represents */
  public readonly id = input.required<string>();

  /** whether this checklist item is currently expanded in the parent checklist */
  public readonly isExpanded = computed<boolean>(() => this._parentBrain.expandedIds().has(this.id()));

  /** whether the parent checklist is in editable mode */
  public readonly isEditable = computed<boolean>(() => this._parentBrain.isEditable());

  /** toggles the expanded state of this item via the parent checklist brain */
  public toggle(): void {
    this._parentBrain.toggleExpanded(this.id());
  }

  /** toggles the status of this item via the parent checklist brain */
  public toggleStatus(): void {
    this._parentBrain.toggleStatus(this.id());
  }
}
