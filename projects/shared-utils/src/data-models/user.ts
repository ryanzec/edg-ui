import { type User, assignableUserRoles } from '../../../shared-types/src/types/data-models/user';

const getUnassignableRoles = (user: Pick<User, 'roles'>): User['roles'] => {
  return user.roles.filter((role) => !assignableUserRoles.includes(role as User['roles'][number]));
};

export const userUtils = {
  getUnassignableRoles,
};
