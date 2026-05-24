import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { AutoScroll, type AutoScrollAriaLive, type AutoScrollState } from './auto-scroll';

@Component({
  selector: 'story-auto-scroll-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AutoScroll],
  host: { class: 'block' },
  template: `
    <div data-testid="scrollable-parent" style="height: 100px; overflow: auto;" (scroll)="onScroll($event)">
      <org-auto-scroll
        #autoScrollComponent
        data-testid="auto-scroll"
        [autoScrollEnabled]="autoScrollEnabled()"
        [containerClass]="containerClass()"
        [ariaLive]="ariaLive()"
        (ready)="handleReady()"
        (stateChange)="handleStateChange($event)"
      >
        <div style="height: 500px;">
          @for (item of items(); track item) {
            <div data-testid="item">{{ item }}</div>
          }
        </div>
      </org-auto-scroll>
    </div>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-enable-off" (click)="autoScrollEnabled.set(false)">enable-off</button>
      <button type="button" data-testid="ctl-enable-on" (click)="autoScrollEnabled.set(true)">enable-on</button>
      <button type="button" data-testid="ctl-container-class" (click)="containerClass.set('custom-wrapper')">
        container-class
      </button>
      <button type="button" data-testid="ctl-aria-live-assertive" (click)="ariaLive.set('assertive')">
        aria-live-assertive
      </button>
      <button type="button" data-testid="ctl-add-item" (click)="addItem()">add-item</button>
      <button type="button" data-testid="ctl-scroll-to-bottom" (click)="callScrollToBottom()">scroll-to-bottom</button>
      <button type="button" data-testid="ctl-state-disabled" (click)="callSetState('disabled')">state-disabled</button>
    </div>
  `,
})
class StoryAutoScrollTestsShell {
  protected readonly autoScrollComponent = viewChild.required<AutoScroll>('autoScrollComponent');

  protected readonly autoScrollEnabled = signal<boolean>(true);
  protected readonly containerClass = signal<string>('');
  protected readonly ariaLive = signal<AutoScrollAriaLive>('polite');
  protected readonly items = signal<string[]>(['Item 1']);

  protected readonly readyCount = signal<number>(0);
  protected readonly lastState = signal<AutoScrollState | 'none'>('none');
  protected readonly scrollTop = signal<number>(0);

  protected readout(): string {
    const component = this.autoScrollComponent();
    const state = component ? component.getAutoScrollState() : 'unknown';

    return `state=${state} readyCount=${this.readyCount()} lastState=${this.lastState()} scrollTop=${this.scrollTop()}`;
  }

  protected handleReady(): void {
    this.readyCount.update((count) => count + 1);
  }

  protected handleStateChange(state: AutoScrollState): void {
    this.lastState.set(state);
  }

  protected onScroll(event: Event): void {
    this.scrollTop.set((event.target as HTMLElement).scrollTop);
  }

  protected addItem(): void {
    this.items.update((items) => [...items, `Item ${items.length + 1}`]);
  }

  protected callScrollToBottom(): void {
    this.autoScrollComponent().scrollToBottom();
  }

  protected callSetState(state: AutoScrollState): void {
    this.autoScrollComponent().setAutoScrollState(state);
  }
}

@Component({
  selector: 'story-auto-scroll-starts-disabled-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AutoScroll],
  host: { class: 'block' },
  template: `
    <div data-testid="scrollable-parent" style="height: 100px; overflow: auto;" (scroll)="onScroll($event)">
      <org-auto-scroll
        #autoScrollComponent
        data-testid="auto-scroll"
        [autoScrollEnabled]="false"
        (ready)="handleReady()"
      >
        <div style="height: 500px;">tall content</div>
      </org-auto-scroll>
    </div>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class StoryAutoScrollStartsDisabledShell {
  protected readonly autoScrollComponent = viewChild.required<AutoScroll>('autoScrollComponent');
  protected readonly readyCount = signal<number>(0);
  protected readonly scrollTop = signal<number>(0);

  protected readout(): string {
    const component = this.autoScrollComponent();
    const state = component ? component.getAutoScrollState() : 'unknown';

    return `state=${state} readyCount=${this.readyCount()} scrollTop=${this.scrollTop()}`;
  }

  protected handleReady(): void {
    this.readyCount.update((count) => count + 1);
  }

  protected onScroll(event: Event): void {
    this.scrollTop.set((event.target as HTMLElement).scrollTop);
  }
}

@Component({
  selector: 'story-auto-scroll-no-parent-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AutoScroll],
  host: { class: 'block' },
  template: `
    <org-auto-scroll data-testid="auto-scroll" (ready)="handleReady()">
      <div>content</div>
    </org-auto-scroll>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class StoryAutoScrollNoParentShell {
  protected readonly readyCount = signal<number>(0);

  protected readout(): string {
    return `readyCount=${this.readyCount()}`;
  }

  protected handleReady(): void {
    this.readyCount.update((count) => count + 1);
  }
}

const meta: Meta = {
  title: 'Core/Components/Auto Scroll/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-auto-scroll-tests-shell />`,
  moduleMetadata: { imports: [StoryAutoScrollTestsShell] },
});

const renderStartsDisabledShell: Story['render'] = () => ({
  template: `<story-auto-scroll-starts-disabled-shell />`,
  moduleMetadata: { imports: [StoryAutoScrollStartsDisabledShell] },
});

const renderNoParentShell: Story['render'] = () => ({
  template: `<story-auto-scroll-no-parent-shell />`,
  moduleMetadata: { imports: [StoryAutoScrollNoParentShell] },
});

export const RendersContentWrapperWithDefaultAriaLive: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('auto-scroll');
    const wrapper = host.querySelector('[aria-live]') as HTMLElement | null;

    await expect(wrapper).not.toBeNull();
    await expect(wrapper?.getAttribute('aria-live')).toBe('polite');
  },
};

