/**
 * @module Token Unit Tests
 * @description Unit tests verifying specific token values match expected design specifications.
 *              Unit-тесты, проверяющие, что конкретные значения токенов соответствуют ожидаемым спецификациям дизайна.
 *
 * @purpose Catch accidental value changes:
 *          Ловят случайные изменения значений:
 *          - If spacing[4] changes from "1rem" to "2rem", this test fails
 *            Если spacing[4] изменится с "1rem" на "2rem", тест упадёт
 *          - Prevents breaking all components using this token
 *            Предотвращает поломку всех компонентов, использующих этот токен
 */

import { describe, it, expect } from "vitest";
import { spacing } from "../src/tokens/spacing";
import { semanticSpacing } from "../src/tokens/spacing/semantic";
import { shadows } from "../src/tokens/shadows";
import { semanticShadows } from "../src/tokens/shadows/semantic";
import { themes } from "../src/semantic/themes";
import { radii } from "../src/tokens/radius/radii";
import { semanticRadius } from "../src/tokens/radius/semantic";
import { opacity } from "../src/tokens/opacity/opacity";
import { semanticOpacity } from "../src/tokens/opacity/semantic";
import { durations, easings } from "../src/tokens/transitions/transitions";
import { semanticTransitions } from "../src/tokens/transitions/semantic";
import {
  typographyScale,
  fluidSizes,
  fontFamilies,
  fontWeights,
  lineHeights,
} from "../src/tokens/typography";
import { semanticTypography } from "../src/tokens/typography/semantic";

