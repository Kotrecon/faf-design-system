/**
 * @module Generate Z-Index Tokens
 * @description Script to generate CSS variables from TypeScript z-index tokens.
 *              Скрипт для генерации CSS-переменных из TypeScript токенов z-index.
 */

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packagePath = resolve(__dirname, "../packages/z-index");

if (!existsSync(packagePath)) {
  console.error(`❌ Error: Package "packages/z-index" not found.`);
  process.exit(1);
}

const tokensPath = `file://${join(packagePath, "src/tokens/zindex.ts")}`;

// Мягкий фолбэк: по умолчанию пустой объект
// Soft fallback: empty object by default
let zIndexTokens = {};

try {
  const module = await import(tokensPath);
  if (
    module &&
    module.zIndexTokens &&
    typeof module.zIndexTokens === "object"
  ) {
    zIndexTokens = module.zIndexTokens;
  } else {
    console.warn("⚠️ Warning: zIndexTokens export is missing or invalid.");
  }
} catch (error) {
  console.warn(`⚠️ Warning: Error importing z-index tokens: ${error.message}`);
}

const outputDir = join(packagePath, "src/styles");
const outputPath = join(outputDir, "tokens.generated.css");

// Создаем директорию, если она не существует (защита от падения)
// Create directory if it does not exist (protection against crashes)
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Двуязычное предупреждение в файле (это комментарий, а не лог консоли)
// Bilingual warning in file (this is a comment, not a console log)
let css = "/* ⚠️ THIS FILE IS AUTO-GENERATED. DO NOT EDIT MANUALLY! */\n";
css +=
  "/* ⚠️ ЭТОТ ФАЙЛ ГЕНЕРИРУЕТСЯ АВТОМАТИЧЕСКИ. НЕ РЕДАКТИРУЙТЕ ВРУЧНУЮ! */\n\n";

css += ":root {\n";

for (const [key, value] of Object.entries(zIndexTokens)) {
  // Преобразуем camelCase в kebab-case и добавляем префикс --faf-zindex-
  // Convert camelCase to kebab-case and add --faf-zindex- prefix
  const cssVarName = `--faf-zindex-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
  css += `  ${cssVarName}: ${value};\n`;
}

css += "}\n";

writeFileSync(outputPath, css);
console.log(`✅ Z-index tokens successfully generated at: ${outputPath}`);
