import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/** all available dialog icon color values */
export const allDialogIconColors = ['primary', 'neutral', 'info', 'safe', 'caution', 'warning', 'danger'] as const;

/** the semantic color variant of the dialog icon */
export type DialogIconColor = (typeof allDialogIconColors)[number];

/** default value for the color input */
export const DIALOG_ICON_COLOR_DEFAULT: DialogIconColor = 'info';

@Component({
  selector: 'org-dialog-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './dialog-icon.css',
  host: {
    '[attr.data-color]': 'color()',
  },
})
export class DialogIcon {
  /** the semantic color applied to the projected icon glyph */
  public readonly color = input<DialogIconColor>(DIALOG_ICON_COLOR_DEFAULT);
}
