// packages/z-index/vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Позволяет использовать describe, it, expect без импорта
    environment: "jsdom", // Эмуляция браузера для тестов DOM
    include: ["tests/**/*.test.ts"],
  },
});
