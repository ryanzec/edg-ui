import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  ApplicationNavigation,
  type NavigationGroup,
  type NavigationItem,
  type NavigationSubItem,
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

@Component({
  selector: 'story-application-navigation-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ApplicationNavigation],
  host: { class: 'block' },
  template: `
    <div data-testid="layout" style="height: 40rem; display: flex;">
      <org-application-navigation
        data-testid="nav"
        workspaceIconLabel="H"
        [workspaceName]="workspaceName()"
        [navigationItems]="navigationItems()"
        [groupedNavigationItems]="groupedNavigationItems()"
        [settingsMenuItems]="settingsItems()"
        [collapsed]="collapsed()"
        (collapsedChange)="collapsed.set($event)"
        [theme]="theme()"
        (themeChange)="theme.set($event)"
        [userName]="userName()"
        [userEmail]="userEmail()"
        (workspaceClicked)="onWorkspaceClicked()"
        (navigationItemClicked)="onNavigationItemClicked($event)"
        (subNavigationItemClicked)="onSubNavigationItemClicked($event)"
        (settingsMenuItemClicked)="onSettingsMenuItemClicked($event)"
      />
    </div>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-collapsed-on" (click)="collapsed.set(true)">collapsed-on</button>
      <button type="button" data-testid="ctl-collapsed-off" (click)="collapsed.set(false)">collapsed-off</button>
      <button type="button" data-testid="ctl-theme-set" (click)="theme.set('dark')">theme-set</button>
      <button type="button" data-testid="ctl-theme-clear" (click)="theme.set(undefined)">theme-clear</button>
      <button type="button" data-testid="ctl-user-name-clear" (click)="userName.set('')">user-name-clear</button>
      <button type="button" data-testid="ctl-add-empty-group" (click)="addEmptyGroup()">add-empty-group</button>
      <button type="button" data-testid="ctl-replace-groups" (click)="replaceGroupsWithSameShape()">
        replace-groups
      </button>
      <button type="button" data-testid="ctl-set-only-ungrouped" (click)="groupedNavigationItems.set([])">
        set-only-ungrouped
      </button>
    </div>
  `,
})
class StoryApplicationNavigationTestsShell {
  protected readonly workspaceName = signal<string>('Test Workspace');
  protected readonly navigationItems = signal<NavigationItem[]>(TEST_UNGROUPED_ITEMS);
  protected readonly groupedNavigationItems = signal<NavigationGroup[]>(TEST_GROUPED_ITEMS);
  protected readonly settingsItems = signal<SettingsMenuItem[]>(TEST_SETTINGS_ITEMS);
  protected readonly collapsed = signal<boolean>(false);
  protected readonly theme = signal<Theme | undefined>(undefined);
  protected readonly userName = signal<string>('Test User');
  protected readonly userEmail = signal<string | undefined>('test@example.com');

  protected readonly workspaceClickCount = signal<number>(0);
  protected readonly lastNavigationItemId = signal<string>('');
  protected readonly lastSubNavigationItemId = signal<string>('');
  protected readonly lastSettingsItemId = signal<string>('');

  protected readout(): string {
    return [
      `workspaceClicks=${this.workspaceClickCount()}`,
      `lastNavItem=${this.lastNavigationItemId()}`,
      `lastSubNavItem=${this.lastSubNavigationItemId()}`,
      `lastSettingsItem=${this.lastSettingsItemId()}`,
      `collapsed=${this.collapsed()}`,
      `theme=${this.theme() ?? 'undefined'}`,
    ].join(' ');
  }

  protected onWorkspaceClicked(): void {
    this.workspaceClickCount.update((value) => value + 1);
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

  protected addEmptyGroup(): void {
    this.groupedNavigationItems.update((groups) => [
      ...groups,
      { id: 'group-empty', header: 'Group Empty', items: [] },
    ]);
  }

  protected replaceGroupsWithSameShape(): void {
    this.groupedNavigationItems.set([...TEST_GROUPED_ITEMS.map((group) => ({ ...group, items: [...group.items] }))]);
  }
}

const meta: Meta = {
  title: 'Layout/Components/Application Navigation/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-application-navigation-tests-shell />`,
  moduleMetadata: { imports: [StoryApplicationNavigationTestsShell] },
});

/** queries the open cdk overlay panel hosting an org-overlay-menu; overlays render into document.body */
const queryOverlayMenuInDocument = (): HTMLElement | null => document.body.querySelector('org-overlay-menu');

/**
 * resolves the inner native button that triggers the settings overlay menu.
 * the host `<org-list-item>` and inner `<button>` both expose role="button" (cdk-menu-trigger adds it
 * to the host), so a role-based finder picks both — querying the inner button directly avoids that.
 */
