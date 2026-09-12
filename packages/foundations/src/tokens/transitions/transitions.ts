/**
 * @module Primitive Transitions
 * @description Base transition durations and easing functions (primitives).
 *              Базовые значения длительности и функций плавности переходов (примитивы).
 */

/**
 * Transition durations
 * Длительность переходов
 */
export const durations = {
  /** 150ms — быстрые (hover, color) / fast (hover, color) */
  fast: "150ms",

  /** 250ms — стандартные (default) / base (default) */
  base: "250ms",

  /** 350ms — медленные (transform, modal) / slow (transform, modal) */
  slow: "350ms",
} as const;

/**
 * Easing functions
 * Функции плавности
 */
export const easings = {
  /** cubic-bezier(0, 0, 0.2, 1) — для появления / for appearing */
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",

  /** cubic-bezier(0.4, 0, 0.2, 1) — универсальные / universal */
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export type DurationKey = keyof typeof durations;
export type EasingKey = keyof typeof easings;
