import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    env: {
      AUTH_SECRET:
        process.env.AUTH_SECRET ??
        'playwright-test-secret-at-least-32-characters',
      AUTH_URL: process.env.AUTH_URL ?? 'http://localhost:3000',
      MONGODB_URI:
        process.env.MONGODB_URI ??
        'mongodb://127.0.0.1:27017/house-of-edtech-test',
    },
  },
});
