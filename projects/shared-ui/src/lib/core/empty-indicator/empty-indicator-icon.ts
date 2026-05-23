import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { ICON_BRAIN_LABEL_DEFAULT, type IconName } from '../icon/icon-brain';
import { Icon, type IconColor } from '../icon/icon';

/** all available empty-indicator-icon color values */
export const allEmptyIndicatorIconColors = [
  'inherit',
  'muted',
  'faint',
  'primary',
  'secondary',
  'neutral',
  'safe',
  'info',
  'caution',
  'warning',
  'danger',
] as const;

/** the color tint variant for the empty-indicator-icon slot */
export type EmptyIndicatorIconColor = (typeof allEmptyIndicatorIconColors)[number];

/** default value for the {@link EmptyIndicatorIcon.color} input */
export const EMPTY_INDICATOR_ICON_COLOR_DEFAULT: EmptyIndicatorIconColor = 'inherit';

/** default value for the {@link EmptyIndicatorIcon.label} input */
export const EMPTY_INDICATOR_ICON_LABEL_DEFAULT: string | undefined = ICON_BRAIN_LABEL_DEFAULT;

/** the icon color value forwarded to the inner Icon — kept at "inherit" so the slot host's color flows through via currentColor */
const INNER_ICON_COLOR: IconColor = 'inherit';

@Component({
  selector: 'org-empty-indicator-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: '<org-icon size="4xl" [name]="name()" [color]="innerIconColor" [label]="label()" />',
  styleUrl: './empty-indicator-icon.css',
  host: {
    '[attr.data-color]': 'color()',
  },
})
export class EmptyIndicatorIcon {
  /** the semantic name of the icon to render, passed through to the inner Icon component */
  public name = input.required<IconName>();

  /**
   * the color tint applied to the icon slot; the host paints `color`, the inner Icon is locked to "inherit"
   * so the value flows through via `currentColor`
   */
  public color = input<EmptyIndicatorIconColor>(EMPTY_INDICATOR_ICON_COLOR_DEFAULT);

  /** the accessible label of the icon, passed through to the inner Icon component */
  public label = input<string | undefined, string | null | undefined>(EMPTY_INDICATOR_ICON_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the icon color value forwarded to the inner Icon — kept at "inherit" so the slot host's color flows through */
  protected readonly innerIconColor = INNER_ICON_COLOR;
}
