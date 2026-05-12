import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { IconName } from '../../brain/icon-brain/icon-brain';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Card } from '../card/card';
import { CardContent } from '../card/card-content';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { Tag } from '../tag/tag';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { Tabs, TabsSize, TabsVariant, allTabsSizes, allTabsVariants } from './tabs';
import { Tab } from './tab';

const liveDemoVariantItems: ButtonToggleItem[] = allTabsVariants.map((variant) => ({
  label: variant,
  value: variant,
  buttonColor: 'primary',
}));

const liveDemoSizeItems: ButtonToggleItem[] = allTabsSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

const allLiveDemoTabsCounts = ['2', '3', '4', '5', '6'] as const;

type LiveDemoTabsCount = (typeof allLiveDemoTabsCounts)[number];

const liveDemoTabsCountItems: ButtonToggleItem[] = allLiveDemoTabsCounts.map((count) => ({
  label: count,
  value: count,
  buttonColor: 'primary',
}));

type LiveDemoTabConfig = {
  value: string;
  label: string;
  icon: IconName;
  count: string;
};

const liveDemoTabConfigs: LiveDemoTabConfig[] = [
  { value: 'overview', label: 'Overview', icon: 'grid-2x2', count: '12' },
  { value: 'activity', label: 'Activity', icon: 'list', count: '48' },
  { value: 'members', label: 'Members', icon: 'users', count: '6' },
  { value: 'alerts', label: 'Alerts', icon: 'notification', count: '3' },
  { value: 'history', label: 'History', icon: 'clock', count: '21' },
  { value: 'settings', label: 'Settings', icon: 'settings', count: '4' },
];

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

  A horizontal row of tab triggers used to switch between sibling views. The tabs strip itself
  is purely a navigation widget — when the active value changes, the parent component owns
  rendering whatever content corresponds to that value.

  ### Features
  - Three visual variants — \`underline\` (default), \`pills\`, \`enclosed\`.
  - Three sizes — \`sm\`, \`base\` (default), \`lg\`.
  - \`stretch\` mode that fills the row equally for segmented-control style pickers.
  - Per-tab \`closable\` affordance; close on click or Delete / Backspace.
  - Optional \`scrollable\` mode with chevron navigation buttons for overflow.
  - Single keyboard tab-stop tablist; ←/→ + Home/End move selection (selection follows focus); disabled tabs are still focusable so screen readers can announce them.

  ### Usage Examples
  \`\`\`html
  <!-- basic underline tabs -->
  <org-tabs [(value)]="activeTab">
    <org-tab value="home">Home</org-tab>
    <org-tab value="profile">Profile</org-tab>
    <org-tab value="settings">Settings</org-tab>
  </org-tabs>

  <!-- pills tabs at lg size -->
  <org-tabs [(value)]="activeTab" variant="pills" size="lg">
    <org-tab value="all">All</org-tab>
    <org-tab value="open">Open</org-tab>
    <org-tab value="closed">Closed</org-tab>
  </org-tabs>

  <!-- enclosed (folder) tabs -->
  <org-tabs [(value)]="activeTab" variant="enclosed">
    <org-tab value="editor">Editor</org-tab>
    <org-tab value="preview">Preview</org-tab>
  </org-tabs>

  <!-- segmented-control style with stretch -->
  <org-tabs [(value)]="period" variant="pills" [stretch]="true">
    <org-tab value="day">Day</org-tab>
    <org-tab value="week">Week</org-tab>
    <org-tab value="month">Month</org-tab>
  </org-tabs>

  <!-- closable tabs -->
  <org-tabs [(value)]="active">
    <org-tab value="readme" [closable]="true" (closed)="closeTab($event)">README.md</org-tab>
    <org-tab value="tokens" [closable]="true" (closed)="closeTab($event)">tokens.css</org-tab>
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
    variant: 'underline',
    size: 'base',
    stretch: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['underline', 'pills', 'enclosed'],
      description: 'The visual variant of the tabs strip',
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'The size variant of the tabs strip',
    },
    stretch: {
      control: 'boolean',
      description: 'Whether the tabs fill the row equally (segmented-control style)',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default tabs strip with the full set of controls. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => {
    const activeTab = signal('home');

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
          [variant]="variant"
          [size]="size"
          [stretch]="stretch"
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

@Component({
  selector: 'story-tabs-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Tabs,
    Tab,
    Icon,
    Tag,
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
        align-items: stretch;
        justify-content: stretch;
        min-height: 6rem; /* 96px */
      }
      .canvas-stage > org-tabs {
        flex: 1 1 auto;
        min-width: 0;
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="The tabs below are real and interactive — click any tab or use ←/→ + Home/End to walk the strip; toggle the controls to drive every visible state."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Variant">
            <org-button-toggle [items]="variantItems" formControlName="variant" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Size">
            <org-button-toggle [items]="sizeItems" formControlName="size" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Tabs">
            <org-button-toggle [items]="tabsCountItems" formControlName="tabsCount" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Icons">
            <org-checkbox-toggle name="live-demo-icons" value="icons" formControlName="icons">
              {{ liveDemoForm.controls.icons.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Counts">
            <org-checkbox-toggle name="live-demo-counts" value="counts" formControlName="counts">
              {{ liveDemoForm.controls.counts.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Stretch">
            <org-checkbox-toggle name="live-demo-stretch" value="stretch" formControlName="stretch">
              {{ liveDemoForm.controls.stretch.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Last tab disabled">
            <org-checkbox-toggle name="live-demo-last-disabled" value="last-disabled" formControlName="lastTabDisabled">
              {{ liveDemoForm.controls.lastTabDisabled.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Closable">
            <org-checkbox-toggle name="live-demo-closable" value="closable" formControlName="closable">
              {{ liveDemoForm.controls.closable.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-tabs
              [value]="activeValue()"
              [variant]="liveDemoForm.controls.variant.value"
              [size]="liveDemoForm.controls.size.value"
              [stretch]="liveDemoForm.controls.stretch.value"
              (valueChange)="onValueChange($event)"
            >
              @for (tab of visibleTabs(); track tab.value; let last = $last) {
                <org-tab
                  [value]="tab.value"
                  [disabled]="liveDemoForm.controls.lastTabDisabled.value && last"
                  [closable]="liveDemoForm.controls.closable.value"
                  (closed)="onTabClosed($event)"
                >
                  @if (liveDemoForm.controls.icons.value) {
                    <org-icon [name]="tab.icon" size="sm" />
                  }
                  {{ tab.label }}
                  @if (liveDemoForm.controls.counts.value) {
                    <org-tag color="neutral" size="sm">{{ tab.count }}</org-tag>
                  }
                </org-tab>
              }
            </org-tabs>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class TabsLiveDemoStory {
  protected readonly variantItems = liveDemoVariantItems;
  protected readonly sizeItems = liveDemoSizeItems;
  protected readonly tabsCountItems = liveDemoTabsCountItems;

  protected readonly liveDemoForm = new FormGroup({
    variant: new FormControl<TabsVariant>('underline', { nonNullable: true }),
    size: new FormControl<TabsSize>('base', { nonNullable: true }),
    tabsCount: new FormControl<LiveDemoTabsCount>('4', { nonNullable: true }),
    icons: new FormControl<boolean>(true, { nonNullable: true }),
    counts: new FormControl<boolean>(true, { nonNullable: true }),
    stretch: new FormControl<boolean>(false, { nonNullable: true }),
    lastTabDisabled: new FormControl<boolean>(false, { nonNullable: true }),
    closable: new FormControl<boolean>(false, { nonNullable: true }),
  });

  protected readonly activeValue = signal<string>(liveDemoTabConfigs[0].value);

  protected visibleTabs(): LiveDemoTabConfig[] {
    const count = parseInt(this.liveDemoForm.controls.tabsCount.value, 10);

    return liveDemoTabConfigs.slice(0, count);
  }

  protected onValueChange(value: string): void {
    console.log('live-demo tab selected:', value);
    this.activeValue.set(value);
  }

  protected onTabClosed(value: string): void {
    console.log('live-demo tab closed:', value);
  }
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Drive every visible aspect of the tabs strip from the controls and walk through the live result with mouse or keyboard.',
      },
    },
  },
  render: () => ({
    template: `<story-tabs-live-demo />`,
    moduleMetadata: {
      imports: [TabsLiveDemoStory],
    },
  }),
};

@Component({
  selector: 'story-tabs-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tabs, Tab],
  template: `
    <div class="flex flex-col gap-4">
      <org-tabs [value]="anatomyValue()" (valueChange)="anatomyValue.set($event)">
        <org-tab value="overview">Overview</org-tab>
        <org-tab value="activity">Activity</org-tab>
        <org-tab value="members">Members</org-tab>
        <org-tab value="settings">Settings</org-tab>
      </org-tabs>
      <p>
        Active value: <strong>{{ anatomyValue() }}</strong>
      </p>
    </div>
  `,
})
class TabsAnatomyShowcase {
  protected readonly anatomyValue = signal<string>('overview');
}

@Component({
  selector: 'story-tabs-variants',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tabs, Tab],
  template: `
    <div class="flex flex-col gap-4">
      <org-tabs [value]="underlineValue()" (valueChange)="underlineValue.set($event)" variant="underline">
        <org-tab value="overview">Overview</org-tab>
        <org-tab value="activity">Activity</org-tab>
        <org-tab value="members">Members</org-tab>
        <org-tab value="settings">Settings</org-tab>
      </org-tabs>
      <org-tabs [value]="pillsValue()" (valueChange)="pillsValue.set($event)" variant="pills">
        <org-tab value="all">All</org-tab>
        <org-tab value="open">Open</org-tab>
        <org-tab value="review">In review</org-tab>
        <org-tab value="closed">Closed</org-tab>
      </org-tabs>
      <org-tabs [value]="enclosedValue()" (valueChange)="enclosedValue.set($event)" variant="enclosed">
        <org-tab value="editor">Editor</org-tab>
        <org-tab value="preview">Preview</org-tab>
        <org-tab value="history">History</org-tab>
      </org-tabs>
    </div>
  `,
})
class TabsVariantsShowcase {
  protected readonly underlineValue = signal<string>('overview');
  protected readonly pillsValue = signal<string>('all');
  protected readonly enclosedValue = signal<string>('editor');
}

@Component({
  selector: 'story-tabs-sizes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tabs, Tab],
  template: `
    <div class="flex flex-col gap-4">
      <org-tabs [value]="smValue()" (valueChange)="smValue.set($event)" size="sm">
        <org-tab value="overview">Overview</org-tab>
        <org-tab value="activity">Activity</org-tab>
        <org-tab value="members">Members</org-tab>
      </org-tabs>
      <org-tabs [value]="baseValue()" (valueChange)="baseValue.set($event)" size="base">
        <org-tab value="overview">Overview</org-tab>
        <org-tab value="activity">Activity</org-tab>
        <org-tab value="members">Members</org-tab>
      </org-tabs>
      <org-tabs [value]="lgValue()" (valueChange)="lgValue.set($event)" size="lg">
        <org-tab value="overview">Overview</org-tab>
        <org-tab value="activity">Activity</org-tab>
        <org-tab value="members">Members</org-tab>
      </org-tabs>
    </div>
  `,
})
class TabsSizesShowcase {
  protected readonly smValue = signal<string>('overview');
  protected readonly baseValue = signal<string>('overview');
  protected readonly lgValue = signal<string>('overview');
}

@Component({
  selector: 'story-tabs-icons-counts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tabs, Tab, Icon, Tag],
  template: `
    <org-tabs [value]="value()" (valueChange)="value.set($event)">
      <org-tab value="overview">
        <org-icon name="grid-2x2" size="sm" />
        Overview
      </org-tab>
      <org-tab value="activity">
        Activity
        <org-tag color="neutral" size="sm">12</org-tag>
      </org-tab>
      <org-tab value="members">
        <org-icon name="users" size="sm" />
        Members
        <org-tag color="neutral" size="sm">48</org-tag>
      </org-tab>
      <org-tab value="alerts">
        <org-icon name="notification" size="sm" />
        Alerts
        <org-tag color="danger" size="sm">3</org-tag>
      </org-tab>
      <org-tab value="audit" [disabled]="true">
        <org-icon name="lock" size="sm" />
        Audit log
      </org-tab>
    </org-tabs>
  `,
})
class TabsIconsCountsShowcase {
  protected readonly value = signal<string>('overview');
}

@Component({
  selector: 'story-tabs-stretch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tabs, Tab],
  styles: [
    `
      .stretch-row {
        width: 18rem; /* 288px */
      }
    `,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <div class="stretch-row">
        <org-tabs [value]="periodValue()" (valueChange)="periodValue.set($event)" variant="pills" [stretch]="true">
          <org-tab value="day">Daily</org-tab>
          <org-tab value="week">Weekly</org-tab>
          <org-tab value="month">Monthly</org-tab>
          <org-tab value="year">Yearly</org-tab>
        </org-tabs>
      </div>
      <div class="stretch-row">
        <org-tabs [value]="authValue()" (valueChange)="authValue.set($event)" [stretch]="true">
          <org-tab value="signin">Sign in</org-tab>
          <org-tab value="signup">Create account</org-tab>
        </org-tabs>
      </div>
    </div>
  `,
})
class TabsStretchShowcase {
  protected readonly periodValue = signal<string>('day');
  protected readonly authValue = signal<string>('signin');
}

