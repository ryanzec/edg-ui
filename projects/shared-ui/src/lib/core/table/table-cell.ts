import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** default value for the ellipsisLines input */
export const TABLE_CELL_ELLIPSIS_LINES_DEFAULT = 0;

@Component({
  selector: 'org-table-td',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <td class="cell">
      <div
        [class]="useEllipsis() ? 'org-table-ellipsis' : null"
        [style]="useEllipsis() ? { '--ellipsis-lines': ellipsisLines() } : null"
      >
        <ng-content />
      </div>
    </td>
  `,
  styleUrl: './table-cell.css',
  host: {
    '[attr.data-ellipsis-lines]': 'ellipsisLines()',
  },
})
export class TableCell {
  /** number of lines before text is truncated with ellipsis; 0 disables ellipsis */
  public ellipsisLines = input<number>(TABLE_CELL_ELLIPSIS_LINES_DEFAULT);

  /** whether ellipsis truncation is active */
  protected useEllipsis = computed<boolean>(() => this.ellipsisLines() > 0);
}
