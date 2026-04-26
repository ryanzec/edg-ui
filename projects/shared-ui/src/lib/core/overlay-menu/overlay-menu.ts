import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { List } from '../list/list';
import { ListItem } from '../list/list-item';
import { ListItemIcon } from '../list/list-item-icon';
import { type IconName } from '../icon/icon';
import { OverlayMenuDivider } from './overlay-menu-divider';

/** all available overlay menu item type values */
export const allOverlayMenuItemTypes = ['item', 'divider'] as const;

/** the rendering variant for an overlay menu item */
export type OverlayMenuItemType = (typeof allOverlayMenuItemTypes)[number];

/** a clickable overlay menu entry — the shape emitted by `menuItemClicked` */
export type OverlayMenuItemEntry<
  // this is generic so we need to allow any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMeta = Record<string, any>,
> = {
  /** unique id for the menu item */
  id: string;
  /** rendering variant — omit or set to `'item'` for a standard clickable row */
  type?: 'item';
  /** display label for the menu item */
  label: string;
  /** optional icon displayed before the menu item label */
  icon: IconName | null;
  /** optional consumer-defined metadata associated with the menu item */
  meta?: TMeta;
};

/** a non-clickable divider entry rendered as a visual separator between menu items */
export type OverlayMenuDividerEntry = {
  /** unique id for the divider entry */
  id: string;
  /** rendering variant — `'divider'` renders a visual separator between items */
  type: 'divider';
};

/** a single menu item configuration for the overlay menu */
export type OverlayMenuItem<
  // this is generic so we need to allow any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMeta = Record<string, any>,
> = OverlayMenuItemEntry<TMeta> | OverlayMenuDividerEntry;

/** the default list of menu items displayed in the overlay menu */
export const OVERLAY_MENU_MENU_ITEMS_DEFAULT: OverlayMenuItem[] = [];

/** the default accessible label for the overlay menu container */
export const OVERLAY_MENU_MENU_LABEL_DEFAULT = 'Menu';

/** a dropdown overlay menu that renders a list of clickable items */
@Component({
  selector: 'org-overlay-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkMenu, CdkMenuItem, List, ListItem, ListItemIcon, OverlayMenuDivider],
  templateUrl: './overlay-menu.html',
  styleUrl: './overlay-menu.css',
})
export class OverlayMenu<
  // this is generic so we need to allow any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMeta = Record<string, any>,
> {
  /** the list of items to display in the menu */
  public menuItems = input<OverlayMenuItem<TMeta>[]>(OVERLAY_MENU_MENU_ITEMS_DEFAULT as OverlayMenuItem<TMeta>[]);

  /** the accessible label announced by screen readers for the menu container */
  public menuLabel = input<string>(OVERLAY_MENU_MENU_LABEL_DEFAULT);

  /** emits the selected menu item when a menu item is clicked — divider entries are non-clickable and never emitted */
  public menuItemClicked = output<OverlayMenuItemEntry<TMeta>>();

  /** handles click events for menu items, emitting the selected item */
  protected onMenuItemClick(item: OverlayMenuItemEntry<TMeta>): void {
    this.menuItemClicked.emit(item);
  }
}
