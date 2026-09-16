/**
 * @module Token Generator
 * @description Script for generating CSS variables from TypeScript tokens.
 *              Скрипт для генерации CSS-переменных из TypeScript-токенов.
 */

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const packageName = process.argv[2] || "foundations";

const packagePath = resolve(__dirname, `../packages/${packageName}`);
const srcPath = join(packagePath, "src");

if (!existsSync(packagePath)) {
  console.error(`❌ Error: Package "packages/${packageName}" not found.`);
  process.exit(1);
}

// Dynamic import of TS files / Динамический импорт TS-файлов
const themesPath = `file://${join(srcPath, "semantic/themes.ts")}`;
const primitivesPath = `file://${join(srcPath, "tokens/colors/primitives.ts")}`;
const spacingPath = `file://${join(srcPath, "tokens/spacing/index.ts")}`;
const shadowsPath = `file://${join(srcPath, "tokens/shadows/index.ts")}`;
const radiusPath = `file://${join(srcPath, "tokens/radius/index.ts")}`;
const opacityPath = `file://${join(srcPath, "tokens/opacity/index.ts")}`;
const transitionsPath = `file://${join(srcPath, "tokens/transitions/index.ts")}`;
const typographyPath = `file://${join(srcPath, "tokens/typography/index.ts")}`;

const semanticSpacingPath = `file://${join(srcPath, "tokens/spacing/semantic.ts")}`;
const semanticShadowsPath = `file://${join(srcPath, "tokens/shadows/semantic.ts")}`;
const semanticRadiusPath = `file://${join(srcPath, "tokens/radius/semantic.ts")}`;
const semanticOpacityPath = `file://${join(srcPath, "tokens/opacity/semantic.ts")}`;
const semanticTransitionsPath = `file://${join(srcPath, "tokens/transitions/semantic.ts")}`;
const semanticTypographyPath = `file://${join(srcPath, "tokens/typography/semantic.ts")}`;

let themes, primitives, spacing, shadows, radius, opacity, durations, easings;
let typographyScale, fluidSizes, fontFamilies, fontWeights, lineHeights;
let semanticSpacing,
  semanticShadows,
  semanticRadius,
  semanticOpacity,
  semanticTransitions,
  semanticTypography;

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
    const radiusModule = await import(radiusPath);
    radius = radiusModule.radii;
  } catch (e) {
    radius = {};
  }

  try {
    const opacityModule = await import(opacityPath);
    opacity = opacityModule.opacity;
  } catch (e) {
    opacity = {};
  }

  try {
    const transitionsModule = await import(transitionsPath);
    durations = transitionsModule.durations;
    easings = transitionsModule.easings;
  } catch (e) {
    durations = {};
    easings = {};
  }

  try {
    const typographyModule = await import(typographyPath);
    typographyScale = typographyModule.typographyScale;
    fluidSizes = typographyModule.fluidSizes;
    fontFamilies = typographyModule.fontFamilies;
    fontWeights = typographyModule.fontWeights;
    lineHeights = typographyModule.lineHeights;
  } catch (e) {
    typographyScale = {};
    fluidSizes = {};
    fontFamilies = {};
    fontWeights = {};
    lineHeights = {};
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

  try {
    const semanticRadiusModule = await import(semanticRadiusPath);
    semanticRadius = semanticRadiusModule.semanticRadius;
  } catch (e) {
    semanticRadius = {};
  }

  try {
    const semanticOpacityModule = await import(semanticOpacityPath);
    semanticOpacity = semanticOpacityModule.semanticOpacity;
  } catch (e) {
    semanticOpacity = {};
  }

  try {
    const semanticTransitionsModule = await import(semanticTransitionsPath);
    semanticTransitions = semanticTransitionsModule.semanticTransitions;
  } catch (e) {
    semanticTransitions = {};
  }

  try {
    const semanticTypographyModule = await import(semanticTypographyPath);
    semanticTypography = semanticTypographyModule.semanticTypography;
  } catch (e) {
    semanticTypography = {};
  }
} catch (error) {
  console.error(`❌ Error importing tokens from package "${packageName}".`);
  console.error("Ensure that the files exist.");
  process.exit(1);
}

const outputDir = join(srcPath, "styles");
const outputPath = join(outputDir, "tokens.generated.css");

// Создаем директорию, если она не существует (защита от падения)
// Create directory if it does not exist (protection against crashes)
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

let css =
  "/* ⚠️ THIS FILE IS AUTO-GENERATED. DO NOT EDIT MANUALLY! */\n/* ⚠️ ЭТОТ ФАЙЛ ГЕНЕРИРУЕТСЯ АВТОМАТИЧЕСКИ. НЕ РЕДАКТИРУЙТЕ ВРУЧНУЮ! */\n\n";

// 1. ПРИМИТИВНЫЕ ЦВЕТА (Global Tokens) / 1. Primitive colors (Global Tokens)
css += ":root {\n";
if (primitives) {
  for (const [colorName, scales] of Object.entries(primitives)) {
    for (const [scale, value] of Object.entries(scales)) {
      css += `  --faf-color-${colorName}-${scale}: ${value};\n`;
    }
  }
}

// 2. ПРИМИТИВНЫЕ ОТСТУПЫ / 2. Primitive spacing
if (spacing) {
  for (const [key, value] of Object.entries(spacing)) {
    css += `  --faf-spacing-${key}: ${value};\n`;
  }
}

