// packages/z-index/src/patterns/faf.toast.ts

import { FafContrast } from "../utils/contrast.js";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

// Цвета для JS-проверки контраста (используем hex для точности парсинга в упрощённой версии)
// Colors for JS contrast check (using hex for parsing accuracy in simplified version)
const TOAST_COLORS: Record<ToastType, { bg: string; text: string }> = {
  success: { bg: "#16a34a", text: "#ffffff" },
  error: { bg: "#dc2626", text: "#ffffff" },
  warning: { bg: "#eab308", text: "#111827" },
  info: { bg: "#2563eb", text: "#ffffff" },
};

/**
 * FafToastContainer — глобальный контейнер для тостов.
 * FafToastContainer — global container for toasts.
 */
export class FafToastContainer extends HTMLElement {
  private static instance: FafToastContainer | null = null;
  private _shadow: ShadowRoot;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this._shadow.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: var(--faf-spacing-4);
          right: var(--faf-spacing-4);
          z-index: var(--faf-z-toast);
          display: flex;
          flex-direction: column;
          gap: var(--faf-spacing-2);
          max-width: 400px;
          pointer-events: none;
        }
      </style>
      <slot></slot>
    `;
    FafToastContainer.instance = this;
  }

  public static show(options: ToastOptions): void {
    if (!FafToastContainer.instance) {
      console.error(
        "❌ FafToastContainer not found. Add <faf-toast-container> to body. / FafToastContainer не найден. Добавьте <faf-toast-container> в body.",
      );
      return;
    }

    const toast = document.createElement("faf-toast");
    toast.setAttribute("message", options.message);
    toast.setAttribute("type", options.type || "info");
    toast.setAttribute("duration", String(options.duration || 5000));

    FafToastContainer.instance.appendChild(toast);
  }
}

/**
 * FafToast — отдельный элемент уведомления.
 * Строго следует FAF Styling Contract: маппинг цветов через локальные переменные.
 * FafToast — individual notification element.
 * Strictly follows FAF Styling Contract: color mapping via local variables.
 */
export class FafToast extends HTMLElement {
  private _hideTimeout: number | null = null;
  private _shadow: ShadowRoot;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.render();
    this._bindEvents();
    this._startAutoHide();
    this._checkContrast();
  }

  disconnectedCallback(): void {
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }
  }

  private render(): void {
    const message = this.getAttribute("message") || "";
    const type = (this.getAttribute("type") || "info") as ToastType;

    this.setAttribute("type", type);
    this.setAttribute("role", "alert");
    this.setAttribute("aria-live", "polite");

    this._shadow.innerHTML = `
      <style>
        /* 1. Базовый маппинг токенов (Светлая тема) */
        /* 1. Base token mapping (Light theme) */
        :host {
          display: flex;
          align-items: center;
          gap: var(--faf-spacing-3);
          padding: var(--faf-spacing-3) var(--faf-spacing-4);
          border-radius: var(--faf-radius-md);
          box-shadow: var(--faf-shadow-lg);
          font-size: var(--faf-font-size-sm);
          font-weight: var(--faf-font-weight-medium);
          line-height: var(--faf-line-height-normal);
          pointer-events: auto;
          animation: faf-toast-slide-in 0.3s ease-out;
          opacity: 1;
          transition: opacity 0.3s ease-out, transform 0.3s ease-out;

          /* Маппинг локальных переменных на глобальные токены */
          /* Mapping local variables to global tokens */
          --toast-bg: var(--faf-color-info, #2563eb);
          --toast-text: var(--faf-color-surface, #ffffff);
        }

        /* 2. Контекстное переопределение ТОЛЬКО для значений переменных (Тёмная тема) */
        /* 2. Context-aware override ONLY for token values (Dark theme) */
        :host-context([data-theme="dark"]) {
          --toast-bg: var(--faf-color-info-dark, var(--faf-color-blue-400));
          --toast-text: var(--faf-color-gray-900, #111827);
        }

        /* Специфичные типы тостов (переопределяют маппинг) */
        /* Specific toast types (override the mapping) */
        :host([type="success"]) {
          --toast-bg: var(--faf-color-success, #16a34a);
          --toast-text: var(--faf-color-surface, #ffffff);
        }
        :host([type="error"]) {
          --toast-bg: var(--faf-color-danger, #dc2626);
          --toast-text: var(--faf-color-surface, #ffffff);
        }
        :host([type="warning"]) {
          --toast-bg: var(--faf-color-warning, #eab308);
          --toast-text: var(--faf-color-gray-900, #111827);
        }

        /* 3. State logic просто читает готовые переменные, не зная о теме */
        /* 3. State logic simply reads ready variables, unaware of the theme */
        :host {
          background-color: var(--toast-bg);
          color: var(--toast-text);
        }

        :host(.hiding) {
          opacity: 0;
          transform: translateX(100%);
        }

        .faf-toast-icon {
          flex-shrink: 0;
          width: 1.25rem;
          height: 1.25rem;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--toast-text);
        }

        .faf-toast-message {
          flex: 1;
        }

        .faf-toast-close {
          flex-shrink: 0;
          background: transparent;
          border: none;
          color: var(--toast-text);
          opacity: 0.7;
          cursor: pointer;
          padding: var(--faf-spacing-1);
          border-radius: var(--faf-radius-sm);
          font-size: 1.25rem;
          line-height: 1;
          transition: opacity 0.2s;
        }

        .faf-toast-close:hover {
          opacity: 1;
        }

        @keyframes faf-toast-slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      </style>
      <span class="faf-toast-icon" aria-hidden="true">${this._getIcon(type)}</span>
      <span class="faf-toast-message">${message}</span>
      <button class="faf-toast-close" aria-label="Close notification" type="button">×</button>
    `;
  }

  private _getIcon(type: ToastType): string {
    const icons: Record<ToastType, string> = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    };
    return icons[type] || "ℹ";
  }

  private _bindEvents(): void {
    const closeBtn = this._shadow.querySelector(".faf-toast-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.hide());
    }
  }

  private _startAutoHide(): void {
    const duration = parseInt(this.getAttribute("duration") || "5000", 10);
    this._hideTimeout = window.setTimeout(() => {
      this.hide();
    }, duration);
  }

  private _checkContrast(): void {
    const type = (this.getAttribute("type") || "info") as ToastType;
    const colors = TOAST_COLORS[type];

    // Проверка контраста через единый API FafContrast
    // Contrast check via unified FafContrast API
    const isAccessible = FafContrast.isAccessible(
      colors.text,
      colors.bg,
      "AA",
      "normal",
    );

    if (!isAccessible) {
      // Определяем рекомендуемый цвет текста (чёрный или белый)
      // Determine recommended text color (black or white)
      const whiteContrast = FafContrast.calculateContrast("#ffffff", colors.bg);
      const blackContrast = FafContrast.calculateContrast("#000000", colors.bg);
      const recommendedText =
        whiteContrast > blackContrast ? "#ffffff" : "#000000";

      console.warn(
        `⚠️ Toast of type "${type}" has insufficient contrast. Recommended text color: ${recommendedText}`,
      );
    }
  }

  public hide(): void {
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }

    this.classList.add("hiding");
    setTimeout(() => {
      this.remove();
    }, 300);
  }
}

if (!customElements.get("faf-toast-container")) {
  customElements.define("faf-toast-container", FafToastContainer);
}

if (!customElements.get("faf-toast")) {
  customElements.define("faf-toast", FafToast);
}
