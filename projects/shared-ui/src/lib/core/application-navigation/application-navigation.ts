import { Component, ChangeDetectionStrategy, computed, input, model, output } from '@angular/core';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { type IconName } from '../../brain/icon-brain/icon-brain';
import { Icon } from '../icon/icon';
import { List } from '../list/list';
import { ListItem } from '../list/list-item';
import { ListItemIcon } from '../list/list-item-icon';
import { Avatar } from '../avatar/avatar';
import { OverlayMenu, type OverlayMenuItem } from '../overlay-menu/overlay-menu';
import { Tooltip } from '../tooltip/tooltip';
import { TooltipContent } from '../tooltip/tooltip-content';
import { RouterLink } from '@angular/router';

export type NavigationItem = {
  id: string;
  label: string;
  icon: IconName;
  routePath: string;
};

export type SettingsMenuItem = OverlayMenuItem;

/** default value for the logo input */
export const APPLICATION_NAVIGATION_LOGO_DEFAULT = '';

/** default value for the navigationItems input */
export const APPLICATION_NAVIGATION_NAVIGATION_ITEMS_DEFAULT: NavigationItem[] = [];

/** default value for the settingsMenuItems input */
export const APPLICATION_NAVIGATION_SETTINGS_MENU_ITEMS_DEFAULT: SettingsMenuItem[] = [];

/** default value for the userName input */
export const APPLICATION_NAVIGATION_USER_NAME_DEFAULT = '';

/** default value for the collapsed input */
export const APPLICATION_NAVIGATION_COLLAPSED_DEFAULT = false;

@Component({
  selector: 'org-application-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    List,
    ListItem,
    ListItemIcon,
    CdkMenuTrigger,
    Avatar,
    OverlayMenu,
    RouterLink,
    Icon,
    Tooltip,
    TooltipContent,
  ],
  templateUrl: './application-navigation.html',
  styleUrl: './application-navigation.css',
  host: {
    '[attr.data-collapsed]': 'collapsed() ? "" : null',
  },
})
export class ApplicationNavigation {
  /** url-friendly path to the logo image */
  public logo = input<string>(APPLICATION_NAVIGATION_LOGO_DEFAULT);

  /** list of navigation items to display in the sidebar */
  public navigationItems = input<NavigationItem[]>(APPLICATION_NAVIGATION_NAVIGATION_ITEMS_DEFAULT);

  /** list of items to display in the settings dropdown */
  public settingsMenuItems = input<SettingsMenuItem[]>(APPLICATION_NAVIGATION_SETTINGS_MENU_ITEMS_DEFAULT);

  /** display name for the currently signed-in user */
  public userName = input<string>(APPLICATION_NAVIGATION_USER_NAME_DEFAULT);

  /** whether the navigation is collapsed to a minimal icon-only state */
  public collapsed = model<boolean>(APPLICATION_NAVIGATION_COLLAPSED_DEFAULT);

  /** emits when a navigation item is clicked */
  public navigationItemClicked = output<NavigationItem>();

  /** emits when a settings menu item is clicked */
  public settingsMenuItemClicked = output<SettingsMenuItem>();

  /** emits when the logout button is clicked */
  public logout = output<void>();

  /** overlay position config for the settings dropdown menu */
  protected readonly menuPosition: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetX: 8,
    },
  ];

  /** the icon name used for the collapse / expand toggle button */
  protected readonly toggleIconName = computed<IconName>(() => (this.collapsed() ? 'chevron-right' : 'chevron-left'));

  /** the accessible label used for the collapse / expand toggle button */
  protected readonly toggleAriaLabel = computed<string>(() =>
    this.collapsed() ? 'Expand navigation' : 'Collapse navigation'
  );

  protected onNavigationItemClick(item: NavigationItem): void {
    this.navigationItemClicked.emit(item);
  }

  protected onSettingsMenuItemClick(item: SettingsMenuItem): void {
    this.settingsMenuItemClicked.emit(item);
  }

  protected onLogoutClick(): void {
    this.logout.emit();
  }

  protected onCollapseToggleClick(): void {
    this.collapsed.update((value) => !value);
  }
}