describe("Faf Foundations: Token Unit Tests / Unit-тесты токенов", () => {
  describe("Spacing / Отступы", () => {
    it("spacing[0] should be 0px / spacing[0] должен быть 0px", () => {
      // Verify base zero spacing value / Проверяем базовое значение нулевого отступа
      expect(spacing[0]).toBe("0px");
    });

    it("spacing[4] should be 1rem (16px) / spacing[4] должен быть 1rem (16px)", () => {
      // This is the most frequently used spacing in UI
      // If it changes, half the interface will break
      // Это самый часто используемый отступ в UI
      // Если он изменится, сломается половина интерфейса
      expect(spacing[4]).toBe("1rem");
    });

    it("spacing[6] should be 1.5rem (24px) / spacing[6] должен быть 1.5rem (24px)", () => {
      // Used for cardPadding and other large spacings
      // Используется для cardPadding и других крупных отступов
      expect(spacing[6]).toBe("1.5rem");
    });

    it("all spacing values must be strings / все значения spacing должны быть строками", () => {
      // Typo protection: if someone writes spacing[4] = 16 (a number),
      // CSS won't work. This test catches such errors.
      // Защита от опечаток: если кто-то напишет spacing[4] = 16 (число),
      // CSS не сработает. Этот тест ловит такие ошибки.
      Object.values(spacing).forEach((value) => {
        expect(typeof value).toBe("string");
      });
    });
  });

  describe("Semantic Spacing / Семантические отступы", () => {
    it("cardPadding should reference spacing[6] / cardPadding должен ссылаться на spacing[6]", () => {
      // Verify semantic token correctly maps to primitive
      // Проверяем, что семантический токен правильно мапится на примитив
      expect(semanticSpacing.cardPadding).toBe(spacing[6]);
    });

    it("buttonPaddingX should be 1rem / buttonPaddingX должен быть 1rem", () => {
      // Horizontal button padding / Горизонтальный отступ кнопки
      expect(semanticSpacing.buttonPaddingX).toBe("1rem");
    });

    it("modalPadding should be 2rem / modalPadding должен быть 2rem", () => {
      // Modal window padding / Отступ модального окна
      expect(semanticSpacing.modalPadding).toBe("2rem");
    });
  });

  describe("Shadows / Тени", () => {
    it('shadows.none should be "none" / shadows.none должен быть "none"', () => {
      // Absence of shadow / Отсутствие тени
      expect(shadows.none).toBe("none");
    });

    it("shadows.sm should contain correct value / shadows.sm должен содержать корректное значение", () => {
      // Small shadow for buttons / Маленькая тень для кнопок
      expect(shadows.sm).toContain("rgba");
      expect(shadows.sm).toContain("0 1px 2px");
    });

    it("semanticShadows.card should reference shadows.md / semanticShadows.card должен ссылаться на shadows.md", () => {
      // Card shadow = medium shadow / Тень карточки = средняя тень
      expect(semanticShadows.card).toBe(shadows.md);
    });

    it("semanticShadows.modal should reference shadows.xl / semanticShadows.modal должен ссылаться на shadows.xl", () => {
      // Modal shadow = extra large shadow / Тень модального окна = большая тень
      expect(semanticShadows.modal).toBe(shadows.xl);
    });
  });

  describe("Colors / Цвета", () => {
    it("light theme should contain primary color / светлая тема должна содержать primary цвет", () => {
      // Verify primary color is defined / Проверяем, что primary цвет определён
      expect(themes.light.primary).toBeDefined();
      expect(themes.light.primary).not.toBe("");
    });

    it("primary color should be in OKLCH format / primary цвет должен быть в формате OKLCH", () => {
      // Ensure we use modern color format / Убеждаемся, что мы используем современный формат цвета
      expect(themes.light.primary).toContain("oklch");
    });

    it("dark theme should contain primary color / тёмная тема должна содержать primary цвет", () => {
      expect(themes.dark.primary).toBeDefined();
      expect(themes.dark.primary).toContain("oklch");
    });

    it("primary in light and dark themes should be different / primary в светлой и тёмной темах должен быть разным", () => {
      // In light theme primary is darker, in dark theme — lighter
      // В светлой теме primary темнее, в тёмной — светлее
      expect(themes.light.primary).not.toBe(themes.dark.primary);
    });

    it("brand colors should not change between themes / брендовые цвета не должны меняться от темы", () => {
      // Brand colors are fixed and not inverted / Брендовые цвета фиксированы и не инвертируются
      expect(themes.light.brandFirefly).toBe(themes.dark.brandFirefly);
      expect(themes.light.brandAi).toBe(themes.dark.brandAi);
      expect(themes.light.brandFlow).toBe(themes.dark.brandFlow);
    });
  });

  describe("Radius / Скругления", () => {
    it('radii.none should be "0px" / radii.none должен быть "0px"', () => {
      expect(radii.none).toBe("0px");
    });

    it("radii.sm should be 0.25rem (4px) / radii.sm должен быть 0.25rem (4px)", () => {
      expect(radii.sm).toBe("0.25rem");
    });

    it("radii.full should be 9999px / radii.full должен быть 9999px", () => {
      expect(radii.full).toBe("9999px");
    });

    it("semanticRadius.button should reference radii.sm / semanticRadius.button должен ссылаться на radii.sm", () => {
      expect(semanticRadius.button).toBe(radii.sm);
    });
  });

  describe("Opacity / Прозрачность", () => {
    it('opacity[0] should be "0" / opacity[0] должен быть "0"', () => {
      expect(opacity[0]).toBe("0");
    });

    it('opacity[50] should be "0.5" / opacity[50] должен быть "0.5"', () => {
      expect(opacity[50]).toBe("0.5");
    });

    it('opacity[100] should be "1" / opacity[100] должен быть "1"', () => {
      expect(opacity[100]).toBe("1");
    });

    it("semanticOpacity.disabled should reference opacity[50] / semanticOpacity.disabled должен ссылаться на opacity[50]", () => {
      expect(semanticOpacity.disabled).toBe(opacity[50]);
    });
  });

  describe("Transitions / Переходы", () => {
    it("durations.fast should be 150ms / durations.fast должен быть 150ms", () => {
      expect(durations.fast).toBe("150ms");
    });

    it("easings.easeOut should contain correct bezier curve / easings.easeOut должен содержать корректную кривую Безье", () => {
      expect(easings.easeOut).toBe("cubic-bezier(0, 0, 0.2, 1)");
    });

    it("semanticTransitions.default should combine base duration and easeOut / semanticTransitions.default должен комбинировать base длительность и easeOut", () => {
      expect(semanticTransitions.default).toBe(
        `${durations.base} ${easings.easeOut}`,
      );
    });
  });

  describe("Typography Scale & Fluid / Модульная и Fluid типографика", () => {
    it("typographyScale[0] should be 1rem (base) / typographyScale[0] должен быть 1rem (база)", () => {
      expect(typographyScale[0]).toBe("1rem");
    });

    it("typographyScale[-1] should be 0.8rem / typographyScale[-1] должен быть 0.8rem", () => {
      expect(typographyScale[-1]).toBe("0.8rem");
    });

    it("fluidSizes.base should contain clamp function / fluidSizes.base должен содержать функцию clamp", () => {
      expect(fluidSizes.base).toContain("clamp");
    });
  });

  describe("Typography Primitives / Примитивы типографики", () => {
    it("fontFamilies.sans should contain Inter / fontFamilies.sans должен содержать Inter", () => {
      expect(fontFamilies.sans).toContain("Inter");
    });

    it("fontFamilies.mono should contain Fira Code / fontFamilies.mono должен содержать Fira Code", () => {
      expect(fontFamilies.mono).toContain("Fira Code");
    });

    it("fontWeights.bold should be 700 / fontWeights.bold должен быть 700", () => {
      expect(fontWeights.bold).toBe(700);
    });

    it("lineHeights.normal should be 1.5 / lineHeights.normal должен быть 1.5", () => {
      expect(lineHeights.normal).toBe(1.5);
    });
  });

  describe("Semantic Typography / Семантическая типографика", () => {
    it("semanticTypography.heading.h1.size should reference fluidSizes['3xl'] / semanticTypography.heading.h1.size должен ссылаться на fluidSizes['3xl']", () => {
      expect(semanticTypography.heading.h1.size).toBe(fluidSizes["3xl"]);
    });

    it("semanticTypography.ui.code.family should reference fontFamilies.mono / semanticTypography.ui.code.family должен ссылаться на fontFamilies.mono", () => {
      expect(semanticTypography.ui.code.family).toBe(fontFamilies.mono);
    });

    it("semanticTypography.ui.dataValue.weight should be 700 / semanticTypography.ui.dataValue.weight должен быть 700", () => {
      expect(semanticTypography.ui.dataValue.weight).toBe(700);
    });
  });
});
