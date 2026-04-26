import { Directive, computed, input, model } from '@angular/core';

/** all available drop-down-selector selection mode values */
export const allDropDownSelectorSelectionModes = ['single', 'multiple'] as const;

/** controls whether a single or multiple items can be selected at a time */
export type DropDownSelectorSelectionMode = (typeof allDropDownSelectorSelectionModes)[number];

/** a value that can be selected via the drop-down selector */
export type SelectionValue<TValue = unknown> = {
  /** the underlying value of the option */
  value: TValue;
  /** the user-facing display string for the option */
  display: string;
};

/** default value for the dropDownSelectorSelectionMode input */
export const DROP_DOWN_SELECTOR_SELECTION_MODE_DEFAULT: DropDownSelectorSelectionMode = 'single';

/** default value for the dropDownSelectorDisabled input */
export const DROP_DOWN_SELECTOR_DISABLED_DEFAULT = false;

/**
 * headless brain directive for the drop-down selector. owns selection-mode awareness, selected-item state via the
 * `dropDownSelectorSelectedItems` model, comparison logic (matching by `value`), and the computed display
 * text rendered next to the trigger label. carries no styling, template, or markup — apply alongside a
 * presentation component that renders the trigger and overlay menu.
 */
@Directive({
  selector: '[orgDropDownSelectorBrain]',
  exportAs: 'orgDropDownSelectorBrain',
})
export class DropDownSelectorBrainDirective<TValue = unknown> {
  /** controls whether a single or multiple items can be selected at a time */
  public readonly dropDownSelectorSelectionMode = input<DropDownSelectorSelectionMode>(
    DROP_DOWN_SELECTOR_SELECTION_MODE_DEFAULT
  );

  /** whether the drop-down selector is disabled and cannot be interacted with */
  public readonly dropDownSelectorDisabled = input<boolean>(DROP_DOWN_SELECTOR_DISABLED_DEFAULT);

  /** the currently selected items, used for both single and multiple selection modes */
  public readonly dropDownSelectorSelectedItems = model.required<SelectionValue<TValue>[]>();

  /** the count of currently selected items */
  public readonly selectionCount = computed<number>(() => this.dropDownSelectorSelectedItems().length);

  /** whether any items are currently selected */
  public readonly hasSelection = computed<boolean>(() => this.selectionCount() > 0);

  /**
   * the display text shown next to the label on the trigger; returns `null` when nothing is selected,
   * the single selected item's `display` value when exactly one is selected, and `"{count} selected"` when
   * more than one is selected.
   */
  public readonly displayValueText = computed<string | null>(() => {
    const selected = this.dropDownSelectorSelectedItems();

    if (selected.length === 0) {
      return null;
    }

    if (selected.length === 1) {
      return selected[0].display;
    }

    return `${selected.length} selected`;
  });

  /** returns true when the provided item is currently part of the selected items, comparing by `value` */
  public isSelected(item: SelectionValue<TValue>): boolean {
    return this.dropDownSelectorSelectedItems().some((selected) => selected.value === item.value);
  }

  /**
   * toggles the provided item's selection state; in `'single'` mode the selection is replaced with the
   * provided item, in `'multiple'` mode the item is added to or removed from the existing selection
   */
  public toggleItem(item: SelectionValue<TValue>): void {
    if (this.dropDownSelectorDisabled()) {
      return;
    }

    if (this.dropDownSelectorSelectionMode() === 'single') {
      this.dropDownSelectorSelectedItems.set([item]);

      return;
    }

    const current = this.dropDownSelectorSelectedItems();

    if (this.isSelected(item)) {
      this.dropDownSelectorSelectedItems.set(current.filter((selected) => selected.value !== item.value));

      return;
    }

    this.dropDownSelectorSelectedItems.set([...current, item]);
  }

  /** clears all selected items */
  public clearSelection(): void {
    if (this.dropDownSelectorDisabled()) {
      return;
    }

    this.dropDownSelectorSelectedItems.set([]);
  }
}
