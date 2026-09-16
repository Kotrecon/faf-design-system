/**
 * @module FafTooltip
 * @description Production-grade reference implementation of a tooltip component.
 *              Production-реализация эталонного компонента тултипа.
 */

export class FafTooltip extends HTMLElement {
  private _shadow: ShadowRoot;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    const content = this.getAttribute("content") || "";
    const position = this.getAttribute("position") || "top";

    this._shadow.innerHTML = `
      <style>
        /* 1. Base token mapping (Light theme) / Базовый маппинг токенов (Светлая тема) */
        :host {
          position: relative;
          display: inline-block;
          --tooltip-bg: var(--faf-color-gray-900, #111827);
          --tooltip-text: var(--faf-color-gray-50, #f9fafb);
        }

        /* 2. Context-aware override ONLY for variable values / Context-aware override ТОЛЬКО для значений переменных */
        :host-context([data-theme="dark"]) {
          --tooltip-bg: var(--faf-color-gray-100, #f3f4f6);
          --tooltip-text: var(--faf-color-gray-900, #111827);
        }

        /* 3. State logic simply reads ready attribute / State logic просто читает готовый атрибут состояния */
        .faf-tooltip-content {
          position: absolute;
          ${position === "bottom" ? "top: 100%; margin-top: var(--faf-spacing-2, 0.5rem);" : "bottom: 100%; margin-bottom: var(--faf-spacing-2, 0.5rem);"}
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          
          background-color: var(--tooltip-bg);
          color: var(--tooltip-text);
          padding: var(--faf-spacing-1, 0.25rem) var(--faf-spacing-2, 0.5rem);
          border-radius: var(--faf-radius-sm, 4px);
          box-shadow: var(--faf-shadow-tooltip, 0 4px 6px rgba(0, 0, 0, 0.1)); /* ДОБАВЛЕНО: синхронизация с CSS */
          
          font-size: var(--faf-font-size-xs, 0.75rem); /* ИСПРАВЛЕНО: fluid-xs -> xs */
          font-weight: var(--faf-font-weight-medium, 500);
          line-height: var(--faf-line-height-normal, 1.5); /* ДОБАВЛЕНО: синхронизация с CSS */
          white-space: nowrap;
          z-index: var(--faf-zindex-tooltip, 1070); /* ИСПРАВЛЕНО: z-tooltip -> zindex-tooltip */
          
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.15s, transform 0.15s, visibility 0.15s;
          pointer-events: none;
        }

        :host([data-visible="true"]) .faf-tooltip-content {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
          pointer-events: auto;
        }
      </style>
      
      <slot name="trigger"></slot>
      
      <div class="faf-tooltip-content" role="tooltip" aria-hidden="true">
        ${content}
      </div>
    `;

    // 4. Explicit state management / Явное управление состоянием (State Management)
    this._onMouseEnter = () => {
      this.setAttribute("data-visible", "true");
      this._updateAriaHidden(true);
    };
    this._onMouseLeave = () => {
      this.removeAttribute("data-visible");
      this._updateAriaHidden(false);
    };
    this._onFocusIn = () => {
      this.setAttribute("data-visible", "true");
      this._updateAriaHidden(true);
    };
    this._onFocusOut = (e: FocusEvent) => {
      if (!this.contains(e.relatedTarget as Node)) {
        this.removeAttribute("data-visible");
        this._updateAriaHidden(false);
      }
    };
    this._onClick = (e: MouseEvent) => {
      if (e.detail > 0) {
        this.removeAttribute("data-visible");
        this._updateAriaHidden(false);
      }
    };

    this.addEventListener("mouseenter", this._onMouseEnter);
    this.addEventListener("mouseleave", this._onMouseLeave);
    this.addEventListener("focusin", this._onFocusIn);
    this.addEventListener("focusout", this._onFocusOut);
    this.addEventListener("click", this._onClick);

    // Ensure keyboard accessibility for non-interactive triggers / Гарантируем keyboard accessibility для неинтерактивных триггеров
    setTimeout(() => {
      const trigger =
        this.querySelector("[slot='trigger']") || this.firstElementChild;
      if (trigger instanceof HTMLElement) {
        if (
          !["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"].includes(
            trigger.tagName,
          )
        ) {
          trigger.setAttribute("tabindex", "0");
        }
      }
    }, 0);
  }

  disconnectedCallback(): void {
    this.removeEventListener("mouseenter", this._onMouseEnter);
    this.removeEventListener("mouseleave", this._onMouseLeave);
    this.removeEventListener("focusin", this._onFocusIn);
    this.removeEventListener("focusout", this._onFocusOut);
    this.removeEventListener("click", this._onClick);
  }

  // Helper: Update aria-hidden for screen readers / Хелпер: Обновление aria-hidden для скринридеров
  private _updateAriaHidden(isVisible: boolean): void {
    const tooltip = this._shadow.querySelector(".faf-tooltip-content");
    if (tooltip) {
      tooltip.setAttribute("aria-hidden", isVisible ? "false" : "true");
    }
  }

  private _onMouseEnter!: () => void;
  private _onMouseLeave!: () => void;
  private _onFocusIn!: () => void;
  private _onFocusOut!: (e: FocusEvent) => void;
  private _onClick!: (e: MouseEvent) => void;
}

if (!customElements.get("faf-tooltip")) {
  customElements.define("faf-tooltip", FafTooltip);
}