// 3. ПРИМИТИВНЫЕ ТЕНИ / 3. Primitive shadows
if (shadows) {
  for (const [key, value] of Object.entries(shadows)) {
    css += `  --faf-shadow-${key}: ${value};\n`;
  }
}

// 4. ПРИМИТИВНЫЕ РАДИУСЫ / 4. Primitive radius
if (radius) {
  for (const [key, value] of Object.entries(radius)) {
    css += `  --faf-radius-${key}: ${value};\n`;
  }
}

// 5. ПРИМИТИВНАЯ ПРОЗРАЧНОСТЬ / 5. Primitive opacity
if (opacity) {
  for (const [key, value] of Object.entries(opacity)) {
    css += `  --faf-opacity-${key}: ${value};\n`;
  }
}

// 6. ПРИМИТИВНЫЕ ДЛИТЕЛЬНОСТИ / 6. Primitive durations
if (durations) {
  for (const [key, value] of Object.entries(durations)) {
    css += `  --faf-duration-${key}: ${value};\n`;
  }
}

// 7. ПРИМИТИВНЫЕ ФУНКЦИИ ПЛАВНОСТИ / 7. Primitive easings
if (easings) {
  for (const [key, value] of Object.entries(easings)) {
    const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    css += `  --faf-easing-${cssKey}: ${value};\n`;
  }
}

// 8. МОДУЛЬНАЯ ШКАЛА ТИПОГРАФИКИ / 8. Typography scale
if (typographyScale) {
  for (const [key, value] of Object.entries(typographyScale)) {
    css += `  --faf-font-scale-${key}: ${value};\n`;
  }
}

// 9. FLUID-ТИПОГРАФИКА / 9. Fluid typography
if (fluidSizes) {
  for (const [key, value] of Object.entries(fluidSizes)) {
    css += `  --faf-font-size-${key}: ${value};\n`;
  }
}

// 10. СЕМЕЙСТВА ШРИФТОВ / 10. Font families
if (fontFamilies) {
  for (const [key, value] of Object.entries(fontFamilies)) {
    css += `  --faf-font-family-${key}: ${value};\n`;
  }
}

// 11. НАСЫЩЕННОСТИ ШРИФТОВ / 11. Font weights
if (fontWeights) {
  for (const [key, value] of Object.entries(fontWeights)) {
    css += `  --faf-font-weight-${key}: ${value};\n`;
  }
}

// 12. МЕЖСТРОЧНЫЕ ИНТЕРВАЛЫ / 12. Line heights
if (lineHeights) {
  for (const [key, value] of Object.entries(lineHeights)) {
    css += `  --faf-line-height-${key}: ${value};\n`;
  }
}
css += "}\n\n";

// 13. Светлая тема (семантические цвета) / 13. Light theme (semantic colors)
if (themes?.light) {
  css += ':root, :root[data-theme="light"] {\n';
  for (const [key, value] of Object.entries(themes.light)) {
    const cssVarName = `--faf-color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    css += `  ${cssVarName}: ${value};\n`;
  }
  css += "}\n\n";
}

// 14. Тёмная тема (семантические цвета) / 14. Dark theme (semantic colors)
if (themes?.dark) {
  css += ':root[data-theme="dark"] {\n';
  for (const [key, value] of Object.entries(themes.dark)) {
    const cssVarName = `--faf-color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    css += `  ${cssVarName}: ${value};\n`;
  }
  css += "}\n\n";
}

// 15. Семантические отступы и тени / 15. Semantic spacing and shadows
css += ":root {\n";
if (semanticSpacing) {
  for (const [key, value] of Object.entries(semanticSpacing)) {
    const cssVarName = `--faf-spacing-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    css += `  ${cssVarName}: ${value};\n`;
  }
}
if (semanticShadows) {
  for (const [key, value] of Object.entries(semanticShadows)) {
    const cssVarName = `--faf-shadow-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    css += `  ${cssVarName}: ${value};\n`;
  }
}

// 16. Семантические радиусы / 16. Semantic radius
if (semanticRadius) {
  for (const [key, value] of Object.entries(semanticRadius)) {
    const cssVarName = `--faf-radius-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    css += `  ${cssVarName}: ${value};\n`;
  }
}

// 17. Семантическая прозрачность / 17. Semantic opacity
if (semanticOpacity) {
  for (const [key, value] of Object.entries(semanticOpacity)) {
    const cssVarName = `--faf-opacity-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    css += `  ${cssVarName}: ${value};\n`;
  }
}

// 18. Семантические переходы / 18. Semantic transitions
if (semanticTransitions) {
  for (const [key, value] of Object.entries(semanticTransitions)) {
    const cssVarName = `--faf-transition-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    css += `  ${cssVarName}: ${value};\n`;
  }
}

// 19. Семантическая типографика / 19. Semantic typography
if (semanticTypography) {
  for (const [category, roles] of Object.entries(semanticTypography)) {
    for (const [role, props] of Object.entries(roles)) {
      const cssRole = role.replace(/([A-Z])/g, "-$1").toLowerCase();
      for (const [prop, value] of Object.entries(props)) {
        const cssProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
        const cssVarName = `--faf-typography-${category}-${cssRole}-${cssProp}`;
        css += `  ${cssVarName}: ${value};\n`;
      }
    }
  }
}
css += "}\n";

writeFileSync(outputPath, css);
console.log(
  `✅ Tokens for "@faf/${packageName}" successfully generated in:`,
  outputPath,
);
