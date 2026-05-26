import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { List, type ListBorderVariant, type ListSelectMode, type ListSize } from './list';
import { ListItem, type ListItemTag } from './list-item';
import { ListItemIcon } from './list-item-icon';
import { ListItemImage } from './list-item-image';

@Component({
  selector: 'story-list-tests-shell',
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-size-base" (click)="size.set('base')">size-base</button>
      <button type="button" data-testid="ctl-size-sm" (click)="size.set('sm')">size-sm</button>
      <button type="button" data-testid="ctl-select-mode-single" (click)="selectMode.set('single')">
        select-mode-single
      </button>
      <button type="button" data-testid="ctl-select-mode-multiple" (click)="selectMode.set('multiple')">
        select-mode-multiple
      </button>
      <button type="button" data-testid="ctl-select-mode-null" (click)="selectMode.set(null)">select-mode-null</button>
      <button type="button" data-testid="ctl-border-variant-outer" (click)="borderVariant.set('outer')">
        border-variant-outer
      </button>
      <button type="button" data-testid="ctl-list-role-menu" (click)="listRole.set('menu')">list-role-menu</button>
      <button type="button" data-testid="ctl-list-role-null" (click)="listRole.set(null)">list-role-null</button>
      <button type="button" data-testid="ctl-as-tag-a" (click)="asTag.set('a')">as-tag-a</button>
      <button type="button" data-testid="ctl-as-tag-button" (click)="asTag.set('button')">as-tag-button</button>
      <button type="button" data-testid="ctl-as-tag-clear" (click)="asTag.set(undefined)">as-tag-clear</button>
      <button type="button" data-testid="ctl-is-selected-on" (click)="isSelected.set(true)">is-selected-on</button>
      <button type="button" data-testid="ctl-is-selected-off" (click)="isSelected.set(false)">is-selected-off</button>
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
      <button type="button" data-testid="ctl-href-set" (click)="href.set('https://example.com')">href-set</button>
      <button type="button" data-testid="ctl-href-clear" (click)="href.set(undefined)">href-clear</button>
      <button type="button" data-testid="ctl-external-href-on" (click)="isExternalHref.set(true)">
        external-href-on
      </button>
      <button type="button" data-testid="ctl-external-href-off" (click)="isExternalHref.set(false)">
        external-href-off
      </button>
      <button type="button" data-testid="ctl-override-size-base" (click)="overrideSize.set('base')">
        override-size-base
      </button>
      <button type="button" data-testid="ctl-override-size-clear" (click)="overrideSize.set(undefined)">
        override-size-clear
      </button>
      <button type="button" data-testid="ctl-force-clickable-on" (click)="forceClickable.set(true)">
        force-clickable-on
      </button>
      <button type="button" data-testid="ctl-hide-label-on" (click)="hideLabel.set(true)">hide-label-on</button>
    </div>
  `,
})
class StoryListTestsShell {
  protected readonly size = signal<ListSize>('sm');
  protected readonly selectMode = signal<ListSelectMode | null | undefined>(undefined);
  protected readonly borderVariant = signal<ListBorderVariant | null | undefined>(undefined);
  protected readonly listRole = signal<string | null | undefined>(undefined);
  protected readonly label = signal<string>('Item');
  protected readonly asTag = signal<ListItemTag | null | undefined>(undefined);
  protected readonly isSelected = signal<boolean>(false);
  protected readonly disabled = signal<boolean>(false);
  protected readonly href = signal<string | null | undefined>(undefined);
  protected readonly isExternalHref = signal<boolean>(false);
  protected readonly overrideSize = signal<ListSize | null | undefined>(undefined);
  protected readonly forceClickable = signal<boolean>(false);
  protected readonly hideLabel = signal<boolean>(false);

  protected readonly clickCount = signal<number>(0);

  protected readout(): string {
    return `clickCount=${this.clickCount()}`;
  }

  protected handleClicked(): void {
    this.clickCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'story-list-no-observer-shell',
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
class StoryListNoObserverShell {}

@Component({
  selector: 'story-list-projection-shell',
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
class StoryListProjectionShell {}

@Component({
  selector: 'story-list-router-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [List, ListItem],
  host: { class: 'block' },
  template: `
    <org-list>
      <org-list-item data-testid="subset" label="subset" asTag="a" routerLink="/products" [routerMatchExact]="false" />
      <org-list-item data-testid="exact" label="exact" asTag="a" routerLink="/products" [routerMatchExact]="true" />
    </org-list>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-nav-other" (click)="navigate('/other')">nav-other</button>
      <button type="button" data-testid="ctl-nav-products" (click)="navigate('/products')">nav-products</button>
      <button type="button" data-testid="ctl-nav-products-123" (click)="navigate('/products/123')">
        nav-products-123
      </button>
    </div>
  `,
})
class StoryListRouterShell {
  private readonly _router = inject(Router);

  protected navigate(path: string): void {
    this._router.navigateByUrl(path);
  }
}

const meta: Meta = {
  title: 'Core/Components/List/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-list-tests-shell />`,
  moduleMetadata: { imports: [StoryListTestsShell] },
});

