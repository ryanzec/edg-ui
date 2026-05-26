import {
  Component,
  ChangeDetectionStrategy,
  computed,
  effect,
  input,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import { logManager } from '@organization/shared-utils';
import { type IconName } from '../../core/icon/icon-brain';
import { type ComponentColor } from '../../core/types/component-types';
import { Avatar } from '../../core/avatar/avatar';
import { ApplicationNavigationItem } from './application-navigation-item';
import { Icon } from '../../core/icon/icon';
import { List } from '../../core/list/list';
import { ListItem } from '../../core/list/list-item';
import { ListItemIcon } from '../../core/list/list-item-icon';
import {
  OverlayMenu,
  type OverlayMenuItem,
  type OverlayMenuItemEntry,
  type OverlayMenuEntryValueChange,
} from '../../core/overlay-menu/overlay-menu';
import { OverlayMenuTriggerDirective } from '../../core/overlay-menu/overlay-menu-trigger';
import { Tooltip } from '../../core/tooltip/tooltip';
import { TooltipContent } from '../../core/tooltip/tooltip-content';

/** all available theme values */
export const allThemes = ['light', 'dark', 'system'] as const;

/** the user-selectable application theme — controlled by the parent */
export type Theme = (typeof allThemes)[number];

/** a single child entry rendered nested under a parent navigation item */
export type NavigationSubItem = {
  /** unique id used for tracking and identifying the sub-item */
  id: string;
  /** the visible label of the sub-item */
  label: string;
  /** the router link path the sub-item navigates to when clicked */
  routePath: string;
  /** optional numeric indicator rendered as a post-meta badge (e.g. unread count) */
  indicator?: number;
};

/** a top-level navigation entry rendered in the main nav list */
export type NavigationItem = {
  /** unique id used for tracking and identifying the item */
  id: string;
  /** the visible label of the navigation item */
  label: string;
  /** the icon name rendered before the label */
  icon: IconName;
  /** the router link path the item navigates to when clicked (omitted when `children` is provided) */
  routePath?: string;
  /** optional numeric indicator rendered as a post-meta badge */
  indicator?: number;
  /** optional keyboard shortcut hint rendered after the label in collapsed-state tooltips */
  shortcut?: string;
  /** when provided, the item becomes an expandable group rendering these sub-items nested below it */
  children?: NavigationSubItem[];
};

/** a named group of navigation items rendered below the ungrouped items with a collapsible header */
export type NavigationGroup = {
  /** unique id used for tracking the group's expanded state (must not collide with item ids) */
  id: string;
  /** the visible header label rendered above the group's items (styled as an uppercase section label) */
  header: string;
  /** the navigation items rendered inside the group when expanded */
  items: NavigationItem[];
  /** whether the group starts expanded; defaults to `true` when omitted */
  defaultExpanded?: boolean;
};

/** an item or divider passed to the settings overlay menu; `itemClicked` only emits clickable item entries */
export type SettingsMenuItem = OverlayMenuItem;

/** default value for the workspaceIconUrl input */
export const APPLICATION_NAVIGATION_WORKSPACE_ICON_URL_DEFAULT: string | undefined = undefined;

/** default value for the workspaceIconLabel input */
export const APPLICATION_NAVIGATION_WORKSPACE_ICON_LABEL_DEFAULT: string | undefined = undefined;

/** default value for the workspaceName input */
export const APPLICATION_NAVIGATION_WORKSPACE_NAME_DEFAULT = '';

/** default value for the workspacePlan input */
export const APPLICATION_NAVIGATION_WORKSPACE_PLAN_DEFAULT: string | undefined = undefined;

/** default value for the navigationItems input */
export const APPLICATION_NAVIGATION_NAVIGATION_ITEMS_DEFAULT: NavigationItem[] = [];

/** default value for the groupedNavigationItems input */
export const APPLICATION_NAVIGATION_GROUPED_NAVIGATION_ITEMS_DEFAULT: NavigationGroup[] = [];

/** default value for the settingsMenuItems input */
export const APPLICATION_NAVIGATION_SETTINGS_MENU_ITEMS_DEFAULT: SettingsMenuItem[] = [];

/** default value for the userName input */
export const APPLICATION_NAVIGATION_USER_NAME_DEFAULT = '';

/** default value for the userEmail input */
export const APPLICATION_NAVIGATION_USER_EMAIL_DEFAULT: string | undefined = undefined;

/** default value for the userAvatarUrl input */
export const APPLICATION_NAVIGATION_USER_AVATAR_URL_DEFAULT: string | undefined = undefined;

/** default value for the userStatusColor input */
export const APPLICATION_NAVIGATION_USER_STATUS_COLOR_DEFAULT: ComponentColor | undefined = undefined;

/** default value for the collapsed input */
export const APPLICATION_NAVIGATION_COLLAPSED_DEFAULT = false;

/** default value for the theme input — undefined means the appearance section is hidden */
export const APPLICATION_NAVIGATION_THEME_DEFAULT: Theme | undefined = undefined;

/** id used for the appearance button-toggle entry injected at the top of the settings overlay menu */
const APPEARANCE_ENTRY_ID = 'appearance';

@Component({
  selector: 'org-application-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApplicationNavigationItem,
    Avatar,
    Icon,
    List,
    ListItem,
    ListItemIcon,
    OverlayMenu,
    OverlayMenuTriggerDirective,
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
  /** explicit image url rendered as the workspace icon in the header */
  public workspaceIconUrl = input<string | undefined>(APPLICATION_NAVIGATION_WORKSPACE_ICON_URL_DEFAULT);

  /** optional one-or-two letter label rendered inside a colored shape when no icon url is provided */
  public workspaceIconLabel = input<string | undefined>(APPLICATION_NAVIGATION_WORKSPACE_ICON_LABEL_DEFAULT);

  /** the workspace name rendered at the top of the navigation */
  public workspaceName = input<string>(APPLICATION_NAVIGATION_WORKSPACE_NAME_DEFAULT);

  /** optional plan / subtitle rendered under the workspace name (e.g. "Acme Inc · Pro") */
  public workspacePlan = input<string | undefined>(APPLICATION_NAVIGATION_WORKSPACE_PLAN_DEFAULT);

  /** list of navigation items to display in the sidebar; always rendered before grouped items */
  public navigationItems = input<NavigationItem[]>(APPLICATION_NAVIGATION_NAVIGATION_ITEMS_DEFAULT);

  /** list of grouped navigation items; each group renders a collapsible header followed by its items, after the ungrouped items */
  public groupedNavigationItems = input<NavigationGroup[]>(APPLICATION_NAVIGATION_GROUPED_NAVIGATION_ITEMS_DEFAULT);

  /** list of items to display in the settings overlay menu (in addition to the appearance toggle) */
  public settingsMenuItems = input<SettingsMenuItem[]>(APPLICATION_NAVIGATION_SETTINGS_MENU_ITEMS_DEFAULT);

  /** display name for the currently signed-in user */
  public userName = input<string>(APPLICATION_NAVIGATION_USER_NAME_DEFAULT);

  /** optional email rendered as the user row's sub-label */
  public userEmail = input<string | undefined>(APPLICATION_NAVIGATION_USER_EMAIL_DEFAULT);

  /** optional image url for the user's avatar */
  public userAvatarUrl = input<string | undefined>(APPLICATION_NAVIGATION_USER_AVATAR_URL_DEFAULT);

  /** when set, renders the avatar's status indicator with this color (e.g. `'safe'` for online) */
  public userStatusColor = input<ComponentColor | undefined>(APPLICATION_NAVIGATION_USER_STATUS_COLOR_DEFAULT);

  /** whether the navigation is collapsed to a minimal icon-only state */
  public collapsed = model<boolean>(APPLICATION_NAVIGATION_COLLAPSED_DEFAULT);

  /** the currently selected theme — when undefined, the appearance section is hidden in settings */
  public theme = model<Theme | undefined>(APPLICATION_NAVIGATION_THEME_DEFAULT);

  /** emits when a top-level navigation item is clicked */
  public navigationItemClicked = output<NavigationItem>();

  /** emits when a nested navigation sub-item is clicked */
  public subNavigationItemClicked = output<NavigationSubItem>();

  /** emits when a settings menu item is clicked */
  public settingsMenuItemClicked = output<SettingsMenuItem>();

  /** emits when the workspace header is clicked (parent decides whether to open a workspace switcher) */
  public workspaceClicked = output<void>();

  /** emits when the logout button is clicked */
  public logout = output<void>();

  /** tracks which expandable navigation groups (item-with-children and section groups) are currently expanded by id */
  private readonly _expandedGroupIds = signal<ReadonlySet<string>>(new Set<string>());

  /** ids of section groups that have already been seeded into _expandedGroupIds — prevents user toggles from being overwritten on subsequent input changes */
  private readonly _seenSectionGroupIds = new Set<string>();

  /** the section groups that should be rendered — filters out groups whose `items` are empty (these emit a logManager warning via the seeding effect) */
  protected readonly visibleGroups = computed<NavigationGroup[]>(() =>
    this.groupedNavigationItems().filter((group) => group.items.length > 0)
  );

  /** the icon name used for the collapse / expand toggle button */
  protected readonly toggleIconName = computed<IconName>(() => (this.collapsed() ? 'chevron-right' : 'chevron-left'));

  /** the accessible label used for the collapse / expand toggle button */
  protected readonly toggleAriaLabel = computed<string>(() =>
    this.collapsed() ? 'Expand navigation' : 'Collapse navigation'
  );

  /** the resolved items rendered inside the settings overlay menu (appearance entry + divider + consumer items) */
  protected readonly resolvedSettingsItems = computed<OverlayMenuItem[]>(() => {
    const items: OverlayMenuItem[] = [];
    const currentTheme = this.theme();

    if (currentTheme !== undefined) {
      items.push({
        id: APPEARANCE_ENTRY_ID,
        type: 'button-toggle',
        value: currentTheme,
        items: [
          { label: 'Light', value: 'light', buttonColor: 'neutral' },
          { label: 'Dark', value: 'dark', buttonColor: 'neutral' },
          { label: 'System', value: 'system', buttonColor: 'neutral' },
        ],
      });
      items.push({ id: `${APPEARANCE_ENTRY_ID}-divider`, type: 'divider' });
    }

    return [...items, ...this.settingsMenuItems()];
  });

  /** optional uppercase header text rendered above the settings overlay menu when a theme is set */
  protected readonly settingsMenuHeader = computed<string | undefined>(() =>
    this.theme() !== undefined ? 'Appearance' : undefined
  );

  /** whether the appearance section is shown in the settings overlay menu */
  protected readonly hasAppearance = computed<boolean>(() => this.theme() !== undefined);

  constructor() {
    /**
     * seeds the expanded set for newly-seen section groups based on their `defaultExpanded` value
     * (treating omitted as `true`) and warns about any group with no items. only seeds once per group id
     * so a subsequent input change does not overwrite a user's toggle. writes are wrapped in `untracked`
     * so the effect does not re-fire on its own signal update.
     */
    effect(() => {
      const groups = this.groupedNavigationItems();

      untracked(() => {
        const newlyExpandedIds: string[] = [];

        for (const group of groups) {
          if (group.items.length === 0) {
            logManager.warn({
              type: 'application-navigation-empty-group',
              message: `navigation group "${group.id}" has no items and will not be rendered`,
              groupId: group.id,
            });

            continue;
          }

          if (this._seenSectionGroupIds.has(group.id)) {
            continue;
          }

          this._seenSectionGroupIds.add(group.id);

          if (group.defaultExpanded === false) {
            continue;
          }

          newlyExpandedIds.push(group.id);
        }

        if (newlyExpandedIds.length === 0) {
          return;
        }

        this._expandedGroupIds.update((current) => {
          const next = new Set(current);

          for (const id of newlyExpandedIds) {
            next.add(id);
          }

          return next;
        });
      });
    });
  }

  /** maps a sub-item list into the overlay menu item entry shape used for collapsed-state nested menus */
  public toSubMenuItems(subItems: NavigationSubItem[]): OverlayMenuItem[] {
    return subItems.map((subItem) => ({
      id: subItem.id,
      label: subItem.label,
      icon: null,
      indicator: subItem.indicator,
      meta: subItem,
    }));
  }

  /** returns whether the group / item-with-children with the given id is expanded */
  public isGroupExpanded(id: string): boolean {
    return this._expandedGroupIds().has(id);
  }

  protected onWorkspaceClick(): void {
    this.workspaceClicked.emit();
  }

  /** invoked by the navigation item sub-component when a plain item is clicked */
  public onNavigationItemClick(item: NavigationItem): void {
    this.navigationItemClicked.emit(item);
  }

  /** invoked by the navigation item sub-component when a nested sub-item is clicked */
  public onSubNavigationItemClick(subItem: NavigationSubItem): void {
    this.subNavigationItemClicked.emit(subItem);
  }

  /** toggles the expanded state for the given group / item-with-children id */
  public onGroupToggle(id: string): void {
    this._expandedGroupIds.update((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);

        return next;
      }

      next.add(id);

      return next;
    });
  }

  /** invoked by the navigation item sub-component when the collapsed-state overlay menu emits a sub-item click */
  public onSubMenuItemTriggered(item: OverlayMenuItemEntry): void {
    const subItem = item.meta as NavigationSubItem | undefined;

    if (!subItem) {
      return;
    }

    this.subNavigationItemClicked.emit(subItem);
  }

  protected onSettingsMenuItemTriggered(item: OverlayMenuItemEntry): void {
    if (item.id === APPEARANCE_ENTRY_ID) {
      return;
    }

    this.settingsMenuItemClicked.emit(item);
  }

  protected onSettingsEntryValueChanged(event: OverlayMenuEntryValueChange): void {
    if (event.entryId !== APPEARANCE_ENTRY_ID) {
      return;
    }

    if (!this._isTheme(event.value)) {
      return;
    }

    this.theme.set(event.value);
  }

  protected onLogoutClick(): void {
    this.logout.emit();
  }

  protected onCollapseToggleClick(): void {
    this.collapsed.update((value) => !value);
  }

  private _isTheme(value: string): value is Theme {
    return (allThemes as readonly string[]).includes(value);
  }
}
