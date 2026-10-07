import { defineConfig, devices } from '@playwright/test';

import fs from 'node:fs';

const nixChromium = [
  '/etc/profiles/per-user/lumi/bin/chromium',
  '/run/current-system/sw/bin/chromium',
  '/usr/bin/chromium',
].find((p) => fs.existsSync(p));

const executablePath =
  process.env.PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH || nixChromium || undefined;

export default defineConfig({
  testDir: './e2e',
  shard: { current: 1, total: 1 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(executablePath ? { launchOptions: { executablePath } } : {}),
      },
    },
  ],
  webServer: {
    command: 'npm run build && npx vite preview --host 127.0.0.1 --port 3000 --strictPort',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
