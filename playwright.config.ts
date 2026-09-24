import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,

  reporter: [ ['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }] ],
  

  use: {
    baseURL: 'https://www.demoblaze.com',
    headless: true,
    screenshot: 'on',
    video: 'on',
    trace: 'on',
  },

  projects: [
    {
      name: 'chromium', use: { ...devices['Desktop Chrome'],
      },
    },
  ],
});