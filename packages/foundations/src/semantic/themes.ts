// src/semantic/themes.ts

import { light } from "../tokens/colors/light";
import { dark } from "../tokens/colors/dark";

export interface SemanticTheme {
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  accent: string;

  text: string;
  textMuted: string;
  background: string;
  surface: string;
  border: string;

  brandFirefly: string;
  brandAi: string;
  brandFlow: string;

  accentHot: string;
  accentElectric: string;
  accentLime: string;
}

// Экспортируем темы напрямую
export { light, dark };

// Агрегированный объект для итерации
export const themes = {
  light: light satisfies SemanticTheme,
  dark: dark satisfies SemanticTheme,
} as const;

export type ThemeName = keyof typeof themes;
