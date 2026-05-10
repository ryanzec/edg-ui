import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CdkConnectedOverlay, CdkOverlayOrigin, type ConnectedPosition } from '@angular/cdk/overlay';
import { angularUtils } from '@organization/shared-utils';
import { type IconName } from '../../brain/icon-brain/icon-brain';
import { Icon, type IconSize } from '../icon/icon';
import { List } from '../list/list';
import { ListItem } from '../list/list-item';
import { ListItemIcon } from '../list/list-item-icon';
import { OverlayMenuDivider } from '../overlay-menu/overlay-menu-divider';
import { ScrollArea } from '../scroll-area/scroll-area';
import { ComponentSize } from '../types/component-types';
import {
  DROP_DOWN_SELECTOR_DISABLED_DEFAULT as BRAIN_DROP_DOWN_SELECTOR_DISABLED_DEFAULT,
  DROP_DOWN_SELECTOR_SELECTION_MODE_DEFAULT as BRAIN_DROP_DOWN_SELECTOR_SELECTION_MODE_DEFAULT,
  DropDownSelectorBrainDirective,
  type DropDownSelectorSelectionMode,
} from '../../brain/drop-down-selector-brain/drop-down-selector-brain';

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
 * through the two-way bindable `selectedItems` model. selection logic, comparison, computed display text,
 * open / closed state, active descendant tracking, and keyboard handling are owned by the headless
 * `DropDownSelectorBrainDirective` applied as a host directive.
 */
@Component({
  selector: 'org-drop-down-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdkOverlayOrigin,
    CdkConnectedOverlay,
    Icon,
    List,
    ListItem,
    ListItemIcon,
    OverlayMenuDivider,
    ScrollArea,
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
    '[attr.data-has-selection]': 'brain.hasSelection() ? "" : null',
    '[attr.data-size]': 'size()',
    '[attr.aria-disabled]': 'brain.disabled() ? "true" : null',
  },
})
export class DropDownSelector<TValue = unknown> {
  protected readonly brain = inject(DropDownSelectorBrainDirective, {
    self: true,
  }) as DropDownSelectorBrainDirective<TValue>;

  /** the size variant of the trigger element */
  public readonly size = input<DropDownSelectorSize>(DROP_DOWN_SELECTOR_SIZE_DEFAULT);

  /** the position of the dropdown menu relative to the trigger */
  public readonly position = input<DropDownSelectorPosition>(DROP_DOWN_SELECTOR_POSITION_DEFAULT);

  /** the optional icon rendered before the trigger label; when undefined, no leading icon is rendered */
  public readonly iconName = input<IconName | undefined, IconName | null | undefined>(
    DROP_DOWN_SELECTOR_ICON_NAME_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** the icon size to use for icons rendered inside the trigger, derived from the trigger size variant */
  protected readonly triggerIconSize = computed<IconSize>(() => TRIGGER_ICON_SIZE_BY_TRIGGER_SIZE[this.size()]);

  /** the resolved cdk overlay positions for the dropdown menu */
  protected readonly menuPositions = computed<ConnectedPosition[]>(() => POSITION_CONFIGURATIONS[this.position()]);

  /** the composed trigger label combining the brain-owned label and the brain-derived display value text */
  protected readonly displayLabel = computed<string>(() => {
    const valueText = this.brain.displayValueText();

    if (valueText === null) {
      return this.brain.label();
    }

    return `${this.brain.label()}: ${valueText}`;
  });

  /** resolves the menu item pre-icon based on selection mode and selected state */
  protected getItemPreIcon(isSelected: boolean): IconName | undefined {
    if (this.brain.selectionMode() === 'multiple') {
      return isSelected ? 'square-check-big' : 'square';
    }

    return isSelected ? 'check' : undefined;
  }
}
