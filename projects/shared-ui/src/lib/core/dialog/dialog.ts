import { Component, ChangeDetectionStrategy, input, InjectionToken } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { DialogCloseButton } from './dialog-close-button';

/** injection token to allow child components to access the dialog instance */
export const DIALOG_COMPONENT = new InjectionToken<Dialog>('Dialog Component');

/** default value for the hasRoundedCorners input */
export const DIALOG_HAS_ROUNDED_CORNERS_DEFAULT = true;

/** default value for the defaultShowCloseIcon input */
export const DIALOG_DEFAULT_SHOW_CLOSE_ICON_DEFAULT = true;

/** default value for the defaultCloseIconEnabled input */
export const DIALOG_DEFAULT_CLOSE_ICON_ENABLED_DEFAULT = true;

@Component({
  selector: 'org-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogCloseButton],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
  providers: [{ provide: DIALOG_COMPONENT, useExisting: Dialog }],
  host: {
    '[attr.aria-labelledby]': 'titleId',
    '[attr.data-has-rounded-corners]': 'hasRoundedCorners() ? "" : null',
  },
})
export class Dialog {
  /** unique id used to link the dialog to its title for accessibility */
  public readonly titleId: string = uuidv4();

  /** controls whether the dialog container has rounded corners */
  public readonly hasRoundedCorners = input<boolean>(DIALOG_HAS_ROUNDED_CORNERS_DEFAULT);

  /** fallback for whether the close icon is visible when not controlled via DIALOG_DATA */
  public readonly defaultShowCloseIcon = input<boolean>(DIALOG_DEFAULT_SHOW_CLOSE_ICON_DEFAULT);

  /** fallback for whether the close icon is enabled when not controlled via DIALOG_DATA */
  public readonly defaultCloseIconEnabled = input<boolean>(DIALOG_DEFAULT_CLOSE_ICON_ENABLED_DEFAULT);
}
