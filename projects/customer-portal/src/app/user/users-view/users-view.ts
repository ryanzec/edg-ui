import { Component, ChangeDetectionStrategy, inject, ViewChild, signal } from '@angular/core';
import {
  UsersList,
  UsersDataStore,
  NotificationManager,
  UserFormDialog,
  UserDeleteDialog,
  UserFormData,
  UserDeleteData,
  Box,
  BoxHeader,
  BoxContent,
} from '@organization/shared-ui';
import { logManager } from '@organization/shared-utils';
import { type User } from '@organization/shared-utils';
import { firstValueFrom } from 'rxjs';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'cp-users-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UsersList, UserFormDialog, UserDeleteDialog, Box, BoxHeader, BoxContent],
  providers: [UsersDataStore],
  templateUrl: './users-view.html',
})
export class UsersView {
  private readonly _usersDataStore = inject(UsersDataStore);
  private readonly _notificationManager = inject(NotificationManager);

  private _selectedUser = signal<User | null>(null);
  private _userFormDialogRef: DialogRef<UserFormDialog, UserFormDialog> | null = null;
  private _userDeleteDialogRef: DialogRef<UserDeleteDialog, UserDeleteDialog> | null = null;

  protected readonly usersError = this._usersDataStore.error;

  @ViewChild('userFormDialog')
  public userFormDialog!: UserFormDialog;

  @ViewChild('userDeleteDialog')
  public userDeleteDialog!: UserDeleteDialog;

  protected onInviteMemberClick(): void {
    this._openFormDialog(null);
  }

  protected onEditUser(user: User): void {
    this._openFormDialog(user);
  }

  protected onDeleteUser(user: User): void {
    this._openDeleteDialog(user);
  }

  protected async onBulkDeleteUsers(users: User[]): Promise<void> {
    if (users.length === 0) {
      return;
    }

    let successCount = 0;
    let failureCount = 0;

    for (const user of users) {
      try {
        const { error } = await firstValueFrom(this._usersDataStore.delete(user.id));

        if (error?.message) {
          throw new Error(error.message);
        }

        successCount++;
      } catch (error: unknown) {
        failureCount++;

        logManager.error({
          type: 'bulk-delete-user-error',
          message: logManager.getErrorMessage(error as Error),
          userId: user.id,
          error,
        });
      }
    }

    if (failureCount === 0) {
      this._notificationManager.add({
        message: `Deleted ${successCount} member${successCount === 1 ? '' : 's'}`,
        color: 'safe',
        canClose: true,
      });

      return;
    }

    this._notificationManager.add({
      message: `Deleted ${successCount} member${successCount === 1 ? '' : 's'}, failed to delete ${failureCount}`,
      color: 'danger',
      canClose: true,
    });
  }

  protected clearSelectedUser(): void {
    this._selectedUser.set(null);
  }

  private _openFormDialog(existingUser: User | null): void {
    this._selectedUser.set(existingUser);

    this._userFormDialogRef = this.userFormDialog.openDialog({
      existingUser,
    });

    if (!this._userFormDialogRef || !this._userFormDialogRef.componentInstance) {
      logManager.error({
        type: 'user-form-dialog-error',
        message: 'failed to open dialog',
        hasDialogRef: !!this._userFormDialogRef,
        hasComponentInstance: !!this._userFormDialogRef?.componentInstance,
      });

      this._notificationManager.add({
        message: `Failed to ${existingUser ? 'update' : 'add'} member`,
        color: 'danger',
        canClose: true,
      });

      return;
    }

    const componentInstance = this._userFormDialogRef.componentInstance as UserFormDialog;

    componentInstance.formSubmitted.subscribe((formData: UserFormData) => {
      this._processUserForm(formData);
    });
  }

  private _openDeleteDialog(user: User): void {
    this._selectedUser.set(user);

    this._userDeleteDialogRef = this.userDeleteDialog.openDialog({
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
      },
    });

    if (!this._userDeleteDialogRef || !this._userDeleteDialogRef.componentInstance) {
      logManager.error({
        type: 'user-delete-dialog-error',
        message: 'failed to open dialog',
        hasDialogRef: !!this._userDeleteDialogRef,
        hasComponentInstance: !!this._userDeleteDialogRef?.componentInstance,
      });

      this._notificationManager.add({
        message: 'Failed to delete member',
        color: 'danger',
        canClose: true,
      });

      return;
    }

    const componentInstance = this._userDeleteDialogRef.componentInstance as UserDeleteDialog;

    componentInstance.deleteConfirmed.subscribe((userData: UserDeleteData) => {
      this._deleteUser(userData);
    });

    componentInstance.cancelConfirmed.subscribe(() => {
      this.userDeleteDialog.closeDialog();
    });
  }

  private async _processUserForm(formData: UserFormData): Promise<void> {
    this._userFormDialogRef?.componentInstance?.setProcessing(true);

    try {
      if (formData.id) {
        const { error } = await firstValueFrom(this._usersDataStore.update(formData as Required<UserFormData>));

        if (error?.message) {
          throw new Error(error.message);
        }

        this._notificationManager.add({
          message: 'Member updated successfully',
          color: 'safe',
          canClose: true,
        });
      } else {
        await firstValueFrom(this._usersDataStore.create(formData));
        this._notificationManager.add({
          message: 'Member added successfully',
          color: 'safe',
          canClose: true,
        });
      }

      this.userFormDialog.closeDialog();
    } catch (error) {
      const errorType = formData.id ? 'update-user-error' : 'create-user-error';
      const errorMessage = formData.id ? 'Failed to update member' : 'Failed to add member';

      logManager.error({
        type: errorType,
        message: errorMessage,
        error,
      });

      this._notificationManager.add({
        message: errorMessage,
        color: 'danger',
        canClose: true,
      });
    } finally {
      this._userFormDialogRef?.componentInstance?.setProcessing(false);
    }
  }

  private async _deleteUser(userData: UserDeleteData): Promise<void> {
    this._userDeleteDialogRef?.componentInstance?.setProcessing(true);

    try {
      const response = await firstValueFrom(this._usersDataStore.delete(userData.id));

      const { error } = response;

      if (error?.message) {
        throw new Error(error?.message);
      }

      this._notificationManager.add({
        message: 'Member deleted successfully',
        color: 'safe',
        canClose: true,
      });

      this.userDeleteDialog.closeDialog();
    } catch (error: unknown) {
      logManager.error({
        type: 'delete-user-error',
        message: logManager.getErrorMessage(error as Error),
        error,
      });

      this._notificationManager.add({
        message: 'Failed to delete member',
        color: 'danger',
        canClose: true,
      });
    } finally {
      this._userDeleteDialogRef?.componentInstance?.setProcessing(false);
    }
  }
}
