import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
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
  selector: 'test-tabs-host',
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
  `,
})
class TabsHost {
  public readonly variant = signal<TabsVariant>('underline');
  public readonly size = signal<TabsSize>('base');
  public readonly stretch = signal<boolean>(false);
  public readonly activeValue = signal<string>('first');
  public readonly tabs = signal<TestTabConfig[]>(defaultTabs);

  public readonly valueChangeCount = signal<number>(0);
  public readonly lastClickedValue = signal<string>('none');
  public readonly clickedCount = signal<number>(0);
  public readonly lastClosedValue = signal<string>('none');
  public readonly closedCount = signal<number>(0);
  public readonly focusedTabValue = signal<string>('none');

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

  public toggleDisabled(value: string, disabled: boolean): void {
    this.tabs.update((tabs) => tabs.map((tab) => (tab.value === value ? { ...tab, disabled } : tab)));
  }

  public toggleClosable(value: string, closable: boolean): void {
    this.tabs.update((tabs) => tabs.map((tab) => (tab.value === value ? { ...tab, closable } : tab)));
  }
}

@Component({
  selector: 'test-tabs-keyboard-host',
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
class TabsKeyboardHost {
  public readonly activeValue = signal<string>('first');
  public readonly focusedTabValue = signal<string>('none');

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
  selector: 'test-tabs-scrollable-host',
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
  `,
})
class TabsScrollableHost {
  public readonly activeValue = signal<string>('alpha');
  public readonly scrollable = signal<boolean>(true);
}

/** locates the inner focusable button of a tab host element */
const getTabButton = (tabHost: HTMLElement): HTMLButtonElement =>
  tabHost.querySelector('button.tab-btn') as HTMLButtonElement;

/** locates a chevron scroll button on the tabs host by aria-label */
const getScrollButton = (tabsHost: HTMLElement, ariaLabel: string): HTMLButtonElement => {
  const scope = tabsHost.querySelector(`org-button[ariaLabel="${ariaLabel}"]`);

  return (scope?.querySelector('button') ??
    tabsHost.querySelector(`button[aria-label="${ariaLabel}"]`)) as HTMLButtonElement;
};

