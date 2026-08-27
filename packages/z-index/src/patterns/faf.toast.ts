// packages/z-index/src/patterns/faf.toast.ts

import { isAccessible, getContrastColor } from "../utils/contrast";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

const TOAST_COLORS: Record<ToastType, { bg: string; text: string }> = {
  success: { bg: "#16a34a", text: "#000000" }, // Исправленный контраст
  error: { bg: "#dc2626", text: "#ffffff" },
  warning: { bg: "#eab308", text: "#111827" },
  info: { bg: "#2563eb", text: "#ffffff" },
};

/**
 * FafToastContainer — глобальный контейнер для тостов.
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
          top: var(--faf-spacing-4, 1rem);
          right: var(--faf-spacing-4, 1rem);
          z-index: var(--faf-z-toast, 1080);
          display: flex;
          flex-direction: column;
          gap: var(--faf-spacing-2, 0.5rem);
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
        "❌ FafToastContainer не найден. Добавьте <faf-toast-container> в body.",
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

    // Устанавливаем атрибут ДО рендера, чтобы CSS-селекторы :host([type="..."]) сработали
    this.setAttribute("type", type);
    this.setAttribute("role", "alert");
    this.setAttribute("aria-live", "polite");

    this._shadow.innerHTML = `
      <style>
        /* 1. Базовые стили и маппинг переменных по умолчанию (info) */
        :host {
          display: flex;
          align-items: center;
          gap: var(--faf-spacing-3, 0.75rem);
          padding: var(--faf-spacing-3, 0.75rem) var(--faf-spacing-4, 1rem);
          border-radius: var(--faf-radius-md, 6px);
          box-shadow: var(--faf-shadow-lg, 0 10px 15px rgba(0,0,0,0.1));
          font-size: var(--faf-font-size-fluid-sm, 0.875rem);
          font-weight: var(--faf-font-weight-medium, 500);
          line-height: var(--faf-line-height-normal, 1.5);
          pointer-events: auto;
          animation: faf-toast-slide-in 0.3s ease-out;
          opacity: 1;
          transition: opacity 0.3s ease-out, transform 0.3s ease-out;

          --toast-bg: var(--faf-color-blue-600, #2563eb);
          --toast-text: var(--faf-color-gray-50, #ffffff);
        }

        /* 2. Context-aware overrides для разных типов тостов */
        :host([type="success"]) {
          --toast-bg: var(--faf-color-green-600, #16a34a);
          --toast-text: #000000; /* Гарантированный контраст */
        }
        :host([type="error"]) {
          --toast-bg: var(--faf-color-red-600, #dc2626);
          --toast-text: var(--faf-color-gray-50, #ffffff);
        }
        :host([type="warning"]) {
          --toast-bg: var(--faf-color-yellow-500, #eab308);
          --toast-text: var(--faf-color-gray-900, #111827);
        }

        /* 3. State logic просто читает замапленные переменные */
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
        }

        .faf-toast-message {
          flex: 1;
        }

        .faf-toast-close {
          flex-shrink: 0;
          background: transparent;
          border: none;
          color: inherit;
          opacity: 0.7;
          cursor: pointer;
          padding: var(--faf-spacing-1, 0.25rem);
          border-radius: var(--faf-radius-sm, 4px);
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
    const accessible = isAccessible(colors.text, colors.bg);

    if (!accessible) {
      console.warn(
        `⚠️ Тост типа "${type}" имеет недостаточный контраст. ` +
          `Рекомендуемый цвет текста: ${getContrastColor(colors.bg)}`,
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
