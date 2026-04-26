import type { Meta, StoryObj } from '@storybook/angular';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

import { Component, ChangeDetectionStrategy, input, computed, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { type ConnectedPosition } from '@angular/cdk/overlay';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { Button } from '../../core/button/button';
import { OverlayMenu, type OverlayMenuItem, type OverlayMenuItemEntry } from '../../core/overlay-menu/overlay-menu';

type OverlayMenuPosition = 'below' | 'above' | 'before' | 'after';

@Component({
  selector: 'story-example-overlay-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkMenuTrigger, Button, OverlayMenu],
  template: `<div [class]="containerClass()">
    <org-button [cdkMenuTriggerFor]="menu" [cdkMenuPosition]="menuPosition()" color="primary"> Open Menu </org-button>

    <ng-template #menu>
      <org-overlay-menu
        [menuItems]="[
          { id: '1', label: 'Menu Item 1', icon: 'circle' },
          { id: '2', label: 'Menu Item 2', icon: 'circle' },
          { id: '3', label: 'Menu Item 3', icon: 'circle' },
          { id: '4', label: 'Menu Item 4', icon: 'circle' },
        ]"
      />
    </ng-template>
  </div> `,
})
class EXAMPLEOverlayMenu {
  public position = input<OverlayMenuPosition>('below');
  public containerClass = input<string>('');

  protected readonly menuPosition = computed<ConnectedPosition[]>(() => {
    if (this.position() === 'above') {
      return [{ originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' }];
    }

    if (this.position() === 'before') {
      return [{ originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' }];
    }

    if (this.position() === 'after') {
      return [{ originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' }];
    }

    return [{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }];
  });
}

@Component({
  selector: 'story-overlay-menu-clicked',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkMenuTrigger, Button, OverlayMenu, StorybookExampleContainer, StorybookExampleContainerSection],
  template: `
    <org-storybook-example-container
      title="Menu Item Clicked"
      currentState="Click a menu item to observe the menuItemClicked output"
    >
      <org-storybook-example-container-section label="Click a Menu Item">
        <div class="flex flex-col gap-2">
          <org-button [cdkMenuTriggerFor]="menu" color="primary">Open Menu</org-button>
          <ng-template #menu>
            <org-overlay-menu
              [menuItems]="[
                { id: '1', label: 'Menu Item 1', icon: 'circle' },
                { id: '2', label: 'Menu Item 2', icon: 'circle' },
                { id: '3', label: 'Menu Item 3', icon: 'circle' },
              ]"
              (menuItemClicked)="handleMenuItemClicked($event)"
            />
          </ng-template>
          @if (lastClickedItem()) {
            <p>
              Last clicked: <strong>{{ lastClickedItem()!.label }}</strong> (id: {{ lastClickedItem()!.id }})
            </p>
          }
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>
          Clicking a menu item emits the full <strong>OverlayMenuItem</strong> object via
          <strong>menuItemClicked</strong>
        </li>
        <li>The last clicked item's label and id are displayed below the trigger</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class OverlayMenuClickedStory {
  protected readonly lastClickedItem = signal<OverlayMenuItemEntry | null>(null);

  protected handleMenuItemClicked(item: OverlayMenuItemEntry): void {
    this.lastClickedItem.set(item);
  }
}

type ExampleMeta = {
  value: string;
  category: string;
};

@Component({
  selector: 'story-overlay-menu-meta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkMenuTrigger, Button, OverlayMenu, StorybookExampleContainer, StorybookExampleContainerSection, JsonPipe],
  template: `
    <org-storybook-example-container
      title="Menu Item Meta"
      currentState="Select a menu item to see its meta payload rendered below the trigger"
    >
      <org-storybook-example-container-section label="Select a Menu Item">
        <div class="flex flex-col gap-2">
          <org-button [cdkMenuTriggerFor]="menu" color="primary">Open Menu</org-button>
          <ng-template #menu>
            <org-overlay-menu [menuItems]="menuItems" (menuItemClicked)="handleMenuItemClicked($event)" />
          </ng-template>
          @if (selectedItem(); as item) {
            <div class="flex flex-col gap-1">
              <p>
                Selected: <strong>{{ item.label }}</strong>
              </p>
              <pre>{{ item.meta | json }}</pre>
            </div>
          }
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>
          Each <strong>OverlayMenuItem</strong> can carry a consumer-defined <strong>meta</strong> payload typed via the
          <strong>TMeta</strong> generic
        </li>
        <li>
          Selecting an item emits the full item including <strong>meta</strong> through <strong>menuItemClicked</strong>
        </li>
        <li>The selected item's <strong>meta</strong> is rendered as JSON below the trigger</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class OverlayMenuMetaStory {
  protected readonly menuItems: OverlayMenuItem<ExampleMeta>[] = [
    { id: '1', label: 'Apple', icon: 'circle', meta: { value: 'apple', category: 'fruit' } },
    { id: '2', label: 'Broccoli', icon: 'circle', meta: { value: 'broccoli', category: 'vegetable' } },
    { id: '3', label: 'Chicken', icon: 'circle', meta: { value: 'chicken', category: 'protein' } },
  ];

  protected readonly selectedItem = signal<OverlayMenuItemEntry<ExampleMeta> | null>(null);

  protected handleMenuItemClicked(item: OverlayMenuItemEntry<ExampleMeta>): void {
    this.selectedItem.set(item);
  }
}

const meta: Meta<EXAMPLEOverlayMenu> = {
  title: 'Core/Components/Overlay Menu',
  component: EXAMPLEOverlayMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Angular CDK Menu with Position Example

  A minimalistic example demonstrating Angular CDK's Menu functionality with automatic positioning using the \`cdkMenuPosition\` input. This example shows how to create accessible dropdown menus with configurable positioning.

  ### Features
  - Uses Angular CDK Menu module for accessible menus
  - Demonstrates \`cdkMenuPosition\` for automatic positioning
  - Keyboard navigation support (Arrow keys, Enter, Escape)
  - Automatic focus management
  - Click-outside to close

  ### Usage Example
  \`\`\`html
  <story-example-overlay-menu position="below" />
  \`\`\`

  ### CDK Menu Concepts
  - **cdkMenuTriggerFor**: Connects a trigger element to a menu template
  - **cdkMenu**: Marks the container as a menu with keyboard navigation
  - **cdkMenuItem**: Marks individual menu items for proper ARIA attributes
  - **cdkMenuPosition**: Configures fallback positions for the overlay
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<EXAMPLEOverlayMenu>;

export const Default: Story = {
  args: {
    position: 'below',
    containerClass: '',
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['below', 'above', 'before', 'after'],
      description: 'Position of the menu relative to the trigger button',
    },
    containerClass: {
      control: 'text',
      description: 'Additional CSS classes for the container',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default menu example with controls to adjust positioning. Click the button to open the menu.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<story-example-overlay-menu [position]="position" [containerClass]="containerClass" />`,
    moduleMetadata: {
      imports: [EXAMPLEOverlayMenu],
    },
  }),
};

export const Positions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of different menu positions using cdkMenuPosition.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Menu Positions"
        currentState="Comparing different cdkMenuPosition configurations"
      >
        <org-storybook-example-container-section label="Below (Default)">
          <story-example-overlay-menu position="below" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Above">
          <story-example-overlay-menu position="above" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Before (Left)">
          <story-example-overlay-menu position="before" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="After (Right)">
          <story-example-overlay-menu position="after" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Below</strong>: Menu opens below the trigger button</li>
          <li><strong>Above</strong>: Menu opens above the trigger button</li>
          <li><strong>Before</strong>: Menu opens to the left of the trigger button</li>
          <li><strong>After</strong>: Menu opens to the right of the trigger button</li>
          <li>Angular CDK automatically adjusts if there isn't enough space</li>
          <li>Use arrow keys to navigate, Enter to select, Escape to close</li>
          <li>Click outside the menu to close it</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EXAMPLEOverlayMenu, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const KeyboardNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example demonstrating the built-in keyboard navigation features of CDK Menu.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Keyboard Navigation"
        currentState="Demonstrating accessible keyboard controls"
      >
        <org-storybook-example-container-section label="Try Keyboard Controls">
          <story-example-overlay-menu position="below" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Enter/Space</strong>: Open menu when trigger is focused</li>
          <li><strong>Arrow Down/Up</strong>: Navigate between menu items</li>
          <li><strong>Enter</strong>: Activate the focused menu item</li>
          <li><strong>Escape</strong>: Close the menu</li>
          <li><strong>Tab</strong>: Close menu and move focus to next element</li>
          <li>All keyboard navigation is provided by Angular CDK</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EXAMPLEOverlayMenu, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const MenuLabel: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the menuLabel input providing a custom accessible name on the menu container.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Menu Label"
        currentState="Inspect the role=menu element in the accessibility tree to verify the aria-label"
      >
        <org-storybook-example-container-section label="Custom Menu Label">
          <org-button [cdkMenuTriggerFor]="menu" color="primary">Open Menu</org-button>
          <ng-template #menu>
            <org-overlay-menu
              menuLabel="Actions"
              [menuItems]="[
                { id: '1', label: 'Edit', icon: 'circle' },
                { id: '2', label: 'Duplicate', icon: 'circle' },
                { id: '3', label: 'Delete', icon: 'circle' },
              ]"
            />
          </ng-template>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>The menu container has <strong>aria-label="Actions"</strong> applied to the <strong>role="menu"</strong> element</li>
          <li>Screen readers announce the menu name when the menu opens</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [CdkMenuTrigger, Button, OverlayMenu, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const MenuItemClicked: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the menuItemClicked output event emitting the selected OverlayMenuItem.',
      },
    },
  },
  render: () => ({
    template: `<story-overlay-menu-clicked />`,
    moduleMetadata: {
      imports: [OverlayMenuClickedStory],
    },
  }),
};

export const MenuItemMeta: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the OverlayMenuItem meta property typed via the TMeta generic. Selecting an item renders the item meta payload to the page.',
      },
    },
  },
  render: () => ({
    template: `<story-overlay-menu-meta />`,
    moduleMetadata: {
      imports: [OverlayMenuMetaStory],
    },
  }),
};

