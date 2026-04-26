import type { Meta, StoryObj } from '@storybook/angular';
import { ApplicationNavigation } from './application-navigation';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { IconName } from '../icon/icon';

const meta: Meta<ApplicationNavigation> = {
  title: 'Core/Components/Application Navigation',
  component: ApplicationNavigation,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Application Navigation Component

  A vertical navigation sidebar component with customizable navigation items, settings menu, user display, and logo support.

  ### Features
  - Customizable logo display
  - Navigation items with icons and labels
  - Settings dropdown menu powered by Angular CDK Menu
  - User authentication display
  - Logout functionality
  - Full keyboard navigation support (Escape to close menus, arrow keys for menu items)
  - Click-outside-to-close for settings menu
  - Accessible with proper focus management and ARIA attributes

  ### Key Capabilities
  - **Logo**: Display custom logo image at the top
  - **Navigation**: Clickable navigation items with icons and routing support
  - **Settings**: Dropdown menu powered by CDK Menu with automatic keyboard navigation and accessibility
  - **User Display**: Shows signed-in user name
  - **Logout**: Dedicated logout button at the bottom
  - **Keyboard Navigation**: Full support with Escape key and arrow keys via CDK Menu

  ### Usage Examples
  \`\`\`html
  <!-- Basic usage -->
  <org-application-navigation
    logo="path/to/logo.png"
    userName="John Doe"
    [navigationItems]="navItems"
    [settingsMenuItems]="settings"
    (navigationItemClicked)="onNavClick($event)"
    (settingsMenuItemClicked)="onSettingsClick($event)"
    (logout)="onLogout()"
  />

  <!-- Without logo -->
  <org-application-navigation
    userName="Jane Smith"
    [navigationItems]="navItems"
    (logout)="onLogout()"
  />

  <!-- Minimal configuration -->
  <org-application-navigation
    [navigationItems]="navItems"
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

const defaultNavigationItems = [
  { id: '1', label: 'Dashboard', icon: 'circle' as IconName, routePath: '/dashboard' },
  { id: '2', label: 'Projects', icon: 'circle-check-big' as IconName, routePath: '/projects' },
  { id: '3', label: 'Tasks', icon: 'square-check-big' as IconName, routePath: '/tasks' },
  { id: '4', label: 'Reports', icon: 'download' as IconName, routePath: '/reports' },
];

const defaultSettingsMenuItems = [
  { id: '1', label: 'Profile Settings', icon: 'circle' as IconName },
  { id: '2', label: 'Preferences', icon: 'cog' as IconName },
  { id: '3', label: 'Help & Support', icon: 'mail' as IconName },
];

export const Default: Story = {
  args: {
    logo: 'https://placehold.co/225x60/4F46E5/white?text=Logo',
    userName: 'John Doe',
    navigationItems: defaultNavigationItems,
    settingsMenuItems: defaultSettingsMenuItems,
    collapsed: false,
  },
  argTypes: {
    logo: {
      control: 'text',
      description: 'URL or path to the logo image',
    },
    userName: {
      control: 'text',
      description: 'Name of the currently logged in user',
    },
    navigationItems: {
      control: 'object',
      description: 'Array of navigation items for the sidebar',
    },
    settingsMenuItems: {
      control: 'object',
      description: 'Array of settings menu items',
    },
    collapsed: {
      control: 'boolean',
      description: 'Whether the navigation starts in its collapsed icon-only state',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default application navigation with all features. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      onNavigationClick: (item: any) => {
        console.log('Navigation clicked:', item);
      },
      onSettingsClick: (item: any) => {
        console.log('Settings clicked:', item);
      },
      onLogout: () => {
        console.log('Logout clicked');
      },
    },
    template: `
      <div class="h-screen">
        <org-application-navigation
          [logo]="logo"
          [userName]="userName"
          [navigationItems]="navigationItems"
          [settingsMenuItems]="settingsMenuItems"
          [collapsed]="collapsed"
          (navigationItemClicked)="onNavigationClick($event)"
          (settingsMenuItemClicked)="onSettingsClick($event)"
          (logout)="onLogout()"
        />
      </div>
    `,
    moduleMetadata: {
      imports: [ApplicationNavigation],
    },
  }),
};

export const CollapsedState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Navigation rendered in the collapsed icon-only state. Nav items, settings, logout and user avatar show tooltips on hover. Hovering the logo bar reveals the expand chevron.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="h-screen">
        <org-application-navigation
          logo="https://placehold.co/225x60/4F46E5/white?text=Logo"
          userName="John Doe"
          [navigationItems]="navigationItems"
          [settingsMenuItems]="settingsMenuItems"
          [collapsed]="true"
        />
      </div>
    `,
    props: {
      navigationItems: defaultNavigationItems,
      settingsMenuItems: defaultSettingsMenuItems,
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
          'Side-by-side comparison of the expanded and collapsed states, including the no-logo variant where the toggle chevron is always visible.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Collapse / Expand States"
        currentState="Expanded, collapsed, and no-logo collapsed variants"
      >
        <org-storybook-example-container-section label="Expanded (default)">
          <div class="h-sm">
            <org-application-navigation
              logo="https://placehold.co/225x60/4F46E5/white?text=Logo"
              userName="John Doe"
              [navigationItems]="navigationItems"
              [settingsMenuItems]="settingsMenuItems"
            />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Collapsed">
          <div class="h-sm">
            <org-application-navigation
              logo="https://placehold.co/225x60/4F46E5/white?text=Logo"
              userName="John Doe"
              [navigationItems]="navigationItems"
              [settingsMenuItems]="settingsMenuItems"
              [collapsed]="true"
            />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Collapsed Without Logo">
          <div class="h-sm">
            <org-application-navigation
              userName="John Doe"
              [navigationItems]="navigationItems"
              [settingsMenuItems]="settingsMenuItems"
              [collapsed]="true"
            />
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Width transitions smoothly between expanded and collapsed states</li>
          <li>Hovering or focusing the logo bar swaps the logo for the collapse / expand chevron</li>
          <li>When no logo is provided, the chevron is always visible in the logo bar</li>
          <li>Collapsed nav items, settings, logout and user show tooltips on hover for accessibility</li>
          <li>Labels are visually hidden but remain in the accessibility tree for screen readers</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      navigationItems: defaultNavigationItems,
      settingsMenuItems: defaultSettingsMenuItems,
    },
    moduleMetadata: {
      imports: [ApplicationNavigation, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const NavigationVariants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different navigation item configurations.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Navigation Variants"
        currentState="Different navigation item configurations"
      >
        <org-storybook-example-container-section label="Minimal Navigation">
          <div class="h-sm">
            <org-application-navigation
              [navigationItems]="minimalNav"
              [settingsMenuItems]="settingsMenuItems"
              userName="User Name"
            />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Standard Navigation">
          <div class="h-sm">
            <org-application-navigation
              [navigationItems]="standardNav"
              [settingsMenuItems]="settingsMenuItems"
              userName="User Name"
            />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Extended Navigation">
          <div class="h-sm">
            <org-application-navigation
              [navigationItems]="extendedNav"
              [settingsMenuItems]="settingsMenuItems"
              userName="User Name"
            />
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Navigation items support icons and labels</li>
          <li>Hover states provide visual feedback</li>
          <li>Focus states support keyboard navigation</li>
          <li>Items preserve href for right-click and cmd+click</li>
          <li>Navigation list scrolls when content exceeds available space</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      minimalNav: [
        { id: '1', label: 'Home', icon: 'circle' as IconName, routePath: '/home' },
        { id: '2', label: 'Settings', icon: 'cog' as IconName, routePath: '/settings' },
      ],
      standardNav: defaultNavigationItems,
      extendedNav: [
        { id: '1', label: 'Dashboard', icon: 'circle' as IconName, routePath: '/dashboard' },
        { id: '2', label: 'Projects', icon: 'circle-check-big' as IconName, routePath: '/projects' },
        { id: '3', label: 'Tasks', icon: 'square-check-big' as IconName, routePath: '/tasks' },
        { id: '4', label: 'Calendar', icon: 'mail' as IconName, routePath: '/calendar' },
        { id: '5', label: 'Reports', icon: 'download' as IconName, routePath: '/reports' },
        { id: '6', label: 'Analytics', icon: 'arrow-down-up' as IconName, routePath: '/analytics' },
        { id: '7', label: 'Team', icon: 'eye' as IconName, routePath: '/team' },
        { id: '8', label: 'Settings', icon: 'cog' as IconName, routePath: '/settings' },
      ],
      settingsMenuItems: defaultSettingsMenuItems,
    },
    moduleMetadata: {
      imports: [ApplicationNavigation, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const SettingsMenuVariants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different settings menu configurations.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Settings Menu Variants"
        currentState="Different settings menu configurations"
      >
        <org-storybook-example-container-section label="Standard Settings">
          <div class="h-sm">
            <org-application-navigation
              [navigationItems]="navigationItems"
              [settingsMenuItems]="standardSettings"
              userName="User Name"
            />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Extended Settings">
          <div class="h-sm">
            <org-application-navigation
              [navigationItems]="navigationItems"
              [settingsMenuItems]="extendedSettings"
              userName="User Name"
            />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Minimal Settings">
          <div class="h-sm">
            <org-application-navigation
              [navigationItems]="navigationItems"
              [settingsMenuItems]="minimalSettings"
              userName="User Name"
            />
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Settings menu opens on button click (CDK Menu)</li>
          <li>Menu closes when clicking outside (CDK Menu)</li>
          <li>Menu closes when pressing Escape key (CDK Menu)</li>
          <li>Menu closes after selecting an item (CDK Menu)</li>
          <li>Arrow keys navigate between menu items (CDK Menu)</li>
          <li>Settings menu items support icons</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      navigationItems: defaultNavigationItems,
      standardSettings: defaultSettingsMenuItems,
      extendedSettings: [
        { id: '1', label: 'Profile', icon: 'circle' as IconName },
        { id: '2', label: 'Account Settings', icon: 'cog' as IconName },
        { id: '3', label: 'Notifications', icon: 'mail' as IconName },
        { id: '4', label: 'Privacy', icon: 'eye' as IconName },
        { id: '5', label: 'Security', icon: 'circle-check-big' as IconName },
        { id: '6', label: 'Help Center', icon: 'circle' as IconName },
      ],
      minimalSettings: [
        { id: '1', label: 'Settings', icon: 'cog' as IconName },
        { id: '2', label: 'Help', icon: 'mail' as IconName },
      ],
    },
    moduleMetadata: {
      imports: [ApplicationNavigation, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithAndWithoutLogo: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of navigation with and without logo.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Logo Variants"
        currentState="With and without logo configurations"
      >
        <org-storybook-example-container-section label="With Logo">
          <div class="h-sm">
            <org-application-navigation
              logo="https://placehold.co/225x60/10B981/white?text=AppLogo"
              [navigationItems]="navigationItems"
              [settingsMenuItems]="settingsMenuItems"
              userName="John Doe"
            />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Without Logo">
          <div class="h-sm">
            <org-application-navigation
              logo=""
              [navigationItems]="navigationItems"
              [settingsMenuItems]="settingsMenuItems"
              userName="John Doe"
            />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Custom Logo">
          <div class="h-sm">
            <org-application-navigation
              logo="https://placehold.co/225x60/EF4444/white?text=CustomApp"
              [navigationItems]="navigationItems"
              [settingsMenuItems]="settingsMenuItems"
              userName="Jane Smith"
            />
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Logo section is hidden when no logo is provided</li>
          <li>Navigation items move to the top when no logo is present</li>
          <li>Logo accepts any valid image URL</li>
          <li>Layout adjusts gracefully with or without logo</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      navigationItems: defaultNavigationItems,
      settingsMenuItems: defaultSettingsMenuItems,
    },
    moduleMetadata: {
      imports: [ApplicationNavigation, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const UserDisplayVariants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different user display configurations.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="User Display Variants"
        currentState="Different user display configurations"
      >
        <org-storybook-example-container-section label="With User Name">
          <div class="h-sm">
            <org-application-navigation
              [navigationItems]="navigationItems"
              [settingsMenuItems]="settingsMenuItems"
              userName="John Doe"
            />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Without User Name">
          <div class="h-sm">
            <org-application-navigation
              [navigationItems]="navigationItems"
              [settingsMenuItems]="settingsMenuItems"
              userName=""
            />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Long User Name">
          <div class="h-sm">
            <org-application-navigation
              [navigationItems]="navigationItems"
              [settingsMenuItems]="settingsMenuItems"
              userName="Christopher Alexander Montgomery III"
            />
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>User name is displayed when provided</li>
          <li>User section is hidden when no user name is provided</li>
          <li>Long user names wrap appropriately</li>
          <li>Logout button is always visible</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      navigationItems: defaultNavigationItems,
      settingsMenuItems: defaultSettingsMenuItems,
    },
    moduleMetadata: {
      imports: [ApplicationNavigation, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const EmptyStates: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different empty state configurations.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Empty States"
        currentState="Different empty state configurations"
      >
        <org-storybook-example-container-section label="No Navigation Items">
          <div class="h-sm">
            <org-application-navigation
              logo="https://placehold.co/225x60/4F46E5/white?text=Logo"
              userName="User Name"
              [navigationItems]="[]"
              [settingsMenuItems]="settingsMenuItems"
            />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="No Settings Items">
          <div class="h-sm">
            <org-application-navigation
              logo="https://placehold.co/225x60/4F46E5/white?text=Logo"
              userName="User Name"
              [navigationItems]="navigationItems"
              [settingsMenuItems]="[]"
            />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Minimal Configuration">
          <div class="h-sm">
            <org-application-navigation
              [navigationItems]="[]"
              [settingsMenuItems]="[]"
            />
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Component gracefully handles empty data arrays</li>
          <li>All sections remain functional with no data</li>
          <li>Layout maintains structure without items</li>
          <li>Settings button is hidden when no settings items are provided</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      navigationItems: defaultNavigationItems,
      settingsMenuItems: defaultSettingsMenuItems,
    },
    moduleMetadata: {
      imports: [ApplicationNavigation, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const AriaCurrentPage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Validates that the active navigation item has aria-current="page" set on the anchor element for screen reader accessibility.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Aria Current Page"
        currentState="Active navigation item should have aria-current=page on the anchor"
      >
        <org-storybook-example-container-section label="With Active Route">
          <div class="h-sm">
            <org-application-navigation
              [navigationItems]="navigationItems"
              [settingsMenuItems]="settingsMenuItems"
              userName="User Name"
            />
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>The anchor element of the active nav item must have aria-current="page"</li>
          <li>Non-active nav items must not have aria-current set</li>
          <li>Active state is detected automatically via RouterLinkActive — no manual isSelected binding needed</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      navigationItems: defaultNavigationItems,
      settingsMenuItems: defaultSettingsMenuItems,
    },
    moduleMetadata: {
      imports: [ApplicationNavigation, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const InteractiveDemo: Story = {
  args: {
    logo: 'https://placehold.co/225x60/4F46E5/white?text=MyApp',
    userName: 'Application User',
    navigationItems: defaultNavigationItems,
    settingsMenuItems: defaultSettingsMenuItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo with event handlers logging to console. Open browser console to see events.',
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      onNavigationClick: (item: any) => {
        console.log('Navigation item clicked:', item);
      },
      onSettingsClick: (item: any) => {
        console.log('Settings item clicked:', item);
      },
      onLogout: () => {
        console.log('Logout clicked');
      },
    },
    template: `
      <div class="h-screen">
        <org-application-navigation
          [logo]="logo"
          [userName]="userName"
          [navigationItems]="navigationItems"
          [settingsMenuItems]="settingsMenuItems"
          (navigationItemClicked)="onNavigationClick($event)"
          (settingsMenuItemClicked)="onSettingsClick($event)"
          (logout)="onLogout()"
        />
      </div>
    `,
    moduleMetadata: {
      imports: [ApplicationNavigation],
    },
  }),
};
