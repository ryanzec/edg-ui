import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, it, expect, vi } from 'vitest';

import { Link } from './link';
import { type LinkReferrerPolicy, type LinkTarget } from './link-brain';

describe('Link', () => {
  describe('rendering with href', () => {
    @Component({
      selector: 'test-link-href-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Link],
      template: `
        <org-link
          [href]="href()"
          [target]="target()"
          [rel]="rel()"
          [download]="download()"
          [hreflang]="hreflang()"
          [referrerPolicy]="referrerPolicy()"
          [ariaLabel]="ariaLabel()"
          [affordance]="false"
          data-testid="link"
        >
          docs
        </org-link>
      `,
    })
    class LinkHrefHost {
      public readonly href = signal<string>('https://example.com');
      public readonly target = signal<LinkTarget | undefined>(undefined);
      public readonly rel = signal<string | undefined>(undefined);
      public readonly download = signal<string | undefined>(undefined);
      public readonly hreflang = signal<string | undefined>(undefined);
      public readonly referrerPolicy = signal<LinkReferrerPolicy | undefined>(undefined);
      public readonly ariaLabel = signal<string | undefined>(undefined);
    }

    let fixture: ComponentFixture<LinkHrefHost>;
    let component: LinkHrefHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LinkHrefHost],
      }).compileComponents();

      fixture = TestBed.createComponent(LinkHrefHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    const getAnchor = () => fixture.nativeElement.querySelector('[data-testid="link"] a') as HTMLAnchorElement | null;

    const getSpan = () => fixture.nativeElement.querySelector('[data-testid="link"] span') as HTMLSpanElement | null;

    it('renders an anchor element (not a span) when href is provided', () => {
      expect(getAnchor()).not.toBeNull();
      expect(getSpan()).toBeNull();
    });

    it('reflects href, target, and aria-label inputs as attributes on the anchor', async () => {
      component.target.set('_self');
      component.ariaLabel.set('open docs');
      fixture.detectChanges();
      await fixture.whenStable();

      const anchor = getAnchor() as HTMLAnchorElement;

      expect(anchor.getAttribute('href')).toBe('https://example.com');
      expect(anchor.getAttribute('target')).toBe('_self');
      expect(anchor.getAttribute('aria-label')).toBe('open docs');
    });

    it('auto-sets rel="noopener noreferrer" when target is "_blank" and no consumer rel is provided', async () => {
      component.target.set('_blank');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getAnchor()?.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('uses the consumer-provided rel over the auto value when target is "_blank"', async () => {
      component.target.set('_blank');
      component.rel.set('author');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getAnchor()?.getAttribute('rel')).toBe('author');
    });

    it('reflects download, hreflang, and referrerpolicy inputs as attributes on the anchor', async () => {
      component.download.set('report.pdf');
      component.hreflang.set('en');
      component.referrerPolicy.set('no-referrer');
      fixture.detectChanges();
      await fixture.whenStable();

      const anchor = getAnchor() as HTMLAnchorElement;

      expect(anchor.getAttribute('download')).toBe('report.pdf');
      expect(anchor.getAttribute('hreflang')).toBe('en');
      expect(anchor.getAttribute('referrerpolicy')).toBe('no-referrer');
    });

    it('omits role and tabindex attributes when an href is provided', () => {
      const anchor = getAnchor() as HTMLAnchorElement;

      expect(anchor.getAttribute('role')).toBeNull();
      expect(anchor.getAttribute('tabindex')).toBeNull();
    });
  });

  describe('rendering as action link (no href)', () => {
    @Component({
      selector: 'test-link-action-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Link],
      template: `<org-link data-testid="link">run action</org-link>`,
    })
    class LinkActionHost {}

    let fixture: ComponentFixture<LinkActionHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LinkActionHost],
      }).compileComponents();

      fixture = TestBed.createComponent(LinkActionHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders an anchor element with role="button" and tabindex="0"', () => {
      const anchor = fixture.nativeElement.querySelector('[data-testid="link"] a') as HTMLAnchorElement;

      expect(anchor).not.toBeNull();
      expect(anchor.getAttribute('role')).toBe('button');
      expect(anchor.getAttribute('tabindex')).toBe('0');
    });

    it('omits the href attribute when no href is provided', () => {
      const anchor = fixture.nativeElement.querySelector('[data-testid="link"] a') as HTMLAnchorElement;

      expect(anchor.getAttribute('href')).toBeNull();
    });

    it('exposes isActionLink as true on the component', () => {
      const linkComponent = fixture.debugElement.children[0].componentInstance as Link;

      expect(linkComponent.isActionLink()).toBe(true);
    });
  });

  describe('rendering when disabled', () => {
    @Component({
      selector: 'test-link-disabled-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Link],
      template: `<org-link href="https://example.com" target="_blank" [disabled]="true" data-testid="link"
        >docs</org-link
      >`,
    })
    class LinkDisabledHost {}

    let fixture: ComponentFixture<LinkDisabledHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LinkDisabledHost],
      }).compileComponents();

      fixture = TestBed.createComponent(LinkDisabledHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders a span element (not an anchor) when disabled', () => {
      const anchor = fixture.nativeElement.querySelector('[data-testid="link"] a');
      const span = fixture.nativeElement.querySelector('[data-testid="link"] span');

      expect(anchor).toBeNull();
      expect(span).not.toBeNull();
    });

    it('sets data-disabled="1" and tabindex="-1" on the rendered span', () => {
      const span = fixture.nativeElement.querySelector('[data-testid="link"] span') as HTMLSpanElement;

      expect(span.getAttribute('data-disabled')).toBe('1');
      expect(span.getAttribute('tabindex')).toBe('-1');
    });

    it('clears href, target, and rel attributes on the rendered span', () => {
      const span = fixture.nativeElement.querySelector('[data-testid="link"] span') as HTMLSpanElement;

      expect(span.getAttribute('href')).toBeNull();
      expect(span.getAttribute('target')).toBeNull();
      expect(span.getAttribute('rel')).toBeNull();
    });
  });

  describe('clicked output', () => {
    @Component({
      selector: 'test-link-clicked-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Link],
      template: `
        <org-link [href]="href()" [disabled]="disabled()" (clicked)="onClicked()" data-testid="link">go</org-link>
      `,
    })
    class LinkClickedHost {
      public readonly href = signal<string | undefined>(undefined);
      public readonly disabled = signal<boolean>(false);
      public onClicked = vi.fn();
    }

    let fixture: ComponentFixture<LinkClickedHost>;
    let component: LinkClickedHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LinkClickedHost],
      }).compileComponents();

      fixture = TestBed.createComponent(LinkClickedHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    const getAnchor = () => fixture.nativeElement.querySelector('[data-testid="link"] a') as HTMLAnchorElement;

    it('emits clicked when an action link (no href) is clicked', () => {
      getAnchor().click();

      expect(component.onClicked).toHaveBeenCalledTimes(1);
    });

    it('emits clicked when Enter is pressed on an action link', () => {
      getAnchor().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(component.onClicked).toHaveBeenCalledTimes(1);
    });

    it('emits clicked when Space is pressed on an action link', () => {
      getAnchor().dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

      expect(component.onClicked).toHaveBeenCalledTimes(1);
    });

    it('does not emit clicked on other keydowns in action mode', () => {
      getAnchor().dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

      expect(component.onClicked).not.toHaveBeenCalled();
    });

    it('does not emit clicked when an href is provided', async () => {
      component.href.set('https://example.com');
      fixture.detectChanges();
      await fixture.whenStable();

      const anchor = getAnchor();
      anchor.addEventListener('click', (event) => event.preventDefault(), { once: true });
      anchor.click();

      expect(component.onClicked).not.toHaveBeenCalled();
    });

    it('does not emit clicked when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const span = fixture.nativeElement.querySelector('[data-testid="link"] span') as HTMLSpanElement;
      span.click();

      expect(component.onClicked).not.toHaveBeenCalled();
    });
  });

  describe('affordance icon rendering', () => {
    @Component({
      selector: 'test-link-affordance-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Link],
      template: `
        <org-link
          [href]="href()"
          [target]="target()"
          [download]="download()"
          [disabled]="disabled()"
          [affordance]="affordance()"
          data-testid="link"
        >
          docs
        </org-link>
      `,
    })
    class LinkAffordanceHost {
      public readonly href = signal<string | undefined>('https://example.com');
      public readonly target = signal<LinkTarget | undefined>(undefined);
      public readonly download = signal<string | undefined>(undefined);
      public readonly disabled = signal<boolean>(false);
      public readonly affordance = signal<boolean>(true);
    }

    let fixture: ComponentFixture<LinkAffordanceHost>;
    let component: LinkAffordanceHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LinkAffordanceHost],
      }).compileComponents();

      fixture = TestBed.createComponent(LinkAffordanceHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    const getAffordanceIcon = () =>
      fixture.nativeElement.querySelector('[data-testid="link"] org-icon[data-position="post"]') as HTMLElement | null;

    it('does not render an affordance icon when target is not "_blank" and there is no download', () => {
      expect(getAffordanceIcon()).toBeNull();
    });

    it('renders the external-link affordance icon when target is "_blank"', async () => {
      component.target.set('_blank');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getAffordanceIcon()?.getAttribute('data-icon')).toBe('external-link');
    });

    it('renders the download affordance icon when the download input is set', async () => {
      component.download.set('report.pdf');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getAffordanceIcon()?.getAttribute('data-icon')).toBe('download');
    });

    it('uses the download icon when both target="_blank" and download are set', async () => {
      component.target.set('_blank');
      component.download.set('report.pdf');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getAffordanceIcon()?.getAttribute('data-icon')).toBe('download');
    });

    it('does not render the affordance icon when affordance is false', async () => {
      component.target.set('_blank');
      component.affordance.set(false);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getAffordanceIcon()).toBeNull();
    });

    it('does not render the affordance icon in action-link mode', async () => {
      component.href.set(undefined);
      component.target.set('_blank');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getAffordanceIcon()).toBeNull();
    });

    it('does not render the affordance icon when disabled', async () => {
      component.target.set('_blank');
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getAffordanceIcon()).toBeNull();
    });
  });

  describe('affordance icon suppression by #post template', () => {
    @Component({
      selector: 'test-link-affordance-post-suppress-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Link],
      template: `
        <org-link href="https://example.com" target="_blank" data-testid="link">
          docs
          <ng-template #post>
            <span data-testid="custom-post">custom</span>
          </ng-template>
        </org-link>
      `,
    })
    class LinkAffordancePostSuppressHost {}

    it('suppresses the auto affordance icon when a consumer #post template is provided', async () => {
      await TestBed.configureTestingModule({
        imports: [LinkAffordancePostSuppressHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(LinkAffordancePostSuppressHost);
      fixture.detectChanges();
      await fixture.whenStable();

      const root = fixture.nativeElement.querySelector('[data-testid="link"]') as HTMLElement;

      expect(root.querySelector('org-icon[data-position="post"]')).toBeNull();
      expect(root.querySelector('[data-testid="custom-post"]')).not.toBeNull();
    });
  });

  describe('content projection', () => {
    @Component({
      selector: 'test-link-projection-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Link],
      template: `
        <org-link href="https://example.com" [affordance]="false" data-testid="default">
          <span data-testid="default-content">default body</span>
        </org-link>

        <org-link href="https://example.com" [affordance]="false" data-testid="pre">
          <ng-template #pre>
            <span data-testid="custom-pre">pre body</span>
          </ng-template>
          main
        </org-link>

        <org-link href="https://example.com" [affordance]="false" data-testid="post">
          main
          <ng-template #post>
            <span data-testid="custom-post">post body</span>
          </ng-template>
        </org-link>
      `,
    })
    class LinkProjectionHost {}

    let fixture: ComponentFixture<LinkProjectionHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LinkProjectionHost],
      }).compileComponents();

      fixture = TestBed.createComponent(LinkProjectionHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders projected default content inside the anchor', () => {
      const root = fixture.nativeElement.querySelector('[data-testid="default"]') as HTMLElement;

      expect(root.querySelector('[data-testid="default-content"]')).not.toBeNull();
    });

    it('renders the projected #pre template inside the anchor', () => {
      const root = fixture.nativeElement.querySelector('[data-testid="pre"]') as HTMLElement;

      expect(root.querySelector('[data-testid="custom-pre"]')).not.toBeNull();
    });

    it('renders the projected #post template inside the anchor', () => {
      const root = fixture.nativeElement.querySelector('[data-testid="post"]') as HTMLElement;

      expect(root.querySelector('[data-testid="custom-post"]')).not.toBeNull();
    });
  });
});
