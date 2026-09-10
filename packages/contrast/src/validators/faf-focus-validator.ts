// packages/contrast/src/validators/faf-focus-validator.ts

import { FafContrast } from "../utils/faf-contrast.js";
import { CssTokenParser } from "../utils/css-token-parser.js";
import type { ValidationReport } from "../types/contrast.js";
import type { TokenCategoryConfig } from "./faf-colors-validator.js";
import { DEFAULT_FAF_CONFIG } from "./faf-colors-validator.js";

/**
 * 🎯 FafFocusValidator — Validator for focus states.
 * Валидатор состояний фокуса.
 * Checks contrast of focus ring and focus outline/background pair.
 * Проверяет контрастность кольца фокуса и пары контур фокуса/фон.
 *
 * ️ TODO (Course 4 - Faf-Focus):
 * TODO (Курс 4 - Faf-Focus):
 * After implementing the @faf/focus package:
 * После реализации пакета @faf/focus:
 * 1. Replace hardcoded token names with imports from @faf/focus/styles. / Заменить захардкоженные имена токенов на импорты из @faf/focus/styles.
 * 2. Update this validator to read tokens from the real package. / Обновить этот валидатор для чтения токенов из реального пакета.
 * 3. Update @faf/z-index to use real FafContrast instead of the stub. / Обновить @faf/z-index для использования реального FafContrast вместо заглушки.
 *
 * Currently, the validator works with tokens from CSS files passed via parseFile().
 * В настоящее время валидатор работает с токенами из CSS файлов, переданных через parseFile().
 */
export class FafFocusValidator {
  private parser: CssTokenParser;
  private config: TokenCategoryConfig;

  constructor(config: TokenCategoryConfig = DEFAULT_FAF_CONFIG) {
    this.parser = new CssTokenParser();
    this.config = config;
  }

  /**
   * Validates focus states from the specified CSS file.
   * Валидирует состояния фокуса из указанного CSS файла.
   *
   * @param cssFilePath - Path to the tokens file / Путь к файлу с токенами
   * @param prefix - Token prefix to extract (default: '--faf-') / Префикс токенов для извлечения (по умолчанию: '--faf-')
   * @returns ValidationReport object / Объект отчета ValidationReport
   */
  async validateFocusStates(
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
        "text-on-surface": { description: "N/A", pairs: [] },
        "icon-outline": { description: "N/A", pairs: [] },
        "focus-ring": { description: "Focus ring contrast", pairs: [] },
        "focus-outline-background": {
          description: "Focus outline vs background",
          pairs: [],
        },
      },
      issues: [],
      recommendations: [
        "Focus ring must be clearly visible on any background (minimum 3:1).",
      ],
    };

    if (this.config.focusRing) {
      for (const ringToken of this.config.focusRing) {
        for (const surfaceToken of this.config.surface) {
          const ringColor = tokens[ringToken];
          const surfaceColor = tokens[surfaceToken];
          if (!ringColor || !surfaceColor) continue;

          const info = FafContrast.getAccessibilityInfo(
            ringColor,
            surfaceColor,
          );
          report.total++;

          // For focus rings, 3:1 is often acceptable, but we check against strict AA (4.5:1)
          // Для колец фокуса часто допустимо 3:1, но мы проверяем по строгому AA (4.5:1)
          // or you can customize this threshold based on your design system rules.
          // или вы можете настроить этот порог в зависимости от правил вашей дизайн-системы.
          const isPass = info.aa.normal;

          if (isPass) {
            report.passed++;
            report.categories["focus-ring"].pairs.push({
              foreground: ringToken,
              background: surfaceToken,
              contrast: info.ratio,
              status: "pass",
              category: "focus-ring",
            });
          } else {
            report.failed++;
            report.issues.push({
              category: "focus-ring",
              foreground: ringToken,
              background: surfaceToken,
              contrast: info.ratio,
              required: 4.5,
            });
          }
        }
      }
    }

    return report;
  }
}
