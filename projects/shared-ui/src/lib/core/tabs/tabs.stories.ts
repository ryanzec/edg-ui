import type { Meta, StoryObj } from '@storybook/angular';
import { signal } from '@angular/core';
import { Tabs } from './tabs';
import { Tab } from './tab';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { Card } from '../card/card';
import { CardContent } from '../card/card-content';
import { Button } from '../button/button';

const meta: Meta<Tabs> = {
  title: 'Core/Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Tabs Component

  A versatile tabs component system for organizing content into switchable views.

  ### Features
  - Tab switching with active state management
  - Scrollable tabs option with navigation controls
  - Disabled tab support
  - Click event handling
  - Accessible with focus management and keyboard navigation
  - Smooth transitions

  ### Components
  - **Tabs**: Container component that manages tab state and layout
  - **Tab**: Individual tab component with content

  ### Usage Examples
  \`\`\`html
  <!-- Basic tabs -->
  <org-tabs [(value)]="activeTab">
    <org-tab value="home">Home</org-tab>
    <org-tab value="profile">Profile</org-tab>
    <org-tab value="settings">Settings</org-tab>
  </org-tabs>

  <!-- Scrollable tabs -->
  <org-tabs [(value)]="activeTab" [scrollable]="true">
    <org-tab value="tab1">Tab 1</org-tab>
    <org-tab value="tab2">Tab 2</org-tab>
    <org-tab value="tab3">Tab 3</org-tab>
    <org-tab value="tab4">Tab 4</org-tab>
    <org-tab value="tab5">Tab 5</org-tab>
  </org-tabs>

  <!-- Tabs with disabled state -->
  <org-tabs [(value)]="activeTab">
    <org-tab value="active">Active Tab</org-tab>
    <org-tab value="disabled" [disabled]="true">Disabled Tab</org-tab>
  </org-tabs>
</div>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Tabs>;

export const Default: Story = {
  args: {
    value: 'home',
    scrollable: false,
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'The value of the active tab',
    },
    scrollable: {
      control: 'boolean',
      description: 'Whether the tabs are scrollable with navigation buttons',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default tabs component with basic tab switching. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => {
    const activeTab = signal((args as unknown as { value: string }).value);

    return {
      props: {
        ...args,
        activeTab,
        onValueChange: (value: string) => {
          console.log('tab selected:', value);
          activeTab.set(value);
        },
      },
      template: `
        <org-tabs
          [value]="activeTab()"
          [scrollable]="scrollable"
          (valueChange)="onValueChange($event)"
        >
          <org-tab value="home">Home</org-tab>
          <org-tab value="profile">Profile</org-tab>
          <org-tab value="settings">Settings</org-tab>
        </org-tabs>
      `,
      moduleMetadata: {
        imports: [Tabs, Tab],
      },
    };
  },
};

export const BasicTabs: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic tabs with three options showing active state and hover effects.',
      },
    },
  },
  render: () => {
    const activeTab = signal('home');

    return {
      props: {
        activeTab,
        onValueChange: (value: string) => {
          console.log('tab selected:', value);
          activeTab.set(value);
        },
      },
      template: `
        <org-storybook-example-container
          title="Basic Tabs"
          [currentState]="'Active tab: ' + activeTab()"
        >
          <org-storybook-example-container-section label="Default">
            <org-tabs
              [value]="activeTab()"
              (valueChange)="onValueChange($event)"
            >
              <org-tab value="home">Home</org-tab>
              <org-tab value="profile">Profile</org-tab>
              <org-tab value="settings">Settings</org-tab>
            </org-tabs>
          </org-storybook-example-container-section>

          <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
            <li><strong>Active Tab</strong>: Bold border and darker text</li>
            <li><strong>Inactive Tabs</strong>: Subtle border and text, hover effect on mouse over</li>
            <li><strong>Click</strong>: Switches active tab and updates value model</li>
          </ul>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Tabs, Tab, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const WithContent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tabs with content panels that change based on the active tab.',
      },
    },
  },
  render: () => {
    const activeTab = signal('home');

    return {
      props: {
        activeTab,
        onValueChange: (value: string) => {
          console.log('tab selected:', value);
          activeTab.set(value);
        },
      },
      template: `
        <org-storybook-example-container
          title="Tabs with Content"
          [currentState]="'Showing content for: ' + activeTab()"
        >
          <org-storybook-example-container-section label="With Content Panels">
            <div class="flex flex-col gap-4">
              <org-tabs
                [value]="activeTab()"
                (valueChange)="onValueChange($event)"
              >
                <org-tab value="home">Home</org-tab>
                <org-tab value="profile">Profile</org-tab>
                <org-tab value="settings">Settings</org-tab>
              </org-tabs>

              @if (activeTab() === 'home') {
                <org-card>
                  <org-card-content>
                    <h3 class="text-xl font-semibold mb-2">Home Content</h3>
                    <div>Welcome to the home tab. This is where you'll find the main dashboard and overview.</div>
                  </org-card-content>
                </org-card>
              }

              @if (activeTab() === 'profile') {
                <org-card>
                  <org-card-content>
                    <h3 class="text-xl font-semibold mb-2">Profile Content</h3>
                    <div>View and edit your profile information here.</div>
                  </org-card-content>
                </org-card>
              }

              @if (activeTab() === 'settings') {
                <org-card>
                  <org-card-content>
                    <h3 class="text-xl font-semibold mb-2">Settings Content</h3>
                    <div>Adjust your preferences and account settings.</div>
                  </org-card-content>
                </org-card>
              }
            </div>
          </org-storybook-example-container-section>

          <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
            <li><strong>Content Switching</strong>: Content changes based on active tab</li>
            <li><strong>Conditional Rendering</strong>: Only active tab content is rendered</li>
            <li><strong>Smooth Transitions</strong>: Tab and content changes are smooth</li>
          </ul>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Tabs, Tab, Card, CardContent, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const DisabledTabs: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tabs with disabled state showing reduced opacity and no interaction.',
      },
    },
  },
  render: () => {
    const activeTab = signal('home');

    return {
      props: {
        activeTab,
        onValueChange: (value: string) => {
          console.log('tab selected:', value);
          activeTab.set(value);
        },
      },
      template: `
        <org-storybook-example-container
          title="Disabled Tabs"
          [currentState]="'Active tab: ' + activeTab()"
        >
          <org-storybook-example-container-section label="With Disabled Tab">
            <org-tabs
              [value]="activeTab()"
              (valueChange)="onValueChange($event)"
            >
              <org-tab value="home">Home</org-tab>
              <org-tab value="profile" [disabled]="true">Profile (Disabled)</org-tab>
              <org-tab value="settings">Settings</org-tab>
            </org-tabs>
          </org-storybook-example-container-section>

          <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
            <li><strong>Disabled Appearance</strong>: Reduced opacity applied to disabled tab</li>
            <li><strong>No Interaction</strong>: Click events are prevented on disabled tabs</li>
            <li><strong>Cursor</strong>: Cursor changes to not-allowed on hover</li>
            <li><strong>Keyboard Focusable</strong>: Disabled tabs remain focusable via keyboard but cannot be activated</li>
            <li><strong>valueChange Event</strong>: Not emitted when disabled tab is clicked</li>
          </ul>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Tabs, Tab, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const ScrollableTabs: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Scrollable tabs with navigation buttons that scroll 80% of container width. Buttons are disabled when scrolled to their respective ends.',
      },
    },
  },
  render: () => {
    const activeTab = signal('tab1');

    return {
      props: {
        activeTab,
        onValueChange: (value: string) => {
          console.log('tab selected:', value);
          activeTab.set(value);
        },
      },
      template: `
        <org-storybook-example-container
          title="Scrollable Tabs"
          [currentState]="'Active tab: ' + activeTab()"
        >
          <org-storybook-example-container-section label="With Scrolling" class="w-2xs">
            <org-tabs
              [value]="activeTab()"
              [scrollable]="true"
              (valueChange)="onValueChange($event)"
            >
              <org-tab value="tab1">Dashboard</org-tab>
              <org-tab value="tab2">Analytics</org-tab>
              <org-tab value="tab3">Reports</org-tab>
              <org-tab value="tab4">Users</org-tab>
              <org-tab value="tab5">Settings</org-tab>
              <org-tab value="tab6">Billing</org-tab>
              <org-tab value="tab7">Support</org-tab>
              <org-tab value="tab8">Documentation</org-tab>
            </org-tabs>
          </org-storybook-example-container-section>

          <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
            <li><strong>Navigation Buttons</strong>: Caret icons appear on both sides</li>
            <li><strong>Scroll Amount</strong>: Buttons scroll 80% of container width</li>
            <li><strong>Smooth Scrolling</strong>: Animated scroll behavior</li>
            <li><strong>Button States</strong>: Left button disabled at start, right button disabled at end</li>
            <li><strong>Manual Scroll</strong>: Users can also scroll manually with mouse/touch</li>
            <li><strong>Auto-Center</strong>: Active tab automatically scrolls into view when selected</li>
          </ul>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Tabs, Tab, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const ManyTabs: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example with many tabs showing both scrollable and non-scrollable variants.',
      },
    },
  },
  render: () => {
    const activeTab1 = signal('tab1');
    const activeTab2 = signal('tab1');

    return {
      props: {
        activeTab1,
        activeTab2,
        onTab1ValueChange: (value: string) => {
          console.log('tab 1 selected:', value);
          activeTab1.set(value);
        },
        onTab2ValueChange: (value: string) => {
          console.log('tab 2 selected:', value);
          activeTab2.set(value);
        },
      },
      template: `
        <org-storybook-example-container
          title="Many Tabs"
          currentState="Comparing scrollable vs non-scrollable with many tabs"
        >
          <org-storybook-example-container-section label="Non-Scrollable (Overflows)">
            <org-tabs
              [value]="activeTab1()"
              (valueChange)="onTab1ValueChange($event)"
            >
              <org-tab value="tab1">Tab 1</org-tab>
              <org-tab value="tab2">Tab 2</org-tab>
              <org-tab value="tab3">Tab 3</org-tab>
              <org-tab value="tab4">Tab 4</org-tab>
              <org-tab value="tab5">Tab 5</org-tab>
              <org-tab value="tab6">Tab 6</org-tab>
              <org-tab value="tab7">Tab 7</org-tab>
              <org-tab value="tab8">Tab 8</org-tab>
              <org-tab value="tab9">Tab 9</org-tab>
              <org-tab value="tab10">Tab 10</org-tab>
            </org-tabs>
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Scrollable (With Navigation)" class="w-xs">
            <org-tabs
              [value]="activeTab2()"
              [scrollable]="true"
              (valueChange)="onTab2ValueChange($event)"
              class="w-full"
            >
              <org-tab value="tab1">Tab 1</org-tab>
              <org-tab value="tab2">Tab 2</org-tab>
              <org-tab value="tab3">Tab 3</org-tab>
              <org-tab value="tab4">Tab 4</org-tab>
              <org-tab value="tab5">Tab 5</org-tab>
              <org-tab value="tab6">Tab 6</org-tab>
              <org-tab value="tab7">Tab 7</org-tab>
              <org-tab value="tab8">Tab 8</org-tab>
              <org-tab value="tab9">Tab 9</org-tab>
              <org-tab value="tab10">Tab 10</org-tab>
              <org-tab value="tab11">Tab 11</org-tab>
              <org-tab value="tab12">Tab 12</org-tab>
              <org-tab value="tab13">Tab 13</org-tab>
              <org-tab value="tab14">Tab 14</org-tab>
              <org-tab value="tab15">Tab 15</org-tab>
              <org-tab value="tab16">Tab 16</org-tab>
              <org-tab value="tab17">Tab 17</org-tab>
              <org-tab value="tab18">Tab 18</org-tab>
              <org-tab value="tab19">Tab 19</org-tab>
              <org-tab value="tab20">Tab 20</org-tab>
              <org-tab value="tab21">Tab 21</org-tab>
              <org-tab value="tab22">Tab 22</org-tab>
              <org-tab value="tab23">Tab 23</org-tab>
              <org-tab value="tab24">Tab 24</org-tab>
              <org-tab value="tab25">Tab 25</org-tab>
              <org-tab value="tab26">Tab 26</org-tab>
              <org-tab value="tab27">Tab 27</org-tab>
              <org-tab value="tab28">Tab 28</org-tab>
              <org-tab value="tab29">Tab 29</org-tab>
              <org-tab value="tab30">Tab 30</org-tab>
            </org-tabs>
          </org-storybook-example-container-section>

          <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
            <li><strong>Non-Scrollable</strong>: Tabs may overflow container without scrollable mode</li>
            <li><strong>Scrollable</strong>: Navigation buttons allow access to all tabs</li>
            <li><strong>Use Case</strong>: Enable scrollable when you have many tabs that won't fit</li>
          </ul>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Tabs, Tab, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};

export const ProgrammaticTabSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates programmatically setting the active tab. Use the button to jump to the last tab, showing that the component properly handles external tab changes.',
      },
    },
  },
  render: () => {
    const activeTab = signal('tab1');

    return {
      props: {
        activeTab,
        onValueChange: (value: string) => {
          console.log('tab selected:', value);
          activeTab.set(value);
        },
        jumpToLastTab: () => {
          console.log('jumping to last tab');
          activeTab.set('tab20');
        },
        jumpToFirstTab: () => {
          console.log('jumping to first tab');
          activeTab.set('tab1');
        },
        jumpToMiddleTab: () => {
          console.log('jumping to middle tab');
          activeTab.set('tab10');
        },
      },
      template: `
        <org-storybook-example-container
          title="Programmatic Tab Selection"
          [currentState]="'Active tab: ' + activeTab()"
        >
          <org-storybook-example-container-section label="Scrollable with Jump to Last Button">
            <div class="flex flex-col gap-4">
              <div class="flex flex-row gap-1">
                <org-button color="primary" label="Jump to First Tab" (clicked)="jumpToFirstTab()" />
                <org-button color="primary" label="Jump to Middle Tab" (clicked)="jumpToMiddleTab()" />
                <org-button color="primary" label="Jump to Last Tab" (clicked)="jumpToLastTab()" />
              </div>

              <div class="w-sm">
                <org-tabs
                  [value]="activeTab()"
                  [scrollable]="true"
                  (valueChange)="onValueChange($event)"
                >
                  <org-tab value="tab1">Tab 1</org-tab>
                  <org-tab value="tab2">Tab 2</org-tab>
                  <org-tab value="tab3">Tab 3</org-tab>
                  <org-tab value="tab4">Tab 4</org-tab>
                  <org-tab value="tab5">Tab 5</org-tab>
                  <org-tab value="tab6">Tab 6</org-tab>
                  <org-tab value="tab7">Tab 7</org-tab>
                  <org-tab value="tab8">Tab 8</org-tab>
                  <org-tab value="tab9">Tab 9</org-tab>
                  <org-tab value="tab10">Tab 10</org-tab>
                  <org-tab value="tab11">Tab 11</org-tab>
                  <org-tab value="tab12">Tab 12</org-tab>
                  <org-tab value="tab13">Tab 13</org-tab>
                  <org-tab value="tab14">Tab 14</org-tab>
                  <org-tab value="tab15">Tab 15</org-tab>
                  <org-tab value="tab16">Tab 16</org-tab>
                  <org-tab value="tab17">Tab 17</org-tab>
                  <org-tab value="tab18">Tab 18</org-tab>
                  <org-tab value="tab19">Tab 19</org-tab>
                  <org-tab value="tab20">Tab 20 (Last)</org-tab>
                </org-tabs>
              </div>
            </div>
          </org-storybook-example-container-section>

          <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
            <li><strong>Programmatic Control</strong>: Tab selection can be controlled externally via signal</li>
            <li><strong>Jump Button</strong>: Click to instantly set active tab to the last one</li>
            <li><strong>Auto-Scroll</strong>: When scrollable is enabled, the tabs container automatically scrolls to center the active tab</li>
            <li><strong>Smooth Transition</strong>: The scroll animation is smooth and updates scroll button states</li>
            <li><strong>Use Case</strong>: Useful for deep linking, navigation guards, or workflow steps</li>
          </ul>
        </org-storybook-example-container>
      `,
      moduleMetadata: {
        imports: [Tabs, Tab, Button, StorybookExampleContainer, StorybookExampleContainerSection],
      },
    };
  },
};
