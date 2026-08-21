// src/tokens/spacing/semantic.ts
import { spacing } from "./index";

/**
 * Семантические отступы.
 * Изолирует компоненты от прямых знаний о примитивной сетке.
 */
export const semanticSpacing = {
  // Компоненты (Atoms)
  buttonPaddingX: spacing[4], // 1rem (16px)
  buttonPaddingY: spacing[2], // 0.5rem (8px)
  buttonGap: spacing[2], // 0.5rem (8px)
  inputPaddingX: spacing[3], // 0.75rem (12px)
  inputPaddingY: spacing[2], // 0.5rem (8px)

  // Поверхности (Surfaces)
  cardPadding: spacing[6], // 1.5rem (24px)
  modalPadding: spacing[8], // 2rem (32px)
  tooltipPadding: spacing[2], // 0.5rem (8px)

  // Макет (Layout)
  sectionGap: spacing[12], // 3rem (48px)
  containerPadding: spacing[4], // 1rem (16px)
  gridGap: spacing[4], // 1rem (16px)
} as const;

export type SemanticSpacingKey = keyof typeof semanticSpacing;
