/**
 * @module Primitive Shadows
 * @description Base shadow values (primitives). Used as the foundation for semantic shadow tokens.
 *              Базовые значения теней (примитивы). Используются как основа для семантических токенов теней.
 */

export const shadows = {
  none: "none",
  sm: "0 1px 2px rgba(0,0,0,0.05)",
  md: "0 4px 6px rgba(0,0,0,0.1)",
  lg: "0 10px 15px rgba(0,0,0,0.1)",
  xl: "0 20px 25px rgba(0,0,0,0.1)",
  xxl: "0 25px 50px rgba(0,0,0,0.15)",
} as const;

export type ShadowKey = keyof typeof shadows;
export type ShadowValue = (typeof shadows)[ShadowKey];