export const Dividers: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates placing dividers between groups of menu items by setting `type: "divider"` on an `OverlayMenuItem` entry.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Menu Item Dividers"
        currentState="Menu items separated into groups using divider entries"
      >
        <org-storybook-example-container-section label="Grouped Menu Items with Dividers">
          <org-button [cdkMenuTriggerFor]="menu" color="primary">Open Menu</org-button>
          <ng-template #menu>
            <org-overlay-menu
              [menuItems]="[
                { id: '1', label: 'Edit', icon: 'circle' },
                { id: '2', label: 'Duplicate', icon: 'circle' },
                { id: 'd1', type: 'divider' },
                { id: '3', label: 'Share', icon: 'circle' },
                { id: '4', label: 'Move', icon: 'circle' },
                { id: 'd2', type: 'divider' },
                { id: '5', label: 'Delete', icon: 'circle' },
              ]"
            />
          </ng-template>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Entries with <strong>type: 'divider'</strong> render a horizontal separator instead of a clickable row</li>
          <li>Dividers are visual only — they do not emit <strong>menuItemClicked</strong> and are not keyboard focusable</li>
          <li>Item entries (<strong>type: 'item'</strong> or omitted) continue to render as standard menu rows</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [CdkMenuTrigger, Button, OverlayMenu, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
