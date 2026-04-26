import { z } from 'zod';
import { ResponseStructure } from '../utils';

export type UserRoleName = 'owner' | 'admin' | 'user';

export const assignableUserRoles: UserRoleName[] = ['owner', 'admin', 'user'];

export type UserPermission = 'read' | 'write' | 'delete' | 'api';

export const assignableUserPermissions: UserPermission[] = ['read', 'write', 'delete', 'api'];

export type FilterMatchType = 'all' | 'any';

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  roles: z.array(z.enum(['owner', 'admin', 'user'])),
  permissions: z.array(z.enum(['read', 'write', 'delete', 'api'])),
  requirePasswordChange: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = userSchema
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    roles: true,
    permissions: true,
  })
  .extend({
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  });

export type CreateUser = z.infer<typeof createUserSchema>;

export const updateUserSchema = userSchema
  .pick({
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    roles: true,
    permissions: true,
  })
  .partial({
    firstName: true,
    lastName: true,
    email: true,
    roles: true,
    permissions: true,
  });

export type UpdateUser = z.infer<typeof updateUserSchema>;

export type GetUsersRequest = {
  search?: string;
  permission_filter_type?: FilterMatchType;
  permissions?: UserPermission[];
  role_filter_type?: FilterMatchType;
  roles?: UserRoleName[];
  offset?: number;
  limit?: number;
  orderBy?: 'firstName' | 'createdAt' | null;
  orderDirection?: 'asc' | 'desc' | null;
};
export type GetUsersResponse = ResponseStructure<User[]>;

export type GetUserByIdRequest = {
  id: string;
};
export type GetUserResponse = ResponseStructure<User>;

export type CreateUserResponse = ResponseStructure<User>;

export type UpdateUserResponse = ResponseStructure<User>;

export type DeleteUserRequest = {
  id: string;
};
export type DeleteUserResponse = ResponseStructure<User>;
