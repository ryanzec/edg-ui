import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { AutoScrollBrainDirective, type AutoScrollAriaLive, type AutoScrollState } from './auto-scroll-brain';

describe('AutoScrollBrainDirective', () => {
  const originalResizeObserver = globalThis.ResizeObserver;
  const originalScrollTo = HTMLElement.prototype.scrollTo;

  beforeEach(() => {
    if (typeof globalThis.ResizeObserver === 'undefined') {
      globalThis.ResizeObserver = class {
        public observe(): void {}
        public unobserve(): void {}
        public disconnect(): void {}
      } as unknown as typeof ResizeObserver;
    }

    HTMLElement.prototype.scrollTo = vi.fn();
  });

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver;
    HTMLElement.prototype.scrollTo = originalScrollTo;
    vi.restoreAllMocks();
  });

  describe('when used inside a scrollable parent', () => {
    @Component({
      selector: 'test-brain-scrollable-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [AutoScrollBrainDirective],
      template: `
        <div style="height: 100px; overflow: auto;" data-testid="scrollable">
          <div
            orgAutoScrollBrain
            [enabled]="enabled()"
            [ariaLive]="ariaLive()"
            (ready)="onReady()"
            (stateChange)="onStateChange($event)"
            data-testid="brain-host"
          >
            <div #wrapperRef [attr.aria-live]="ariaLive()">
              <div style="height: 500px;">tall content</div>
            </div>
            <div #sentinelRef data-auto-scroll-sentinel="true" aria-hidden="true"></div>
          </div>
        </div>
      `,
    })
    class BrainScrollableHost {
      public readonly enabled = signal<boolean>(true);
      public readonly ariaLive = signal<AutoScrollAriaLive>('polite');
      public onReady = vi.fn();
      public onStateChange = vi.fn<(state: AutoScrollState) => void>();

      @ViewChild('sentinelRef', { static: true })
      public readonly sentinelRef!: ElementRef<HTMLElement>;

      @ViewChild('wrapperRef', { static: true })
      public readonly wrapperRef!: ElementRef<HTMLElement>;
    }

    const createFixture = async (): Promise<{
      fixture: ComponentFixture<BrainScrollableHost>;
      host: BrainScrollableHost;
      brain: AutoScrollBrainDirective;
    }> => {
      await TestBed.configureTestingModule({
        imports: [BrainScrollableHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(BrainScrollableHost);
      const host = fixture.componentInstance;
      fixture.detectChanges();

      const debug = fixture.debugElement.query(
        (node) => node.injector.get(AutoScrollBrainDirective, null, { self: true, optional: true }) !== null
      );
      const brain = debug.injector.get(AutoScrollBrainDirective);

      brain.setSentinelElement(host.sentinelRef.nativeElement);
      brain.setContentWrapperElement(host.wrapperRef.nativeElement);
      await fixture.whenStable();

      return { fixture, host, brain };
    };

    describe('state machine', () => {
      it('defaults to the enabled state once initialized', async () => {
        const { brain } = await createFixture();

        expect(brain.getAutoScrollState()).toBe('enabled');
      });

      it('updates the state via setAutoScrollState', async () => {
        const { brain } = await createFixture();

        brain.setAutoScrollState('disabled');

        expect(brain.getAutoScrollState()).toBe('disabled');
      });

      it('emits stateChange whenever the state transitions', async () => {
        const { host, brain, fixture } = await createFixture();
        host.onStateChange.mockClear();

        brain.setAutoScrollState('forced-disabled');
        fixture.detectChanges();
        await fixture.whenStable();

        expect(host.onStateChange).toHaveBeenCalledWith('forced-disabled' satisfies AutoScrollState);
      });
    });

    describe('initialization', () => {
      it('emits ready once a scrollable parent is detected', async () => {
        const { host } = await createFixture();

        expect(host.onReady).toHaveBeenCalledTimes(1);
      });

      it('initializes to enabled when the enabled input is true', async () => {
        const { brain } = await createFixture();

        expect(brain.getAutoScrollState()).toBe('enabled');
      });
    });

    describe('when initialized with enabled false', () => {
      it('initializes to forced-disabled', async () => {
        await TestBed.configureTestingModule({
          imports: [BrainScrollableHost],
        }).compileComponents();

        const fixture = TestBed.createComponent(BrainScrollableHost);
        const host = fixture.componentInstance;
        host.enabled.set(false);
        fixture.detectChanges();

        const debug = fixture.debugElement.query(
          (node) => node.injector.get(AutoScrollBrainDirective, null, { self: true, optional: true }) !== null
        );
        const brain = debug.injector.get(AutoScrollBrainDirective);

        brain.setSentinelElement(host.sentinelRef.nativeElement);
        brain.setContentWrapperElement(host.wrapperRef.nativeElement);
        await fixture.whenStable();

        expect(brain.getAutoScrollState()).toBe('forced-disabled');
      });
    });

    describe('enabled input transitions', () => {
      it('transitions to forced-disabled when enabled goes from true to false', async () => {
        const { host, brain, fixture } = await createFixture();

        host.enabled.set(false);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(brain.getAutoScrollState()).toBe('forced-disabled');
      });

      it('re-evaluates the state when enabled goes from false to true', async () => {
        const { host, brain, fixture } = await createFixture();

        host.enabled.set(false);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(brain.getAutoScrollState()).toBe('forced-disabled');

        host.enabled.set(true);
        fixture.detectChanges();
        await fixture.whenStable();

        // jsdom returns all-zero bounding rects which makes isElementOutOfView treat the
        // sentinel as out-of-view, so the re-evaluation resolves to 'disabled' (not stuck at
        // 'forced-disabled', which proves the re-evaluation actually ran).
        expect(brain.getAutoScrollState()).toBe('disabled');
      });
    });

    describe('notifyContentChanged', () => {
      it('scrolls to bottom when the state is enabled', async () => {
        const { fixture, brain } = await createFixture();
        const scrollable = fixture.nativeElement.querySelector('[data-testid="scrollable"]') as HTMLElement;
        (scrollable.scrollTo as ReturnType<typeof vi.fn>).mockClear();

        brain.notifyContentChanged();

        expect(scrollable.scrollTo).toHaveBeenCalledWith(
          expect.objectContaining({
            behavior: 'smooth',
          })
        );
      });

      it('does not scroll when the state is disabled', async () => {
        const { fixture, brain } = await createFixture();
        const scrollable = fixture.nativeElement.querySelector('[data-testid="scrollable"]') as HTMLElement;
        brain.setAutoScrollState('disabled');
        (scrollable.scrollTo as ReturnType<typeof vi.fn>).mockClear();

        brain.notifyContentChanged();

        expect(scrollable.scrollTo).not.toHaveBeenCalled();
      });

      it('does not scroll when the state is forced-disabled', async () => {
        const { fixture, brain } = await createFixture();
        const scrollable = fixture.nativeElement.querySelector('[data-testid="scrollable"]') as HTMLElement;
        brain.setAutoScrollState('forced-disabled');
        (scrollable.scrollTo as ReturnType<typeof vi.fn>).mockClear();

        brain.notifyContentChanged();

        expect(scrollable.scrollTo).not.toHaveBeenCalled();
      });
    });

    describe('scrollToBottom', () => {
      it('calls scrollTo on the scrollable parent with smooth behavior', async () => {
        const { fixture, brain } = await createFixture();
        const scrollable = fixture.nativeElement.querySelector('[data-testid="scrollable"]') as HTMLElement;
        (scrollable.scrollTo as ReturnType<typeof vi.fn>).mockClear();

        brain.scrollToBottom();

        expect(scrollable.scrollTo).toHaveBeenCalledWith(
          expect.objectContaining({
            behavior: 'smooth',
          })
        );
      });
    });
  });

  describe('when no scrollable parent is available', () => {
    @Component({
      selector: 'test-brain-no-parent-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [AutoScrollBrainDirective],
      template: `
        <div orgAutoScrollBrain (ready)="onReady()" data-testid="brain-host">
          <div #wrapperRef>
            <div>content</div>
          </div>
          <div #sentinelRef data-auto-scroll-sentinel="true" aria-hidden="true"></div>
        </div>
      `,
    })
    class BrainNoParentHost {
      public onReady = vi.fn();

      @ViewChild('sentinelRef', { static: true })
      public readonly sentinelRef!: ElementRef<HTMLElement>;

      @ViewChild('wrapperRef', { static: true })
      public readonly wrapperRef!: ElementRef<HTMLElement>;
    }

    it('does not emit ready and scrollToBottom is a no-op', async () => {
      await TestBed.configureTestingModule({
        imports: [BrainNoParentHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(BrainNoParentHost);
      const host = fixture.componentInstance;
      fixture.detectChanges();

      const debug = fixture.debugElement.query(
        (node) => node.injector.get(AutoScrollBrainDirective, null, { self: true, optional: true }) !== null
      );
      const brain = debug.injector.get(AutoScrollBrainDirective);

      brain.setSentinelElement(host.sentinelRef.nativeElement);
      brain.setContentWrapperElement(host.wrapperRef.nativeElement);
      await fixture.whenStable();

      expect(host.onReady).not.toHaveBeenCalled();

      brain.scrollToBottom();

      // no scrollable parent means scrollTo is never invoked on any element
      const scrollToCalls = (HTMLElement.prototype.scrollTo as ReturnType<typeof vi.fn>).mock.calls;
      expect(scrollToCalls).toHaveLength(0);
    });
  });
});
