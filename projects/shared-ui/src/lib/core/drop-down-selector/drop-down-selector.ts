import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewChild,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { CdkConnectedOverlay, CdkOverlayOrigin, type ConnectedPosition } from '@angular/cdk/overlay';
import { angularUtils, domUtils } from '@organization/shared-utils';
import { type IconName } from '../icon/icon-brain';
import { Button } from '../button/button';
import { Icon, type IconSize } from '../icon/icon';
import { Input } from '../input/input';
import { List } from '../list/list';
import { ListItem } from '../list/list-item';
import { OverlayMenuDivider } from '../overlay-menu/overlay-menu-divider';
import { ScrollArea } from '../scroll-area/scroll-area';
import { Tag } from '../tags/tag';
import { ComponentSize } from '../types/component-types';
import {
  DROP_DOWN_SELECTOR_DISABLED_DEFAULT as BRAIN_DROP_DOWN_SELECTOR_DISABLED_DEFAULT,
  DROP_DOWN_SELECTOR_SELECTION_MODE_DEFAULT as BRAIN_DROP_DOWN_SELECTOR_SELECTION_MODE_DEFAULT,
  DropDownSelectorBrainDirective,
  type DropDownSelectorSelectionMode,
} from '../drop-down-selector/drop-down-selector-brain';

/** all available drop-down-selector size values */
export const allDropDownSelectorSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** the size variant of the drop-down selector trigger */
export type DropDownSelectorSize = (typeof allDropDownSelectorSizes)[number];

/** all available drop-down-selector position values */
export const allDropDownSelectorPositions = ['below', 'above', 'before', 'after'] as const;

/** the position of the dropdown menu relative to the trigger */
export type DropDownSelectorPosition = (typeof allDropDownSelectorPositions)[number];

/** default value for the selectionMode input */
export const DROP_DOWN_SELECTOR_SELECTION_MODE_DEFAULT: DropDownSelectorSelectionMode =
  BRAIN_DROP_DOWN_SELECTOR_SELECTION_MODE_DEFAULT;

/** default value for the disabled input */
export const DROP_DOWN_SELECTOR_DISABLED_DEFAULT: boolean = BRAIN_DROP_DOWN_SELECTOR_DISABLED_DEFAULT;

/** default value for the size input */
export const DROP_DOWN_SELECTOR_SIZE_DEFAULT: DropDownSelectorSize = 'base';

/** default value for the position input */
export const DROP_DOWN_SELECTOR_POSITION_DEFAULT: DropDownSelectorPosition = 'below';

/** default value for the iconName input */
export const DROP_DOWN_SELECTOR_ICON_NAME_DEFAULT: IconName | undefined = undefined;

/** default value for the showLabelWithValue input */
export const DROP_DOWN_SELECTOR_SHOW_LABEL_WITH_VALUE_DEFAULT = false;

/** default value for the hasSearch input */
export const DROP_DOWN_SELECTOR_HAS_SEARCH_DEFAULT = false;

/** the icon size used for each supported drop-down selector trigger size */
const TRIGGER_ICON_SIZE_BY_TRIGGER_SIZE: Record<DropDownSelectorSize, IconSize> = {
  sm: 'xs',
  base: 'sm',
  lg: 'base',
};

/**
 * the cdk overlay positions for each supported drop-down selector position. each entry lists the primary
 * position first followed by fallback candidates so the cdk overlay can flip on the primary axis (e.g.
 * `below` → `above`) and on the cross-axis alignment (e.g. left-aligned → right-aligned) when the panel
 * would otherwise be clipped by the viewport.
 */
