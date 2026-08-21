// src/tokens/typography/fluid.ts

/**
 * Генератор fluid-значения для CSS clamp()
 * @param min - минимальный размер в rem (число)
 * @param preferred - строка с предпочтительным значением, например "0.9rem + 0.33vw"
 * @param max - максимальный размер в rem (число)
 * @returns Строку для CSS функции clamp()
 */
export function fluid(min: number, preferred: string, max: number): string {
  return `clamp(${min}rem, ${preferred}, ${max}rem)`;
}

/**
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
