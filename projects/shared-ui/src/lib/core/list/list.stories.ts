import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Meta, StoryObj } from '@storybook/angular';
import { List, type ListSize, type ListSelectMode, allListSizes, allListSelectModes } from './list';
import { ListItem } from './list-item';
import { ListItemIcon } from './list-item-icon';
import { ListItemImage } from './list-item-image';
import { Box } from '../box/box';
import { ButtonToggle, type ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Divider } from '../divider/divider';
import { EmptyIndicator } from '../empty-indicator/empty-indicator';
import { EmptyIndicatorIcon } from '../empty-indicator/empty-indicator-icon';
import { Indicator } from '../indicator/indicator';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';

type LiveDemoAsTag = 'static' | 'a' | 'button';

type LiveDemoPre = 'none' | 'icon' | 'image';

type LiveDemoPost = 'none' | 'icon';

const allLiveDemoAsTags = ['static', 'a', 'button'] as const;

const allLiveDemoPre = ['none', 'icon', 'image'] as const;

const allLiveDemoPost = ['none', 'icon'] as const;

const liveDemoSizeItems: ButtonToggleItem[] = allListSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

const liveDemoAsTagItems: ButtonToggleItem[] = allLiveDemoAsTags.map((value) => ({
  label: value,
  value,
  buttonColor: 'primary',
}));

const liveDemoPreItems: ButtonToggleItem[] = allLiveDemoPre.map((value) => ({
  label: value,
  value,
  buttonColor: 'primary',
}));

const liveDemoPostItems: ButtonToggleItem[] = allLiveDemoPost.map((value) => ({
  label: value,
  value,
  buttonColor: 'primary',
}));

const liveDemoSelectModeItems: ButtonToggleItem[] = allListSelectModes.map((mode) => ({
  label: mode,
  value: mode,
  buttonColor: 'primary',
}));

