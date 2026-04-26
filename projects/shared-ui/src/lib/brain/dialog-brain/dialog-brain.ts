import { Directive, TemplateRef, inject, input, output, signal } from '@angular/core';
import { Dialog as CdkDialog, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { take } from 'rxjs';
import { logManager } from '@organization/shared-utils';

/** all available dialog position values */
export const allDialogPositions = ['center', 'top', 'bottom', 'left', 'right'] as const;

/** union type of all valid dialog positions */
export type DialogPosition = (typeof allDialogPositions)[number];

/** default value for the dialogPosition input */
export const DIALOG_POSITION_DEFAULT: DialogPosition = 'center';

/** default value for the dialogHasRoundedCorners input */
export const DIALOG_HAS_ROUNDED_CORNERS_DEFAULT = true;

/** default value for the dialogHasBackdrop input */
export const DIALOG_HAS_BACKDROP_DEFAULT = true;

/** default value for the dialogEnableCloseOnClickOutside input */
export const DIALOG_ENABLE_CLOSE_ON_CLICK_OUTSIDE_DEFAULT = false;

/** default value for the dialogEnableEscapeKey input */
export const DIALOG_ENABLE_ESCAPE_KEY_DEFAULT = true;

/** default value for the dialogShowCloseIcon input */
export const DIALOG_SHOW_CLOSE_ICON_DEFAULT = true;

/**
 * headless brain directive for the dialog-controller component. owns the cdk dialog ref, escape-key gating, the
 * close-icon and show-close-icon state signals, the panel-class mapping derived from position, and the document
 * keydown.escape host binding. presentation stays trivial — exposes inputs / outputs and forwards openDialog /
 * closeDialog calls.
 */
@Directive({
  selector: '[orgDialogBrain]',
  exportAs: 'orgDialogBrain',
  host: {
    '(document:keydown.escape)': 'onEscapeKey($event)',
  },
})
export class DialogBrainDirective {
  private readonly _cdkDialog = inject(CdkDialog);

  private _dialogRef: DialogRef<unknown, unknown> | undefined = undefined;
  private _escapeKeyEnabled = true;
  private _closeIconEnabled = signal<boolean>(true);
  private _showCloseIcon = signal<boolean>(true);

  /** the component type to render inside the dialog */
  public readonly dialogComponent = input<ComponentType<unknown>>();

  /** the template reference to render inside the dialog */
  public readonly dialogTemplate = input<TemplateRef<unknown>>();

  /** position of the dialog on screen */
  public readonly dialogPosition = input<DialogPosition>(DIALOG_POSITION_DEFAULT);

  /** whether the dialog container has rounded corners */
  public readonly dialogHasRoundedCorners = input<boolean>(DIALOG_HAS_ROUNDED_CORNERS_DEFAULT);

  /** whether a backdrop overlay is shown behind the dialog */
  public readonly dialogHasBackdrop = input<boolean>(DIALOG_HAS_BACKDROP_DEFAULT);

  /** whether clicking the backdrop / outside the dialog should close it */
  public readonly dialogEnableCloseOnClickOutside = input<boolean>(DIALOG_ENABLE_CLOSE_ON_CLICK_OUTSIDE_DEFAULT);

  /** whether the escape key can close the dialog */
  public readonly dialogEnableEscapeKey = input<boolean>(DIALOG_ENABLE_ESCAPE_KEY_DEFAULT);

  /** whether the close icon is shown in the dialog */
  public readonly dialogShowCloseIcon = input<boolean>(DIALOG_SHOW_CLOSE_ICON_DEFAULT);

  /** emitted whenever the dialog is closed by any means */
  public readonly dialogClosed = output<void>();

  /** opens the dialog with optional data passed to the dialog component or template context */
  public openDialog(data?: Record<string, unknown>): DialogRef<unknown, unknown> | null {
    const component = this.dialogComponent();
    const template = this.dialogTemplate();

    if (!component && !template) {
      logManager.warn({
        type: 'dialog-open-error',
        message: 'dialogComponent or dialogTemplate input is required to open a dialog',
      });

      return null;
    }

    this._escapeKeyEnabled = this.dialogEnableEscapeKey();
    this._closeIconEnabled.set(this._escapeKeyEnabled);
    this._showCloseIcon.set(this.dialogShowCloseIcon());

    const dialogData = {
      ...data,
      hasRoundedCorners: this.dialogHasRoundedCorners(),
      showCloseIcon: this._showCloseIcon,
      closeIconEnabled: this._closeIconEnabled,
    };

    const panelClass = this._getPanelClass();
    const hasBackdrop = this.dialogHasBackdrop();
    const disableClose = this.dialogEnableCloseOnClickOutside() === false;

    if (component) {
      this._dialogRef = this._cdkDialog.open(component, {
        data: dialogData,
        panelClass,
        hasBackdrop,
        closeOnNavigation: true,
        disableClose,
      }) as DialogRef<unknown, unknown>;
    } else {
      this._dialogRef = this._cdkDialog.open(template!, {
        data,
        panelClass,
        hasBackdrop,
        closeOnNavigation: true,
        disableClose,
      }) as DialogRef<unknown, unknown>;
    }

    this._dialogRef.closed.pipe(take(1)).subscribe(() => {
      this.dialogClosed.emit();
    });

    return this._dialogRef;
  }

  /** programmatically closes the currently open dialog */
  public closeDialog(): void {
    if (!this._dialogRef) {
      logManager.warn({
        type: 'dialog-close-error',
        message: 'attempted to close a dialog when no reference was available',
      });

      return;
    }

    this._dialogRef.close();
  }

  /** dynamically enables or disables the escape key for closing the dialog */
  public setEnableEscapeKey(enabled: boolean): void {
    this._escapeKeyEnabled = enabled;
    this._closeIconEnabled.set(enabled);
  }

  /** dynamically shows or hides the close icon for the currently open dialog */
  public setShowCloseIcon(show: boolean): void {
    this._showCloseIcon.set(show);
  }

  /** handles the document escape key event to close the dialog when appropriate */
  protected onEscapeKey(_event: Event): void {
    if (!this._dialogRef) {
      return;
    }

    if (this.dialogEnableCloseOnClickOutside()) {
      return;
    }

    if (!this._escapeKeyEnabled) {
      return;
    }

    // disabling the close for the dialog is meant to only disable the close on click outside as that can happen
    // by mistake much more easily then hitting the escape key, keeping the escape key is also needed from an
    // accessibility standpoint
    this._dialogRef.close();
  }

  private _getPanelClass(): string[] {
    const position = this.dialogPosition();

    switch (position) {
      case 'top':
        return ['dialog-panel-top'];
      case 'bottom':
        return ['dialog-panel-bottom'];
      case 'left':
        return ['dialog-panel-left'];
      case 'right':
        return ['dialog-panel-right'];
      default:
        return ['dialog-panel-center'];
    }
  }
}
