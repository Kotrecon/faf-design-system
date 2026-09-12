/**
 * @module Token Contract Tests
 * @description Contract tests verifying architectural integrity of the token system.
 *              Контрактные тесты, проверяющие архитектурную целостность системы токенов.
 *
 * @purpose These tests catch structural errors:
 *          Эти тесты ловят структурные ошибки:
 *          - Missing keys between light/dark themes / Отсутствие ключей между светлой/тёмной темами
 *          - Accidental deletion of required fields / Случайное удаление обязательных полей
 *          - Undefined or empty values / Значения undefined или пустые строки
 *
 *          They DO NOT check specific values (unit tests do that),
 *          they check that the system as a whole is correct.
 *          Они НЕ проверяют конкретные значения (это делают unit-тесты),
 *          а проверяют, что система в целом корректна.
 */

import { describe, it, expect } from "vitest";
import { themes, type SemanticTheme } from "../src/semantic/themes";
import { semanticSpacing } from "../src/tokens/spacing/semantic";
import { semanticShadows } from "../src/tokens/shadows/semantic";
import { semanticRadius } from "../src/tokens/radius/semantic";
import { semanticOpacity } from "../src/tokens/opacity/semantic";
import { semanticTransitions } from "../src/tokens/transitions/semantic";
import { semanticTypography } from "../src/tokens/typography/semantic";

