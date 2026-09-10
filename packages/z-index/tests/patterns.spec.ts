/**
 * @module Faf Patterns E2E Tests
 * @description End-to-end tests for stacking context and accessibility (Focus Trap) using Playwright.
 *              E2E-тесты контекста наложения и доступности (Focus Trap) с использованием Playwright.
 */

import { test, expect } from "@playwright/test";
import { zIndexTokens } from "../src/tokens/zindex";

test.describe("Faf Z-Index: Stacking Context E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Run tests against the real Viewer / Запускаем тесты против реального Viewer
    await page.goto("/");
  });

  test("should apply correct z-index from CSS variables / должен применять правильные z-index из CSS-переменных", async ({
    page,
  }) => {
    // Navigate to the "Live Demo" tab / Переходим на вкладку "Live Demo"
    await page.click('[data-category="demo"]');

    // Open the modal / Открываем модалку
    await page.click('button:has-text("Открыть модалку")');

    // Verify that the modal is open / Проверяем, что модалка открылась
    const modal = page.locator("faf-modal");
    await expect(modal).toHaveAttribute("open");

    // Check modal z-index (via computed styles) / Проверяем z-index модалки (через вычисленные стили)
    const modalZIndex = await modal.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });

    expect(modalZIndex).toBe(String(zIndexTokens.modal));
  });

  test("toast should be above modal in stacking order / тост должен находиться выше модалки в stacking order", async ({
    page,
  }) => {
    await page.click('[data-category="demo"]');

    // 1. First, show the toast / 1. Сначала показываем тост
    await page.click('button:has-text("Показать тост")');

    // 🔥 FIX: Check z-index on the CONTAINER, as it holds the z-index: 1080
    // 🔥 ИСПРАВЛЕНИЕ: Проверяем z-index у КОНТЕЙНЕРА, так как именно он имеет z-index: 1080
    const toastContainer = page.locator("faf-toast-container");

    // Ensure the toast is rendered / Убеждаемся, что тост отрендерился
    await expect(toastContainer.locator("faf-toast")).toBeVisible();

    const toastZIndex = await toastContainer.evaluate((el) => {
      const zIndex = window.getComputedStyle(el).zIndex;
      // Guard against "auto", though container should have a number
      // Защита от "auto", хотя у контейнера он должен быть числом
      return parseInt(zIndex === "auto" ? "0" : zIndex, 10);
    });

    // 2. Open the modal on top / 2. Открываем модалку поверх
    await page.click('button:has-text("Открыть модалку")');
    await expect(page.locator("faf-modal")).toHaveAttribute("open");

    const modalZIndex = 1050; // zIndexTokens.modal

    // 3. Verify contract: toast (1080) is strictly above modal (1050)
    // 3. Проверяем контракт: тост (1080) строго выше модалки (1050)
    expect(toastZIndex).toBeGreaterThan(modalZIndex);
  });
});

test.describe("Faf Patterns: Accessibility & Focus E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.click('[data-category="demo"]');
  });

  test("should trap focus inside modal (Focus Trap) / должен блокировать фокус внутри модалки (Focus Trap)", async ({
    page,
  }) => {
    // Open the modal via the Live Demo button / Открываем модалку через кнопку в Live Demo
    await page.click('button:has-text("Открыть модалку")');

    // Wait for the modal to open / Ждём, когда модалка откроется
    const modal = page.locator("faf-modal");
    await expect(modal).toHaveAttribute("open");

    // Focus should be on the first focusable element (close button or first slot)
    // Фокус должен быть на первом фокусируемом элементе (кнопка закрытия или первый слот)
    // In our implementation, focus is trapped by trapFocus
    // В нашей реализации фокус перехватывается trapFocus
    await page.waitForTimeout(100);

    // Press Tab multiple times and verify focus doesn't leave the modal
    // Нажимаем Tab несколько раз и проверяем, что фокус не уходит за пределы модалки
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Focus must remain inside the modal (cyclically)
    // Фокус должен оставаться внутри модалки (циклически)
    // Verify that the active element is inside the modal
    // Проверяем, что активный элемент находится внутри модалки
    const isFocusedInsideModal = await modal.evaluate((el) => {
      return (
        el.shadowRoot?.contains(document.activeElement) ||
        el.contains(document.activeElement)
      );
    });

    expect(isFocusedInsideModal).toBe(true);
  });

  test("should return focus to trigger after closing via Escape / должен возвращать фокус на триггер после закрытия по Escape", async ({
    page,
  }) => {
    const triggerButton = page.locator('button:has-text("Открыть модалку")');
    await triggerButton.click();

    await expect(page.locator("faf-modal")).toHaveAttribute("open");

    // Close via Escape / Закрываем по Escape
    await page.keyboard.press("Escape");

    // Modal should close / Модалка должна закрыться
    await expect(page.locator("faf-modal")).not.toHaveAttribute("open");

    // Focus should return to the trigger button / Фокус должен вернуться на кнопку-триггер
    await expect(triggerButton).toBeFocused();
  });
});
