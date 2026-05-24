import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, it, expect, vi } from 'vitest';

import { LinkBrainDirective, type LinkReferrerPolicy, type LinkTarget } from './link-brain';

describe('LinkBrainDirective', () => {
  @Component({
    selector: 'test-link-brain-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LinkBrainDirective],
    template: `
      <a
        orgLinkBrain
        #brain="orgLinkBrain"
        [href]="href()"
        [target]="target()"
        [rel]="rel()"
        [download]="download()"
        [hreflang]="hreflang()"
        [referrerPolicy]="referrerPolicy()"
        [ariaLabel]="ariaLabel()"
        [disabled]="disabled()"
        [affordance]="affordance()"
        (clicked)="onClicked($event)"
        data-testid="brain"
        >label</a
      >
    `,
  })
  class LinkBrainHost {
    public readonly href = signal<string | undefined>(undefined);
    public readonly target = signal<LinkTarget | undefined>(undefined);
    public readonly rel = signal<string | undefined>(undefined);
    public readonly download = signal<string | undefined>(undefined);
    public readonly hreflang = signal<string | undefined>(undefined);
    public readonly referrerPolicy = signal<LinkReferrerPolicy | undefined>(undefined);
    public readonly ariaLabel = signal<string | undefined>(undefined);
    public readonly disabled = signal<boolean>(false);
    public readonly affordance = signal<boolean>(true);
    public onClicked = vi.fn();

    public readonly brain = viewChild.required<LinkBrainDirective>('brain');
  }

  let fixture: ComponentFixture<LinkBrainHost>;
  let component: LinkBrainHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  const getHost = () => fixture.nativeElement.querySelector('[data-testid="brain"]') as HTMLAnchorElement;

  const setInputs = async (patches: Partial<Record<keyof LinkBrainHost, unknown>>): Promise<void> => {
    for (const [key, value] of Object.entries(patches)) {
      (component[key as keyof LinkBrainHost] as { set: (value: unknown) => void }).set(value);
    }

    fixture.detectChanges();
    await fixture.whenStable();
  };

  describe('isActionLink', () => {
    it('is true when href is undefined', () => {
      expect(component.brain().isActionLink()).toBe(true);
    });

    it('is false when href is provided', async () => {
      await setInputs({ href: 'https://example.com' });

      expect(component.brain().isActionLink()).toBe(false);
    });
  });

  describe('effectiveHref', () => {
    it('returns the href value when one is provided', async () => {
      await setInputs({ href: 'https://example.com' });

      expect(component.brain().effectiveHref()).toBe('https://example.com');
      expect(getHost().getAttribute('href')).toBe('https://example.com');
    });

    it('returns null when disabled even if href is provided', async () => {
      await setInputs({ href: 'https://example.com', disabled: true });

      expect(component.brain().effectiveHref()).toBeNull();
      expect(getHost().getAttribute('href')).toBeNull();
    });
  });

  describe('effectiveTarget', () => {
    it('returns the target value when provided', async () => {
      await setInputs({ href: 'https://example.com', target: '_blank' });

      expect(component.brain().effectiveTarget()).toBe('_blank');
      expect(getHost().getAttribute('target')).toBe('_blank');
    });

    it('returns null when disabled', async () => {
      await setInputs({ href: 'https://example.com', target: '_blank', disabled: true });

      expect(component.brain().effectiveTarget()).toBeNull();
      expect(getHost().getAttribute('target')).toBeNull();
    });
  });

  describe('effectiveRel', () => {
    it('returns null when no consumer rel and target is not "_blank"', async () => {
      await setInputs({ href: 'https://example.com' });

      expect(component.brain().effectiveRel()).toBeNull();
      expect(getHost().getAttribute('rel')).toBeNull();
    });

    it('returns "noopener noreferrer" when target is "_blank" and no consumer rel is provided', async () => {
      await setInputs({ href: 'https://example.com', target: '_blank' });

      expect(component.brain().effectiveRel()).toBe('noopener noreferrer');
      expect(getHost().getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('uses the consumer-provided rel even when target is "_blank"', async () => {
      await setInputs({ href: 'https://example.com', target: '_blank', rel: 'author' });

      expect(component.brain().effectiveRel()).toBe('author');
      expect(getHost().getAttribute('rel')).toBe('author');
    });

    it('returns null when disabled', async () => {
      await setInputs({ href: 'https://example.com', target: '_blank', disabled: true });

      expect(component.brain().effectiveRel()).toBeNull();
      expect(getHost().getAttribute('rel')).toBeNull();
    });
  });

  describe('effectiveDownload, effectiveHreflang, and effectiveReferrerPolicy', () => {
    it('returns the input values when provided', async () => {
      await setInputs({
        href: 'https://example.com',
        download: 'report.pdf',
        hreflang: 'en',
        referrerPolicy: 'no-referrer',
      });

      const host = getHost();

      expect(component.brain().effectiveDownload()).toBe('report.pdf');
      expect(component.brain().effectiveHreflang()).toBe('en');
      expect(component.brain().effectiveReferrerPolicy()).toBe('no-referrer');
      expect(host.getAttribute('download')).toBe('report.pdf');
      expect(host.getAttribute('hreflang')).toBe('en');
      expect(host.getAttribute('referrerpolicy')).toBe('no-referrer');
    });

    it('returns null for all three when disabled', async () => {
      await setInputs({
        href: 'https://example.com',
        download: 'report.pdf',
        hreflang: 'en',
        referrerPolicy: 'no-referrer',
        disabled: true,
      });

      const host = getHost();

      expect(component.brain().effectiveDownload()).toBeNull();
      expect(component.brain().effectiveHreflang()).toBeNull();
      expect(component.brain().effectiveReferrerPolicy()).toBeNull();
      expect(host.getAttribute('download')).toBeNull();
      expect(host.getAttribute('hreflang')).toBeNull();
      expect(host.getAttribute('referrerpolicy')).toBeNull();
    });
  });

  describe('effectiveRole', () => {
    it('returns "button" in action-link mode', () => {
      expect(component.brain().effectiveRole()).toBe('button');
      expect(getHost().getAttribute('role')).toBe('button');
    });

    it('returns null when an href is provided', async () => {
      await setInputs({ href: 'https://example.com' });

      expect(component.brain().effectiveRole()).toBeNull();
      expect(getHost().getAttribute('role')).toBeNull();
    });
  });

  describe('effectiveTabindex', () => {
    it('returns 0 in action-link mode', () => {
      expect(component.brain().effectiveTabindex()).toBe(0);
      expect(getHost().getAttribute('tabindex')).toBe('0');
    });

    it('returns null when an href is provided', async () => {
      await setInputs({ href: 'https://example.com' });

      expect(component.brain().effectiveTabindex()).toBeNull();
      expect(getHost().getAttribute('tabindex')).toBeNull();
    });

    it('returns -1 when disabled regardless of href', async () => {
      await setInputs({ href: 'https://example.com', disabled: true });

      expect(component.brain().effectiveTabindex()).toBe(-1);
      expect(getHost().getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('affordanceIcon', () => {
    it('returns undefined in action-link mode', () => {
      expect(component.brain().affordanceIcon()).toBeUndefined();
    });

    it('returns "external-link" when target is "_blank" with an href', async () => {
      await setInputs({ href: 'https://example.com', target: '_blank' });

      expect(component.brain().affordanceIcon()).toBe('external-link');
    });

    it('returns "download" when the download input is set', async () => {
      await setInputs({ href: 'https://example.com', download: 'report.pdf' });

      expect(component.brain().affordanceIcon()).toBe('download');
    });

    it('returns "download" when both target="_blank" and download are set', async () => {
      await setInputs({ href: 'https://example.com', target: '_blank', download: 'report.pdf' });

      expect(component.brain().affordanceIcon()).toBe('download');
    });

    it('returns undefined when affordance is false', async () => {
      await setInputs({ href: 'https://example.com', target: '_blank', affordance: false });

      expect(component.brain().affordanceIcon()).toBeUndefined();
    });

    it('returns undefined when disabled', async () => {
      await setInputs({ href: 'https://example.com', target: '_blank', disabled: true });

      expect(component.brain().affordanceIcon()).toBeUndefined();
    });
  });

  describe('click handler', () => {
    it('emits clicked once in action-link mode when the host is clicked', () => {
      getHost().click();

      expect(component.onClicked).toHaveBeenCalledTimes(1);
    });

    it('does not emit clicked when an href is provided', async () => {
      await setInputs({ href: 'https://example.com' });

      const host = getHost();
      host.addEventListener('click', (event) => event.preventDefault(), { once: true });
      host.click();

      expect(component.onClicked).not.toHaveBeenCalled();
    });

    it('prevents default and does not emit clicked when disabled', async () => {
      await setInputs({ disabled: true });

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      getHost().dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
      expect(component.onClicked).not.toHaveBeenCalled();
    });
  });

  describe('keydown handler', () => {
    const dispatchKey = (key: string): KeyboardEvent => {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      getHost().dispatchEvent(event);

      return event;
    };

    it('emits clicked when Enter is pressed in action-link mode', () => {
      const event = dispatchKey('Enter');

      expect(component.onClicked).toHaveBeenCalledTimes(1);
      expect(event.defaultPrevented).toBe(true);
    });

    it('emits clicked when Space is pressed in action-link mode', () => {
      const event = dispatchKey(' ');

      expect(component.onClicked).toHaveBeenCalledTimes(1);
      expect(event.defaultPrevented).toBe(true);
    });

    it('does not emit clicked on other keys in action-link mode', () => {
      const event = dispatchKey('Tab');

      expect(component.onClicked).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(false);
    });

    it('does not emit clicked when an href is provided', async () => {
      await setInputs({ href: 'https://example.com' });

      dispatchKey('Enter');

      expect(component.onClicked).not.toHaveBeenCalled();
    });

    it('does not emit clicked when disabled', async () => {
      await setInputs({ disabled: true });

      dispatchKey('Enter');

      expect(component.onClicked).not.toHaveBeenCalled();
    });
  });
});
