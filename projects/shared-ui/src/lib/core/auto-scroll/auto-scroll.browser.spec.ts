import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { AutoScroll, type AutoScrollAriaLive, type AutoScrollState } from './auto-scroll';

@Component({
  selector: 'test-auto-scroll-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AutoScroll],
  host: { class: 'block' },
  styles: [
    `
      .scrollable-parent {
        height: 6.25rem; /* 100px */
        overflow: auto;
      }
      .tall-content {
        height: 31.25rem; /* 500px */
      }
    `,
  ],
  template: `
    <div data-testid="scrollable-parent" class="scrollable-parent" (scroll)="onScroll($event)">
      <org-auto-scroll
        data-testid="auto-scroll"
        [autoScrollEnabled]="autoScrollEnabled()"
        [containerClass]="containerClass()"
        [ariaLive]="ariaLive()"
        (ready)="handleReady()"
        (stateChange)="handleStateChange($event)"
      >
        <div class="tall-content">
          @for (item of items(); track item) {
            <div data-testid="item">{{ item }}</div>
          }
        </div>
      </org-auto-scroll>
    </div>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class AutoScrollInteractiveHost {
  public readonly autoScrollComponent = viewChild.required(AutoScroll);

  public readonly autoScrollEnabled = signal<boolean>(true);
  public readonly containerClass = signal<string>('');
  public readonly ariaLive = signal<AutoScrollAriaLive>('polite');
  public readonly items = signal<string[]>(['Item 1']);

  protected readonly readyCount = signal<number>(0);
  protected readonly lastState = signal<AutoScrollState | 'none'>('none');
  protected readonly scrollTop = signal<number>(0);

  public addItem(): void {
    this.items.update((items) => [...items, `Item ${items.length + 1}`]);
  }

  protected readout(): string {
    const state = this.autoScrollComponent().getAutoScrollState();

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
}

@Component({
  selector: 'test-auto-scroll-starts-disabled-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AutoScroll],
  host: { class: 'block' },
  styles: [
    `
      .scrollable-parent {
        height: 6.25rem; /* 100px */
        overflow: auto;
      }
      .tall-content {
        height: 31.25rem; /* 500px */
      }
    `,
  ],
  template: `
    <div data-testid="scrollable-parent" class="scrollable-parent" (scroll)="onScroll($event)">
      <org-auto-scroll data-testid="auto-scroll" [autoScrollEnabled]="false" (ready)="handleReady()">
        <div class="tall-content">tall content</div>
      </org-auto-scroll>
    </div>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class AutoScrollStartsDisabledHost {
  public readonly autoScrollComponent = viewChild.required(AutoScroll);

  protected readonly readyCount = signal<number>(0);
  protected readonly scrollTop = signal<number>(0);

  protected readout(): string {
    const state = this.autoScrollComponent().getAutoScrollState();

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
  selector: 'test-auto-scroll-no-parent-host',
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
class AutoScrollNoParentHost {
  protected readonly readyCount = signal<number>(0);

  protected readout(): string {
    return `readyCount=${this.readyCount()}`;
  }

  protected handleReady(): void {
    this.readyCount.update((count) => count + 1);
  }
}

describe('Auto Scroll (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('rendering / structure', () => {
    it('renders the content wrapper with the default aria-live', async () => {
      const fixture = createFixture(AutoScrollInteractiveHost);
      const host = queryByTestId(fixture, 'auto-scroll');

      await flush(fixture);

      const wrapper = host.querySelector('[aria-live]') as HTMLElement | null;

      expect(wrapper).not.toBeNull();
      expect(wrapper?.getAttribute('aria-live')).toBe('polite');
    });

    it('renders the sentinel element', async () => {
      const fixture = createFixture(AutoScrollInteractiveHost);
      const host = queryByTestId(fixture, 'auto-scroll');

      await flush(fixture);

      const sentinel = host.querySelector('[data-auto-scroll-sentinel="true"]');

      expect(sentinel).not.toBeNull();
      expect(sentinel?.getAttribute('aria-hidden')).toBe('true');
    });

    it('applies the container class to the content wrapper', async () => {
      const fixture = createFixture(AutoScrollInteractiveHost);
      const host = queryByTestId(fixture, 'auto-scroll');

      fixture.componentInstance.containerClass.set('custom-wrapper');
      await flush(fixture);

      const wrapper = host.querySelector('.custom-wrapper') as HTMLElement | null;

      expect(wrapper).not.toBeNull();
      expect(wrapper?.getAttribute('aria-live')).toBe('polite');
    });

    it('applies the configured aria-live value', async () => {
      const fixture = createFixture(AutoScrollInteractiveHost);
      const host = queryByTestId(fixture, 'auto-scroll');

      fixture.componentInstance.ariaLive.set('assertive');
      await flush(fixture);

      const wrapper = host.querySelector('[aria-live]') as HTMLElement | null;

      expect(wrapper?.getAttribute('aria-live')).toBe('assertive');
    });
  });

  describe('host attribute reflection', () => {
    it('sets the data-auto-scroll-enabled host attribute by default', async () => {
      const fixture = createFixture(AutoScrollInteractiveHost);
      const host = queryByTestId(fixture, 'auto-scroll');

      await flush(fixture);

      expect(host.getAttribute('data-auto-scroll-enabled')).toBe('');
    });

    it('removes data-auto-scroll-enabled when disabled', async () => {
      const fixture = createFixture(AutoScrollInteractiveHost);
      const host = queryByTestId(fixture, 'auto-scroll');

      fixture.componentInstance.autoScrollEnabled.set(false);

      await waitFor(() => expect(host.getAttribute('data-auto-scroll-enabled')).toBeNull());
    });
  });

  describe('ready / state-change outputs', () => {
    it('emits ready once for a scrollable parent', async () => {
      const fixture = createFixture(AutoScrollInteractiveHost);
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(readout.textContent).toContain('readyCount=1'));
    });

    it('emits stateChange with enabled on initialization', async () => {
      const fixture = createFixture(AutoScrollInteractiveHost);
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(readout.textContent).toContain('lastState=enabled'));
    });

    it('does not emit ready when there is no scrollable parent', async () => {
      const fixture = createFixture(AutoScrollNoParentHost);
      const readout = queryByTestId(fixture, 'readout');

      await new Promise((resolve) => setTimeout(resolve, 200));
      await flush(fixture);

      expect(readout.textContent).toContain('readyCount=0');
    });
  });

  describe('state machine', () => {
    it('updates the state via the public setAutoScrollState api', async () => {
      const fixture = createFixture(AutoScrollInteractiveHost);
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(readout.textContent).toContain('state=enabled'));

      fixture.componentInstance.autoScrollComponent().setAutoScrollState('disabled');

      await waitFor(() => expect(readout.textContent).toContain('state=disabled'));
    });

    it('initializes to forced-disabled when enabled is false', async () => {
      const fixture = createFixture(AutoScrollStartsDisabledHost);
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(readout.textContent).toContain('state=forced-disabled'));
    });

    it('transitions to forced-disabled when enabled goes false', async () => {
      const fixture = createFixture(AutoScrollInteractiveHost);
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(readout.textContent).toContain('state=enabled'));

      fixture.componentInstance.autoScrollEnabled.set(false);

      await waitFor(() => expect(readout.textContent).toContain('state=forced-disabled'));
    });

    it('re-evaluates state when enabled goes true', async () => {
      const fixture = createFixture(AutoScrollInteractiveHost);
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(readout.textContent).toContain('state=enabled'));

      fixture.componentInstance.autoScrollEnabled.set(false);
      await waitFor(() => expect(readout.textContent).toContain('state=forced-disabled'));

      fixture.componentInstance.autoScrollEnabled.set(true);

      // re-evaluation transitions away from forced-disabled into either 'enabled' or 'disabled'
      // depending on whether the sentinel is currently visible in the scrollable parent
      await waitFor(() => expect(readout.textContent).not.toContain('state=forced-disabled'));
    });
  });

  describe('auto-scroll behavior', () => {
    it('scrolls to bottom via the public api', async () => {
      const fixture = createFixture(AutoScrollInteractiveHost);
      const scrollable = queryByTestId(fixture, 'scrollable-parent');
      const readout = queryByTestId(fixture, 'readout');

      scrollable.scrollTop = 0;
      await waitFor(() => expect(readout.textContent).toContain('scrollTop=0'));

      fixture.componentInstance.autoScrollComponent().scrollToBottom();

      await waitFor(() => {
        const expected = scrollable.scrollHeight - scrollable.clientHeight;

        expect(scrollable.scrollTop).toBeGreaterThan(0);
        expect(scrollable.scrollTop).toBeCloseTo(expected, -1);
      });
    });

    it('auto-scrolls on init when enabled', async () => {
      const fixture = createFixture(AutoScrollInteractiveHost);
      const scrollable = queryByTestId(fixture, 'scrollable-parent');

      await waitFor(() => expect(scrollable.scrollTop).toBeGreaterThan(0));
    });

    it('does not auto-scroll on init when forced-disabled', async () => {
      const fixture = createFixture(AutoScrollStartsDisabledHost);
      const scrollable = queryByTestId(fixture, 'scrollable-parent');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => expect(readout.textContent).toContain('state=forced-disabled'));

      await new Promise((resolve) => setTimeout(resolve, 200));

      expect(scrollable.scrollTop).toBe(0);
    });

    it('does not scroll on content change when disabled', async () => {
      const fixture = createFixture(AutoScrollInteractiveHost);
      const scrollable = queryByTestId(fixture, 'scrollable-parent');
      const readout = queryByTestId(fixture, 'readout');

      // wait for the initial smooth-scroll to fully settle at the bottom so subsequent scrollTop=0 cancels nothing
      // in flight and the baseline is stable for the assertion that follows the content mutation
      await waitFor(() => {
        const expected = scrollable.scrollHeight - scrollable.clientHeight;

        expect(scrollable.scrollTop).toBeGreaterThan(0);
        expect(scrollable.scrollTop).toBeCloseTo(expected, -1);
      });

      fixture.componentInstance.autoScrollComponent().setAutoScrollState('disabled');
      await waitFor(() => expect(readout.textContent).toContain('state=disabled'));

      scrollable.scrollTop = 0;
      await waitFor(() => expect(scrollable.scrollTop).toBe(0));

      // adding an item mutates projected content which triggers cdkObserveContent -> notifyContentChanged
      fixture.componentInstance.addItem();
      await flush(fixture);

      // allow enough time for any unwanted smooth-scroll to begin if the brain ignored the disabled state
      await new Promise((resolve) => setTimeout(resolve, 300));

      expect(scrollable.scrollTop).toBeLessThanOrEqual(10);
    });

    it('does not scroll on content change when forced-disabled', async () => {
      const fixture = createFixture(AutoScrollInteractiveHost);
      const scrollable = queryByTestId(fixture, 'scrollable-parent');
      const readout = queryByTestId(fixture, 'readout');

      await waitFor(() => {
        const expected = scrollable.scrollHeight - scrollable.clientHeight;

        expect(scrollable.scrollTop).toBeGreaterThan(0);
        expect(scrollable.scrollTop).toBeCloseTo(expected, -1);
      });

      fixture.componentInstance.autoScrollEnabled.set(false);
      await waitFor(() => expect(readout.textContent).toContain('state=forced-disabled'));

      scrollable.scrollTop = 0;
      await waitFor(() => expect(scrollable.scrollTop).toBe(0));

      fixture.componentInstance.addItem();
      await flush(fixture);

      await new Promise((resolve) => setTimeout(resolve, 300));

      expect(scrollable.scrollTop).toBeLessThanOrEqual(10);
    });
  });
});
