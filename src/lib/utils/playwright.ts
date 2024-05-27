import type { Page } from '@playwright/test';

const goto = async (page: Page, url: string, opts?: { waitForStarted?: boolean }) => {
  await page.goto(url);

  if (opts?.waitForStarted !== false) {
    // it seems like we running tests in parrellel this can be slow so increasing call here
    await page.waitForSelector('body[data-hydrated="true"]', { timeout: 20000 });
  }
};

export const playwrightUtils = { goto };
