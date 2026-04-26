import { Component, ChangeDetectionStrategy, input } from '@angular/core';

export const allTableRowVariants = ['header', 'body'] as const;

/**
 * variant for table row component
 */
export type TableRowVariant = (typeof allTableRowVariants)[number];

/** default value for the variant input */
export const TABLE_ROW_VARIANT_DEFAULT: TableRowVariant = 'body';

/** default value for the isSticky input */
export const TABLE_ROW_IS_STICKY_DEFAULT = false;

@Component({
  selector: 'org-table-tr',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <tr>
      <ng-content />
    </tr>
  `,
  styleUrl: './table-row.css',
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-sticky]': 'isSticky() ? "" : null',
  },
})
export class TableRow {
  /** the visual and semantic variant of the row */
  public variant = input<TableRowVariant>(TABLE_ROW_VARIANT_DEFAULT);

  /** whether the row is sticky (used for header rows) */
  public isSticky = input<boolean>(TABLE_ROW_IS_STICKY_DEFAULT);
}
