// packages/z-index/src/index.ts

/**
 * @faf/z-index
 *
 * Система управления слоями дизайн-системы Faf.
 * Предоставляет именованные z-index токены вместо магических чисел.
 *
 * @example
 * ```typescript
 * import { zIndexTokens } from '@faf/z-index';
 *
 * const modalZIndex = zIndexTokens.modal; // 1050
 * ```
 *
 * @example
 * ```css
 * .my-modal {
 *   z-index: var(--faf-z-modal);
 * }
 * ```
 */

export { zIndexTokens } from "./zindex";
export type { ZIndexToken, ZIndexValue } from "./zindex";
