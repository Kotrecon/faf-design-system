// scripts/generate-zindex-tokens.mjs
import { writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packagePath = resolve(__dirname, "../packages/z-index");

if (!existsSync(packagePath)) {
  console.error('❌ Ошибка: Пакет "packages/z-index" не найден.');
  process.exit(1);
}

const tokensPath = `file://${join(packagePath, "src/tokens/zindex.ts")}`;
let zIndexTokens;

try {
  const module = await import(tokensPath);
  zIndexTokens = module.zIndexTokens;
} catch (error) {
  console.error("❌ Ошибка импорта токенов");
  process.exit(1);
}

const outputPath = join(packagePath, "src/styles/tokens.generated.css");
let css =
  "/* ⚠️ ЭТОТ ФАЙЛ ГЕНЕРИРУЕТСЯ АВТОМАТИЧЕСКИ. НЕ РЕДАКТИРУЙТЕ ВРУЧНУЮ! */\n\n";

css += ":root {\n";
for (const [key, value] of Object.entries(zIndexTokens)) {
  const cssVarName = `--faf-z-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
  css += `  ${cssVarName}: ${value};\n`;
}
css += "}\n";

writeFileSync(outputPath, css);
console.log("✅ Z-index токены успешно сгенерированы в:", outputPath);
