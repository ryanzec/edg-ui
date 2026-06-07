import type { Meta, StoryObj } from '@storybook/angular';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  ApplicationNavigation,
  type NavigationGroup,
  type NavigationItem,
  type OrganizationDisplay,
  type SettingsMenuItem,
  type Theme,
} from './application-navigation';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';

const meta: Meta<ApplicationNavigation> = {
  title: 'Layout/Components/Application Navigation',
  component: ApplicationNavigation,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Application Navigation Component

  A vertical navigation sidebar component with an organization header, top-level and nested navigation items,
  indicator badges, a right-edge collapse handle, a settings overlay menu (appearance toggle + items), and a user
  profile row.

  ### Features
  - Organization header showing the current organization's icon (when provided) and name; opens a switcher overlay menu
    listing the other available organizations
  - Plain navigation items with optional numeric indicators
  - Single-level expandable groups; nested sub-items render inline when expanded, or as an overlay menu when collapsed
  - Right-edge collapse handle that flips between expand/collapse chevron
  - Settings overlay menu with an optional theme toggle (Light / Dark / System) and a configurable list of items,
    including a red destructive Sign out entry
  - User profile row with avatar, name, optional email, and optional status indicator
  - Full keyboard navigation support via Angular CDK Menu and CDK Tooltip
  - Tooltips on every item when collapsed, with optional keyboard-shortcut hints rendered via &lt;org-kbd&gt;

  ### Usage Examples
  \`\`\`html
  <org-application-navigation
    [currentOrganization]="currentOrganization"
    [availableOrganizations]="availableOrganizations"
    [navigationItems]="navItems"
    [settingsMenuItems]="settingsItems"
    userName="Maya Brennan"
    userEmail="maya@acme.co"
    userStatusColor="safe"
    [theme]="theme"
    (themeChange)="theme = $event"
    (navigationItemClicked)="onNavClick($event)"
    (subNavigationItemClicked)="onSubNavClick($event)"
    (settingsMenuItemClicked)="onSettingsClick($event)"
    (availableOrganizationSelected)="onOrganizationSelected($event)"
    (logout)="onLogout()"
  />
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<ApplicationNavigation>;

const defaultCurrentOrganization: OrganizationDisplay = {
  id: 'halcyon',
  name: 'Halcyon',
  imageUrl: 'https://i.pravatar.cc/64?img=12',
};

const defaultAvailableOrganizations: OrganizationDisplay[] = [
  defaultCurrentOrganization,
  { id: 'northwind', name: 'Northwind Traders', imageUrl: 'https://i.pravatar.cc/64?img=22' },
  { id: 'acme', name: 'Acme Co.', imageUrl: 'https://i.pravatar.cc/64?img=32' },
  { id: 'initech', name: 'Initech' },
];

const onlyCurrentAvailableOrganizations: OrganizationDisplay[] = [defaultCurrentOrganization];

const defaultNavigationItems: NavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: 'house', routePath: '/overview', shortcut: 'G O' },
  { id: 'inbox', label: 'Inbox', icon: 'inbox', routePath: '/inbox', indicator: 3, shortcut: 'G I' },
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
  { id: 'team', label: 'Team', icon: 'users', routePath: '/team' },
  { id: 'docs', label: 'Docs', icon: 'file-text', routePath: '/docs' },
  { id: 'billing', label: 'Billing', icon: 'credit-card', routePath: '/billing' },
];

const referenceUngroupedItems: NavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: 'house', routePath: '/overview' },
  { id: 'inbox', label: 'Inbox', icon: 'inbox', routePath: '/inbox', indicator: 3 },
];

const referenceGroupedNavigationItems: NavigationGroup[] = [
  {
    id: 'workspace',
    header: 'Workspace',
    items: [
      {
        id: 'projects',
        label: 'Projects',
        icon: 'folder',
        children: [
          { id: 'projects-all', label: 'All projects', routePath: '/projects' },
          { id: 'projects-active', label: 'Active', routePath: '/projects/active' },
        ],
      },
      { id: 'analytics', label: 'Analytics', icon: 'grid-2x2', routePath: '/analytics' },
      { id: 'team', label: 'Team', icon: 'users', routePath: '/team' },
      { id: 'kanban', label: 'Kanban', icon: 'rows-3', routePath: '/kanban' },
    ],
  },
  {
    id: 'customer-pipeline',
    header: 'Customer Pipeline',
    defaultExpanded: false,
    items: [
      { id: 'pipeline-leads', label: 'Leads', icon: 'users', routePath: '/pipeline/leads' },
      { id: 'pipeline-deals', label: 'Deals', icon: 'briefcase', routePath: '/pipeline/deals' },
    ],
  },
  {
    id: 'reports',
    header: 'Reports',
    items: [
      { id: 'reports-daily', label: 'Daily metrics', icon: 'clock', routePath: '/reports/daily' },
      { id: 'reports-weekly', label: 'Weekly digest', icon: 'calendar', routePath: '/reports/weekly' },
      {
        id: 'reports-quarterly',
        label: 'Quarterly business review',
        icon: 'briefcase',
        routePath: '/reports/quarterly',
      },
    ],
  },
  {
    id: 'integrations',
    header: 'Integrations',
    items: [
      { id: 'integrations-github', label: 'GitHub', icon: 'code', routePath: '/integrations/github' },
      { id: 'integrations-slack', label: 'Slack', icon: 'message-square', routePath: '/integrations/slack' },
      { id: 'integrations-linear', label: 'Linear', icon: 'square', routePath: '/integrations/linear' },
      { id: 'integrations-figma', label: 'Figma', icon: 'palette', routePath: '/integrations/figma' },
    ],
  },
  {
    id: 'admin',
    header: 'Admin',
    items: [
      { id: 'admin-billing', label: 'Billing', icon: 'credit-card', routePath: '/admin/billing' },
      { id: 'admin-permissions', label: 'Permissions', icon: 'shield', routePath: '/admin/permissions' },
      { id: 'admin-audit', label: 'Audit log', icon: 'file-text', routePath: '/admin/audit' },
    ],
  },
];

const defaultSettingsItems: SettingsMenuItem[] = [
  { id: 'workspace-settings', label: 'Workspace settings', icon: 'cog', shortcut: '⌘,' },
  { id: 'account', label: 'Account', icon: 'at-sign' },
  { id: 'shortcuts', label: 'Keyboard shortcuts', icon: 'sparkles', shortcut: '?' },
  { id: 'help', label: 'Help & docs', icon: 'circle-help' },
  { id: 'signout-divider', type: 'divider' },
  { id: 'signout', label: 'Sign out', icon: 'log-out', color: 'danger' },
];

const settingsItemsWithDivider: SettingsMenuItem[] = [
  { id: 'workspace-settings', label: 'Workspace settings', icon: 'cog', shortcut: '⌘,' },
  { id: 'account', label: 'Account', icon: 'at-sign' },
  { id: 'shortcuts', label: 'Keyboard shortcuts', icon: 'sparkles', shortcut: '?' },
  { id: 'help', label: 'Help & docs', icon: 'circle-help' },
];

@Component({
  selector: 'story-application-navigation-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ApplicationNavigation],
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
      }
      .layout {
        display: flex;
        height: 100%;
      }
      .canvas {
        flex: 1;
        padding: var(--spacing-3);
        color: var(--color-fg-muted);
      }
    `,
  ],
  template: `
    <div class="layout">
      <org-application-navigation
        [currentOrganization]="currentOrganization"
        [availableOrganizations]="availableOrganizations"
        [navigationItems]="navigationItems"
        [groupedNavigationItems]="groupedNavigationItems"
        [settingsMenuItems]="settingsItems"
        [collapsed]="collapsed()"
        (collapsedChange)="collapsed.set($event)"
        [theme]="theme()"
        (themeChange)="theme.set($event)"
        userName="Maya Brennan"
        userEmail="maya@acme.co"
        userStatusColor="safe"
        (availableOrganizationSelected)="onAvailableOrganizationSelected($event)"
        (navigationItemClicked)="onNavigationItemClicked($event)"
        (subNavigationItemClicked)="onSubNavigationItemClicked($event)"
        (settingsMenuItemClicked)="onSettingsMenuItemClicked($event)"
        (logout)="onLogout()"
      />
      <div class="canvas">Page content</div>
    </div>
  `,
})
class ApplicationNavigationHostStory {
  protected readonly currentOrganization = defaultCurrentOrganization;
  protected readonly availableOrganizations = defaultAvailableOrganizations;
  protected readonly navigationItems = referenceUngroupedItems;
  protected readonly groupedNavigationItems = referenceGroupedNavigationItems;
  protected readonly settingsItems = defaultSettingsItems;
  protected readonly collapsed = signal<boolean>(false);
  protected readonly theme = signal<Theme | undefined>('dark');

