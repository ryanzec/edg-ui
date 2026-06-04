import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { ListBrainDirective } from '../list/list-brain';

/** all available list size values */
export const allListSizes = ['sm', 'base'] as const;

/** the size variant of the list */
export type ListSize = (typeof allListSizes)[number];

/** all available list select mode values */
export const allListSelectModes = ['single', 'multiple'] as const;

/** the selection mode of the list; drives child list-item border-radius behavior on selection */
export type ListSelectMode = (typeof allListSelectModes)[number];

/** all available list border values */
export const allListBorders = ['none', 'items-only', 'full', 'list-only'] as const;

/**
 * the border style applied to the list
 *
 * none: no borders
 * items-only: a standard bottom border on every item except the last (no outer frame)
 * full: an outer frame around the list with a bottom separator on every item except the last
 * list-only: an outer frame around the list with no item separators
 */
export type ListBorder = (typeof allListBorders)[number];

/** default value for the size input */
export const LIST_SIZE_DEFAULT: ListSize = 'sm';

/** default value for the selectMode input */
export const LIST_SELECT_MODE_DEFAULT: ListSelectMode | undefined = undefined;

/** default value for the border input */
export const LIST_BORDER_DEFAULT: ListBorder = 'none';

@Component({
  selector: 'org-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './list.html',
  styleUrl: './list.css',
  hostDirectives: [
    {
      directive: ListBrainDirective,
      inputs: ['listRole'],
    },
  ],
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-select-mode]': 'selectMode() ?? null',
    '[attr.data-border]': 'border()',
  },
})
export class List {
  protected readonly brain = inject(ListBrainDirective, { self: true });

  /** the size variant applied to all child list items */
  public readonly size = input<ListSize>(LIST_SIZE_DEFAULT);

  /** the selection mode that drives child list-item border-radius behavior; single rounds selected items, multiple keeps full bleed */
  public readonly selectMode = input<ListSelectMode | undefined, ListSelectMode | null | undefined>(
    LIST_SELECT_MODE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** the border style applied to the host list and its child items */
  public readonly border = input<ListBorder>(LIST_BORDER_DEFAULT);
}