const findSettingsTriggerButton = (canvasElement: HTMLElement): HTMLButtonElement | null =>
  canvasElement.querySelector('.settings-section .list-item-content') as HTMLButtonElement | null;

/** finds a `.nav-group-section` element by its header text, scoped to the canvas */
const findGroupSection = (canvasElement: HTMLElement, headerText: string): HTMLElement | null => {
  const headers = canvasElement.querySelectorAll('.nav-group-header');

  for (const header of Array.from(headers)) {
    if (header.textContent?.trim() === headerText) {
      return header.closest('.nav-group-section') as HTMLElement | null;
    }
  }

  return null;
};

export const RendersUngroupedItemsBeforeGroups: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navList = await canvas.findByLabelText('Main navigation');
    const navigationItems = navList.querySelectorAll('org-application-navigation-item');

    await expect(navigationItems.length).toBeGreaterThanOrEqual(2);

    const firstItemText = navigationItems[0]?.textContent ?? '';
    const secondItemText = navigationItems[1]?.textContent ?? '';

    await expect(firstItemText).toContain('Overview');
    await expect(secondItemText).toContain('Inbox');
  },
};

export const NavLandmarkHasAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = await canvas.findByRole('navigation');

    await expect(nav.getAttribute('aria-label')).toBe('Main navigation');
  },
};

export const ClickingPlainItemEmitsNavigationItemClicked: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overviewLink = await canvas.findByRole('link', { name: 'Overview' });

    await userEvent.click(overviewLink);

    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('lastNavItem=overview');
  },
};

export const RendersIndicatorWhenItemHasIndicator: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inboxLink = await canvas.findByRole('link', { name: /Inbox/ });
    const indicator = inboxLink.querySelector('org-indicator');

    await expect(indicator).not.toBeNull();
    await expect(indicator?.textContent).toContain('3');
  },
};

export const ItemWithChildrenStartsCollapsed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const projectsButton = await canvas.findByRole('button', { name: 'Projects' });
    const navGroup = projectsButton.closest('.nav-group') as HTMLElement;

    await expect(navGroup.getAttribute('data-open')).toBeNull();
  },
};

export const ClickingItemWithChildrenTogglesExpansion: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const projectsButton = await canvas.findByRole('button', { name: 'Projects' });
    const navGroup = projectsButton.closest('.nav-group') as HTMLElement;

    await userEvent.click(projectsButton);
    await waitFor(() => expect(navGroup.getAttribute('data-open')).toBe(''));

    await userEvent.click(projectsButton);
    await waitFor(() => expect(navGroup.getAttribute('data-open')).toBeNull());
  },
};

export const ExpandedItemWithChildrenIsAriaExposed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const projectsButton = await canvas.findByRole('button', { name: 'Projects' });
    const subListWrapper = projectsButton.closest('.nav-group')?.querySelector('.nav-sub-list-wrapper') as HTMLElement;

    await expect(subListWrapper.getAttribute('aria-hidden')).toBe('true');
    await expect(subListWrapper.getAttribute('inert')).toBe('');

    await userEvent.click(projectsButton);

    await waitFor(() => expect(subListWrapper.getAttribute('aria-hidden')).toBeNull());
    await expect(subListWrapper.getAttribute('inert')).toBeNull();
  },
};

export const ClickingSubItemEmitsSubNavigationItemClicked: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const projectsButton = await canvas.findByRole('button', { name: 'Projects' });

    await userEvent.click(projectsButton);

    const activeLink = await canvas.findByRole('link', { name: 'Active' });

    await userEvent.click(activeLink);

    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('lastSubNavItem=projects-active');
  },
};

export const GroupHeaderRendersProvidedHeaderText: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alphaHeader = await canvas.findByRole('button', { name: 'Group Alpha' });

    await expect(alphaHeader.textContent?.trim()).toBe('Group Alpha');
  },
};

export const GroupHeaderHasAriaExpanded: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alphaHeader = await canvas.findByRole('button', { name: 'Group Alpha' });

    await waitFor(() => expect(alphaHeader.getAttribute('aria-expanded')).toBe('true'));

    await userEvent.click(alphaHeader);

    await waitFor(() => expect(alphaHeader.getAttribute('aria-expanded')).toBe('false'));
  },
};

export const GroupDefaultsToExpandedWhenDefaultExpandedOmitted: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const alphaSection = await waitFor(() => {
      const section = findGroupSection(canvasElement, 'Group Alpha');

      if (!section) {
        throw new Error('Group Alpha section not found');
      }

      return section;
    });

    await waitFor(() => expect(alphaSection.getAttribute('data-open')).toBe(''));
  },
};

export const GroupHonorsDefaultExpandedFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const betaSection = await waitFor(() => {
      const section = findGroupSection(canvasElement, 'Group Beta');

      if (!section) {
        throw new Error('Group Beta section not found');
      }

      return section;
    });

    await expect(betaSection.getAttribute('data-open')).toBeNull();
  },
};

export const ClickingGroupHeaderTogglesExpansion: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alphaHeader = await canvas.findByRole('button', { name: 'Group Alpha' });
    const alphaSection = alphaHeader.closest('.nav-group-section') as HTMLElement;

    await waitFor(() => expect(alphaSection.getAttribute('data-open')).toBe(''));

    await userEvent.click(alphaHeader);

    await waitFor(() => expect(alphaSection.getAttribute('data-open')).toBeNull());

    await userEvent.click(alphaHeader);

    await waitFor(() => expect(alphaSection.getAttribute('data-open')).toBe(''));
  },
};

export const GroupListHasAriaHiddenAndInertWhenCollapsed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const betaHeader = await canvas.findByRole('button', { name: 'Group Beta' });
    const wrapper = betaHeader.closest('.nav-group-section')?.querySelector('.nav-group-list-wrapper') as HTMLElement;

    await expect(wrapper.getAttribute('aria-hidden')).toBe('true');
    await expect(wrapper.getAttribute('inert')).toBe('');

    await userEvent.click(betaHeader);

    await waitFor(() => expect(wrapper.getAttribute('aria-hidden')).toBeNull());
    await expect(wrapper.getAttribute('inert')).toBeNull();
  },
};

export const EmptyGroupIsNotRendered: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-add-empty-group'));

    const allHeaders = canvasElement.querySelectorAll('.nav-group-header');
    const headerTexts = Array.from(allHeaders).map((header) => header.textContent?.trim() ?? '');

    await expect(headerTexts).not.toContain('Group Empty');
  },
};

export const ClickingItemInsideGroupEmitsNavigationItemClicked: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const analyticsLink = await canvas.findByRole('link', { name: 'Analytics' });

    await userEvent.click(analyticsLink);

    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('lastNavItem=analytics');
  },
};

export const GroupsRenderAfterUngroupedItems: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = await canvas.findByRole('navigation');
    const renderables = Array.from(nav.querySelectorAll('org-application-navigation-item, .nav-group-section'));

    const firstItemIndex = renderables.findIndex(
      (element) => element.tagName.toLowerCase() === 'org-application-navigation-item'
    );
    const firstGroupIndex = renderables.findIndex((element) => element.classList.contains('nav-group-section'));

    await expect(firstItemIndex).toBeGreaterThanOrEqual(0);
    await expect(firstGroupIndex).toBeGreaterThan(firstItemIndex);
  },
};

export const UserToggledGroupStateSurvivesInputArrayReferenceUpdate: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alphaHeader = await canvas.findByRole('button', { name: 'Group Alpha' });
    const alphaSection = alphaHeader.closest('.nav-group-section') as HTMLElement;

    await waitFor(() => expect(alphaSection.getAttribute('data-open')).toBe(''));

    await userEvent.click(alphaHeader);

    await waitFor(() => expect(alphaSection.getAttribute('data-open')).toBeNull());

    await userEvent.click(canvas.getByTestId('ctl-replace-groups'));

    const refreshedHeader = await canvas.findByRole('button', { name: 'Group Alpha' });
    const refreshedSection = refreshedHeader.closest('.nav-group-section') as HTMLElement;

    await expect(refreshedSection.getAttribute('data-open')).toBeNull();
  },
};

export const CollapsedSidebarHidesGroupHeaders: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByRole('button', { name: 'Group Alpha' });

    await userEvent.click(canvas.getByTestId('ctl-collapsed-on'));

    await waitFor(() => expect(canvasElement.querySelectorAll('.nav-group-header').length).toBe(0));
  },
};

export const CollapsedSidebarRendersGroupItemsFlat: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-collapsed-on'));

    await waitFor(async () => {
      const analyticsLink = await canvas.findByRole('link', { name: 'Analytics' });

      await expect(analyticsLink).toBeTruthy();
    });

    const teamLink = await canvas.findByRole('link', { name: 'Team' });

    await expect(teamLink).toBeTruthy();
  },
};

export const CollapseHandleTogglesCollapsedState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const collapseHandle = await canvas.findByRole('button', { name: 'Collapse navigation' });
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('collapsed=false');

    await userEvent.click(collapseHandle);

    await waitFor(() => expect(readout.textContent).toContain('collapsed=true'));
  },
};

