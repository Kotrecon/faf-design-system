/**
 * @module FafDropdown
 * @description Reference implementation of a dropdown component with keyboard navigation.
 *              Эталонная реализация компонента выпадающего списка с навигацией с клавиатуры.
 */

export class FafDropdown extends HTMLElement {
  private _trigger: HTMLElement | null = null;
  private _menu: HTMLElement | null = null;
  private _shadow: ShadowRoot;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.render();
    this._cacheElements();
    this._bindEvents();
  }

  disconnectedCallback(): void {
    this._unbindEvents();
  }

  private render(): void {
    this._shadow.innerHTML = `
    <style>
      /* Container / Контейнер */
      :host {
        position: relative;
        display: inline-block;
      }

/* Trigger button / Кнопка-триггер */
.faf-dropdown-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--faf-spacing-2, 0.5rem);
  padding: var(--faf-spacing-2, 0.5rem) var(--faf-spacing-3, 0.75rem);
  background-color: var(--faf-color-surface, #ffffff);
  color: var(--faf-color-text, #111827);
  border: 1px solid var(--faf-color-gray-300, #d1d5db); /* ИСПРАВЛЕНО: более видимый border */
  border-radius: var(--faf-radius-md, 6px);
  font-size: var(--faf-font-size-sm, 0.875rem);
  font-weight: var(--faf-font-weight-medium, 500);
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s;
}

      /* Light theme hover (default) / Hover для светлой темы (по умолчанию) */
      .faf-dropdown-trigger:hover {
        background-color: var(--faf-color-gray-200, #f3f4f6);
        border-color: var(--faf-color-gray-400, #d1d5db);
      }

      /* Dark theme hover override / Переопределение hover для тёмной темы */
      :host-context([data-theme="dark"]) .faf-dropdown-trigger:hover {
        background-color: var(--faf-color-gray-700, #374151);
        border-color: var(--faf-color-gray-600, #4b5563);
      }

      /* Arrow icon / Иконка стрелки */
      .faf-dropdown-arrow {
        transition: transform 0.2s;
      }

      /* Arrow rotation when open / Поворот стрелки при открытии */
      :host([open]) .faf-dropdown-arrow {
        transform: rotate(180deg);
      }

      /* Dropdown menu / Меню дропдауна */
      .faf-dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: var(--faf-spacing-1, 0.25rem);
        min-width: 200px;
        background-color: var(--faf-color-surface, #ffffff);
        border: 1px solid var(--faf-color-gray-300, #d1d5db);
        border-radius: var(--faf-radius-md, 6px);
        box-shadow: var(--faf-shadow-dropdown, 0 10px 15px rgba(0,0,0,0.1));
        z-index: var(--faf-zindex-dropdown, 1000);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-8px);
        transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
        overflow: hidden;
        padding: var(--faf-spacing-1, 0.25rem) 0;
      }

      /* Menu visible state / Состояние видимости меню */
      :host([open]) .faf-dropdown-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      /* Slotted divider / Разделитель через слот */
      ::slotted(faf-dropdown-divider) {
        display: block;
        height: 1px;
        margin: 0.25rem 0;
        background-color: var(--faf-color-border, #e5e7eb);
      }
    </style>
    <button class="faf-dropdown-trigger" aria-haspopup="true" aria-expanded="false" type="button">
      <slot name="trigger">Menu</slot>
      <span class="faf-dropdown-arrow" aria-hidden="true">▼</span>
    </button>
    <div class="faf-dropdown-menu" role="menu" tabindex="-1">
      <slot></slot>
    </div>
  `;
  }

  private _cacheElements(): void {
    this._trigger = this._shadow.querySelector(".faf-dropdown-trigger");
    this._menu = this._shadow.querySelector(".faf-dropdown-menu");
  }

  private _bindEvents(): void {
    if (this._trigger) {
      this._trigger.addEventListener("click", () => this.toggle());
      this._trigger.addEventListener("keydown", (e) =>
        this._handleTriggerKeyDown(e),
      );
    }

    if (this._menu) {
      this._menu.addEventListener("keydown", (e) => this._handleMenuKeyDown(e));
    }

    this._handleOutsideClick = this._handleOutsideClick.bind(this);
    document.addEventListener("click", this._handleOutsideClick);
  }

  private _unbindEvents(): void {
    document.removeEventListener("click", this._handleOutsideClick);
  }

  // Handle clicks outside dropdown / Обработка кликов вне дропдауна
  private _handleOutsideClick = (e: MouseEvent): void => {
    if (!this.contains(e.target as Node) && this.hasAttribute("open")) {
      this.close();
    }
  };

  // Handle keyboard navigation on trigger / Обработка навигации на триггере
  private _handleTriggerKeyDown(e: KeyboardEvent): void {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!this.hasAttribute("open")) {
        this.open();
        // Небольшая задержка необходима, чтобы браузер успел отрендерить слоты и сделать элементы фокусируемыми
        // A small delay is necessary for the browser to render slots and make elements focusable
        setTimeout(() => this._focusItem(0), 50);
      }
    }
  }

  // Handle keyboard navigation inside menu / Обработка навигации внутри меню
  private _handleMenuKeyDown(e: KeyboardEvent): void {
    const items = this._getMenuItems();
    if (items.length === 0) return;

    // Надежный поиск текущего элемента: проверяем, является ли activeElement самим пунктом
    // или находится внутри его Shadow DOM (метод .contains решает проблему ретаргетинга событий)
    // Reliable search for current element: check if activeElement is the item itself
    // or is inside its Shadow DOM (.contains solves the event retargeting problem)
    const activeEl = document.activeElement;
    let currentIndex = items.findIndex(
      (item) => item === activeEl || item.contains(activeEl as Node),
    );

    // Если фокус потерян или находится вне пунктов меню, сбрасываем индекс
    // If focus is lost or outside menu items, reset index
    if (currentIndex === -1) {
      currentIndex = -1;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % items.length;
      items[nextIndex].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + items.length) % items.length;
      items[prevIndex].focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0].focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1].focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      this.close();
      this._trigger?.focus();
    }
  }

  // Helper: Get all focusable menu items from Light DOM / Хелпер: Получить все фокусируемые пункты меню из Light DOM
  private _getMenuItems(): HTMLElement[] {
    // Используем this.children вместо querySelectorAll для гарантированного получения слотированных кастомных элементов
    // Use this.children instead of querySelectorAll to guarantee retrieval of slotted custom elements
    return Array.from(this.children).filter(
      (el) => el.getAttribute("role") === "menuitem",
    ) as HTMLElement[];
  }

  // Helper: Focus specific item / Хелпер: Сфокусировать конкретный пункт
  private _focusItem(index: number): void {
    const items = this._getMenuItems();
    if (items[index]) {
      items[index].focus();
    }
  }

  public open(): void {
    if (this.hasAttribute("open")) return;
    this.setAttribute("open", "");
    this._trigger?.setAttribute("aria-expanded", "true");
    this.dispatchEvent(new CustomEvent("faf-dropdown-open", { bubbles: true }));
  }

  public close(): void {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this._trigger?.setAttribute("aria-expanded", "false");
    this.dispatchEvent(
      new CustomEvent("faf-dropdown-close", { bubbles: true }),
    );
  }

  public toggle(): void {
    if (this.hasAttribute("open")) {
      this.close();
    } else {
      this.open();
    }
  }
}

