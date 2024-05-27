import { UserRole } from '$lib/data-models/user';
import { asyncUtils } from '$lib/utils/async';
import type { Page } from '@playwright/test';

export type PlaywrightMockEndpointOptions = {
  delay?: number;
};

const mockGetUsersEndpoint = async (page: Page, options: PlaywrightMockEndpointOptions = {}) => {
  await page.route('http://localhost:3001/api/users', async (route) => {
    await asyncUtils.sleep(options.delay || 0);
    const json = {
      data: [
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
      ],
    };
    await route.fulfill({ json });
  });
};

const mockGetUsersNoResultsEndpoint = async (page: Page, options: PlaywrightMockEndpointOptions = {}) => {
  await page.route('http://localhost:3001/api/users', async (route) => {
    await asyncUtils.sleep(options.delay || 0);
    const json = { data: [] };
    await route.fulfill({ json });
  });
};

export const playwrightMockerUtils = {
  mockGetUsersEndpoint,
  mockGetUsersNoResultsEndpoint,
};
