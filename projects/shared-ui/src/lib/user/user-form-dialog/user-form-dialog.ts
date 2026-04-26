import { Component, ChangeDetectionStrategy, computed, inject, output, signal } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { type User } from '@organization/shared-types';
import { Dialog } from '../../core/dialog/dialog';
import { DialogHeader } from '../../core/dialog/dialog-header';
import { DialogContent } from '../../core/dialog/dialog-content';
import { UserForm, type UserFormData } from '../user-form/user-form';
import { type DialogController } from '../../core/dialog/dialog-controller';

export type UserFormDialogData = {
  existingUser?: User | null;
  hasRoundedCorners?: boolean;
  dialogController?: DialogController<UserFormDialog>;
};

@Component({
  selector: 'org-user-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, DialogHeader, DialogContent, UserForm],
  templateUrl: './user-form-dialog.html',
  host: {
    class: 'contents',
  },
})
export class UserFormDialog {
  private readonly _dialogRef = inject(DialogRef<UserFormDialog>);

  protected readonly data = inject<UserFormDialogData>(DIALOG_DATA);

  protected readonly isProcessing = signal<boolean>(false);

  public readonly formSubmitted = output<UserFormData>();

  /**
   * sets the processing state of the dialog
   */
  public setProcessing(isProcessing: boolean): void {
    this.isProcessing.set(isProcessing);

    if (this.data.dialogController) {
      this.data.dialogController.setEnableEscapeKey(!isProcessing);
    }
  }

  protected readonly dialogTitle = computed<string>(() => {
    return this.data.existingUser ? 'Edit User' : 'Create User';
  });

  protected readonly hasRoundedCorners = computed<boolean>(() => {
    return this.data.hasRoundedCorners ?? true;
  });

  protected readonly existingUser = computed<User | null>(() => {
    return this.data.existingUser ?? null;
  });

  protected onFormSubmitted(formData: UserFormData): void {
    this.formSubmitted.emit(formData);
  }
}
