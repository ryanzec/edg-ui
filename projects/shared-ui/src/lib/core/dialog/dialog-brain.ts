import {
  Directive,
  DestroyRef,
  InjectionToken,
  Signal,
  TemplateRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dialog as CdkDialog, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { take } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { logManager } from '@organization/shared-utils';

/**
 * provides the triggering brain instance to the overlay component so that calls to closeDialog,
 * setEnableEscapeKey, etc. invoked from inside the overlay reach the brain that actually owns the cdk dialog ref.
 * resolves to undefined when injected outside the overlay context (e.g. from the trigger instance itself).
 */
export const DIALOG_TRIGGER = new InjectionToken<DialogBrainDirective>('DialogTrigger');

/** default value for the hasBackdrop input */
export const DIALOG_HAS_BACKDROP_DEFAULT = true;

/** default value for the enableCloseOnClickOutside input */
export const DIALOG_ENABLE_CLOSE_ON_CLICK_OUTSIDE_DEFAULT = false;

/** default value for the enableEscapeKey input */
export const DIALOG_ENABLE_ESCAPE_KEY_DEFAULT = true;

/** default value for the showCloseIcon input */
export const DIALOG_SHOW_CLOSE_ICON_DEFAULT = true;

/**
 * headless brain directive that wraps the cdk dialog. consumers apply this directive (typically as a host directive
 * on their own dialog component) to gain configuration inputs, escape-key gating, the close-icon and close-icon-enabled
 * state signals, and the dialog accessibility contract (role, aria-modal, aria-labelledby + titleId for header wiring).
 * consumers call openDialog() with their content reference (a component or a template) to open the dialog.
 */
@Directive({
  selector: '[orgDialogBrain]',
  exportAs: 'orgDialogBrain',
  host: {
    role: 'dialog',
    'aria-modal': 'true',
    '[attr.aria-labelledby]': 'titleId',
    '(document:keydown.escape)': 'onEscapeKey($event)',
  },
})
export class DialogBrainDirective {
  private readonly _cdkDialog = inject(CdkDialog);
  private readonly _destroyRef = inject(DestroyRef);

  private _dialogRef: DialogRef<unknown, unknown> | undefined = undefined;
  private _escapeKeyEnabled = true;
  private readonly _closeIconEnabled = signal<boolean>(true);
  private readonly _showCloseIconState = signal<boolean>(true);

  /** unique id used to link the dialog to its title for accessibility (read by the dialog header brain) */
  public readonly titleId: string = uuidv4();

  /** whether a backdrop overlay is shown behind the dialog */
  public readonly hasBackdrop = input<boolean>(DIALOG_HAS_BACKDROP_DEFAULT);

  /** whether clicking the backdrop / outside the dialog should close it */
  public readonly enableCloseOnClickOutside = input<boolean>(DIALOG_ENABLE_CLOSE_ON_CLICK_OUTSIDE_DEFAULT);

  /** whether the escape key can close the dialog */
  public readonly enableEscapeKey = input<boolean>(DIALOG_ENABLE_ESCAPE_KEY_DEFAULT);

  /** whether the close icon is shown in the dialog */
  public readonly showCloseIcon = input<boolean>(DIALOG_SHOW_CLOSE_ICON_DEFAULT);

  /** emitted whenever the dialog is closed by any means */
  public readonly closed = output<void>();

  /** readonly signal exposing whether the close icon is currently enabled (read by close-button brain) */
  public readonly closeIconEnabled: Signal<boolean> = this._closeIconEnabled.asReadonly();

  /** readonly signal exposing whether the close icon is currently visible (read by close-button brain) */
  public readonly showCloseIconState: Signal<boolean> = this._showCloseIconState.asReadonly();

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

    this._escapeKeyEnabled = this.enableEscapeKey();
    this._closeIconEnabled.set(this._escapeKeyEnabled);
    this._showCloseIconState.set(this.showCloseIcon());

    const hasBackdrop = this.hasBackdrop();
    const disableClose = this.enableCloseOnClickOutside() === false;

    const providers = [{ provide: DIALOG_TRIGGER, useValue: this }];

    this._dialogRef = this._cdkDialog.open(content, {
      data,
      hasBackdrop,
      closeOnNavigation: true,
      disableClose,
      providers,
    }) as DialogRef<unknown, unknown>;

    this._dialogRef.closed.pipe(take(1), takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this.closed.emit();
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
    this._showCloseIconState.set(show);
  }

  /** handles the document escape key event to close the dialog when appropriate */
  protected onEscapeKey(_event: Event): void {
    if (!this._dialogRef) {
      return;
    }

    if (this.enableCloseOnClickOutside()) {
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
}
