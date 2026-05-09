import { DestroyRef, Directive, computed, inject, input, model, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

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

/** default value for the selectionMode input */
export const DROP_DOWN_SELECTOR_SELECTION_MODE_DEFAULT: DropDownSelectorSelectionMode = 'single';

/** default value for the disabled input */
export const DROP_DOWN_SELECTOR_DISABLED_DEFAULT = false;

/** number of milliseconds the type-ahead buffer remains active before being reset */
const TYPE_AHEAD_RESET_DELAY_MS = 500;

/**
 * headless brain directive for the drop-down selector. owns selection-mode awareness, selected-item state via the
 * `selectedItems` model, comparison logic (matching by `value`), the computed display text rendered next to the
 * trigger label, the open/closed overlay state, the active-descendant index used for keyboard navigation, and the
 * keyboard handlers (arrow keys, home/end, enter/space, escape, type-ahead). carries no styling, template, or
 * markup — apply alongside a presentation component that renders the trigger and overlay menu.
 */
@Directive({
  selector: '[orgDropDownSelectorBrain]',
  exportAs: 'orgDropDownSelectorBrain',
})
export class DropDownSelectorBrainDirective<TValue = unknown> {
  private readonly _destroyRef = inject(DestroyRef);

  /** controls whether a single or multiple items can be selected at a time */
  public readonly selectionMode = input<DropDownSelectorSelectionMode>(DROP_DOWN_SELECTOR_SELECTION_MODE_DEFAULT);

  /** whether the drop-down selector is disabled and cannot be interacted with */
  public readonly disabled = input<boolean>(DROP_DOWN_SELECTOR_DISABLED_DEFAULT);

  /** the accessible label for the trigger; also reused by presentations as visible label content */
  public readonly label = input.required<string>();

  /** the full list of selectable items used for both selection comparison and keyboard navigation */
  public readonly items = input.required<SelectionValue<TValue>[]>();

  /** the currently selected items, used for both single and multiple selection modes */
  public readonly selectedItems = model.required<SelectionValue<TValue>[]>();

  /** the count of currently selected items */
  public readonly selectionCount = computed<number>(() => this.selectedItems().length);

  /** whether any items are currently selected */
  public readonly hasSelection = computed<boolean>(() => this.selectionCount() > 0);

  /**
   * the display text shown next to the label on the trigger; returns `null` when nothing is selected,
   * the single selected item's `display` value when exactly one is selected, and `"{count} selected"` when
   * more than one is selected.
   */
  public readonly displayValueText = computed<string | null>(() => {
    const selected = this.selectedItems();

    if (selected.length === 0) {
      return null;
    }

    if (selected.length === 1) {
      return selected[0].display;
    }

    return `${selected.length} selected`;
  });

  /** unique identifier instance, used to derive stable dom ids for the panel and items */
  private readonly _instanceId = uuidv4();

  /** writable open / closed state for the overlay menu */
  private readonly _isOpen = signal<boolean>(false);

  /** whether the overlay menu is currently open */
  public readonly isOpen = computed<boolean>(() => this._isOpen());

  /** writable active descendant index; -1 indicates nothing is currently active */
  private readonly _activeIndex = signal<number>(-1);

  /** the active descendant index, or -1 when nothing is active */
  public readonly activeIndex = computed<number>(() => this._activeIndex());

  /** the active descendant item, or null when nothing is active or out of range */
  public readonly activeItem = computed<SelectionValue<TValue> | null>(() => {
    const index = this._activeIndex();
    const items = this.items();

    if (index < 0 || index >= items.length) {
      return null;
    }

    return items[index];
  });

  /** stable dom id for the overlay panel */
  public readonly panelId = computed<string>(() => `drop-down-selector-${this._instanceId}-panel`);

  /** stable dom id for the active descendant, used as `aria-activedescendant` on the trigger */
  public readonly activeDescendantId = computed<string | null>(() => {
    const index = this._activeIndex();

    if (index < 0) {
      return null;
    }

    return this.getItemId(index);
  });

  /** the current type-ahead buffer; characters accumulate here until the idle timer resets it */
  private _typeAheadBuffer = '';

  /** subject used to drive the type-ahead idle-reset timer */
  private readonly _typeAheadResetSubject = new Subject<void>();

  public constructor() {
    this._typeAheadResetSubject
      .pipe(debounceTime(TYPE_AHEAD_RESET_DELAY_MS), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this._typeAheadBuffer = '';
      });
  }

  /** returns the dom id used by the item at the provided index */
  public getItemId(index: number): string {
    return `drop-down-selector-${this._instanceId}-item-${index}`;
  }

  /** returns true when the provided item is currently part of the selected items, comparing by `value` */
  public isSelected(item: SelectionValue<TValue>): boolean {
    return this.selectedItems().some((selected) => selected.value === item.value);
  }

  /**
   * toggles the provided item's selection state; in `'single'` mode the selection is replaced with the
   * provided item, in `'multiple'` mode the item is added to or removed from the existing selection
   */
  public toggleItem(item: SelectionValue<TValue>): void {
    if (this.disabled()) {
      return;
    }

    if (this.selectionMode() === 'single') {
      this.selectedItems.set([item]);

      return;
    }

    const current = this.selectedItems();

    if (this.isSelected(item)) {
      this.selectedItems.set(current.filter((selected) => selected.value !== item.value));

      return;
    }

    this.selectedItems.set([...current, item]);
  }

  /** clears all selected items */
  public clearSelection(): void {
    if (this.disabled()) {
      return;
    }

    this.selectedItems.set([]);
  }

  /** opens the overlay menu and seeds the active descendant to the first selected item or the first item */
  public open(): void {
    if (this.disabled()) {
      return;
    }

    if (this._isOpen()) {
      return;
    }

    this._isOpen.set(true);
    this._activeIndex.set(this._resolveInitialActiveIndex());
  }

  /** closes the overlay menu and resets the active descendant */
  public close(): void {
    if (!this._isOpen()) {
      return;
    }

    this._isOpen.set(false);
    this._activeIndex.set(-1);
  }

  /** toggles the overlay menu's open state */
  public toggle(): void {
    if (this._isOpen()) {
      this.close();

      return;
    }

    this.open();
  }

  /** toggles the provided item's selection and closes the menu when in `'single'` mode */
  public selectItem(item: SelectionValue<TValue>): void {
    if (this.disabled()) {
      return;
    }

    this.toggleItem(item);

    if (this.selectionMode() === 'single') {
      this.close();
    }
  }

  /** selects the active descendant item if any */
  public selectActiveItem(): void {
    const item = this.activeItem();

    if (item === null) {
      return;
    }

    this.selectItem(item);
  }

  /** clears the current selection and closes the menu */
  public clearAndClose(): void {
    this.clearSelection();
    this.close();
  }

  /** handles a click on the trigger element by toggling the menu open state */
  public handleTriggerClick(): void {
    this.toggle();
  }

  /** handles a click outside the panel (cdk overlay backdrop) by closing the menu */
  public handleBackdropClick(): void {
    this.close();
  }

  /**
   * handles keyboard interactions on the trigger element, supporting open-via-arrow-key, escape-to-close,
   * arrow / home / end navigation, enter / space activation, and printable-character type-ahead.
   */
  public handleTriggerKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    if (!this._isOpen()) {
      this._handleClosedTriggerKeyDown(event);

      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();

        return;
      case 'ArrowDown':
        event.preventDefault();
        this._moveActiveIndex(1);

        return;
      case 'ArrowUp':
        event.preventDefault();
        this._moveActiveIndex(-1);

        return;
      case 'Home':
        event.preventDefault();
        this._moveActiveToFirst();

        return;
      case 'End':
        event.preventDefault();
        this._moveActiveToLast();

        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectActiveItem();

        return;
    }

    if (this._isPrintableCharacter(event)) {
      event.preventDefault();
      this._appendTypeAheadCharacter(event.key);
    }
  }

  /** appends a character to the type-ahead buffer, applies it, and resets the idle timer */
  private _appendTypeAheadCharacter(character: string): void {
    this._typeAheadBuffer += character.toLowerCase();
    this._applyTypeAheadBuffer(this._typeAheadBuffer);
    this._typeAheadResetSubject.next();
  }

  /** handles keys when the overlay is closed; opens the overlay on arrow keys */
  private _handleClosedTriggerKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return;
    }

    event.preventDefault();
    this.open();
  }

  /** computes the index used as the seed active descendant when opening */
  private _resolveInitialActiveIndex(): number {
    const items = this.items();

    if (items.length === 0) {
      return -1;
    }

    const selected = this.selectedItems();

    if (selected.length === 0) {
      return 0;
    }

    const firstSelectedValue = selected[0].value;
    const firstSelectedIndex = items.findIndex((item) => item.value === firstSelectedValue);

    if (firstSelectedIndex === -1) {
      return 0;
    }

    return firstSelectedIndex;
  }

  /** moves the active descendant by the provided delta, clamping at the bounds */
  private _moveActiveIndex(delta: number): void {
    const items = this.items();

    if (items.length === 0) {
      return;
    }

    const current = this._activeIndex();

    if (current === -1) {
      this._activeIndex.set(delta > 0 ? 0 : items.length - 1);

      return;
    }

    const next = Math.min(Math.max(current + delta, 0), items.length - 1);
    this._activeIndex.set(next);
  }

  /** moves the active descendant to the first item */
  private _moveActiveToFirst(): void {
    const items = this.items();

    if (items.length === 0) {
      return;
    }

    this._activeIndex.set(0);
  }

  /** moves the active descendant to the last item */
  private _moveActiveToLast(): void {
    const items = this.items();

    if (items.length === 0) {
      return;
    }

    this._activeIndex.set(items.length - 1);
  }

  /** returns true when the keyboard event represents a printable single-character key */
  private _isPrintableCharacter(event: KeyboardEvent): boolean {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return false;
    }

    return event.key.length === 1;
  }

  /** applies the current type-ahead buffer to the active descendant by prefix-matching item display values */
  private _applyTypeAheadBuffer(buffer: string): void {
    if (buffer.length === 0) {
      return;
    }

    const items = this.items();

    if (items.length === 0) {
      return;
    }

    const matchIndex = items.findIndex((item) => item.display.toLowerCase().startsWith(buffer));

    if (matchIndex === -1) {
      return;
    }

    this._activeIndex.set(matchIndex);
  }
}
