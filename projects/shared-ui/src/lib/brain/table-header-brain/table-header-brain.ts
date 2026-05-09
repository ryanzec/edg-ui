import { Directive, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';

/** all available scope values (matches the html `scope` attribute spec for `<th>`) */
export const allTableHeaderScopes = ['row', 'col', 'rowgroup', 'colgroup'] as const;

/** scope value applied to the inner `<th>` element for accessibility */
export type TableHeaderScope = (typeof allTableHeaderScopes)[number];

/** default value for the scope input */
export const TABLE_HEADER_SCOPE_DEFAULT: TableHeaderScope | undefined = undefined;

/**
 * headless brain directive for the table header component. owns the `scope` accessibility input that the
 * presentation binds to the inner `<th>` element so screen readers can correctly associate header cells with
 * their column or row data cells.
 */
@Directive({
  selector: '[orgTableHeaderBrain]',
  exportAs: 'orgTableHeaderBrain',
})
export class TableHeaderBrainDirective {
  /** scope applied to the inner `<th>` element; pairs the header with the column or row it labels */
  public readonly scope = input<TableHeaderScope | undefined, TableHeaderScope | null | undefined>(
    TABLE_HEADER_SCOPE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );
}
