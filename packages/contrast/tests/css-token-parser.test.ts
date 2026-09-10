// packages/contrast/tests/css-token-parser.test.ts
// Unit tests for CssTokenParser / Unit-тесты CssTokenParser

import { describe, it, expect } from "vitest";
import { CssTokenParser } from "../src/utils/css-token-parser.js";

describe("CssTokenParser", () => {
  const parser = new CssTokenParser();

  describe("parse", () => {
    it("should extract faf tokens from CSS", () => {
      // Should extract faf tokens from CSS / Должен извлекать faf токены из CSS
      const css = `
        :root {
          --faf-color-text: #111827;
          --faf-color-background: #ffffff;
          --faf-color-primary: oklch(0.55 0.22 250);
        }
      `;

      const tokens = parser.parse(css);

      expect(tokens["--faf-color-text"]).toBe("#111827");
      expect(tokens["--faf-color-background"]).toBe("#ffffff");
      expect(tokens["--faf-color-primary"]).toBe("oklch(0.55 0.22 250)");
    });

    it("should extract tokens with custom prefix", () => {
      // Should extract tokens with custom prefix / Должен извлекать токены с кастомным префиксом
      const css = `
        :root {
          --my-color-text: #111827;
          --my-color-background: #ffffff;
        }
      `;

      const tokens = parser.parse(css, "--my-");

      expect(tokens["--my-color-text"]).toBe("#111827");
      expect(tokens["--my-color-background"]).toBe("#ffffff");
    });

    it("should ignore non-matching tokens", () => {
      // Should ignore tokens without the required prefix / Должен игнорировать токены без нужного префикса
      const css = `
        :root {
          --faf-color-text: #111827;
          --other-color: #ffffff;
        }
      `;

      const tokens = parser.parse(css);

      expect(tokens["--faf-color-text"]).toBe("#111827");
      expect(tokens["--other-color"]).toBeUndefined();
    });

    it("should handle empty CSS", () => {
      // Should handle empty CSS / Должен обрабатывать пустой CSS
      const tokens = parser.parse("");
      expect(tokens).toEqual({});
    });

    it("should handle CSS with no tokens", () => {
      // Should handle CSS with no tokens / Должен обрабатывать CSS без токенов
      const css = `
        body {
          margin: 0;
          padding: 0;
        }
      `;

      const tokens = parser.parse(css);
      expect(tokens).toEqual({});
    });
  });
});
