import { Directive, ElementRef, inject, input, output } from '@angular/core';
import { CdkMenu } from '@angular/cdk/menu';
import { type IconName } from '../icon/icon-brain';
import { type ComponentColor } from '../types/component-types';

/** all available overlay menu item type values */
export const allOverlayMenuItemTypes = ['item', 'divider', 'button-toggle'] as const;

/** the rendering variant for an overlay menu item */
export type OverlayMenuItemType = (typeof allOverlayMenuItemTypes)[number];

/** an inline tag rendered as post meta on an overlay menu item (e.g. a "Beta" badge) */
export type OverlayMenuItemTag = {
  /** display label rendered inside the tag */
  label: string;
  /** color of the tag; mapped 1:1 to `TagColor` by the presentation layer at render time */
  color: string;
};

/** a single option rendered inside an `OverlayMenuButtonToggleEntry` */
export type OverlayMenuButtonToggleOption = {
  /** display label rendered inside the toggle button */
  label: string;
  /** unique value emitted when this option is selected */
  value: string;
  /** semantic color applied to the toggle button — mirrors `ButtonToggleItem.buttonColor` */
  buttonColor: ComponentColor;
  /** when true, the option is disabled and cannot be selected */
  buttonDisabled?: boolean;
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
  /** optional pre icon displayed before the menu item label */
  icon: IconName | null;
  /** when true, the row paints muted, is non-interactive, and is skipped by cdk keyboard nav */
  disabled?: boolean;
  /** optional post keyboard shortcut text rendered as a kbd pill (e.g. "⌘ Z") */
  shortcut?: string;
  /** optional post icon rendered as muted meta (e.g. `chevron-right` for a sub-menu indicator) */
  postIcon?: IconName;
  /** optional post tag rendered as a status pill (e.g. a "Beta" badge) */
  tag?: OverlayMenuItemTag;
  /** optional post numeric indicator rendered as a pill (e.g. a "12" unread count) */
  indicator?: number;
  /** optional semantic color applied to the row's icon and label (e.g. `'danger'` for destructive actions) */
  color?: ComponentColor;
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

/** a non-cdk-menu-item entry embedding an inline button-toggle (e.g. an appearance theme switcher) */
export type OverlayMenuButtonToggleEntry = {
  /** unique id for the button-toggle entry */
  id: string;
  /** rendering variant — `'button-toggle'` renders an inline `<org-button-toggle>` */
  type: 'button-toggle';
  /** the currently selected value of the toggle */
  value: string;
  /** the options rendered inside the toggle */
  items: OverlayMenuButtonToggleOption[];
};

/** a single menu item configuration for the overlay menu */
export type OverlayMenuItem<
  // this is generic so we need to allow any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMeta = Record<string, any>,
> = OverlayMenuItemEntry<TMeta> | OverlayMenuDividerEntry | OverlayMenuButtonToggleEntry;

/** payload emitted by `entryValueChanged` when a `button-toggle` entry changes value */
export type OverlayMenuEntryValueChange = {
  /** id of the entry whose value changed */
  entryId: string;
  /** the newly-selected value */
  value: string;
};

/** default value for the items input */
export const OVERLAY_MENU_ITEMS_DEFAULT: OverlayMenuItem[] = [];

/** default value for the label input */
export const OVERLAY_MENU_LABEL_DEFAULT = 'Menu';

/** default value for the header input */
export const OVERLAY_MENU_HEADER_DEFAULT: string | undefined = undefined;

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
    '(keydown)': '_handleKeydown($event)',
  },
})
export class OverlayMenuBrainDirective<
  // this is generic so we need to allow any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMeta = Record<string, any>,
> {
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /** the accessible label announced by screen readers for the menu container */
  public readonly label = input<string>(OVERLAY_MENU_LABEL_DEFAULT);

  /** the list of items rendered by the presentation; drives the typed event contract */
  public readonly items = input<OverlayMenuItem<TMeta>[]>(OVERLAY_MENU_ITEMS_DEFAULT as OverlayMenuItem<TMeta>[]);

  /** optional uppercase section header rendered above the first row (e.g. "PROJECTS", "APPEARANCE") */
  public readonly header = input<string | undefined>(OVERLAY_MENU_HEADER_DEFAULT);

  /** emits the selected menu item when a menu item is triggered — divider entries are non-clickable and never emitted */
  public readonly itemClicked = output<OverlayMenuItemEntry<TMeta>>();

  /** emits the new value when a `button-toggle` entry's selection changes */
  public readonly entryValueChanged = output<OverlayMenuEntryValueChange>();

  /** emits the provided item via the `itemClicked` output; called by the presentation per item triggered */
  public handleItemClick(item: OverlayMenuItemEntry<TMeta>): void {
    this.itemClicked.emit(item);
  }

  /** emits a value-changed event for a `button-toggle` entry; called by the presentation on toggle change */
  public handleEntryValueChanged(entryId: string, value: string): void {
    this.entryValueChanged.emit({ entryId, value });
  }

  /**
   * handles vertical keyboard navigation across the rendered menu items. cdk menu's own key manager
   * cannot see items rendered in this component's view (its query is `@ContentChildren`), so the brain
   * owns nav directly. `[role="menuitem"]:not([disabled])` excludes disabled items via the native
   * `disabled` attribute the per-item brain forwards to the host button.
   */
  protected _handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') {
      return;
    }

    const items = Array.from(
      this._elementRef.nativeElement.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])')
    );

    if (items.length === 0) {
      return;
    }

    event.preventDefault();

    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    let nextIndex: number;

    if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = items.length - 1;
    } else if (currentIndex === -1) {
      // no menu item currently focused — land on first for ArrowDown, last for ArrowUp
      nextIndex = event.key === 'ArrowDown' ? 0 : items.length - 1;
    } else if (event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % items.length;
    } else {
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    }

    items[nextIndex].focus();
  }
}
