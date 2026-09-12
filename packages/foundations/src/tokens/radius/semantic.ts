/**
 * @module Semantic Radius
 * @description Semantic radius tokens. Isolates components from direct knowledge of the primitive grid.
 *              Семантические скругления. Изолирует компоненты от прямых знаний о примитивной сетке.
 */

import { radii } from "./radii";

/**
 * Semantic radius tokens
 * Семантические токены скруглений
 */
export const semanticRadius = {
  /** 0px — без скругления (таблицы, разделители) / no rounding (tables, dividers) */
  none: radii.none,

  /** 2px — минимальное (иконки, маленькие бейджи) / minimal (icons, small badges) */
  icon: radii.xs,

  /** 4px — маленькое (кнопки, инпуты) / small (buttons, inputs) */
  button: radii.sm,

  /** 4px — инпуты / inputs */
  input: radii.sm,

  /** 8px — стандартное (карточки, панели) / medium (cards, panels) */
  card: radii.md,

  /** 12px — большое (модалки, дроверы) / large (modals, drawers) */
  modal: radii.lg,

  /** 16px — максимальное (большие контейнеры) / extra large (large containers) */
  container: radii.xl,

  /** 32px — двойное максимальное (hero-секции) / double extra large (hero sections) */
  hero: radii.xxl,

  /** 9999px — полное скругление (pill-бейджи) / full (pill badges) */
  badge: radii.full,
} as const;

export type SemanticRadiusKey = keyof typeof semanticRadius;
