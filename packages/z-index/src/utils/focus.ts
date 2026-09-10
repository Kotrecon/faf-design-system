/**
 * @module Focus Management Utilities
 * @description Utilities for saving, restoring, and trapping focus within components (e.g., modals).
 *              Утилиты для сохранения, восстановления и ограничения фокуса внутри компонентов (например, модалок).
 *
 * @contract Ensures keyboard accessibility and prevents focus loss when overlay components are active.
 *           Обеспечивает доступность с клавиатуры и предотвращает потерю фокуса при активных оверлей-компонентах.
 */

let previouslyFocusedElement: HTMLElement | null = null;

/**
 * Saves the currently focused element before opening an overlay.
 * Сохраняет текущий сфокусированный элемент перед открытием оверлея.
 */
export function saveFocus(): void {
  previouslyFocusedElement = document.activeElement as HTMLElement;
}

/**
 * Restores focus to the previously saved element.
 * Восстанавливает фокус на ранее сохранённом элементе.
 */
export function restoreFocus(): void {
  if (
    previouslyFocusedElement &&
    typeof previouslyFocusedElement.focus === "function"
  ) {
    previouslyFocusedElement.focus();
    previouslyFocusedElement = null;
  }
}

/**
 * Gets the active element, recursively traversing Shadow DOM boundaries.
 * Получает активный элемент, рекурсивно обходя границы Shadow DOM.
 *
 * @param root - The root document or shadow root to search within.
 * @returns The currently active element, or null.
 */
function getActiveElement(
  root: Document | ShadowRoot = document,
): Element | null {
  const activeEl = root.activeElement;
  if (!activeEl) return null;

  // If the active element has a shadow root, recursively go inside
  // Если активный элемент имеет shadow root, рекурсивно идём внутрь
  if (activeEl.shadowRoot) {
    return getActiveElement(activeEl.shadowRoot);
  }

  return activeEl;
}

/**
 * Traps keyboard focus within a specific HTMLElement.
 * Ограничивает клавиатурный фокус внутри указанного HTMLElement.
 *
 * @param element - The container element to trap focus within.
 * @returns A cleanup function to remove the event listener.
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key !== "Tab") return;

    // Use getActiveElement to correctly handle focus inside Shadow DOM
    // Используем getActiveElement для корректной обработки фокуса внутри Shadow DOM
    const activeElement = getActiveElement();

    if (e.shiftKey) {
      // Shift + Tab
      if (activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }

  element.addEventListener("keydown", handleKeyDown);
  firstElement?.focus();

  // Return cleanup function / Возвращаем функцию очистки
  return () => {
    element.removeEventListener("keydown", handleKeyDown);
  };
}
