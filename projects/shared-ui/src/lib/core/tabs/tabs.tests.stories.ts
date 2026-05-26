import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { Tabs, type TabsSize, type TabsVariant } from './tabs';
import { Tab } from './tab';

type TestTabConfig = {
  value: string;
  label: string;
  disabled: boolean;
  closable: boolean;
};

const defaultTabs: TestTabConfig[] = [
  { value: 'first', label: 'First', disabled: false, closable: false },
  { value: 'second', label: 'Second', disabled: false, closable: false },
  { value: 'third', label: 'Third', disabled: false, closable: false },
  { value: 'fourth', label: 'Fourth', disabled: false, closable: false },
];

@Component({
  selector: 'story-tabs-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tabs, Tab],
  host: {
    class: 'block',
    '(focusin)': 'onFocusIn($event)',
  },
  template: `
    <org-tabs
      data-testid="tabs"
      [value]="activeValue()"
      [variant]="variant()"
      [size]="size()"
      [stretch]="stretch()"
      (valueChange)="onValueChange($event)"
    >
      @for (tab of tabs(); track tab.value) {
        <org-tab
          [attr.data-testid]="'tab-' + tab.value"
          [value]="tab.value"
          [disabled]="tab.disabled"
          [closable]="tab.closable"
          (clicked)="onClicked($event)"
          (closed)="onClosed($event)"
        >
          {{ tab.label }}
        </org-tab>
      }
    </org-tabs>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-variant-pills" (click)="variant.set('pills')">variant-pills</button>
      <button type="button" data-testid="ctl-variant-enclosed" (click)="variant.set('enclosed')">
        variant-enclosed
      </button>
      <button type="button" data-testid="ctl-size-sm" (click)="size.set('sm')">size-sm</button>
      <button type="button" data-testid="ctl-size-lg" (click)="size.set('lg')">size-lg</button>
      <button type="button" data-testid="ctl-stretch-on" (click)="stretch.set(true)">stretch-on</button>
      <button type="button" data-testid="ctl-set-value-second" (click)="activeValue.set('second')">
        set-value-second
      </button>
      <button type="button" data-testid="ctl-set-value-third" (click)="activeValue.set('third')">
        set-value-third
      </button>
      <button type="button" data-testid="ctl-disable-third" (click)="toggleDisabled('third', true)">
        disable-third
      </button>
      <button type="button" data-testid="ctl-enable-third" (click)="toggleDisabled('third', false)">
        enable-third
      </button>
      <button type="button" data-testid="ctl-closable-first-on" (click)="toggleClosable('first', true)">
        closable-first-on
      </button>
      <button type="button" data-testid="ctl-closable-first-off" (click)="toggleClosable('first', false)">
        closable-first-off
      </button>
      <button type="button" data-testid="ctl-disable-first" (click)="toggleDisabled('first', true)">
        disable-first
      </button>
    </div>
  `,
})
class StoryTabsTestsShell {
  protected readonly variant = signal<TabsVariant>('underline');
  protected readonly size = signal<TabsSize>('base');
  protected readonly stretch = signal<boolean>(false);
  protected readonly activeValue = signal<string>('first');
  protected readonly tabs = signal<TestTabConfig[]>(defaultTabs);

  protected readonly valueChangeCount = signal<number>(0);
  protected readonly lastClickedValue = signal<string>('none');
  protected readonly clickedCount = signal<number>(0);
  protected readonly lastClosedValue = signal<string>('none');
  protected readonly closedCount = signal<number>(0);
  protected readonly focusedTabValue = signal<string>('none');

  protected readout(): string {
    return [
      `activeValue=${this.activeValue()}`,
      `valueChangeCount=${this.valueChangeCount()}`,
      `clickedCount=${this.clickedCount()}`,
      `lastClickedValue=${this.lastClickedValue()}`,
      `closedCount=${this.closedCount()}`,
      `lastClosedValue=${this.lastClosedValue()}`,
      `focusedTabValue=${this.focusedTabValue()}`,
    ].join(' ');
  }

  protected onValueChange(value: string): void {
    this.activeValue.set(value);
    this.valueChangeCount.update((count) => count + 1);
  }

  protected onClicked(value: string): void {
    this.lastClickedValue.set(value);
    this.clickedCount.update((count) => count + 1);
  }

