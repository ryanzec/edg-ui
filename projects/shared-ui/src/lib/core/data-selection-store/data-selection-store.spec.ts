import { beforeEach, describe, expect, it } from 'vitest';
import { DataSelectionStore } from './data-selection-store';

describe('DataSelectionStore', () => {
  let store: DataSelectionStore<number>;

  beforeEach(() => {
    store = new DataSelectionStore<number>();
  });

  describe('initial state', () => {
    it('exposes an empty selectedItems set', () => {
      expect(store.selectedItems().size).toBe(0);
    });

    it('exposes an empty selectedItemsArray', () => {
      expect(store.selectedItemsArray()).toEqual([]);
    });

    it('reports a selectedCount of 0', () => {
      expect(store.selectedCount()).toBe(0);
    });

    it('reports selectAllEnabled as false', () => {
      expect(store.selectAllEnabled()).toBe(false);
    });

    it('reports hasSelection as false', () => {
      expect(store.hasSelection()).toBe(false);
    });
  });

  describe('isSelected', () => {
    it('returns true for an item that is currently selected', () => {
      store.select(1);

      expect(store.isSelected(1)).toBe(true);
    });

    it('returns false for an item that is not selected', () => {
      store.select(1);

      expect(store.isSelected(2)).toBe(false);
    });
  });

  describe('select', () => {
    it('adds the item to the selection', () => {
      store.select(1);

      expect(store.selectedItems().has(1)).toBe(true);
    });

    it('produces a new set reference on change', () => {
      const before = store.selectedItems();

      store.select(1);

      expect(store.selectedItems()).not.toBe(before);
    });

    it('is a no-op when the item is already selected', () => {
      store.select(1);

      const before = store.selectedItems();

      store.select(1);

      expect(store.selectedItems()).toBe(before);
      expect(store.selectedCount()).toBe(1);
    });
  });

  describe('deselect', () => {
    it('removes the item from the selection', () => {
      store.select(1);
      store.deselect(1);

      expect(store.isSelected(1)).toBe(false);
    });

    it('resets selectAllEnabled when removing a previously select-all item', () => {
      store.selectAll([1, 2, 3]);

      store.deselect(2);

      expect(store.selectAllEnabled()).toBe(false);
    });

    it('is a no-op when the item is not selected', () => {
      store.select(1);

      const before = store.selectedItems();

      store.deselect(2);

      expect(store.selectedItems()).toBe(before);
    });

    it('does not change selectAllEnabled on no-op', () => {
      store.selectAll([1, 2]);

      store.deselect(99);

      expect(store.selectAllEnabled()).toBe(true);
    });
  });

  describe('set', () => {
    it('delegates to select when selected is true', () => {
      store.set(1, true);

      expect(store.isSelected(1)).toBe(true);
    });

    it('delegates to deselect when selected is false', () => {
      store.select(1);

      store.set(1, false);

      expect(store.isSelected(1)).toBe(false);
    });
  });

  describe('toggle', () => {
    it('selects an item that is not selected', () => {
      store.toggle(1);

      expect(store.isSelected(1)).toBe(true);
    });

    it('deselects an item that is currently selected', () => {
      store.select(1);

      store.toggle(1);

      expect(store.isSelected(1)).toBe(false);
    });
  });

  describe('selectMultiple', () => {
    it('adds all provided items', () => {
      store.selectMultiple([1, 2, 3]);

      expect(store.selectedCount()).toBe(3);
      expect(store.isSelected(1)).toBe(true);
      expect(store.isSelected(2)).toBe(true);
      expect(store.isSelected(3)).toBe(true);
    });

    it('skips items that are already selected', () => {
      store.select(1);

      store.selectMultiple([1, 2]);

      expect(store.selectedCount()).toBe(2);
      expect(store.isSelected(1)).toBe(true);
      expect(store.isSelected(2)).toBe(true);
    });

    it('is a no-op when all provided items are already selected', () => {
      store.selectMultiple([1, 2]);

      const before = store.selectedItems();

      store.selectMultiple([1, 2]);

      expect(store.selectedItems()).toBe(before);
    });

    it('is a no-op for an empty list', () => {
      const before = store.selectedItems();

      store.selectMultiple([]);

      expect(store.selectedItems()).toBe(before);
    });
  });

  describe('deselectMultiple', () => {
    it('removes all provided items from the selection', () => {
      store.selectMultiple([1, 2, 3]);

      store.deselectMultiple([1, 3]);

      expect(store.selectedCount()).toBe(1);
      expect(store.isSelected(2)).toBe(true);
    });

    it('skips items that are not currently selected', () => {
      store.select(1);

      store.deselectMultiple([1, 2]);

      expect(store.selectedCount()).toBe(0);
    });

    it('resets selectAllEnabled when something is removed', () => {
      store.selectAll([1, 2, 3]);

      store.deselectMultiple([1]);

      expect(store.selectAllEnabled()).toBe(false);
    });

    it('is a no-op when none of the provided items are selected', () => {
      store.selectAll([1, 2]);

      const before = store.selectedItems();

      store.deselectMultiple([99, 100]);

      expect(store.selectedItems()).toBe(before);
      expect(store.selectAllEnabled()).toBe(true);
    });
  });

  describe('setMultiple', () => {
    it('delegates to selectMultiple when selected is true', () => {
      store.setMultiple([1, 2], true);

      expect(store.selectedCount()).toBe(2);
    });

    it('delegates to deselectMultiple when selected is false', () => {
      store.selectMultiple([1, 2, 3]);

      store.setMultiple([1, 2], false);

      expect(store.selectedCount()).toBe(1);
      expect(store.isSelected(3)).toBe(true);
    });
  });

  describe('selectAll', () => {
    it('replaces the selection with the provided items', () => {
      store.select(99);

      store.selectAll([1, 2, 3]);

      expect(store.selectedItemsArray()).toEqual([1, 2, 3]);
    });

    it('sets selectAllEnabled to true', () => {
      store.selectAll([1, 2, 3]);

      expect(store.selectAllEnabled()).toBe(true);
    });
  });

  describe('clear', () => {
    it('empties the selection', () => {
      store.selectMultiple([1, 2, 3]);

      store.clear();

      expect(store.selectedCount()).toBe(0);
    });

    it('resets selectAllEnabled', () => {
      store.selectAll([1, 2, 3]);

      store.clear();

      expect(store.selectAllEnabled()).toBe(false);
    });
  });

  describe('toggleSelectAll', () => {
    it('selects all provided items when select-all is not enabled', () => {
      store.toggleSelectAll([1, 2, 3]);

      expect(store.selectedItemsArray()).toEqual([1, 2, 3]);
      expect(store.selectAllEnabled()).toBe(true);
    });

    it('clears the selection when select-all is enabled', () => {
      store.selectAll([1, 2, 3]);

      store.toggleSelectAll([1, 2, 3]);

      expect(store.selectedCount()).toBe(0);
      expect(store.selectAllEnabled()).toBe(false);
    });
  });

  describe('replaceSelection', () => {
    it('replaces the current selection with the provided items', () => {
      store.selectMultiple([1, 2]);

      store.replaceSelection([3, 4]);

      expect(store.selectedItemsArray()).toEqual([3, 4]);
    });

    it('resets selectAllEnabled', () => {
      store.selectAll([1, 2, 3]);

      store.replaceSelection([4, 5]);

      expect(store.selectAllEnabled()).toBe(false);
    });
  });

  describe('areAllSelected', () => {
    it('returns true when every provided item is selected', () => {
      store.selectMultiple([1, 2, 3]);

      expect(store.areAllSelected([1, 2, 3])).toBe(true);
    });

    it('returns false when at least one provided item is missing', () => {
      store.selectMultiple([1, 2]);

      expect(store.areAllSelected([1, 2, 3])).toBe(false);
    });

    it('returns false for an empty list', () => {
      expect(store.areAllSelected([])).toBe(false);
    });
  });

  describe('areSomeSelected', () => {
    it('returns true when only some provided items are selected', () => {
      store.selectMultiple([1, 2]);

      expect(store.areSomeSelected([1, 2, 3])).toBe(true);
    });

    it('returns false when none of the provided items are selected', () => {
      expect(store.areSomeSelected([1, 2, 3])).toBe(false);
    });

    it('returns false when all provided items are selected', () => {
      store.selectMultiple([1, 2, 3]);

      expect(store.areSomeSelected([1, 2, 3])).toBe(false);
    });
  });

  describe('areNoneSelected', () => {
    it('returns true when no provided items are selected', () => {
      expect(store.areNoneSelected([1, 2, 3])).toBe(true);
    });

    it('returns false when at least one provided item is selected', () => {
      store.select(2);

      expect(store.areNoneSelected([1, 2, 3])).toBe(false);
    });
  });

  describe('computed signals', () => {
    it('updates selectedItemsArray reactively when the selection changes', () => {
      store.select(1);

      expect(store.selectedItemsArray()).toEqual([1]);

      store.select(2);

      expect(store.selectedItemsArray()).toEqual([1, 2]);

      store.deselect(1);

      expect(store.selectedItemsArray()).toEqual([2]);
    });

    it('updates selectedCount reactively', () => {
      expect(store.selectedCount()).toBe(0);

      store.selectMultiple([1, 2, 3]);

      expect(store.selectedCount()).toBe(3);

      store.deselect(1);

      expect(store.selectedCount()).toBe(2);
    });

    it('updates hasSelection reactively', () => {
      expect(store.hasSelection()).toBe(false);

      store.select(1);

      expect(store.hasSelection()).toBe(true);

      store.clear();

      expect(store.hasSelection()).toBe(false);
    });

    it('updates selectAllEnabled reactively', () => {
      expect(store.selectAllEnabled()).toBe(false);

      store.selectAll([1, 2]);

      expect(store.selectAllEnabled()).toBe(true);

      store.clear();

      expect(store.selectAllEnabled()).toBe(false);
    });
  });

  describe('object-reference items', () => {
    it('distinguishes items by reference, not by structural equality', () => {
      const objectStore = new DataSelectionStore<{ id: string }>();
      const itemA = { id: 'a' };
      const itemAClone = { id: 'a' };

      objectStore.select(itemA);

      expect(objectStore.isSelected(itemA)).toBe(true);
      expect(objectStore.isSelected(itemAClone)).toBe(false);
    });

    it('supports selecting multiple distinct object references', () => {
      const objectStore = new DataSelectionStore<{ id: string }>();
      const itemA = { id: 'a' };
      const itemB = { id: 'b' };

      objectStore.selectMultiple([itemA, itemB]);

      expect(objectStore.selectedCount()).toBe(2);
      expect(objectStore.isSelected(itemA)).toBe(true);
      expect(objectStore.isSelected(itemB)).toBe(true);
    });
  });
});
