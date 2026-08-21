import { describe, it, expect } from "vitest";
import { spacing } from "../src/tokens/spacing";
import { semanticSpacing } from "../src/tokens/spacing/semantic";
import { shadows } from "../src/tokens/shadows";
import { semanticShadows } from "../src/tokens/shadows/semantic";
import { themes } from "../src/semantic/themes";

/**
 * UNIT-ТЕСТЫ: Проверяют, что конкретные токены имеют ожидаемые значения.
 *
 * Зачем: Если кто-то случайно изменит spacing[4] с "1rem" на "2rem",
 * этот тест упадёт и предотвратит поломку всех компонентов, использующих этот токен.
 */

describe("Faf Foundations: Unit-тесты токенов", () => {
  describe("Spacing (Отступы)", () => {
    it("spacing[0] должен быть 0px", () => {
      // Проверяем базовое значение нулевого отступа
      expect(spacing[0]).toBe("0px");
    });

    it("spacing[4] должен быть 1rem (16px)", () => {
      // Это самый часто используемый отступ в UI
      // Если он изменится, сломается половина интерфейса
      expect(spacing[4]).toBe("1rem");
    });

    it("spacing[6] должен быть 1.5rem (24px)", () => {
      // Используется для cardPadding и других крупных отступов
      expect(spacing[6]).toBe("1.5rem");
    });

    it("все значения spacing должны быть строками", () => {
      // Защита от опечаток: если кто-то напишет spacing[4] = 16 (число),
      // CSS не сработает. Этот тест ловит такие ошибки.
      Object.values(spacing).forEach((value) => {
        expect(typeof value).toBe("string");
      });
    });
  });

  describe("Semantic Spacing (Семантические отступы)", () => {
    it("cardPadding должен ссылаться на spacing[6]", () => {
      // Проверяем, что семантический токен правильно мапится на примитив
      expect(semanticSpacing.cardPadding).toBe(spacing[6]);
    });

    it("buttonPaddingX должен быть 1rem", () => {
      // Горизонтальный отступ кнопки
      expect(semanticSpacing.buttonPaddingX).toBe("1rem");
    });

    it("modalPadding должен быть 2rem", () => {
      // Отступ модального окна
      expect(semanticSpacing.modalPadding).toBe("2rem");
    });
  });

  describe("Shadows (Тени)", () => {
    it('shadows.none должен быть "none"', () => {
      // Отсутствие тени
      expect(shadows.none).toBe("none");
    });

    it("shadows.sm должен содержать корректное значение", () => {
      // Маленькая тень для кнопок
      expect(shadows.sm).toContain("rgba");
      expect(shadows.sm).toContain("0 1px 2px");
    });

    it("semanticShadows.card должен ссылаться на shadows.md", () => {
      // Тень карточки = средняя тень
      expect(semanticShadows.card).toBe(shadows.md);
    });

    it("semanticShadows.modal должен ссылаться на shadows.xl", () => {
      // Тень модального окна = большая тень
      expect(semanticShadows.modal).toBe(shadows.xl);
    });
  });

  describe("Colors (Цвета)", () => {
    it("светлая тема должна содержать primary цвет", () => {
      // Проверяем, что primary цвет определён
      expect(themes.light.primary).toBeDefined();
      expect(themes.light.primary).not.toBe("");
    });

    it("primary цвет должен быть в формате OKLCH", () => {
      // Убеждаемся, что мы используем современный формат цвета
      expect(themes.light.primary).toContain("oklch");
    });

    it("тёмная тема должна содержать primary цвет", () => {
      expect(themes.dark.primary).toBeDefined();
      expect(themes.dark.primary).toContain("oklch");
    });

    it("primary в светлой и тёмной темах должен быть разным", () => {
      // В светлой теме primary темнее, в тёмной — светлее
      expect(themes.light.primary).not.toBe(themes.dark.primary);
    });

    it("брендовые цвета не должны меняться от темы", () => {
      // Брендовые цвета фиксированы и не инвертируются
      expect(themes.light.brandFirefly).toBe(themes.dark.brandFirefly);
      expect(themes.light.brandAi).toBe(themes.dark.brandAi);
      expect(themes.light.brandFlow).toBe(themes.dark.brandFlow);
    });
  });
});
