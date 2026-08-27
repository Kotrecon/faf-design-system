// packages/z-index/tests/zindex-tokens.test.ts

import { describe, it, expect } from "vitest";
import { zIndexTokens } from "../src/tokens/zindex";

describe("Faf Z-Index: Token Contract Tests", () => {
  it("должен содержать все обязательные токены", () => {
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

  it("должен гарантировать строгую иерархию слоёв (от низкого к высокому)", () => {
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

  it("должен иметь достатсные промежутки между группами слоёв", () => {
    // Промежуток между dropdown (1000) и modalBackdrop (1040) должен быть >= 10,
    // чтобы оставить место для будущих подуровней (например, dropdown-open: 1010)
    expect(
      zIndexTokens.modalBackdrop - zIndexTokens.dropdown,
    ).toBeGreaterThanOrEqual(10);
    expect(zIndexTokens.toast - zIndexTokens.modal).toBeGreaterThanOrEqual(10);
  });

  it("все значения должны быть положительными целыми числами", () => {
    Object.values(zIndexTokens).forEach((value) => {
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
    });
  });
});