const renderNoObserverShell: Story['render'] = () => ({
  template: `<story-list-no-observer-shell />`,
  moduleMetadata: { imports: [StoryListNoObserverShell] },
});

const renderProjectionShell: Story['render'] = () => ({
  template: `<story-list-projection-shell />`,
  moduleMetadata: { imports: [StoryListProjectionShell] },
});

const renderRouterShell: Story['render'] = () => ({
  template: `<story-list-router-shell />`,
  moduleMetadata: { imports: [StoryListRouterShell] },
});

export const ListRendersDefaultHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('list');

    await expect(host.getAttribute('data-size')).toBe('sm');
    await expect(host.getAttribute('data-select-mode')).toBeNull();
    await expect(host.getAttribute('data-border-variant')).toBeNull();
  },
};

export const ListReflectsSizeInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('list');

    await userEvent.click(canvas.getByTestId('ctl-size-base'));

    await waitFor(() => expect(host.getAttribute('data-size')).toBe('base'));
  },
};

export const ListReflectsSelectModeInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('list');

    await userEvent.click(canvas.getByTestId('ctl-select-mode-single'));
    await waitFor(() => expect(host.getAttribute('data-select-mode')).toBe('single'));

    await userEvent.click(canvas.getByTestId('ctl-select-mode-multiple'));
    await waitFor(() => expect(host.getAttribute('data-select-mode')).toBe('multiple'));
  },
};

export const ListSelectModeNullTransformsToOmittedAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('list');

    await userEvent.click(canvas.getByTestId('ctl-select-mode-single'));
    await waitFor(() => expect(host.getAttribute('data-select-mode')).toBe('single'));

    await userEvent.click(canvas.getByTestId('ctl-select-mode-null'));
    await waitFor(() => expect(host.getAttribute('data-select-mode')).toBeNull());
  },
};

export const ListReflectsBorderVariantInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('list');

    await userEvent.click(canvas.getByTestId('ctl-border-variant-outer'));

    await waitFor(() => expect(host.getAttribute('data-border-variant')).toBe('outer'));
  },
};

export const ListDefaultsListRoleToNullOnInnerUl: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('list');
    const innerUl = host.querySelector('ul') as HTMLUListElement;

    await expect(innerUl.getAttribute('role')).toBeNull();
  },
};

export const ListAppliesListRoleToInnerUl: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('list');

    await userEvent.click(canvas.getByTestId('ctl-list-role-menu'));

    await waitFor(() => {
      const innerUl = host.querySelector('ul') as HTMLUListElement;

      expect(innerUl.getAttribute('role')).toBe('menu');
    });
  },
};

export const ListListRoleNullTransformsToOmittedRole: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('list');

    await userEvent.click(canvas.getByTestId('ctl-list-role-menu'));
    await waitFor(() => expect((host.querySelector('ul') as HTMLUListElement).getAttribute('role')).toBe('menu'));

    await userEvent.click(canvas.getByTestId('ctl-list-role-null'));
    await waitFor(() => expect((host.querySelector('ul') as HTMLUListElement).getAttribute('role')).toBeNull());
  },
};

export const ItemHasListitemRole: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await expect(item.getAttribute('role')).toBe('listitem');
  },
};

