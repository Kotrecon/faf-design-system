// src/semantic/index.ts

// ============================================================================
// 1. ЦВЕТА (Темы)
// ============================================================================
export {
  light,
  dark,
  themes,
  type SemanticTheme,
  type ThemeName,
} from "./themes";

// ============================================================================
// 2. ТИПОГРАФИКА (Роли)
// ============================================================================
export {
  semanticTypography,
  type SemanticTypographyCategory,
  type SemanticTypographyRole,
} from "../tokens/typography/semantic";

// ============================================================================
// 3. ОТСТУПЫ (Роли)
// ============================================================================
export {
  semanticSpacing,
  type SemanticSpacingKey,
} from "../tokens/spacing/semantic";

// ============================================================================
// 4. ТЕНИ (Роли)
// ============================================================================
export {
  semanticShadows,
  type SemanticShadowKey,
} from "../tokens/shadows/semantic";
