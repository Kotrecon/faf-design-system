// packages/foundations/src/tokens/colors/light.ts

/**
 * Светлая тема (семантические цвета)
 * Ссылается на primitives и brand.
 */

import { brand, accent } from "./brand.ts";
import { primitives } from "./primitives.ts";

export const light = {
  primary: primitives.blue[600],
  primaryHover: primitives.blue[700],
  secondary: primitives.gray[600],
  secondaryHover: primitives.gray[700],
  success: primitives.green[500],
  error: primitives.red[500],
  warning: primitives.yellow[500],
  info: primitives.blue[500],
  accent: primitives.purple[500],
  text: primitives.gray[900],
  textMuted: primitives.gray[600],
  background: primitives.gray[50],
  surface: "oklch(1.00 0 0)",
  border: primitives.gray[200],
  // Брендовые цвета в семантике (можно переопределить в продукте)
  brandFirefly: brand.firefly,
  brandAi: brand.ai,
  brandFlow: brand.flow,
  accentHot: accent.hot,
  accentElectric: accent.electric,
  accentLime: accent.lime,
} as const;

export type LightSemanticKey = keyof typeof light;
