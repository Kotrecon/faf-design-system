// packages/z-index/src/utils/contrast.ts

/**
 * Заглушка для Faf-Contrast.
 * В реальном проекте это будет отдельный пакет @faf/contrast.
 *
 * Проверяет контрастность между foreground и background цветами.
 * Возвращает true, если контраст соответствует WCAG AA (4.5:1 для текста).
 */

/**
 * Вычисляет относительную яркость цвета (по формуле WCAG).
 * Упрощённая версия — в реальном Faf-Contrast будет полный алгоритм.
 */
function getRelativeLuminance(hex: string): number {
  // Убираем # если есть
  const cleanHex = hex.replace("#", "");

  // Парсим RGB
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  // Применяем гамма-коррекцию
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Вычисляет коэффициент контрастности между двумя цветами.
 * Возвращает число от 1 до 21.
 */
export function getContrastRatio(
  foreground: string,
  background: string,
): number {
  const lum1 = getRelativeLuminance(foreground);
  const lum2 = getRelativeLuminance(background);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Проверяет, соответствует ли контрастность стандарту WCAG AA.
 * Для обычного текста требуется минимум 4.5:1.
 */
export function isAccessible(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 4.5;
}

/**
 * Выбирает цвет текста (чёрный или белый) для обеспечения контрастности на заданном фоне.
 */
export function getContrastColor(backgroundHex: string): string {
  const whiteContrast = getContrastRatio("#ffffff", backgroundHex);
  const blackContrast = getContrastRatio("#000000", backgroundHex);

  return whiteContrast > blackContrast ? "#ffffff" : "#000000";
}
