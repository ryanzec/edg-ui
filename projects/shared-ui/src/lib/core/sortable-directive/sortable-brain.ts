import { Directive, computed, inject, input } from '@angular/core';
import { SortingDirection, SortingStore } from '../sorting-store/sorting-store';

/** default value for the enabled input */
export const SORTABLE_ENABLED_DEFAULT = true;

/**
 * headless brain directive for the sortable component. owns the click and keyboard interaction handlers, the sort
 * key registration with the sorting store, focus management (tabindex), and the accessibility / interaction
 * routing surface (role, aria-disabled-style data attribute). exposes the resolved sort direction for this key so
 * presentation can render any visual indicator it wants. carries no styling, no icon rendering, and no template.
 */
@Directive({
  selector: '[orgSortableBrain]',
  exportAs: 'orgSortableBrain',
  host: {
    '(click)': 'onClick()',
    '(keydown.enter)': 'onKeydown($event)',
    '(keydown.space)': 'onKeydown($event)',
    '[attr.role]': 'enabled() ? "button" : null',
    '[attr.tabindex]': 'enabled() ? "0" : null',
    '[attr.data-sortable-enabled]': 'enabled() ? "" : null',
  },
})
export class SortableBrainDirective {
  private readonly _sortingStore = inject(SortingStore);

  /** the sort key this directive manages; matches the directive selector */
  public readonly orgSortableBrain = input.required<string>();

  /** whether sorting interaction is enabled */
  public readonly enabled = input<boolean>(SORTABLE_ENABLED_DEFAULT);

  /** the active sort direction for this key, or null when this key is not the currently sorted one */
  public readonly direction = computed<SortingDirection | null>(() => {
    const activeKey = this._sortingStore.key();
    const activeDirection = this._sortingStore.direction();

    if (activeKey !== this.orgSortableBrain()) {
      return null;
    }

    return activeDirection;
  });

  /** whether this directive's key is the currently active sort key with a direction set */
  public readonly isActivelySorting = computed<boolean>(() => this.direction() !== null);

  /** toggles the sort for this key when the host element is activated */
  protected onClick(): void {
    if (!this.enabled()) {
      return;
    }

    this._sortingStore.toggleSort(this.orgSortableBrain());
  }

  /** handles keyboard activation (enter / space) by routing to the click handler and preventing scroll on space */
  protected onKeydown(event: Event): void {
    event.preventDefault();
    this.onClick();
  }
}
