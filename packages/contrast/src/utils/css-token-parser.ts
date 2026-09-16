// packages/contrast/src/utils/css-token-parser.ts

/**
 *  CssTokenParser — CSS parser for importing design tokens.
 * Парсер CSS для импорта дизайн-токенов.
 *
 * ⚠️ LIMITATION (see README "Limitations and allowances"):
 * ОГРАНИЧЕНИЕ (см. README "Ограничения и допуски"):
 * Uses regular expressions to extract variables.
 * Использует регулярные выражения для извлечения переменных.
 * Sufficient for prototyping and static file validation.
 * Достаточно для прототипов и валидации статических файлов.
 * For production builds with dynamic themes, consider using PostCSS.
 * Для production-сборок с динамическими темами рекомендуется использовать PostCSS.
 */
export class CssTokenParser {
  /**
   * Parses a CSS string and extracts CSS custom properties.
   * Парсит строку CSS и извлекает CSS custom properties.
   *
   * @param cssContent - CSS file content as a string / Содержимое CSS файла в виде строки
   * @param prefix - Token prefix to extract (default: '--faf-') / Префикс токенов для извлечения (по умолчанию: '--faf-')
   * @returns A dictionary of tokens where key is the variable name and value is its value / Словарь токенов
   */
  parse(cssContent: string, prefix: string = "--faf-"): Record<string, string> {
    const tokens: Record<string, string> = {};

    // Escaping prefix for regex safety / Экранирование префикса для безопасности регулярного выражения
    const escapedPrefix = prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(${escapedPrefix}[\\w-]+)\\s*:\\s*([^;]+);`, "g");
    let match;

    while ((match = regex.exec(cssContent)) !== null) {
      const tokenName = match[1].trim();
      const tokenValue = match[2].trim();
      tokens[tokenName] = tokenValue;
    }

    return tokens;
  }

  /**
   * Asynchronous loading and parsing of a CSS file (Node.js environment).
   * Асинхронная загрузка и парсинг CSS файла (окружение Node.js).
   *
   * @param filePath - Path to the CSS file / Путь к CSS файлу
   * @param prefix - Token prefix to extract (default: '--faf-') / Префикс токенов для извлечения (по умолчанию: '--faf-')
   * @returns A dictionary of tokens / Словарь токенов
   */
  async parseFile(
    filePath: string,
    prefix: string = "--faf-",
  ): Promise<Record<string, string>> {
    try {
      const fs = await import("fs/promises");
      const cssContent = await fs.readFile(filePath, "utf-8");
      return this.parse(cssContent, prefix);
    } catch (error) {
      throw new Error(
        `Failed to read or parse CSS file at "${filePath}". Details: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
