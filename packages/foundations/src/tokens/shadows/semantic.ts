/**
 * @module Semantic Shadows
 * @description Semantic shadows. Allows globally changing the interface "depth" by updating the mapping in one place.
 *              Семантические тени. Позволяет глобально менять "глубину" интерфейса, меняя маппинг в одном месте.
 */

import { shadows } from "./shadows";

export const semanticShadows = {
  button: shadows.sm, // Light shadow for interactive elements / Легкая тень для интерактивных элементов
  card: shadows.md, // Medium shadow for content cards / Средняя тень для карточек контента
  dropdown: shadows.lg, // Large shadow for dropdown menus (above content) / Большая тень для выпадающих меню (поверх контента)
  modal: shadows.xl, // Maximum shadow for modal windows (above everything) / Максимальная тень для модальных окон (поверх всего)
  tooltip: shadows.md, // Shadow for tooltips / Тень для тултипов
  drawer: shadows.lg, // Shadow for sidebars/drawers (Level 3) / Тень для боковых панелей (Уровень 3)
  toast: shadows.xl, // Shadow for notifications/toasts (Level 4) / Тень для всплывающих уведомлений (Уровень 4)
  fullscreenOverlay: shadows.xxl, // Shadow for fullscreen overlays / Тень для полноэкранных оверлеев
  none: shadows.none, // Explicit shadow reset (for flat design) / Явный сброс тени (для flat-дизайна)
} as const;

export type SemanticShadowKey = keyof typeof semanticShadows;
