import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { DialogCloseButton } from './dialog-close-button';

/** all available dialog position values */
export const allDialogPositions = ['center', 'top', 'bottom', 'left', 'right'] as const;

/** union type of all valid dialog positions */
export type DialogPosition = (typeof allDialogPositions)[number];

/** default value for the position input */
export const DIALOG_POSITION_DEFAULT: DialogPosition = 'center';

/** default value for the hasRoundedCorners input */
export const DIALOG_HAS_ROUNDED_CORNERS_DEFAULT = true;

@Component({
  selector: 'org-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogCloseButton],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
  host: {
    '[attr.data-position]': 'position()',
    '[attr.data-rounded]': 'hasRoundedCorners() ? "" : null',
  },
})
export class Dialog {
  /** position of the dialog on screen, drives the cdk-overlay-pane positioning via global :has() css */
  public readonly position = input<DialogPosition>(DIALOG_POSITION_DEFAULT);

  /** controls whether the dialog container has rounded corners */
  public readonly hasRoundedCorners = input<boolean>(DIALOG_HAS_ROUNDED_CORNERS_DEFAULT);
}
