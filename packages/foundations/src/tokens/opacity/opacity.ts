/**
 * @module Primitive Opacity
 * @description Base opacity values (primitives). Used as the foundation for semantic opacity tokens.
 *              Базовые значения прозрачности (примитивы). Используются как основа для семантических токенов прозрачности.
 */

/**
 * Opacity values
 * Значения прозрачности
 */
export const opacity = {
  /** 0 — полностью прозрачный / fully transparent */
  0: "0",

  /** 0.25 — легкая прозрачность / light opacity */
  25: "0.25",

  /** 0.5 — средняя (disabled, overlay) / medium (disabled, overlay) */
  50: "0.5",

  /** 0.75 — легкая непрозрачность / light opacity */
  75: "0.75",

  /** 1 — полностью непрозрачный / fully opaque */
  100: "1",
} as const;

export type OpacityKey = keyof typeof opacity;
export type OpacityValue = (typeof opacity)[OpacityKey];
