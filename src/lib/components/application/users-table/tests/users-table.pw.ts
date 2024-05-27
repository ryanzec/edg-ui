import { test, expect } from '@playwright/test';
import { playwrightMockerUtils } from '$lib/utils/playwright-mocker';
import { playwrightUtils } from '$lib/utils/playwright';

const locators = {
  usersTable: '[data-id="users-table"]',
  users: '[data-id="users-table"] [data-id="user"]',
  refreshTrigger: '[data-id="refresh-trigger"]',
  showFormTrigger: '[data-id="show-form-trigger"]',
  refetchingIndicator: '[data-id="refetching-indicator"]',
  loadingIndicator: '[data-id="loading-indicator"]',
};

test.describe('table', () => {
  test.beforeEach(async ({ page }) => {
    await playwrightMockerUtils.mockGetUsersEndpoint(page, { delay: 1000 });
  });

  test('displays loading indicator', async ({ page }) => {
    await playwrightUtils.goto(page, '/sandbox?component=Users+Table.Simple');

    await expect(page.locator(locators.loadingIndicator)).toHaveCount(1);
  });

  test('displays users', async ({ page }) => {
    // speed up the test since we don't care about loading indicators here
    await playwrightMockerUtils.mockGetUsersEndpoint(page);

    await playwrightUtils.goto(page, '/sandbox?component=Users+Table.Simple');

    await expect(page.locator(locators.usersTable)).toHaveCount(1);
    await expect(page.locator(locators.users)).toHaveCount(3);
  });

  test('displays refetching indicator', async ({ page }) => {
    await playwrightUtils.goto(page, '/sandbox?component=Users+Table.Simple');

    await expect(page.locator(locators.refetchingIndicator)).toHaveCount(0);

    await page.locator(locators.refreshTrigger).click();

    await expect(page.locator(locators.refetchingIndicator)).toHaveCount(1);
  });
});
