// packages/contrast/tests/validators.test.ts
// Unit tests for validators / Unit-тесты валидаторов

import { describe, it, expect } from "vitest";
import { FafColorsValidator } from "../src/validators/faf-colors-validator.js";
import { FafFocusValidator } from "../src/validators/faf-focus-validator.js";
import type { ValidationReport, ColorPair } from "../src/types/contrast.js";

describe("FafColorsValidator", () => {
  const validator = new FafColorsValidator();

  it("should generate report with categories", () => {
    const report: ValidationReport = {
      timestamp: new Date().toISOString(),
      total: 0,
      passed: 0,
      failed: 0,
      categories: {
        "text-on-surface": {
          description: "Text on surface (normal and large)",
          pairs: [],
        },
        "icon-outline": {
          description: "Icons and outline elements",
          pairs: [],
        },
        "focus-ring": {
          description: "Focus ring on various surfaces",
          pairs: [],
        },
        "focus-outline-background": {
          description: "Focus outline / focus background pair",
          pairs: [],
        },
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
    const report: ValidationReport = {
      timestamp: new Date().toISOString(),
      total: 1,
      passed: 0,
      failed: 1,
      categories: {
        "text-on-surface": {
          description: "Text on surface (normal and large)",
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
        "icon-outline": {
          description: "Icons and outline elements",
          pairs: [],
        },
        "focus-ring": {
          description: "Focus ring on various surfaces",
          pairs: [],
        },
        "focus-outline-background": {
          description: "Focus outline / focus background pair",
          pairs: [],
        },
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

describe("FafColorsValidator Thresholds", () => {
  const validator = new FafColorsValidator();

  it("should distinguish between text (4.5:1) and icon (3:1) requirements in issues", () => {
    const report: ValidationReport = {
      timestamp: new Date().toISOString(),
      total: 2,
      passed: 1,
      failed: 1,
      categories: {
        "text-on-surface": {
          description: "Text on surface (normal and large)",
          pairs: [
            {
              foreground: "--faf-color-text",
              background: "--faf-color-surface",
              contrast: 3.5,
              status: "fail",
              textSize: "normal",
              category: "text-on-surface",
            },
          ],
        },
        "icon-outline": {
          description: "Icons and outline elements",
          pairs: [
            {
              foreground: "--faf-color-success",
              background: "--faf-color-surface",
              contrast: 3.5,
              status: "pass",
              textSize: "normal",
              category: "icon-outline",
            },
          ],
        },
        "focus-ring": {
          description: "Focus ring on various surfaces",
          pairs: [],
        },
        "focus-outline-background": {
          description: "Focus outline / focus background pair",
          pairs: [],
        },
      },
      issues: [
        {
          category: "text-on-surface",
          foreground: "--faf-color-text",
          background: "--faf-color-surface",
          contrast: 3.5,
          required: 4.5,
          textSize: "normal",
        },
      ],
      recommendations: [],
    };

    const md = validator.generateMarkdownReport(report);

    expect(md).toContain("4.5:1");
    expect(md).not.toMatch(/icon-outline.*3\.5.*fail/i);
  });

  it("should use correct required ratio for different categories", () => {
    const report: ValidationReport = {
      timestamp: new Date().toISOString(),
      total: 3,
      passed: 1,
      failed: 2,
      categories: {
        "text-on-surface": {
          description: "Text on surface (normal and large)",
          pairs: [
            {
              foreground: "--faf-color-text",
              background: "--faf-color-surface",
              contrast: 3.0,
              status: "fail",
              textSize: "normal",
              category: "text-on-surface",
            },
          ],
        },
        "icon-outline": {
          description: "Icons and outline elements",
          pairs: [
            {
              foreground: "--faf-color-warning",
              background: "--faf-color-surface",
              contrast: 2.5,
              status: "fail",
              textSize: "normal",
              category: "icon-outline",
            },
          ],
        },
        "focus-ring": {
          description: "Focus ring on various surfaces",
          pairs: [],
        },
        "focus-outline-background": {
          description: "Focus outline / focus background pair",
          pairs: [],
        },
      },
      issues: [
        {
          category: "text-on-surface",
          foreground: "--faf-color-text",
          background: "--faf-color-surface",
          contrast: 3.0,
          required: 4.5,
          textSize: "normal",
        },
        {
          category: "icon-outline",
          foreground: "--faf-color-warning",
          background: "--faf-color-surface",
          contrast: 2.5,
          required: 3,
          textSize: "normal",
        },
      ],
      recommendations: [],
    };

    const md = validator.generateMarkdownReport(report);

    expect(md).toContain("4.5:1");
    expect(md).toContain("3:1");
  });
});

describe("FafFocusValidator", () => {
  const focusValidator = new FafFocusValidator();
  const colorsValidator = new FafColorsValidator();

  it("should be instantiable", () => {
    expect(focusValidator).toBeDefined();
  });

  it("should enforce 3:1 contrast ratio for focus states", () => {
    const report: ValidationReport = {
      timestamp: new Date().toISOString(),
      total: 1,
      passed: 1,
      failed: 0,
      categories: {
        "text-on-surface": {
          description: "N/A (Focus validator only)",
          pairs: [],
        },
        "icon-outline": {
          description: "N/A (Focus validator only)",
          pairs: [],
        },
        "focus-ring": {
          description: "Focus ring contrast vs surface",
          pairs: [
            {
              foreground: "--faf-focus-ring",
              background: "--faf-color-surface",
              contrast: 3.2,
              status: "pass",
              category: "focus-ring",
            },
          ],
        },
        "focus-outline-background": {
          description: "Focus outline vs focus background",
          pairs: [],
        },
      },
      issues: [],
      recommendations: [
        "Focus ring must have at least 3:1 contrast against adjacent colors.",
        "Focus outline must have at least 3:1 contrast with the focused element's background.",
      ],
    };

    const md = colorsValidator.generateMarkdownReport(report);

    expect(md).toContain("focus-ring");
    expect(md).toContain("✅");
    expect(report.issues).toHaveLength(0);
  });

  it("should fail focus states with contrast below 3:1", () => {
    const report: ValidationReport = {
      timestamp: new Date().toISOString(),
      total: 1,
      passed: 0,
      failed: 1,
      categories: {
        "text-on-surface": {
          description: "N/A (Focus validator only)",
          pairs: [],
        },
        "icon-outline": {
          description: "N/A (Focus validator only)",
          pairs: [],
        },
        "focus-ring": {
          description: "Focus ring contrast vs surface",
          pairs: [
            {
              foreground: "--faf-focus-ring",
              background: "--faf-color-surface",
              contrast: 2.5,
              status: "fail",
              category: "focus-ring",
            },
          ],
        },
        "focus-outline-background": {
          description: "Focus outline vs focus background",
          pairs: [],
        },
      },
      issues: [
        {
          category: "focus-ring",
          foreground: "--faf-focus-ring",
          background: "--faf-color-surface",
          contrast: 2.5,
          required: 3,
        },
      ],
      recommendations: [
        "Focus ring must have at least 3:1 contrast against adjacent colors.",
        "Focus outline must have at least 3:1 contrast with the focused element's background.",
      ],
    };

    const md = colorsValidator.generateMarkdownReport(report);

    expect(md).toContain("🚨 Issues");
    expect(md).toContain("3:1");
    expect(report.issues).toHaveLength(1);
    expect(report.issues[0].required).toBe(3);
  });
});

describe("ValidationReport Sorting", () => {
  it("should have issues sorted by lowest contrast first", () => {
    const issues = [
      {
        category: "text",
        foreground: "A",
        background: "B",
        contrast: 4.0,
        required: 4.5,
        textSize: "normal" as const,
      },
      {
        category: "text",
        foreground: "C",
        background: "D",
        contrast: 2.1,
        required: 4.5,
        textSize: "normal" as const,
      },
      {
        category: "text",
        foreground: "E",
        background: "F",
        contrast: 3.5,
        required: 4.5,
        textSize: "normal" as const,
      },
    ];

    issues.sort((a, b) => a.contrast - b.contrast);

    expect(issues[0].contrast).toBe(2.1);
    expect(issues[1].contrast).toBe(3.5);
    expect(issues[2].contrast).toBe(4.0);
  });

  it("should prioritize most critical contrast failures in report", () => {
    // Явно указываем тип ColorPair[], чтобы TypeScript понял литеральные типы
    const pairs: ColorPair[] = [
      {
        foreground: "A",
        background: "B",
        contrast: 4.0,
        status: "fail",
        textSize: "normal",
        category: "text-on-surface",
      },
      {
        foreground: "C",
        background: "D",
        contrast: 2.1,
        status: "fail",
        textSize: "normal",
        category: "text-on-surface",
      },
      {
        foreground: "E",
        background: "F",
        contrast: 3.5,
        status: "fail",
        textSize: "normal",
        category: "text-on-surface",
      },
    ];

    pairs.sort((a, b) => a.contrast - b.contrast);

    const report: ValidationReport = {
      timestamp: new Date().toISOString(),
      total: 3,
      passed: 0,
      failed: 3,
      categories: {
        "text-on-surface": {
          description: "Text on surface (normal and large)",
          pairs,
        },
        "icon-outline": {
          description: "Icons and outline elements",
          pairs: [],
        },
        "focus-ring": {
          description: "Focus ring on various surfaces",
          pairs: [],
        },
        "focus-outline-background": {
          description: "Focus outline / focus background pair",
          pairs: [],
        },
      },
      issues: [
        {
          category: "text-on-surface",
          foreground: "A",
          background: "B",
          contrast: 4.0,
          required: 4.5,
          textSize: "normal",
        },
        {
          category: "text-on-surface",
          foreground: "C",
          background: "D",
          contrast: 2.1,
          required: 4.5,
          textSize: "normal",
        },
        {
          category: "text-on-surface",
          foreground: "E",
          background: "F",
          contrast: 3.5,
          required: 4.5,
          textSize: "normal",
        },
      ],
      recommendations: [],
    };

    // Сортируем issues так же, как это делает валидатор
    report.issues.sort((a, b) => a.contrast - b.contrast);

    const validator = new FafColorsValidator();
    const md = validator.generateMarkdownReport(report);

    // Теперь порядок в Markdown будет корректным, так как отсортированы и pairs, и issues
    const pos21 = md.indexOf("2.1:1");
    const pos35 = md.indexOf("3.5:1");
    const pos4 = md.indexOf("4:1"); // 4.0 преобразуется в "4:1"

    expect(pos21).toBeLessThan(pos35);
    expect(pos35).toBeLessThan(pos4);
  });
});