  protected onClosed(value: string): void {
    this.lastClosedValue.set(value);
    this.closedCount.update((count) => count + 1);
  }

  protected onFocusIn(event: FocusEvent): void {
    const target = event.target as HTMLElement | null;
    const tabHost = target?.closest('org-tab') as HTMLElement | null;

    this.focusedTabValue.set(tabHost?.getAttribute('data-value') ?? 'none');
  }

  protected toggleDisabled(value: string, disabled: boolean): void {
    this.tabs.update((tabs) => tabs.map((tab) => (tab.value === value ? { ...tab, disabled } : tab)));
  }

  protected toggleClosable(value: string, closable: boolean): void {
    this.tabs.update((tabs) => tabs.map((tab) => (tab.value === value ? { ...tab, closable } : tab)));
  }
}

@Component({
  selector: 'story-tabs-keyboard-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tabs, Tab],
  host: {
    class: 'block',
    '(focusin)': 'onFocusIn($event)',
  },
  template: `
    <org-tabs data-testid="tabs" [value]="activeValue()" (valueChange)="activeValue.set($event)">
      <org-tab data-testid="tab-first" value="first">First</org-tab>
      <org-tab data-testid="tab-second" value="second">Second</org-tab>
      <org-tab data-testid="tab-third" value="third" [disabled]="true">Third</org-tab>
      <org-tab data-testid="tab-fourth" value="fourth">Fourth</org-tab>
    </org-tabs>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class StoryTabsKeyboardShell {
  protected readonly activeValue = signal<string>('first');
  protected readonly focusedTabValue = signal<string>('none');

  protected readout(): string {
    return `activeValue=${this.activeValue()} focusedTabValue=${this.focusedTabValue()}`;
  }

  protected onFocusIn(event: FocusEvent): void {
    const target = event.target as HTMLElement | null;
    const tabHost = target?.closest('org-tab') as HTMLElement | null;

    this.focusedTabValue.set(tabHost?.getAttribute('data-value') ?? 'none');
  }
}

@Component({
  selector: 'story-tabs-scrollable-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tabs, Tab],
  styles: [
    `
      :host {
        display: block;
      }
      .scroll-shell {
        width: 12rem; /* 192px - narrow enough to force overflow */
      }
    `,
  ],
  template: `
    <div class="scroll-shell">
      <org-tabs
        data-testid="tabs"
        [value]="activeValue()"
        [scrollable]="scrollable()"
        (valueChange)="activeValue.set($event)"
      >
        <org-tab data-testid="tab-alpha" value="alpha">Alpha</org-tab>
        <org-tab data-testid="tab-bravo" value="bravo">Bravo</org-tab>
        <org-tab data-testid="tab-charlie" value="charlie">Charlie</org-tab>
        <org-tab data-testid="tab-delta" value="delta">Delta</org-tab>
        <org-tab data-testid="tab-echo" value="echo">Echo</org-tab>
        <org-tab data-testid="tab-foxtrot" value="foxtrot">Foxtrot</org-tab>
        <org-tab data-testid="tab-golf" value="golf">Golf</org-tab>
        <org-tab data-testid="tab-hotel" value="hotel">Hotel</org-tab>
      </org-tabs>
    </div>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-scrollable-on" (click)="scrollable.set(true)">scrollable-on</button>
      <button type="button" data-testid="ctl-scrollable-off" (click)="scrollable.set(false)">scrollable-off</button>
      <button type="button" data-testid="ctl-set-value-hotel" (click)="activeValue.set('hotel')">
        set-value-hotel
      </button>
      <button type="button" data-testid="ctl-set-value-alpha" (click)="activeValue.set('alpha')">
        set-value-alpha
      </button>
    </div>
  `,
})
class StoryTabsScrollableShell {
  protected readonly activeValue = signal<string>('alpha');
  protected readonly scrollable = signal<boolean>(true);
}

const meta: Meta = {
  title: 'Core/Components/Tabs/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-tabs-tests-shell />`,
  moduleMetadata: { imports: [StoryTabsTestsShell] },
});

const renderKeyboardShell: Story['render'] = () => ({
  template: `<story-tabs-keyboard-shell />`,
  moduleMetadata: { imports: [StoryTabsKeyboardShell] },
});

