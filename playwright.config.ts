import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,

    // ✅ Reporter config (unchanged)
    reporter: [['list'], ['html', { open: 'never' }]],

    use: {
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },

    // ✅ NEW: Define separate projects for UI and API
    projects: [
        {
            name: 'api',
            testMatch: /.*api\.spec\.ts$/, // Runs only *.api.spec.ts files
            use: {
                baseURL: process.env.API_URL || process.env.BASE_URL || 'http://localhost:3001/api/v1/',
            },
        },
        {
            name: 'ui',
            testMatch: /.*ui\.spec\.ts$/, // Runs only *.ui.spec.ts files
            use: {
                ...devices['Desktop Chrome'],
                baseURL: process.env.FRONTEND_URL || 'http://localhost:3000/', // frontend base
            },
        },
    ],

    // ❌ We are not using `webServer` yet, since frontend is started manually or deployed.
});
