import { Directive, input, output } from '@angular/core';
import { CdkMenu } from '@angular/cdk/menu';
import { type IconName } from '../icon-brain/icon-brain';

/** all available overlay menu item type values */
export const allOverlayMenuItemTypes = ['item', 'divider'] as const;

/** the rendering variant for an overlay menu item */
export type OverlayMenuItemType = (typeof allOverlayMenuItemTypes)[number];

/** an inline tag rendered as trailing meta on an overlay menu item (e.g. a "Beta" badge) */
export type OverlayMenuItemTag = {
  /** display label rendered inside the tag */
  label: string;
  /** color of the tag; mapped 1:1 to `TagColor` by the presentation layer at render time */
  color: string;
};

/** a clickable overlay menu entry — the shape emitted by `itemClicked` */
export type OverlayMenuItemEntry<
  // this is generic so we need to allow any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMeta = Record<string, any>,
> = {
  /** unique id for the menu item */
  id: string;
  /** rendering variant — omit or set to `'item'` for a standard clickable row */
  type?: 'item';
  /** display label for the menu item */
  label: string;
  /** optional leading icon displayed before the menu item label */
  icon: IconName | null;
  /** when true, the row paints muted, is non-interactive, and is skipped by cdk keyboard nav */
  disabled?: boolean;
  /** optional trailing keyboard shortcut text rendered as muted meta (e.g. "⌘ Z") */
  shortcut?: string;
  /** optional trailing icon rendered as muted meta (e.g. `chevron-right` for a sub-menu indicator) */
  trailingIcon?: IconName;
  /** optional trailing tag rendered as a status pill (e.g. a "Beta" badge) */
  tag?: OverlayMenuItemTag;
  /** optional consumer-defined metadata associated with the menu item */
  meta?: TMeta;
};

/** a non-clickable divider entry rendered as a visual separator between menu items */
export type OverlayMenuDividerEntry = {
  /** unique id for the divider entry */
  id: string;
  /** rendering variant — `'divider'` renders a visual separator between items */
  type: 'divider';
};

/** a single menu item configuration for the overlay menu */
export type OverlayMenuItem<
  // this is generic so we need to allow any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMeta = Record<string, any>,
> = OverlayMenuItemEntry<TMeta> | OverlayMenuDividerEntry;

/** default value for the items input */
export const OVERLAY_MENU_ITEMS_DEFAULT: OverlayMenuItem[] = [];

/** default value for the label input */
export const OVERLAY_MENU_LABEL_DEFAULT = 'Menu';

/**
 * headless brain directive for the overlay menu container. composes `CdkMenu` for keyboard navigation,
 * focus management, and the `role="menu"` semantics. owns the `aria-label` host binding sourced from the
 * `label` input, the typed `items` input that drives the menu's data contract, and the `itemClicked`
 * output emitted via `handleItemClick`. carries no styling, template, or markup — apply alongside a
 * presentation that renders each item with `OverlayMenuItemBrainDirective`.
 */
@Directive({
  selector: '[orgOverlayMenuBrain]',
  exportAs: 'orgOverlayMenuBrain',
  hostDirectives: [CdkMenu],
  host: {
    '[attr.aria-label]': 'label()',
  },
})
export class OverlayMenuBrainDirective<
  // this is generic so we need to allow any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMeta = Record<string, any>,
> {
  /** the accessible label announced by screen readers for the menu container */
  public readonly label = input<string>(OVERLAY_MENU_LABEL_DEFAULT);

  /** the list of items rendered by the presentation; drives the typed event contract */
  public readonly items = input<OverlayMenuItem<TMeta>[]>(OVERLAY_MENU_ITEMS_DEFAULT as OverlayMenuItem<TMeta>[]);

  /** emits the selected menu item when a menu item is triggered — divider entries are non-clickable and never emitted */
  public readonly itemClicked = output<OverlayMenuItemEntry<TMeta>>();

  /** emits the provided item via the `itemClicked` output; called by the presentation per item triggered */
  public handleItemClick(item: OverlayMenuItemEntry<TMeta>): void {
    this.itemClicked.emit(item);
  }
}
