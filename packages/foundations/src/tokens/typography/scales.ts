/**
 * @module Typography Scales
 * @description Modular typography scale (base 16px, ratio 1.25). Used for font-size in the design system.
 *              Модульная типографическая шкала (база: 16px, коэффициент: 1.25).
 *              Используется для font-size в дизайн-системе. Значения в rem (для доступности).
 */

const base = 1; // 1rem = 16px (default in browser) / 1rem = 16px (по умолчанию в браузере)
const ratio = 1.25;

/**
 * Generates an array of values from -2 to 4 (6 values)
 * -2: minimal (x-small)
 * -1: small
 *  0: base
 *  1: large
 *  2: x-large
 *  3: 2x-large
 *  4: 3x-large
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

// Steps: from -2 to 4 (6 values) / Шаги: от -2 до 4 (6 значений)
const steps = [-2, -1, 0, 1, 2, 3, 4];

export const typographyScale = generateScale(base, ratio, steps);

// Types for use / Типы для использования
export type TypographyStep = keyof typeof typographyScale;
export type TypographyValue = (typeof typographyScale)[TypographyStep];

// Additional: mapping steps to semantic names / Дополнительно: маппинг шагов на семантические имена
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