const renderScrollableShell: Story['render'] = () => ({
  template: `<story-tabs-scrollable-shell />`,
  moduleMetadata: { imports: [StoryTabsScrollableShell] },
});

/** locates the inner focusable button of a tab host element */
const getTabButton = (tabHost: HTMLElement): HTMLButtonElement =>
  tabHost.querySelector('button.tab-btn') as HTMLButtonElement;

/** locates a chevron scroll button on the tabs host by aria-label */
const getScrollButton = (tabsHost: HTMLElement, ariaLabel: string): HTMLButtonElement => {
  const scope = tabsHost.querySelector(`org-button[ariaLabel="${ariaLabel}"]`);

  return (scope?.querySelector('button') ??
    tabsHost.querySelector(`button[aria-label="${ariaLabel}"]`)) as HTMLButtonElement;
};

// tabs host attributes

export const RendersDefaultHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tabs');

    await expect(host.getAttribute('data-variant')).toBe('underline');
    await expect(host.getAttribute('data-size')).toBe('base');
    await expect(host.getAttribute('data-stretch')).toBeNull();
    await expect(host.getAttribute('data-scrollable')).toBeNull();
    await expect(host.getAttribute('data-value')).toBe('first');
  },
};

export const ReflectsVariantHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tabs');

    await userEvent.click(canvas.getByTestId('ctl-variant-pills'));
    await expect(host.getAttribute('data-variant')).toBe('pills');

    await userEvent.click(canvas.getByTestId('ctl-variant-enclosed'));
    await expect(host.getAttribute('data-variant')).toBe('enclosed');
  },
};

export const ReflectsSizeHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tabs');

    await userEvent.click(canvas.getByTestId('ctl-size-sm'));
    await expect(host.getAttribute('data-size')).toBe('sm');

    await userEvent.click(canvas.getByTestId('ctl-size-lg'));
    await expect(host.getAttribute('data-size')).toBe('lg');
  },
};

export const ReflectsStretchHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tabs');

    await userEvent.click(canvas.getByTestId('ctl-stretch-on'));

    await expect(host.getAttribute('data-stretch')).toBe('');
  },
};

export const ReflectsScrollableHostAttribute: Story = {
  render: renderScrollableShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tabs');

    await expect(host.getAttribute('data-scrollable')).toBe('');

    await userEvent.click(canvas.getByTestId('ctl-scrollable-off'));

    await expect(host.getAttribute('data-scrollable')).toBeNull();
  },
};

export const ReflectsValueHostAttributeOnSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tabs');

    await userEvent.click(canvas.getByTestId('ctl-set-value-third'));

    await expect(host.getAttribute('data-value')).toBe('third');
  },
};

// tab host attributes

export const TabRendersDataValueAndNoBooleansByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tabHost = await canvas.findByTestId('tab-first');

    await expect(tabHost.getAttribute('data-value')).toBe('first');
    await expect(tabHost.getAttribute('data-disabled')).toBeNull();
    await expect(tabHost.getAttribute('data-closable')).toBeNull();
  },
};

export const TabReflectsDisabledHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tabHost = await canvas.findByTestId('tab-third');

    await userEvent.click(canvas.getByTestId('ctl-disable-third'));

    await expect(tabHost.getAttribute('data-disabled')).toBe('');

    await userEvent.click(canvas.getByTestId('ctl-enable-third'));

    await expect(tabHost.getAttribute('data-disabled')).toBeNull();
  },
};

export const TabReflectsClosableHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tabHost = await canvas.findByTestId('tab-first');

    await userEvent.click(canvas.getByTestId('ctl-closable-first-on'));

    await expect(tabHost.getAttribute('data-closable')).toBe('');
  },
};

// aria / roles

export const RendersTablistRoleOnInnerContainer: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tabs');
    const tablist = host.querySelector('[role="tablist"]');

    await expect(tablist).not.toBeNull();
  },
};

export const RendersTabRoleOnEachTab: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tabHost = await canvas.findByTestId('tab-first');
    const button = getTabButton(tabHost);

    await expect(button.getAttribute('role')).toBe('tab');
  },
};

