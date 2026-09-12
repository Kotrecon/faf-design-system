/**
 * @module Semantic Opacity
 * @description Semantic opacity tokens. Isolates components from direct knowledge of the primitive grid.
 *              Семантическая прозрачность. Изолирует компоненты от прямых знаний о примитивной сетке.
 */

import { opacity } from "./opacity";

/**
 * Semantic opacity tokens
 * Семантические токены прозрачности
 */
export const semanticOpacity = {
  /** 0.5 — неактивные элементы / disabled elements */
  disabled: opacity[50],

  /** 0.75 — затемнение фона (оверлей) / background dimming (overlay) */
  overlay: opacity[75],

  /** 0.25 — плейсхолдеры / placeholders */
  placeholder: opacity[25],
} as const;

export type SemanticOpacityKey = keyof typeof semanticOpacity;
