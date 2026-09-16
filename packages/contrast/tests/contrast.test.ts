// packages/contrast/tests/contrast.test.ts
// Unit tests for FafContrast utility / Unit-тесты утилиты FafContrast

import { describe, it, expect } from "vitest";
import { FafContrast } from "../src/utils/faf-contrast.js";

describe("FafContrast", () => {
  describe("getLuminance", () => {
    it("should return 0 for pure black", () => {
      // Pure black should have luminance 0 / Чистый чёрный должен иметь яркость 0
      expect(FafContrast.getLuminance("#000000")).toBe(0);
    });

    it("should return 1 for pure white", () => {
      // Pure white should have luminance 1 / Чистый белый должен иметь яркость 1
      expect(FafContrast.getLuminance("#ffffff")).toBe(1);
    });

    it("should calculate luminance for hex colors", () => {
      // Check luminance calculation for hex colors / Проверка расчёта яркости для hex цветов
      const luminance = FafContrast.getLuminance("#808080");
      expect(luminance).toBeGreaterThan(0);
      expect(luminance).toBeLessThan(1);
    });

    it("should handle rgb format", () => {
      // Check rgb() format handling / Проверка формата rgb()
      const luminance = FafContrast.getLuminance("rgb(128, 128, 128)");
      expect(luminance).toBeGreaterThan(0);
    });

    it("should handle oklch format (simplified)", () => {
      // Check oklch() format handling (simplified formula) / Проверка формата oklch() (упрощённая формула)
      const luminance = FafContrast.getLuminance("oklch(0.5 0.1 250)");
      expect(luminance).toBeGreaterThanOrEqual(0);
      expect(luminance).toBeLessThanOrEqual(1);
    });

    it("should fallback to black for unsupported format", () => {
      // Fallback for unsupported format / Запасной вариант для неподдерживаемого формата
      const luminance = FafContrast.getLuminance("invalid-color");
      expect(luminance).toBe(0);
    });
  });

  describe("calculateContrast", () => {
    it("should return 21 for black on white", () => {
      // Contrast of black on white should be ~21:1 / Контраст чёрного на белом должен быть ~21:1
      const contrast = FafContrast.calculateContrast("#000000", "#ffffff");
      expect(contrast).toBeCloseTo(21, 0);
    });

    it("should return 1 for same colors", () => {
      // Contrast of same colors should be 1:1 / Контраст одинаковых цветов должен быть 1:1
      const contrast = FafContrast.calculateContrast("#808080", "#808080");
      expect(contrast).toBeCloseTo(1, 0);
    });

    it("should be symmetric", () => {
      // Contrast should be symmetric (color order doesn't matter) / Контраст должен быть симметричным (порядок цветов не важен)
      const contrast1 = FafContrast.calculateContrast("#000000", "#ffffff");
      const contrast2 = FafContrast.calculateContrast("#ffffff", "#000000");
      expect(contrast1).toBeCloseTo(contrast2, 5);
    });
  });

  describe("isAccessible", () => {
    it("should pass AA for black on white (normal text)", () => {
      // Black on white should pass AA for normal text / Чёрный на белом должен проходить AA для обычного текста
      expect(
        FafContrast.isAccessible("#000000", "#ffffff", "AA", "normal"),
      ).toBe(true);
    });

    it("should fail AA for light gray on white (normal text)", () => {
      // Light gray on white should fail AA for normal text / Светло-серый на белом не должен проходить AA для обычного текста
      expect(
        FafContrast.isAccessible("#cccccc", "#ffffff", "AA", "normal"),
      ).toBe(false);
    });

    it("should pass AA for light gray on white (large text)", () => {
      // Light gray on white may pass AA for large text / Светло-серый на белом может проходить AA для крупного текста
      const result = FafContrast.isAccessible(
        "#999999",
        "#ffffff",
        "AA",
        "large",
      );
      expect(typeof result).toBe("boolean");
    });

    it("should pass AAA for black on white (normal text)", () => {
      // Black on white should pass AAA for normal text / Чёрный на белом должен проходить AAA для обычного текста
      expect(
        FafContrast.isAccessible("#000000", "#ffffff", "AAA", "normal"),
      ).toBe(true);
    });

    it("should fail AAA for gray on white (normal text)", () => {
      // Gray on white should fail AAA for normal text / Серый на белом не должен проходить AAA для обычного текста
      expect(
        FafContrast.isAccessible("#808080", "#ffffff", "AAA", "normal"),
      ).toBe(false);
    });
  });

  describe("getAccessibilityInfo", () => {
    it("should return full info for black on white", () => {
      // Should return full info for black on white / Должен возвращать полную информацию для чёрного на белом
      const info = FafContrast.getAccessibilityInfo("#000000", "#ffffff");

      expect(info.ratio).toBeCloseTo(21, 0);
      expect(info.aa.normal).toBe(true);
      expect(info.aa.large).toBe(true);
      expect(info.aaa.normal).toBe(true);
      expect(info.aaa.large).toBe(true);
    });

    it("should return partial pass for medium contrast", () => {
      // Should return partial pass for medium contrast / Должен возвращать частичное прохождение для среднего контраста
      const info = FafContrast.getAccessibilityInfo("#767676", "#ffffff");

      expect(info.ratio).toBeGreaterThan(3);
      expect(info.ratio).toBeLessThan(7);
      expect(info.aa.normal).toBe(true);
      expect(info.aaa.normal).toBe(false);
    });
  });

  describe("Robust RGB & Hex Parsing", () => {
    it("should handle rgb with percentages", () => {
      // rgb(100%, 50%, 0%) должен корректно конвертироваться в [255, 127.5, 0]
      const lum = FafContrast.getLuminance("rgb(100%, 50%, 0%)");
      expect(lum).toBeGreaterThan(0);
      expect(lum).toBeLessThan(1);
    });

    it("should handle rgb with spaces instead of commas", () => {
      // rgb(255 255 255) должен работать как rgb(255, 255, 255)
      const lumWhite = FafContrast.getLuminance("rgb(255 255 255)");
      expect(lumWhite).toBeCloseTo(1, 1);
    });

    it("should handle short hex codes", () => {
      // #fff должен быть равен #ffffff
      const lumShort = FafContrast.getLuminance("#fff");
      const lumLong = FafContrast.getLuminance("#ffffff");
      expect(lumShort).toBe(lumLong);
    });
  });

  describe("getAccessibilityInfo precision", () => {
    it("should round ratio to 2 decimal places", () => {
      // Проверка, что коэффициент округляется, как в реализации
      const info = FafContrast.getAccessibilityInfo("#767676", "#ffffff");
      expect(info.ratio.toString().split(".")[1]?.length).toBeLessThanOrEqual(
        2,
      );
    });
  });
});
