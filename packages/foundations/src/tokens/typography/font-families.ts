/**
 * @module Font Families
 * @description Font families with custom + system fallbacks.
 *              Семейства шрифтов с кастомными + системными fallback.
 */

/**
 * Font families with custom + system fallbacks
 * Inter — main, Fira Code — monospace
 * Семейства шрифтов с кастомными + системными fallback
 * Inter — основной, Fira Code — моноширинный
 */
export const fontFamilies = {
  /** Main font: Inter, with fallback to system sans-serif / Основной шрифт: Inter, с fallback на системный sans-serif */
  sans: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

  /** Monospace: Fira Code, with fallback to system monospace / Моноширинный: Fira Code, с fallback на системный monospace */
  mono: '"Fira Code", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
} as const;

export type FontFamilyKey = keyof typeof fontFamilies;
