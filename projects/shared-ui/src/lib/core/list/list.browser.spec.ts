import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { List, type ListBorderVariant, type ListSelectMode, type ListSize } from './list';
import { ListItem, type ListItemTag } from './list-item';
import { ListItemIcon } from './list-item-icon';
import { ListItemImage } from './list-item-image';

@Component({
  selector: 'test-list-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [List, ListItem],
  host: { class: 'block' },
  template: `
    <org-list
      data-testid="list"
      [size]="size()"
      [selectMode]="selectMode()"
      [borderVariant]="borderVariant()"
      [listRole]="listRole()"
    >
      <org-list-item
        data-testid="item"
        [label]="label()"
        [asTag]="asTag()"
        [isSelected]="isSelected()"
        [disabled]="disabled()"
        [href]="href()"
        [isExternalHref]="isExternalHref()"
        [overrideSize]="overrideSize()"
        [forceClickable]="forceClickable()"
        [hideLabel]="hideLabel()"
        (clicked)="handleClicked()"
      />
    </org-list>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class ListInteractiveHost {
  public readonly size = signal<ListSize>('sm');
  public readonly selectMode = signal<ListSelectMode | null | undefined>(undefined);
  public readonly borderVariant = signal<ListBorderVariant | null | undefined>(undefined);
  public readonly listRole = signal<string | null | undefined>(undefined);
  public readonly label = signal<string>('Item');
  public readonly asTag = signal<ListItemTag | null | undefined>(undefined);
  public readonly isSelected = signal<boolean>(false);
  public readonly disabled = signal<boolean>(false);
  public readonly href = signal<string | null | undefined>(undefined);
  public readonly isExternalHref = signal<boolean>(false);
  public readonly overrideSize = signal<ListSize | null | undefined>(undefined);
  public readonly forceClickable = signal<boolean>(false);
  public readonly hideLabel = signal<boolean>(false);

  protected readonly clickCount = signal<number>(0);

  protected readout(): string {
    return `clickCount=${this.clickCount()}`;
  }

  protected handleClicked(): void {
    this.clickCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'test-list-no-observer-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [List, ListItem],
  host: { class: 'block' },
  template: `
    <org-list>
      <org-list-item data-testid="anchor-no-link" label="anchor-no-link" asTag="a" />
      <org-list-item data-testid="anchor-with-href" label="anchor-with-href" asTag="a" href="https://example.com" />
      <org-list-item data-testid="fallback" label="fallback" />
      <org-list-item data-testid="button-item" label="button" asTag="button" />
    </org-list>
  `,
})
class ListNoObserverHost {}

@Component({
  selector: 'test-list-projection-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [List, ListItem, ListItemIcon, ListItemImage],
  host: { class: 'block' },
  template: `
    <org-list>
      <org-list-item data-testid="item-icons" label="With icons">
        <org-list-item-icon pre name="check" />
        <org-list-item-icon post name="chevron-right" />
      </org-list-item>
      <org-list-item data-testid="item-image" label="With image">
        <org-list-item-image pre src="https://example.com/avatar.png" alt="profile" />
      </org-list-item>
      <org-list-item data-testid="item-projected" label="Custom slots">
        <span pre data-testid="custom-pre">custom-pre</span>
        <span post data-testid="custom-post">custom-post</span>
      </org-list-item>
    </org-list>
  `,
})
class ListProjectionHost {}

@Component({
  selector: 'test-list-router-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [List, ListItem],
  host: { class: 'block' },
  template: `
    <org-list>
      <org-list-item data-testid="subset" label="subset" asTag="a" routerLink="/products" [routerMatchExact]="false" />
      <org-list-item data-testid="exact" label="exact" asTag="a" routerLink="/products" [routerMatchExact]="true" />
    </org-list>
  `,
})
class ListRouterHost {
  private readonly _router = inject(Router);

  public navigate(path: string): Promise<boolean> {
    return this._router.navigateByUrl(path);
  }
}

type ListHostConfig = {
  size?: ListSize;
  selectMode?: ListSelectMode | null;
  borderVariant?: ListBorderVariant | null;
  listRole?: string | null;
  label?: string;
  asTag?: ListItemTag | null;
  isSelected?: boolean;
  disabled?: boolean;
  href?: string | null;
  isExternalHref?: boolean;
  overrideSize?: ListSize | null;
  forceClickable?: boolean;
  hideLabel?: boolean;
};

describe('List (browser)', () => {
  const { createFixture, flush, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractiveList = (config: ListHostConfig = {}): ComponentFixture<ListInteractiveHost> =>
    createFixture(ListInteractiveHost, (instance) => {
      if (config.size !== undefined) {
        instance.size.set(config.size);
      }

      if (config.selectMode !== undefined) {
        instance.selectMode.set(config.selectMode);
      }

      if (config.borderVariant !== undefined) {
        instance.borderVariant.set(config.borderVariant);
      }

      if (config.listRole !== undefined) {
        instance.listRole.set(config.listRole);
      }

      if (config.label !== undefined) {
        instance.label.set(config.label);
      }

      if (config.asTag !== undefined) {
        instance.asTag.set(config.asTag);
      }

      if (config.isSelected !== undefined) {
        instance.isSelected.set(config.isSelected);
      }

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }

      if (config.href !== undefined) {
        instance.href.set(config.href);
      }

      if (config.isExternalHref !== undefined) {
        instance.isExternalHref.set(config.isExternalHref);
      }

      if (config.overrideSize !== undefined) {
        instance.overrideSize.set(config.overrideSize);
      }

      if (config.forceClickable !== undefined) {
        instance.forceClickable.set(config.forceClickable);
      }

      if (config.hideLabel !== undefined) {
        instance.hideLabel.set(config.hideLabel);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('list host reflection', () => {
    it('renders default host attributes for size, select-mode, and border-variant', () => {
      const fixture = createInteractiveList();
      const host = queryByTestId(fixture, 'list');

      expect(host.getAttribute('data-size')).toBe('sm');
      expect(host.getAttribute('data-select-mode')).toBeNull();
      expect(host.getAttribute('data-border-variant')).toBeNull();
    });

    it('reflects the list size input on the host', async () => {
      const fixture = createInteractiveList();
      const host = queryByTestId(fixture, 'list');

      fixture.componentInstance.size.set('base');
      await flush(fixture);

      expect(host.getAttribute('data-size')).toBe('base');
    });

    it('reflects the list select-mode input on the host', async () => {
      const fixture = createInteractiveList();
      const host = queryByTestId(fixture, 'list');

      fixture.componentInstance.selectMode.set('single');
      await flush(fixture);
      expect(host.getAttribute('data-select-mode')).toBe('single');

      fixture.componentInstance.selectMode.set('multiple');
      await flush(fixture);
      expect(host.getAttribute('data-select-mode')).toBe('multiple');
    });

    it('transforms a null list select-mode into an omitted attribute', async () => {
      const fixture = createInteractiveList();
      const host = queryByTestId(fixture, 'list');

      fixture.componentInstance.selectMode.set('single');
      await flush(fixture);
      expect(host.getAttribute('data-select-mode')).toBe('single');

      fixture.componentInstance.selectMode.set(null);
      await flush(fixture);
      expect(host.getAttribute('data-select-mode')).toBeNull();
    });

    it('reflects the list border-variant input on the host', async () => {
      const fixture = createInteractiveList();
      const host = queryByTestId(fixture, 'list');

      fixture.componentInstance.borderVariant.set('outer');
      await flush(fixture);

      expect(host.getAttribute('data-border-variant')).toBe('outer');
    });

    it('defaults the inner ul role to null', () => {
      const fixture = createInteractiveList();
      const host = queryByTestId(fixture, 'list');
      const innerUl = host.querySelector('ul') as HTMLUListElement;

      expect(innerUl.getAttribute('role')).toBeNull();
    });

    it('applies the list-role input to the inner ul', async () => {
      const fixture = createInteractiveList();
      const host = queryByTestId(fixture, 'list');

      fixture.componentInstance.listRole.set('menu');
      await flush(fixture);

      const innerUl = host.querySelector('ul') as HTMLUListElement;

      expect(innerUl.getAttribute('role')).toBe('menu');
    });

    it('transforms a null list-role into an omitted role on the inner ul', async () => {
      const fixture = createInteractiveList();
      const host = queryByTestId(fixture, 'list');

      fixture.componentInstance.listRole.set('menu');
      await flush(fixture);
      expect((host.querySelector('ul') as HTMLUListElement).getAttribute('role')).toBe('menu');

      fixture.componentInstance.listRole.set(null);
      await flush(fixture);
      expect((host.querySelector('ul') as HTMLUListElement).getAttribute('role')).toBeNull();
    });
  });

  describe('list-item host reflection', () => {
    it('gives the item a listitem role', () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      expect(item.getAttribute('role')).toBe('listitem');
    });

    it('inherits the size from the parent list', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      expect(item.getAttribute('data-size')).toBe('sm');

      fixture.componentInstance.size.set('base');
      await flush(fixture);

      expect(item.getAttribute('data-size')).toBe('base');
    });

    it('uses override-size over the parent list size', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      fixture.componentInstance.size.set('sm');
      fixture.componentInstance.overrideSize.set('base');
      await flush(fixture);

      expect(item.getAttribute('data-size')).toBe('base');
    });

    it('reflects the parent select-mode on the item', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      expect(item.getAttribute('data-parent-select-mode')).toBeNull();

      fixture.componentInstance.selectMode.set('single');
      await flush(fixture);

      expect(item.getAttribute('data-parent-select-mode')).toBe('single');
    });

    it('omits the disabled attributes by default', () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      expect(item.getAttribute('aria-disabled')).toBeNull();
      expect(item.getAttribute('data-disabled')).toBeNull();
    });

    it('sets aria-disabled and data-disabled when disabled', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      expect(item.getAttribute('aria-disabled')).toBe('true');
      expect(item.getAttribute('data-disabled')).toBe('');
    });

    it('omits data-selected by default', () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      expect(item.getAttribute('data-selected')).toBeNull();
    });

    it('adds data-selected when isSelected is set', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      fixture.componentInstance.isSelected.set(true);
      await flush(fixture);

      expect(item.getAttribute('data-selected')).toBe('');
    });

    it('adds the force-clickable data attribute when forceClickable is set', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      expect(item.getAttribute('data-force-clickable')).toBeNull();

      fixture.componentInstance.forceClickable.set(true);
      await flush(fixture);

      expect(item.getAttribute('data-force-clickable')).toBe('');
    });

    it('adds the is-external-href data attribute when isExternalHref is set', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      expect(item.getAttribute('data-is-external-href')).toBeNull();

      fixture.componentInstance.isExternalHref.set(true);
      await flush(fixture);

      expect(item.getAttribute('data-is-external-href')).toBe('');
    });
  });

  describe('list-item tag rendering', () => {
    it('renders a div for the fallback item', () => {
      const fixture = createFixture(ListNoObserverHost);
      const item = queryByTestId(fixture, 'fallback');

      expect(item.getAttribute('data-as-tag')).toBeNull();
      expect(item.querySelector('div.list-item-content')).not.toBeNull();
      expect(item.querySelector('a')).toBeNull();
      expect(item.querySelector('button')).toBeNull();
    });

    it('renders an anchor when asTag is a', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      fixture.componentInstance.asTag.set('a');
      fixture.componentInstance.href.set('https://example.com');
      await flush(fixture);

      expect(item.getAttribute('data-as-tag')).toBe('a');
      expect(item.querySelector('a.list-item-content')).not.toBeNull();
    });

    it('renders a button when asTag is button', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      fixture.componentInstance.asTag.set('button');
      await flush(fixture);

      expect(item.getAttribute('data-as-tag')).toBe('button');

      const innerButton = item.querySelector('button.list-item-content') as HTMLButtonElement;

      expect(innerButton).not.toBeNull();
      expect(innerButton.type).toBe('button');
    });

    it('renders the label inside a span', () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');
      const labelSpan = item.querySelector('span') as HTMLSpanElement;

      expect(labelSpan.textContent?.trim()).toBe('Item');
      expect(labelSpan.classList.contains('flex-1')).toBe(true);
      expect(labelSpan.classList.contains('sr-only')).toBe(false);
    });

    it('applies sr-only to the label when hideLabel is set', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      fixture.componentInstance.hideLabel.set(true);
      await flush(fixture);

      const labelSpan = item.querySelector('span') as HTMLSpanElement;

      expect(labelSpan.classList.contains('sr-only')).toBe(true);
      expect(labelSpan.classList.contains('flex-1')).toBe(false);
    });
  });

  describe('list-item anchor behavior', () => {
    it('adds target blank and rel for an external href', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      fixture.componentInstance.asTag.set('a');
      fixture.componentInstance.href.set('https://example.com');
      fixture.componentInstance.isExternalHref.set(true);
      await flush(fixture);

      const anchor = item.querySelector('a') as HTMLAnchorElement;

      expect(anchor.getAttribute('target')).toBe('_blank');
      expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('renders the auto external-href icon for an external href', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      expect(item.querySelector('.external-href-icon')).toBeNull();

      fixture.componentInstance.asTag.set('a');
      fixture.componentInstance.href.set('https://example.com');
      fixture.componentInstance.isExternalHref.set(true);
      await flush(fixture);

      const externalIcon = item.querySelector('.external-href-icon') as HTMLElement;

      expect(externalIcon).not.toBeNull();
      expect(externalIcon.querySelector('org-icon')?.getAttribute('data-icon')).toBe('arrow-up-right');
    });

    it('uses self target and no rel for a non-external href', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      fixture.componentInstance.asTag.set('a');
      fixture.componentInstance.href.set('https://example.com');
      await flush(fixture);

      const anchor = item.querySelector('a') as HTMLAnchorElement;

      expect(anchor.getAttribute('target')).toBe('_self');
      expect(anchor.getAttribute('rel')).toBeNull();
    });

    it('passes the href to the anchor when set', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      fixture.componentInstance.asTag.set('a');
      fixture.componentInstance.href.set('https://example.com');
      await flush(fixture);

      const anchor = item.querySelector('a') as HTMLAnchorElement;

      expect(anchor.getAttribute('href')).toBe('https://example.com');
    });
  });

  describe('list-item clickable detection', () => {
    it('treats the fallback div as clickable by default', () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      expect(item.getAttribute('data-clickable')).toBe('');
    });

    it('removes clickable when disabled', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      expect(item.getAttribute('data-clickable')).toBeNull();
    });

    it('is not clickable for an anchor with no link and no click observer', () => {
      const fixture = createFixture(ListNoObserverHost);
      const anchorNoLink = queryByTestId(fixture, 'anchor-no-link');

      expect(anchorNoLink.getAttribute('data-clickable')).toBeNull();
    });

    it('is clickable for an anchor with an href even without an observer', () => {
      const fixture = createFixture(ListNoObserverHost);
      const anchorWithHref = queryByTestId(fixture, 'anchor-with-href');

      expect(anchorWithHref.getAttribute('data-clickable')).toBe('');
    });

    it('is clickable for a button item even without an observer', () => {
      const fixture = createFixture(ListNoObserverHost);
      const buttonItem = queryByTestId(fixture, 'button-item');

      expect(buttonItem.getAttribute('data-clickable')).toBe('');
    });

    it('is clickable for the fallback item even without an observer', () => {
      const fixture = createFixture(ListNoObserverHost);
      const fallback = queryByTestId(fixture, 'fallback');

      expect(fallback.getAttribute('data-clickable')).toBe('');
    });

    it('enables clickable when a click observer is present', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');

      fixture.componentInstance.asTag.set('a');
      await flush(fixture);

      expect(item.getAttribute('data-clickable')).toBe('');
    });
  });

  describe('list-item clicked output', () => {
    it('emits clicked on the fallback item', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');
      const readout = queryByTestId(fixture, 'readout');
      const content = item.querySelector('.list-item-content') as HTMLElement;

      expect(readout.textContent).toContain('clickCount=0');

      await userEvent.click(content);
      await flush(fixture);

      expect(readout.textContent).toContain('clickCount=1');
    });

    it('emits clicked on the button item', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.asTag.set('button');
      await flush(fixture);

      const innerButton = item.querySelector('button') as HTMLButtonElement;

      expect(innerButton).not.toBeNull();

      await userEvent.click(innerButton);
      await flush(fixture);

      expect(readout.textContent).toContain('clickCount=1');
    });

    it('suppresses the clicked emission when disabled', async () => {
      const fixture = createInteractiveList();
      const item = queryByTestId(fixture, 'item');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      const content = item.querySelector('.list-item-content') as HTMLElement;

      // the content button carries the native `disabled` attribute, so playwright's userEvent.click
      // refuses to interact with it; dispatch a synthetic click to exercise the handler-gated path.
      content.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await flush(fixture);

      expect(readout.textContent).toContain('clickCount=0');
    });
  });

  describe('list-item projection', () => {
    it('renders projected list-item-icons as org-icon with the right name', () => {
      const fixture = createFixture(ListProjectionHost);
      const itemIcons = queryByTestId(fixture, 'item-icons');
      const preIcon = itemIcons.querySelector('org-list-item-icon[pre] org-icon') as HTMLElement;
      const postIcon = itemIcons.querySelector('org-list-item-icon[post] org-icon') as HTMLElement;

      expect(preIcon).not.toBeNull();
      expect(preIcon.getAttribute('data-icon')).toBe('check');

      expect(postIcon).not.toBeNull();
      expect(postIcon.getAttribute('data-icon')).toBe('chevron-right');
    });

    it('renders a projected list-item-image as an img with src and alt', () => {
      const fixture = createFixture(ListProjectionHost);
      const itemImage = queryByTestId(fixture, 'item-image');
      const img = itemImage.querySelector('org-list-item-image img') as HTMLImageElement;

      expect(img).not.toBeNull();
      expect(img.getAttribute('src')).toContain('https://example.com/avatar.png');
      expect(img.getAttribute('alt')).toBe('profile');
    });

    it('renders projected pre content', () => {
      const fixture = createFixture(ListProjectionHost);
      const item = queryByTestId(fixture, 'item-projected');

      expect(item.querySelector('[data-testid="custom-pre"]')).not.toBeNull();
    });

    it('renders projected post content', () => {
      const fixture = createFixture(ListProjectionHost);
      const item = queryByTestId(fixture, 'item-projected');

      expect(item.querySelector('[data-testid="custom-post"]')).not.toBeNull();
    });
  });

  describe('list-item router activation', () => {
    let routerFixture: ComponentFixture<ListRouterHost> | undefined;

    const createRouterFixture = (): ComponentFixture<ListRouterHost> => {
      const fixture = TestBed.createComponent(ListRouterHost);

      routerFixture = fixture;
      document.body.appendChild(fixture.nativeElement);
      fixture.detectChanges();

      return fixture;
    };

    const waitForRouter = (assertion: () => void): Promise<void> =>
      vi.waitFor(
        async () => {
          routerFixture?.detectChanges();
          await routerFixture?.whenStable();
          assertion();
        },
        { timeout: 2000, interval: 20 }
      );

    beforeEach(async () => {
      // the shared harness compiles an empty module and instantiates the injector, so the module config
      // is frozen; reset and reconfigure with the router providers the router host needs.
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        providers: [provideRouter([])],
      }).compileComponents();
    });

    afterEach(() => {
      if (!routerFixture) {
        return;
      }

      const element = routerFixture.nativeElement as HTMLElement;

      routerFixture.destroy();
      element.remove();
      routerFixture = undefined;
    });

    it('selects a subset-match item on an exact path navigation', async () => {
      const fixture = createRouterFixture();
      const subset = queryByTestId(fixture, 'subset');

      await fixture.componentInstance.navigate('/other');
      await waitForRouter(() => expect(subset.getAttribute('data-selected')).toBeNull());

      await fixture.componentInstance.navigate('/products');
      await waitForRouter(() => expect(subset.getAttribute('data-selected')).toBe(''));
    });

    it('selects a subset-match item on a nested path navigation', async () => {
      const fixture = createRouterFixture();
      const subset = queryByTestId(fixture, 'subset');

      await fixture.componentInstance.navigate('/other');
      await waitForRouter(() => expect(subset.getAttribute('data-selected')).toBeNull());

      await fixture.componentInstance.navigate('/products/123');
      await waitForRouter(() => expect(subset.getAttribute('data-selected')).toBe(''));
    });

    it('selects an exact-match item only on the exact path', async () => {
      const fixture = createRouterFixture();
      const exact = queryByTestId(fixture, 'exact');

      await fixture.componentInstance.navigate('/other');
      await waitForRouter(() => expect(exact.getAttribute('data-selected')).toBeNull());

      await fixture.componentInstance.navigate('/products');
      await waitForRouter(() => expect(exact.getAttribute('data-selected')).toBe(''));
    });

    it('does not select an exact-match item on a nested path', async () => {
      const fixture = createRouterFixture();
      const exact = queryByTestId(fixture, 'exact');

      await fixture.componentInstance.navigate('/other');
      await waitForRouter(() => expect(exact.getAttribute('data-selected')).toBeNull());

      await fixture.componentInstance.navigate('/products/123');
      await waitForRouter(() => expect(exact.getAttribute('data-selected')).toBeNull());
    });

    it('adds aria-current page on the active anchor', async () => {
      const fixture = createRouterFixture();
      const subset = queryByTestId(fixture, 'subset');

      await fixture.componentInstance.navigate('/other');
      await waitForRouter(() => {
        const anchor = subset.querySelector('a') as HTMLAnchorElement;

        expect(anchor.getAttribute('aria-current')).toBeNull();
      });

      await fixture.componentInstance.navigate('/products');
      await waitForRouter(() => {
        const anchor = subset.querySelector('a') as HTMLAnchorElement;

        expect(anchor.getAttribute('aria-current')).toBe('page');
      });
    });

    it('resolves the routerLink href attribute on the anchor', async () => {
      const fixture = createRouterFixture();
      const subset = queryByTestId(fixture, 'subset');

      await waitForRouter(() => {
        const anchor = subset.querySelector('a') as HTMLAnchorElement;

        expect(anchor.getAttribute('href')).toBe('/products');
      });
    });
  });
});
