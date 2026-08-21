// packages/foundations/src/tokens/typography/scales.ts

/**
 * Модульная типографическая шкала (modular scale)
 * База: 16px (1rem)
 * Коэффициент: 1.25 (major third)
 *
 * Используется для font-size в дизайн-системе.
 * Значения в rem (для доступности).
 */

const base = 1; // 1rem = 16px (по умолчанию в браузере)
const ratio = 1.25;

/**
 * Генерирует массив значений от -2 до 4 (6 значений)
 * -2: минимальный (x-small)
 * -1: small
 *  0: base (базовый)
 *  1: large
 *  2: x-large
 *  3: 2x-large
 *  4: 3x-large
 */
function generateScale(
  base: number,
  ratio: number,
  steps: number[],
): Record<number, string> {
  const scale: Record<number, string> = {};
  for (const step of steps) {
    const value = base * Math.pow(ratio, step);
    scale[step] = `${value}rem`;
  }
  return scale;
}

// Шаги: от -2 до 4 (6 значений)
const steps = [-2, -1, 0, 1, 2, 3, 4];

export const typographyScale = generateScale(base, ratio, steps);

// Типы для использования
export type TypographyStep = keyof typeof typographyScale;
export type TypographyValue = (typeof typographyScale)[TypographyStep];

// Дополнительно: маппинг шагов на семантические имена
export const typographySteps = {
  xs: -2,
  sm: -1,
  base: 0,
  lg: 1,
  xl: 2,
  xxl: 3,
  xxxl: 4,
} as const;

export type TypographyStepName = keyof typeof typographySteps;
