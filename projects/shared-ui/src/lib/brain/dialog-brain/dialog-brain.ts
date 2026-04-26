import { Directive, InjectionToken, TemplateRef, inject, input, output, signal } from '@angular/core';
import { Dialog as CdkDialog, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { take } from 'rxjs';
import { logManager } from '@organization/shared-utils';

/**
 * provides the triggering brain instance to the overlay component so that calls to closeDialog,
 * setEnableEscapeKey, etc. invoked from inside the overlay reach the brain that actually owns the cdk dialog ref.
 * resolves to undefined when injected outside the overlay context (e.g. from the trigger instance itself).
 */
export const DIALOG_TRIGGER_BRAIN = new InjectionToken<DialogBrainDirective>('DialogTriggerBrain');

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
 * headless brain directive that wraps the cdk dialog. consumers apply this directive (typically as a host directive
 * on their own dialog component) to gain configuration inputs, escape-key gating, the close-icon and show-close-icon
 * state signals, the panel-class mapping derived from position, and the document keydown.escape host binding.
 * consumers call openDialog() with their content reference (a component or a template) to open the dialog.
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

  /** opens the dialog using the provided component or template, with optional data passed to it */
  public openDialog<T>(
    content: ComponentType<T> | TemplateRef<unknown>,
    data?: Record<string, unknown>
  ): DialogRef<T, T> | null {
    if (!content) {
      logManager.warn({
        type: 'dialog-open-error',
        message: 'a component or template is required to open a dialog',
      });

      return null;
    }

    this._escapeKeyEnabled = this.dialogEnableEscapeKey();
    this._closeIconEnabled.set(this._escapeKeyEnabled);
    this._showCloseIcon.set(this.dialogShowCloseIcon());

    const panelClass = this._getPanelClass();
    const hasBackdrop = this.dialogHasBackdrop();
    const disableClose = this.dialogEnableCloseOnClickOutside() === false;

    const providers = [{ provide: DIALOG_TRIGGER_BRAIN, useValue: this }];

    if (content instanceof TemplateRef) {
      this._dialogRef = this._cdkDialog.open(content, {
        data,
        panelClass,
        hasBackdrop,
        closeOnNavigation: true,
        disableClose,
        providers,
      }) as DialogRef<unknown, unknown>;
    } else {
      const dialogData = {
        ...data,
        hasRoundedCorners: this.dialogHasRoundedCorners(),
        showCloseIcon: this._showCloseIcon,
        closeIconEnabled: this._closeIconEnabled,
      };

      this._dialogRef = this._cdkDialog.open(content, {
        data: dialogData,
        panelClass,
        hasBackdrop,
        closeOnNavigation: true,
        disableClose,
        providers,
      }) as DialogRef<unknown, unknown>;
    }

    this._dialogRef.closed.pipe(take(1)).subscribe(() => {
      this.dialogClosed.emit();
    });

    return this._dialogRef as DialogRef<T, T>;
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
