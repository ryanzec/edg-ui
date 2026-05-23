import { Component, ChangeDetectionStrategy, computed, inject, output, signal } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { type User } from '@organization/shared-utils';
import { Dialog } from '../../core/dialog/dialog';
import { DialogHeader } from '../../core/dialog/dialog-header';
import { DialogContent } from '../../core/dialog/dialog-content';
import { DialogFooter } from '../../core/dialog/dialog-footer';
import { Button } from '../../core/button/button';
import { DIALOG_TRIGGER, DialogBrainDirective } from '../../core/dialog/dialog-brain';

export type UserDeleteData = Pick<User, 'id'> & { name: string };

export type UserDeleteDialogData = {
  user: UserDeleteData;
  hasRoundedCorners?: boolean;
  dialogClass?: string;
};

@Component({
  selector: 'org-user-delete-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, DialogHeader, DialogContent, DialogFooter, Button],
  templateUrl: './user-delete-dialog.html',
  hostDirectives: [
    {
      directive: DialogBrainDirective,
      inputs: ['hasBackdrop', 'enableCloseOnClickOutside', 'enableEscapeKey', 'showCloseIcon'],
      outputs: ['closed'],
    },
  ],
  host: {},
})
export class UserDeleteDialog {
  // when rendered as the overlay instance, the trigger brain is provided via cdk dialog providers and is the brain
  // that actually owns the dialog ref. when rendered as the trigger instance, fall back to the self brain (which is
  // the same brain that opens the dialog).
  private readonly _selfBrain = inject(DialogBrainDirective, { self: true });
  private readonly _triggerBrain = inject(DIALOG_TRIGGER, { optional: true });
  private readonly _brain = this._triggerBrain ?? this._selfBrain;

  private readonly _dialogRef = inject(DialogRef<UserDeleteDialog>, { optional: true });

  protected readonly data = inject<UserDeleteDialogData>(DIALOG_DATA, { optional: true });

  protected readonly isProcessing = signal<boolean>(false);

  /** true when this instance is rendered inside the cdk dialog overlay (not the trigger instance in the parent view) */
  protected readonly isInDialog = !!this._dialogRef;

  /**
   * emitted when the user confirms deletion
   */
  public readonly deleteConfirmed = output<UserDeleteData>();

  /**
   * emitted when the user cancels deletion
   */
  public readonly cancelConfirmed = output<UserDeleteData>();

  /**
   * opens the dialog with the supplied data
   */
  public openDialog(data: UserDeleteDialogData): DialogRef<UserDeleteDialog, UserDeleteDialog> | null {
    return this._brain.openDialog<UserDeleteDialog>(UserDeleteDialog, data as unknown as Record<string, unknown>);
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

  protected readonly hasRoundedCorners = computed<boolean>(() => {
    return this.data?.hasRoundedCorners ?? true;
  });

  protected readonly dialogClass = computed<string>(() => {
    return this.data?.dialogClass ?? '';
  });

  protected readonly usersName = computed<string>(() => {
    return this.data?.user.name ?? '';
  });

  protected onDeleteClick(): void {
    if (!this.data) {
      return;
    }

    this.deleteConfirmed.emit(this.data.user);
  }

  protected onCancelClick(): void {
    if (!this.data) {
      return;
    }

    this.cancelConfirmed.emit(this.data.user);
  }
}
