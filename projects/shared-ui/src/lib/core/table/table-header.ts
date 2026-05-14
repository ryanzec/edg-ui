import { Component, ChangeDetectionStrategy, computed, contentChild, effect, inject, input } from '@angular/core';
import { TableHeaderBrainDirective } from '../../brain/table-brain/table-header-brain';
import { SortableDirective } from '../sortable-directive/sortable-directive';
import { Icon } from '../icon/icon';
import { type IconName } from '../../brain/icon-brain/icon-brain';

/** default value for the numeric input */
export const TABLE_HEADER_NUMERIC_DEFAULT = false;

/** default value for the selectColumn input */
export const TABLE_HEADER_SELECT_COL_DEFAULT = false;

@Component({
  selector: 'org-table-th',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './table-header.html',
  styleUrl: './table-header.css',
  hostDirectives: [
    {
      directive: TableHeaderBrainDirective,
      inputs: ['scope'],
    },
  ],
})
export class TableHeader {
  protected readonly brain = inject(TableHeaderBrainDirective, { self: true });

  /** the projected sortable directive whose brain this header mirrors (when present) */
  private readonly _sortable = contentChild(SortableDirective, { descendants: true });

  /** whether the cell renders the numeric layout — right-align + tabular numerals */
  public readonly numeric = input<boolean>(TABLE_HEADER_NUMERIC_DEFAULT);

  /** whether the cell is the pre checkbox-selection column (fixed-width, centered) */
  public readonly selectColumn = input<boolean>(TABLE_HEADER_SELECT_COL_DEFAULT);

  /** the icon name shown in the sort chevron based on the active sort direction */
  protected readonly sortIconName = computed<IconName>(() => {
    const direction = this.brain.sortDirection();

    if (direction === 'asc') {
      return 'arrow-up';
    }

    if (direction === 'desc') {
      return 'arrow-down';
    }

    return 'arrow-down-up';
  });

  constructor() {
    // mirror the projected sortable directive's brain into the header brain so `aria-sort` /
    // `data-sortable` / the chevron all reflect the active sort state
    effect(() => {
      const sortable = this._sortable();

      this.brain.registerSortable(sortable?.brain ?? null);
    });
  }
}
