import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { ICON_BRAIN_LABEL_DEFAULT, type IconName } from '../../brain/icon-brain/icon-brain';
import { Icon, ICON_COLOR_DEFAULT, type IconColor } from '../icon/icon';

/** default value for the {@link EmptyIndicatorIcon.color} input */
export const EMPTY_INDICATOR_ICON_COLOR_DEFAULT: IconColor = ICON_COLOR_DEFAULT;

/** default value for the {@link EmptyIndicatorIcon.label} input */
export const EMPTY_INDICATOR_ICON_LABEL_DEFAULT: string | undefined = ICON_BRAIN_LABEL_DEFAULT;

@Component({
  selector: 'org-empty-indicator-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: '<org-icon size="4xl" [name]="name()" [color]="color()" [label]="label()" />',
})
export class EmptyIndicatorIcon {
  /** the semantic name of the icon to render, passed through to the inner Icon component */
  public name = input.required<IconName>();

  /** the color variant of the icon, passed through to the inner Icon component */
  public color = input<IconColor>(EMPTY_INDICATOR_ICON_COLOR_DEFAULT);

  /** the accessible label of the icon, passed through to the inner Icon component */
  public label = input<string | undefined, string | null | undefined>(EMPTY_INDICATOR_ICON_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });
}
