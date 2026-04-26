import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { CdkConnectedOverlay, CdkOverlayOrigin, type ConnectedPosition } from '@angular/cdk/overlay';
import { Icon, type IconName, type IconSize } from '../icon/icon';
import { List } from '../list/list';
import { ListItem } from '../list/list-item';
import { ListItemIcon } from '../list/list-item-icon';
import { OverlayMenuDivider } from '../overlay-menu/overlay-menu-divider';
import { ComponentSize } from '../types/component-types';
import {
  DROP_DOWN_SELECTOR_DISABLED_DEFAULT as BRAIN_DROP_DOWN_SELECTOR_DISABLED_DEFAULT,
  DROP_DOWN_SELECTOR_SELECTION_MODE_DEFAULT as BRAIN_DROP_DOWN_SELECTOR_SELECTION_MODE_DEFAULT,
  DropDownSelectorBrainDirective,
  type DropDownSelectorSelectionMode,
  type SelectionValue,
} from '../../brain/drop-down-selector-brain/drop-down-selector-brain';

/** all available drop-down-selector size values */
export const allDropDownSelectorSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** the size variant of the drop-down selector trigger */
export type DropDownSelectorSize = (typeof allDropDownSelectorSizes)[number];

/** all available drop-down-selector position values */
export const allDropDownSelectorPositions = ['below', 'above', 'before', 'after'] as const;

/** the position of the dropdown menu relative to the trigger */
export type DropDownSelectorPosition = (typeof allDropDownSelectorPositions)[number];

/** default value for the items input */
export const DROP_DOWN_SELECTOR_ITEMS_DEFAULT: SelectionValue[] = [];

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
export const DROP_DOWN_SELECTOR_ICON_NAME_DEFAULT: IconName | null = null;

/** the icon size used for each supported drop-down selector trigger size */
const TRIGGER_ICON_SIZE_BY_TRIGGER_SIZE: Record<DropDownSelectorSize, IconSize> = {
  sm: 'xs',
  base: 'sm',
  lg: 'base',
};

/** the cdk overlay positions for each supported drop-down selector position */
const POSITION_CONFIGURATIONS: Record<DropDownSelectorPosition, ConnectedPosition[]> = {
  below: [{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 }],
  above: [{ originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 }],
  before: [{ originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -4 }],
  after: [{ originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 4 }],
};

/**
 * a button-like trigger that opens an overlay menu of selectable options. supports both single (`'single'`)
 * and multi (`'multiple'`) selection modes via the `selectionMode` input, with the selected items reported
 * through the two-way bindable `selectedItems` model. selection logic, comparison, and computed display text
 * are owned by the headless `DropDownSelectorBrainDirective` applied as a host directive.
 */
@Component({
  selector: 'org-drop-down-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkOverlayOrigin, CdkConnectedOverlay, Icon, List, ListItem, ListItemIcon, OverlayMenuDivider],
  templateUrl: './drop-down-selector.html',
  styleUrl: './drop-down-selector.css',
  hostDirectives: [
    {
      directive: DropDownSelectorBrainDirective,
      inputs: [
        'dropDownSelectorSelectionMode: selectionMode',
        'dropDownSelectorDisabled: disabled',
        'dropDownSelectorSelectedItems: selectedItems',
      ],
      outputs: ['dropDownSelectorSelectedItemsChange: selectedItemsChange'],
    },
  ],
  host: {
    '[attr.data-selection-mode]': 'selectionMode()',
    '[attr.data-has-selection]': 'brain.hasSelection() ? "" : null',
    '[attr.data-size]': 'size()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
  },
})
export class DropDownSelector<TValue = unknown> {
  protected readonly brain = inject(DropDownSelectorBrainDirective, {
    self: true,
  }) as DropDownSelectorBrainDirective<TValue>;

  /** the full list of selectable options to render in the menu */
  public readonly items = input.required<SelectionValue<TValue>[]>();

  /** the label rendered inside the trigger before the selected value text */
  public readonly label = input.required<string>();

  /** controls whether a single or multiple items can be selected at a time */
  public readonly selectionMode = input<DropDownSelectorSelectionMode>(DROP_DOWN_SELECTOR_SELECTION_MODE_DEFAULT);

  /** whether the drop-down selector is disabled and cannot be interacted with */
  public readonly disabled = input<boolean>(DROP_DOWN_SELECTOR_DISABLED_DEFAULT);

  /** the size variant of the trigger element */
  public readonly size = input<DropDownSelectorSize>(DROP_DOWN_SELECTOR_SIZE_DEFAULT);

  /** the position of the dropdown menu relative to the trigger */
  public readonly position = input<DropDownSelectorPosition>(DROP_DOWN_SELECTOR_POSITION_DEFAULT);

  /** the optional icon rendered before the trigger label; when null, no leading icon is rendered */
  public readonly iconName = input<IconName | null>(DROP_DOWN_SELECTOR_ICON_NAME_DEFAULT);

  /** the icon size to use for icons rendered inside the trigger, derived from the trigger size variant */
  protected readonly triggerIconSize = computed<IconSize>(() => TRIGGER_ICON_SIZE_BY_TRIGGER_SIZE[this.size()]);

  /** internal flag indicating whether the dropdown menu overlay is currently open */
  private readonly _isOpen = signal<boolean>(false);

  /** whether the dropdown menu overlay is currently open */
  public readonly isOpen = computed<boolean>(() => this._isOpen());

  /** the resolved cdk overlay positions for the dropdown menu */
  protected readonly menuPositions = computed<ConnectedPosition[]>(() => POSITION_CONFIGURATIONS[this.position()]);

  /** the composed trigger label combining the label input and the brain-derived display value text */
  protected readonly displayLabel = computed<string>(() => {
    const valueText = this.brain.displayValueText();

    if (valueText === null) {
      return this.label();
    }

    return `${this.label()}: ${valueText}`;
  });

  /** handles a click on the trigger button, toggling the dropdown menu open state */
  protected onTriggerClick(): void {
    if (this.disabled()) {
      return;
    }

    this._isOpen.update((current) => !current);
  }

  /** handles a click on a menu option; in single mode the menu also closes after toggling */
  protected onItemClick(item: SelectionValue<TValue>): void {
    this.brain.toggleItem(item);

    if (this.selectionMode() === 'single') {
      this._close();
    }
  }

  /** handles a click on the clear menu item, clearing the selection and closing the menu */
  protected onClearClick(): void {
    this.brain.clearSelection();
    this._close();
  }

  /** handles the overlay backdrop click, closing the menu */
  protected onBackdropClick(): void {
    this._close();
  }

  /** handles a keydown on the overlay panel; closes the menu when escape is pressed */
  protected onPanelKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') {
      return;
    }

    event.preventDefault();
    this._close();
  }

  /** closes the dropdown menu */
  private _close(): void {
    this._isOpen.set(false);
  }
}
