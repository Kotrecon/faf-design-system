/// <reference types="node" />
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",

  webServer: {
    command: "pnpm run dev:viewer",
    url: "http://localhost:3002",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  use: {
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