  protected onAvailableOrganizationSelected(organization: OrganizationDisplay): void {
    console.log('organization selected', organization);
  }

  protected onNavigationItemClicked(item: NavigationItem): void {
    console.log('navigation clicked', item);
  }

  protected onSubNavigationItemClicked(subItem: unknown): void {
    console.log('sub navigation clicked', subItem);
  }

  protected onSettingsMenuItemClicked(item: SettingsMenuItem): void {
    console.log('settings clicked', item);
  }

  protected onLogout(): void {
    console.log('logout');
  }
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Default application navigation matching the reference design — workspace header, plain items with badges, an expandable Projects group, settings overlay menu with appearance toggle and Sign out, and a user row with status dot.',
      },
    },
  },
  render: () => ({
    template: `<story-application-navigation-host />`,
    moduleMetadata: {
      imports: [ApplicationNavigationHostStory],
    },
  }),
};

export const CollapsedState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Navigation rendered in the collapsed icon-only state. Nav items show tooltips on hover; expandable groups open as overlay menus next to the icon.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="height: 100vh; display: flex;">
        <org-application-navigation
          [currentOrganization]="currentOrganization"
          [availableOrganizations]="availableOrganizations"
          [navigationItems]="navigationItems"
          [settingsMenuItems]="settingsItems"
          userName="Maya Brennan"
          userEmail="maya@acme.co"
          userStatusColor="safe"
          theme="dark"
          [collapsed]="true"
        />
      </div>
    `,
    props: {
      currentOrganization: defaultCurrentOrganization,
      availableOrganizations: defaultAvailableOrganizations,
      navigationItems: defaultNavigationItems,
      settingsItems: defaultSettingsItems,
    },
    moduleMetadata: {
      imports: [ApplicationNavigation],
    },
  }),
};

export const CollapseExpandComparison: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Side-by-side comparison of the expanded and collapsed states. The right-edge handle toggles between the two.',
      },
    },
  },
  render: () => ({
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Collapse / Expand States" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Expanded (default)</div>
            <div style="height: 32rem; display: flex;">
              <org-application-navigation
                [currentOrganization]="currentOrganization"
                [availableOrganizations]="availableOrganizations"
                [navigationItems]="navigationItems"
                [settingsMenuItems]="settingsItems"
                userName="Maya Brennan"
                userEmail="maya@acme.co"
                userStatusColor="safe"
                theme="dark"
              />
            </div>
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Collapsed</div>
            <div style="height: 32rem; display: flex;">
              <org-application-navigation
                [currentOrganization]="currentOrganization"
                [availableOrganizations]="availableOrganizations"
                [navigationItems]="navigationItems"
                [settingsMenuItems]="settingsItems"
                userName="Maya Brennan"
                userEmail="maya@acme.co"
                userStatusColor="safe"
                theme="dark"
                [collapsed]="true"
              />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Width transitions smoothly between expanded and collapsed states via the right-edge handle</li>
          <li>Organization header collapses to just the icon when in collapsed state</li>
          <li>Plain items show tooltips on hover when collapsed; expandable groups open an overlay menu instead</li>
          <li>The user avatar status dot remains visible in both states</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    props: {
      currentOrganization: defaultCurrentOrganization,
      availableOrganizations: defaultAvailableOrganizations,
      navigationItems: defaultNavigationItems,
      settingsItems: defaultSettingsItems,
    },
    moduleMetadata: {
      imports: [
        ApplicationNavigation,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

export const GroupedNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates `groupedNavigationItems`. Ungrouped items render first; each group renders below with a clickable uppercase section header and a chevron that toggles inline expansion. Groups default to expanded unless `defaultExpanded: false` is set.',
      },
    },
  },
  render: () => ({
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Grouped Navigation Items" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">All groups expanded by default</div>
            <div style="height: 40rem; display: flex;">
              <org-application-navigation
                [currentOrganization]="currentOrganization"
                [availableOrganizations]="availableOrganizations"
                [navigationItems]="ungroupedItems"
                [groupedNavigationItems]="groupedItems"
                [settingsMenuItems]="settingsItems"
                userName="Maya Brennan"
                userEmail="maya@acme.co"
                userStatusColor="safe"
                theme="dark"
              />
            </div>
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Collapsed sidebar (group headers hidden, items render flat)</div>
            <div style="height: 40rem; display: flex;">
              <org-application-navigation
                [currentOrganization]="currentOrganization"
                [availableOrganizations]="availableOrganizations"
                [navigationItems]="ungroupedItems"
                [groupedNavigationItems]="groupedItems"
                [settingsMenuItems]="settingsItems"
                userName="Maya Brennan"
                userStatusColor="safe"
                theme="dark"
                [collapsed]="true"
              />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Ungrouped items (Overview, Inbox) render before any group</li>
          <li>Each group header is clickable and toggles its items via an animated grid-row reveal</li>
          <li>Customer Pipeline starts collapsed because the group declares <code>defaultExpanded: false</code></li>
          <li>Items inside a group with nested children (e.g. Projects) keep their own expand/collapse chevron</li>
          <li>When the sidebar collapses, group headers hide and grouped items render flat alongside ungrouped icons with tooltips</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    props: {
      currentOrganization: defaultCurrentOrganization,
      availableOrganizations: defaultAvailableOrganizations,
      ungroupedItems: referenceUngroupedItems,
      groupedItems: referenceGroupedNavigationItems,
      settingsItems: defaultSettingsItems,
    },
    moduleMetadata: {
      imports: [
        ApplicationNavigation,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

export const NestedNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the expandable group with one level of nested sub-items. Clicking the group toggles inline expansion; the vertical guide rail to the left of sub-items signals hierarchy.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="height: 32rem; display: flex;">
        <org-application-navigation
          [currentOrganization]="currentOrganization"
          [availableOrganizations]="availableOrganizations"
          [navigationItems]="navigationItems"
          [settingsMenuItems]="settingsItems"
          userName="Maya Brennan"
          userEmail="maya@acme.co"
          userStatusColor="safe"
          theme="dark"
        />
      </div>
    `,
    props: {
      currentOrganization: defaultCurrentOrganization,
      availableOrganizations: defaultAvailableOrganizations,
      navigationItems: defaultNavigationItems,
      settingsItems: defaultSettingsItems,
    },
    moduleMetadata: {
      imports: [ApplicationNavigation],
    },
  }),
};

