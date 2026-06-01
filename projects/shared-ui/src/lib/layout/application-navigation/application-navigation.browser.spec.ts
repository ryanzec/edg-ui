import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils, type SilencedLogManager } from '../../../../../../vitest-browser-utils';
import {
  ApplicationNavigation,
  type NavigationGroup,
  type NavigationItem,
  type NavigationSubItem,
  type OrganizationDisplay,
  type SettingsMenuItem,
  type Theme,
} from './application-navigation';

const TEST_UNGROUPED_ITEMS: NavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: 'house', routePath: '/overview' },
  { id: 'inbox', label: 'Inbox', icon: 'inbox', routePath: '/inbox', indicator: 3 },
];

const TEST_ITEM_WITH_CHILDREN: NavigationItem = {
  id: 'projects',
  label: 'Projects',
  icon: 'folder',
  children: [
    { id: 'projects-all', label: 'All projects', routePath: '/projects' },
    { id: 'projects-active', label: 'Active', routePath: '/projects/active' },
  ],
};

const TEST_GROUPED_ITEMS: NavigationGroup[] = [
  {
    id: 'group-alpha',
    header: 'Group Alpha',
    items: [
      TEST_ITEM_WITH_CHILDREN,
      { id: 'analytics', label: 'Analytics', icon: 'grid-2x2', routePath: '/analytics' },
    ],
  },
  {
    id: 'group-beta',
    header: 'Group Beta',
    defaultExpanded: false,
    items: [
      { id: 'team', label: 'Team', icon: 'users', routePath: '/team' },
      { id: 'kanban', label: 'Kanban', icon: 'file-text', routePath: '/kanban' },
    ],
  },
];

const TEST_SETTINGS_ITEMS: SettingsMenuItem[] = [
  { id: 'workspace-settings', label: 'Workspace settings', icon: 'cog' },
  { id: 'account', label: 'Account', icon: 'at-sign' },
];

const TEST_CURRENT_ORGANIZATION: OrganizationDisplay = {
  id: 'current-org',
  name: 'Test Organization',
  imageUrl: 'https://example.com/current-org.png',
};

const TEST_AVAILABLE_ORGANIZATIONS_MULTI: OrganizationDisplay[] = [
  TEST_CURRENT_ORGANIZATION,
  { id: 'other-a', name: 'Other Org A', imageUrl: 'https://example.com/other-a.png' },
  { id: 'other-b', name: 'Other Org B' },
];

