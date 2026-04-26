import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/** all available button group orientation values */
export const allButtonGroupOrientations = ['horizontal', 'vertical'] as const;

/** the layout direction of a button group */
export type ButtonGroupOrientation = (typeof allButtonGroupOrientations)[number];

/** the default orientation of a button group */
export const BUTTON_GROUP_ORIENTATION_DEFAULT: ButtonGroupOrientation = 'horizontal';

@Component({
  selector: 'org-button-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: '<ng-content />',
  styleUrl: './button-group.css',
  host: {
    '[attr.data-orientation]': 'orientation()',
  },
})
export class ButtonGroup {
  /** the layout direction of the grouped buttons */
  public readonly orientation = input<ButtonGroupOrientation>(BUTTON_GROUP_ORIENTATION_DEFAULT);
}