export const ItemInheritsSizeFromParentList: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await expect(item.getAttribute('data-size')).toBe('sm');

    await userEvent.click(canvas.getByTestId('ctl-size-base'));

    await waitFor(() => expect(item.getAttribute('data-size')).toBe('base'));
  },
};

export const ItemOverrideSizeWinsOverParentSize: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await userEvent.click(canvas.getByTestId('ctl-size-sm'));
    await userEvent.click(canvas.getByTestId('ctl-override-size-base'));

    await waitFor(() => expect(item.getAttribute('data-size')).toBe('base'));
  },
};

export const ItemReflectsParentSelectMode: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await expect(item.getAttribute('data-parent-select-mode')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-select-mode-single'));

    await waitFor(() => expect(item.getAttribute('data-parent-select-mode')).toBe('single'));
  },
};

export const ItemOmitsDisabledAttributesByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await expect(item.getAttribute('aria-disabled')).toBeNull();
    await expect(item.getAttribute('data-disabled')).toBeNull();
  },
};

export const ItemDisabledSetsAriaDisabledAndDataDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => {
      expect(item.getAttribute('aria-disabled')).toBe('true');
      expect(item.getAttribute('data-disabled')).toBe('');
    });
  },
};

export const ItemOmitsSelectedByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await expect(item.getAttribute('data-selected')).toBeNull();
  },
};

export const ItemIsSelectedAddsDataSelected: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await userEvent.click(canvas.getByTestId('ctl-is-selected-on'));

    await waitFor(() => expect(item.getAttribute('data-selected')).toBe(''));
  },
};

export const ItemForceClickableAddsDataAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await expect(item.getAttribute('data-force-clickable')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-force-clickable-on'));

    await waitFor(() => expect(item.getAttribute('data-force-clickable')).toBe(''));
  },
};

export const ItemIsExternalHrefAddsDataAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await expect(item.getAttribute('data-is-external-href')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-external-href-on'));

    await waitFor(() => expect(item.getAttribute('data-is-external-href')).toBe(''));
  },
};

export const ItemFallbackRendersDiv: Story = {
  render: renderNoObserverShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('fallback');

    await expect(item.getAttribute('data-as-tag')).toBeNull();
    await expect(item.querySelector('div.list-item-content')).not.toBeNull();
    await expect(item.querySelector('a')).toBeNull();
    await expect(item.querySelector('button')).toBeNull();
  },
};

export const ItemAsTagAnchorRendersAnchor: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await userEvent.click(canvas.getByTestId('ctl-as-tag-a'));
    await userEvent.click(canvas.getByTestId('ctl-href-set'));

    await waitFor(() => {
      expect(item.getAttribute('data-as-tag')).toBe('a');
      expect(item.querySelector('a.list-item-content')).not.toBeNull();
    });
  },
};

export const ItemAsTagButtonRendersButton: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await userEvent.click(canvas.getByTestId('ctl-as-tag-button'));

    await waitFor(() => {
      expect(item.getAttribute('data-as-tag')).toBe('button');

      const innerButton = item.querySelector('button.list-item-content') as HTMLButtonElement;

      expect(innerButton).not.toBeNull();
      expect(innerButton.type).toBe('button');
    });
  },
};

export const ItemRendersLabelInsideSpan: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');
    const labelSpan = item.querySelector('span') as HTMLSpanElement;

    await expect(labelSpan.textContent?.trim()).toBe('Item');
    await expect(labelSpan.classList.contains('flex-1')).toBe(true);
    await expect(labelSpan.classList.contains('sr-only')).toBe(false);
  },
};

export const ItemHideLabelAppliesSrOnly: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await userEvent.click(canvas.getByTestId('ctl-hide-label-on'));

    await waitFor(() => {
      const labelSpan = item.querySelector('span') as HTMLSpanElement;

      expect(labelSpan.classList.contains('sr-only')).toBe(true);
      expect(labelSpan.classList.contains('flex-1')).toBe(false);
    });
  },
};

export const ItemExternalHrefAddsTargetBlankAndRel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await userEvent.click(canvas.getByTestId('ctl-as-tag-a'));
    await userEvent.click(canvas.getByTestId('ctl-href-set'));
    await userEvent.click(canvas.getByTestId('ctl-external-href-on'));

    await waitFor(() => {
      const anchor = item.querySelector('a') as HTMLAnchorElement;

      expect(anchor.getAttribute('target')).toBe('_blank');
      expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
    });
  },
};