export const RendersSentinelElement: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('auto-scroll');
    const sentinel = host.querySelector('[data-auto-scroll-sentinel="true"]');

    await expect(sentinel).not.toBeNull();
    await expect(sentinel?.getAttribute('aria-hidden')).toBe('true');
  },
};

export const SetsDataAutoScrollEnabledHostAttributeByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('auto-scroll');

    await expect(host.getAttribute('data-auto-scroll-enabled')).toBe('');
  },
};

export const RemovesDataAutoScrollEnabledWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('auto-scroll');

    await userEvent.click(canvas.getByTestId('ctl-enable-off'));

    await waitFor(() => expect(host.getAttribute('data-auto-scroll-enabled')).toBeNull());
  },
};

export const AppliesContainerClassToContentWrapper: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('auto-scroll');

    await userEvent.click(canvas.getByTestId('ctl-container-class'));

    await waitFor(() => {
      const wrapper = host.querySelector('.custom-wrapper') as HTMLElement | null;

      expect(wrapper).not.toBeNull();
      expect(wrapper?.getAttribute('aria-live')).toBe('polite');
    });
  },
};

export const AppliesConfiguredAriaLiveValue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('auto-scroll');

    await userEvent.click(canvas.getByTestId('ctl-aria-live-assertive'));

    await waitFor(() => {
      const wrapper = host.querySelector('[aria-live]') as HTMLElement | null;

      expect(wrapper?.getAttribute('aria-live')).toBe('assertive');
    });
  },
};

export const EmitsReadyOnceForScrollableParent: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await waitFor(() => expect(readout.textContent).toContain('readyCount=1'));
  },
};

export const EmitsStateChangeWithEnabledOnInitialization: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await waitFor(() => expect(readout.textContent).toContain('lastState=enabled'));
  },
};

export const SetAutoScrollStateUpdatesState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await waitFor(() => expect(readout.textContent).toContain('state=enabled'));

    await userEvent.click(canvas.getByTestId('ctl-state-disabled'));

    await waitFor(() => expect(readout.textContent).toContain('state=disabled'));
  },
};

export const InitializesToForcedDisabledWhenEnabledIsFalse: Story = {
  render: renderStartsDisabledShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await waitFor(() => expect(readout.textContent).toContain('state=forced-disabled'));
  },
};

export const TransitionsToForcedDisabledWhenEnabledGoesFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await waitFor(() => expect(readout.textContent).toContain('state=enabled'));

    await userEvent.click(canvas.getByTestId('ctl-enable-off'));

    await waitFor(() => expect(readout.textContent).toContain('state=forced-disabled'));
  },
};

export const ReEvaluatesStateWhenEnabledGoesTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await waitFor(() => expect(readout.textContent).toContain('state=enabled'));

    await userEvent.click(canvas.getByTestId('ctl-enable-off'));
    await waitFor(() => expect(readout.textContent).toContain('state=forced-disabled'));

    await userEvent.click(canvas.getByTestId('ctl-enable-on'));

    // re-evaluation transitions away from forced-disabled into either 'enabled' or 'disabled'
    // depending on whether the sentinel is currently visible in the scrollable parent
    await waitFor(() => expect(readout.textContent).not.toContain('state=forced-disabled'));
  },
};

export const ScrollsToBottomViaPublicApi: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const scrollable = await canvas.findByTestId('scrollable-parent');
    const readout = await canvas.findByTestId('readout');

    scrollable.scrollTop = 0;
    await waitFor(() => expect(readout.textContent).toContain('scrollTop=0'));

    await userEvent.click(canvas.getByTestId('ctl-scroll-to-bottom'));

    await waitFor(
      () => {
        const expected = scrollable.scrollHeight - scrollable.clientHeight;

        expect(scrollable.scrollTop).toBeGreaterThan(0);
        expect(scrollable.scrollTop).toBeCloseTo(expected, -1);
      },
      { timeout: 2000 }
    );
  },
};

export const AutoScrollsOnInitWhenEnabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const scrollable = await canvas.findByTestId('scrollable-parent');

    await waitFor(() => expect(scrollable.scrollTop).toBeGreaterThan(0), { timeout: 2000 });
  },
};

export const DoesNotAutoScrollOnInitWhenForcedDisabled: Story = {
  render: renderStartsDisabledShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const scrollable = await canvas.findByTestId('scrollable-parent');
    const readout = await canvas.findByTestId('readout');

    await waitFor(() => expect(readout.textContent).toContain('state=forced-disabled'));

    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(scrollable.scrollTop).toBe(0);
  },
};

export const DoesNotEmitReadyWhenNoScrollableParent: Story = {
  render: renderNoParentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(readout.textContent).toContain('readyCount=0');
  },
};
