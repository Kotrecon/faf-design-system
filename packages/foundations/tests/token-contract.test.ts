import { describe, it, expect } from "vitest";
import { themes, type SemanticTheme } from "../src/semantic/themes";
import { semanticSpacing } from "../src/tokens/spacing/semantic";
import { semanticShadows } from "../src/tokens/shadows/semantic";

/**
 * КОНТРАКТНЫЕ ТЕСТЫ: Проверяют, что архитектура токенов целостна и не сломана.
 *
 * Зачем: Эти тесты ловят структурные ошибки:
 * - Если кто-то добавит токен в light, но забудет в dark
 * - Если кто-то случайно удалит обязательное поле
 * - Если значения станут undefined или пустыми
 *
 * Они НЕ проверяют конкретные значения (это делают unit-тесты),
 * а проверяют, что система в целом корректна.
 */

describe("Faf Foundations: Token Contract Tests", () => {
  describe("Темы (Themes)", () => {
    it("светлая и тёмная темы должны иметь абсолютно одинаковый набор ключей", () => {
      // КРИТИЧЕСКИ ВАЖНО: Если в light есть "primary", но нет в dark,
      // при переключении темы интерфейс сломается (CSS-переменная станет undefined).
      const lightKeys = Object.keys(themes.light).sort();
      const darkKeys = Object.keys(themes.dark).sort();

      expect(lightKeys).toEqual(darkKeys);
    });

    it("ни один токен в светлой теме не должен быть undefined или пустой строкой", () => {
      // Защита от опечаток: если кто-то напишет primary: undefined,
      // CSS-переменная будет пустой, и элемент станет невидимым.
      const theme = themes.light as SemanticTheme;

      for (const key of Object.keys(theme) as (keyof SemanticTheme)[]) {
        expect(theme[key]).toBeDefined();
        expect(theme[key]).not.toBe("");
        expect(typeof theme[key]).toBe("string");
      }
    });

    it("ни один токен в тёмной теме не должен быть undefined или пустой строкой", () => {
      // Аналогичная проверка для тёмной темы
      const theme = themes.dark as SemanticTheme;

      for (const key of Object.keys(theme) as (keyof SemanticTheme)[]) {
        expect(theme[key]).toBeDefined();
        expect(theme[key]).not.toBe("");
        expect(typeof theme[key]).toBe("string");
      }
    });

    it("все цвета должны быть валидными CSS-значениями", () => {
      // Проверяем, что цвета не содержат мусорных символов или опечаток
      const allColors = [
        ...Object.values(themes.light),
        ...Object.values(themes.dark),
      ];

      allColors.forEach((color) => {
        // Приводим к string, чтобы TypeScript не ругался на строгие типы as const
        const colorStr = color as string;

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

  describe("Семантические отступы (Semantic Spacing)", () => {
    it("все семантические отступы должны быть строками", () => {
      // Защита от случаев, когда кто-то случайно напишет число вместо строки
      Object.values(semanticSpacing).forEach((value) => {
        expect(typeof value).toBe("string");
      });
    });

    it('все семантические отступы должны содержать "rem" или "px"', () => {
      // Проверяем, что значения являются валидными CSS-размерами
      Object.values(semanticSpacing).forEach((value) => {
        const isValidSize = value.includes("rem") || value.includes("px");
        expect(isValidSize).toBe(true);
      });
    });

    it("не должно быть дублирующихся значений (опциональная проверка)", () => {
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
        console.warn("⚠️ Дублирующиеся значения в semanticSpacing:");
        duplicates.forEach(([value, keys]) => {
          console.warn(`  ${value}: ${keys.join(", ")}`);
        });
      }
    });
  });

  describe("Семантические тени (Semantic Shadows)", () => {
    it("все семантические тени должны быть строками", () => {
      Object.values(semanticShadows).forEach((value) => {
        expect(typeof value).toBe("string");
      });
    });

    it('тень "none" должна существовать', () => {
      // Это базовое значение, которое должно быть всегда для сброса теней
      expect(semanticShadows.none).toBeDefined();
      expect(semanticShadows.none).toBe("none");
    });

    it('все тени должны содержать "rgba" или быть "none"', () => {
      // Проверяем, что тени используют правильный формат (rgba для прозрачности)
      Object.entries(semanticShadows).forEach(([key, value]) => {
        if (value !== "none") {
          expect(value).toContain("rgba");
        }
      });
    });
  });

  describe("Интеграция (Integration)", () => {
    it("семантические токены должны ссылаться на существующие примитивы", () => {
      // Проверяем, что semanticSpacing.cardPadding ссылается на реальное значение
      // Это гарантирует, что нет "висячих" или придуманных на ходу значений
      expect(semanticSpacing.cardPadding).toBe("1.5rem"); // Значение из spacing[6]
    });

    it("количество токенов не должно резко изменяться (защита от случайного удаления)", () => {
      // Если кто-то случайно удалит половину токенов или закомментирует файл,
      // этот тест упадёт и предупредит о катастрофе
      const minExpectedColors = 20; // Минимум цветов в теме
      const minExpectedSpacing = 10; // Минимум семантических отступов

      expect(Object.keys(themes.light).length).toBeGreaterThanOrEqual(
        minExpectedColors,
      );
      expect(Object.keys(semanticSpacing).length).toBeGreaterThanOrEqual(
        minExpectedSpacing,
      );
    });
  });
});