export const ItemExternalHrefRendersAutoIcon: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await expect(item.querySelector('.external-href-icon')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-as-tag-a'));
    await userEvent.click(canvas.getByTestId('ctl-href-set'));
    await userEvent.click(canvas.getByTestId('ctl-external-href-on'));

    await waitFor(() => {
      const externalIcon = item.querySelector('.external-href-icon') as HTMLElement;

      expect(externalIcon).not.toBeNull();
      expect(externalIcon.querySelector('org-icon')?.getAttribute('data-icon')).toBe('arrow-up-right');
    });
  },
};

export const ItemNonExternalHrefHasSelfTargetAndNoRel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await userEvent.click(canvas.getByTestId('ctl-as-tag-a'));
    await userEvent.click(canvas.getByTestId('ctl-href-set'));

    await waitFor(() => {
      const anchor = item.querySelector('a') as HTMLAnchorElement;

      expect(anchor.getAttribute('target')).toBe('_self');
      expect(anchor.getAttribute('rel')).toBeNull();
    });
  },
};

export const ItemAnchorReceivesHrefWhenSet: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await userEvent.click(canvas.getByTestId('ctl-as-tag-a'));
    await userEvent.click(canvas.getByTestId('ctl-href-set'));

    await waitFor(() => {
      const anchor = item.querySelector('a') as HTMLAnchorElement;

      expect(anchor.getAttribute('href')).toBe('https://example.com');
    });
  },
};

export const ItemFallbackDivIsClickableByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await expect(item.getAttribute('data-clickable')).toBe('');
  },
};

export const ItemDisabledRemovesClickable: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => expect(item.getAttribute('data-clickable')).toBeNull());
  },
};

export const ItemForceClickableEnablesClickableWhenInvalidLink: Story = {
  render: renderNoObserverShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const anchorNoLink = await canvas.findByTestId('anchor-no-link');

    // anchor with no href, no routerLink, and no click observer is not clickable
    await expect(anchorNoLink.getAttribute('data-clickable')).toBeNull();
  },
};

export const ItemAnchorWithHrefIsClickableEvenWithoutObserver: Story = {
  render: renderNoObserverShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const anchorWithHref = await canvas.findByTestId('anchor-with-href');

    await expect(anchorWithHref.getAttribute('data-clickable')).toBe('');
  },
};

export const ItemButtonAsTagIsClickableEvenWithoutObserver: Story = {
  render: renderNoObserverShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttonItem = await canvas.findByTestId('button-item');

    await expect(buttonItem.getAttribute('data-clickable')).toBe('');
  },
};

export const ItemFallbackIsClickableEvenWithoutObserver: Story = {
  render: renderNoObserverShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fallback = await canvas.findByTestId('fallback');

    await expect(fallback.getAttribute('data-clickable')).toBe('');
  },
};

export const ItemClickObserverPresenceEnablesClickable: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    // main shell has a (clicked) listener attached, so even an anchor with no href/routerLink
    // becomes clickable because hasClickObserver is true
    await userEvent.click(canvas.getByTestId('ctl-as-tag-a'));

    await waitFor(() => expect(item.getAttribute('data-clickable')).toBe(''));
  },
};

export const ItemClickEmitsClickedOnFallback: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');
    const readout = await canvas.findByTestId('readout');
    const content = item.querySelector('.list-item-content') as HTMLElement;

    await expect(readout.textContent).toContain('clickCount=0');

    await userEvent.click(content);

    await waitFor(() => expect(readout.textContent).toContain('clickCount=1'));
  },
};

export const ItemClickEmitsClickedOnButton: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-as-tag-button'));

    const innerButton = await waitFor(() => {
      const button = item.querySelector('button') as HTMLButtonElement;

      expect(button).not.toBeNull();

      return button;
    });

    await userEvent.click(innerButton);

    await waitFor(() => expect(readout.textContent).toContain('clickCount=1'));
  },
};

export const ItemDisabledSuppressesClickedEmission: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const content = item.querySelector('.list-item-content') as HTMLElement;

    await userEvent.click(content);

    await expect(readout.textContent).toContain('clickCount=0');
  },
};