describe('Tabs (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  beforeEach(setupTestBed);
  afterEach(destroyFixture);

  describe('tabs host attributes', () => {
    it('renders the default host attributes', async () => {
      const fixture = createFixture(TabsHost);
      const host = queryByTestId(fixture, 'tabs');

      await flush(fixture);

      expect(host.getAttribute('data-variant')).toBe('underline');
      expect(host.getAttribute('data-size')).toBe('base');
      expect(host.getAttribute('data-stretch')).toBeNull();
      expect(host.getAttribute('data-scrollable')).toBeNull();
      expect(host.getAttribute('data-value')).toBe('first');
    });

    it('reflects the variant host attribute', async () => {
      const fixture = createFixture(TabsHost);
      const host = queryByTestId(fixture, 'tabs');

      fixture.componentInstance.variant.set('pills');
      await flush(fixture);
      expect(host.getAttribute('data-variant')).toBe('pills');

      fixture.componentInstance.variant.set('enclosed');
      await flush(fixture);
      expect(host.getAttribute('data-variant')).toBe('enclosed');
    });

    it('reflects the size host attribute', async () => {
      const fixture = createFixture(TabsHost);
      const host = queryByTestId(fixture, 'tabs');

      fixture.componentInstance.size.set('sm');
      await flush(fixture);
      expect(host.getAttribute('data-size')).toBe('sm');

      fixture.componentInstance.size.set('lg');
      await flush(fixture);
      expect(host.getAttribute('data-size')).toBe('lg');
    });

    it('reflects the stretch host attribute', async () => {
      const fixture = createFixture(TabsHost);
      const host = queryByTestId(fixture, 'tabs');

      fixture.componentInstance.stretch.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-stretch')).toBe('');
    });

    it('reflects the scrollable host attribute', async () => {
      const fixture = createFixture(TabsScrollableHost);
      const host = queryByTestId(fixture, 'tabs');

      await flush(fixture);
      expect(host.getAttribute('data-scrollable')).toBe('');

      fixture.componentInstance.scrollable.set(false);
      await flush(fixture);

      expect(host.getAttribute('data-scrollable')).toBeNull();
    });

    it('reflects the value host attribute on selection', async () => {
      const fixture = createFixture(TabsHost);
      const host = queryByTestId(fixture, 'tabs');

      fixture.componentInstance.activeValue.set('third');
      await flush(fixture);

      expect(host.getAttribute('data-value')).toBe('third');
    });
  });

  describe('tab host attributes', () => {
    it('renders the data-value and no booleans by default', async () => {
      const fixture = createFixture(TabsHost);
      const tabHost = queryByTestId(fixture, 'tab-first');

      await flush(fixture);

      expect(tabHost.getAttribute('data-value')).toBe('first');
      expect(tabHost.getAttribute('data-disabled')).toBeNull();
      expect(tabHost.getAttribute('data-closable')).toBeNull();
    });

    it('reflects the disabled host attribute', async () => {
      const fixture = createFixture(TabsHost);
      const tabHost = queryByTestId(fixture, 'tab-third');

      fixture.componentInstance.toggleDisabled('third', true);
      await flush(fixture);
      expect(tabHost.getAttribute('data-disabled')).toBe('');

      fixture.componentInstance.toggleDisabled('third', false);
      await flush(fixture);
      expect(tabHost.getAttribute('data-disabled')).toBeNull();
    });

    it('reflects the closable host attribute', async () => {
      const fixture = createFixture(TabsHost);
      const tabHost = queryByTestId(fixture, 'tab-first');

      fixture.componentInstance.toggleClosable('first', true);
      await flush(fixture);

      expect(tabHost.getAttribute('data-closable')).toBe('');
    });
  });

  describe('aria / roles', () => {
    it('renders the tablist role on the inner container', async () => {
      const fixture = createFixture(TabsHost);
      const host = queryByTestId(fixture, 'tabs');

      await flush(fixture);

      expect(host.querySelector('[role="tablist"]')).not.toBeNull();
    });

    it('renders the tab role on each tab', async () => {
      const fixture = createFixture(TabsHost);
      const tabHost = queryByTestId(fixture, 'tab-first');

      await flush(fixture);

      expect(getTabButton(tabHost).getAttribute('role')).toBe('tab');
    });

    it('reflects the active state in aria-selected', async () => {
      const fixture = createFixture(TabsHost);
      const firstButton = getTabButton(queryByTestId(fixture, 'tab-first'));
      const secondButton = getTabButton(queryByTestId(fixture, 'tab-second'));

      await flush(fixture);
      expect(firstButton.getAttribute('aria-selected')).toBe('true');
      expect(secondButton.getAttribute('aria-selected')).toBe('false');

      fixture.componentInstance.activeValue.set('second');
      await flush(fixture);

      expect(firstButton.getAttribute('aria-selected')).toBe('false');
      expect(secondButton.getAttribute('aria-selected')).toBe('true');
    });

    it('reflects the disabled input in aria-disabled', async () => {
      const fixture = createFixture(TabsHost);
      const button = getTabButton(queryByTestId(fixture, 'tab-third'));

      await flush(fixture);
      expect(button.getAttribute('aria-disabled')).toBeNull();

      fixture.componentInstance.toggleDisabled('third', true);
      await flush(fixture);

      expect(button.getAttribute('aria-disabled')).toBe('true');
    });

    it('applies tabindex zero on the active tab and minus one on inactive tabs', async () => {
      const fixture = createFixture(TabsHost);
      const firstButton = getTabButton(queryByTestId(fixture, 'tab-first'));
      const secondButton = getTabButton(queryByTestId(fixture, 'tab-second'));

      await flush(fixture);
      expect(firstButton.getAttribute('tabindex')).toBe('0');
      expect(secondButton.getAttribute('tabindex')).toBe('-1');

      fixture.componentInstance.activeValue.set('second');
      await flush(fixture);

      expect(firstButton.getAttribute('tabindex')).toBe('-1');
      expect(secondButton.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('selection by click', () => {
    it('updates the active value when a tab is clicked', async () => {
      const fixture = createFixture(TabsHost);
      const readout = queryByTestId(fixture, 'readout');
      const secondButton = getTabButton(queryByTestId(fixture, 'tab-second'));

      await userEvent.click(secondButton);

      await waitFor(() => expect(readout.textContent).toContain('activeValue=second'));
    });

    it('emits clicked when a tab is clicked', async () => {
      const fixture = createFixture(TabsHost);
      const readout = queryByTestId(fixture, 'readout');
      const secondButton = getTabButton(queryByTestId(fixture, 'tab-second'));

      await userEvent.click(secondButton);

      await waitFor(() => {
        expect(readout.textContent).toContain('clickedCount=1');
        expect(readout.textContent).toContain('lastClickedValue=second');
      });
    });

    it('emits valueChange when a tab is clicked', async () => {
      const fixture = createFixture(TabsHost);
      const readout = queryByTestId(fixture, 'readout');
      const secondButton = getTabButton(queryByTestId(fixture, 'tab-second'));

      await userEvent.click(secondButton);

      await waitFor(() => expect(readout.textContent).toContain('valueChangeCount=1'));
    });

    it('does not change the value when a disabled tab is clicked', async () => {
      const fixture = createFixture(TabsHost);
      const readout = queryByTestId(fixture, 'readout');
      const thirdButton = getTabButton(queryByTestId(fixture, 'tab-third'));

      // warm up the click handler while the tab is still enabled so the first invocation after
      // disabling reads the freshly-flipped disabled input (avoids the first-listener stale input quirk)
      await userEvent.click(thirdButton);
      await waitFor(() => expect(readout.textContent).toContain('activeValue=third'));
      fixture.componentInstance.activeValue.set('first');
      await flush(fixture);

      fixture.componentInstance.toggleDisabled('third', true);
      await flush(fixture);
      // playwright refuses to click a disabled button; dispatch a raw click to exercise the guard
      thirdButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      await flush(fixture);

      expect(readout.textContent).toContain('activeValue=first');
    });

    it('does not emit clicked when a disabled tab is clicked', async () => {
      const fixture = createFixture(TabsHost);
      const readout = queryByTestId(fixture, 'readout');
      const thirdButton = getTabButton(queryByTestId(fixture, 'tab-third'));

      // warm up the click handler while enabled, then reset state before disabling
      await userEvent.click(thirdButton);
      await waitFor(() => expect(readout.textContent).toContain('clickedCount=1'));

      fixture.componentInstance.toggleDisabled('third', true);
      await flush(fixture);
      // playwright refuses to click a disabled button; dispatch a raw click to exercise the guard
      thirdButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      await flush(fixture);

      // count stays at 1 (the warm-up click) and does not increment for the disabled click
      expect(readout.textContent).toContain('clickedCount=1');
    });
  });

  describe('keyboard navigation', () => {
    it('moves focus and updates the active value on ArrowRight', async () => {
      const fixture = createFixture(TabsKeyboardHost);
      const readout = queryByTestId(fixture, 'readout');
      const firstButton = getTabButton(queryByTestId(fixture, 'tab-first'));

      firstButton.focus();
      await userEvent.keyboard('{ArrowRight}');

      await waitFor(() => expect(readout.textContent).toContain('focusedTabValue=second'));
      await waitFor(() => expect(readout.textContent).toContain('activeValue=second'));
    });

    it('moves focus and updates the active value on ArrowLeft', async () => {
      const fixture = createFixture(TabsKeyboardHost);
      const readout = queryByTestId(fixture, 'readout');
      const secondButton = getTabButton(queryByTestId(fixture, 'tab-second'));

      await userEvent.click(secondButton);
      await userEvent.keyboard('{ArrowLeft}');

      await waitFor(() => expect(readout.textContent).toContain('focusedTabValue=first'));
      await waitFor(() => expect(readout.textContent).toContain('activeValue=first'));
    });

    it('wraps focus from the last tab to the first on ArrowRight', async () => {
      const fixture = createFixture(TabsKeyboardHost);
      const readout = queryByTestId(fixture, 'readout');
      const fourthButton = getTabButton(queryByTestId(fixture, 'tab-fourth'));

      await userEvent.click(fourthButton);
      await userEvent.keyboard('{ArrowRight}');

      await waitFor(() => expect(readout.textContent).toContain('focusedTabValue=first'));
      await waitFor(() => expect(readout.textContent).toContain('activeValue=first'));
    });

    it('wraps focus from the first tab to the last on ArrowLeft', async () => {
      const fixture = createFixture(TabsKeyboardHost);
      const readout = queryByTestId(fixture, 'readout');
      const firstButton = getTabButton(queryByTestId(fixture, 'tab-first'));

      firstButton.focus();
      await userEvent.keyboard('{ArrowLeft}');

      await waitFor(() => expect(readout.textContent).toContain('focusedTabValue=fourth'));
      await waitFor(() => expect(readout.textContent).toContain('activeValue=fourth'));
    });

    it('focuses the first tab on Home', async () => {
      const fixture = createFixture(TabsKeyboardHost);
      const readout = queryByTestId(fixture, 'readout');
      const fourthButton = getTabButton(queryByTestId(fixture, 'tab-fourth'));

      await userEvent.click(fourthButton);
      await userEvent.keyboard('{Home}');

      await waitFor(() => expect(readout.textContent).toContain('focusedTabValue=first'));
      await waitFor(() => expect(readout.textContent).toContain('activeValue=first'));
    });

    it('focuses the last tab on End', async () => {
      const fixture = createFixture(TabsKeyboardHost);
      const readout = queryByTestId(fixture, 'readout');
      const firstButton = getTabButton(queryByTestId(fixture, 'tab-first'));

      firstButton.focus();
      await userEvent.keyboard('{End}');

      await waitFor(() => expect(readout.textContent).toContain('focusedTabValue=fourth'));
      await waitFor(() => expect(readout.textContent).toContain('activeValue=fourth'));
    });

    it('lands focus on a disabled tab but does not select it via arrow keys', async () => {
      const fixture = createFixture(TabsKeyboardHost);
      const readout = queryByTestId(fixture, 'readout');
      const secondButton = getTabButton(queryByTestId(fixture, 'tab-second'));

      await userEvent.click(secondButton);
      await userEvent.keyboard('{ArrowRight}');

      await waitFor(() => expect(readout.textContent).toContain('focusedTabValue=third'));
      // third tab is disabled so selection must not follow focus
      await waitFor(() => expect(readout.textContent).toContain('activeValue=second'));
    });
  });

  describe('closable', () => {
    it('renders the close affordance only when closable', async () => {
      const fixture = createFixture(TabsHost);
      const tabHost = queryByTestId(fixture, 'tab-first');

      await flush(fixture);
      expect(tabHost.querySelector('.tab-close')).toBeNull();

      fixture.componentInstance.toggleClosable('first', true);
      await flush(fixture);

      expect(tabHost.querySelector('.tab-close')).not.toBeNull();
    });

    it('emits closed when the close button is clicked', async () => {
      const fixture = createFixture(TabsHost);
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.toggleClosable('first', true);
      await flush(fixture);

      const tabHost = queryByTestId(fixture, 'tab-first');
      const closeButton = tabHost.querySelector('.tab-close') as HTMLButtonElement;
      await userEvent.click(closeButton);

      await waitFor(() => {
        expect(readout.textContent).toContain('closedCount=1');
        expect(readout.textContent).toContain('lastClosedValue=first');
      });
    });

    it('does not also select the tab when the close button is clicked', async () => {
      const fixture = createFixture(TabsHost);
      const readout = queryByTestId(fixture, 'readout');

      // ensure the active tab is not 'first' so a click would otherwise change the value
      fixture.componentInstance.activeValue.set('second');
      fixture.componentInstance.toggleClosable('first', true);
      await flush(fixture);

      const tabHost = queryByTestId(fixture, 'tab-first');
      const closeButton = tabHost.querySelector('.tab-close') as HTMLButtonElement;
      await userEvent.click(closeButton);

      await waitFor(() => {
        expect(readout.textContent).toContain('activeValue=second');
        expect(readout.textContent).toContain('lastClickedValue=none');
      });
    });

    it('emits closed on Delete when the focused tab is closable', async () => {
      const fixture = createFixture(TabsHost);
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.toggleClosable('first', true);
      await flush(fixture);

      const firstButton = getTabButton(queryByTestId(fixture, 'tab-first'));
      firstButton.focus();
      await userEvent.keyboard('{Delete}');

      await waitFor(() => expect(readout.textContent).toContain('closedCount=1'));
      await waitFor(() => expect(readout.textContent).toContain('lastClosedValue=first'));
    });

    it('emits closed on Backspace when the focused tab is closable', async () => {
      const fixture = createFixture(TabsHost);
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.toggleClosable('first', true);
      await flush(fixture);

      const firstButton = getTabButton(queryByTestId(fixture, 'tab-first'));
      firstButton.focus();
      await userEvent.keyboard('{Backspace}');

      await waitFor(() => expect(readout.textContent).toContain('closedCount=1'));
      await waitFor(() => expect(readout.textContent).toContain('lastClosedValue=first'));
    });

    it('does nothing on Delete for a non-closable tab', async () => {
      const fixture = createFixture(TabsHost);
      const readout = queryByTestId(fixture, 'readout');
      const firstButton = getTabButton(queryByTestId(fixture, 'tab-first'));

      firstButton.focus();
      await userEvent.keyboard('{Delete}');
      await flush(fixture);

      expect(readout.textContent).toContain('closedCount=0');
    });

    it('does nothing on Delete for a disabled closable tab', async () => {
      const fixture = createFixture(TabsHost);
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.toggleClosable('first', true);
      fixture.componentInstance.toggleDisabled('first', true);
      await flush(fixture);

      const firstButton = getTabButton(queryByTestId(fixture, 'tab-first'));
      firstButton.focus();
      await userEvent.keyboard('{Delete}');
      await flush(fixture);

      expect(readout.textContent).toContain('closedCount=0');
    });
  });

  describe('scrollable mode', () => {
    it('renders chevron buttons when scrollable', async () => {
      const fixture = createFixture(TabsScrollableHost);
      const host = queryByTestId(fixture, 'tabs');

      await flush(fixture);

      expect(getScrollButton(host, 'Scroll tabs left')).not.toBeNull();
      expect(getScrollButton(host, 'Scroll tabs right')).not.toBeNull();
    });

    it('hides chevron buttons when not scrollable', async () => {
      const fixture = createFixture(TabsScrollableHost);
      const host = queryByTestId(fixture, 'tabs');

      fixture.componentInstance.scrollable.set(false);
      await flush(fixture);

      await waitFor(() => {
        expect(host.querySelector('org-button[ariaLabel="Scroll tabs left"]')).toBeNull();
        expect(host.querySelector('org-button[ariaLabel="Scroll tabs right"]')).toBeNull();
      });
    });

    it('disables the left scroll button at the scroll start', async () => {
      const fixture = createFixture(TabsScrollableHost);
      const host = queryByTestId(fixture, 'tabs');

      await flush(fixture);

      const leftButton = getScrollButton(host, 'Scroll tabs left');

      expect(leftButton.disabled).toBe(true);
    });

    // NOTE: depends on real horizontal overflow occurring within the 12rem shell so the brain computes
    // canScrollRight=true; may not reproduce headlessly if layout/overflow does not settle in the test runner.
    it('enables the right scroll button when overflow exists', async () => {
      const fixture = createFixture(TabsScrollableHost);
      const host = queryByTestId(fixture, 'tabs');

      await flush(fixture);

      const rightButton = getScrollButton(host, 'Scroll tabs right');
      const tablist = host.querySelector('[role="tablist"]') as HTMLElement;

      // initial recalc fires inside the registerScrollContainer effect before layout settles, so
      // force a fresh recalc against measured dimensions by dispatching a scroll event
      tablist.dispatchEvent(new Event('scroll'));

      await waitFor(() => expect(rightButton.disabled).toBe(false));
    });

    // NOTE: depends on real overflow + smooth scroll advancing scrollLeft in the headless runner;
    // may not reproduce headlessly if the container does not actually overflow.
    it('advances the scroll state when the right chevron is clicked', async () => {
      const fixture = createFixture(TabsScrollableHost);
      const host = queryByTestId(fixture, 'tabs');

      await flush(fixture);

      const rightButton = getScrollButton(host, 'Scroll tabs right');
      const leftButton = getScrollButton(host, 'Scroll tabs left');
      const tablist = host.querySelector('[role="tablist"]') as HTMLElement;

      tablist.dispatchEvent(new Event('scroll'));
      await waitFor(() => expect(rightButton.disabled).toBe(false));

      await userEvent.click(rightButton);

      // smooth scroll triggers scroll event which updates state; the left chevron becomes enabled
      await waitFor(() => expect(tablist.scrollLeft).toBeGreaterThan(0));
      await waitFor(() => expect(leftButton.disabled).toBe(false));
    });

    it('recalculates the scroll state after a container scroll', async () => {
      const fixture = createFixture(TabsScrollableHost);
      const host = queryByTestId(fixture, 'tabs');

      await flush(fixture);

      const leftButton = getScrollButton(host, 'Scroll tabs left');
      const tablist = host.querySelector('[role="tablist"]') as HTMLElement;

      expect(leftButton.disabled).toBe(true);

      tablist.scrollLeft = 50;
      tablist.dispatchEvent(new Event('scroll'));

      await waitFor(() => expect(leftButton.disabled).toBe(false));
    });
  });

  describe('programmatic value updates', () => {
    it('updates aria-selected when the value is set programmatically', async () => {
      const fixture = createFixture(TabsHost);
      const firstButton = getTabButton(queryByTestId(fixture, 'tab-first'));
      const thirdButton = getTabButton(queryByTestId(fixture, 'tab-third'));

      await flush(fixture);
      expect(firstButton.getAttribute('aria-selected')).toBe('true');

      fixture.componentInstance.activeValue.set('third');
      await flush(fixture);

      await waitFor(() => expect(firstButton.getAttribute('aria-selected')).toBe('false'));
      await waitFor(() => expect(thirdButton.getAttribute('aria-selected')).toBe('true'));
    });

    it('scrolls the active tab into view when the value is set programmatically', async () => {
      const scrolledElements: HTMLElement[] = [];
      const scrollIntoViewSpy = vi.spyOn(HTMLElement.prototype, 'scrollIntoView').mockImplementation(function (
        this: HTMLElement
      ) {
        scrolledElements.push(this);
      });

      try {
        const fixture = createFixture(TabsScrollableHost);
        const hotelTab = queryByTestId(fixture, 'tab-hotel');

        await flush(fixture);

        fixture.componentInstance.activeValue.set('hotel');
        await flush(fixture);

        await waitFor(() => expect(scrollIntoViewSpy).toHaveBeenCalled());
        await waitFor(() => expect(scrolledElements).toContain(hotelTab));
      } finally {
        scrollIntoViewSpy.mockRestore();
      }
    });
  });
});
