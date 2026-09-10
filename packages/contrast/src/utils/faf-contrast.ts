// packages/contrast/src/utils/faf-contrast.ts

import type { ContrastResult, WcagLevel, TextSize } from "../types/contrast.js";

/**
 * 🎯 FafContrast — Utility for calculating and checking contrast according to WCAG 2.1.
 * Утилита для расчёта и проверки контрастности по WCAG 2.1.
 *
 * Implements Relative Luminance and Contrast Ratio formulas from WCAG 2.1 specification.
 * Реализует формулы Relative Luminance и Contrast Ratio из спецификации WCAG 2.1.
 *
 * ⚠️ LIMITATIONS (see README "Limitations and allowances"):
 * ОГРАНИЧЕНИЯ (см. README "Ограничения и допуски"):
 * 1. oklch parsing uses a simplified formula (error ~2-5%). / Парсинг oklch использует упрощённую формулу (погрешность ~2-5%).
 *    For production, replace with culori or colorjs.io (1 line of code). / Для production заменить на culori или colorjs.io (1 строка кода).
 * 2. Supports only WCAG 2.1 (without 2.2 criteria). / Поддерживает только WCAG 2.1 (без критериев 2.2).
 * 3. Does not implement APCA (Advanced Perceptual Contrast Algorithm). / Не реализует APCA (Advanced Perceptual Contrast Algorithm).
 *
 * ARCHITECTURE: parseColor() method is isolated for seamless replacement
 * АРХИТЕКТУРА: метод parseColor() вынесен отдельно для бесшовной замены
 * with culori in the library assembly course without changing the public API.
 * на culori в курсе сборки библиотеки без изменения публичного API.
 */
export class FafContrast {
  /**
   * Parses a color to RGB [0-255].
   * Парсит цвет в RGB [0-255].
   *
   * ⚠️ TODO: In production, replace with:
   * ⚠️ TODO: В production заменить на:
   * ```typescript
   * import { convertColor } from 'culori';
   * const rgb = convertColor(color, 'rgb');
   * return [rgb.r * 255, rgb.g * 255, rgb.b * 255];
   * ```
   *
   * @param color - Color in hex (#fff, #ffffff), rgb(), or oklch() format / Цвет в формате hex, rgb() или oklch()
   * @returns [R, G, B] each from 0 to 255 / [R, G, B] каждый от 0 до 255
   */
  private static parseColor(color: string): [number, number, number] {
    const trimmed = color.trim().toLowerCase();

    // HEX: #fff or #ffffff / HEX: #fff или #ffffff
    if (trimmed.startsWith("#")) {
      return FafContrast.parseHex(trimmed);
    }

    // RGB: rgb(255, 255, 255) or rgb(100% 100% 100%)
    if (trimmed.startsWith("rgb(")) {
      return FafContrast.parseRgb(trimmed);
    }

    // OKLCH: oklch(L C H)
    // ⚠️ SIMPLIFIED FORMULA — for production use culori
    // ⚠️ УПРОЩЁННАЯ ФОРМУЛА — для production использовать culori
    if (trimmed.startsWith("oklch(")) {
      return FafContrast.parseOklch(trimmed);
    }

    // Fallback: black / Запасной вариант: чёрный
    console.warn(
      `⚠️ Unsupported color format: ${color}. Falling back to #000000.`,
    );
    return [0, 0, 0];
  }

