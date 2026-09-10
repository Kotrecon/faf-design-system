/**
 * @module Z-Index Tokens
 * @description Named z-index values for the Faf Design System.
 *              These tokens replace magic numbers and create a unified Layer Contract.
 *              Именованные значения z-index для дизайн-системы Faf.
 *              Эти токены заменяют магические числа и создают единый контракт слоёв.
 *
 * @architecture Layer Hierarchy (low to high):
 *               base (0) < dropdown (1000) < sticky (1020) < fixed (1030)
 *               < modal-backdrop (1040) < modal (1050) < popover (1060)
 *               < tooltip (1070) < toast (1080).
 *               Шаг 10-20 между группами оставляет пространство для будущих подуровней.
 */

export const zIndexTokens = {
  /** Base layer — page content / Базовый слой — контент страницы */
  base: 0,

  /** Dropdowns: menus, selects, autocomplete / Дропдауны: меню, селекторы, autocomplete */
  dropdown: 1000,

  /** Sticky elements: fixed table headers, sidebars / Sticky-элементы: закреплённые заголовки таблиц, сайдбары */
  sticky: 1020,

  /** Fixed elements: navbars, bottom panels / Fixed-элементы: навбары, нижние панели */
  fixed: 1030,

  /** Modal backdrop (dimming) / Backdrop (затемнение) модального окна */
  modalBackdrop: 1040,

  /** Modal window (above backdrop) / Модальное окно (поверх backdrop) */
  modal: 1050,

  /** Popovers: floating action panels / Popover: всплывающие панели, поповеры */
  popover: 1060,

  /** Tooltips: hover/focus hints (must be above modals) / Tooltip: всплывающие подсказки (должны быть выше модалок) */
  tooltip: 1070,

  /** Toasts: notifications (above all UI elements) / Toast: уведомления (поверх всех элементов интерфейса) */
  toast: 1080,
} as const;

/**
 * Type of all available z-index tokens.
 * Used for strict typing in components.
 * Тип всех доступных z-index токенов.
 * Используется для строгой типизации в компонентах.
 */
export type ZIndexToken = keyof typeof zIndexTokens;

/**
 * Type of a z-index token value.
 * Тип значения z-index токена.
 */
export type ZIndexValue = (typeof zIndexTokens)[ZIndexToken];
