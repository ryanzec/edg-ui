import { Directive, computed, signal } from '@angular/core';

/** the internal state shape for the checklist brain directive */
type ChecklistState = {
  expandedIds: Set<string>;
};

/**
 * headless brain directive for the checklist component. owns the set of currently expanded item ids and the
 * `toggleExpanded` method that mutates it. children read the expanded state and call toggle through the
 * presentation, which proxies both through to the brain.
 */
@Directive({
  selector: '[orgChecklistBrain]',
  exportAs: 'orgChecklistBrain',
})
export class ChecklistBrainDirective {
  private readonly _state = signal<ChecklistState>({
    expandedIds: new Set<string>(),
  });

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
}
