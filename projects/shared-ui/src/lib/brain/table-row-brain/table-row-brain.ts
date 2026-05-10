import { Directive, computed, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

/** all available row variant values */
export const allTableRowVariants = ['header', 'body'] as const;

/** the structural variant of a row; the brain uses this to gate body-only state semantics */
export type TableRowVariant = (typeof allTableRowVariants)[number];

/** default value for the variant input */
export const TABLE_ROW_VARIANT_DEFAULT: TableRowVariant = 'body';

/** default value for the selected input */
export const TABLE_ROW_SELECTED_DEFAULT = false;

/** default value for the clickable input */
export const TABLE_ROW_CLICKABLE_DEFAULT = false;

/** default value for the empty input */
export const TABLE_ROW_EMPTY_DEFAULT = false;

/**
 * headless brain directive for the table row component. owns the structural variant (header / body) plus
 * the body-row state surface — selected, clickable, empty — and the keyboard activation logic that
 * `clickable` requires (enter / space). presentation reads `ariaSelected` for the inner `<tr>` element and
 * routes its own click / keydown handlers through `activate` / `handleKeydown` so the actual focusable
 * element (the `<tr>`) gets `tabindex` and `role` directly. carries no styling.
 */
@Directive({
  selector: '[orgTableRowBrain]',
  exportAs: 'orgTableRowBrain',
})
export class TableRowBrainDirective {
  private readonly _clicked$ = new Subject<void>();

  /** the structural variant of the row; header rows do not participate in selected / clickable / empty state */
  public readonly variant = input<TableRowVariant>(TABLE_ROW_VARIANT_DEFAULT);

  /** whether the row is in the selected state */
  public readonly selected = input<boolean>(TABLE_ROW_SELECTED_DEFAULT);

  /** whether the row is clickable; drives focusable + role + the keyboard activation handler */
  public readonly clickable = input<boolean>(TABLE_ROW_CLICKABLE_DEFAULT);

  /** whether the row is the empty-state row */
  public readonly empty = input<boolean>(TABLE_ROW_EMPTY_DEFAULT);

  /** whether the row is a body row (selected / clickable / empty only apply to body rows) */
  public readonly isBodyRow = computed<boolean>(() => this.variant() === 'body');

  /** the resolved `aria-selected` value; only present on body rows where selection is meaningful */
  public readonly ariaSelected = computed<'true' | 'false' | null>(() => {
    if (!this.isBodyRow()) {
      return null;
    }

    return this.selected() ? 'true' : 'false';
  });

  /** emitted when the row is activated via click or keyboard while clickable */
  public readonly clicked = outputFromObservable(this._clicked$);

  /** activates the row (dispatches the clicked output) when clickable */
  public activate(): void {
    if (!this.clickable()) {
      return;
    }

    this._clicked$.next();
  }

  /** keyboard handler for enter / space; prevents the default page-scroll on space and activates the row */
  public handleKeydown(event: Event): void {
    event.preventDefault();
    this.activate();
  }
}
