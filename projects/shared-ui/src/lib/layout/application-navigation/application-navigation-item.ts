import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApplicationNavigation, type NavigationItem, type NavigationSubItem } from './application-navigation';
import { Icon } from '../../core/icon/icon';
import { Indicator } from '../../core/indicator/indicator';
import { Kbd } from '../../core/kbd/kbd';
import { List } from '../../core/list/list';
import { ListItem } from '../../core/list/list-item';
import { ListItemIcon } from '../../core/list/list-item-icon';
import { OverlayMenu, type OverlayMenuItemEntry } from '../../core/overlay-menu/overlay-menu';
import { OverlayMenuTriggerDirective } from '../../core/overlay-menu/overlay-menu-trigger';
import { Tooltip } from '../../core/tooltip/tooltip';
import { TooltipContent } from '../../core/tooltip/tooltip-content';

/**
 * renders a single navigation item (plain or expandable-with-children) in either the collapsed
 * (icon-only with tooltip / overlay menu) or expanded state. extracted from the parent so the same
 * markup can be reused for top-level ungrouped items, items inside a section group, and the flat
 * collapsed-state list — while still letting `org-list-item` resolve its parent `org-list` via the
 * element-injector tree at the render site (something `ngTemplateOutlet` would break).
 */
@Component({
  selector: 'org-application-navigation-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Icon,
    Indicator,
    Kbd,
    List,
    ListItem,
    ListItemIcon,
    OverlayMenu,
    OverlayMenuTriggerDirective,
    RouterLink,
    Tooltip,
    TooltipContent,
  ],
  templateUrl: './application-navigation-item.html',
  styleUrl: './application-navigation-item.css',
})
export class ApplicationNavigationItem {
  private readonly _parent = inject(ApplicationNavigation);

  /** the navigation item to render */
  public item = input.required<NavigationItem>();

  /** whether the parent sidebar is currently collapsed (icon-only state) */
  protected readonly isCollapsed = computed<boolean>(() => this._parent.collapsed());

  /** whether this item has nested children (renders as an expandable group) */
  protected readonly hasChildren = computed<boolean>(() => {
    const children = this.item().children;

    return !!children && children.length > 0;
  });

  /** whether this item-with-children is currently expanded inline */
  protected readonly isExpanded = computed<boolean>(() => this._parent.isGroupExpanded(this.item().id));

  /** overlay menu items derived from this item's children for the collapsed-state nested menu */
  protected readonly subMenuItems = computed(() => {
    const children = this.item().children ?? [];

    return this._parent.toSubMenuItems(children);
  });

  protected onItemClick(): void {
    this._parent.onNavigationItemClick(this.item());
  }

  protected onSubItemClick(subItem: NavigationSubItem): void {
    this._parent.onSubNavigationItemClick(subItem);
  }

  protected onToggleExpanded(): void {
    this._parent.onGroupToggle(this.item().id);
  }

  protected onSubMenuItemTriggered(entry: OverlayMenuItemEntry): void {
    this._parent.onSubMenuItemTriggered(entry);
  }
}
