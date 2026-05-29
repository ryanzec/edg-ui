import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Link } from './link';
import { type LinkReferrerPolicy, type LinkTarget } from './link-brain';

@Component({
  selector: 'test-link-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Link],
  host: { class: 'block' },
  template: `
    <org-link
      data-testid="link"
      #linkRef
      [href]="href()"
      [target]="target()"
      [rel]="rel()"
      [download]="download()"
      [hreflang]="hreflang()"
      [referrerPolicy]="referrerPolicy()"
      [ariaLabel]="ariaLabel()"
      [disabled]="disabled()"
      [affordance]="affordance()"
      (clicked)="handleClicked()"
    >
      docs
    </org-link>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class LinkInteractiveHost {
  protected readonly linkRef = viewChild.required<Link>('linkRef');

  public readonly href = signal<string | undefined>('https://example.com');
  public readonly target = signal<LinkTarget | undefined>(undefined);
  public readonly rel = signal<string | undefined>(undefined);
  public readonly download = signal<string | undefined>(undefined);
  public readonly hreflang = signal<string | undefined>(undefined);
  public readonly referrerPolicy = signal<LinkReferrerPolicy | undefined>(undefined);
  public readonly ariaLabel = signal<string | undefined>(undefined);
  public readonly disabled = signal<boolean>(false);
  public readonly affordance = signal<boolean>(true);

  protected readonly clickCount = signal<number>(0);

  protected readout(): string {
    return `clickCount=${this.clickCount()} isActionLink=${this.linkRef().isActionLink()}`;
  }

  protected handleClicked(): void {
    this.clickCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'test-link-content-projection-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Link],
  host: { class: 'block' },
  template: `
    <org-link href="https://example.com" [affordance]="false" data-testid="link-default">
      <span data-testid="default-content">default body</span>
    </org-link>

    <org-link href="https://example.com" [affordance]="false" data-testid="link-pre">
      <ng-template #pre>
        <span data-testid="custom-pre">pre body</span>
      </ng-template>
      main
    </org-link>

    <org-link href="https://example.com" [affordance]="false" data-testid="link-post">
      main
      <ng-template #post>
        <span data-testid="custom-post">post body</span>
      </ng-template>
    </org-link>
  `,
})
class LinkContentProjectionHost {}

@Component({
  selector: 'test-link-post-suppress-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Link],
  host: { class: 'block' },
  template: `
    <org-link href="https://example.com" target="_blank" data-testid="link">
      docs
      <ng-template #post>
        <span data-testid="custom-post">custom</span>
      </ng-template>
    </org-link>
  `,
})
class LinkPostSuppressHost {}

type LinkHostConfig = {
  href?: string | undefined;
  target?: LinkTarget | undefined;
  rel?: string | undefined;
  download?: string | undefined;
  hreflang?: string | undefined;
  referrerPolicy?: LinkReferrerPolicy | undefined;
  ariaLabel?: string | undefined;
  disabled?: boolean;
  affordance?: boolean;
};

describe('Link (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractiveLink = (config: LinkHostConfig = {}): ComponentFixture<LinkInteractiveHost> =>
    createFixture(LinkInteractiveHost, (instance) => {
      if (config.href !== undefined) {
        instance.href.set(config.href);
      }

      if (config.target !== undefined) {
        instance.target.set(config.target);
      }

      if (config.rel !== undefined) {
        instance.rel.set(config.rel);
      }

      if (config.download !== undefined) {
        instance.download.set(config.download);
      }

      if (config.hreflang !== undefined) {
        instance.hreflang.set(config.hreflang);
      }

      if (config.referrerPolicy !== undefined) {
        instance.referrerPolicy.set(config.referrerPolicy);
      }

      if (config.ariaLabel !== undefined) {
        instance.ariaLabel.set(config.ariaLabel);
      }

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }

      if (config.affordance !== undefined) {
        instance.affordance.set(config.affordance);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('element rendering', () => {
    it('renders an anchor element when an href is provided', () => {
      const fixture = createInteractiveLink();
      const host = queryByTestId(fixture, 'link');

      expect(host.querySelector('a.link')).not.toBeNull();
      expect(host.querySelector('span.link')).toBeNull();
    });

    it('reflects href, target, and aria-label on the anchor', async () => {
      const fixture = createInteractiveLink({ target: '_self', ariaLabel: 'open docs' });
      const host = queryByTestId(fixture, 'link');
      const anchor = host.querySelector('a.link') as HTMLAnchorElement;

      await flush(fixture);

      expect(anchor.getAttribute('href')).toBe('https://example.com');
      expect(anchor.getAttribute('target')).toBe('_self');
      expect(anchor.getAttribute('aria-label')).toBe('open docs');
    });

    it('auto-sets rel to noopener noreferrer for a blank target', () => {
      const fixture = createInteractiveLink({ target: '_blank' });
      const host = queryByTestId(fixture, 'link');
      const anchor = host.querySelector('a.link') as HTMLAnchorElement;

      expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('lets a consumer rel override the auto rel for a blank target', () => {
      const fixture = createInteractiveLink({ target: '_blank', rel: 'author' });
      const host = queryByTestId(fixture, 'link');
      const anchor = host.querySelector('a.link') as HTMLAnchorElement;

      expect(anchor.getAttribute('rel')).toBe('author');
    });

    it('reflects download, hreflang, and referrer policy on the anchor', () => {
      const fixture = createInteractiveLink({
        download: 'report.pdf',
        hreflang: 'en',
        referrerPolicy: 'no-referrer',
      });
      const host = queryByTestId(fixture, 'link');
      const anchor = host.querySelector('a.link') as HTMLAnchorElement;

      expect(anchor.getAttribute('download')).toBe('report.pdf');
      expect(anchor.getAttribute('hreflang')).toBe('en');
      expect(anchor.getAttribute('referrerpolicy')).toBe('no-referrer');
    });

    it('omits role and tabindex when an href is provided', () => {
      const fixture = createInteractiveLink();
      const host = queryByTestId(fixture, 'link');
      const anchor = host.querySelector('a.link') as HTMLAnchorElement;

      expect(anchor.getAttribute('role')).toBeNull();
      expect(anchor.getAttribute('tabindex')).toBeNull();
    });
  });

  describe('action-link mode', () => {
    it('renders an anchor with role button and tabindex zero when no href', async () => {
      const fixture = createInteractiveLink({ href: undefined });
      fixture.componentInstance.href.set(undefined);
      await flush(fixture);
      const host = queryByTestId(fixture, 'link');
      const anchor = host.querySelector('a.link') as HTMLAnchorElement;

      expect(anchor).not.toBeNull();
      expect(anchor.getAttribute('role')).toBe('button');
      expect(anchor.getAttribute('tabindex')).toBe('0');
    });

    it('omits the href attribute in action-link mode', async () => {
      const fixture = createInteractiveLink();
      fixture.componentInstance.href.set(undefined);
      await flush(fixture);
      const host = queryByTestId(fixture, 'link');
      const anchor = host.querySelector('a.link') as HTMLAnchorElement;

      expect(anchor.getAttribute('href')).toBeNull();
    });

    it('exposes isActionLink as true when no href', async () => {
      const fixture = createInteractiveLink();
      fixture.componentInstance.href.set(undefined);
      await flush(fixture);
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('isActionLink=true');
    });
  });

  describe('disabled state', () => {
    it('renders a span instead of an anchor when disabled', () => {
      const fixture = createInteractiveLink({ target: '_blank', disabled: true });
      const host = queryByTestId(fixture, 'link');

      expect(host.querySelector('a.link')).toBeNull();
      expect(host.querySelector('span.link')).not.toBeNull();
    });

    it('applies data-disabled and tabindex negative one to the disabled span', () => {
      const fixture = createInteractiveLink({ disabled: true });
      const host = queryByTestId(fixture, 'link');
      const span = host.querySelector('span.link') as HTMLSpanElement;

      expect(span.getAttribute('data-disabled')).toBe('1');
      expect(span.getAttribute('tabindex')).toBe('-1');
    });

    it('clears href, target, and rel on the disabled span', () => {
      const fixture = createInteractiveLink({ target: '_blank', disabled: true });
      const host = queryByTestId(fixture, 'link');
      const span = host.querySelector('span.link') as HTMLSpanElement;

      expect(span.getAttribute('href')).toBeNull();
      expect(span.getAttribute('target')).toBeNull();
      expect(span.getAttribute('rel')).toBeNull();
    });
  });

  describe('clicked output', () => {
    it('emits clicked on a pointer click in action-link mode', async () => {
      const fixture = createInteractiveLink();
      fixture.componentInstance.href.set(undefined);
      await flush(fixture);

      const host = queryByTestId(fixture, 'link');
      const anchor = host.querySelector('a.link') as HTMLAnchorElement;
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('clickCount=0');

      await userEvent.click(anchor);
      await flush(fixture);

      expect(readout.textContent).toContain('clickCount=1');
    });

    it('emits clicked on the Enter key in action-link mode', async () => {
      const fixture = createInteractiveLink();
      fixture.componentInstance.href.set(undefined);
      await flush(fixture);

      const host = queryByTestId(fixture, 'link');
      const anchor = host.querySelector('a.link') as HTMLAnchorElement;
      const readout = queryByTestId(fixture, 'readout');

      const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true, bubbles: true });
      anchor.dispatchEvent(event);

      await waitFor(() => {
        expect(readout.textContent).toContain('clickCount=1');
      });
    });

    it('emits clicked on the Space key in action-link mode', async () => {
      const fixture = createInteractiveLink();
      fixture.componentInstance.href.set(undefined);
      await flush(fixture);

      const host = queryByTestId(fixture, 'link');
      const anchor = host.querySelector('a.link') as HTMLAnchorElement;
      const readout = queryByTestId(fixture, 'readout');

      const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true, bubbles: true });
      anchor.dispatchEvent(event);

      await waitFor(() => {
        expect(readout.textContent).toContain('clickCount=1');
      });
    });

    it('does not emit clicked on other keys in action-link mode', async () => {
      const fixture = createInteractiveLink();
      fixture.componentInstance.href.set(undefined);
      await flush(fixture);

      const host = queryByTestId(fixture, 'link');
      const anchor = host.querySelector('a.link') as HTMLAnchorElement;
      const readout = queryByTestId(fixture, 'readout');

      const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true, bubbles: true });
      anchor.dispatchEvent(event);
      await flush(fixture);

      expect(readout.textContent).toContain('clickCount=0');
    });

    it('does not emit clicked when an href is provided', async () => {
      const fixture = createInteractiveLink();
      const host = queryByTestId(fixture, 'link');
      const anchor = host.querySelector('a.link') as HTMLAnchorElement;
      const readout = queryByTestId(fixture, 'readout');

      anchor.addEventListener('click', (event) => event.preventDefault(), { once: true });
      await userEvent.click(anchor);
      await flush(fixture);

      expect(readout.textContent).toContain('clickCount=0');
    });

    it('does not emit clicked when disabled', async () => {
      const fixture = createInteractiveLink({ disabled: true });
      fixture.componentInstance.href.set(undefined);
      await flush(fixture);

      const host = queryByTestId(fixture, 'link');
      const span = host.querySelector('span.link') as HTMLSpanElement;
      const readout = queryByTestId(fixture, 'readout');

      // dispatched click bypasses the css pointer-events:none guard so we exercise the underlying handler-gated path
      span.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      await flush(fixture);

      expect(readout.textContent).toContain('clickCount=0');
    });
  });

  describe('affordance icon', () => {
    it('renders no affordance icon for an internal link', () => {
      const fixture = createInteractiveLink();
      const host = queryByTestId(fixture, 'link');

      expect(host.querySelector('org-icon[data-position="post"]')).toBeNull();
    });

    it('renders the external-link affordance icon for a blank target', async () => {
      const fixture = createInteractiveLink();
      fixture.componentInstance.target.set('_blank');
      await flush(fixture);

      const host = queryByTestId(fixture, 'link');
      const icon = host.querySelector('org-icon[data-position="post"]') as HTMLElement;

      expect(icon).not.toBeNull();
      expect(icon.getAttribute('data-icon')).toBe('external-link');
    });

    it('renders the download affordance icon when a download is set', async () => {
      const fixture = createInteractiveLink();
      fixture.componentInstance.download.set('report.pdf');
      await flush(fixture);

      const host = queryByTestId(fixture, 'link');
      const icon = host.querySelector('org-icon[data-position="post"]') as HTMLElement;

      expect(icon).not.toBeNull();
      expect(icon.getAttribute('data-icon')).toBe('download');
    });

    it('renders the download affordance icon when both a blank target and download are set', async () => {
      const fixture = createInteractiveLink();
      fixture.componentInstance.target.set('_blank');
      fixture.componentInstance.download.set('report.pdf');
      await flush(fixture);

      const host = queryByTestId(fixture, 'link');
      const icon = host.querySelector('org-icon[data-position="post"]') as HTMLElement;

      expect(icon.getAttribute('data-icon')).toBe('download');
    });

    it('renders no affordance icon when affordance is false', async () => {
      const fixture = createInteractiveLink();
      fixture.componentInstance.target.set('_blank');
      fixture.componentInstance.affordance.set(false);
      await flush(fixture);

      const host = queryByTestId(fixture, 'link');

      expect(host.querySelector('org-icon[data-position="post"]')).toBeNull();
    });

    it('renders no affordance icon in action-link mode', async () => {
      const fixture = createInteractiveLink();
      fixture.componentInstance.target.set('_blank');
      fixture.componentInstance.href.set(undefined);
      await flush(fixture);

      const host = queryByTestId(fixture, 'link');

      expect(host.querySelector('org-icon[data-position="post"]')).toBeNull();
    });

    it('renders no affordance icon when disabled', async () => {
      const fixture = createInteractiveLink();
      fixture.componentInstance.target.set('_blank');
      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      const host = queryByTestId(fixture, 'link');

      expect(host.querySelector('org-icon[data-position="post"]')).toBeNull();
    });

    it('suppresses the auto affordance icon when a post template is provided', () => {
      const fixture = createFixture(LinkPostSuppressHost);
      const host = queryByTestId(fixture, 'link');

      expect(host.querySelector('org-icon[data-position="post"]')).toBeNull();
      expect(host.querySelector('[data-testid="custom-post"]')).not.toBeNull();
    });
  });

  describe('content projection', () => {
    it('renders projected default content', () => {
      const fixture = createFixture(LinkContentProjectionHost);
      const host = queryByTestId(fixture, 'link-default');

      expect(host.querySelector('[data-testid="default-content"]')).not.toBeNull();
    });

    it('renders the projected pre template', () => {
      const fixture = createFixture(LinkContentProjectionHost);
      const host = queryByTestId(fixture, 'link-pre');

      expect(host.querySelector('[data-testid="custom-pre"]')).not.toBeNull();
    });

    it('renders the projected post template', () => {
      const fixture = createFixture(LinkContentProjectionHost);
      const host = queryByTestId(fixture, 'link-post');

      expect(host.querySelector('[data-testid="custom-post"]')).not.toBeNull();
    });
  });
});