// Dropdown menu item / Пункт меню дропдауна
export class FafDropdownItem extends HTMLElement {
  private _shadow: ShadowRoot;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.setAttribute("role", "menuitem");
    this.setAttribute("tabindex", "-1");

    this._shadow.innerHTML = `
      <style>
        /* Base styles / Базовые стили */
        :host {
          display: block;
          width: 100%;
          padding: var(--faf-spacing-2, 0.5rem) var(--faf-spacing-3, 0.75rem);
          background-color: transparent;
          border: none;
          text-align: left;
          font-size: var(--faf-font-size-sm, 0.875rem);
          border-radius: var(--faf-radius-sm, 4px);
          cursor: pointer;
          transition: background-color 0.15s, color 0.15s;
          color: var(--faf-color-text, #111827);

          /* Локальные переменные для состояний hover/focus / Local variables for hover/focus states */
          --item-hover-bg: var(--faf-color-gray-200, #e5e7eb);
          --item-hover-text: var(--faf-color-gray-900, #111827);
        }

        /* Переопределение для тёмной темы / Dark theme override */
        :host-context([data-theme="dark"]) {
          --item-hover-bg: var(--faf-color-gray-700, #374151);
          --item-hover-text: var(--faf-color-gray-100, #f3f4f6);
        }

        /* Состояния hover и focus / Hover and focus states */
        :host(:hover), :host(:focus) {
          background-color: var(--item-hover-bg, #e5e7eb);
          color: var(--item-hover-text, #111827);
          outline: none;
        }
      </style>
      <slot></slot>
    `;
  }
}

// Dropdown divider / Разделитель дропдауна
export class FafDropdownDivider extends HTMLElement {
  connectedCallback(): void {
    this.setAttribute("role", "separator");
    this.style.display = "block";
    this.style.height = "1px";
    this.style.margin = "0.25rem 0";
    this.style.backgroundColor = "var(--faf-color-gray-300, #d1d5db)";
  }
}

if (!customElements.get("faf-dropdown")) {
  customElements.define("faf-dropdown", FafDropdown);
}

if (!customElements.get("faf-dropdown-item")) {
  customElements.define("faf-dropdown-item", FafDropdownItem);
}

if (!customElements.get("faf-dropdown-divider")) {
  customElements.define("faf-dropdown-divider", FafDropdownDivider);
}
