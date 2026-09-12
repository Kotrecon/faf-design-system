/**
 * @module Light Theme
 * @description Light theme (semantic colors). References primitives and brand tokens.
 *              Светлая тема (семантические цвета). Ссылается на primitives и brand.
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
  surface: primitives.gray[0],
  border: primitives.gray[200],

  statusOk: primitives.green[500],
  statusHigh: primitives.orange[500],
  statusMedium: primitives.yellow[500],
  statusDrift: primitives.purple[500],
  statusOffline: primitives.gray[400],

  // Brand colors in semantics (can be overridden in a specific product)
  // Брендовые цвета в семантике (можно переопределить в продукте)
  brandFirefly: brand.firefly,
  brandAi: brand.ai,
  brandFlow: brand.flow,
  accentHot: accent.hot,
  accentElectric: accent.electric,
  accentLime: accent.lime,
} as const;

export type LightSemanticKey = keyof typeof light;
