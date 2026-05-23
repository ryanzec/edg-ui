import { Directive, computed, input, signal } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { SortableBrainDirective } from '../sortable-directive/sortable-brain';
import { SortingDirection } from '../sorting-store/sorting-store';

/** all available scope values (matches the html `scope` attribute spec for `<th>`) */
export const allTableHeaderScopes = ['row', 'col', 'rowgroup', 'colgroup'] as const;

/** scope value applied to the inner `<th>` element for accessibility */
export type TableHeaderScope = (typeof allTableHeaderScopes)[number];

/** the active sort direction for a sortable header, or `null` when this header is not the active sort key */
export type TableHeaderSortDirection = SortingDirection | null;

/** default value for the scope input */
export const TABLE_HEADER_SCOPE_DEFAULT: TableHeaderScope | undefined = undefined;

/**
 * headless brain directive for the table header component. owns the header's accessibility surface — the
 * `scope` association for screen readers and the `data-sortable` + `aria-sort` state derived from a
 * registered `SortableBrainDirective`. presentation finds an `[orgSortableKey]` directive in its content
 * and registers its brain here via `registerSortable`; the brain then exposes the resolved `sortable` and
 * `sortDirection` state for the presentation to bind to the inner `<th>`.
 */
@Directive({
  selector: '[orgTableHeaderBrain]',
  exportAs: 'orgTableHeaderBrain',
})
export class TableHeaderBrainDirective {
  private readonly _registeredSortableBrain = signal<SortableBrainDirective | null>(null);

  /** scope applied to the inner `<th>` element; pairs the header with the column or row it labels */
  public readonly scope = input<TableHeaderScope | undefined, TableHeaderScope | null | undefined>(
    TABLE_HEADER_SCOPE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** whether the header is sortable (true when a sortable brain has been registered) */
  public readonly sortable = computed<boolean>(() => this._registeredSortableBrain() !== null);

  /** the active sort direction for this header, or null when this column is not the active sort key */
  public readonly sortDirection = computed<TableHeaderSortDirection>(() => {
    const brain = this._registeredSortableBrain();

    if (!brain) {
      return null;
    }

    return brain.direction();
  });

  /** the resolved `aria-sort` value: `ascending` / `descending` when actively sorting, `none` when sortable but inactive */
  public readonly ariaSort = computed<'ascending' | 'descending' | 'none' | null>(() => {
    if (!this.sortable()) {
      return null;
    }

    const direction = this.sortDirection();

    if (direction === 'asc') {
      return 'ascending';
    }

    if (direction === 'desc') {
      return 'descending';
    }

    return 'none';
  });

  /** whether the column is the currently active sort key (direction is non-null) */
  public readonly isActivelySorting = computed<boolean>(() => this.sortDirection() !== null);

  /** registers (or clears) the sortable brain whose state this header mirrors */
  public registerSortable(brain: SortableBrainDirective | null): void {
    this._registeredSortableBrain.set(brain);
  }
}
