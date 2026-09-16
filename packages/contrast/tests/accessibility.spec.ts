// packages/contrast/tests/accessibility.spec.ts
// E2E tests with axe-core / E2E-тесты с axe-core

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Faf-Contrast Accessibility Tests", () => {
  test("should have a title", async ({ page }) => {
    await page.goto("http://localhost:3002");
    await expect(page).toHaveTitle(/Faf-Contrast/);
  });

  test("should pass WCAG AA contrast requirements", async ({ page }) => {
    await page.goto("http://localhost:3002", {
      waitUntil: "networkidle",
    });

    await page.waitForFunction(() => {
      const button = document.querySelector("#check-btn");

      if (!button) {
        return false;
      }

      const style = getComputedStyle(button);

      return (
        style.backgroundColor !== "rgba(0, 0, 0, 0)" &&
        style.color !== "rgb(0, 0, 0)"
      );
    });

    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2aa", "wcag21aa"])
      .analyze();

    const contrastIssues = results.violations.filter(
      (v) => v.id === "color-contrast",
    );

    expect(contrastIssues).toHaveLength(0);
  });

  test("should have visible focus indicators", async ({ page }) => {
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
