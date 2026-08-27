// packages/z-index/src/index.ts

/**
 * @faf/z-index
 *
 * Система управления слоями дизайн-системы Faf.
 * Предоставляет именованные z-index токены вместо магических чисел,
 * а также эталонные реализации паттернов (модалка, тост, дропдаун),
 * демонстрирующие правильное использование этих токенов.
 */

// ==========================================
// Токены (Основной API)
// ==========================================
export * from "./tokens";

// ==========================================
// Паттерны (Эталонные реализации)
// ==========================================
// Используйте их как готовые компоненты или как референс
// для создания собственных компонентов с правильными слоями.

export { FafModal } from "./patterns/faf.modal";

export { FafToastContainer, FafToast } from "./patterns/faf.toast";
export type { ToastType, ToastOptions } from "./patterns/faf.toast";

export {
  FafDropdown,
  FafDropdownItem,
  FafDropdownDivider,
} from "./patterns/faf.dropdown";

export { FafTooltip } from "./patterns/faf.tooltip";
