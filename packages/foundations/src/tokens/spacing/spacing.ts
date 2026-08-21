// packages/foundations/src/tokens/spacing/index.ts

/**
 * Система отступов (spacing scale)
 * База: 4px
 *
 * Используется для margin, padding, gap и других отступов.
 * Значения экспортируются как:
 * - CSS-переменные (через :root)
 * - JavaScript-объект для использования в коде
 */

export const spacing = {
  /** 0px — нет отступа */
  0: "0px",
  /** 4px — минимальный отступ */
  1: "0.25rem",
  /** 8px — маленький отступ */
  2: "0.5rem",
  /** 12px — средний отступ */
  3: "0.75rem",
  /** 16px — базовый отступ */
  4: "1rem",
  /** 20px — увеличенный отступ */
  5: "1.25rem",
  /** 24px — большой отступ */
  6: "1.5rem",
  /** 32px — двойной отступ */
  8: "2rem",
  /** 40px — крупный отступ */
  10: "2.5rem",
  /** 48px — очень крупный */
  12: "3rem",
  /** 64px — максимальный отступ */
  16: "4rem",
} as const;

// Тип для использования в TypeScript
export type SpacingKey = keyof typeof spacing;
export type SpacingValue = (typeof spacing)[SpacingKey];