export const CollapseHandleAriaPressedReflectsState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const expandedHandle = await canvas.findByRole('button', { name: 'Collapse navigation' });

    await expect(expandedHandle.getAttribute('aria-pressed')).toBe('false');

    await userEvent.click(canvas.getByTestId('ctl-collapsed-on'));

    const collapsedHandle = await canvas.findByRole('button', { name: 'Expand navigation' });

    await expect(collapsedHandle.getAttribute('aria-pressed')).toBe('true');
  },
};

export const CollapseHandleAriaLabelReflectsState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByRole('button', { name: 'Collapse navigation' });

    await userEvent.click(canvas.getByTestId('ctl-collapsed-on'));

    await canvas.findByRole('button', { name: 'Expand navigation' });
  },
};

export const WorkspaceHeaderClickEmitsWorkspaceClicked: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const workspaceButton = await canvas.findByRole('button', { name: 'Test Workspace' });
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(workspaceButton);

    await waitFor(() => expect(readout.textContent).toContain('workspaceClicks=1'));

    await userEvent.click(workspaceButton);

    await waitFor(() => expect(readout.textContent).toContain('workspaceClicks=2'));
  },
};

export const WorkspaceHeaderHasAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const workspaceButton = await canvas.findByRole('button', { name: 'Test Workspace' });

    await expect(workspaceButton.getAttribute('aria-label')).toBe('Test Workspace');
  },
};

export const SettingsMenuOpensOnTrigger: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    await within(canvasElement).findByRole('navigation');

    const settingsButton = findSettingsTriggerButton(canvasElement);

    await expect(settingsButton).not.toBeNull();
    await expect(queryOverlayMenuInDocument()).toBeNull();

    await userEvent.click(settingsButton!);

    await waitFor(() => expect(queryOverlayMenuInDocument()).not.toBeNull());
  },
};

export const SettingsAppearanceSectionHiddenWhenThemeUndefined: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    await within(canvasElement).findByRole('navigation');

    const settingsButton = findSettingsTriggerButton(canvasElement);

    await userEvent.click(settingsButton!);

    const overlay = await waitFor(() => {
      const menu = queryOverlayMenuInDocument();

      if (!menu) {
        throw new Error('overlay menu not open');
      }

      return menu;
    });

    await expect(overlay.querySelector('org-button-toggle')).toBeNull();
  },
};

export const SettingsAppearanceSectionShownWhenThemeSet: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-theme-set'));

    const settingsButton = findSettingsTriggerButton(canvasElement);

    await userEvent.click(settingsButton!);

    const overlay = await waitFor(() => {
      const menu = queryOverlayMenuInDocument();

      if (!menu) {
        throw new Error('overlay menu not open');
      }

      return menu;
    });

    await waitFor(() => expect(overlay.querySelector('org-button-toggle')).not.toBeNull());
  },
};

export const ClickingSettingsItemEmitsSettingsMenuItemClicked: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByRole('navigation');

    const settingsButton = findSettingsTriggerButton(canvasElement);

    await userEvent.click(settingsButton!);

    const overlay = await waitFor(() => {
      const menu = queryOverlayMenuInDocument();

      if (!menu) {
        throw new Error('overlay menu not open');
      }

      return menu;
    });

    const accountItem = await within(overlay).findByText('Account');

    await userEvent.click(accountItem);

    const readout = await canvas.findByTestId('readout');

    await waitFor(() => expect(readout.textContent).toContain('lastSettingsItem=account'));
  },
};

export const ChangingAppearanceToggleEmitsThemeChange: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-theme-set'));

    const readout = await canvas.findByTestId('readout');

    await waitFor(() => expect(readout.textContent).toContain('theme=dark'));

    const settingsButton = findSettingsTriggerButton(canvasElement);

    await userEvent.click(settingsButton!);

    const overlay = await waitFor(() => {
      const menu = queryOverlayMenuInDocument();

      if (!menu) {
        throw new Error('overlay menu not open');
      }

      return menu;
    });

    const lightButton = await within(overlay).findByRole('button', { name: 'Light' });

    await userEvent.click(lightButton);

    await waitFor(() => expect(readout.textContent).toContain('theme=light'));
  },
};

export const UserSectionHiddenWhenUserNameEmpty: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Test User');

    await userEvent.click(canvas.getByTestId('ctl-user-name-clear'));

    await waitFor(() => expect(canvasElement.querySelector('.user-section')).toBeNull());
  },
};

export const UserSectionRendersWhenUserNameProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Test User');

    const userSection = canvasElement.querySelector('.user-section');

    await expect(userSection).not.toBeNull();
  },
};