@Component({
  selector: 'test-application-navigation-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ApplicationNavigation],
  host: { class: 'block' },
  template: `
    <div data-testid="layout" style="height: 40rem; display: flex;">
      <org-application-navigation
        data-testid="nav"
        [currentOrganization]="currentOrganization()"
        [availableOrganizations]="availableOrganizations()"
        [navigationItems]="navigationItems()"
        [groupedNavigationItems]="groupedNavigationItems()"
        [settingsMenuItems]="settingsItems()"
        [collapsed]="collapsed()"
        (collapsedChange)="collapsed.set($event)"
        [theme]="theme()"
        (themeChange)="theme.set($event)"
        [userName]="userName()"
        [userEmail]="userEmail()"
        (availableOrganizationSelected)="onAvailableOrganizationSelected($event)"
        (navigationItemClicked)="onNavigationItemClicked($event)"
        (subNavigationItemClicked)="onSubNavigationItemClicked($event)"
        (settingsMenuItemClicked)="onSettingsMenuItemClicked($event)"
      />
    </div>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class ApplicationNavigationHost {
  public readonly currentOrganization = signal<OrganizationDisplay>(TEST_CURRENT_ORGANIZATION);
  public readonly availableOrganizations = signal<OrganizationDisplay[]>([]);
  public readonly navigationItems = signal<NavigationItem[]>(TEST_UNGROUPED_ITEMS);
  public readonly groupedNavigationItems = signal<NavigationGroup[]>(TEST_GROUPED_ITEMS);
  public readonly settingsItems = signal<SettingsMenuItem[]>(TEST_SETTINGS_ITEMS);
  public readonly collapsed = signal<boolean>(false);
  public readonly theme = signal<Theme | undefined>(undefined);
  public readonly userName = signal<string>('Test User');
  public readonly userEmail = signal<string | undefined>('test@example.com');

  protected readonly lastSelectedOrganizationId = signal<string>('');
  protected readonly lastNavigationItemId = signal<string>('');
  protected readonly lastSubNavigationItemId = signal<string>('');
  protected readonly lastSettingsItemId = signal<string>('');

  protected readout(): string {
    return [
      `lastSelectedOrg=${this.lastSelectedOrganizationId()}`,
      `lastNavItem=${this.lastNavigationItemId()}`,
      `lastSubNavItem=${this.lastSubNavigationItemId()}`,
      `lastSettingsItem=${this.lastSettingsItemId()}`,
      `collapsed=${this.collapsed()}`,
      `theme=${this.theme() ?? 'undefined'}`,
    ].join(' ');
  }

  /** appends a group whose `items` are empty so the empty-group filtering can be asserted. */
  public addEmptyGroup(): void {
    this.groupedNavigationItems.update((groups) => [
      ...groups,
      { id: 'group-empty', header: 'Group Empty', items: [] },
    ]);
  }

  /** replaces the grouped-items input with a fresh array of the same shape to verify toggle state survives reference churn. */
  public replaceGroupsWithSameShape(): void {
    this.groupedNavigationItems.set([...TEST_GROUPED_ITEMS.map((group) => ({ ...group, items: [...group.items] }))]);
  }

  protected onAvailableOrganizationSelected(organization: OrganizationDisplay): void {
    this.lastSelectedOrganizationId.set(organization.id);
  }

  protected onNavigationItemClicked(item: NavigationItem): void {
    this.lastNavigationItemId.set(item.id);
  }

  protected onSubNavigationItemClicked(subItem: NavigationSubItem): void {
    this.lastSubNavigationItemId.set(subItem.id);
  }

  protected onSettingsMenuItemClicked(item: SettingsMenuItem): void {
    this.lastSettingsItemId.set(item.id);
  }
}

type ApplicationNavigationHostConfig = {
  currentOrganization?: OrganizationDisplay;
  availableOrganizations?: OrganizationDisplay[];
  navigationItems?: NavigationItem[];
  groupedNavigationItems?: NavigationGroup[];
  settingsItems?: SettingsMenuItem[];
  collapsed?: boolean;
  theme?: Theme;
  userName?: string;
  userEmail?: string;
};

describe('ApplicationNavigation (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createApplicationNavigation = (
    config: ApplicationNavigationHostConfig = {}
  ): ComponentFixture<ApplicationNavigationHost> =>
    createFixture(ApplicationNavigationHost, (instance) => {
      if (config.currentOrganization !== undefined) {
        instance.currentOrganization.set(config.currentOrganization);
      }

      if (config.availableOrganizations !== undefined) {
        instance.availableOrganizations.set(config.availableOrganizations);
      }

      if (config.navigationItems !== undefined) {
        instance.navigationItems.set(config.navigationItems);
      }

      if (config.groupedNavigationItems !== undefined) {
        instance.groupedNavigationItems.set(config.groupedNavigationItems);
      }

      if (config.settingsItems !== undefined) {
        instance.settingsItems.set(config.settingsItems);
      }

      if (config.collapsed !== undefined) {
        instance.collapsed.set(config.collapsed);
      }

      if (config.theme !== undefined) {
        instance.theme.set(config.theme);
      }

      if (config.userName !== undefined) {
        instance.userName.set(config.userName);
      }

      if (config.userEmail !== undefined) {
        instance.userEmail.set(config.userEmail);
      }
    });

  // the cdk overlay menu (org switcher / settings) renders outside the fixture, attached to document.body
  const queryOverlayMenu = (): HTMLElement | null => document.body.querySelector('org-overlay-menu');

  const waitForOverlayMenu = async (): Promise<HTMLElement> => {
    await waitFor(() => expect(queryOverlayMenu()).not.toBeNull());

    return queryOverlayMenu() as HTMLElement;
  };

  /** the visible label text of a list-item / overlay menu row (the label renders in a dedicated span). */
  const labelText = (element: Element): string =>
    (element.querySelector('span.flex-1, span.sr-only')?.textContent ?? '').trim();

  /** resolves an anchor list-item by its visible label, scoped to the given root. */
  const findAnchorByLabel = (root: HTMLElement, label: string): HTMLAnchorElement | null =>
    (Array.from(root.querySelectorAll('a.list-item-content')) as HTMLAnchorElement[]).find(
      (anchor) => labelText(anchor) === label
    ) ?? null;

  /** resolves a button list-item by its visible label, scoped to the given root. */
  const findButtonByLabel = (root: HTMLElement, label: string): HTMLButtonElement | null =>
    (Array.from(root.querySelectorAll('button.list-item-content')) as HTMLButtonElement[]).find(
      (button) => labelText(button) === label
    ) ?? null;

  /** resolves a section-group header button by its header text. */
  const findGroupHeaderButton = (host: HTMLElement, headerText: string): HTMLButtonElement | null =>
    (Array.from(host.querySelectorAll('button.nav-group-header')) as HTMLButtonElement[]).find(
      (button) => button.querySelector('.nav-group-header-label')?.textContent?.trim() === headerText
    ) ?? null;

  /** resolves the section-group container element by its header text. */
  const findGroupSection = (host: HTMLElement, headerText: string): HTMLElement | null =>
    findGroupHeaderButton(host, headerText)?.closest('.nav-group-section') as HTMLElement | null;

  /** resolves the inner native button that triggers the organization switcher overlay menu (null when non-interactive). */
  const findOrganizationTriggerButton = (host: HTMLElement): HTMLButtonElement | null =>
    host.querySelector('.organization-section button.list-item-content');

  /** resolves the inner native button that triggers the settings overlay menu. */
  const findSettingsTriggerButton = (host: HTMLElement): HTMLButtonElement | null =>
    host.querySelector('.settings-section button.list-item-content');

  /** resolves an overlay menu row button by its visible label text. */
  const findOverlayMenuItem = (overlay: HTMLElement, label: string): HTMLButtonElement | null =>
    (Array.from(overlay.querySelectorAll('button.menu-item-button')) as HTMLButtonElement[]).find((button) =>
      button.textContent?.includes(label)
    ) ?? null;

  beforeEach(setupTestBed);

  afterEach(() => {
    destroyFixture();

    // defensively clear any overlay panes / backdrops left in the body so a stale menu can't leak into the next test
    document.querySelectorAll('.cdk-overlay-pane, .cdk-overlay-backdrop').forEach((element) => element.remove());
  });

  describe('rendering and order', () => {
    it('renders ungrouped items before grouped items', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      const navList = host.querySelector('nav[aria-label="Main navigation"]') as HTMLElement;
      const navigationItems = navList.querySelectorAll('org-application-navigation-item');

      expect(navigationItems.length).toBeGreaterThanOrEqual(2);
      expect(labelText(navigationItems[0])).toBe('Overview');
      expect(labelText(navigationItems[1])).toBe('Inbox');
    });

    it('orders the section groups after the ungrouped items in the dom', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      const nav = host.querySelector('nav') as HTMLElement;
      const renderables = Array.from(nav.querySelectorAll('org-application-navigation-item, .nav-group-section'));

      const firstItemIndex = renderables.findIndex(
        (element) => element.tagName.toLowerCase() === 'org-application-navigation-item'
      );
      const firstGroupIndex = renderables.findIndex((element) => element.classList.contains('nav-group-section'));

      expect(firstItemIndex).toBeGreaterThanOrEqual(0);
      expect(firstGroupIndex).toBeGreaterThan(firstItemIndex);
    });

    it('labels the navigation landmark with an aria-label', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      const nav = host.querySelector('nav') as HTMLElement;

      expect(nav.getAttribute('aria-label')).toBe('Main navigation');
    });

    it('renders a numeric indicator when an item provides one', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      const inboxAnchor = findAnchorByLabel(host, 'Inbox') as HTMLAnchorElement;
      const indicator = inboxAnchor.querySelector('org-indicator');

      expect(indicator).not.toBeNull();
      expect(indicator?.textContent).toContain('3');
    });
  });

  describe('plain item interaction', () => {
    it('emits navigationItemClicked when a plain item is clicked', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);

      const overviewAnchor = findAnchorByLabel(host, 'Overview') as HTMLAnchorElement;
      await userEvent.click(overviewAnchor);

      await waitFor(() => expect(readout.textContent).toContain('lastNavItem=overview'));
    });

    it('emits navigationItemClicked when an item inside a group is clicked', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);

      const analyticsAnchor = findAnchorByLabel(host, 'Analytics') as HTMLAnchorElement;
      await userEvent.click(analyticsAnchor);

      await waitFor(() => expect(readout.textContent).toContain('lastNavItem=analytics'));
    });
  });

  describe('item with children (inline expansion)', () => {
    it('starts collapsed with no data-open marker', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      const projectsButton = findButtonByLabel(host, 'Projects') as HTMLButtonElement;
      const navGroup = projectsButton.closest('.nav-group') as HTMLElement;

      expect(navGroup.getAttribute('data-open')).toBeNull();
    });

    it('toggles expansion on each header click', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      const projectsButton = findButtonByLabel(host, 'Projects') as HTMLButtonElement;
      const navGroup = projectsButton.closest('.nav-group') as HTMLElement;

      await userEvent.click(projectsButton);
      await waitFor(() => expect(navGroup.getAttribute('data-open')).toBe(''));

      await userEvent.click(projectsButton);
      await waitFor(() => expect(navGroup.getAttribute('data-open')).toBeNull());
    });

    it('exposes the sub-list to assistive tech only when expanded', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      const projectsButton = findButtonByLabel(host, 'Projects') as HTMLButtonElement;
      const subListWrapper = projectsButton
        .closest('.nav-group')
        ?.querySelector('.nav-sub-list-wrapper') as HTMLElement;

      expect(subListWrapper.getAttribute('aria-hidden')).toBe('true');
      expect(subListWrapper.getAttribute('inert')).toBe('');

      await userEvent.click(projectsButton);

      await waitFor(() => expect(subListWrapper.getAttribute('aria-hidden')).toBeNull());
      expect(subListWrapper.getAttribute('inert')).toBeNull();
    });

    it('emits subNavigationItemClicked when an expanded sub-item is clicked', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);

      const projectsButton = findButtonByLabel(host, 'Projects') as HTMLButtonElement;
      await userEvent.click(projectsButton);

      await waitFor(() => expect(findAnchorByLabel(host, 'Active')).not.toBeNull());

      const activeAnchor = findAnchorByLabel(host, 'Active') as HTMLAnchorElement;
      await userEvent.click(activeAnchor);

      await waitFor(() => expect(readout.textContent).toContain('lastSubNavItem=projects-active'));
    });
  });

  describe('section groups', () => {
    let logManagerSilence: SilencedLogManager;

    beforeEach(() => {
      logManagerSilence = vitestBrowserUtils.silenceLogManager();
    });

    afterEach(() => {
      logManagerSilence.restore();
    });

    it('renders the provided group header text', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      const alphaHeader = findGroupHeaderButton(host, 'Group Alpha') as HTMLButtonElement;

      expect(alphaHeader.textContent?.trim()).toBe('Group Alpha');
    });

    it('reflects the expanded state via aria-expanded on the header', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      const alphaHeader = findGroupHeaderButton(host, 'Group Alpha') as HTMLButtonElement;

      await waitFor(() => expect(alphaHeader.getAttribute('aria-expanded')).toBe('true'));

      await userEvent.click(alphaHeader);

      await waitFor(() => expect(alphaHeader.getAttribute('aria-expanded')).toBe('false'));
    });

    it('defaults to expanded when defaultExpanded is omitted', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await waitFor(() => expect(findGroupSection(host, 'Group Alpha')?.getAttribute('data-open')).toBe(''));
    });

    it('honors defaultExpanded false', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      expect(findGroupSection(host, 'Group Beta')?.getAttribute('data-open')).toBeNull();
    });

    it('toggles the section open and closed on header click', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      const alphaHeader = findGroupHeaderButton(host, 'Group Alpha') as HTMLButtonElement;
      const alphaSection = alphaHeader.closest('.nav-group-section') as HTMLElement;

      await waitFor(() => expect(alphaSection.getAttribute('data-open')).toBe(''));

      await userEvent.click(alphaHeader);
      await waitFor(() => expect(alphaSection.getAttribute('data-open')).toBeNull());

      await userEvent.click(alphaHeader);
      await waitFor(() => expect(alphaSection.getAttribute('data-open')).toBe(''));
    });

    it('hides the collapsed group list from assistive tech via aria-hidden and inert', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      const betaHeader = findGroupHeaderButton(host, 'Group Beta') as HTMLButtonElement;
      const wrapper = betaHeader.closest('.nav-group-section')?.querySelector('.nav-group-list-wrapper') as HTMLElement;

      expect(wrapper.getAttribute('aria-hidden')).toBe('true');
      expect(wrapper.getAttribute('inert')).toBe('');

      await userEvent.click(betaHeader);

      await waitFor(() => expect(wrapper.getAttribute('aria-hidden')).toBeNull());
      expect(wrapper.getAttribute('inert')).toBeNull();
    });

    it('does not render a group whose items are empty', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      fixture.componentInstance.addEmptyGroup();
      await flush(fixture);

      const headerTexts = Array.from(host.querySelectorAll('.nav-group-header')).map(
        (header) => header.textContent?.trim() ?? ''
      );

      expect(headerTexts).not.toContain('Group Empty');
    });

    it('preserves a user-toggled group state across an input array reference update', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      const alphaHeader = findGroupHeaderButton(host, 'Group Alpha') as HTMLButtonElement;
      const alphaSection = alphaHeader.closest('.nav-group-section') as HTMLElement;

      await waitFor(() => expect(alphaSection.getAttribute('data-open')).toBe(''));

      await userEvent.click(alphaHeader);
      await waitFor(() => expect(alphaSection.getAttribute('data-open')).toBeNull());

      fixture.componentInstance.replaceGroupsWithSameShape();
      await flush(fixture);

      expect(findGroupSection(host, 'Group Alpha')?.getAttribute('data-open')).toBeNull();
    });
  });

  describe('collapsed state', () => {
    it('hides group headers when collapsed', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);
      expect(findGroupHeaderButton(host, 'Group Alpha')).not.toBeNull();

      fixture.componentInstance.collapsed.set(true);

      await waitFor(() => expect(host.querySelectorAll('.nav-group-header').length).toBe(0));
    });

    it('renders grouped items flat when collapsed', async () => {
      const fixture = createApplicationNavigation({ collapsed: true });
      const host = queryByTestId(fixture, 'nav');

      await waitFor(() => expect(findAnchorByLabel(host, 'Analytics')).not.toBeNull());
      expect(findAnchorByLabel(host, 'Team')).not.toBeNull();
    });
  });

  describe('collapse handle', () => {
    it('toggles the collapsed state when activated', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);
      expect(readout.textContent).toContain('collapsed=false');

      const collapseHandle = host.querySelector('button.collapse-handle') as HTMLButtonElement;
      await userEvent.click(collapseHandle);

      await waitFor(() => expect(readout.textContent).toContain('collapsed=true'));
    });

    it('reflects the collapsed state via aria-pressed', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      const handle = host.querySelector('button.collapse-handle') as HTMLButtonElement;

      expect(handle.getAttribute('aria-pressed')).toBe('false');

      fixture.componentInstance.collapsed.set(true);

      await waitFor(() => expect(handle.getAttribute('aria-pressed')).toBe('true'));
    });

    it('reflects the collapsed state via aria-label', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      const handle = host.querySelector('button.collapse-handle') as HTMLButtonElement;

      expect(handle.getAttribute('aria-label')).toBe('Collapse navigation');

      fixture.componentInstance.collapsed.set(true);

      await waitFor(() => expect(handle.getAttribute('aria-label')).toBe('Expand navigation'));
    });
  });

  describe('organization switcher', () => {
    it('exposes the organization name on the interactive trigger when selectable orgs exist', async () => {
      const fixture = createApplicationNavigation({ availableOrganizations: TEST_AVAILABLE_ORGANIZATIONS_MULTI });
      const host = queryByTestId(fixture, 'nav');

      await waitFor(() => expect(findOrganizationTriggerButton(host)).not.toBeNull());

      const organizationButton = findOrganizationTriggerButton(host) as HTMLButtonElement;

      expect(organizationButton.textContent).toContain(TEST_CURRENT_ORGANIZATION.name);
    });

    it('renders a non-interactive row when there are no selectable orgs', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      expect(host.querySelector('.organization-section')).not.toBeNull();
      expect(findOrganizationTriggerButton(host)).toBeNull();
      expect(host.querySelector('.organization-chevron')).toBeNull();
    });

    it('opens the switcher overlay menu when the trigger is clicked', async () => {
      const fixture = createApplicationNavigation({ availableOrganizations: TEST_AVAILABLE_ORGANIZATIONS_MULTI });
      const host = queryByTestId(fixture, 'nav');

      await waitFor(() => expect(findOrganizationTriggerButton(host)).not.toBeNull());
      expect(queryOverlayMenu()).toBeNull();

      const organizationButton = findOrganizationTriggerButton(host) as HTMLButtonElement;
      await userEvent.click(organizationButton);

      await waitFor(() => expect(queryOverlayMenu()).not.toBeNull());
    });

    it('omits the current organization from the switcher overlay menu', async () => {
      const fixture = createApplicationNavigation({ availableOrganizations: TEST_AVAILABLE_ORGANIZATIONS_MULTI });
      const host = queryByTestId(fixture, 'nav');

      await waitFor(() => expect(findOrganizationTriggerButton(host)).not.toBeNull());

      const organizationButton = findOrganizationTriggerButton(host) as HTMLButtonElement;
      await userEvent.click(organizationButton);

      const overlay = await waitForOverlayMenu();
      const menuText = overlay.textContent ?? '';

      expect(menuText).not.toContain(TEST_CURRENT_ORGANIZATION.name);
      expect(menuText).toContain('Other Org A');
      expect(menuText).toContain('Other Org B');
    });

    it('emits availableOrganizationSelected when an organization is chosen', async () => {
      const fixture = createApplicationNavigation({ availableOrganizations: TEST_AVAILABLE_ORGANIZATIONS_MULTI });
      const host = queryByTestId(fixture, 'nav');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(findOrganizationTriggerButton(host)).not.toBeNull());

      const organizationButton = findOrganizationTriggerButton(host) as HTMLButtonElement;
      await userEvent.click(organizationButton);

      const overlay = await waitForOverlayMenu();
      const otherOrgRow = findOverlayMenuItem(overlay, 'Other Org A') as HTMLButtonElement;
      await userEvent.click(otherOrgRow);

      await waitFor(() => expect(readout.textContent).toContain('lastSelectedOrg=other-a'));
    });

    it('renders the organization image url in the overlay menu when provided', async () => {
      const fixture = createApplicationNavigation({ availableOrganizations: TEST_AVAILABLE_ORGANIZATIONS_MULTI });
      const host = queryByTestId(fixture, 'nav');

      await waitFor(() => expect(findOrganizationTriggerButton(host)).not.toBeNull());

      const organizationButton = findOrganizationTriggerButton(host) as HTMLButtonElement;
      await userEvent.click(organizationButton);

      const overlay = await waitForOverlayMenu();

      await waitFor(() => {
        const imageElement = overlay.querySelector('org-list-item-image img');

        expect(imageElement).not.toBeNull();
        expect(imageElement?.getAttribute('src')).toContain('other-a.png');
      });
    });
  });

  describe('settings menu', () => {
    it('opens the settings overlay menu when the trigger is clicked', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      const settingsButton = findSettingsTriggerButton(host) as HTMLButtonElement;

      expect(settingsButton).not.toBeNull();
      expect(queryOverlayMenu()).toBeNull();

      await userEvent.click(settingsButton);

      await waitFor(() => expect(queryOverlayMenu()).not.toBeNull());
    });

    it('emits settingsMenuItemClicked when a settings item is clicked', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');
      const readout = queryByTestId(fixture, 'readout');

      await flush(fixture);

      const settingsButton = findSettingsTriggerButton(host) as HTMLButtonElement;
      await userEvent.click(settingsButton);

      const overlay = await waitForOverlayMenu();
      const accountItem = findOverlayMenuItem(overlay, 'Account') as HTMLButtonElement;
      await userEvent.click(accountItem);

      await waitFor(() => expect(readout.textContent).toContain('lastSettingsItem=account'));
    });
  });

  describe('appearance / theme', () => {
    it('hides the appearance section when no theme is set', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      const settingsButton = findSettingsTriggerButton(host) as HTMLButtonElement;
      await userEvent.click(settingsButton);

      const overlay = await waitForOverlayMenu();

      expect(overlay.querySelector('org-button-toggle')).toBeNull();
    });

    it('shows the appearance section when a theme is set', async () => {
      const fixture = createApplicationNavigation({ theme: 'dark' });
      const host = queryByTestId(fixture, 'nav');

      await flush(fixture);

      const settingsButton = findSettingsTriggerButton(host) as HTMLButtonElement;
      await userEvent.click(settingsButton);

      const overlay = await waitForOverlayMenu();

      await waitFor(() => expect(overlay.querySelector('org-button-toggle')).not.toBeNull());
    });

    it('emits themeChange when the appearance toggle is changed', async () => {
      const fixture = createApplicationNavigation({ theme: 'dark' });
      const host = queryByTestId(fixture, 'nav');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(readout.textContent).toContain('theme=dark'));

      const settingsButton = findSettingsTriggerButton(host) as HTMLButtonElement;
      await userEvent.click(settingsButton);

      const overlay = await waitForOverlayMenu();

      const lightButton = (Array.from(overlay.querySelectorAll('button')) as HTMLButtonElement[]).find(
        (button) => button.textContent?.trim() === 'Light'
      ) as HTMLButtonElement;
      await userEvent.click(lightButton);

      await waitFor(() => expect(readout.textContent).toContain('theme=light'));
    });
  });

  describe('user section', () => {
    it('renders the user section when a user name is provided', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await waitFor(() => expect(host.textContent).toContain('Test User'));
      expect(host.querySelector('.user-section')).not.toBeNull();
    });

    it('hides the user section when the user name is empty', async () => {
      const fixture = createApplicationNavigation();
      const host = queryByTestId(fixture, 'nav');

      await waitFor(() => expect(host.querySelector('.user-section')).not.toBeNull());

      fixture.componentInstance.userName.set('');

      await waitFor(() => expect(host.querySelector('.user-section')).toBeNull());
    });
  });
});
