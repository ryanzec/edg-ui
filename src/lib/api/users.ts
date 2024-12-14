import type { ResponseStructure } from '$lib/api/utils';
import { UserRole, type CreateUserRequest, type UpdateUserRequest, type User } from '$lib/data-models/user';
import eventEmitter, { GlobalEvent } from '$lib/utils/event-emitter';
import { HttpMethod, httpUtils } from '$lib/utils/http';

const users: User[] = [
  {
    id: '1',
    firstName: 'Test',
    lastName: 'Admin1',
    email: 'admin1@localhost',
    role: UserRole.ADMIN,
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2021-01-01T00:00:00.000Z',
    deletedAt: '2021-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    firstName: 'Test',
    lastName: 'User2',
    email: 'user2@localhost',
    role: UserRole.USER,
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2021-01-01T00:00:00.000Z',
    deletedAt: '2021-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    firstName: 'Test',
    lastName: 'User3',
    email: 'user3@localhost',
    role: UserRole.USER,
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2021-01-01T00:00:00.000Z',
    deletedAt: '2021-01-01T00:00:00.000Z',
  },
];

const getList = async (): Promise<ResponseStructure<User[]>> => {
  const response = await httpUtils.http<ResponseStructure<User[]>>('http://localhost:3001/api/users', {
    method: HttpMethod.GET,
  });

  return response;
};

const create = async (data: CreateUserRequest): Promise<ResponseStructure<User>> => {
  console.log('creating:', data);

  eventEmitter.emit(GlobalEvent.USER_SAVED, { user: users[0] });

  return { data: users[0] };
};

const update = async (data: UpdateUserRequest): Promise<ResponseStructure<User>> => {
  console.log('updating:', data);

  eventEmitter.emit(GlobalEvent.USER_SAVED, { user: users[0] });

  return { data: users[0] };
};

export const usersApi = {
  getList,
  create,
  update,
};
