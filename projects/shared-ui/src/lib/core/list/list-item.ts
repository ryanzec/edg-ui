import { Component, ChangeDetectionStrategy, computed, effect, inject, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { angularUtils, logManager } from '@organization/shared-utils';
import { List, type ListSize } from './list';
import { ListItemBrainDirective } from '../../brain/list-item-brain/list-item-brain';

/** all available list item tag values */
export const allListItemTags = ['a', 'button'] as const;

/** the html element tag used to render the list item content */
export type ListItemTag = (typeof allListItemTags)[number];

/** the default tag of the list item */
export const LIST_ITEM_AS_TAG_DEFAULT: ListItemTag | undefined = undefined;

/** the default selected state of the list item */
export const LIST_ITEM_IS_SELECTED_DEFAULT = false;

/** the default disabled state of the list item */
export const LIST_ITEM_DISABLED_DEFAULT = false;

/** the default href of the list item */
export const LIST_ITEM_HREF_DEFAULT: string | undefined = undefined;

/** the default router link path of the list item */
export const LIST_ITEM_ROUTER_LINK_DEFAULT: string | undefined = undefined;

/** the default external href flag of the list item */
export const LIST_ITEM_IS_EXTERNAL_HREF_DEFAULT = false;

/** the default override size of the list item */
export const LIST_ITEM_OVERRIDE_SIZE_DEFAULT: ListSize | undefined = undefined;

/** the default force clickable state of the list item */
export const LIST_ITEM_FORCE_CLICKABLE_DEFAULT = false;

@Component({
  selector: 'org-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, RouterLink, RouterLinkActive],
  templateUrl: './list-item.html',
  styleUrl: './list-item.css',
  hostDirectives: [
    {
      directive: ListItemBrainDirective,
      inputs: ['listItemDisabled: disabled'],
      outputs: ['listItemClicked: clicked'],
    },
  ],
  host: {
    role: 'listitem',
    ['[attr.data-size]']: 'finalSize()',
    ['[attr.data-selected]']: 'isActuallySelected() ? "" : null',
    ['[attr.aria-disabled]']: 'disabled() ? "true" : null',
    ['[attr.data-clickable]']: 'isClickable() ? "" : null',
    ['[attr.data-as-tag]']: 'asTag()',
    ['[attr.data-disabled]']: 'disabled() ? "" : null',
    ['[attr.data-is-external-href]']: 'isExternalHref() ? "" : null',
    ['[attr.data-override-size]']: 'overrideSize()',
    ['[attr.data-force-clickable]']: 'forceClickable() ? "" : null',
  },
})
export class ListItem {
  /** @internal reference to the parent list component for size inheritance */
  private readonly _listComponent = inject(List, { host: true });

  protected readonly brain = inject(ListItemBrainDirective, { self: true });

  /** the html element tag to render the list item content as */
  public readonly asTag = input<ListItemTag | undefined, ListItemTag | null | undefined>(LIST_ITEM_AS_TAG_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** whether the list item is in a selected state */
  public readonly isSelected = input<boolean>(LIST_ITEM_IS_SELECTED_DEFAULT);

  /** whether the list item is disabled and cannot be interacted with */
  public readonly disabled = input<boolean>(LIST_ITEM_DISABLED_DEFAULT);

  /** the href url used when asTag is set to a */
  public readonly href = input<string | undefined, string | null | undefined>(LIST_ITEM_HREF_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the angular router link path used when asTag is set to a */
  public readonly routerLink = input<string | undefined, string | null | undefined>(LIST_ITEM_ROUTER_LINK_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** whether the href is an external url that should open in a new tab */
  public readonly isExternalHref = input<boolean>(LIST_ITEM_IS_EXTERNAL_HREF_DEFAULT);

  /** overrides the size inherited from the parent list component for this item only */
  public readonly overrideSize = input<ListSize | undefined, ListSize | null | undefined>(
    LIST_ITEM_OVERRIDE_SIZE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /**
   * forces the list item to display clickable styles even when no direct click handler is attached;
   * useful when the clickable interaction is handled by a child element rather than the item itself
   */
  public readonly forceClickable = input<boolean>(LIST_ITEM_FORCE_CLICKABLE_DEFAULT);

  /** the resolved selected state combining the external isSelected input and the router link active state */
  protected readonly isActuallySelected = computed<boolean>(() => this.isSelected() || this.brain.isRouterLinkActive());

  /** whether the anchor tag configuration is valid (href or routerLink required when asTag is a) */
  private readonly _isValidLink = computed<boolean>(() => {
    if (this.asTag() === 'button' || !this.asTag()) {
      return true;
    }

    return this.asTag() === 'a' && (!!this.href() || !!this.routerLink());
  });

  /** whether the list item should display clickable styles and respond to interaction */
  protected readonly isClickable = computed<boolean>(() => {
    return !this.disabled() && (this.forceClickable() || this._isValidLink() || this.brain.hasClickObserver());
  });

  /** the resolved size, using overrideSize when provided or falling back to the parent list size */
  public readonly finalSize = computed<ListSize>(() => {
    if (this.overrideSize() !== undefined) {
      return this.overrideSize()!;
    }

    return this._listComponent.size();
  });

  constructor() {
    // validates that href or routerLink is provided when asTag is set to a
    effect(() => {
      if (this._isValidLink() === false) {
        logManager.error({
          type: 'list-item-invalid-link',
          message: 'href or routerLink input is required when asTag is set to a',
        });
      }
    });
  }

  /** updates the router link active signal when the route active state changes */
  protected onRouterLinkActiveChange(isActive: boolean): void {
    this.brain.setRouterLinkActive(isActive);
  }

  /** handles click events, delegating disabled-gating and observer-checked emission to the brain */
  protected onClick(event: MouseEvent): void {
    this.brain.handleClick(event);
  }
}
