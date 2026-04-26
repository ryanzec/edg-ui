import { computed, signal } from '@angular/core';

/**
 * generic signal-based state container for handling data selection; instantiate directly with `new DataSelectionStore<T>()`
 * and pass the instance to child components via an `input()` when sharing across a component tree
 */
export class DataSelectionStore<T> {
  /**
   * publicly writable signal of currently selected items; consumers can call `.set()` / `.update()` directly,
   * and the value can be plumbed into a consuming component's `model<Set<T>>()` for two-way coordination
   * (`model()` itself cannot be used here — Angular only allows it on @Component / @Directive classes)
   */
  public readonly selectedItems = signal<Set<T>>(new Set<T>());

  /** internal flag tracking whether select-all mode is currently active */
  private readonly _selectAllEnabled = signal<boolean>(false);

  /** array of currently selected items */
  public readonly selectedItemsArray = computed<T[]>(() => Array.from(this.selectedItems()));

  /** number of currently selected items */
  public readonly selectedCount = computed<number>(() => this.selectedItems().size);

  /** whether select all is currently enabled */
  public readonly selectAllEnabled = computed<boolean>(() => this._selectAllEnabled());

  /** whether any items are currently selected */
  public readonly hasSelection = computed<boolean>(() => this.selectedItems().size > 0);

  /** returns true if the given item is currently selected */
  public isSelected(item: T): boolean {
    return this.selectedItems().has(item);
  }

  /** selects or deselects the given item based on the selected flag */
  public set(item: T, selected: boolean): void {
    if (selected) {
      this.select(item);

      return;
    }

    this.deselect(item);
  }

  /** selects a single item, no-op if already selected */
  public select(item: T): void {
    const currentItems = this.selectedItems();

    if (currentItems.has(item)) {
      return;
    }

    const newItems = new Set(currentItems);

    newItems.add(item);

    this.selectedItems.set(newItems);
  }

  /** deselects a single item, no-op if not currently selected */
  public deselect(item: T): void {
    const currentItems = this.selectedItems();

    if (!currentItems.has(item)) {
      return;
    }

    const newItems = new Set(currentItems);

    newItems.delete(item);

    this.selectedItems.set(newItems);
    this._selectAllEnabled.set(false);
  }

  /** toggles the selection state of a single item */
  public toggle(item: T): void {
    if (this.isSelected(item)) {
      this.deselect(item);

      return;
    }

    this.select(item);
  }

  /** selects or deselects multiple items based on the selected flag */
  public setMultiple(items: T[], selected: boolean): void {
    if (selected) {
      this.selectMultiple(items);

      return;
    }

    this.deselectMultiple(items);
  }

  /** adds multiple items to the selection, skipping any already selected */
  public selectMultiple(items: T[]): void {
    const currentItems = this.selectedItems();
    const newItems = new Set(currentItems);
    let changed = false;

    for (const item of items) {
      if (!newItems.has(item)) {
        newItems.add(item);
        changed = true;
      }
    }

    if (!changed) {
      return;
    }

    this.selectedItems.set(newItems);
  }

  /** removes multiple items from the selection, skipping any not currently selected */
  public deselectMultiple(items: T[]): void {
    const currentItems = this.selectedItems();
    const newItems = new Set(currentItems);
    let changed = false;

    for (const item of items) {
      if (newItems.has(item)) {
        newItems.delete(item);
        changed = true;
      }
    }

    if (!changed) {
      return;
    }

    this.selectedItems.set(newItems);
    this._selectAllEnabled.set(false);
  }

  /** selects all provided items and sets selectAllEnabled to true */
  public selectAll(items: T[]): void {
    this.selectedItems.set(new Set(items));
    this._selectAllEnabled.set(true);
  }

  /** clears all selections and resets selectAllEnabled */
  public clear(): void {
    this.selectedItems.set(new Set<T>());
    this._selectAllEnabled.set(false);
  }

  /** toggles between selecting all provided items and clearing all selections */
  public toggleSelectAll(items: T[]): void {
    if (this._selectAllEnabled()) {
      this.clear();

      return;
    }

    this.selectAll(items);
  }

  /** replaces the current selection with the provided items, resets selectAllEnabled */
  public replaceSelection(items: T[]): void {
    this.selectedItems.set(new Set(items));
    this._selectAllEnabled.set(false);
  }

  /** returns true only if every item in the provided list is selected */
  public areAllSelected(items: T[]): boolean {
    if (items.length === 0) {
      return false;
    }

    return items.every((item) => this.isSelected(item));
  }

  /** returns true if some but not all items in the provided list are selected */
  public areSomeSelected(items: T[]): boolean {
    const selectedCount = items.filter((item) => this.isSelected(item)).length;

    return selectedCount > 0 && selectedCount < items.length;
  }

  /** returns true if none of the items in the provided list are selected */
  public areNoneSelected(items: T[]): boolean {
    return items.every((item) => !this.isSelected(item));
  }
}