const POSITION_CONFIGURATIONS: Record<DropDownSelectorPosition, ConnectedPosition[]> = {
  below: [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
  ],
  above: [
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
  ],
  before: [
    { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -4 },
    { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom', offsetX: -4 },
    { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 4 },
    { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetX: 4 },
  ],
  after: [
    { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 4 },
    { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetX: 4 },
    { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -4 },
    { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom', offsetX: -4 },
  ],
};

/**
 * a button-like trigger that opens an overlay menu of selectable options. supports both single (`'single'`)
 * and multi (`'multiple'`) selection modes via the `selectionMode` input, with the selected items reported
 * through the two-way bindable `selectedItems` model. selection logic, comparison, computed display text,
 * open / closed state, active descendant tracking, and keyboard handling are owned by the headless
 * `DropDownSelectorBrainDirective` applied as a host directive.
 */
@Component({
  selector: 'org-drop-down-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Button,
    CdkOverlayOrigin,
    CdkConnectedOverlay,
    Icon,
    Input,
    List,
    ListItem,
    OverlayMenuDivider,
    ScrollArea,
    Tag,
  ],
  templateUrl: './drop-down-selector.html',
  styleUrl: './drop-down-selector.css',
  hostDirectives: [
    {
      directive: DropDownSelectorBrainDirective,
      inputs: ['selectionMode', 'disabled', 'selectedItems', 'label', 'items'],
      outputs: ['selectedItemsChange'],
    },
  ],
  host: {
    '[attr.data-selection-mode]': 'brain.selectionMode()',
    '[attr.data-has-value]': 'brain.hasSelection() ? "" : null',
    '[attr.data-size]': 'size()',
    '[attr.data-state]': 'brain.isOpen() ? "open" : "closed"',
    '[attr.data-has-search]': 'hasSearch() ? "" : null',
    '[attr.aria-disabled]': 'brain.disabled() ? "true" : null',
  },
})
export class DropDownSelector<TValue = unknown> {
  protected readonly brain = inject(DropDownSelectorBrainDirective, {
    self: true,
  }) as DropDownSelectorBrainDirective<TValue>;

  private readonly _injector = inject(Injector);

  @ViewChild('optionsScrollAreaComponent')
  protected readonly optionsScrollAreaComponent?: ScrollArea;

  @ViewChild('searchInputComponent')
  protected readonly searchInputComponent?: Input;

  /** the size variant of the trigger element */
  public readonly size = input<DropDownSelectorSize>(DROP_DOWN_SELECTOR_SIZE_DEFAULT);

  /** the position of the dropdown menu relative to the trigger */
  public readonly position = input<DropDownSelectorPosition>(DROP_DOWN_SELECTOR_POSITION_DEFAULT);

  /** the optional icon rendered before the trigger label; when undefined, no pre icon is rendered */
  public readonly iconName = input<IconName | undefined, IconName | null | undefined>(
    DROP_DOWN_SELECTOR_ICON_NAME_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /**
   * when true, the label remains visible inside the trigger even after a value is picked, separated from
   * the value by a hairline; when false (default), the label is hidden once a value is selected and only
   * the value or count chip is shown
   */
  public readonly showLabelWithValue = input<boolean>(DROP_DOWN_SELECTOR_SHOW_LABEL_WITH_VALUE_DEFAULT);

  /**
   * when true, an inline search input renders at the top of the overlay menu (outside of the scroll
   * area) and filters the visible items in real time by case-insensitive substring match on `display`
   */
  public readonly hasSearch = input<boolean>(DROP_DOWN_SELECTOR_HAS_SEARCH_DEFAULT);

  /** the icon size to use for icons rendered inside the trigger, derived from the trigger size variant */
  protected readonly triggerIconSize = computed<IconSize>(() => TRIGGER_ICON_SIZE_BY_TRIGGER_SIZE[this.size()]);

  /** the resolved cdk overlay positions for the dropdown menu */
  protected readonly menuPositions = computed<ConnectedPosition[]>(() => POSITION_CONFIGURATIONS[this.position()]);

  /** whether the label text should render inside the trigger */
  protected readonly showLabel = computed<boolean>(() => !this.brain.hasSelection() || this.showLabelWithValue());

  /** whether the hairline separator between label and value should render */
  protected readonly showSeparator = computed<boolean>(() => this.brain.hasSelection() && this.showLabelWithValue());

  /** whether the multi-mode count chip should render — shown when more than one item is selected */
  protected readonly showCountChip = computed<boolean>(() => this.brain.selectionCount() > 1);

  /** whether the single-value text should render — shown when exactly one item is selected */
  protected readonly showSingleValue = computed<boolean>(() => this.brain.selectionCount() === 1);

  /** the display text for the single-selected item, or empty string when nothing is selected */
  protected readonly singleValueText = computed<string>(() => this.brain.selectedItems()[0]?.display ?? '');

  /** the display text rendered inside the multi-mode count chip */
  protected readonly countChipText = computed<string>(() => `${this.brain.selectionCount()} selected`);

  /** stable html name attribute used by the inline-search `<org-input>` */
  protected readonly searchInputName = computed<string>(() => `${this.brain.panelId()}-search`);

  /** whether the filtered list is empty while a search query is active — drives the empty-state markup */
  protected readonly showEmptyState = computed<boolean>(
    () => this.hasSearch() && this.brain.hasSearchQuery() && this.brain.filteredItems().length === 0
  );

  public constructor() {
    // scroll the active item into view when it changes while the menu is open
    effect(() => {
      const activeIndex = this.brain.activeIndex();
      const isOpen = this.brain.isOpen();

      if (!isOpen || activeIndex < 0) {
        return;
      }

      const activeDescendantId = this.brain.activeDescendantId();

      if (!activeDescendantId) {
        return;
      }

      untracked(() => {
        afterNextRender(
          () => {
            const container = this.optionsScrollAreaComponent?.containerElement() ?? null;
            this._scrollActiveItemIntoViewIfNeeded(container, activeDescendantId);
          },
          { injector: this._injector }
        );
      });
    });

    // auto-focus the inline-search input whenever the menu opens with hasSearch enabled
    effect(() => {
      const isOpen = this.brain.isOpen();
      const hasSearch = this.hasSearch();

      if (!isOpen || !hasSearch) {
        return;
      }

      untracked(() => {
        afterNextRender(
          () => {
            this.searchInputComponent?.focusInput();
          },
          { injector: this._injector }
        );
      });
    });
  }

  /** resolves the menu item pre-icon based on selection mode and selected state */
  protected getItemPreIcon(isSelected: boolean): IconName | undefined {
    if (this.brain.selectionMode() === 'multiple') {
      return isSelected ? 'square-check-big' : 'square';
    }

    return isSelected ? 'check' : undefined;
  }

  /** scrolls the menu item matching `id="<activeDescendantId>"` into view if it is completely out of view */
  private _scrollActiveItemIntoViewIfNeeded(container: HTMLElement | null, activeDescendantId: string): void {
    if (!container) {
      return;
    }

    const activeElement = container.querySelector(`#${activeDescendantId}`);

    if (!activeElement) {
      return;
    }

    const isCompletelyOutOfView = domUtils.isElementOutOfView(container, activeElement as HTMLElement);

    if (!isCompletelyOutOfView) {
      return;
    }

    activeElement.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  }
}