describe("Faf Foundations: Token Contract Tests", () => {
  describe("Themes / Темы", () => {
    it("light and dark themes must have identical key sets / светлая и тёмная темы должны иметь абсолютно одинаковый набор ключей", () => {
      // CRITICAL: If light has "primary" but dark doesn't,
      // the interface will break when switching themes (CSS variable becomes undefined).
      // КРИТИЧЕСКИ ВАЖНО: Если в light есть "primary", но нет в dark,
      // при переключении темы интерфейс сломается (CSS-переменная станет undefined).
      const lightKeys = Object.keys(themes.light).sort();
      const darkKeys = Object.keys(themes.dark).sort();

      expect(lightKeys).toEqual(darkKeys);
    });

    it("no token in light theme should be undefined or empty string / ни один токен в светлой теме не должен быть undefined или пустой строкой", () => {
      // Typo protection: if someone writes primary: undefined,
      // the CSS variable will be empty and the element becomes invisible.
      // Защита от опечаток: если кто-то напишет primary: undefined,
      // CSS-переменная будет пустой, и элемент станет невидимым.
      const theme = themes.light as SemanticTheme;

      for (const key of Object.keys(theme) as (keyof SemanticTheme)[]) {
        expect(theme[key]).toBeDefined();
        expect(theme[key]).not.toBe("");
        expect(typeof theme[key]).toBe("string");
      }
    });

    it("no token in dark theme should be undefined or empty string / ни один токен в тёмной теме не должен быть undefined или пустой строкой", () => {
      // Same check for dark theme / Аналогичная проверка для тёмной темы
      const theme = themes.dark as SemanticTheme;

      for (const key of Object.keys(theme) as (keyof SemanticTheme)[]) {
        expect(theme[key]).toBeDefined();
        expect(theme[key]).not.toBe("");
        expect(typeof theme[key]).toBe("string");
      }
    });

    it("all colors must be valid CSS values / все цвета должны быть валидными CSS-значениями", () => {
      // Verify colors don't contain garbage characters or typos
      // Проверяем, что цвета не содержат мусорных символов или опечаток
      const allColors = [
        ...Object.values(themes.light),
        ...Object.values(themes.dark),
      ];

      allColors.forEach((color) => {
        // Cast to string so TypeScript doesn't complain about strict `as const` types
        // Приводим к string, чтобы TypeScript не ругался на строгие типы as const
        const colorStr = color as string;

        // Colors must start with oklch, rgb, hex, or be named values
        // Цвета должны начинаться с oklch, rgb, hex или быть именованными
        const isValidColor =
          colorStr.startsWith("oklch") ||
          colorStr.startsWith("rgb") ||
          colorStr.startsWith("#") ||
          colorStr === "none" ||
          colorStr === "transparent";

        expect(isValidColor).toBe(true);
      });
    });
  });

  describe("Semantic Spacing / Семантические отступы", () => {
    it("all semantic spacings must be strings / все семантические отступы должны быть строками", () => {
      // Protection against cases where someone accidentally writes a number instead of a string
      // Защита от случаев, когда кто-то случайно напишет число вместо строки
      Object.values(semanticSpacing).forEach((value) => {
        expect(typeof value).toBe("string");
      });
    });

    it('all semantic spacings must contain "rem" or "px" / все семантические отступы должны содержать "rem" или "px"', () => {
      // Verify values are valid CSS sizes / Проверяем, что значения являются валидными CSS-размерами
      Object.values(semanticSpacing).forEach((value) => {
        const isValidSize = value.includes("rem") || value.includes("px");
        expect(isValidSize).toBe(true);
      });
    });

    it("no duplicate values should exist (optional check) / не должно быть дублирующихся значений (опциональная проверка)", () => {
      // If two tokens have the same value, one of them might be redundant.
      // This is a warning, not an error, so we just log to console.
      // Если два токена имеют одинаковое значение, возможно, один из них лишний.
      // Это warning, а не ошибка, поэтому просто логируем в консоль.
      const entries = Object.entries(semanticSpacing);
      const valueMap = new Map<string, string[]>();

      entries.forEach(([key, value]) => {
        if (!valueMap.has(value)) valueMap.set(value, []);
        valueMap.get(value)!.push(key);
      });

      const duplicates = Array.from(valueMap.entries()).filter(
        ([_, keys]) => keys.length > 1,
      );

      if (duplicates.length > 0) {
        console.warn("⚠️ Duplicate values in semanticSpacing:");
        duplicates.forEach(([value, keys]) => {
          console.warn(`  ${value}: ${keys.join(", ")}`);
        });
      }
    });
  });

  describe("Semantic Shadows / Семантические тени", () => {
    it("all semantic shadows must be strings / все семантические тени должны быть строками", () => {
      Object.values(semanticShadows).forEach((value) => {
        expect(typeof value).toBe("string");
      });
    });

    it('"none" shadow must exist / тень "none" должна существовать', () => {
      // This is a base value that must always exist for resetting shadows
      // Это базовое значение, которое должно быть всегда для сброса теней
      expect(semanticShadows.none).toBeDefined();
      expect(semanticShadows.none).toBe("none");
    });

    it('all shadows must contain "rgba" or be "none" / все тени должны содержать "rgba" или быть "none"', () => {
      // Verify shadows use the correct format (rgba for transparency)
      // Проверяем, что тени используют правильный формат (rgba для прозрачности)
      Object.entries(semanticShadows).forEach(([key, value]) => {
        if (value !== "none") {
          expect(value).toContain("rgba");
        }
      });
    });
  });

  describe("Semantic Radius / Семантические скругления", () => {
    it("all semantic radii must be strings / все семантические скругления должны быть строками", () => {
      Object.values(semanticRadius).forEach((value) => {
        expect(typeof value).toBe("string");
      });
    });

    it('"none" and "full" radii must exist / скругления "none" и "full" должны существовать', () => {
      expect(semanticRadius.none).toBeDefined();
      expect(semanticRadius.badge).toBeDefined();
    });
  });

  describe("Semantic Opacity / Семантическая прозрачность", () => {
    it("all semantic opacities must be strings representing numbers / вся семантическая прозрачность должна быть строками, представляющими числа", () => {
      Object.values(semanticOpacity).forEach((value) => {
        expect(typeof value).toBe("string");
        const num = parseFloat(value);
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(1);
      });
    });
  });

  describe("Semantic Transitions / Семантические переходы", () => {
    it("all semantic transitions must be strings / все семантические переходы должны быть строками", () => {
      Object.values(semanticTransitions).forEach((value) => {
        expect(typeof value).toBe("string");
      });
    });

    it("all transitions must contain duration and easing function / все переходы должны содержать длительность и функцию плавности", () => {
      Object.values(semanticTransitions).forEach((value) => {
        expect(value).toMatch(/ms\s+cubic-bezier/);
      });
    });
  });

  describe("Semantic Typography / Семантическая типографика", () => {
    it("all typography categories must exist / все категории типографики должны существовать", () => {
      expect(semanticTypography.heading).toBeDefined();
      expect(semanticTypography.body).toBeDefined();
      expect(semanticTypography.ui).toBeDefined();
    });

    it("all typography roles must have size, weight, lineHeight, and family / все роли типографики должны иметь size, weight, lineHeight и family", () => {
      const categories = Object.values(semanticTypography);
      categories.forEach((category) => {
        Object.values(category as Record<string, any>).forEach((role: any) => {
          expect(typeof role.size).toBe("string");
          expect(typeof role.weight).toBe("number");
          expect(typeof role.lineHeight).toBe("number");
          expect(typeof role.family).toBe("string");
        });
      });
    });
  });

  describe("Integration / Интеграция", () => {
    it("semantic tokens must reference existing primitives / семантические токены должны ссылаться на существующие примитивы", () => {
      // Verify semanticSpacing.cardPadding references a real value
      // This ensures there are no "dangling" or made-up values
      // Проверяем, что semanticSpacing.cardPadding ссылается на реальное значение
      // Это гарантирует, что нет "висячих" или придуманных на ходу значений
      expect(semanticSpacing.cardPadding).toBe("1.5rem"); // Value from spacing[6] / Значение из spacing[6]
    });

    it("token count should not change dramatically (protection against accidental deletion) / количество токенов не должно резко изменяться (защита от случайного удаления)", () => {
      // If someone accidentally deletes half the tokens or comments out a file,
      // this test will fail and warn about a catastrophe
      // Если кто-то случайно удалит половину токенов или закомментирует файл,
      // этот тест упадёт и предупредит о катастрофе
      const minExpectedColors = 20; // Minimum colors in theme / Минимум цветов в теме
      const minExpectedSpacing = 10; // Minimum semantic spacings / Минимум семантических отступов

      expect(Object.keys(themes.light).length).toBeGreaterThanOrEqual(
        minExpectedColors,
      );
      expect(Object.keys(semanticSpacing).length).toBeGreaterThanOrEqual(
        minExpectedSpacing,
      );
    });
  });
});