export const AppearanceToggle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When the `theme` model has a value, the settings overlay menu shows an Appearance section with a Light / Dark / System button toggle. Omitting the input hides the section entirely.',
      },
    },
  },
  render: () => ({
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Appearance Toggle" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">With theme (appearance section visible)</div>
            <div style="height: 24rem; display: flex;">
              <org-application-navigation
                [currentOrganization]="currentOrganization"
                [availableOrganizations]="availableOrganizations"
                [navigationItems]="navigationItems"
                [settingsMenuItems]="settingsItems"
                userName="Maya Brennan"
                theme="dark"
              />
            </div>
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Without theme (appearance section hidden)</div>
            <div style="height: 24rem; display: flex;">
              <org-application-navigation
                [currentOrganization]="currentOrganization"
                [availableOrganizations]="availableOrganizations"
                [navigationItems]="navigationItems"
                [settingsMenuItems]="settingsItems"
                userName="Maya Brennan"
              />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Opening Settings shows / hides the appearance section based on whether theme is supplied</li>
          <li>Picking a theme emits a model change that the parent can persist</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    props: {
      currentOrganization: defaultCurrentOrganization,
      availableOrganizations: defaultAvailableOrganizations,
      navigationItems: defaultNavigationItems,
      settingsItems: settingsItemsWithDivider,
    },
    moduleMetadata: {
      imports: [
        ApplicationNavigation,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

export const UserDisplayVariants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Variants of the bottom user row — with email + status, with just name, and with avatar image.',
      },
    },
  },
  render: () => ({
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="User Display Variants" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Name + email + status</div>
            <div style="height: 24rem; display: flex;">
              <org-application-navigation
                [currentOrganization]="currentOrganization"
                [availableOrganizations]="availableOrganizations"
                [navigationItems]="navigationItems"
                [settingsMenuItems]="settingsItems"
                userName="Maya Brennan"
                userEmail="maya@acme.co"
                userStatusColor="safe"
              />
            </div>
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Name only</div>
            <div style="height: 24rem; display: flex;">
              <org-application-navigation
                [currentOrganization]="currentOrganization"
                [availableOrganizations]="availableOrganizations"
                [navigationItems]="navigationItems"
                [settingsMenuItems]="settingsItems"
                userName="Maya Brennan"
              />
            </div>
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">With avatar image</div>
            <div style="height: 24rem; display: flex;">
              <org-application-navigation
                [currentOrganization]="currentOrganization"
                [availableOrganizations]="availableOrganizations"
                [navigationItems]="navigationItems"
                [settingsMenuItems]="settingsItems"
                userName="Maya Brennan"
                userEmail="maya@acme.co"
                userAvatarUrl="https://i.pravatar.cc/64?img=5"
                userStatusColor="safe"
              />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>The user row hides when userName is empty</li>
          <li>userEmail renders as a sub-label under the name</li>
          <li>userStatusColor pins a status dot to the bottom-right of the avatar</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    props: {
      currentOrganization: defaultCurrentOrganization,
      availableOrganizations: defaultAvailableOrganizations,
      navigationItems: defaultNavigationItems,
      settingsItems: defaultSettingsItems,
    },
    moduleMetadata: {
      imports: [
        ApplicationNavigation,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

export const EmptyStates: Story = {
  parameters: {
    docs: {
      description: {
        story: 'How the component renders when individual sections are empty.',
      },
    },
  },
  render: () => ({
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Empty States" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">No Navigation Items</div>
            <div style="height: 24rem; display: flex;">
              <org-application-navigation
                [currentOrganization]="currentOrganization"
                [availableOrganizations]="availableOrganizations"
                userName="Maya Brennan"
                [navigationItems]="[]"
                [settingsMenuItems]="settingsItems"
              />
            </div>
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">No Settings Items</div>
            <div style="height: 24rem; display: flex;">
              <org-application-navigation
                [currentOrganization]="currentOrganization"
                [availableOrganizations]="availableOrganizations"
                userName="Maya Brennan"
                [navigationItems]="navigationItems"
                [settingsMenuItems]="[]"
              />
            </div>
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">No User</div>
            <div style="height: 24rem; display: flex;">
              <org-application-navigation
                [currentOrganization]="currentOrganization"
                [availableOrganizations]="availableOrganizations"
                [navigationItems]="navigationItems"
                [settingsMenuItems]="settingsItems"
              />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Component gracefully handles empty data arrays</li>
          <li>Settings still renders the appearance toggle when theme is supplied even if no settingsMenuItems</li>
          <li>The user row is hidden entirely when userName is empty</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    props: {
      currentOrganization: defaultCurrentOrganization,
      availableOrganizations: defaultAvailableOrganizations,
      navigationItems: defaultNavigationItems,
      settingsItems: defaultSettingsItems,
    },
    moduleMetadata: {
      imports: [
        ApplicationNavigation,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

export const OrganizationSwitcher: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The organization header opens a switcher overlay menu listing every other available organization. When `availableOrganizations` contains only the current organization (or is empty), the header is rendered as a static label with no chevron and no click affordance. Each menu row renders the organization icon via `imageUrl` when provided, falling back to a name-only row otherwise.',
      },
    },
  },
  render: () => ({
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Organization Switcher" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Multiple selectable organizations (interactive header with chevron)</div>
            <div style="height: 28rem; display: flex;">
              <org-application-navigation
                [currentOrganization]="currentOrganization"
                [availableOrganizations]="availableOrganizations"
                [navigationItems]="navigationItems"
                [settingsMenuItems]="settingsItems"
                userName="Maya Brennan"
                theme="dark"
              />
            </div>
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Only the current organization (static header, no chevron)</div>
            <div style="height: 28rem; display: flex;">
              <org-application-navigation
                [currentOrganization]="currentOrganization"
                [availableOrganizations]="onlyCurrentOrganizations"
                [navigationItems]="navigationItems"
                [settingsMenuItems]="settingsItems"
                userName="Maya Brennan"
                theme="dark"
              />
            </div>
          </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Current organization without an imageUrl (header shows name only)</div>
            <div style="height: 28rem; display: flex;">
              <org-application-navigation
                [currentOrganization]="currentOrganizationNoIcon"
                [availableOrganizations]="availableOrganizations"
                [navigationItems]="navigationItems"
                [settingsMenuItems]="settingsItems"
                userName="Maya Brennan"
                theme="dark"
              />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>The header is a button (with a right-side chevron) when other organizations are available</li>
          <li>Clicking the header opens an overlay menu listing every organization except the current one</li>
          <li>Menu rows render the organization icon when <code>imageUrl</code> is set; otherwise the row shows just the name</li>
          <li>The header degrades to a non-interactive label when no other organizations are available</li>
          <li>When <code>currentOrganization.imageUrl</code> is empty, the header shows only the name</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    props: {
      currentOrganization: defaultCurrentOrganization,
      currentOrganizationNoIcon: { id: 'plain', name: 'Plain Org' } satisfies OrganizationDisplay,
      availableOrganizations: defaultAvailableOrganizations,
      onlyCurrentOrganizations: onlyCurrentAvailableOrganizations,
      navigationItems: defaultNavigationItems,
      settingsItems: defaultSettingsItems,
    },
    moduleMetadata: {
      imports: [
        ApplicationNavigation,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};
