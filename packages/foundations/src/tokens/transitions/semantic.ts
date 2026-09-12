/**
 * @module Semantic Transitions
 * @description Semantic transition tokens for common UI interactions.
 *              Семантические токены переходов для распространенных UI-взаимодействий.
 */

import { durations, easings } from "./transitions";

/**
 * Semantic transition tokens
 * Семантические токены переходов
 */
export const semanticTransitions = {
  /** 250ms ease-out — стандартные (hover, focus) / default (hover, focus) */
  default: `${durations.base} ${easings.easeOut}`,

  /** 150ms ease-out — быстрые (смена цвета, фона) / fast (color, background) */
  color: `${durations.fast} ${easings.easeOut}`,

  /** 350ms ease-in-out — медленные (transform, modal, drawer) / slow (transform, modal, drawer) */
  transform: `${durations.slow} ${easings.easeInOut}`,
} as const;

export type SemanticTransitionKey = keyof typeof semanticTransitions;
