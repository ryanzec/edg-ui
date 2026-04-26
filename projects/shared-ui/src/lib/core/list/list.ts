import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';

/** all available list size values */
export const allListSizes = ['sm', 'base'] as const;

/** the size variant of the list */
export type ListSize = (typeof allListSizes)[number];

/** all available list border variant values */
export const allListBorderVariants = ['outer'] as const;

/** the border style variant of the list */
export type ListBorderVariant = (typeof allListBorderVariants)[number];

/** the default size of the list */
export const LIST_SIZE_DEFAULT: ListSize = 'sm';

/** the default role override for the inner ul element */
export const LIST_LIST_ROLE_DEFAULT: string | undefined = undefined;

/** the default border variant of the list */
export const LIST_BORDER_VARIANT_DEFAULT: ListBorderVariant | undefined = undefined;

@Component({
  selector: 'org-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './list.html',
  styleUrl: './list.css',
  host: {
    '[attr.data-border-variant]': 'borderVariant()',
    '[attr.data-size]': 'size()',
  },
})
export class List {
  /** the size variant applied to all child list items */
  public size = input<ListSize>(LIST_SIZE_DEFAULT);

  /** overrides the role attribute on the inner ul element; use "none" to remove list semantics when needed */
  public listRole = input<string | undefined, string | null | undefined>(LIST_LIST_ROLE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the border style variant applied to the host element */
  public borderVariant = input<ListBorderVariant | undefined, ListBorderVariant | null | undefined>(
    LIST_BORDER_VARIANT_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );
}
