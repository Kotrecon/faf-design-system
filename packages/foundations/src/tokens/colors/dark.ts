/**
 * @module Dark Theme
 * @description Dark theme (semantic colors). References primitives and brand tokens.
 *              Тёмная тема (семантические цвета). Ссылается на primitives и brand.
 */

import { brand, accent } from "./brand.ts";
import { primitives } from "./primitives.ts";

export const dark = {
  primary: primitives.blue[400],
  primaryHover: primitives.blue[300],
  secondary: primitives.gray[400],
  secondaryHover: primitives.gray[300],
  success: primitives.green[400],
  error: primitives.red[400],
  warning: primitives.yellow[400],
  info: primitives.blue[400],
  accent: primitives.purple[400],
  text: primitives.gray[50],
  textMuted: primitives.gray[400],
  background: primitives.gray[900],
  surface: primitives.gray[800],
  border: primitives.gray[700],

  statusOk: primitives.green[400],
  statusHigh: primitives.orange[400],
  statusMedium: primitives.yellow[400],
  statusDrift: primitives.purple[400],
  statusOffline: primitives.gray[500],

  brandFirefly: brand.firefly,
  brandAi: brand.ai,
  brandFlow: brand.flow,
  accentHot: accent.hot,
  accentElectric: accent.electric,
  accentLime: accent.lime,
} as const;

export type DarkSemanticKey = keyof typeof dark;
