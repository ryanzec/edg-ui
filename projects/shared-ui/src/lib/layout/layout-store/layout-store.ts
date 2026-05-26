import { Injectable, computed, signal } from '@angular/core';
import {
  type NavigationGroup,
  type NavigationItem,
  type OrganizationDisplay,
  type SettingsMenuItem,
} from '../application-navigation/application-navigation';
import { type ComponentColor } from '../../core/types/component-types';

/** unified internal state shape for the layout store */
type LayoutState = {
  currentOrganization: OrganizationDisplay;
  availableOrganizations: OrganizationDisplay[];
  navigationItems: NavigationItem[];
  groupedNavigationItems: NavigationGroup[];
  settingsMenuItems: SettingsMenuItem[];
  userName: string;
  userEmail: string | undefined;
  userStatusColor: ComponentColor | undefined;
  collapsed: boolean;
};

/** ungrouped navigation items rendered above any section groups */
const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: 'house', routePath: '/overview', shortcut: 'G O' },
  { id: 'inbox', label: 'Inbox', icon: 'inbox', routePath: '/inbox', indicator: 3, shortcut: 'G I' },
];

/** grouped navigation items rendered below the ungrouped items, each with a collapsible header */
const GROUPED_NAVIGATION_ITEMS: NavigationGroup[] = [
  {
    id: 'test-1',
    header: 'Test 1',
    items: [
      {
        id: 'projects',
        label: 'Projects',
        icon: 'folder',
        shortcut: 'G P',
        children: [
          { id: 'projects-all', label: 'All projects', routePath: '/projects' },
          { id: 'projects-active', label: 'Active', routePath: '/projects/active', indicator: 12 },
          { id: 'projects-archived', label: 'Archived', routePath: '/projects/archived' },
          { id: 'projects-templates', label: 'Templates', routePath: '/projects/templates' },
        ],
      },
      { id: 'analytics', label: 'Analytics', icon: 'grid-2x2', routePath: '/analytics' },
    ],
  },
  {
    id: 'test-2',
    header: 'Test 2',
    items: [
      { id: 'team', label: 'Team', icon: 'users', routePath: '/demo/users' },
      { id: 'kanban', label: 'Kanban', icon: 'file-text', routePath: '/demo/kanban' },
      { id: 'ticket-details', label: 'Ticket Details', icon: 'credit-card', routePath: '/demo/ticket-details' },
    ],
  },
];

/** hardcoded settings overlay menu items rendered alongside the appearance toggle */
const SETTINGS_MENU_ITEMS: SettingsMenuItem[] = [
  { id: 'workspace-settings', label: 'Workspace settings', icon: 'cog', shortcut: '⌘,' },
  { id: 'account', label: 'Account', icon: 'at-sign' },
  { id: 'shortcuts', label: 'Keyboard shortcuts', icon: 'sparkles', shortcut: '?' },
  { id: 'help', label: 'Help & docs', icon: 'circle-help' },
  { id: 'signout-divider', type: 'divider' },
  { id: 'signout', label: 'Sign out', icon: 'log-out', color: 'danger' },
];

/** hardcoded organization options for the navigation header switcher */
const HALCYON_ORGANIZATION: OrganizationDisplay = { id: 'halcyon', name: 'Halcyon' };

const AVAILABLE_ORGANIZATIONS: OrganizationDisplay[] = [
  HALCYON_ORGANIZATION,
  { id: 'northwind', name: 'Northwind Traders' },
  { id: 'acme', name: 'Acme Co.' },
];

/** initial layout state seeded with hardcoded organization / user / navigation data */
const INITIAL_STATE: LayoutState = {
  currentOrganization: HALCYON_ORGANIZATION,
  availableOrganizations: AVAILABLE_ORGANIZATIONS,
  navigationItems: NAVIGATION_ITEMS,
  groupedNavigationItems: GROUPED_NAVIGATION_ITEMS,
  settingsMenuItems: SETTINGS_MENU_ITEMS,
  userName: 'Maya Brennan',
  userEmail: 'maya@acme.co',
  userStatusColor: 'safe',
  collapsed: false,
};

/**
 * application-wide store for the data that drives `<org-application-frame>` (organization identity, navigation
 * structure, settings menu, signed-in user details, and the collapsed state of the sidebar).
 */
@Injectable({ providedIn: 'root' })
export class LayoutStore {
  /** unified state signal containing every piece of layout state */
  private readonly _state = signal<LayoutState>(INITIAL_STATE);

  /** the currently active organization rendered in the navigation header */
  public readonly currentOrganization = computed<OrganizationDisplay>(() => this._state().currentOrganization);

  /** the full list of organizations the user can switch to via the navigation header */
  public readonly availableOrganizations = computed<OrganizationDisplay[]>(() => this._state().availableOrganizations);

  /** ungrouped top-level navigation items rendered in the sidebar above any section groups */
  public readonly navigationItems = computed<NavigationItem[]>(() => this._state().navigationItems);

  /** grouped navigation items rendered below the ungrouped items, each as a collapsible section */
  public readonly groupedNavigationItems = computed<NavigationGroup[]>(() => this._state().groupedNavigationItems);

  /** settings overlay menu items rendered alongside the appearance toggle */
  public readonly settingsMenuItems = computed<SettingsMenuItem[]>(() => this._state().settingsMenuItems);

  /** display name for the currently signed-in user */
  public readonly userName = computed<string>(() => this._state().userName);

  /** email rendered as the user row's sub-label */
  public readonly userEmail = computed<string | undefined>(() => this._state().userEmail);

  /** status indicator color for the signed-in user's avatar */
  public readonly userStatusColor = computed<ComponentColor | undefined>(() => this._state().userStatusColor);

  /** whether the sidebar is in its collapsed (icon-only) state */
  public readonly collapsed = computed<boolean>(() => this._state().collapsed);

  /** sets the currently active organization rendered in the navigation header */
  public setCurrentOrganization(currentOrganization: OrganizationDisplay): void {
    this._state.update((state) => ({ ...state, currentOrganization }));
  }

  /** sets the collapsed state of the sidebar to an explicit value */
  public setCollapsed(collapsed: boolean): void {
    this._state.update((state) => ({ ...state, collapsed }));
  }

  /** flips the collapsed state of the sidebar */
  public toggleCollapsed(): void {
    this._state.update((state) => ({ ...state, collapsed: !state.collapsed }));
  }
}
