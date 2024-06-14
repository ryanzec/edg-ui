import type { ResponseStructure } from '$lib/api/utils';
import type { BaseComboboxOptionValue } from '$lib/components/core/combobox/utils';
import * as zod from 'zod';

export enum UserRole {
  NONE = 'none',
  ADMIN = 'admin',
  USER = 'user',
}

export type UserRoleComboboxOption = {
  display: string;
  value: UserRole;
};

export const validUserRoleValues = Object.values(UserRole).filter((value) => value !== UserRole.NONE);

export const userRoleZodSchema = zod.object({
  value: zod.nativeEnum(UserRole),
  display: zod.string(),
});

export const userRoleSelectSchema = zod.object(userRoleZodSchema.shape).refine(
  (data) => {
    return validUserRoleValues.includes(data.value as UserRole);
  },
  { message: 'Required' },
);

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type UserComboboxOption = BaseComboboxOptionValue & {
  meta: User;
};

export type GetUsersResponse = ResponseStructure<User[]>;

export type CreateUserRequest = Pick<User, 'firstName' | 'lastName' | 'email' | 'role'>;

export type UpdateUserRequest = Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'role'>;

const getRolesAsComboboxOptions = () => {
  // using a record to make sure this keeps in sync if the enum changes
  const options: Record<UserRole, UserRoleComboboxOption> = {
    [UserRole.NONE]: {
      display: 'NONE',
      value: UserRole.NONE,
    },
    [UserRole.ADMIN]: {
      display: 'Admin',
      value: UserRole.ADMIN,
    },
    [UserRole.USER]: {
      display: 'User',
      value: UserRole.USER,
    },
  };

  return Object.values(options).filter((option) => option.value !== UserRole.NONE);
};

export const userDataUtils = { getRolesAsComboboxOptions };
