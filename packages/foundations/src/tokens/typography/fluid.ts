/**
 * @module Fluid Typography
 * @description Generator and presets for CSS clamp() fluid typography values.
 *              Генератор и пресеты fluid-значений типографики для CSS clamp().
 */

/**
 * Generates a fluid value for CSS clamp()
 * Генерирует fluid-значение для CSS clamp()
 * @param min - Minimum size in rem (number) / Минимальный размер в rem (число)
 * @param preferred - Preferred value string, e.g., "0.9rem + 0.33vw" / Строка с предпочтительным значением, например "0.9rem + 0.33vw"
 * @param max - Maximum size in rem (number) / Максимальный размер в rem (число)
 * @returns String for CSS clamp() function / Строку для CSS функции clamp()
 */
export function fluid(min: number, preferred: string, max: number): string {
  return `clamp(${min}rem, ${preferred}, ${max}rem)`;
}

/**
 * Ready-made fluid sizes based on modular scale (ratio 1.25)
 * Values taken from the course example, adapted for our system
 * Готовые fluid-размеры на основе modular scale (ratio 1.25)
 * Значения взяты из примера курса, адаптированы под нашу систему
 */
export const fluidSizes = {
  sm: fluid(0.875, "0.8rem + 0.25vw", 1),
  base: fluid(1, "0.9rem + 0.33vw", 1.125),
  lg: fluid(1.125, "1rem + 0.42vw", 1.25),
  xl: fluid(1.25, "1.1rem + 0.5vw", 1.5),
  "2xl": fluid(1.5, "1.3rem + 0.67vw", 2),
  "3xl": fluid(1.875, "1.5rem + 1.25vw", 3),
} as const;

export type FluidSizeKey = keyof typeof fluidSizes;
