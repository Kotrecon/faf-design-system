/**
 * @module Spacing Scale
 * @description Base spacing system (4px base). Used for margin, padding, gap, and other spacings.
 *              Система отступов (spacing scale). База: 4px.
 *              Используется для margin, padding, gap и других отступов.
 */

export const spacing = {
  /** 0px — no spacing / 0px — нет отступа */
  0: "0px",
  /** 4px — minimal spacing / 4px — минимальный отступ */
  1: "0.25rem",
  /** 8px — small spacing / 8px — маленький отступ */
  2: "0.5rem",
  /** 12px — medium spacing / 12px — средний отступ */
  3: "0.75rem",
  /** 16px — base spacing / 16px — базовый отступ */
  4: "1rem",
  /** 20px — increased spacing / 20px — увеличенный отступ */
  5: "1.25rem",
  /** 24px — large spacing / 24px — большой отступ */
  6: "1.5rem",
  /** 32px — double spacing / 32px — двойной отступ */
  8: "2rem",
  /** 40px — extra large spacing / 40px — крупный отступ */
  10: "2.5rem",
  /** 48px — very large spacing / 48px — очень крупный */
  12: "3rem",
  /** 64px — maximum spacing / 64px — максимальный отступ */
  16: "4rem",
} as const;

// Type for use in TypeScript / Тип для использования в TypeScript
export type SpacingKey = keyof typeof spacing;
export type SpacingValue = (typeof spacing)[SpacingKey];
