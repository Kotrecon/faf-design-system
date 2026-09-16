/**
 * @module @faf/contrast
 * @description Main entry point for the contrast package.
 *              Exports utilities for contrast calculation, CSS token parsing,
 *              and validators for colors and focus states.
 *              Главная точка входа пакета контрастности.
 *              Экспортирует утилиты для расчёта контрастности, парсинга CSS-токенов,
 *              а также валидаторы цветов и состояний фокуса.
 */

// packages/contrast/src/index.ts

export { FafContrast } from "./utils/faf-contrast.js";
export { CssTokenParser } from "./utils/css-token-parser.js";
export { FafColorsValidator } from "./validators/faf-colors-validator.js";
export { FafFocusValidator } from "./validators/faf-focus-validator.js";

export type {
  ColorFormat,
  WcagLevel,
  TextSize,
  ContrastResult,
  WcagCheck,
  ValidationCategory,
  ColorPair,
  ContrastIssue,
  ValidationReport,
} from "./types/contrast.js";
