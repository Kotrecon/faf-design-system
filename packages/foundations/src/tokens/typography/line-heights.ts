// src/tokens/typography/line-heights.ts

/**
 * Межстрочные интервалы
 * Используются для управления читаемостью текста
 */
export const lineHeights = {
  /** Для заголовков — плотно */
  tight: 1.25,
  /** Для основного текста — комфортно */
  normal: 1.5,
  /** Для длинных абзацев — свободно */
  relaxed: 1.75,
} as const;

export type LineHeightKey = keyof typeof lineHeights;
