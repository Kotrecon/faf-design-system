/**
 * @module @faf/z-index
 * @description Layer management system for the Faf Design System.
 *              Provides named z-index tokens instead of magic numbers,
 *              along with reference pattern implementations demonstrating correct usage.
 *              Система управления слоями дизайн-системы Faf.
 *              Предоставляет именованные z-index токены вместо магических чисел,
 *              а также эталонные реализации паттернов, демонстрирующие правильное использование.
 */

// ==========================================
// Tokens (Main API) / Токены (Основной API)
// ==========================================
export * from "./tokens/zindex.js";

// ==========================================
// Patterns (Reference Implementations)
// Паттерны (Эталонные реализации)
// ==========================================
// Use them as ready-made components or as a reference
// for creating your own components with correct layers.
// Используйте их как готовые компоненты или как референс
// для создания собственных компонентов с правильными слоями.

export { FafModal } from "./patterns/faf.modal.js";

export { FafToastContainer, FafToast } from "./patterns/faf.toast.js";
export type { ToastType, ToastOptions } from "./patterns/faf.toast.js";

export {
  FafDropdown,
  FafDropdownItem,
  FafDropdownDivider,
} from "./patterns/faf.dropdown.js";

export { FafTooltip } from "./patterns/faf.tooltip.js";
