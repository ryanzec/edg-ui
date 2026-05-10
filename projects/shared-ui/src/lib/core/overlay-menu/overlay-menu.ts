import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { List, type ListSize } from '../list/list';
import { ListItem } from '../list/list-item';
import { ListItemIcon } from '../list/list-item-icon';
import { Tag, type TagColor } from '../tag/tag';
import {
  OverlayMenuBrainDirective,
  type OverlayMenuItemEntry,
} from '../../brain/overlay-menu-brain/overlay-menu-brain';
import { OverlayMenuItemBrainDirective } from '../../brain/overlay-menu-item-brain/overlay-menu-item-brain';
import { OverlayMenuDivider } from './overlay-menu-divider';
import { OverlayMenuItemMeta } from './overlay-menu-item-meta';

export {
  type OverlayMenuItem,
  type OverlayMenuItemEntry,
  type OverlayMenuItemType,
  type OverlayMenuDividerEntry,
  type OverlayMenuItemTag,
  allOverlayMenuItemTypes,
  OVERLAY_MENU_ITEMS_DEFAULT,
  OVERLAY_MENU_LABEL_DEFAULT,
} from '../../brain/overlay-menu-brain/overlay-menu-brain';

/** all available overlay menu state values driving the optional reveal motion */
export const allOverlayMenuStates = ['open', 'closed'] as const;

/** the reveal motion state for the overlay menu panel */
export type OverlayMenuState = (typeof allOverlayMenuStates)[number];

/** the row size variant for the overlay menu — drives per-row density via the inner org-list */
export type OverlayMenuListSize = Extract<ListSize, 'sm' | 'base'>;

/** all available overlay menu list size values */
export const allOverlayMenuListSizes = ['sm', 'base'] as const satisfies readonly OverlayMenuListSize[];

/** default value for the listSize input */
export const OVERLAY_MENU_LIST_SIZE_DEFAULT: OverlayMenuListSize = 'sm';

/** default value for the state input — undefined skips the reveal motion entirely */
export const OVERLAY_MENU_STATE_DEFAULT: OverlayMenuState | undefined = undefined;

/** a dropdown overlay menu that renders a list of clickable items */
@Component({
  selector: 'org-overlay-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [List, ListItem, ListItemIcon, Tag, OverlayMenuDivider, OverlayMenuItemMeta, OverlayMenuItemBrainDirective],
  templateUrl: './overlay-menu.html',
  styleUrl: './overlay-menu.css',
  hostDirectives: [
    {
      directive: OverlayMenuBrainDirective,
      inputs: ['label', 'items'],
      outputs: ['itemClicked'],
    },
  ],
  host: {
    '[attr.data-state]': 'state() ?? null',
  },
})
export class OverlayMenu<
  // this is generic so we need to allow any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMeta = Record<string, any>,
> {
  protected readonly brain = inject<OverlayMenuBrainDirective<TMeta>>(OverlayMenuBrainDirective, { self: true });

  /** the row size variant of the menu — `'sm'` (default menu density) or `'base'` (taller rows) */
  public readonly listSize = input<OverlayMenuListSize>(OVERLAY_MENU_LIST_SIZE_DEFAULT);

  /** optional reveal motion state — when omitted, the panel appears instantly with no transition */
  public readonly state = input<OverlayMenuState | undefined, OverlayMenuState | null | undefined>(
    OVERLAY_MENU_STATE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** forwards a triggered item from the per-item brain to the parent brain's `itemClicked` output */
  protected onItemTriggered(item: OverlayMenuItemEntry<TMeta>): void {
    this.brain.handleItemClick(item);
  }

  /** narrows the brain entry type's loose `tag.color` (string) into the strict `TagColor` for rendering */
  protected toTagColor(value: string): TagColor {
    return value as TagColor;
  }
}
