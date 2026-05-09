import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { List } from '../list/list';
import { ListItem } from '../list/list-item';
import { ListItemIcon } from '../list/list-item-icon';
import {
  OverlayMenuBrainDirective,
  type OverlayMenuItemEntry,
} from '../../brain/overlay-menu-brain/overlay-menu-brain';
import { OverlayMenuItemBrainDirective } from '../../brain/overlay-menu-item-brain/overlay-menu-item-brain';
import { OverlayMenuDivider } from './overlay-menu-divider';

export {
  type OverlayMenuItem,
  type OverlayMenuItemEntry,
  type OverlayMenuItemType,
  type OverlayMenuDividerEntry,
  allOverlayMenuItemTypes,
  OVERLAY_MENU_ITEMS_DEFAULT,
  OVERLAY_MENU_LABEL_DEFAULT,
} from '../../brain/overlay-menu-brain/overlay-menu-brain';

/** a dropdown overlay menu that renders a list of clickable items */
@Component({
  selector: 'org-overlay-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [List, ListItem, ListItemIcon, OverlayMenuDivider, OverlayMenuItemBrainDirective],
  templateUrl: './overlay-menu.html',
  styleUrl: './overlay-menu.css',
  hostDirectives: [
    {
      directive: OverlayMenuBrainDirective,
      inputs: ['label', 'items'],
      outputs: ['itemClicked'],
    },
  ],
})
export class OverlayMenu<
  // this is generic so we need to allow any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMeta = Record<string, any>,
> {
  protected readonly brain = inject<OverlayMenuBrainDirective<TMeta>>(OverlayMenuBrainDirective, { self: true });

  /** forwards a triggered item from the per-item brain to the parent brain's `itemClicked` output */
  protected onItemTriggered(item: OverlayMenuItemEntry<TMeta>): void {
    this.brain.handleItemClick(item);
  }
}
