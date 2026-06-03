import { Component, ChangeDetectionStrategy, computed, effect, forwardRef, inject, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { angularUtils, logManager } from '@organization/shared-utils';
import { ListItemBrainDirective } from '../list/list-item-brain';
import { List, type ListSize } from './list';
import { ListItemIcon } from './list-item-icon';
import type { IconName } from '../icon/icon-brain';

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

/** the default external href flag of the list item */
export const LIST_ITEM_IS_EXTERNAL_HREF_DEFAULT = false;

/** the default override size of the list item */
export const LIST_ITEM_OVERRIDE_SIZE_DEFAULT: ListSize | undefined = undefined;

/** the default force clickable state of the list item */
export const LIST_ITEM_FORCE_CLICKABLE_DEFAULT = false;

/** the default hide-label state of the list item */
export const LIST_ITEM_HIDE_LABEL_DEFAULT = false;

/** the icon auto-rendered as a post indicator when showAsExternal is true */
const EXTERNAL_HREF_ICON_NAME: IconName = 'arrow-up-right';

@Component({
  selector: 'org-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, RouterLink, forwardRef(() => ListItemIcon)],
  templateUrl: './list-item.html',
  styleUrl: './list-item.css',
  hostDirectives: [
    {
      directive: ListItemBrainDirective,
      inputs: ['disabled', 'routerLink', 'routerMatchExact', 'isClickable'],
      outputs: ['clicked'],
    },
  ],
  host: {
    role: 'listitem',
    ['[attr.data-size]']: 'effectiveSize()',
    ['[attr.data-selected]']: 'isActuallySelected() ? "" : null',
    ['[attr.aria-disabled]']: 'disabled() ? "true" : null',
    ['[attr.data-clickable]']: 'appearsClickable() ? "" : null',
    ['[attr.data-as-tag]']: 'asTag()',
    ['[attr.data-disabled]']: 'disabled() ? "" : null',
    ['[attr.data-is-external-href]']: 'showAsExternal() ? "" : null',
    ['[attr.data-override-size]']: 'overrideSize()',
    ['[attr.data-force-clickable]']: 'forceClickable() ? "" : null',
    ['[attr.data-parent-select-mode]']: 'parentList.selectMode() ?? null',
  },
})
export class ListItem {
  /** reference to the parent list component for size and select-mode inheritance */
  protected readonly parentList = inject(List);

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

  /** whether the href is an external url that should open in a new tab; auto-renders a post external-link icon */
  public readonly showAsExternal = input<boolean>(LIST_ITEM_IS_EXTERNAL_HREF_DEFAULT);

  /** overrides the size inherited from the parent list component for this item only */
  public readonly overrideSize = input<ListSize | undefined, ListSize | null | undefined>(
    LIST_ITEM_OVERRIDE_SIZE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /**
   * forces the list item to display clickable styles only — without making the item itself a click target;
   * use when the clickable interaction is handled by a child element rather than the item. to make the item
   * itself the click target (button render in the no-tag case + clicked emission), use isClickable instead.
   */
  public readonly forceClickable = input<boolean>(LIST_ITEM_FORCE_CLICKABLE_DEFAULT);

  /** the main text content of the list item */
  public readonly label = input.required<string>();

  /**
   * visually hides the label while keeping it in the dom for screen readers; useful when only the
   * projected pre content conveys the visible meaning (e.g. collapsed navigation rows)
   */
  public readonly hideLabel = input<boolean>(LIST_ITEM_HIDE_LABEL_DEFAULT);

  /** the resolved selected state combining the external isSelected input and the router link active state */
  protected readonly isActuallySelected = computed<boolean>(() => this.isSelected() || this.brain.isRouterLinkActive());

  /** whether the anchor tag configuration is valid (href or routerLink required when asTag is a) */
  private readonly _isValidLink = computed<boolean>(() => {
    if (this.asTag() === 'button' || !this.asTag()) {
      return true;
    }

    return this.asTag() === 'a' && (!!this.href() || !!this.brain.routerLink());
  });

  /** whether the list item should display clickable styles (structural link / button, forced, or explicit click target) */
  protected readonly appearsClickable = computed<boolean>(() => {
    return !this.disabled() && (this.forceClickable() || this._isValidLink() || this.brain.isClickable());
  });

  /** the resolved size, using overrideSize when provided or falling back to the parent list size */
  public readonly effectiveSize = computed<ListSize>(() => {
    if (this.overrideSize() !== undefined) {
      return this.overrideSize()!;
    }

    return this.parentList.size();
  });

  /** the icon name auto-rendered as a post indicator when showAsExternal is true */
  protected readonly externalHrefIconName: IconName = EXTERNAL_HREF_ICON_NAME;

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

  /** handles click events, delegating disabled-gating and observer-checked emission to the brain */
  protected onClick(event: MouseEvent): void {
    this.brain.handleClick(event);
  }
}
