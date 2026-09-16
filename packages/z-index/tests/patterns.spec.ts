// packages/z-index/tests/patterns.spec.ts
// E2E tests for Z-Index patterns / E2E-тесты паттернов Z-Index

import { test, expect } from "@playwright/test";

test.describe("Faf Z-Index: Stacking Context E2E", () => {
  test("should apply correct z-index from CSS variables / должен применять правильные z-index из CSS-переменных", async ({
    page,
  }) => {
    await page.goto("/");

    // Переходим на вкладку Demo, где физически существует модалка
    // Navigate to Demo tab where the modal physically exists
    await page.click('button[data-category="demo"]');
    await page.waitForSelector(".demo-section");

    // Открываем модалку для проверки / Open the modal to check it
    await page.click('button:has-text("Открыть модалку")');
    const modal = page.locator("faf-modal");
    await expect(modal).toBeVisible();

    // Modal uses --faf-zindex-modal (1050) / Модалка использует --faf-zindex-modal (1050)
    const modalZIndex = await modal.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });

    // Modal should have z-index 1050 / Модалка должна иметь z-index 1050
    expect(modalZIndex).toBe("1050");

    // 🔥 FIX: Принудительно закрываем модалку через JS, чтобы не сломать параллельные тесты
    // 🔥 FIX: Force close modal via JS to avoid breaking parallel tests
    await page.evaluate(() => {
      const m = document.getElementById("demo-modal") as any;
      if (m) {
        m.removeAttribute("open");
        if (typeof m.close === "function") m.close();
      }
    });
  });

  test("toast should be above modal in stacking order / тост должен находиться выше модалки в stacking order", async ({
    page,
  }) => {
    // 1. Переходим на вкладку Live Demo / Navigate to Live Demo tab
    await page.goto("/");
    await page.click('button[data-category="demo"]');
    await page.waitForSelector(".demo-section");

    // 🔥 FIX: Принудительно закрываем модалку через JS, чтобы она гарантированно не перекрывала кнопку
    // 🔥 FIX: Force close modal via JS to guarantee it doesn't block the button
    await page.evaluate(() => {
      const m = document.getElementById("demo-modal") as any;
      if (m) {
        m.removeAttribute("open");
        if (typeof m.close === "function") m.close();
      }
    });

    // Ждем, пока модалка действительно исчезнет / Wait for modal to truly disappear
    await expect(page.locator("faf-modal")).not.toBeVisible({ timeout: 2000 });

    // 2. Показываем тост (--faf-zindex-toast: 1080) / Show the toast
    await page.click('button:has-text("Показать тост")');

    // Убеждаемся, что тост отрендерился / Ensure the toast is rendered
    const toastContainer = page.locator("faf-toast-container");
    await expect(toastContainer.locator("faf-toast")).toBeVisible();

    // 3. Проверяем z-index тоста / Check toast z-index
    const toastZIndex = await toastContainer.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });

    // 4. Открываем модалку и проверяем её z-index для сравнения / Open modal and check its z-index for comparison
    await page.click('button:has-text("Открыть модалку")');
    const modal = page.locator("faf-modal");
    await expect(modal).toBeVisible();

    const modalZIndex = await modal.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });

    // Тост (1080) должен быть выше модалки (1050) / Toast (1080) must be above modal (1050)
    expect(toastZIndex).toBe("1080");
    expect(modalZIndex).toBe("1050");
    expect(Number(toastZIndex)).toBeGreaterThan(Number(modalZIndex));
  });
});

test.describe("Faf Patterns: Accessibility & Focus E2E", () => {
  test("should trap focus inside modal (Focus Trap) / должен блокировать фокус внутри модалки (Focus Trap)", async ({
    page,
  }) => {
    // 1. Переходим на вкладку Live Demo / Navigate to Live Demo tab
    await page.goto("/");
    await page.click('button[data-category="demo"]');
    await page.waitForSelector(".demo-section");

    // Open the modal via the Live Demo button / Открываем модалку через кнопку в Live Demo
    const openModalBtn = page.getByRole("button", {
      name: /Открыть модалку|Open Modal/i,
    });
    await openModalBtn.click();

    // Wait for the modal to open / Ждём, когда модалка откроется
    const modal = page.locator("faf-modal");

    // 🔥 FIX: Сначала ждём видимости, чтобы избежать race condition с Web Components
    // 🔥 FIX: First wait for visibility to avoid race conditions with Web Components
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal).toHaveAttribute("open");

    // Focus should be on the first focusable element (close button or first slot)
    // Фокус должен быть на первом фокусируемом элементе (кнопка закрытия или первый слот)
    // In our implementation, focus is trapped by trapFocus
    // В нашей реализации фокус перехватывается trapFocus
    await page.waitForTimeout(150);

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
    // 1. Переходим на вкладку Live Demo / Navigate to Live Demo tab
    await page.goto("/");
    await page.click('button[data-category="demo"]');
    await page.waitForSelector(".demo-section");

    // 2. Находим кнопку-триггер и фокусируемся на ней / Find trigger button and focus on it
    const triggerButton = page.getByRole("button", {
      name: /Открыть модалку|Open Modal/i,
    });
    await triggerButton.focus();
    await triggerButton.click();

    // 3. Ждём открытия модалки / Wait for modal to open
    const modal = page.locator("faf-modal");
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal).toHaveAttribute("open");

    // 4. Закрываем по Escape / Close via Escape
    await page.keyboard.press("Escape");

    // 5. Ждём, пока модалка закроется / Wait for modal to close
    await expect(modal).not.toBeVisible();
    await expect(modal).not.toHaveAttribute("open");

    // 6. Проверяем, что фокус вернулся на кнопку-триггер / Verify focus returned to trigger button
    await expect(triggerButton).toBeFocused();
  });
});
