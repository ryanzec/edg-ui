import { type RequestEvent, json } from '@sveltejs/kit';

declare global {
  namespace App {
    interface Env {
      API_KEY: string;
    }
  }
}

// @todo(refactor) move to common location for reuse in server and client frontend code
enum UserRole {
  NONE = 'none',
  ADMIN = 'admin',
  USER = 'user',
}

// @todo(refactor) move to common location for reuse in server and client frontend code
type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

type UsersResponse = { data: User[] };

type UserResponse = { data: User };

interface ErrorResponse {
  error: string;
  details?: unknown;
}

export async function GET({ request }: RequestEvent) {
  console.log(request.method, request.url);

  await new Promise((resolve) => setTimeout(resolve, 100));

  var data: UsersResponse = {
    data: [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: UserRole.ADMIN,
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        role: UserRole.ADMIN,
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z',
      },
      {
        id: '3',
        firstName: 'Jake',
        lastName: 'Doe',
        email: 'jake.doe@example.com',
        role: UserRole.ADMIN,
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z',
      },
    ],
  };

  return json(data);
}

export async function POST({ request }: RequestEvent) {
  console.log(request.method, request.url);

  var data: UserResponse = {
    data: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: UserRole.ADMIN,
      createdAt: '2021-01-01T00:00:00.000Z',
      updatedAt: '2021-01-01T00:00:00.000Z',
    },
  };

  return json(data);
}

export async function PUT({ request }: RequestEvent) {
  console.log(request.method, request.url);

  const errorResponse: ErrorResponse = {
    error: 'failed',
    details: 'not implemented',
  };

  return new Response(JSON.stringify(errorResponse), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE({ request }: RequestEvent) {
  console.log(request.method, request.url);

  const errorResponse: ErrorResponse = {
    error: 'failed',
    details: 'not implemented',
  };

  return new Response(JSON.stringify(errorResponse), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PATCH({ request }: RequestEvent) {
  console.log(request.method, request.url);

  const errorResponse: ErrorResponse = {
    error: 'failed',
    details: 'not implemented',
  };

  return new Response(JSON.stringify(errorResponse), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}
