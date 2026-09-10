// packages/contrast/src/types/contrast.ts

/**
 * Supported color formats.
 * Поддерживаемые форматы цветов.
 *
 * ⚠️ LIMITATION: oklch is parsed with a simplified formula.
 * ⚠️ ОГРАНИЧЕНИЕ: oklch парсится упрощённой формулой.
 * For production, it is recommended to use culori or colorjs.io.
 * Для production рекомендуется использовать culori или colorjs.io.
 * See docs/contrast-guide.md "Limitations" section.
 * См. docs/contrast-guide.md раздел "Ограничения".
 */
export type ColorFormat = "hex" | "rgb" | "oklch";

/**
 * WCAG compliance levels.
 * Уровни соответствия WCAG.
 */
export type WcagLevel = "AA" | "AAA";

/**
 * Text size for contrast checking.
 * Размер текста для проверки контрастности.
 * Large Text: ≥18pt (24px) or ≥14pt (18.5px) bold.
 * Крупный текст: ≥18pt (24px) или ≥14pt (18.5px) bold.
 */
export type TextSize = "normal" | "large";

/**
 * Contrast check result for a single WCAG level.
 * Результат проверки контрастности для одного уровня WCAG.
 */
export interface WcagCheck {
  /** Normal text compliance / Соответствие для обычного текста */
  normal: boolean;
  /** Large text compliance / Соответствие для крупного текста */
  large: boolean;
}

/**
 * Full contrast check result between two colors.
 * Полный результат проверки контрастности между двумя цветами.
 */
export interface ContrastResult {
  /** Contrast ratio from 1:1 to 21:1 / Коэффициент контрастности от 1:1 до 21:1 */
  ratio: number;

  /** WCAG AA compliance / Соответствие WCAG AA */
  aa: WcagCheck;

  /** WCAG AAA compliance / Соответствие WCAG AAA */
  aaa: WcagCheck;
}

/**
 * Token validator check category.
 * Категория проверки валидатора токенов.
 */
export type ValidationCategory =
  | "text-on-surface"
  | "icon-outline"
  | "focus-ring"
  | "focus-outline-background";

/**
 * Color pair for checking.
 * Пара цветов для проверки.
 */
export interface ColorPair {
  /** Foreground color token / Токен цвета переднего плана */
  foreground: string;
  /** Background color token / Токен цвета фона */
  background: string;
  /** Calculated contrast ratio / Рассчитанный коэффициент контраста */
  contrast: number;
  /** Check status / Статус проверки */
  status: "pass" | "fail";
  /** Text size category / Категория размера текста */
  textSize?: TextSize;
  /** Validation category / Категория валидации */
  category?: ValidationCategory;
}

/**
 * Contrast issue found during validation.
 * Проблема контрастности, найденная при валидации.
 */
export interface ContrastIssue {
  /** Issue category / Категория проблемы */
  category: ValidationCategory;
  /** Foreground color token / Токен цвета переднего плана */
  foreground: string;
  /** Background color token / Токен цвета фона */
  background: string;
  /** Actual contrast ratio / Фактический коэффициент контраста */
  contrast: number;
  /** Required contrast ratio / Требуемый коэффициент контраста */
  required: number;
  /** Text size category / Категория размера текста */
  textSize?: TextSize;
}

/**
 * Token validation report.
 * Отчёт валидации токенов.
 */
export interface ValidationReport {
  /** Report generation timestamp / Временная метка генерации отчёта */
  timestamp: string;
  /** Total number of checks / Общее количество проверок */
  total: number;
  /** Number of passed checks / Количество успешных проверок */
  passed: number;
  /** Number of failed checks / Количество неуспешных проверок */
  failed: number;
  /** Categorized results / Результаты, сгруппированные по категориям */
  categories: Record<
    ValidationCategory,
    {
      description: string;
      pairs: ColorPair[];
    }
  >;
  /** List of found issues / Список найденных проблем */
  issues: ContrastIssue[];
  /** Recommendations for improvement / Рекомендации по улучшению */
  recommendations: string[];
}