export const AriaSelectedReflectsActiveState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstButton = getTabButton(await canvas.findByTestId('tab-first'));
    const secondButton = getTabButton(await canvas.findByTestId('tab-second'));

    await expect(firstButton.getAttribute('aria-selected')).toBe('true');
    await expect(secondButton.getAttribute('aria-selected')).toBe('false');

    await userEvent.click(canvas.getByTestId('ctl-set-value-second'));

    await expect(firstButton.getAttribute('aria-selected')).toBe('false');
    await expect(secondButton.getAttribute('aria-selected')).toBe('true');
  },
};

export const AriaDisabledReflectsDisabledInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tabHost = await canvas.findByTestId('tab-third');
    const button = getTabButton(tabHost);

    await expect(button.getAttribute('aria-disabled')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-disable-third'));

    await expect(button.getAttribute('aria-disabled')).toBe('true');
  },
};

export const TabindexZeroOnActiveAndMinusOneOnInactive: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstButton = getTabButton(await canvas.findByTestId('tab-first'));
    const secondButton = getTabButton(await canvas.findByTestId('tab-second'));

    await expect(firstButton.getAttribute('tabindex')).toBe('0');
    await expect(secondButton.getAttribute('tabindex')).toBe('-1');

    await userEvent.click(canvas.getByTestId('ctl-set-value-second'));

    await expect(firstButton.getAttribute('tabindex')).toBe('-1');
    await expect(secondButton.getAttribute('tabindex')).toBe('0');
  },
};

// selection by click

export const ClickingTabUpdatesActiveValue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const secondButton = getTabButton(await canvas.findByTestId('tab-second'));

    await userEvent.click(secondButton);

    await expect(readout.textContent).toContain('activeValue=second');
  },
};

export const ClickingTabEmitsClicked: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const secondButton = getTabButton(await canvas.findByTestId('tab-second'));

    await userEvent.click(secondButton);

    await expect(readout.textContent).toContain('clickedCount=1');
    await expect(readout.textContent).toContain('lastClickedValue=second');
  },
};

export const ClickingTabEmitsValueChange: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const secondButton = getTabButton(await canvas.findByTestId('tab-second'));

    await userEvent.click(secondButton);

    await expect(readout.textContent).toContain('valueChangeCount=1');
  },
};

export const ClickingDisabledTabDoesNotChangeValue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const thirdButton = getTabButton(await canvas.findByTestId('tab-third'));

    await userEvent.click(canvas.getByTestId('ctl-disable-third'));
    await userEvent.click(thirdButton);

    await expect(readout.textContent).toContain('activeValue=first');
    await expect(readout.textContent).toContain('valueChangeCount=0');
  },
};

export const ClickingDisabledTabDoesNotEmitClicked: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const thirdButton = getTabButton(await canvas.findByTestId('tab-third'));

    await userEvent.click(canvas.getByTestId('ctl-disable-third'));
    await userEvent.click(thirdButton);

    await expect(readout.textContent).toContain('clickedCount=0');
  },
};

// keyboard navigation

export const ArrowRightMovesFocusAndUpdatesActiveValue: Story = {
  render: renderKeyboardShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const firstButton = getTabButton(await canvas.findByTestId('tab-first'));

    firstButton.focus();

    await userEvent.keyboard('{ArrowRight}');

    await waitFor(() => expect(readout.textContent).toContain('focusedTabValue=second'));
    await expect(readout.textContent).toContain('activeValue=second');
  },
};

export const ArrowLeftMovesFocusAndUpdatesActiveValue: Story = {
  render: renderKeyboardShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const secondButton = getTabButton(await canvas.findByTestId('tab-second'));

    // click to land selection + focus on second tab without keyboard
    await userEvent.click(secondButton);

    await userEvent.keyboard('{ArrowLeft}');

    await waitFor(() => expect(readout.textContent).toContain('focusedTabValue=first'));
    await expect(readout.textContent).toContain('activeValue=first');
  },
};

export const ArrowRightWrapsFromLastToFirst: Story = {
  render: renderKeyboardShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const fourthButton = getTabButton(await canvas.findByTestId('tab-fourth'));

    await userEvent.click(fourthButton);
    await userEvent.keyboard('{ArrowRight}');

    await waitFor(() => expect(readout.textContent).toContain('focusedTabValue=first'));
    await expect(readout.textContent).toContain('activeValue=first');
  },
};