@Component({
  selector: 'story-tabs-closable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tabs, Tab, Icon],
  template: `
    <org-tabs [value]="activeValue()" (valueChange)="activeValue.set($event)">
      @for (tab of openTabs(); track tab.value) {
        <org-tab [value]="tab.value" [closable]="true" (closed)="onClose(tab.value)">
          <org-icon [name]="tab.icon" size="sm" />
          {{ tab.label }}
        </org-tab>
      }
    </org-tabs>
  `,
})
class TabsClosableShowcase {
  protected readonly openTabs = signal<{ value: string; label: string; icon: IconName }[]>([
    { value: 'readme', label: 'README.md', icon: 'file-text' },
    { value: 'tokens', label: 'tokens.css', icon: 'file-text' },
    { value: 'tabs', label: 'tabs.css', icon: 'file-text' },
    { value: 'hero', label: 'hero.png', icon: 'image' },
  ]);

  protected readonly activeValue = signal<string>('readme');

  protected onClose(value: string): void {
    const remaining = this.openTabs().filter((tab) => tab.value !== value);

    this.openTabs.set(remaining);

    if (this.activeValue() !== value || remaining.length === 0) {
      return;
    }

    const previousIndex = this.openTabs().findIndex((tab) => tab.value === value);
    const fallback = remaining[Math.min(previousIndex, remaining.length - 1)] ?? remaining[0];

    this.activeValue.set(fallback.value);
  }
}

