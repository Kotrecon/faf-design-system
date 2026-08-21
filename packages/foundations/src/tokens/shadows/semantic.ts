// src/tokens/shadows/semantic.ts
import { shadows } from "./index";

/**
 * Семантические тени.
 * Позволяет глобально менять "глубину" интерфейса, меняя маппинг в одном месте.
 */
export const semanticShadows = {
  button: shadows.sm, // Легкая тень для интерактивных элементов
  card: shadows.md, // Средняя тень для карточек контента
  dropdown: shadows.lg, // Большая тень для выпадающих меню (поверх контента)
  modal: shadows.xl, // Максимальная тень для модальных окон (поверх всего)
  tooltip: shadows.md, // Тень для тултипов
  none: shadows.none, // Явный сброс тени (для flat-дизайна)
} as const;

export type SemanticShadowKey = keyof typeof semanticShadows;
