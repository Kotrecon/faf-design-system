/**
 * @module Semantic Spacing
 * @description Semantic spacing tokens. Isolates components from direct knowledge of the primitive grid.
 *              Семантические отступы. Изолирует компоненты от прямых знаний о примитивной сетке.
 */

import { spacing } from "./spacing";

export const semanticSpacing = {
  // Components (Atoms) / Компоненты (Atoms)
  buttonPaddingX: spacing[4], // 1rem (16px)
  buttonPaddingY: spacing[2], // 0.5rem (8px)
  buttonGap: spacing[2], // 0.5rem (8px)
  inputPaddingX: spacing[3], // 0.75rem (12px)
  inputPaddingY: spacing[2], // 0.5rem (8px)

  // Surfaces / Поверхности (Surfaces)
  cardPadding: spacing[6], // 1.5rem (24px)
  modalPadding: spacing[8], // 2rem (32px)
  tooltipPadding: spacing[2], // 0.5rem (8px)
  drawerPadding: spacing[6], // 1.5rem (24px)
  toastPadding: spacing[4], // 1rem (16px)
  alertPadding: spacing[4], // 1rem (16px)

  // Layout & Data / Макет и данные (Layout & Data)
  sectionGap: spacing[12], // 3rem (48px)
  containerPadding: spacing[4], // 1rem (16px)
  gridGap: spacing[4], // 1rem (16px)
  sidebarGap: spacing[4], // 1rem (16px)
  tableCellPadding: spacing[3], // 0.75rem (12px)
} as const;

export type SemanticSpacingKey = keyof typeof semanticSpacing;
