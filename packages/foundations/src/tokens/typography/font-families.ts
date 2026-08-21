// src/tokens/typography/font-families.ts

/**
 * Семейства шрифтов с кастомными + системными fallback
 * Inter — основной, Fira Code — моноширинный
 */
export const fontFamilies = {
  /** Основной шрифт: Inter, с fallback на системный sans-serif */
  sans: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

  /** Моноширинный: Fira Code, с fallback на системный monospace */
  mono: '"Fira Code", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
} as const;

export type FontFamilyKey = keyof typeof fontFamilies;