export const ArrowLeftWrapsFromFirstToLast: Story = {
  render: renderKeyboardShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const firstButton = getTabButton(await canvas.findByTestId('tab-first'));

    firstButton.focus();
    await userEvent.keyboard('{ArrowLeft}');

    await waitFor(() => expect(readout.textContent).toContain('focusedTabValue=fourth'));
    await expect(readout.textContent).toContain('activeValue=fourth');
  },
};

export const HomeKeyFocusesFirstTab: Story = {
  render: renderKeyboardShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const fourthButton = getTabButton(await canvas.findByTestId('tab-fourth'));

    await userEvent.click(fourthButton);
    await userEvent.keyboard('{Home}');

    await waitFor(() => expect(readout.textContent).toContain('focusedTabValue=first'));
    await expect(readout.textContent).toContain('activeValue=first');
  },
};

export const EndKeyFocusesLastTab: Story = {
  render: renderKeyboardShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const firstButton = getTabButton(await canvas.findByTestId('tab-first'));

    firstButton.focus();
    await userEvent.keyboard('{End}');

    await waitFor(() => expect(readout.textContent).toContain('focusedTabValue=fourth'));
    await expect(readout.textContent).toContain('activeValue=fourth');
  },
};

export const ArrowKeysLandFocusOnDisabledTabButDoNotSelectIt: Story = {
  render: renderKeyboardShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const secondButton = getTabButton(await canvas.findByTestId('tab-second'));

    await userEvent.click(secondButton);
    await userEvent.keyboard('{ArrowRight}');

    await waitFor(() => expect(readout.textContent).toContain('focusedTabValue=third'));
    // third tab is disabled so selection must not follow focus
    await expect(readout.textContent).toContain('activeValue=second');
  },
};

// closable

export const ClosableTabRendersCloseAffordance: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tabHost = await canvas.findByTestId('tab-first');

    await expect(tabHost.querySelector('.tab-close')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-closable-first-on'));

    await expect(tabHost.querySelector('.tab-close')).not.toBeNull();
  },
};

export const ClickingCloseButtonEmitsClosed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-closable-first-on'));

    const tabHost = await canvas.findByTestId('tab-first');
    const closeButton = tabHost.querySelector('.tab-close') as HTMLButtonElement;

    await userEvent.click(closeButton);

    await expect(readout.textContent).toContain('closedCount=1');
    await expect(readout.textContent).toContain('lastClosedValue=first');
  },
};

export const ClickingCloseButtonDoesNotAlsoSelectTab: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    // ensure the active tab is not 'first' so click would otherwise change the value
    await userEvent.click(canvas.getByTestId('ctl-set-value-second'));
    await userEvent.click(canvas.getByTestId('ctl-closable-first-on'));

    const tabHost = await canvas.findByTestId('tab-first');
    const closeButton = tabHost.querySelector('.tab-close') as HTMLButtonElement;

    await userEvent.click(closeButton);

    await expect(readout.textContent).toContain('activeValue=second');
    await expect(readout.textContent).toContain('lastClickedValue=none');
  },
};

export const DeleteKeyOnFocusedClosableTabEmitsClosed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-closable-first-on'));

    const firstButton = getTabButton(await canvas.findByTestId('tab-first'));

    firstButton.focus();
    await userEvent.keyboard('{Delete}');

    await waitFor(() => expect(readout.textContent).toContain('closedCount=1'));
    await expect(readout.textContent).toContain('lastClosedValue=first');
  },
};

export const BackspaceKeyOnFocusedClosableTabEmitsClosed: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-closable-first-on'));

    const firstButton = getTabButton(await canvas.findByTestId('tab-first'));

    firstButton.focus();
    await userEvent.keyboard('{Backspace}');

    await waitFor(() => expect(readout.textContent).toContain('closedCount=1'));
    await expect(readout.textContent).toContain('lastClosedValue=first');
  },
};

export const DeleteKeyOnNonClosableTabDoesNothing: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const firstButton = getTabButton(await canvas.findByTestId('tab-first'));

    firstButton.focus();
    await userEvent.keyboard('{Delete}');

    await expect(readout.textContent).toContain('closedCount=0');
  },
};

export const DeleteKeyOnDisabledClosableTabDoesNothing: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-closable-first-on'));
    await userEvent.click(canvas.getByTestId('ctl-disable-first'));

    const firstButton = getTabButton(await canvas.findByTestId('tab-first'));

    firstButton.focus();
    await userEvent.keyboard('{Delete}');

    await expect(readout.textContent).toContain('closedCount=0');
  },
};

