// packages/foundations/src/tokens/colors/brand.ts

/**
 * Брендовые и акцентные цвета
 * Могут переопределяться в каждом продукте.
 */

export const brand = {
  firefly: "oklch(0.70 0.22 80)",
  ai: "oklch(0.65 0.25 280)",
  flow: "oklch(0.60 0.20 200)",
} as const;

export const accent = {
  hot: "oklch(0.65 0.28 30)",
  electric: "oklch(0.70 0.25 240)",
  lime: "oklch(0.5592 0.22 130)",
} as const;

export type BrandName = keyof typeof brand;
export type AccentName = keyof typeof accent;
