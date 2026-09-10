/**
 * @module Faf Z-Index Token Contract Tests
 * @description Unit tests verifying the mathematical correctness and completeness of the z-index token hierarchy.
 *              Unit-тесты, проверяющие математическую корректность и полноту иерархии z-index токенов.
 */

import { describe, it, expect } from "vitest";
import { zIndexTokens } from "../src/tokens/zindex";

describe("Faf Z-Index: Token Contract Tests", () => {
  it("should contain all required tokens / должен содержать все обязательные токены", () => {
    const expectedKeys = [
      "base",
      "dropdown",
      "sticky",
      "fixed",
      "modalBackdrop",
      "modal",
      "popover",
      "tooltip",
      "toast",
    ];

    expect(Object.keys(zIndexTokens)).toEqual(
      expect.arrayContaining(expectedKeys),
    );
    expect(Object.keys(zIndexTokens).length).toBe(expectedKeys.length);
  });

  it("should guarantee strict layer hierarchy (low to high) / должен гарантировать строгую иерархию слоёв (от низкого к высокому)", () => {
    // This is the main test! It proves the layer system is mathematically correct.
    // Это главный тест! Он доказывает, что система слоёв математически корректна.
    expect(zIndexTokens.base).toBeLessThan(zIndexTokens.dropdown);
    expect(zIndexTokens.dropdown).toBeLessThan(zIndexTokens.sticky);
    expect(zIndexTokens.sticky).toBeLessThan(zIndexTokens.fixed);
    expect(zIndexTokens.fixed).toBeLessThan(zIndexTokens.modalBackdrop);
    expect(zIndexTokens.modalBackdrop).toBeLessThan(zIndexTokens.modal);
    expect(zIndexTokens.modal).toBeLessThan(zIndexTokens.popover);
    expect(zIndexTokens.popover).toBeLessThan(zIndexTokens.tooltip);
    expect(zIndexTokens.tooltip).toBeLessThan(zIndexTokens.toast);
  });

  it("should have sufficient gaps between layer groups / должен иметь достаточные промежутки между группами слоёв", () => {
    // The gap between dropdown (1000) and modalBackdrop (1040) must be >= 10,
    // to leave room for future sub-levels (e.g., dropdown-open: 1010)
    // Промежуток между dropdown (1000) и modalBackdrop (1040) должен быть >= 10,
    // чтобы оставить место для будущих подуровней (например, dropdown-open: 1010)
    expect(
      zIndexTokens.modalBackdrop - zIndexTokens.dropdown,
    ).toBeGreaterThanOrEqual(10);
    expect(zIndexTokens.toast - zIndexTokens.modal).toBeGreaterThanOrEqual(10);
  });

  it("all values must be positive integers / все значения должны быть положительными целыми числами", () => {
    Object.values(zIndexTokens).forEach((value) => {
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
    });
  });
});
