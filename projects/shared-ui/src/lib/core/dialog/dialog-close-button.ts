import { Component, ChangeDetectionStrategy, computed, inject, Signal } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Button } from '../button/button';
import { ButtonIcon } from '../button/button-icon';
import { Dialog, DIALOG_COMPONENT } from './dialog';

/** shape of the close-button-related fields provided via DIALOG_DATA by the dialog controller */
type DialogData = {
  showCloseIcon?: boolean | Signal<boolean>;
  closeIconEnabled?: Signal<boolean>;
};

@Component({
  selector: 'org-dialog-close-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ButtonIcon],
  templateUrl: './dialog-close-button.html',
  styleUrl: './dialog-close-button.css',
})
export class DialogCloseButton {
  private readonly _dialogRef = inject(DialogRef, { optional: true });
  private readonly _dialogData = inject<DialogData>(DIALOG_DATA, { optional: true });
  private readonly _dialog = inject<Dialog>(DIALOG_COMPONENT, { host: true, optional: true });

  /** whether the close icon button is visible */
  protected readonly showCloseIcon = computed<boolean>(() => {
    const value = this._dialogData?.showCloseIcon;

    if (typeof value === 'function') {
      return (value as Signal<boolean>)();
    }

    return value ?? this._dialog?.defaultShowCloseIcon() ?? true;
  });

  /** whether the close icon button is enabled and clickable */
  protected readonly closeIconEnabled = computed<boolean>(
    () => this._dialogData?.closeIconEnabled?.() ?? this._dialog?.defaultCloseIconEnabled() ?? true
  );

  /** handles close icon button click, guards against disabled state */
  protected close(): void {
    if (!this.closeIconEnabled()) {
      return;
    }

    this._dialogRef?.close();
  }
}
