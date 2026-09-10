// packages/contrast/tests/validators.test.ts
// Unit tests for validators / Unit-тесты валидаторов

import { describe, it, expect } from "vitest";
import { FafColorsValidator } from "../src/validators/faf-colors-validator.js";
import { FafFocusValidator } from "../src/validators/faf-focus-validator.js";
import type { ValidationReport } from "../src/types/contrast.js";

describe("FafColorsValidator", () => {
  const validator = new FafColorsValidator();

  it("should generate report with categories", () => {
    // Should generate report with categories / Должен генерировать отчёт с категориями
    const report: ValidationReport = {
      timestamp: new Date().toISOString(),
      total: 0,
      passed: 0,
      failed: 0,
      categories: {
        "text-on-surface": { description: "Test", pairs: [] },
        "icon-outline": { description: "Test", pairs: [] },
        "focus-ring": { description: "Test", pairs: [] },
        "focus-outline-background": { description: "Test", pairs: [] },
      },
      issues: [],
      recommendations: ["Test recommendation"],
    };

    const md = validator.generateMarkdownReport(report);

    expect(md).toContain("# Faf.Colors Contrast Validation Report");
    expect(md).toContain("## Categories");
    expect(md).toContain("text-on-surface");
  });

  it("should mark issues in report", () => {
    // Should mark issues in report / Должен отмечать проблемы в отчёте
    const report: ValidationReport = {
      timestamp: new Date().toISOString(),
      total: 1,
      passed: 0,
      failed: 1,
      categories: {
        "text-on-surface": {
          description: "Test",
          pairs: [
            {
              foreground: "--faf-color-text",
              background: "--faf-color-background",
              contrast: 2.5,
              status: "fail",
              textSize: "normal",
              category: "text-on-surface",
            },
          ],
        },
        "icon-outline": { description: "Test", pairs: [] },
        "focus-ring": { description: "Test", pairs: [] },
        "focus-outline-background": { description: "Test", pairs: [] },
      },
      issues: [
        {
          category: "text-on-surface",
          foreground: "--faf-color-text",
          background: "--faf-color-background",
          contrast: 2.5,
          required: 4.5,
          textSize: "normal",
        },
      ],
      recommendations: [],
    };

    const md = validator.generateMarkdownReport(report);

    expect(md).toContain("🚨 Issues");
    expect(md).toContain("--faf-color-text");
  });
});

describe("FafFocusValidator", () => {
  const validator = new FafFocusValidator();

  it("should be instantiable", () => {
    // Should be successfully instantiated / Должен успешно создаваться
    expect(validator).toBeDefined();
  });
});
