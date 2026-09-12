/**
 * @module Radii
 * @description Border radius tokens for rounded corners.
 *              Токены радиусов скругления.
 */

/**
 * Border radius tokens
 * Токены радиусов скругления
 */
export const radii = {
  /** 0 — без скругления / no rounding */
  none: "0px",

  /** 2px — минимальное (иконки, бейджи) / minimal (badges, icons) */
  xs: "0.125rem",

  /** 4px — маленькое (кнопки, инпуты) / small (buttons, inputs) */
  sm: "0.25rem",

  /** 8px — стандартное (карточки) / medium (cards) */
  md: "0.5rem",

  /** 12px — большое (модалки) / large (modals) */
  lg: "0.75rem",

  /** 16px — максимальное / extra large */
  xl: "1rem",

  /** 16px — двойное максимальное / double extra large */
  xxl: "2rem",

  /** 9999px — полное скругление (pill) / full (pill shape) */
  full: "9999px",
} as const;

export type RadiusKey = keyof typeof radii;
export type RadiusValue = (typeof radii)[RadiusKey];
