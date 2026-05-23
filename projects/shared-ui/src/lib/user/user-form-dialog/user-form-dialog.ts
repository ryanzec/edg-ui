import { Component, ChangeDetectionStrategy, computed, inject, output, signal } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { type User } from '@organization/shared-utils';
import { Dialog } from '../../core/dialog/dialog';
import { DialogHeader } from '../../core/dialog/dialog-header';
import { DialogContent } from '../../core/dialog/dialog-content';
import { UserForm, type UserFormData } from '../user-form/user-form';
import { DIALOG_TRIGGER, DialogBrainDirective } from '../../core/dialog/dialog-brain';

export type UserFormDialogData = {
  existingUser?: User | null;
  hasRoundedCorners?: boolean;
};

@Component({
  selector: 'org-user-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, DialogHeader, DialogContent, UserForm],
  templateUrl: './user-form-dialog.html',
  hostDirectives: [
    {
      directive: DialogBrainDirective,
      inputs: ['hasBackdrop', 'enableCloseOnClickOutside', 'enableEscapeKey', 'showCloseIcon'],
      outputs: ['closed'],
    },
  ],
  host: {
    class: 'contents',
  },
})
export class UserFormDialog {
  // when rendered as the overlay instance, the trigger brain is provided via cdk dialog providers and is the brain
  // that actually owns the dialog ref. when rendered as the trigger instance, fall back to the self brain (which is
  // the same brain that opens the dialog).
  private readonly _selfBrain = inject(DialogBrainDirective, { self: true });
  private readonly _triggerBrain = inject(DIALOG_TRIGGER, { optional: true });
  private readonly _brain = this._triggerBrain ?? this._selfBrain;

  private readonly _dialogRef = inject(DialogRef<UserFormDialog>, { optional: true });

  protected readonly data = inject<UserFormDialogData>(DIALOG_DATA, { optional: true });

  protected readonly isProcessing = signal<boolean>(false);

  /** true when this instance is rendered inside the cdk dialog overlay (not the trigger instance in the parent view) */
  protected readonly isInDialog = !!this._dialogRef;

  public readonly formSubmitted = output<UserFormData>();

  /**
   * opens the dialog with the supplied data
   */
  public openDialog(data?: UserFormDialogData): DialogRef<UserFormDialog, UserFormDialog> | null {
    return this._brain.openDialog<UserFormDialog>(UserFormDialog, data as Record<string, unknown> | undefined);
  }

  /**
   * programmatically closes the open dialog
   */
  public closeDialog(): void {
    this._brain.closeDialog();
  }

  /**
   * sets the processing state of the dialog and toggles the escape key gating to match
   */
  public setProcessing(isProcessing: boolean): void {
    this.isProcessing.set(isProcessing);
    this._brain.setEnableEscapeKey(!isProcessing);
  }

  protected readonly dialogTitle = computed<string>(() => {
    return this.data?.existingUser ? 'Edit User' : 'Create User';
  });

  protected readonly hasRoundedCorners = computed<boolean>(() => {
    return this.data?.hasRoundedCorners ?? true;
  });

  protected readonly existingUser = computed<User | null>(() => {
    return this.data?.existingUser ?? null;
  });

  protected onFormSubmitted(formData: UserFormData): void {
    this.formSubmitted.emit(formData);
  }
}
