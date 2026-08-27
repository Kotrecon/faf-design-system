// packages/z-index/tests/patterns.spec.ts

import { test, expect } from "@playwright/test";
import { zIndexTokens } from "../src/tokens/zindex";

test.describe("Faf Z-Index: Stacking Context E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Запускаем тесты против реального Viewer
    await page.goto("http://localhost:3001");
  });

  test("должен применять правильные z-index из CSS-переменных", async ({
    page,
  }) => {
    // Переходим на вкладку "Live Demo"
    await page.click('[data-category="demo"]');

    // Открываем модалку
    await page.click('button:has-text("Открыть модалку")');

    // Проверяем, что модалка открылась
    const modal = page.locator("faf-modal");
    await expect(modal).toHaveAttribute("open");

    // Проверяем z-index модалки (через вычисленные стили)
    const modalZIndex = await modal.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });

    expect(modalZIndex).toBe(String(zIndexTokens.modal));
  });

  test("тост должен находиться выше модалки в stacking order", async ({
    page,
  }) => {
    await page.click('[data-category="demo"]');

    // 1. Сначала показываем тост
    await page.click('button:has-text("Показать тост")');

    // 🔥 ИСПРАВЛЕНИЕ: Проверяем z-index у КОНТЕЙНЕРА, так как именно он имеет z-index: 1080
    const toastContainer = page.locator("faf-toast-container");
    await expect(toastContainer.locator("faf-toast")).toBeVisible(); // Убеждаемся, что тост отрендерился

    const toastZIndex = await toastContainer.evaluate((el) => {
      const zIndex = window.getComputedStyle(el).zIndex;
      // Защита от "auto", хотя у контейнера он должен быть числом
      return parseInt(zIndex === "auto" ? "0" : zIndex, 10);
    });

    // 2. Открываем модалку поверх
    await page.click('button:has-text("Открыть модалку")');
    await expect(page.locator("faf-modal")).toHaveAttribute("open");

    const modalZIndex = 1050; // zIndexTokens.modal

    // 3. Проверяем контракт: тост (1080) строго выше модалки (1050)
    expect(toastZIndex).toBeGreaterThan(modalZIndex);
  });
});

test.describe("Faf Patterns: Accessibility & Focus E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3001");
    await page.click('[data-category="demo"]');
  });

  test("должен блокировать фокус внутри модалки (Focus Trap)", async ({
    page,
  }) => {
    // Открываем модалку через кнопку в Live Demo
    await page.click('button:has-text("Открыть модалку")');

    // Ждём, когда модалка откроется
    const modal = page.locator("faf-modal");
    await expect(modal).toHaveAttribute("open");

    // Фокус должен быть на первом фокусируемом элементе (кнопка закрытия или первый слот)
    // В нашей реализации фокус перехватывается trapFocus
    await page.waitForTimeout(100);

    // Нажимаем Tab несколько раз и проверяем, что фокус не уходит за пределы модалки
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Фокус должен оставаться внутри модалки (циклически)
    // Проверяем, что активный элемент находится внутри модалки
    const isFocusedInsideModal = await modal.evaluate((el) => {
      return (
        el.shadowRoot?.contains(document.activeElement) ||
        el.contains(document.activeElement)
      );
    });

    expect(isFocusedInsideModal).toBe(true);
  });

  test("должен возвращать фокус на триггер после закрытия по Escape", async ({
    page,
  }) => {
    const triggerButton = page.locator('button:has-text("Открыть модалку")');
    await triggerButton.click();

    await expect(page.locator("faf-modal")).toHaveAttribute("open");

    // Закрываем по Escape
    await page.keyboard.press("Escape");

    // Модалка должна закрыться
    await expect(page.locator("faf-modal")).not.toHaveAttribute("open");

    // Фокус должен вернуться на кнопку-триггер
    await expect(triggerButton).toBeFocused();
  });
});
