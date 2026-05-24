import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { logManager } from '@organization/shared-utils';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { AutoScroll } from './auto-scroll';
import type { AutoScrollState } from './auto-scroll-brain';

describe('AutoScroll', () => {
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

  describe('when rendered inside a scrollable parent', () => {
    @Component({
      selector: 'test-auto-scroll-default-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [AutoScroll],
      template: `
        <div style="height: 100px; overflow: auto;" data-testid="scrollable">
          <org-auto-scroll data-testid="auto-scroll">
            <div style="height: 500px;">tall content</div>
          </org-auto-scroll>
        </div>
      `,
    })
    class AutoScrollDefaultHost {}

    let fixture: ComponentFixture<AutoScrollDefaultHost>;
    let host: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AutoScrollDefaultHost],
      }).compileComponents();

      fixture = TestBed.createComponent(AutoScrollDefaultHost);
      fixture.detectChanges();
      await fixture.whenStable();

      host = fixture.nativeElement.querySelector('[data-testid="auto-scroll"]') as HTMLElement;
    });

    it('creates the auto-scroll component', () => {
      const debug = fixture.debugElement.query((node) => node.componentInstance instanceof AutoScroll);

      expect(debug.componentInstance).toBeInstanceOf(AutoScroll);
    });

    it('renders the content wrapper with the default aria-live value', () => {
      const wrapper = host.querySelector('[aria-live]') as HTMLElement;

      expect(wrapper).not.toBeNull();
      expect(wrapper.getAttribute('aria-live')).toBe('polite');
    });

    it('renders the sentinel element', () => {
      const sentinel = host.querySelector('[data-auto-scroll-sentinel="true"]');

      expect(sentinel).not.toBeNull();
      expect(sentinel?.getAttribute('aria-hidden')).toBe('true');
    });

    it('sets the data-auto-scroll-enabled host attribute by default', () => {
      expect(host.getAttribute('data-auto-scroll-enabled')).toBe('');
    });
  });

  describe('when autoScrollEnabled is false', () => {
    @Component({
      selector: 'test-auto-scroll-disabled-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [AutoScroll],
      template: `
        <div style="height: 100px; overflow: auto;" data-testid="scrollable">
          <org-auto-scroll [autoScrollEnabled]="false" data-testid="auto-scroll">
            <div style="height: 500px;">tall content</div>
          </org-auto-scroll>
        </div>
      `,
    })
    class AutoScrollDisabledHost {}

    it('removes the data-auto-scroll-enabled host attribute', async () => {
      await TestBed.configureTestingModule({
        imports: [AutoScrollDisabledHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(AutoScrollDisabledHost);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="auto-scroll"]') as HTMLElement;

      expect(host.getAttribute('data-auto-scroll-enabled')).toBeNull();
    });
  });

  describe('when containerClass is provided', () => {
    @Component({
      selector: 'test-auto-scroll-container-class-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [AutoScroll],
      template: `
        <div style="height: 100px; overflow: auto;" data-testid="scrollable">
          <org-auto-scroll containerClass="custom-wrapper" data-testid="auto-scroll">
            <div style="height: 500px;">tall content</div>
          </org-auto-scroll>
        </div>
      `,
    })
    class AutoScrollContainerClassHost {}

    it('applies the class to the content wrapper element', async () => {
      await TestBed.configureTestingModule({
        imports: [AutoScrollContainerClassHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(AutoScrollContainerClassHost);
      fixture.detectChanges();
      await fixture.whenStable();

      const wrapper = fixture.nativeElement.querySelector('.custom-wrapper');

      expect(wrapper).not.toBeNull();
      expect(wrapper.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('when a parent listens to ready and stateChange', () => {
    @Component({
      selector: 'test-auto-scroll-listeners-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [AutoScroll],
      template: `
        <div style="height: 100px; overflow: auto;" data-testid="scrollable">
          <org-auto-scroll (ready)="onReady()" (stateChange)="onStateChange($event)" data-testid="auto-scroll">
            <div style="height: 500px;">tall content</div>
          </org-auto-scroll>
        </div>
      `,
    })
    class AutoScrollListenersHost {
      public onReady = vi.fn();
      public onStateChange = vi.fn();
    }

    it('forwards the brain ready emission to the parent listener', async () => {
      await TestBed.configureTestingModule({
        imports: [AutoScrollListenersHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(AutoScrollListenersHost);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.onReady).toHaveBeenCalledTimes(1);
    });

    it('forwards the brain stateChange emission to the parent listener', async () => {
      await TestBed.configureTestingModule({
        imports: [AutoScrollListenersHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(AutoScrollListenersHost);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.onStateChange).toHaveBeenCalled();
      expect(component.onStateChange).toHaveBeenCalledWith('enabled' satisfies AutoScrollState);
    });
  });

  describe('public api', () => {
    @Component({
      selector: 'test-auto-scroll-api-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [AutoScroll],
      template: `
        <div style="height: 100px; overflow: auto;" data-testid="scrollable">
          <org-auto-scroll #autoScrollComponent data-testid="auto-scroll">
            <div style="height: 500px;">tall content</div>
          </org-auto-scroll>
        </div>
      `,
    })
    class AutoScrollApiHost {}

    let fixture: ComponentFixture<AutoScrollApiHost>;
    let autoScroll: AutoScroll;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AutoScrollApiHost],
      }).compileComponents();

      fixture = TestBed.createComponent(AutoScrollApiHost);
      fixture.detectChanges();
      await fixture.whenStable();

      const debug = fixture.debugElement.query((node) => node.componentInstance instanceof AutoScroll);
      autoScroll = debug.componentInstance as AutoScroll;
    });

    it('returns the current auto scroll state from getAutoScrollState', () => {
      expect(autoScroll.getAutoScrollState()).toBe('enabled');
    });

    it('updates the auto scroll state via setAutoScrollState', () => {
      autoScroll.setAutoScrollState('disabled');

      expect(autoScroll.getAutoScrollState()).toBe('disabled');
    });

    it('delegates scrollToBottom to the scrollable parent', () => {
      const scrollable = fixture.nativeElement.querySelector('[data-testid="scrollable"]') as HTMLElement;

      autoScroll.scrollToBottom();

      expect(scrollable.scrollTo).toHaveBeenCalledWith(
        expect.objectContaining({
          behavior: 'smooth',
        })
      );
    });
  });

  describe('when no scrollable parent exists', () => {
    @Component({
      selector: 'test-auto-scroll-no-parent-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [AutoScroll],
      template: `<org-auto-scroll data-testid="auto-scroll"></org-auto-scroll>`,
    })
    class AutoScrollNoParentHost {}

    it('logs a warning via logManager.warn', async () => {
      const warnSpy = vi.spyOn(logManager, 'warn').mockImplementation(() => {});

      await TestBed.configureTestingModule({
        imports: [AutoScrollNoParentHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(AutoScrollNoParentHost);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(warnSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'auto-scroll-no-scrollable-parent',
        })
      );
    });
  });

  describe('when ariaLive is provided through the brain host directive', () => {
    @Component({
      selector: 'test-auto-scroll-aria-live-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [AutoScroll],
      template: `
        <div style="height: 100px; overflow: auto;" data-testid="scrollable">
          <org-auto-scroll [ariaLive]="ariaLive()" data-testid="auto-scroll">
            <div style="height: 500px;">tall content</div>
          </org-auto-scroll>
        </div>
      `,
    })
    class AutoScrollAriaLiveHost {
      public readonly ariaLive = signal<'off' | 'polite' | 'assertive'>('assertive');
    }

    it('applies the configured aria-live value to the content wrapper', async () => {
      await TestBed.configureTestingModule({
        imports: [AutoScrollAriaLiveHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(AutoScrollAriaLiveHost);
      fixture.detectChanges();
      await fixture.whenStable();

      const wrapper = fixture.nativeElement.querySelector('[aria-live]') as HTMLElement;

      expect(wrapper.getAttribute('aria-live')).toBe('assertive');
    });
  });
});
