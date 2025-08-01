import { defineConfig, devices } from '@playwright/test';
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Playwright configuration
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    // TODO: Change this to the staging or production URL when available
    baseURL: 'http://localhost:3001/api/v1/',
    trace: 'on-first-retry',
  },

  // The following projects are for running tests in different browsers.
  // They are not needed for API testing, so they're commented out for now.
  // You can uncomment them when adding UI tests.
  /*
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  */

  // This starts a local dev server before running UI tests.
  // Not needed for API testing, so it's commented out for now.
  /*
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  */
});