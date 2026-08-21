// scripts/generate-tokens.mjs
import { writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const packageName = process.argv[2] || "foundations";

const packagePath = resolve(__dirname, `../packages/${packageName}`);
const srcPath = join(packagePath, "src");

if (!existsSync(packagePath)) {
  console.error(`❌ Ошибка: Пакет "packages/${packageName}" не найден.`);
  process.exit(1);
}

// Динамический импорт TS-файлов
const themesPath = `file://${join(srcPath, "semantic/themes.ts")}`;
const primitivesPath = `file://${join(srcPath, "tokens/colors/primitives.ts")}`;
const spacingPath = `file://${join(srcPath, "tokens/spacing/index.ts")}`;
const shadowsPath = `file://${join(srcPath, "tokens/shadows/index.ts")}`;
const semanticSpacingPath = `file://${join(srcPath, "tokens/spacing/semantic.ts")}`;
const semanticShadowsPath = `file://${join(srcPath, "tokens/shadows/semantic.ts")}`;

let themes, primitives, spacing, shadows, semanticSpacing, semanticShadows;

try {
  const themesModule = await import(themesPath);
  themes = themesModule.themes;

  try {
    const primitivesModule = await import(primitivesPath);
    primitives = primitivesModule.primitives;
  } catch (e) {
    primitives = {};
  }

  try {
    const spacingModule = await import(spacingPath);
    spacing = spacingModule.spacing;
  } catch (e) {
    spacing = {};
  }

  try {
    const shadowsModule = await import(shadowsPath);
    shadows = shadowsModule.shadows;
  } catch (e) {
    shadows = {};
  }

  try {
    const semanticSpacingModule = await import(semanticSpacingPath);
    semanticSpacing = semanticSpacingModule.semanticSpacing;
  } catch (e) {
    semanticSpacing = {};
  }

  try {
    const semanticShadowsModule = await import(semanticShadowsPath);
    semanticShadows = semanticShadowsModule.semanticShadows;
  } catch (e) {
    semanticShadows = {};
  }
} catch (error) {
  console.error(`❌ Ошибка импорта токенов из пакета "${packageName}".`);
  console.error("Убедитесь, что файлы semantic/themes.ts и другие существуют.");
  process.exit(1);
}

const outputPath = join(srcPath, "styles/tokens.generated.css");
let css =
  "/* ⚠️ ЭТОТ ФАЙЛ ГЕНЕРИРУЕТСЯ АВТОМАТИЧЕСКИ. НЕ РЕДАКТИРУЙТЕ ВРУЧНУЮ! */\n\n";

// 1. ПРИМИТИВНЫЕ ЦВЕТА (Global Tokens)
css += ":root {\n";
if (primitives) {
  for (const [colorName, scales] of Object.entries(primitives)) {
    for (const [scale, value] of Object.entries(scales)) {
      css += `  --faf-color-${colorName}-${scale}: ${value};\n`;
    }
  }
}

// 2. ПРИМИТИВНЫЕ ОТСТУПЫ
if (spacing) {
  for (const [key, value] of Object.entries(spacing)) {
    css += `  --faf-spacing-${key}: ${value};\n`;
  }
}

// 3. ПРИМИТИВНЫЕ ТЕНИ
if (shadows) {
  for (const [key, value] of Object.entries(shadows)) {
    css += `  --faf-shadow-${key}: ${value};\n`;
  }
}
css += "}\n\n";

// 4. Светлая тема (семантические цвета)
if (themes?.light) {
  css += ':root, :root[data-theme="light"] {\n';
  for (const [key, value] of Object.entries(themes.light)) {
    const cssVarName = `--faf-color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    css += `  ${cssVarName}: ${value};\n`;
  }
  css += "}\n\n";
}

// 5. Тёмная тема
if (themes?.dark) {
  css += ':root[data-theme="dark"] {\n';
  for (const [key, value] of Object.entries(themes.dark)) {
    const cssVarName = `--faf-color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    css += `  ${cssVarName}: ${value};\n`;
  }
  css += "}\n\n";
}

// 6. Семантические отступы и тени
css += ":root {\n";
if (semanticSpacing) {
  for (const [key, value] of Object.entries(semanticSpacing)) {
    const cssVarName = `--faf-spacing-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    css += `  ${cssVarName}: ${value};\n`;
  }
}
if (semanticShadows) {
  for (const [key, value] of Object.entries(semanticShadows)) {
    css += `  --faf-shadow-${key}: ${value};\n`;
  }
}
css += "}\n";

writeFileSync(outputPath, css);
console.log(
  `✅ Токены для "@faf/${packageName}" успешно сгенерированы в:`,
  outputPath,
);
