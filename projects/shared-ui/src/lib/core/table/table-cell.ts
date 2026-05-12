import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** default value for the ellipsisLines input */
export const TABLE_CELL_ELLIPSIS_LINES_DEFAULT = 0;

/** default value for the numeric input */
export const TABLE_CELL_NUMERIC_DEFAULT = false;

/** default value for the muted input */
export const TABLE_CELL_MUTED_DEFAULT = false;

/** default value for the faint input */
export const TABLE_CELL_FAINT_DEFAULT = false;

/** default value for the selectColumn input */
export const TABLE_CELL_SELECT_COL_DEFAULT = false;

@Component({
  selector: 'org-table-td',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './table-cell.html',
  styleUrl: './table-cell.css',
})
export class TableCell {
  /** number of lines before text is truncated with ellipsis; 0 disables ellipsis */
  public readonly ellipsisLines = input<number>(TABLE_CELL_ELLIPSIS_LINES_DEFAULT);

  /** whether the cell renders the numeric layout — right-align + tabular numerals */
  public readonly numeric = input<boolean>(TABLE_CELL_NUMERIC_DEFAULT);

  /** whether the cell text is rendered in the muted (less-prominent) tone */
  public readonly muted = input<boolean>(TABLE_CELL_MUTED_DEFAULT);

  /** whether the cell text is rendered in the faint (least-prominent) tone */
  public readonly faint = input<boolean>(TABLE_CELL_FAINT_DEFAULT);

  /** whether the cell is the pre checkbox-selection column (fixed-width, centered) */
  public readonly selectColumn = input<boolean>(TABLE_CELL_SELECT_COL_DEFAULT);

  /** whether ellipsis truncation is active */
  protected readonly useEllipsis = computed<boolean>(() => this.ellipsisLines() > 0);
}
