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
 * 1. oklch parsing uses a simplified formula. / Парсинг oklch использует упрощённую формулу.
 * 2. Supports only WCAG 2.1. / Поддерживает только WCAG 2.1.
 * 3. Does not implement APCA. / Не реализует APCA.
 * 4. Alpha channels are not supported. / Альфа-каналы не поддерживаются.
 *
 * ARCHITECTURE: parseColor() is isolated for seamless replacement.
 * АРХИТЕКТУРА: parseColor() изолирован для бесшовной замены.
 */
export class FafContrast {
  /**
   * Parses a color to RGB [0-255].
   * Парсит цвет в RGB [0-255].
   *
   * @param color - Color in hex, rgb(), or oklch() format. / Цвет в формате hex, rgb() или oklch().
   * @returns [R, G, B] each from 0 to 255. / [R, G, B] каждый от 0 до 255.
   */
  private static parseColor(color: string): [number, number, number] {
    const trimmed = color.trim().toLowerCase();

    // HEX: #fff or #ffffff. / HEX: #fff или #ffffff.
    if (trimmed.startsWith("#")) {
      return FafContrast.parseHex(trimmed);
    }

    // RGB: rgb(255, 255, 255), rgb(255 255 255), or rgb(100% 100% 100%).
    // RGB: rgb(255, 255, 255), rgb(255 255 255) или rgb(100% 100% 100%).
    if (trimmed.startsWith("rgb(")) {
      return FafContrast.parseRgb(trimmed);
    }

    // OKLCH: oklch(L C H). / OKLCH: oklch(L C H).
    if (trimmed.startsWith("oklch(")) {
      return FafContrast.parseOklch(trimmed);
    }

    // Fallback: black. / Запасной вариант: чёрный.
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
      console.warn(`⚠️ Invalid HEX: ${hex}`);
      return [0, 0, 0];
    }

    // If 3 characters (#fff), duplicate each character.
    // Если 3 символа (#fff), дублируем каждый символ.
    const isShort = result[1].length === 1;

    const r = parseInt(isShort ? result[1] + result[1] : result[1], 16);
    const g = parseInt(isShort ? result[2] + result[2] : result[2], 16);
    const b = parseInt(isShort ? result[3] + result[3] : result[3], 16);

    return [r, g, b];
  }

  /**
   * Parses RGB to [0-255]. / Парсит RGB в диапазон [0-255].
   *
   * Supported formats: / Поддерживаемые форматы:
   * - rgb(255, 128, 0)
   * - rgb(255 128 0)
   * - rgb(100%, 50%, 0%)
   * - rgb(100% 50% 0%)
   *
   * Alpha channel is not supported. / Альфа-канал не поддерживается.
   */
  private static parseRgb(rgb: string): [number, number, number] {
    const match = rgb.match(
      /^rgb\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)%?)\s*(?:,\s*|\s+)([+-]?(?:\d+(?:\.\d+)?|\.\d+)%?)\s*(?:,\s*|\s+)([+-]?(?:\d+(?:\.\d+)?|\.\d+)%?)\s*\)$/i,
    );

    if (!match) {
      console.warn(`⚠️ Invalid RGB: ${rgb}`);
      return [0, 0, 0];
    }

    const parseComponent = (value: string): number => {
      const isPercentage = value.endsWith("%");

      const numericValue = Number(isPercentage ? value.slice(0, -1) : value);

      if (!Number.isFinite(numericValue)) {
        return 0;
      }

      // Convert percentages to the RGB range [0-255].
      // Конвертируем проценты в диапазон RGB [0-255].
      const valueInRgbRange = isPercentage
        ? (numericValue / 100) * 255
        : numericValue;

      // Clamp values to the valid RGB range.
      // Ограничиваем значения допустимым диапазоном RGB.
      return Math.max(0, Math.min(255, valueInRgbRange));
    };

    return [
      parseComponent(match[1]),
      parseComponent(match[2]),
      parseComponent(match[3]),
    ];
  }

  /**
   * Parses OKLCH to RGB. / Парсит OKLCH в RGB.
   *
   * ⚠️ Simplified formula for concept demonstration.
   * ⚠️ Упрощённая формула для демонстрации концепции.
   */
  private static parseOklch(oklch: string): [number, number, number] {
    const match = oklch.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);

    if (!match) {
      console.warn(`⚠️ Invalid OKLCH: ${oklch}`);
      return [0, 0, 0];
    }

    const l = Number(match[1]);
    const c = Number(match[2]);
    const h = Number(match[3]);

    // Simplified OKLCH to RGB conversion.
    // Упрощённая конвертация OKLCH в RGB.
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
   * Расчитывает относительную яркость по WCAG 2.1.
   *
   * @param color - Color in any supported format. / Цвет в любом поддерживаемом формате.
   * @returns Luminance from 0 to 1. / Яркость от 0 до 1.
   */
  static getLuminance(color: string): number {
    const [r, g, b] = FafContrast.parseColor(color);

    const linearize = (value: number): number => {
      const srgb = value / 255;

      // ⚠️ WCAG 2.1 SPEC: The threshold is strictly 0.03928, not 0.04045.
      // ⚠️ СПЕЦИФИКАЦИЯ WCAG 2.1: Порог строго 0.03928, а не 0.04045.
      return srgb <= 0.03928
        ? srgb / 12.92
        : Math.pow((srgb + 0.055) / 1.055, 2.4);
    };

    const rLinear = linearize(r);
    const gLinear = linearize(g);
    const bLinear = linearize(b);

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }

  /**
   * Calculates Contrast Ratio according to WCAG 2.1.
   * Расчитывает коэффициент контрастности по WCAG 2.1.
   *
   * @param color1 - First color. / Первый цвет.
   * @param color2 - Second color. / Второй цвет.
   * @returns Ratio from 1:1 to 21:1. / Коэффициент от 1:1 до 21:1.
   */
  static calculateContrast(color1: string, color2: string): number {
    const luminance1 = FafContrast.getLuminance(color1);
    const luminance2 = FafContrast.getLuminance(color2);

    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Checks WCAG compliance for a color pair.
   * Проверяет соответствие WCAG для пары цветов.
   *
   * @param color1 - First color, usually foreground. / Первый цвет, обычно foreground.
   * @param color2 - Second color, usually background. / Второй цвет, обычно background.
   * @param level - WCAG level: AA or AAA. / Уровень WCAG: AA или AAA.
   * @param textSize - Text size: normal or large. / Размер текста: normal или large.
   * @returns true if the color pair passes the check. / true, если пара цветов проходит проверку.
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
   * Возвращает полную информацию о контрастности пары цветов.
   *
   * @param color1 - First color, usually foreground. / Первый цвет, обычно foreground.
   * @param color2 - Second color, usually background. / Второй цвет, обычно background.
   * @returns Object with ratio and AA/AAA checks. / Объект с коэффициентом и проверками AA/AAA.
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
