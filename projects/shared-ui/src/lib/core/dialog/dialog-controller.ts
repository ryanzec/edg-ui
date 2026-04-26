import {
  Component,
  ChangeDetectionStrategy,
  TemplateRef,
  ViewEncapsulation,
  inject,
  input,
  output,
} from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { DialogBrainDirective } from '../../brain/dialog-brain/dialog-brain';

/** all available dialog position values */
export const allDialogPositions = ['center', 'top', 'bottom', 'left', 'right'] as const;

/** union type of all valid dialog positions */
export type DialogPosition = (typeof allDialogPositions)[number];

/** default value for the position input */
export const DIALOG_CONTROLLER_POSITION_DEFAULT: DialogPosition = 'center';

/** default value for the hasRoundedCorners input */
export const DIALOG_CONTROLLER_HAS_ROUNDED_CORNERS_DEFAULT = true;

/** default value for the hasBackdrop input */
export const DIALOG_CONTROLLER_HAS_BACKDROP_DEFAULT = true;

/** default value for the enableCloseOnClickOutside input */
export const DIALOG_CONTROLLER_ENABLE_CLOSE_ON_CLICK_OUTSIDE_DEFAULT = false;

/** default value for the enableEscapeKey input */
export const DIALOG_CONTROLLER_ENABLE_ESCAPE_KEY_DEFAULT = true;

/** default value for the showCloseIcon input */
export const DIALOG_CONTROLLER_SHOW_CLOSE_ICON_DEFAULT = true;

@Component({
  selector: 'org-dialog-controller',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  styleUrl: './dialog-controller.css',
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [
    {
      directive: DialogBrainDirective,
      inputs: [
        'dialogComponent: dialogComponent',
        'dialogTemplate: dialogTemplate',
        'dialogPosition: position',
        'dialogHasRoundedCorners: hasRoundedCorners',
        'dialogHasBackdrop: hasBackdrop',
        'dialogEnableCloseOnClickOutside: enableCloseOnClickOutside',
        'dialogEnableEscapeKey: enableEscapeKey',
        'dialogShowCloseIcon: showCloseIcon',
      ],
      outputs: ['dialogClosed: closed'],
    },
  ],
  host: {
    '[attr.data-position]': 'position()',
    '[attr.data-has-rounded-corners]': 'hasRoundedCorners() ? "" : null',
    '[attr.data-has-backdrop]': 'hasBackdrop() ? "" : null',
    '[attr.data-enable-close-on-click-outside]': 'enableCloseOnClickOutside() ? "" : null',
    '[attr.data-enable-escape-key]': 'enableEscapeKey() ? "" : null',
    '[attr.data-show-close-icon]': 'showCloseIcon() ? "" : null',
  },
})
export class DialogController<T> {
  private readonly _brain = inject(DialogBrainDirective, { self: true });

  /** the component type to render inside the dialog */
  public readonly dialogComponent = input<ComponentType<T>>();

  /** the template reference to render inside the dialog */
  public readonly dialogTemplate = input<TemplateRef<unknown>>();

  /** position of the dialog on screen */
  public readonly position = input<DialogPosition>(DIALOG_CONTROLLER_POSITION_DEFAULT);

  /** whether the dialog container has rounded corners */
  public readonly hasRoundedCorners = input<boolean>(DIALOG_CONTROLLER_HAS_ROUNDED_CORNERS_DEFAULT);

  /** whether a backdrop overlay is shown behind the dialog */
  public readonly hasBackdrop = input<boolean>(DIALOG_CONTROLLER_HAS_BACKDROP_DEFAULT);

  /** this disables the close on click outside of the dialog */
  public readonly enableCloseOnClickOutside = input<boolean>(DIALOG_CONTROLLER_ENABLE_CLOSE_ON_CLICK_OUTSIDE_DEFAULT);

  /** this controls whether the escape key can close the dialog */
  public readonly enableEscapeKey = input<boolean>(DIALOG_CONTROLLER_ENABLE_ESCAPE_KEY_DEFAULT);

  /** this controls whether the close icon is shown in the dialog */
  public readonly showCloseIcon = input<boolean>(DIALOG_CONTROLLER_SHOW_CLOSE_ICON_DEFAULT);

  /** emitted whenever the dialog is closed by any means */
  public readonly closed = output<void>();

  /** opens the dialog with optional data passed to the dialog component or template context */
  public openDialog(data?: Record<string, unknown>): DialogRef<T, T> | null {
    return this._brain.openDialog(data) as unknown as DialogRef<T, T> | null;
  }

  /** programmatically closes the currently open dialog */
  public closeDialog(): void {
    this._brain.closeDialog();
  }

  /** dynamically enables or disables the escape key for closing the dialog */
  public setEnableEscapeKey(enabled: boolean): void {
    this._brain.setEnableEscapeKey(enabled);
  }

  /** dynamically shows or hides the close icon for the currently open dialog */
  public setShowCloseIcon(show: boolean): void {
    this._brain.setShowCloseIcon(show);
  }
}
