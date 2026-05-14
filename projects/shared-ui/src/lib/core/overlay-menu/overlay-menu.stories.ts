import type { Meta, StoryObj } from '@storybook/angular';
import { Component, ChangeDetectionStrategy, computed, input, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { CdkContextMenuTrigger } from '@angular/cdk/menu';
import { Avatar } from '../avatar/avatar';
import { Button } from '../button/button';
import { ScrollArea } from '../scroll-area/scroll-area';
import { ButtonToggle, type ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import {
  OverlayMenu,
  type OverlayMenuItem,
  type OverlayMenuItemEntry,
  type OverlayMenuEntryValueChange,
  type OverlayMenuListSize,
  allOverlayMenuListSizes,
} from './overlay-menu';
import { OverlayMenuTriggerDirective, type OverlayMenuTriggerPosition } from './overlay-menu-trigger';

@Component({
  selector: 'story-example-overlay-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OverlayMenuTriggerDirective, Button, OverlayMenu],
  template: `<div [class]="containerClass()">
    <org-button
      [orgOverlayMenuTrigger]="menu"
      [overlayMenuTriggerPosition]="position()"
      color="primary"
      label="Open Menu"
    />

    <ng-template #menu>
      <org-overlay-menu
        [items]="[
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
  public position = input<OverlayMenuTriggerPosition>('below');
  public containerClass = input<string>('');
}

const liveDemoListSizeItems: ButtonToggleItem[] = allOverlayMenuListSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

@Component({
  selector: 'story-overlay-menu-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    OverlayMenu,
    ButtonToggle,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlGroup,
    DesignSystemDemoCanvas,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .canvas-stage {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        min-height: 14rem; /* 224px */
        padding: var(--spacing-3);
      }
      .last-clicked {
        text-align: center;
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="The overlay menu below is real and interactive — toggle the row size, enable shortcuts, post icons, a Beta tag, a divider, or a disabled row, and click an item to fire itemClicked."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Row size">
            <org-button-toggle [items]="listSizeItems" formControlName="listSize" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Pre icons">
            <org-checkbox-toggle name="live-demo-pre" value="preIcons" formControlName="showPreIcons">
              {{ liveDemoForm.controls.showPreIcons.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Shortcuts">
            <org-checkbox-toggle name="live-demo-shortcut" value="shortcut" formControlName="showShortcut">
              {{ liveDemoForm.controls.showShortcut.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Post icon">
            <org-checkbox-toggle name="live-demo-post-icon" value="postIcon" formControlName="showPostIcon">
              {{ liveDemoForm.controls.showPostIcon.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Beta tag">
            <org-checkbox-toggle name="live-demo-tag" value="tag" formControlName="showTag">
              {{ liveDemoForm.controls.showTag.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Divider">
            <org-checkbox-toggle name="live-demo-divider" value="divider" formControlName="showDivider">
              {{ liveDemoForm.controls.showDivider.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Disabled row">
            <org-checkbox-toggle name="live-demo-disabled" value="disabled" formControlName="showDisabled">
              {{ liveDemoForm.controls.showDisabled.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-overlay-menu
              [items]="liveDemoItems()"
              [listSize]="liveDemoForm.controls.listSize.value"
              label="Actions"
              (itemClicked)="onItemClicked($event)"
            />
          </div>
          @if (lastClicked(); as last) {
            <p class="last-clicked">
              Last clicked: <strong>{{ last.label }}</strong> (id: {{ last.id }})
            </p>
          }
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class OverlayMenuLiveDemoStory {
  protected readonly listSizeItems = liveDemoListSizeItems;

  protected readonly liveDemoForm = new FormGroup({
    listSize: new FormControl<OverlayMenuListSize>('sm', { nonNullable: true }),
    showPreIcons: new FormControl<boolean>(true, { nonNullable: true }),
    showShortcut: new FormControl<boolean>(false, { nonNullable: true }),
    showPostIcon: new FormControl<boolean>(false, { nonNullable: true }),
    showTag: new FormControl<boolean>(false, { nonNullable: true }),
    showDivider: new FormControl<boolean>(false, { nonNullable: true }),
    showDisabled: new FormControl<boolean>(false, { nonNullable: true }),
  });

  private readonly _formValue = toSignal(
    this.liveDemoForm.valueChanges.pipe(startWith(this.liveDemoForm.getRawValue())),
    { initialValue: this.liveDemoForm.getRawValue() }
  );

  protected readonly liveDemoItems = computed<OverlayMenuItem[]>(() => {
    const value = this._formValue();
    const usePreIcons = value.showPreIcons ?? true;
    const useShortcut = value.showShortcut ?? false;
    const usePostIcon = value.showPostIcon ?? false;
    const useTag = value.showTag ?? false;
    const useDivider = value.showDivider ?? false;
    const useDisabled = value.showDisabled ?? false;

    const items: OverlayMenuItem[] = [
      {
        id: 'edit',
        label: 'Edit',
        icon: usePreIcons ? 'pencil' : null,
        shortcut: useShortcut ? '⌘ E' : undefined,
        tag: useTag ? { label: 'Beta', color: 'info' } : undefined,
      },
      {
        id: 'duplicate',
        label: 'Duplicate',
        icon: usePreIcons ? 'copy' : null,
        shortcut: useShortcut ? '⌘ D' : undefined,
        disabled: useDisabled,
      },
      {
        id: 'archive',
        label: 'Archive',
        icon: usePreIcons ? 'inbox' : null,
        postIcon: usePostIcon ? 'chevron-right' : undefined,
      },
    ];

    if (useDivider) {
      items.push({ id: 'd1', type: 'divider' });
    }

    items.push({
      id: 'delete',
      label: 'Delete',
      icon: usePreIcons ? 'trash' : null,
      shortcut: useShortcut ? '⌫' : undefined,
    });

    return items;
  });

  protected readonly lastClicked = signal<OverlayMenuItemEntry | null>(null);

  protected onItemClicked(item: OverlayMenuItemEntry): void {
    this.lastClicked.set(item);
  }
}

@Component({
  selector: 'story-overlay-menu-clicked',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OverlayMenuTriggerDirective,
    Button,
    OverlayMenu,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header slot="header" title="Menu Item Clicked" />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-2">
          <org-button [orgOverlayMenuTrigger]="menu" color="primary" label="Open Menu" />
          <ng-template #menu>
            <org-overlay-menu
              [items]="[
                { id: '1', label: 'Menu Item 1', icon: 'circle' },
                { id: '2', label: 'Menu Item 2', icon: 'circle' },
                { id: '3', label: 'Menu Item 3', icon: 'circle' },
              ]"
              (itemClicked)="handleMenuItemClicked($event)"
            />
          </ng-template>
          @if (lastClickedItem()) {
            <p>
              Last clicked: <strong>{{ lastClickedItem()!.label }}</strong> (id: {{ lastClickedItem()!.id }})
            </p>
          }
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
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
  imports: [
    OverlayMenuTriggerDirective,
    Button,
    OverlayMenu,
    JsonPipe,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header slot="header" title="Menu Item Meta" />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-2">
          <org-button [orgOverlayMenuTrigger]="menu" color="primary" label="Open Menu" />
          <ng-template #menu>
            <org-overlay-menu [items]="menuItems" (itemClicked)="handleMenuItemClicked($event)" />
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
      </org-design-system-demo-canvas>
    </org-design-system-demo>
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
  ## Overlay Menu

  A floating dropdown menu — a vertical stack of clickable rows, optionally separated by dividers, used as panel content for "more actions" buttons, context menus, and avatar dropdowns.

  ### Features
  - Composes real \`org-list\` + \`org-list-item\` for rows and real \`org-divider\` for separators — no second source of truth
  - Owns the panel chrome (surface, border, radius, shadow, padding) via dedicated overlay-menu design tokens
  - Fluid sizing: short menus read tight, long labels wrap up to a 20rem cap
  - Two row densities (\`listSize\`: \`sm\` default, \`base\`)
  - Optional reveal motion via \`state\` (\`'open'\` / \`'closed'\`) with a \`prefers-reduced-motion\` fallback
  - Post meta per row — keyboard shortcut text, sub-menu chevron, status tag (Beta) — via the typed item entry
  - Disabled rows are painted muted, suppressed by CDK keyboard nav, and skip activation
  - Production positioning, click-outside, focus trap, Esc, and arrow-key model are owned by Angular CDK Menu (wrapped by the \`[orgOverlayMenuTrigger]\` directive in this package); the brain wires \`role="menu"\` and \`role="menuitem"\` automatically

  ### Item entry shape
  \`\`\`ts
  type OverlayMenuItem<TMeta> =
    | {
        id: string;
        type?: 'item';
        label: string;
        icon: IconName | null;
        disabled?: boolean;
        shortcut?: string;
        postIcon?: IconName;
        tag?: { label: string; color: string };
        meta?: TMeta;
      }
    | { id: string; type: 'divider' };
  \`\`\`
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

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to flip the row size, enable shortcuts, post icons, a Beta tag, a divider, or a disabled row — and click an item to fire the itemClicked output.',
      },
    },
  },
  render: () => ({
    template: `<story-overlay-menu-live-demo />`,
    moduleMetadata: {
      imports: [OverlayMenuLiveDemoStory],
    },
  }),
};

@Component({
  selector: 'story-overlay-menu-position-flip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OverlayMenuTriggerDirective, Button, OverlayMenu],
  styles: [
    `
      :host {
        display: block;
      }
      .flip-stage {
        position: relative;
        width: 100%;
        height: 70vh;
        min-height: 28rem; /* 448px */
        border: 1px dashed var(--color-border, currentColor);
        border-radius: 0.375rem; /* 6px */
      }
      .flip-corner {
        position: absolute;
        display: flex;
        flex-direction: column;
        gap: 0.5rem; /* 8px */
      }
      .top-left {
        top: 0.5rem; /* 8px */
        left: 0.5rem; /* 8px */
      }
      .top-right {
        top: 0.5rem; /* 8px */
        right: 0.5rem; /* 8px */
      }
      .bottom-left {
        bottom: 0.5rem; /* 8px */
        left: 0.5rem; /* 8px */
      }
      .bottom-right {
        bottom: 0.5rem; /* 8px */
        right: 0.5rem; /* 8px */
      }
    `,
  ],
  template: `
    <div class="flip-stage">
      <div class="flip-corner top-left">
        <org-button [orgOverlayMenuTrigger]="menu" overlayMenuTriggerPosition="below" color="primary" label="below" />
        <org-button [orgOverlayMenuTrigger]="menu" overlayMenuTriggerPosition="before" color="primary" label="before" />
      </div>
      <div class="flip-corner top-right">
        <org-button [orgOverlayMenuTrigger]="menu" overlayMenuTriggerPosition="below" color="primary" label="below" />
        <org-button [orgOverlayMenuTrigger]="menu" overlayMenuTriggerPosition="after" color="primary" label="after" />
      </div>
      <div class="flip-corner bottom-left">
        <org-button [orgOverlayMenuTrigger]="menu" overlayMenuTriggerPosition="above" color="primary" label="above" />
        <org-button [orgOverlayMenuTrigger]="menu" overlayMenuTriggerPosition="before" color="primary" label="before" />
      </div>
      <div class="flip-corner bottom-right">
        <org-button [orgOverlayMenuTrigger]="menu" overlayMenuTriggerPosition="above" color="primary" label="above" />
        <org-button [orgOverlayMenuTrigger]="menu" overlayMenuTriggerPosition="after" color="primary" label="after" />
      </div>
      <ng-template #menu>
        <org-overlay-menu [items]="menuItems" />
      </ng-template>
    </div>
  `,
})
class OverlayMenuPositionFlipStory {
  protected readonly menuItems: OverlayMenuItem[] = [
    { id: '1', label: 'Edit', icon: 'pencil' },
    { id: '2', label: 'Duplicate', icon: 'copy' },
    { id: '3', label: 'Archive', icon: 'inbox' },
  ];
}

@Component({
  selector: 'story-overlay-menu-scroll-behavior',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OverlayMenuTriggerDirective, Button, OverlayMenu, ScrollArea],
  styles: [
    `
      :host {
        display: block;
      }
      .scroll-stage {
        height: 18rem; /* 288px */
        width: 100%;
        border: 1px dashed var(--color-border, currentColor);
        border-radius: 0.375rem; /* 6px */
      }
      .scroll-content {
        display: flex;
        flex-direction: column;
        gap: 1rem; /* 16px */
        padding: 1rem; /* 16px */
      }
      .filler {
        height: 4rem; /* 64px */
        border: 1px solid var(--color-border, currentColor);
        border-radius: 0.25rem; /* 4px */
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-fg-muted, currentColor);
      }
    `,
  ],
  template: `
    <div class="scroll-stage">
      <org-scroll-area scrollClass="h-full w-full">
        <div class="scroll-content">
          <div class="filler">Filler row 1</div>
          <div class="filler">Filler row 2</div>
          <div class="filler">Filler row 3</div>
          <org-button [orgOverlayMenuTrigger]="menu" color="primary" label="Open menu (anchored inside scroll area)" />
          <div class="filler">Filler row 4</div>
          <div class="filler">Filler row 5</div>
          <div class="filler">Filler row 6</div>
          <div class="filler">Filler row 7</div>
          <div class="filler">Filler row 8</div>
          <div class="filler">Filler row 9</div>
        </div>
      </org-scroll-area>
      <ng-template #menu>
        <org-overlay-menu
          [items]="[
            { id: '1', label: 'Edit', icon: 'pencil' },
            { id: '2', label: 'Duplicate', icon: 'copy' },
            { id: '3', label: 'Archive', icon: 'inbox' },
          ]"
        />
      </ng-template>
    </div>
  `,
})
class OverlayMenuScrollBehaviorStory {
  // anchor lives inside an org-scroll-area; opening the menu and scrolling the inner area should keep
  // the menu attached to the trigger and scroll off-screen with it (instead of staying in viewport)
}

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every overlay menu axis — row states, post meta variants (shortcuts, sub-menu chevrons, Beta tag), sizing (short, base density, long-label wrapping), live anchored triggers (icon-only, button, avatar), in-context use (table-row overflow, right-click context menu), grouped dividers, and the aria-label hook.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Row states" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-start flex-wrap">
              <org-overlay-menu
                label="Default rows"
                [items]="[
                  { id: '1', label: 'Edit', icon: 'pencil' },
                  { id: '2', label: 'Duplicate', icon: 'copy' },
                  { id: '3', label: 'Archive', icon: 'inbox' }
                ]"
              />
              <org-overlay-menu
                label="With disabled row"
                [items]="[
                  { id: '1', label: 'Edit', icon: 'pencil' },
                  { id: '2', label: 'Duplicate', icon: 'copy', disabled: true },
                  { id: '3', label: 'Archive', icon: 'inbox' }
                ]"
              />
              <org-overlay-menu
                label="No icons"
                [items]="[
                  { id: '1', label: 'Rename', icon: null },
                  { id: '2', label: 'Move...', icon: null },
                  { id: '3', label: 'Pin to top', icon: null },
                  { id: '4', label: 'Delete', icon: null }
                ]"
              />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Default</strong>: Rows reuse the underlying list-item paint — \`:hover\`, \`:focus-visible\`, and \`data-active="1"\` (the keyboard cursor stamped by CDK) all read the same so mouse and keyboard interactions look identical</li>
            <li><strong>Disabled</strong>: An item with <code>disabled: true</code> paints muted, is skipped by CDK arrow-key navigation, and never fires <code>itemClicked</code></li>
            <li><strong>No icons</strong>: When every item omits its icon, labels left-align and the panel hugs the labels' width</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Post meta" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-start flex-wrap">
              <org-overlay-menu
                label="Edit history"
                [items]="[
                  { id: '1', label: 'Undo', icon: null, shortcut: '⌘ Z' },
                  { id: '2', label: 'Redo', icon: null, shortcut: '⇧ ⌘ Z' },
                  { id: 'd1', type: 'divider' },
                  { id: '3', label: 'Cut', icon: null, shortcut: '⌘ X' },
                  { id: '4', label: 'Copy', icon: 'copy', shortcut: '⌘ C' },
                  { id: '5', label: 'Paste', icon: null, shortcut: '⌘ V' }
                ]"
              />
              <org-overlay-menu
                label="View options"
                [items]="[
                  { id: '1', label: 'Grid view', icon: 'grid-2x2' },
                  { id: '2', label: 'List view', icon: 'list' },
                  { id: '3', label: 'Board', icon: 'rows-3', tag: { label: 'Beta', color: 'info' } },
                  { id: 'd1', type: 'divider' },
                  { id: '4', label: 'Filter by', icon: 'filter', postIcon: 'chevron-right' },
                  { id: '5', label: 'Sort by', icon: null, postIcon: 'chevron-right' }
                ]"
              />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Shortcut</strong>: <code>shortcut</code> renders as muted, tabular-numeral text in the post meta slot — long shortcuts (<code>⇧ ⌘ Z</code>) align cleanly against shorter ones (<code>⌘ Z</code>)</li>
            <li><strong>Sub-menu chevron</strong>: <code>postIcon: 'chevron-right'</code> hints that the row opens a sub-menu</li>
            <li><strong>Tag</strong>: <code>tag</code> renders an inline status pill (e.g. "Beta") at the right edge — color maps to a real <code>org-tag</code> color</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Sizing" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-start flex-wrap">
              <org-overlay-menu
                label="Short"
                [items]="[
                  { id: '1', label: 'Edit', icon: null },
                  { id: '2', label: 'Delete', icon: null }
                ]"
              />
              <org-overlay-menu
                label="Base size"
                listSize="base"
                [items]="[
                  { id: '1', label: 'Profile', icon: null },
                  { id: '2', label: 'Settings', icon: 'cog' },
                  { id: '3', label: 'Sign out', icon: 'log-out' }
                ]"
              />
              <org-overlay-menu
                label="Long labels"
                [items]="[
                  { id: '1', label: 'Move to another workspace…', icon: null },
                  { id: '2', label: 'Transfer ownership to a teammate', icon: 'users' },
                  { id: '3', label: 'Download as CSV', icon: 'download' }
                ]"
              />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Short</strong>: The panel hugs its content above the <code>11rem</code> minimum width</li>
            <li><strong>Base density</strong>: <code>listSize="base"</code> swaps every row to the larger size from List (taller padding, larger font)</li>
            <li><strong>Long labels</strong>: Labels wrap to the <code>20rem</code> max-width cap rather than blowing out the panel</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Anchored under a trigger" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-start flex-wrap">
              <org-button
                [orgOverlayMenuTrigger]="iconOnlyMenu"
                color="neutral"
                variant="ghost"
                preIcon="ellipsis"
                [iconOnly]="true"
                ariaLabel="More actions"
                label="More actions"
              />
              <ng-template #iconOnlyMenu>
                <org-overlay-menu
                  label="More actions"
                  [items]="[
                    { id: '1', label: 'Edit', icon: 'pencil' },
                    { id: '2', label: 'Duplicate', icon: 'copy' },
                    { id: 'd1', type: 'divider' },
                    { id: '3', label: 'Delete', icon: 'trash' }
                  ]"
                />
              </ng-template>

              <org-button
                [orgOverlayMenuTrigger]="sortMenu"
                color="neutral"
                variant="ghost"
                postIcon="chevron-down"
                label="Sort by"
              />
              <ng-template #sortMenu>
                <org-overlay-menu
                  label="Sort by"
                  [items]="[
                    { id: '1', label: 'Newest first', icon: null },
                    { id: '2', label: 'Oldest first', icon: null },
                    { id: '3', label: 'Alphabetical', icon: null }
                  ]"
                />
              </ng-template>

              <org-avatar
                [orgOverlayMenuTrigger]="avatarMenu"
                size="sm"
                label="Priya Shah"
                [showLabel]="true"
              />
              <ng-template #avatarMenu>
                <org-overlay-menu
                  label="Account"
                  [items]="[
                    { id: '1', label: 'Profile', icon: null },
                    { id: '2', label: 'Settings', icon: 'cog' },
                    { id: 'd1', type: 'divider' },
                    { id: '3', label: 'Sign out', icon: 'log-out' }
                  ]"
                />
              </ng-template>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Trigger ↔ panel</strong>: Click any trigger to toggle the menu; Esc closes; clicking outside closes; ↑ / ↓ moves the keyboard cursor; Enter activates a row</li>
            <li><strong>Icon-only trigger</strong>: An icon-only ellipsis button is the canonical "more actions" affordance</li>
            <li><strong>Post chevron</strong>: A button with a post chevron-down communicates that it opens a panel</li>
            <li><strong>Avatar trigger</strong>: Any element can carry <code>orgOverlayMenuTrigger</code> — including a real <code>org-avatar</code></li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Escape behavior" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-4 items-start flex-wrap">
              <org-button
                [orgOverlayMenuTrigger]="escapeDefaultMenu"
                color="primary"
                label="Closes on Escape (default)"
              />
              <ng-template #escapeDefaultMenu>
                <org-overlay-menu
                  label="Closes on Escape"
                  [items]="[
                    { id: '1', label: 'Edit', icon: 'pencil' },
                    { id: '2', label: 'Duplicate', icon: 'copy' },
                    { id: '3', label: 'Archive', icon: 'inbox' }
                  ]"
                />
              </ng-template>

              <org-button
                [orgOverlayMenuTrigger]="escapeDisabledMenu"
                [overlayMenuTriggerCloseOnEscape]="false"
                color="primary"
                label="Ignores Escape"
              />
              <ng-template #escapeDisabledMenu>
                <org-overlay-menu
                  label="Ignores Escape"
                  [items]="[
                    { id: '1', label: 'Edit', icon: 'pencil' },
                    { id: '2', label: 'Duplicate', icon: 'copy' },
                    { id: '3', label: 'Archive', icon: 'inbox' }
                  ]"
                />
              </ng-template>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Default</strong>: With <code>overlayMenuTriggerCloseOnEscape</code> omitted (defaults to <code>true</code>), pressing Escape while the menu is open dismisses the overlay regardless of where focus currently sits</li>
            <li><strong>Disabled</strong>: Setting <code>[overlayMenuTriggerCloseOnEscape]="false"</code> keeps the menu open when Escape is pressed — useful when the host view owns its own Escape semantics (e.g. closing a parent dialog)</li>
            <li>Click-outside dismissal still works in both cases</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="In context" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-4 w-full">
              <div class="flex flex-col gap-1 w-full max-w-md">
                <strong>Projects</strong>
                <div class="flex flex-col gap-1">
                  <div class="flex items-center justify-between gap-2 p-2 border border-default-color rounded-base">
                    <span>Aurora — Mobile redesign</span>
                    <div class="flex items-center gap-3">
                      <span class="text-muted">1,204 records</span>
                      <org-button
                        [orgOverlayMenuTrigger]="rowMenu"
                        color="neutral"
                        variant="ghost"
                        size="sm"
                        preIcon="ellipsis"
                        [iconOnly]="true"
                        ariaLabel="More actions"
                        label="More actions"
                      />
                    </div>
                  </div>
                  <div class="flex items-center justify-between gap-2 p-2 border border-default-color rounded-base">
                    <span>Beacon — Billing v2</span>
                    <div class="flex items-center gap-3">
                      <span class="text-muted">342 records</span>
                      <org-button
                        [orgOverlayMenuTrigger]="rowMenu"
                        color="neutral"
                        variant="ghost"
                        size="sm"
                        preIcon="ellipsis"
                        [iconOnly]="true"
                        ariaLabel="More actions"
                        label="More actions"
                      />
                    </div>
                  </div>
                  <div class="flex items-center justify-between gap-2 p-2 border border-default-color rounded-base">
                    <span>Cinder — Internal docs</span>
                    <div class="flex items-center gap-3">
                      <span class="text-muted">87 records</span>
                      <org-button
                        [orgOverlayMenuTrigger]="rowMenu"
                        color="neutral"
                        variant="ghost"
                        size="sm"
                        preIcon="ellipsis"
                        [iconOnly]="true"
                        ariaLabel="More actions"
                        label="More actions"
                      />
                    </div>
                  </div>
                </div>
                <ng-template #rowMenu>
                  <org-overlay-menu
                    label="Project actions"
                    [items]="[
                      { id: '1', label: 'Open', icon: null },
                      { id: '2', label: 'Rename', icon: 'pencil' },
                      { id: 'd1', type: 'divider' },
                      { id: '3', label: 'Archive', icon: 'inbox' },
                      { id: '4', label: 'Delete', icon: 'trash' }
                    ]"
                  />
                </ng-template>
              </div>

              <div
                [cdkContextMenuTriggerFor]="contextMenu"
                class="flex items-center justify-center w-full p-6 border border-default-color rounded-base text-muted"
                style="min-height: 8rem;"
              >
                Right-click anywhere on this surface
              </div>
              <ng-template #contextMenu>
                <org-overlay-menu
                  label="Context"
                  [items]="[
                    { id: '1', label: 'Cut', icon: null, shortcut: '⌘ X' },
                    { id: '2', label: 'Copy', icon: 'copy', shortcut: '⌘ C' },
                    { id: '3', label: 'Paste', icon: null, shortcut: '⌘ V' },
                    { id: 'd1', type: 'divider' },
                    { id: '4', label: 'Inspect', icon: null }
                  ]"
                />
              </ng-template>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Table-row overflow</strong>: An icon-only ellipsis button per row is the standard pattern for row-level "more actions" — each opens its own anchored menu via <code>orgOverlayMenuTrigger</code></li>
            <li><strong>Right-click surface</strong>: <code>cdkContextMenuTriggerFor</code> opens the menu at the pointer location for a native-feeling context menu</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Position fallbacks" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-3 flex-wrap">
              <story-example-overlay-menu position="below" />
              <story-example-overlay-menu position="above" />
              <story-example-overlay-menu position="before" />
              <story-example-overlay-menu position="after" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Below</strong> (default): Menu opens below the trigger</li>
            <li><strong>Above</strong>: Menu opens above the trigger</li>
            <li><strong>Before</strong>: Menu opens to the left of the trigger</li>
            <li><strong>After</strong>: Menu opens to the right of the trigger</li>
            <li>CDK adjusts automatically when there is not enough viewport space at the requested edge</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Aria label" />
          <org-design-system-demo-canvas slot="canvas">
            <org-overlay-menu
              label="Account actions"
              [items]="[
                { id: '1', label: 'Profile', icon: null },
                { id: '2', label: 'Settings', icon: 'cog' },
                { id: '3', label: 'Sign out', icon: 'log-out' }
              ]"
            />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The panel host carries <code>role="menu"</code> with <code>aria-label="Account actions"</code> from the <code>label</code> input</li>
            <li>Screen readers announce the menu name when the menu opens</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Position Flipping" />
          <org-design-system-demo-canvas slot="canvas">
            <story-overlay-menu-position-flip />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Each corner trigger requests its preferred position as a starting point only</li>
            <li><strong>Below / Above</strong>: When there isn't enough room on the primary axis, the panel flips to the opposite side of the trigger</li>
            <li><strong>Before / After</strong>: When there isn't enough room on the horizontal axis, the panel flips to the opposite side of the trigger</li>
            <li><strong>Cross-axis alignment</strong>: Near a side edge, the panel also flips its alignment (e.g. left-aligned → right-aligned) so it stays inside the viewport</li>
            <li>The four fallback candidates per anchor are owned by <code>[orgOverlayMenuTrigger]</code>; CDK Menu picks the first that fits and is also free to re-flip on scroll thanks to the directive's lock-position override</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Scroll Behavior" />
          <org-design-system-demo-canvas slot="canvas">
            <story-overlay-menu-scroll-behavior />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Open the menu, then scroll the inner <code>org-scroll-area</code> up or down</li>
            <li>The menu should stay attached to its trigger button and scroll along with it — including off-screen when the trigger leaves the viewport</li>
            <li>This relies on <code>org-scroll-area</code> registering its viewport with CDK's <code>ScrollDispatcher</code>, so the overlay's reposition scroll strategy reacts to inner-container scrolling</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        CdkContextMenuTrigger,
        OverlayMenuTriggerDirective,
        Avatar,
        Button,
        OverlayMenu,
        EXAMPLEOverlayMenu,
        OverlayMenuPositionFlipStory,
        OverlayMenuScrollBehaviorStory,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

export const MenuItemClicked: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the itemClicked output event emitting the selected OverlayMenuItem.',
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

@Component({
  selector: 'story-overlay-menu-extended',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OverlayMenu, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Section header"
          description="The optional uppercase header input renders above the first row."
        />
        <org-design-system-demo-canvas slot="canvas">
          <org-overlay-menu
            header="Projects"
            [items]="[
              { id: 'all', label: 'All projects', icon: null },
              { id: 'active', label: 'Active', icon: null, indicator: 12 },
              { id: 'archived', label: 'Archived', icon: null },
              { id: 'templates', label: 'Templates', icon: null },
            ]"
          />
        </org-design-system-demo-canvas>
      </org-design-system-demo>

      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Colored row"
          description="The color field paints both the icon and label so destructive actions stand out."
        />
        <org-design-system-demo-canvas slot="canvas">
          <org-overlay-menu
            [items]="[
              { id: 'edit', label: 'Edit', icon: 'pencil' },
              { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
              { id: 'd1', type: 'divider' },
              { id: 'delete', label: 'Delete', icon: 'trash', color: 'danger' },
            ]"
          />
        </org-design-system-demo-canvas>
      </org-design-system-demo>

      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Button-toggle entry"
          description="A button-toggle entry embeds an inline org-button-toggle that emits the entryValueChanged output."
        />
        <org-design-system-demo-canvas slot="canvas">
          <org-overlay-menu
            header="Appearance"
            [items]="appearanceItems()"
            (entryValueChanged)="onAppearanceChanged($event)"
          />
          <p>
            Theme: <strong>{{ theme() }}</strong>
          </p>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </div>
  `,
})
class OverlayMenuExtendedStory {
  protected readonly theme = signal<string>('dark');

  protected readonly appearanceItems = computed<OverlayMenuItem[]>(() => [
    {
      id: 'appearance',
      type: 'button-toggle',
      value: this.theme(),
      items: [
        { label: 'Light', value: 'light', buttonColor: 'neutral' },
        { label: 'Dark', value: 'dark', buttonColor: 'neutral' },
        { label: 'System', value: 'system', buttonColor: 'neutral' },
      ],
    },
  ]);

  protected onAppearanceChanged(event: OverlayMenuEntryValueChange): void {
    this.theme.set(event.value);
  }
}

export const ExtendedFeatures: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Showcases the four api additions — header input, color field on items (danger Sign out), numeric indicator post meta, and the button-toggle entry that emits entryValueChanged.',
      },
    },
  },
  render: () => ({
    template: `<story-overlay-menu-extended />`,
    moduleMetadata: {
      imports: [OverlayMenuExtendedStory],
    },
  }),
};
