// packages/contrast/src/validators/faf-colors-validator.ts

import { FafContrast } from "../utils/faf-contrast.js";
import { CssTokenParser } from "../utils/css-token-parser.js";
import type {
  ValidationReport,
  ValidationCategory,
} from "../types/contrast.js";

/**
 * Configuration for token categories to validate.
 * Конфигурация категорий токенов для валидации.
 * Allows external users to map their own tokens to validation categories.
 * Позволяет внешним пользователям маппить свои токены на категории валидации.
 */
export interface TokenCategoryConfig {
  text: string[];
  surface: string[];
  icon: string[];
  focusRing?: string[];
  focusOutline?: string;
  focusBackground?: string;
}

/**
 * Default configuration for Faf Design System tokens.
 * Конфигурация по умолчанию для токенов дизайн-системы Faf.
 */
export const DEFAULT_FAF_CONFIG: TokenCategoryConfig = {
  text: ["--faf-color-text", "--faf-color-text-muted", "--faf-color-primary"],
  surface: ["--faf-color-background", "--faf-color-surface"],
  icon: [
    "--faf-color-success",
    "--faf-color-danger",
    "--faf-color-warning",
    "--faf-color-info",
  ],
  focusRing: ["--faf-focus-ring", "--faf-focus-ring-offset"],
  focusOutline: "--faf-focus-outline",
  focusBackground: "--faf-focus-background",
};

/**
 * 🎯 FafColorsValidator — Validator for color tokens.
 * Валидатор цветовых токенов.
 *
 * Key features:
 * Ключевые особенности:
 * 1. Imports tokens from CSS (no hardcoded values). / Импортирует токены из CSS (без хардкода значений).
 * 2. Configurable token mapping (supports external design systems). / Настраиваемый маппинг токенов (поддержка внешних дизайн-систем).
 * 3. Checks 4 categories with Large Text support. / Проверяет 4 категории с поддержкой Large Text.
 * 4. Generates a structured Markdown report in English. / Генерирует структурированный Markdown-отчет на английском.
 */
export class FafColorsValidator {
  private parser: CssTokenParser;
  private config: TokenCategoryConfig;

  constructor(config: TokenCategoryConfig = DEFAULT_FAF_CONFIG) {
    this.parser = new CssTokenParser();
    this.config = config;
  }

  /**
   * Performs full validation of tokens from the specified CSS file.
   * Выполняет полную валидацию токенов из указанного CSS файла.
   *
   * @param cssFilePath - Path to the tokens file / Путь к файлу с токенами
   * @param prefix - Token prefix to extract (default: '--faf-') / Префикс токенов для извлечения (по умолчанию: '--faf-')
   * @returns ValidationReport object / Объект отчета ValidationReport
   */
  async validateAll(
    cssFilePath: string,
    prefix: string = "--faf-",
  ): Promise<ValidationReport> {
    const tokens = await this.parser.parseFile(cssFilePath, prefix);

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
      // Report recommendations are strictly in English as per localization rules / Рекомендации отчета строго на английском согласно правилам локализации
      recommendations: [
        "For text on light backgrounds, use shades 700-900.",
        "For text on dark backgrounds, use shades 100-300.",
        "Focus ring must be highly contrastive against any background (minimum 3:1).",
        "Warning color (yellow) often fails WCAG AA on white backgrounds — use with caution or with dark text.",
        "Large Text (≥18pt or ≥14pt bold) has reduced requirements (3:1 instead of 4.5:1).",
      ],
    };

    // --- CATEGORY 1: text-on-surface / КАТЕГОРИЯ 1: текст на поверхности ---
    for (const textToken of this.config.text) {
      for (const surfaceToken of this.config.surface) {
        const textColor = tokens[textToken];
        const surfaceColor = tokens[surfaceToken];
        if (!textColor || !surfaceColor) continue;

        this._checkAndRecord(
          report,
          "text-on-surface",
          textToken,
          surfaceToken,
          textColor,
          surfaceColor,
          "normal",
        );
        this._checkAndRecord(
          report,
          "text-on-surface",
          textToken,
          surfaceToken,
          textColor,
          surfaceColor,
          "large",
        );
      }
    }

    // --- CATEGORY 2: icon-outline / КАТЕГОРИЯ 2: иконки и контуры ---
    for (const iconToken of this.config.icon) {
      for (const surfaceToken of this.config.surface) {
        const iconColor = tokens[iconToken];
        const surfaceColor = tokens[surfaceToken];
        if (!iconColor || !surfaceColor) continue;

        this._checkAndRecord(
          report,
          "icon-outline",
          iconToken,
          surfaceToken,
          iconColor,
          surfaceColor,
          "normal",
          3,
        );
      }
    }

