// packages/z-index/tests/contrast.test.ts

import { describe, it, expect } from "vitest";
import {
  getContrastRatio,
  isAccessible,
  getContrastColor,
} from "../src/utils/contrast";

describe("Faf Contrast Utility", () => {
  describe("getContrastRatio", () => {
    it("должен возвращать 21:1 для чёрного на белом (максимальный контраст)", () => {
      const ratio = getContrastRatio("#000000", "#ffffff");
      expect(ratio).toBeCloseTo(21, 1);
    });

    it("должен возвращать 1:1 для одинаковых цветов", () => {
      const ratio = getContrastRatio("#ff0000", "#ff0000");
      expect(ratio).toBeCloseTo(1, 1);
    });
  });

  describe("isAccessible", () => {
    it("должен возвращать true для чёрного текста на белом фоне (WCAG AA)", () => {
      expect(isAccessible("#000000", "#ffffff")).toBe(true);
    });

    it("должен возвращать false для светло-серого текста на белом фоне", () => {
      // #cccccc на #ffffff имеет контраст ~1.61:1, что меньше требуемых 4.5:1
      expect(isAccessible("#cccccc", "#ffffff")).toBe(false);
    });

    it("должен возвращать true для тёмного текста на жёлтом фоне (наш warning toast)", () => {
      expect(isAccessible("#111827", "#eab308")).toBe(true);
    });
  });

  describe("getContrastColor", () => {
    it("должен возвращать белый для тёмного фона", () => {
      expect(getContrastColor("#111827")).toBe("#ffffff");
    });

    it("должен возвращать чёрный для светлого фона", () => {
      expect(getContrastColor("#f3f4f6")).toBe("#000000");
    });
  });
});
