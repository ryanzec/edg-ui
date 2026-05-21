import { Component, ChangeDetectionStrategy, output, input, computed, afterNextRender } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  userSchema,
  type User,
  assignableUserRoles,
  assignableUserPermissions,
  type UserRoleName,
  type UserPermission,
} from '@organization/shared-utils';
import { Input } from '../../core/input/input';
import { Button } from '../../core/button/button';
import { Checkbox } from '../../core/checkbox/checkbox';
import { Label } from '../../core/label/label';
import { validationUtils } from '../../utils/validation';
import { angularUtils, userUtils } from '@organization/shared-utils';
import { FormFields } from '../../core/form-fields/form-fields';
import { FormField } from '../../core/form-fields/form-field';
import { FormDisabledDirective } from '../../core/form-disabled-directive/form-disabled-directive';

export type UserFormData = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRoleName[];
  permissions: UserPermission[];
};

/** default value for the existingUser input */
export const USER_FORM_EXISTING_USER_DEFAULT: User | undefined = undefined;

/** default value for the isProcessing input */
export const USER_FORM_IS_PROCESSING_DEFAULT = false;

@Component({
  selector: 'org-user-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Input, ReactiveFormsModule, Button, Checkbox, Label, FormFields, FormField, FormDisabledDirective],
  templateUrl: './user-form.html',
  host: {
    class: 'block',
  },
})
export class UserForm {
  // inputs
  public readonly existingUser = input<User | undefined, User | null | undefined>(USER_FORM_EXISTING_USER_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });
  public readonly isProcessing = input<boolean>(USER_FORM_IS_PROCESSING_DEFAULT);

  // outputs
  public readonly formSubmitted = output<UserFormData>();

  public userForm!: FormGroup;
  public readonly assignableRoles = assignableUserRoles;
  public readonly assignablePermissions = assignableUserPermissions;
  public readonly submitButtonText = computed<string>(() => {
    return this.existingUser() ? 'Update User' : 'Create User';
  });

  private _formInitialized = false;

  constructor() {
    const rolesGroup = new FormGroup({});

    for (const roleName of this.assignableRoles) {
      rolesGroup.addControl(
        roleName,
        new FormControl(roleName === 'user' ? true : false, { nonNullable: true, updateOn: 'change' })
      );
    }

    const permissionsGroup = new FormGroup({});

    for (const permissionName of this.assignablePermissions) {
      permissionsGroup.addControl(permissionName, new FormControl(false, { nonNullable: true, updateOn: 'change' }));
    }

    this.userForm = new FormGroup({
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(userSchema.shape.firstName)],
        updateOn: 'change',
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(userSchema.shape.lastName)],
        updateOn: 'change',
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(userSchema.shape.email)],
        updateOn: 'change',
      }),
      roles: rolesGroup,
      permissions: permissionsGroup,
    });

    afterNextRender(() => {
      const user = this.existingUser();

      if (!user || this._formInitialized) {
        return;
      }

      this._formInitialized = true;

      const rolesPatch: Record<string, boolean> = {};

      for (const roleName of this.assignableRoles) {
        rolesPatch[roleName] = user.roles.includes(roleName);
      }

      const permissionsPatch: Record<string, boolean> = {};

      for (const permissionName of this.assignablePermissions) {
        permissionsPatch[permissionName] = user.permissions.includes(permissionName);
      }

      this.userForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: rolesPatch,
        permissions: permissionsPatch,
      });
    });
  }

  public submit(): void {
    if (this.isProcessing()) {
      return;
    }

    if (!this._isFormValid()) {
      this.userForm.markAllAsTouched();

      return;
    }

    const formValue = this.userForm.getRawValue();
    const selectedRoles: UserRoleName[] = [];

    for (const roleName of this.assignableRoles) {
      if (formValue.roles[roleName]) {
        selectedRoles.push(roleName);
      }
    }

    const selectedPermissions: UserPermission[] = [];

    for (const permissionName of this.assignablePermissions) {
      if (formValue.permissions[permissionName]) {
        selectedPermissions.push(permissionName);
      }
    }

    const existingUserValue = this.existingUser();

    const submissionData: UserFormData = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      roles: [],
      permissions: selectedPermissions,
    };

    if (existingUserValue) {
      const existingUnassignableRoles = userUtils.getUnassignableRoles(existingUserValue);

      selectedRoles.push(...existingUnassignableRoles);
      submissionData.id = existingUserValue.id;
    }

    submissionData.roles = selectedRoles;

    this.formSubmitted.emit(submissionData);
  }

  public getFieldError(fieldName: 'firstName' | 'lastName' | 'email'): string | null {
    const field = this.userForm.get(fieldName);

    if (!field?.errors || !field.touched) {
      return null;
    }

    return validationUtils.getFormErrorMessage(field.errors, this.getFieldLabel(fieldName));
  }

  public getRoleError(): string | null {
    const rolesGroup = this.userForm.get('roles');

    if (!rolesGroup?.touched) {
      return null;
    }

    if (!this._hasAtleastOneRole()) {
      return 'At least one role must be selected';
    }

    return null;
  }

  public getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      roles: 'Roles',
      permissions: 'Permissions',
    };

    return labels[fieldName] || fieldName;
  }

  public getRoleLabel(roleName: UserRoleName): string {
    const labels: Record<UserRoleName, string> = {
      owner: 'Owner',
      user: 'User',
      admin: 'Admin',
    };

    return labels[roleName];
  }

  public getPermissionLabel(permissionName: UserPermission): string {
    const labels: Record<UserPermission, string> = {
      read: 'Read',
      write: 'Write',
      delete: 'Delete',
      api: 'Api',
    };

    return labels[permissionName];
  }

  private _hasAtleastOneRole(): boolean {
    const rolesGroup = this.userForm.get('roles');

    return rolesGroup ? Object.values(rolesGroup.value).some((value) => value === true) : false;
  }

  private _isFormValid(): boolean {
    const isFormValid = this.userForm.valid;

    return isFormValid && this._hasAtleastOneRole();
  }
}
