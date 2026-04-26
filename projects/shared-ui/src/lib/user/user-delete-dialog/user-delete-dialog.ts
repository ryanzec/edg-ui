import { Component, ChangeDetectionStrategy, computed, inject, output, signal } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { type User } from '@organization/shared-types';
import { Dialog } from '../../core/dialog/dialog';
import { DialogHeader } from '../../core/dialog/dialog-header';
import { DialogContent } from '../../core/dialog/dialog-content';
import { DialogFooter } from '../../core/dialog/dialog-footer';
import { Button } from '../../core/button/button';
import { type DialogController } from '../../core/dialog/dialog-controller';

export type UserDeleteData = Pick<User, 'id'> & { name: string };

export type UserDeleteDialogData = {
  user: UserDeleteData;
  hasRoundedCorners?: boolean;
  dialogClass?: string;
  dialogController?: DialogController<UserDeleteDialog>;
};

@Component({
  selector: 'org-user-delete-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, DialogHeader, DialogContent, DialogFooter, Button],
  templateUrl: './user-delete-dialog.html',
  host: {},
})
export class UserDeleteDialog {
  private readonly _dialogRef = inject(DialogRef<UserDeleteDialog>);

  protected readonly data = inject<UserDeleteDialogData>(DIALOG_DATA);

  protected readonly isProcessing = signal<boolean>(false);

  /**
   * emitted when the user confirms deletion
   */
  public readonly deleteConfirmed = output<UserDeleteData>();

  /**
   * emitted when the user cancels deletion
   */
  public readonly cancelConfirmed = output<UserDeleteData>();

  /**
   * sets the processing state of the dialog
   */
  public setProcessing(isProcessing: boolean): void {
    this.isProcessing.set(isProcessing);

    if (this.data.dialogController) {
      this.data.dialogController.setEnableEscapeKey(!isProcessing);
    }
  }

  protected readonly hasRoundedCorners = computed<boolean>(() => {
    return this.data.hasRoundedCorners ?? true;
  });

  protected readonly dialogClass = computed<string>(() => {
    return this.data.dialogClass ?? '';
  });

  protected readonly usersName = computed<string>(() => {
    return this.data.user.name;
  });

  protected onDeleteClick(): void {
    this.deleteConfirmed.emit(this.data.user);
  }

  protected onCancelClick(): void {
    this.cancelConfirmed.emit(this.data.user);
  }
}
