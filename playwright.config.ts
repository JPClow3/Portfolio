import { defineConfig, devices } from '@playwright/test';

const pwPort = process.env.PLAYWRIGHT_PORT ?? '4410';
const pwBaseUrl = `http://127.0.0.1:${pwPort}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: pwBaseUrl,
    locale: 'en-US',
    trace: 'on-first-retry',
  },
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
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: `node scripts/serve.mjs`,
    url: pwBaseUrl,
    env: {
      ...(process.env as Record<string, string>),
      PUBLIC_WEB3FORMS_ACCESS_KEY: 'test-web3forms-key',
      PUBLIC_TURNSTILE_SITEKEY: '1x00000000000000000000AA',
      PUBLIC_TURNSTILE_WORKER_URL: 'https://turnstile.example.test',
    },
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});


