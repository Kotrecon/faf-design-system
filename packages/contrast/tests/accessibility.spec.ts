// packages/contrast/tests/accessibility.spec.ts
// E2E tests with axe-core / E2E-тесты с axe-core

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Faf-Contrast Accessibility Tests", () => {
  // ⚠️ TODO: These tests require the Viewer to be running
  // ⚠️ TODO: Эти тесты требуют запущенного Viewer
  // Will be fully implemented in Step 4 after Viewer creation
  // Будут полностью реализованы в Шаге 4 после создания Viewer

  test("should have a title", async ({ page }) => {
    // Basic test to check structure / Базовый тест для проверки структуры
    await page.goto("http://localhost:3002");
    await expect(page).toHaveTitle(/Faf Contrast/);
  });

  test("should pass WCAG AA contrast requirements", async ({ page }) => {
    // Should pass WCAG AA contrast requirements / Должен проходить требования WCAG AA по контрастности
    await page.goto("http://localhost:3002");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2aa", "wcag21aa"])
      .analyze();

    const contrastIssues = results.violations.filter(
      (v) => v.id === "color-contrast",
    );

    expect(contrastIssues).toHaveLength(0);
  });

  test("should have visible focus indicators", async ({ page }) => {
    // Should have visible focus indicators / Должен иметь видимые индикаторы фокуса
    await page.goto("http://localhost:3002");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2aa", "wcag21aa"])
      .analyze();

    const focusIssues = results.violations.filter(
      (v) => v.id === "focus-visible" || v.id === "focus-order",
    );

    expect(focusIssues).toHaveLength(0);
  });

  test("should have valid ARIA attributes", async ({ page }) => {
    // Should have valid ARIA attributes / Должен иметь валидные ARIA атрибуты
    await page.goto("http://localhost:3002");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2aa", "wcag21aa"])
      .analyze();

    const ariaIssues = results.violations.filter((v) =>
      v.id.startsWith("aria-"),
    );

    expect(ariaIssues).toHaveLength(0);
  });
});