@Component({
  selector: 'story-tabs-inside-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tabs, Tab, Tag, Card, CardContent],
  template: `
    <org-card>
      <org-card-content>
        <div class="flex flex-col gap-2">
          <org-tabs [value]="value()" (valueChange)="value.set($event)">
            <org-tab value="details">Details</org-tab>
            <org-tab value="comments">
              Comments
              <org-tag color="neutral" size="sm">7</org-tag>
            </org-tab>
            <org-tab value="activity">Activity</org-tab>
          </org-tabs>
          <p>
            Active panel: <strong>{{ value() }}</strong>
          </p>
        </div>
      </org-card-content>
    </org-card>
  `,
})
class TabsInsideCardShowcase {
  protected readonly value = signal<string>('details');
}

@Component({
  selector: 'story-tabs-scrollable-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tabs, Tab],
  styles: [
    `
      .scroll-shell {
        width: 18rem; /* 288px */
      }
    `,
  ],
  template: `
    <div class="scroll-shell">
      <org-tabs [value]="value()" (valueChange)="value.set($event)" [scrollable]="true">
        <org-tab value="dashboard">Dashboard</org-tab>
        <org-tab value="analytics">Analytics</org-tab>
        <org-tab value="reports">Reports</org-tab>
        <org-tab value="users">Users</org-tab>
        <org-tab value="settings">Settings</org-tab>
        <org-tab value="billing">Billing</org-tab>
        <org-tab value="support">Support</org-tab>
        <org-tab value="docs">Documentation</org-tab>
      </org-tabs>
    </div>
  `,
})
class TabsScrollableShowcase {
  protected readonly value = signal<string>('dashboard');
}

