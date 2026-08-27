// packages/z-index/src/utils/focus.ts

let previouslyFocusedElement: HTMLElement | null = null;

export function saveFocus(): void {
  previouslyFocusedElement = document.activeElement as HTMLElement;
}

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
 * Получает активный элемент с учётом Shadow DOM.
 */
function getActiveElement(
  root: Document | ShadowRoot = document,
): Element | null {
  const activeEl = root.activeElement;
  if (!activeEl) return null;

  // Если активный элемент имеет shadow root, рекурсивно идём внутрь
  if (activeEl.shadowRoot) {
    return getActiveElement(activeEl.shadowRoot);
  }

  return activeEl;
}

export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key !== "Tab") return;

    // 🔥 Используем getActiveElement вместо document.activeElement
    const activeElement = getActiveElement();

    if (e.shiftKey) {
      if (activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  element.addEventListener("keydown", handleKeyDown);
  firstElement?.focus();

  return () => {
    element.removeEventListener("keydown", handleKeyDown);
  };
}