    // --- CATEGORY 3: focus-ring / КАТЕГОРИЯ 3: кольцо фокуса ---
    if (this.config.focusRing) {
      for (const ringToken of this.config.focusRing) {
        for (const surfaceToken of this.config.surface) {
          const ringColor = tokens[ringToken];
          const surfaceColor = tokens[surfaceToken];
          if (!ringColor || !surfaceColor) continue;
          this._checkAndRecord(
            report,
            "focus-ring",
            ringToken,
            surfaceToken,
            ringColor,
            surfaceColor,
            "normal",
          );
        }
      }
    }

    // --- CATEGORY 4: focus-outline-background / КАТЕГОРИЯ 4: контур фокуса и фон ---
    if (this.config.focusOutline && this.config.focusBackground) {
      const outlineColor = tokens[this.config.focusOutline];
      const bgColor = tokens[this.config.focusBackground];
      if (outlineColor && bgColor) {
        this._checkAndRecord(
          report,
          "focus-outline-background",
          this.config.focusOutline,
          this.config.focusBackground,
          outlineColor,
          bgColor,
          "normal",
        );
      }
    }
    report.issues.sort((a, b) => a.contrast - b.contrast);
    return report;
  }

  /**
   * Internal method to check a pair and record the result in the report.
   * Внутренний метод для проверки пары и записи результата в отчет.
   */
  private _checkAndRecord(
    report: ValidationReport,
    category: ValidationCategory,
    fgToken: string,
    bgToken: string,
    fgColor: string,
    bgColor: string,
    textSize: "normal" | "large",
    requiredRatio: number = 4.5,
  ): void {
    const info = FafContrast.getAccessibilityInfo(fgColor, bgColor);
    report.total++;

    const isPass = info.ratio >= requiredRatio;

    if (isPass) {
      report.passed++;
      report.categories[category].pairs.push({
        foreground: fgToken,
        background: bgToken,
        contrast: info.ratio,
        status: "pass",
        textSize,
        category,
      });
    } else {
      report.failed++;
      report.categories[category].pairs.push({
        foreground: fgToken,
        background: bgToken,
        contrast: info.ratio,
        status: "fail",
        textSize,
        category,
      });
      report.issues.push({
        category,
        foreground: fgToken,
        background: bgToken,
        contrast: info.ratio,
        required: requiredRatio,
        textSize,
      });
    }
  }

  /**
   * Generates a Markdown report based on validation results.
   * Генерирует Markdown-отчет на основе результатов валидации.
   */
  generateMarkdownReport(report: ValidationReport): string {
    let md = "# Faf.Colors Contrast Validation Report\n\n";
    md += `**Generated:** ${report.timestamp}\n\n`;

    md += `## Summary\n\n`;
    md += `- **Total checks:** ${report.total}\n`;
    md += `- **Passed:** ${report.passed} ✅\n`;
    md += `- **Failed:** ${report.failed} ❌\n\n`;

    md += `## Categories\n\n`;
    for (const [catName, catData] of Object.entries(report.categories)) {
      md += `### ${catName}\n`;
      md += `*${catData.description}*\n\n`;

      if (catData.pairs.length > 0) {
        md += `| Foreground | Background | Contrast | Size | Status |\n`;
        md += `|------------|------------|----------|------|--------|\n`;
        for (const pair of catData.pairs) {
          const icon = pair.status === "pass" ? "✅" : "❌";
          md += `| \`${pair.foreground}\` | \`${pair.background}\` | ${pair.contrast}:1 | ${pair.textSize} | ${icon} |\n`;
        }
      } else {
        md += `_No pairs checked for this category._\n`;
      }
      md += "\n";
    }

    if (report.issues.length > 0) {
      md += `## 🚨 Issues\n\n`;
      md += `| Category | Foreground | Background | Contrast | Required | Size |\n`;
      md += `|----------|------------|------------|----------|----------|------|\n`;
      for (const issue of report.issues) {
        md += `| ${issue.category} | \`${issue.foreground}\` | \`${issue.background}\` | ${issue.contrast}:1 | ${issue.required}:1 | ${issue.textSize} |\n`;
      }
      md += "\n";
    } else {
      md += `## ✅ All tokens pass WCAG AA requirements!\n\n`;
    }

    md += `## Recommendations\n\n`;
    for (const rec of report.recommendations) {
      md += `- ${rec}\n`;
    }

    return md;
  }
}