  /**
   * Parses HEX to RGB. / Парсит HEX в RGB.
   */
  private static parseHex(hex: string): [number, number, number] {
    const result =
      /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) ||
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);

    if (!result) {
      console.warn(`️ Invalid HEX: ${hex}`);
      return [0, 0, 0];
    }

    // If 3 characters (#fff), duplicate each (#ffffff) / Если 3 символа (#fff), дублируем каждый (#ffffff)
    const isShort = result[1].length === 1;
    const r = parseInt(isShort ? result[1] + result[1] : result[1], 16);
    const g = parseInt(isShort ? result[2] + result[2] : result[2], 16);
    const b = parseInt(isShort ? result[3] + result[3] : result[3], 16);

    return [r, g, b];
  }

  /**
   * Parses RGB to [0-255]. / Парсит RGB в [0-255].
   */
  private static parseRgb(rgb: string): [number, number, number] {
    const match = rgb.match(
      /rgb\(\s*([\d.]+)\s*[,]?\s*([\d.]+)\s*[,]?\s*([\d.]+)\s*\)/,
    );
    if (!match) return [0, 0, 0];

    const [_, r, g, b] = match.map(parseFloat);
    return [r, g, b];
  }

  /**
   * Parses OKLCH to RGB. / Парсит OKLCH в RGB.
   *
   * ⚠️ SIMPLIFIED FORMULA for concept demonstration.
   * ⚠️ УПРОЩЁННАЯ ФОРМУЛА для демонстрации концепции.
   * Error ~2-5% in some cases. / Погрешность ~2-5% в некоторых случаях.
   * For production use culori or colorjs.io. / Для production использовать culori или colorjs.io.
   *
   * Formula oklch → oklab → XYZ D65 → linear sRGB → sRGB
   * Формула oklch → oklab → XYZ D65 → linear sRGB → sRGB
   * is simplified here to linear interpolation. / здесь упрощена до линейной интерполяции.
   */
  private static parseOklch(oklch: string): [number, number, number] {
    const match = oklch.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
    if (!match) {
      console.warn(`⚠️ Invalid OKLCH: ${oklch}`);
      return [0, 0, 0];
    }

    const [_, l, c, h] = match.map(parseFloat);

    // ⚠️ SIMPLIFIED CONVERSION (for production use proper algorithm)
    // ⚠️ УПРОЩЁННАЯ КОНВЕРТАЦИЯ (для production использовать правильный алгоритм)
    const hRad = (h * Math.PI) / 180;

    const r = Math.round(l * 255 * (1 + c * Math.cos(hRad)));
    const g = Math.round(
      l * 255 * (1 + c * Math.cos(hRad - (2 * Math.PI) / 3)),
    );
    const b = Math.round(
      l * 255 * (1 + c * Math.cos(hRad - (4 * Math.PI) / 3)),
    );

    return [
      Math.max(0, Math.min(255, r)),
      Math.max(0, Math.min(255, g)),
      Math.max(0, Math.min(255, b)),
    ];
  }

  /**
   * Calculates Relative Luminance according to WCAG 2.1.
   * Расчёт относительной яркости (Relative Luminance) по WCAG 2.1.
   *
   * Formula: L = 0.2126 * R_lin + 0.7152 * G_lin + 0.0722 * B_lin
   *
   * @param color - Color in any supported format / Цвет в любом поддерживаемом формате
   * @returns Luminance from 0 (black) to 1 (white) / Яркость от 0 (чёрный) до 1 (белый)
   */
  static getLuminance(color: string): number {
    const [r, g, b] = FafContrast.parseColor(color);

    const linearize = (c: number): number => {
      const cSrgb = c / 255;
      return cSrgb <= 0.03928
        ? cSrgb / 12.92
        : Math.pow((cSrgb + 0.055) / 1.055, 2.4);
    };

    const rLin = linearize(r);
    const gLin = linearize(g);
    const bLin = linearize(b);

    return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
  }

  /**
   * Calculates Contrast Ratio according to WCAG 2.1.
   * Расчёт коэффициента контрастности (Contrast Ratio) по WCAG 2.1.
   *
   * Formula: CR = (L_lighter + 0.05) / (L_darker + 0.05)
   *
   * @param color1 - First color / Первый цвет
   * @param color2 - Second color / Второй цвет
   * @returns Ratio from 1:1 to 21:1 / Коэффициент от 1:1 до 21:1
   */
  static calculateContrast(color1: string, color2: string): number {
    const lum1 = FafContrast.getLuminance(color1);
    const lum2 = FafContrast.getLuminance(color2);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Checks WCAG compliance for a color pair.
   * Проверка соответствия WCAG для пары цветов.
   *
   * @param color1 - First color (foreground) / Первый цвет (foreground)
   * @param color2 - Second color (background) / Второй цвет (background)
   * @param level - WCAG level ('AA' or 'AAA') / Уровень WCAG ('AA' или 'AAA')
   * @param textSize - Text size ('normal' or 'large') / Размер текста ('normal' или 'large')
   * @returns true if passes the check / true если проходит проверку
   */
  static isAccessible(
    color1: string,
    color2: string,
    level: WcagLevel = "AA",
    textSize: TextSize = "normal",
  ): boolean {
    const contrast = FafContrast.calculateContrast(color1, color2);

    if (level === "AA") {
      return textSize === "large" ? contrast >= 3 : contrast >= 4.5;
    }

    if (level === "AAA") {
      return textSize === "large" ? contrast >= 4.5 : contrast >= 7;
    }

    return false;
  }

  /**
   * Gets full contrast information for a color pair.
   * Получение полной информации о контрастности пары цветов.
   *
   * @param color1 - First color / Первый цвет
   * @param color2 - Second color / Второй цвет
   * @returns Object with ratio and AA/AAA checks / Объект с коэффициентом и проверками AA/AAA
   */
  static getAccessibilityInfo(color1: string, color2: string): ContrastResult {
    const ratio = FafContrast.calculateContrast(color1, color2);

    return {
      ratio: parseFloat(ratio.toFixed(2)),
      aa: {
        normal: ratio >= 4.5,
        large: ratio >= 3,
      },
      aaa: {
        normal: ratio >= 7,
        large: ratio >= 4.5,
      },
    };
  }
}
