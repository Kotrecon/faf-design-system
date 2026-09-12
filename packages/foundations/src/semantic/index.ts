/**
 * @module Semantic Tokens
 * @description Aggregated exports of semantic tokens (themes, typography, spacing, shadows, radius, opacity, transitions).
 *              Агрегированные экспорты семантических токенов (темы, типографика, отступы, тени, радиусы, прозрачность, переходы).
 */

// 1. COLORS (Themes) / ЦВЕТА (Темы)
export {
  light,
  dark,
  themes,
  type SemanticTheme,
  type ThemeName,
} from "./themes";

// 2. TYPOGRAPHY (Roles) / ТИПОГРАФИКА (Роли)
export {
  semanticTypography,
  type SemanticTypographyCategory,
  type SemanticTypographyRole,
} from "../tokens/typography/semantic";

// 3. SPACING (Roles) / ОТСТУПЫ (Роли)
export {
  semanticSpacing,
  type SemanticSpacingKey,
} from "../tokens/spacing/semantic";

// 4. SHADOWS (Roles) / ТЕНИ (Роли)
export {
  semanticShadows,
  type SemanticShadowKey,
} from "../tokens/shadows/semantic";

// 5. RADIUS (Roles) / СКРУГЛЕНИЯ (Роли)
export {
  semanticRadius,
  type SemanticRadiusKey,
} from "../tokens/radius/semantic";

// 6. OPACITY (Roles) / ПРОЗРАЧНОСТЬ (Роли)
export {
  semanticOpacity,
  type SemanticOpacityKey,
} from "../tokens/opacity/semantic";

// 7. TRANSITIONS (Roles) / ПЕРЕХОДЫ (Роли)
export {
  semanticTransitions,
  type SemanticTransitionKey,
} from "../tokens/transitions/semantic";