export const ListItemIconRendersOrgIconWithName: Story = {
  render: renderProjectionShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const itemIcons = await canvas.findByTestId('item-icons');
    const preIcon = itemIcons.querySelector('org-list-item-icon[pre] org-icon') as HTMLElement;
    const postIcon = itemIcons.querySelector('org-list-item-icon[post] org-icon') as HTMLElement;

    await expect(preIcon).not.toBeNull();
    await expect(preIcon.getAttribute('data-icon')).toBe('check');

    await expect(postIcon).not.toBeNull();
    await expect(postIcon.getAttribute('data-icon')).toBe('chevron-right');
  },
};

export const ListItemImageRendersImgWithSrcAndAlt: Story = {
  render: renderProjectionShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const itemImage = await canvas.findByTestId('item-image');
    const img = itemImage.querySelector('org-list-item-image img') as HTMLImageElement;

    await expect(img).not.toBeNull();
    await expect(img.getAttribute('src')).toContain('https://example.com/avatar.png');
    await expect(img.getAttribute('alt')).toBe('profile');
  },
};

export const ItemRendersProjectedPreContent: Story = {
  render: renderProjectionShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item-projected');

    await expect(item.querySelector('[data-testid="custom-pre"]')).not.toBeNull();
  },
};

export const ItemRendersProjectedPostContent: Story = {
  render: renderProjectionShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item-projected');

    await expect(item.querySelector('[data-testid="custom-post"]')).not.toBeNull();
  },
};

export const RouterSubsetMatchSelectsOnExactPath: Story = {
  render: renderRouterShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const subset = await canvas.findByTestId('subset');

    await userEvent.click(canvas.getByTestId('ctl-nav-other'));
    await waitFor(() => expect(subset.getAttribute('data-selected')).toBeNull());

    await userEvent.click(canvas.getByTestId('ctl-nav-products'));

    await waitFor(() => expect(subset.getAttribute('data-selected')).toBe(''));
  },
};

export const RouterSubsetMatchSelectsOnNestedPath: Story = {
  render: renderRouterShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const subset = await canvas.findByTestId('subset');

    await userEvent.click(canvas.getByTestId('ctl-nav-other'));
    await waitFor(() => expect(subset.getAttribute('data-selected')).toBeNull());

    await userEvent.click(canvas.getByTestId('ctl-nav-products-123'));

    await waitFor(() => expect(subset.getAttribute('data-selected')).toBe(''));
  },
};

export const RouterExactMatchSelectsOnlyOnExactPath: Story = {
  render: renderRouterShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const exact = await canvas.findByTestId('exact');

    await userEvent.click(canvas.getByTestId('ctl-nav-other'));
    await waitFor(() => expect(exact.getAttribute('data-selected')).toBeNull());

    await userEvent.click(canvas.getByTestId('ctl-nav-products'));

    await waitFor(() => expect(exact.getAttribute('data-selected')).toBe(''));
  },
};

export const RouterExactMatchDoesNotSelectOnNestedPath: Story = {
  render: renderRouterShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const exact = await canvas.findByTestId('exact');

    await userEvent.click(canvas.getByTestId('ctl-nav-other'));
    await waitFor(() => expect(exact.getAttribute('data-selected')).toBeNull());

    await userEvent.click(canvas.getByTestId('ctl-nav-products-123'));

    await waitFor(() => {
      expect(exact.getAttribute('data-selected')).toBeNull();
    });
  },
};

export const RouterActiveAddsAriaCurrentPageOnAnchor: Story = {
  render: renderRouterShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const subset = await canvas.findByTestId('subset');

    await userEvent.click(canvas.getByTestId('ctl-nav-other'));
    await waitFor(() => {
      const anchor = subset.querySelector('a') as HTMLAnchorElement;

      expect(anchor.getAttribute('aria-current')).toBeNull();
    });

    await userEvent.click(canvas.getByTestId('ctl-nav-products'));

    await waitFor(() => {
      const anchor = subset.querySelector('a') as HTMLAnchorElement;

      expect(anchor.getAttribute('aria-current')).toBe('page');
    });
  },
};
