// packages/z-index/src/patterns/faf.dropdown.ts

export class FafDropdown extends HTMLElement {
  private _trigger: HTMLElement | null = null;
  private _shadow: ShadowRoot;
  private _currentIndex = -1;

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
      :host {
        position: relative;
        display: inline-block;
      }

      .faf-dropdown-trigger {
        display: inline-flex;
        align-items: center;
        gap: var(--faf-spacing-2, 0.5rem);
        padding: var(--faf-spacing-2, 0.5rem) var(--faf-spacing-3, 0.75rem);
        background-color: var(--faf-color-surface, #ffffff);
        color: var(--faf-color-text, #111827);
        border: 1px solid var(--faf-color-border, #e5e7eb);
        border-radius: var(--faf-radius-md, 6px);
        font-size: var(--faf-font-size-fluid-sm, 0.875rem);
        font-weight: var(--faf-font-weight-medium, 500);
        cursor: pointer;
        transition: background-color 0.15s, border-color 0.15s;
      }

      /* Светлая тема (по умолчанию) */
      .faf-dropdown-trigger:hover {
        background-color: var(--faf-color-gray-200, #f3f4f6);
        border-color: var(--faf-color-gray-400, #d1d5db);
      }

      /* Тёмная тема - переопределяем hover */
      :host-context([data-theme="dark"]) .faf-dropdown-trigger:hover {
        background-color: var(--faf-color-gray-700, #374151);
        border-color: var(--faf-color-gray-600, #4b5563);
      }

      .faf-dropdown-arrow {
        transition: transform 0.2s;
      }

      :host([open]) .faf-dropdown-arrow {
        transform: rotate(180deg);
      }

      .faf-dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: var(--faf-spacing-1, 0.25rem);
        min-width: 200px;
        background-color: var(--faf-color-surface, #ffffff);
        border: 1px solid var(--faf-color-border, #e5e7eb);
        border-radius: var(--faf-radius-md, 6px);
        box-shadow: var(--faf-shadow-dropdown, 0 10px 15px rgba(0,0,0,0.1));
        z-index: var(--faf-z-dropdown, 1000);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-8px);
        transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
        overflow: hidden;
        padding: var(--faf-spacing-1, 0.25rem) 0;
      }

      :host([open]) .faf-dropdown-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

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
    <div class="faf-dropdown-menu" role="menu">
      <slot></slot>
    </div>
  `;
  }

  private _cacheElements(): void {
    this._trigger = this._shadow.querySelector(".faf-dropdown-trigger");
  }

  private _bindEvents(): void {
    if (this._trigger) {
      this._trigger.addEventListener("click", () => this.toggle());
      this._trigger.addEventListener("keydown", (e) =>
        this._handleTriggerKeyDown(e),
      );
    }

    this._handleOutsideClick = this._handleOutsideClick.bind(this);
    document.addEventListener("click", this._handleOutsideClick);

    this._handleEscape = this._handleEscape.bind(this);
    document.addEventListener("keydown", this._handleEscape);
  }

  private _unbindEvents(): void {
    document.removeEventListener("click", this._handleOutsideClick);
    document.removeEventListener("keydown", this._handleEscape);
  }

  private _handleOutsideClick = (e: MouseEvent): void => {
    if (!this.contains(e.target as Node) && this.hasAttribute("open")) {
      this.close();
    }
  };

  private _handleEscape = (e: KeyboardEvent): void => {
    if (e.key === "Escape" && this.hasAttribute("open")) {
      e.preventDefault();
      this.close();
      this._trigger?.focus();
    }
  };

  private _handleTriggerKeyDown(e: KeyboardEvent): void {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!this.hasAttribute("open")) {
        this.open();
      }
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
    this._currentIndex = -1;
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
        :host {
          display: block;
          width: 100%;
          padding: var(--faf-spacing-2, 0.5rem) var(--faf-spacing-3, 0.75rem);
          background-color: transparent;
          border: none;
          text-align: left;
          font-size: var(--faf-font-size-fluid-sm, 0.875rem);
          border-radius: var(--faf-radius-sm, 4px);
          cursor: pointer;
          transition: background-color 0.15s, color 0.15s;

          color: var(--faf-color-text, #111827);

          /* 🔥 ИСПРАВЛЕНИЕ 2: Используем gray-200 для светлой темы, чтобы ховер был ЗАМЕТЕН */
          --item-hover-bg: var(--faf-color-gray-200, #e5e7eb);
          --item-hover-text: var(--faf-color-gray-900, #111827);
        }

        :host-context([data-theme="dark"]) {
          /* В темной теме gray-700 отлично работает, как мы уже проверили */
          --item-hover-bg: var(--faf-color-gray-700, #374151);
          --item-hover-text: var(--faf-color-gray-100, #f3f4f6);
        }

        /* 🔥 ИСПРАВЛЕНИЕ 3: Дублируем fallback прямо здесь, на случай если переменная резолвится в transparent */
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

export class FafDropdownDivider extends HTMLElement {
  connectedCallback(): void {
    this.setAttribute("role", "separator");
    this.style.display = "block";
    this.style.height = "1px";
    this.style.margin = "0.25rem 0";
    this.style.backgroundColor = "var(--faf-color-border, #e5e7eb)";
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