// scrollable mode

export const ScrollableRendersChevronButtons: Story = {
  render: renderScrollableShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tabs');

    await expect(getScrollButton(host, 'Scroll tabs left')).not.toBeNull();
    await expect(getScrollButton(host, 'Scroll tabs right')).not.toBeNull();
  },
};

export const NonScrollableHidesChevronButtons: Story = {
  render: renderScrollableShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tabs');

    await userEvent.click(canvas.getByTestId('ctl-scrollable-off'));

    await waitFor(() => {
      expect(host.querySelector('org-button[ariaLabel="Scroll tabs left"]')).toBeNull();
      expect(host.querySelector('org-button[ariaLabel="Scroll tabs right"]')).toBeNull();
    });
  },
};

export const ScrollLeftButtonDisabledAtScrollStart: Story = {
  render: renderScrollableShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tabs');
    const leftButton = getScrollButton(host, 'Scroll tabs left');

    await expect(leftButton.disabled).toBe(true);
  },
};

export const ScrollRightButtonEnabledWhenOverflowExists: Story = {
  render: renderScrollableShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tabs');
    const rightButton = getScrollButton(host, 'Scroll tabs right');
    const tablist = host.querySelector('[role="tablist"]') as HTMLElement;

    // initial recalc fires inside the registerScrollContainer effect before layout settles, so
    // force a fresh recalc against measured dimensions by dispatching a scroll event
    tablist.dispatchEvent(new Event('scroll'));

    await waitFor(() => expect(rightButton.disabled).toBe(false));
  },
};

export const ClickingScrollRightAdvancesScrollState: Story = {
  render: renderScrollableShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tabs');
    const rightButton = getScrollButton(host, 'Scroll tabs right');
    const leftButton = getScrollButton(host, 'Scroll tabs left');
    const tablist = host.querySelector('[role="tablist"]') as HTMLElement;

    tablist.dispatchEvent(new Event('scroll'));
    await waitFor(() => expect(rightButton.disabled).toBe(false));

    await userEvent.click(rightButton);

    // smooth scroll triggers scroll event which updates state; the left chevron becomes enabled
    await waitFor(() => expect(tablist.scrollLeft).toBeGreaterThan(0));
    await waitFor(() => expect(leftButton.disabled).toBe(false));
  },
};

export const RecalcsScrollStateAfterContainerScroll: Story = {
  render: renderScrollableShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('tabs');
    const leftButton = getScrollButton(host, 'Scroll tabs left');
    const tablist = host.querySelector('[role="tablist"]') as HTMLElement;

    await expect(leftButton.disabled).toBe(true);

    tablist.scrollLeft = 50;
    tablist.dispatchEvent(new Event('scroll'));

    await waitFor(() => expect(leftButton.disabled).toBe(false));
  },
};

// programmatic value updates

export const SettingValueProgrammaticallyUpdatesAriaSelected: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstButton = getTabButton(await canvas.findByTestId('tab-first'));
    const thirdButton = getTabButton(await canvas.findByTestId('tab-third'));

    await expect(firstButton.getAttribute('aria-selected')).toBe('true');

    await userEvent.click(canvas.getByTestId('ctl-set-value-third'));

    await waitFor(() => expect(firstButton.getAttribute('aria-selected')).toBe('false'));
    await expect(thirdButton.getAttribute('aria-selected')).toBe('true');
  },
};

export const SettingValueProgrammaticallyScrollsActiveIntoView: Story = {
  render: renderScrollableShell,
  play: async ({ canvasElement }) => {
    const scrolledElements: HTMLElement[] = [];
    const scrollIntoViewSpy = spyOn(HTMLElement.prototype, 'scrollIntoView').mockImplementation(function (
      this: HTMLElement
    ) {
      scrolledElements.push(this);
    });

    try {
      const canvas = within(canvasElement);
      const hotelTab = await canvas.findByTestId('tab-hotel');

      await userEvent.click(canvas.getByTestId('ctl-set-value-hotel'));

      await waitFor(() => expect(scrollIntoViewSpy).toHaveBeenCalled());
      await waitFor(() => expect(scrolledElements).toContain(hotelTab));
    } finally {
      scrollIntoViewSpy.mockRestore();
    }
  },
};
