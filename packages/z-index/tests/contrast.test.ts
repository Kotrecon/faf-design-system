// packages/z-index/tests/contrast.test.ts
// Integration test for @faf/contrast within @faf/z-index
// Интеграционный тест @faf/contrast внутри @faf/z-index

import { describe, it, expect } from "vitest";
import { FafContrast } from "../src/utils/contrast.js";

describe("Faf Z-Index: Contrast Integration", () => {
  it("should correctly calculate contrast using the real @faf/contrast module", () => {
    // Проверка реального расчёта контраста через интегрированный модуль.
    // Используем hex-цвета для 100% точности парсинга в упрощённой версии.
    // Check real contrast calculation via integrated module.
    // Using hex colors for 100% parsing accuracy in the simplified version.

    const fg = "#111827"; // Тёмный текст (Dark text)
    const bg = "#ffffff"; // Белый фон (White background)

    const info = FafContrast.getAccessibilityInfo(fg, bg);

    // Чёрный/тёмно-серый на белом должен уверенно проходить WCAG AA
    // Black/dark gray on white should confidently pass WCAG AA
    expect(info.aa.normal).toBe(true);
    expect(info.ratio).toBeGreaterThan(15); // Ожидаем высокий контраст (~15-21:1)
  });

  it("should fail contrast for poor color combinations", () => {
    // Проверка того, что плохие комбинации действительно отлавливаются интегрированным модулем.
    // Check that poor combinations are indeed caught by the integrated module.

    const poorFg = "#9ca3af"; // Светло-серый (Light gray)
    const poorBg = "#ffffff"; // Белый (White)

    const isAccessible = FafContrast.isAccessible(
      poorFg,
      poorBg,
      "AA",
      "normal",
    );

    expect(isAccessible).toBe(false);
  });

  it("should provide contrast color recommendation", () => {
    // Проверка вспомогательной функции выбора цвета текста.
    // Check helper function for text color selection.

    // На тёмном фоне должен рекомендоваться белый
    // On dark background, should recommend white
    const darkBg = "#111827";
    const whiteContrast = FafContrast.calculateContrast("#ffffff", darkBg);
    const blackContrast = FafContrast.calculateContrast("#000000", darkBg);

    expect(whiteContrast).toBeGreaterThan(blackContrast);
  });
});
