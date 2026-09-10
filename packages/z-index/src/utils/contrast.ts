// packages/z-index/src/utils/contrast.ts

/**
 * Re-exporting the real contrast utility from @faf/contrast.
 * Реэкспорт реальной утилиты контрастности из @faf/contrast.
 *
 * This ensures that all z-index patterns (like FafToast) use the
 * same validated, WCAG-compliant contrast checking logic.
 * Это гарантирует, что все паттерны z-index (например, FafToast)
 * используют единую, проверенную логику проверки контрастности по WCAG.
 *
 * ⚠️ LIMITATION: oklch parsing uses a simplified formula.
 * ⚠️ ОГРАНИЧЕНИЕ: парсинг oklch использует упрощённую формулу.
 * See @faf/contrast documentation for production recommendations (culori/colorjs.io).
 * См. документацию @faf/contrast для рекомендаций по production (culori/colorjs.io).
 */
export { FafContrast } from "@faf/contrast";

export type {
  ContrastResult,
  WcagLevel,
  TextSize,
  WcagCheck,
} from "@faf/contrast";