const liveDemoListItems = [
  { label: 'Inbox', imageSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Inbox', routerLink: '/inbox' },
  { label: 'Today', imageSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Today', routerLink: '/inbox/today' },
  { label: 'Archive', imageSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Archive', routerLink: '/archive' },
  { label: 'Spam', imageSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Spam', routerLink: '/spam' },
];

const liveDemoNavigatePaths = ['/', '/inbox', '/inbox/today', '/archive'] as const;

@Component({
  selector: 'story-list-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    ReactiveFormsModule,
    List,
    ListItem,
    ListItemIcon,
    ListItemImage,
    Box,
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
        align-items: center;
        justify-content: center;
        min-height: 14rem; /* 224px */
        width: 100%;
      }
      .list-wrapper {
        width: 16rem; /* 256px */
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Toggle the inputs to see every combination. asTag determines what the row renders as; clickable styling activates for a, button, or when forceClickable is set."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Size">
            <org-button-toggle [items]="sizeItems" formControlName="size" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="asTag">
            <org-button-toggle [items]="asTagItems" formControlName="asTag" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Pre">
            <org-button-toggle [items]="preItems" formControlName="pre" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Post">
            <org-button-toggle [items]="postItems" formControlName="post" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="selectMode">
            <org-button-toggle [items]="selectModeItems" formControlName="selectMode" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="isSelected">
            <org-checkbox-toggle name="live-demo-is-selected" value="isSelected" formControlName="isSelected">
              {{ liveDemoForm.controls.isSelected.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="disabled">
            <org-checkbox-toggle name="live-demo-disabled" value="disabled" formControlName="disabled">
              {{ liveDemoForm.controls.disabled.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="showAsExternal">
            <org-checkbox-toggle
              name="live-demo-is-external-href"
              value="showAsExternal"
              formControlName="showAsExternal"
            >
              {{ liveDemoForm.controls.showAsExternal.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="forceClickable">
            <org-checkbox-toggle
              name="live-demo-force-clickable"
              value="forceClickable"
              formControlName="forceClickable"
            >
              {{ liveDemoForm.controls.forceClickable.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="hideLabel">
            <org-checkbox-toggle name="live-demo-hide-label" value="hideLabel" formControlName="hideLabel">
              {{ liveDemoForm.controls.hideLabel.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Wrap in org-box">
            <org-checkbox-toggle name="live-demo-wrap-in-box" value="wrapInBox" formControlName="wrapInBox">
              {{ liveDemoForm.controls.wrapInBox.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="routerMatchExact">
            <org-checkbox-toggle
              name="live-demo-router-match-exact"
              value="routerMatchExact"
              formControlName="routerMatchExact"
            >
              {{ liveDemoForm.controls.routerMatchExact.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Navigate to (current: {{ currentUrl() }})">
            <div class="flex flex-row gap-2 flex-wrap">
              @for (path of navigatePaths; track path) {
                <button type="button" class="text-xs" (click)="onNavigate(path)">{{ path }}</button>
              }
            </div>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <div class="list-wrapper">
              @if (liveDemoForm.controls.wrapInBox.value) {
                <org-box>
                  <ng-container [ngTemplateOutlet]="listTemplate" />
                </org-box>
              } @else {
                <ng-container [ngTemplateOutlet]="listTemplate" />
              }
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>

    <ng-template #listTemplate>
      <org-list [size]="liveDemoForm.controls.size.value" [selectMode]="liveDemoForm.controls.selectMode.value">
        @for (item of items; track item.label; let first = $first) {
          <org-list-item
            [asTag]="liveDemoForm.controls.asTag.value === 'static' ? null : liveDemoForm.controls.asTag.value"
            [routerLink]="liveDemoForm.controls.asTag.value === 'a' ? item.routerLink : null"
            [routerMatchExact]="liveDemoForm.controls.routerMatchExact.value"
            [isSelected]="first && liveDemoForm.controls.isSelected.value"
            [disabled]="liveDemoForm.controls.disabled.value"
            [showAsExternal]="liveDemoForm.controls.showAsExternal.value"
            [forceClickable]="liveDemoForm.controls.forceClickable.value"
            [hideLabel]="liveDemoForm.controls.hideLabel.value"
            [label]="item.label"
            (clicked)="(undefined)"
          >
            @if (liveDemoForm.controls.pre.value === 'icon') {
              <org-list-item-icon pre name="mail" />
            }
            @if (liveDemoForm.controls.pre.value === 'image') {
              <org-list-item-image pre [src]="item.imageSrc" [alt]="item.label + ' avatar'" />
            }
            @if (liveDemoForm.controls.post.value === 'icon') {
              <org-list-item-icon post name="chevron-right" />
            }
          </org-list-item>
        }
      </org-list>
    </ng-template>
  `,
})
class ListLiveDemoStory {
  private readonly _router = inject(Router);

  protected readonly sizeItems = liveDemoSizeItems;
  protected readonly asTagItems = liveDemoAsTagItems;
  protected readonly preItems = liveDemoPreItems;
  protected readonly postItems = liveDemoPostItems;
  protected readonly selectModeItems = liveDemoSelectModeItems;
  protected readonly items = liveDemoListItems;
  protected readonly navigatePaths = liveDemoNavigatePaths;

  protected readonly currentUrl = signal<string>(this._router.url);

  protected readonly liveDemoForm = new FormGroup({
    size: new FormControl<ListSize>('base', { nonNullable: true }),
    asTag: new FormControl<LiveDemoAsTag>('static', { nonNullable: true }),
    pre: new FormControl<LiveDemoPre>('none', { nonNullable: true }),
    post: new FormControl<LiveDemoPost>('none', { nonNullable: true }),
    selectMode: new FormControl<ListSelectMode>('single', { nonNullable: true }),
    isSelected: new FormControl<boolean>(true, { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
    showAsExternal: new FormControl<boolean>(false, { nonNullable: true }),
    forceClickable: new FormControl<boolean>(false, { nonNullable: true }),
    hideLabel: new FormControl<boolean>(false, { nonNullable: true }),
    wrapInBox: new FormControl<boolean>(false, { nonNullable: true }),
    routerMatchExact: new FormControl<boolean>(false, { nonNullable: true }),
  });

  public constructor() {
    this._router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }

  protected onNavigate(path: string): void {
    this._router.navigateByUrl(path);
  }
}

const showcaseRouterPaths = ['/', '/products', '/products/123', '/settings'] as const;

@Component({
  selector: 'story-list-showcase-router-active',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [List, ListItem, ListItemIcon],
  styles: [
    `
      :host {
        display: block;
      }
      .current-url-strip {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        flex-wrap: wrap;
      }
    `,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <div class="current-url-strip">
        <span class="text-2xs uppercase letter-spacing-wide text-muted">Navigate:</span>
        @for (path of paths; track path) {
          <button type="button" class="text-xs" (click)="onNavigate(path)">{{ path }}</button>
        }
        <span class="text-2xs text-muted"
          >Current: <strong>{{ currentUrl() }}</strong></span
        >
      </div>

      <div class="grid grid-cols-2 gap-6 w-full">
        <div class="flex flex-col gap-2">
          <p class="text-2xs uppercase letter-spacing-wide text-muted">routerMatchExact = false (subset)</p>
          <org-list selectMode="single">
            <org-list-item asTag="a" routerLink="/products" label="Products">
              <org-list-item-icon pre name="package" />
            </org-list-item>
            <org-list-item asTag="a" routerLink="/products/123" label="Product 123">
              <org-list-item-icon pre name="package" />
            </org-list-item>
            <org-list-item asTag="a" routerLink="/settings" label="Settings">
              <org-list-item-icon pre name="settings" />
            </org-list-item>
          </org-list>
        </div>

        <div class="flex flex-col gap-2">
          <p class="text-2xs uppercase letter-spacing-wide text-muted">routerMatchExact = true (exact)</p>
          <org-list selectMode="single">
            <org-list-item asTag="a" routerLink="/products" [routerMatchExact]="true" label="Products">
              <org-list-item-icon pre name="package" />
            </org-list-item>
            <org-list-item asTag="a" routerLink="/products/123" [routerMatchExact]="true" label="Product 123">
              <org-list-item-icon pre name="package" />
            </org-list-item>
            <org-list-item asTag="a" routerLink="/settings" [routerMatchExact]="true" label="Settings">
              <org-list-item-icon pre name="settings" />
            </org-list-item>
          </org-list>
        </div>
      </div>
    </div>
  `,
})
class ListShowcaseRouterActiveSection {
  private readonly _router = inject(Router);

  protected readonly paths = showcaseRouterPaths;
  protected readonly currentUrl = signal<string>(this._router.url);

  public constructor() {
    this._router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }

  protected onNavigate(path: string): void {
    this._router.navigateByUrl(path);
  }
}

const meta: Meta<List> = {
  title: 'Core/Components/List',
  component: List,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## List Component

  A flexible list container component that displays list items in a vertical column layout, designed to work with the ListItem component.

  ### Composition Parts
  - **org-list** — parent wrapper providing shared \`size\` and \`listRole\` context to children
  - **org-list-item** — individual list row supporting anchor / button / div rendering, selected / disabled / clickable states, with a structured \`label\` input and \`pre\` / \`post\` content projection slots
  - **org-list-item-icon** — icon slotted via \`pre\` or \`post\` (must be used inside an \`org-list-item\`); size is inherited from the parent list item
  - **org-list-item-image** — image slotted via \`pre\` or \`post\` (must be used inside an \`org-list-item\`); size matches the icon footprint for the current list item size

  ### Features
  - Vertical flex column layout
  - No gap between items by default
  - Works with ListItem components
  - Supports sm and base size variants

  ### ListItem Features
  - Required \`label\` input renders the main text
  - Project \`<org-list-item-icon pre>\` / \`<org-list-item-icon post>\` to render icons before / after the label
  - Project \`<org-list-item-image pre>\` to render an image before the label
  - When \`showAsExternal\` is true, the post-icon is automatically overridden to \`arrow-up-right\`
  - \`hideLabel\` visually hides the label while keeping it accessible to screen readers
  - Conditionally clickable — only shows cursor and hover when a click listener is attached
  - Hover background color change (neutral subtle) when clickable
  - Selected state with primary subtle background
  - Content centered using flexbox
  - Accessible with focus states

  ### Usage Examples
  \`\`\`html
  <!-- Basic list (non-clickable items) -->
  <org-list>
    <org-list-item label="Item 1" />
    <org-list-item label="Item 2" />
    <org-list-item label="Item 3" />
  </org-list>

  <!-- List with selected items -->
  <org-list>
    <org-list-item label="Selected Item" [isSelected]="true" />
    <org-list-item label="Normal Item" />
  </org-list>

  <!-- With click handler (clickable items) -->
  <org-list>
    <org-list-item asTag="button" label="Clickable Item" (clicked)="onClick()" />
  </org-list>

  <!-- With pre / post icons via content projection -->
  <org-list>
    <org-list-item label="Item with pre icon">
      <org-list-item-icon pre name="arrow-down" />
    </org-list-item>
    <org-list-item label="Item with post icon">
      <org-list-item-icon post name="arrow-right" />
    </org-list-item>
    <org-list-item label="Inbox">
      <org-list-item-icon pre name="mail" />
      <org-list-item-icon post name="chevron-right" />
    </org-list-item>
  </org-list>

  <!-- With image via content projection -->
  <org-list>
    <org-list-item label="Item with image">
      <org-list-item-image pre src="path/to/image.jpg" alt="User avatar" />
    </org-list-item>
  </org-list>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<List>;

export const Default: Story = {
  args: {},
  argTypes: {},
  parameters: {
    docs: {
      description: {
        story: 'Default list with basic items. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-list>
        <org-list-item label="List Item 1" />
        <org-list-item label="List Item 2" />
        <org-list-item label="List Item 3" />
      </org-list>
    `,
    moduleMetadata: {
      imports: [List, ListItem],
    },
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to drive every visual input on the list (size, asTag, pre, post, select mode, isSelected, disabled, showAsExternal, forceClickable, hideLabel, wrap in box) and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: `<story-list-live-demo />`,
    moduleMetadata: {
      imports: [ListLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every list axis — item states, empty state handoff, real-world usage contexts, dividers between rows, outer border via org-box, and size variants — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <!-- ITEM STATES -->
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Item states"
            description="Every visual state a list item can be in. Hover and focus-visible states are live — point or tab onto a row to see them."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="grid grid-cols-2 gap-6 w-full">
              <div class="flex flex-col gap-2">
                <p class="text-2xs uppercase letter-spacing-wide text-muted">Default · Static</p>
                <org-list>
                  <org-list-item label="Plain row, no interaction" />
                  <org-list-item label="Another static row" />
                </org-list>
              </div>

              <div class="flex flex-col gap-2">
                <p class="text-2xs uppercase letter-spacing-wide text-muted">Clickable · Hover / Focus / Active are live</p>
                <org-list>
                  <org-list-item asTag="button" label="Button row" (clicked)="undefined" />
                  <org-list-item asTag="a" href="#" label="Anchor row" />
                  <org-list-item asTag="button" label="Tab here for focus ring" (clicked)="undefined" />
                </org-list>
              </div>

              <div class="flex flex-col gap-2">
                <p class="text-2xs uppercase letter-spacing-wide text-muted">Selected</p>
                <org-list selectMode="single">
                  <org-list-item asTag="button" label="Inbox" (clicked)="undefined" />
                  <org-list-item asTag="button" label="Drafts" [isSelected]="true" (clicked)="undefined" />
                  <org-list-item asTag="button" label="Sent" (clicked)="undefined" />
                </org-list>
              </div>

              <div class="flex flex-col gap-2">
                <p class="text-2xs uppercase letter-spacing-wide text-muted">Disabled</p>
                <org-list>
                  <org-list-item asTag="button" label="Available action" (clicked)="undefined" />
                  <org-list-item asTag="button" label="Unavailable action" [disabled]="true" (clicked)="undefined" />
                  <org-list-item asTag="button" label="Available action" (clicked)="undefined" />
                </org-list>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <!-- ROUTER-ACTIVE MATCHING -->
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Router-active matching"
            description="When asTag=a and routerLink is set, the brain reads the Angular router state and reflects active styling. routerMatchExact toggles between subset (default — any url that starts with the routerLink) and exact (only when the url equals the routerLink) matching. Click a navigate button to see the difference live."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-list-showcase-router-active />
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <!-- EMPTY STATE -->
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Empty state"
            description="When a list has zero rows, swap it for an org-empty-indicator. Keep the surrounding frame the same so the panel doesn't shift size — only the contents change."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="grid grid-cols-2 gap-6 w-full">
              <div class="flex flex-col gap-2">
                <p class="text-2xs uppercase letter-spacing-wide text-muted">List · With rows</p>
                <org-box [padding]="'none'">
                  <org-list>
                    <org-list-item label="Aurora landing page">
                      <org-list-item-icon pre name="folder" />
                    </org-list-item>
                    <org-list-item label="Internal tooling rewrite">
                      <org-list-item-icon pre name="folder" />
                    </org-list-item>
                    <org-list-item label="Quarterly review deck">
                      <org-list-item-icon pre name="folder" />
                    </org-list-item>
                  </org-list>
                </org-box>
              </div>

              <div class="flex flex-col gap-2">
                <p class="text-2xs uppercase letter-spacing-wide text-muted">List · Zero rows → EmptyIndicator</p>
                <org-empty-indicator
                  header="No projects yet"
                  description="Create your first project to get started."
                  actionLabel="Create project"
                  (actionTriggered)="onCreateProject()"
                >
                  <org-empty-indicator-icon name="folder" />
                </org-empty-indicator>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <!-- IN CONTEXT -->
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="In context"
            description="Five realistic uses. Notice that all of them are built from the same primitives — only the pre slot, label, and meta change."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="grid grid-cols-2 gap-6 w-full">
              <div class="flex flex-col gap-2">
                <p class="text-2xs uppercase letter-spacing-wide text-muted">Sidebar navigation</p>
                <org-list selectMode="single">
                  <org-list-item asTag="button" label="Home" (clicked)="undefined">
                    <org-list-item-icon pre name="house" />
                  </org-list-item>
                  <org-list-item asTag="button" label="Inbox" [isSelected]="true" (clicked)="undefined">
                    <org-list-item-icon pre name="mail" />
                    <org-indicator post color="neutral" [number]="12" />
                  </org-list-item>
                  <org-list-item asTag="button" label="Calendar" (clicked)="undefined">
                    <org-list-item-icon pre name="calendar" />
                  </org-list-item>
                  <org-list-item asTag="button" label="Documents" (clicked)="undefined">
                    <org-list-item-icon pre name="file-text" />
                    <org-indicator post color="danger" ariaLabel="Unread documents" />
                  </org-list-item>
                  <org-list-item asTag="button" label="Team" (clicked)="undefined">
                    <org-list-item-icon pre name="users" />
                  </org-list-item>
                </org-list>
              </div>

              <div class="flex flex-col gap-2">
                <p class="text-2xs uppercase letter-spacing-wide text-muted">Settings menu (no pre icons)</p>
                <org-box [padding]="'none'">
                  <org-list selectMode="single">
                    <org-list-item asTag="button" label="General" (clicked)="undefined" />
                    <org-list-item asTag="button" label="Members &amp; permissions" [isSelected]="true" (clicked)="undefined" />
                    <org-list-item asTag="button" label="Billing" (clicked)="undefined" />
                    <org-list-item asTag="button" label="Security" (clicked)="undefined" />
                    <org-list-item asTag="button" label="API tokens" (clicked)="undefined" />
                  </org-list>
                </org-box>
              </div>

              <div class="flex flex-col gap-2">
                <p class="text-2xs uppercase letter-spacing-wide text-muted">Search results · ListItemImage</p>
                <org-box [padding]="'none'">
                  <org-list>
                    <org-list-item asTag="button" label="Sarah Chen" (clicked)="undefined">
                      <org-list-item-image pre src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah Chen avatar" />
                      <span post class="text-faint">Engineering</span>
                    </org-list-item>
                    <org-list-item asTag="button" label="Marcus Holt" (clicked)="undefined">
                      <org-list-item-image pre src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" alt="Marcus Holt avatar" />
                      <span post class="text-faint">Design</span>
                    </org-list-item>
                    <org-list-item asTag="button" label="Aisha Patel" (clicked)="undefined">
                      <org-list-item-image pre src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha" alt="Aisha Patel avatar" />
                      <span post class="text-faint">Product</span>
                    </org-list-item>
                    <org-list-item asTag="button" label="Diego Ramirez" (clicked)="undefined">
                      <org-list-item-image pre src="https://api.dicebear.com/7.x/avataaars/svg?seed=Diego" alt="Diego Ramirez avatar" />
                      <span post class="text-faint">Sales</span>
                    </org-list-item>
                  </org-list>
                </org-box>
              </div>

              <div class="flex flex-col gap-2">
                <p class="text-2xs uppercase letter-spacing-wide text-muted">Action menu · button items</p>
                <org-box [padding]="'none'">
                  <org-list>
                    <org-list-item asTag="button" label="Copy link" (clicked)="undefined">
                      <org-list-item-icon pre name="copy" />
                    </org-list-item>
                    <org-list-item asTag="button" label="Duplicate" (clicked)="undefined">
                      <org-list-item-icon pre name="package" />
                    </org-list-item>
                    <org-list-item asTag="button" label="Rename" (clicked)="undefined">
                      <org-list-item-icon pre name="pencil" />
                    </org-list-item>
                    <org-divider />
                    <org-list-item asTag="button" label="Move to archive" [disabled]="true" (clicked)="undefined">
                      <org-list-item-icon pre name="download" />
                    </org-list-item>
                    <org-list-item asTag="button" label="Delete" (clicked)="undefined">
                      <org-list-item-icon pre name="trash" />
                    </org-list-item>
                  </org-list>
                </org-box>
              </div>

              <div class="flex flex-col gap-2 col-span-2">
                <p class="text-2xs uppercase letter-spacing-wide text-muted">Plain data list · static rows, no asTag</p>
                <org-box [padding]="'none'">
                  <org-list>
                    <org-list-item label="Authentication service">
                      <span post class="text-faint">v4.12.1 · deployed 2h ago</span>
                    </org-list-item>
                    <org-divider />
                    <org-list-item label="Payments service">
                      <span post class="text-faint">v2.8.3 · deployed 6h ago</span>
                    </org-list-item>
                    <org-divider />
                    <org-list-item label="Notifications service">
                      <span post class="text-faint">v1.4.0 · deployed 1d ago</span>
                    </org-list-item>
                    <org-divider />
                    <org-list-item label="Search service">
                      <span post class="text-faint">v3.0.0-rc.2 · deployed 3d ago</span>
                    </org-list-item>
                  </org-list>
                </org-box>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <!-- DIVIDERS BETWEEN ITEMS -->
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Dividers between items"
            description="Need separators? Drop an org-divider between rows. The list component owns no separator CSS of its own — the divider component handles it."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex justify-center w-full">
              <org-box [padding]="'none'" class="w-2xs">
                <org-list>
                  <org-list-item asTag="button" label="Profile" (clicked)="undefined">
                    <org-list-item-icon pre name="users" />
                  </org-list-item>
                  <org-list-item asTag="button" label="Account" (clicked)="undefined">
                    <org-list-item-icon pre name="lock-keyhole" />
                  </org-list-item>
                  <org-divider />
                  <org-list-item asTag="button" label="Workspace" (clicked)="undefined">
                    <org-list-item-icon pre name="package" />
                  </org-list-item>
                  <org-list-item asTag="button" label="Members" (clicked)="undefined">
                    <org-list-item-icon pre name="users" />
                  </org-list-item>
                  <org-divider />
                  <org-list-item asTag="a" href="https://example.com" [showAsExternal]="true" label="Help &amp; docs">
                    <org-list-item-icon pre name="circle-help" />
                  </org-list-item>
                  <org-list-item asTag="button" label="Sign out" (clicked)="undefined">
                    <org-list-item-icon pre name="log-out" />
                  </org-list-item>
                </org-list>
              </org-box>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <!-- BORDER -->
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Border"
            description="No border prop on the list itself — when you need an outer frame, wrap the list in an org-box with padding=&quot;none&quot;. This keeps borders consistent with every other component on the page."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="grid grid-cols-2 gap-6 w-full">
              <div class="flex flex-col gap-2">
                <p class="text-2xs uppercase letter-spacing-wide text-muted">No outer border</p>
                <org-list selectMode="single">
                  <org-list-item asTag="button" label="General" (clicked)="undefined">
                    <org-list-item-icon pre name="settings" />
                  </org-list-item>
                  <org-list-item asTag="button" label="Members" [isSelected]="true" (clicked)="undefined">
                    <org-list-item-icon pre name="users" />
                  </org-list-item>
                  <org-list-item asTag="button" label="Billing" (clicked)="undefined">
                    <org-list-item-icon pre name="credit-card" />
                  </org-list-item>
                  <org-list-item asTag="button" label="Notifications" (clicked)="undefined">
                    <org-list-item-icon pre name="notification" />
                  </org-list-item>
                </org-list>
              </div>

              <div class="flex flex-col gap-2">
                <p class="text-2xs uppercase letter-spacing-wide text-muted">Wrapped in org-box (bordered, padding=none)</p>
                <org-box [padding]="'none'">
                  <org-list selectMode="single">
                    <org-list-item asTag="button" label="General" (clicked)="undefined">
                      <org-list-item-icon pre name="settings" />
                    </org-list-item>
                    <org-list-item asTag="button" label="Members" [isSelected]="true" (clicked)="undefined">
                      <org-list-item-icon pre name="users" />
                    </org-list-item>
                    <org-list-item asTag="button" label="Billing" (clicked)="undefined">
                      <org-list-item-icon pre name="credit-card" />
                    </org-list-item>
                    <org-list-item asTag="button" label="Notifications" (clicked)="undefined">
                      <org-list-item-icon pre name="notification" />
                    </org-list-item>
                  </org-list>
                </org-box>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <!-- SIZE -->
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Size"
            description="sm (default) is the dense nav size. base trades density for legibility — used in settings and reading-heavy lists."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="grid grid-cols-2 gap-6 w-full">
              <div class="flex flex-col gap-2">
                <p class="text-2xs uppercase letter-spacing-wide text-muted">sm (default)</p>
                <org-list selectMode="single">
                  <org-list-item asTag="button" label="Inbox" (clicked)="undefined">
                    <org-list-item-icon pre name="mail" />
                  </org-list-item>
                  <org-list-item asTag="button" label="Calendar" (clicked)="undefined">
                    <org-list-item-icon pre name="calendar" />
                  </org-list-item>
                  <org-list-item asTag="button" label="Drafts" [isSelected]="true" (clicked)="undefined">
                    <org-list-item-icon pre name="file-text" />
                  </org-list-item>
                  <org-list-item asTag="button" label="Archive" (clicked)="undefined">
                    <org-list-item-icon pre name="package" />
                  </org-list-item>
                </org-list>
              </div>

              <div class="flex flex-col gap-2">
                <p class="text-2xs uppercase letter-spacing-wide text-muted">base</p>
                <org-list size="base" selectMode="single">
                  <org-list-item asTag="button" label="Inbox" (clicked)="undefined">
                    <org-list-item-icon pre name="mail" />
                  </org-list-item>
                  <org-list-item asTag="button" label="Calendar" (clicked)="undefined">
                    <org-list-item-icon pre name="calendar" />
                  </org-list-item>
                  <org-list-item asTag="button" label="Drafts" [isSelected]="true" (clicked)="undefined">
                    <org-list-item-icon pre name="file-text" />
                  </org-list-item>
                  <org-list-item asTag="button" label="Archive" (clicked)="undefined">
                    <org-list-item-icon pre name="package" />
                  </org-list-item>
                </org-list>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>

        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Item states</strong>: rows are static unless they have a click target (button/anchor/forceClickable); selected and disabled are independent of clickable</li>
            <li><strong>Empty state</strong>: when zero rows, swap the list for an org-empty-indicator — keep the surrounding frame so the panel doesn't shift</li>
            <li><strong>In context</strong>: every example reuses the same org-list / org-list-item primitives — only the projected pre/post slots and label change</li>
            <li><strong>Dividers</strong>: separators come from a projected org-divider — list owns no separator CSS</li>
            <li><strong>Border</strong>: no border input on org-list — wrap in an org-box with padding=&quot;none&quot;</li>
            <li><strong>Size</strong>: sm is the dense default; base is for reading-heavy lists</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    props: {
      onCreateProject: () => {
        console.log('create project clicked');
      },
    },
    moduleMetadata: {
      imports: [
        List,
        ListItem,
        ListItemIcon,
        ListItemImage,
        Box,
        Divider,
        EmptyIndicator,
        EmptyIndicatorIcon,
        Indicator,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
        ListShowcaseRouterActiveSection,
      ],
    },
  }),
};