@Component({
  selector: 'story-tabs-disabled',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tabs, Tab],
  template: `
    <org-tabs [value]="value()" (valueChange)="value.set($event)">
      <org-tab value="home">Home</org-tab>
      <org-tab value="profile" [disabled]="true">Profile (disabled)</org-tab>
      <org-tab value="settings">Settings</org-tab>
    </org-tabs>
  `,
})
class TabsDisabledShowcase {
  protected readonly value = signal<string>('home');
}

@Component({
  selector: 'story-tabs-keyboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tabs, Tab],
  template: `
    <div class="flex flex-col gap-2">
      <org-tabs [value]="value()" (valueChange)="value.set($event)">
        <org-tab value="first">First</org-tab>
        <org-tab value="second">Second</org-tab>
        <org-tab value="third" [disabled]="true">Third (disabled)</org-tab>
        <org-tab value="fourth">Fourth</org-tab>
      </org-tabs>
      <p>
        Active value: <strong>{{ value() }}</strong>
      </p>
    </div>
  `,
})
class TabsKeyboardShowcase {
  protected readonly value = signal<string>('first');
}

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every tabs axis — anatomy, variants, sizes, icons + counts, stretch, closable, embedded inside a card, scrollable overflow mode, disabled state, and keyboard navigation.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Anatomy"
            description="Two regions: the tablist (a row of role=tab buttons) and a single source of truth for the active value owned by the parent. Selecting a tab updates the value model; the parent decides what to render."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-tabs-showcase />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Selection</strong>: Clicking a tab updates the active value model.</li>
            <li><strong>Active state</strong>: Mirrored to <code>aria-selected="true"</code> on the focusable element.</li>
            <li><strong>Active rail</strong>: For underline / enclosed, the selected tab's bottom border paints the active stroke over the list rail without shifting layout.</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Variants"
            description="The three variants share row geometry and type ramp; only the active-state chrome differs. Underline (default) is for quiet section nav; pills for toolbars / inline filters; enclosed for folder-tabs over a panel."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-tabs-variants />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>underline</strong>: Hairline rail beneath the strip; active tab grows that rail to a thicker fg-colored stroke.</li>
            <li><strong>pills</strong>: No rail; active tab fills with a soft tint, hover gets a quieter tint.</li>
            <li><strong>enclosed</strong>: Folder-tab geometry; active tab carries top + side borders and merges into the panel below.</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Sizes"
            description="Sizes tune row height + label size + horizontal padding, orthogonal to variant."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-tabs-sizes />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>sm</strong>: Compact strip for dense layouts.</li>
            <li><strong>base</strong>: Standard size for most use cases (default).</li>
            <li><strong>lg</strong>: Larger label and padding for prominent section nav.</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="With icons + counts"
            description="A tab is a flex row of optional slots: pre org-icon, label text, and post org-tag. Inner gap is governed by --spacing-tabs-tab-gap so glyphs and counts sit at consistent rhythm."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-tabs-icons-counts />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The disabled "Audit log" tab uses <code>aria-disabled="true"</code> — focus still lands on it during arrow-key navigation but selection does not.</li>
            <li>A post tag at <code>color="danger"</code> reads as an actionable count (e.g. open alerts).</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Stretch"
            description="Setting [stretch]=true makes tabs fill the row equally — useful inside a narrow card header or as a segmented-control style picker."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-tabs-stretch />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Tabs grow to fill the available row width with their labels centered.</li>
            <li>Stretch composes with every variant (the pills + underline examples both use stretch).</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Closable"
            description="Editor-style tabs with a post × that emits a closed event for the host to remove the tab. The host swaps from button to div role=tab so the close button can nest legally."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-tabs-closable />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Click the × to fire a closed event; the host removes the tab and picks a sensible neighbour as active.</li>
            <li>Pressing Delete or Backspace while a closable tab is focused fires the same closed event.</li>
            <li>The close affordance is a real nested button, so clicks on it do not also re-select the tab (event propagation is stopped).</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Inside a card"
            description="When tabs sit at the top of a card, the card owns the section break — the tabs strip reads as one continuous surface with the panel below."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-tabs-inside-card />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The list rail meets the card content area; the active panel reads as the card's body.</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Scrollable"
            description="Setting [scrollable]=true exposes chevron navigation buttons that scroll 80% of the container width; the tablist also scrolls horizontally with mouse / touch. The active tab automatically scrolls into view."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-tabs-scrollable-showcase />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Chevron buttons disable at the start / end of the scroll range.</li>
            <li>Setting the active value programmatically scrolls the matching tab into view.</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Disabled tab"
            description="Disabled tabs use aria-disabled rather than the native disabled attribute so screen readers still announce their disabled state during keyboard navigation."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-tabs-disabled />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Click on a disabled tab is suppressed and does not change the active value.</li>
            <li>Arrow-key navigation lands focus on a disabled tab so it can be announced; selection skips over it.</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Keyboard navigation"
            description="Try it: focus a tab below, then use ←/→ to move between tabs, Home / End to jump to the ends, and Tab to leave the strip."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-tabs-keyboard />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The tablist is a single keyboard tab-stop — Tab into it lands on the selected tab, not the first one.</li>
            <li>←/→ wraps focus through every tab (including disabled tabs) so each can be announced.</li>
            <li>Home / End jump focus to the first / last tab respectively.</li>
            <li>Selection follows focus when the focused tab is not disabled.</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        TabsAnatomyShowcase,
        TabsVariantsShowcase,
        TabsSizesShowcase,
        TabsIconsCountsShowcase,
        TabsStretchShowcase,
        TabsClosableShowcase,
        TabsInsideCardShowcase,
        TabsScrollableShowcase,
        TabsDisabledShowcase,
        TabsKeyboardShowcase,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

