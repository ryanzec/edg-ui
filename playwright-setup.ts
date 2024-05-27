import { asyncUtils } from './src/lib/utils/async';
import { chromium, type FullConfig } from '@playwright/test';

const globalSetup = async (config: FullConfig) => {
  const { baseURL } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${baseURL}/sandbox/test`);

  await asyncUtils.sleep(5000);

  await browser.close();
};

export default globalSetup;
