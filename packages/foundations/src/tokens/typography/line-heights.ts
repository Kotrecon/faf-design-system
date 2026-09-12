/**
 * @module Line Heights
 * @description Line heights used to control text readability.
 *              Межстрочные интервалы, используемые для управления читаемостью текста.
 */

/**
 * Line heights
 * Used to control text readability
 * Межстрочные интервалы
 * Используются для управления читаемостью текста
 */
export const lineHeights = {
  /** For headings — tight / Для заголовков — плотно */
  tight: 1.25,
  /** For main body text — comfortable / Для основного текста — комфортно */
  normal: 1.5,
  /** For long paragraphs — relaxed / Для длинных абзацев — свободно */
  relaxed: 1.75,
} as const;

export type LineHeightKey = keyof typeof lineHeights;