@Component({
  selector: 'story-tabs-programmatic',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Tabs,
    Tab,
    Button,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .programmatic-shell {
        width: 24rem; /* 384px */
      }
    `,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Programmatic Tab Selection"
          description="Demonstrates programmatically setting the active tab. Use the buttons to jump anywhere in the strip; when scrollable is enabled the selected tab automatically scrolls into view."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-1">
              <org-button color="primary" label="Jump to First Tab" (clicked)="jumpToFirstTab()" />
              <org-button color="primary" label="Jump to Middle Tab" (clicked)="jumpToMiddleTab()" />
              <org-button color="primary" label="Jump to Last Tab" (clicked)="jumpToLastTab()" />
            </div>
            <div class="programmatic-shell">
              <org-tabs [value]="activeValue()" [scrollable]="true" (valueChange)="onValueChange($event)">
                @for (label of tabLabels; track label.value) {
                  <org-tab [value]="label.value">{{ label.label }}</org-tab>
                }
              </org-tabs>
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>Programmatic Control</strong>: Tab selection can be controlled externally via signal.</li>
          <li>
            <strong>Auto-Scroll</strong>: When scrollable is enabled, the tabs container automatically scrolls to center
            the active tab.
          </li>
          <li><strong>Smooth Transition</strong>: The scroll animation is smooth and updates scroll button states.</li>
          <li><strong>Use Case</strong>: Useful for deep linking, navigation guards, or workflow steps.</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class TabsProgrammaticStory {
  protected readonly tabLabels: { value: string; label: string }[] = Array.from({ length: 20 }, (_, index) => ({
    value: `tab${index + 1}`,
    label: index === 19 ? 'Tab 20 (Last)' : `Tab ${index + 1}`,
  }));

  protected readonly activeValue = signal<string>('tab1');

  protected onValueChange(value: string): void {
    console.log('tab selected:', value);
    this.activeValue.set(value);
  }

  protected jumpToFirstTab(): void {
    console.log('jumping to first tab');
    this.activeValue.set('tab1');
  }

  protected jumpToMiddleTab(): void {
    console.log('jumping to middle tab');
    this.activeValue.set('tab10');
  }

  protected jumpToLastTab(): void {
    console.log('jumping to last tab');
    this.activeValue.set('tab20');
  }
}

export const ProgrammaticTabSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates programmatically setting the active tab. Use the buttons to jump anywhere in the strip, showing that the component properly handles external tab changes and scrolls the active tab into view.',
      },
    },
  },
  render: () => ({
    template: `<story-tabs-programmatic />`,
    moduleMetadata: {
      imports: [TabsProgrammaticStory],
    },
  }),
};
