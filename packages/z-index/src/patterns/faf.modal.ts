/**
 * @module FafModal
 * @description Reference implementation of a modal window with focus trap and accessibility features.
 *              Эталонная реализация модального окна с ловушкой фокуса и функциями доступности.
 *
 * @contract FAF Web Components Styling Contract
 *           - Encapsulation: Structure and states are managed inside Shadow DOM.
 *             Инкапсуляция: Структура и состояния управляются внутри Shadow DOM.
 *           - Theming: Built on `--faf-*` CSS custom properties.
 *             Темизация: Построено на CSS custom properties `--faf-*`.
 *           - Context: `:host-context` is used ONLY for context-aware variable mapping, never for duplicating state logic.
 *             Контекст: `:host-context` используется ТОЛЬКО для маппинга переменных, а не для дублирования логики состояний.
 */

import { saveFocus, restoreFocus, trapFocus } from "../utils/focus.js";

export class FafModal extends HTMLElement {
  private _untrap: (() => void) | null = null;
  private _shadow: ShadowRoot;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.render();
    this._bindEvents();
  }

  disconnectedCallback(): void {
    this.close();
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  private render(): void {
    this._shadow.innerHTML = `
      <style>
        /* Host base state / Базовое состояние хоста */
        :host {
          display: none;
          --modal-bg: var(--faf-color-surface, #ffffff);
          --modal-text: var(--faf-color-text, #111827);
          --modal-border: var(--faf-color-gray-300, #d1d5db);
          --close-hover-bg: var(--faf-color-gray-100, #f3f4f6);
          --close-hover-text: var(--faf-color-text, #111827);
        }

        /* Dark theme override / Переопределение для тёмной темы */
        :host-context([data-theme="dark"]) {
          --modal-bg: var(--faf-color-surface, #1f2937);
          --modal-text: var(--faf-color-text, #f9fafb);
          --modal-border: var(--faf-color-gray-600, #4b5563);
          --close-hover-bg: var(--faf-color-gray-700, #374151);
          --close-hover-text: var(--faf-color-text, #f9fafb);
        }

        /* Host open state / Состояние хоста: открыто */
        :host([open]) {
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: var(--faf-zindex-modal, 1050);
        }

        /* Backdrop (dimming) / Backdrop (затемнение) */
        .faf-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: var(--faf-zindex-modal-backdrop, 1040);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        /* Backdrop visible state / Состояние видимости backdrop */
        :host([open]) .faf-modal-backdrop {
          opacity: 1;
        }

        /* Modal window itself / Само модальное окно */
        .faf-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.95);
          z-index: var(--faf-zindex-modal, 1050);
          background-color: var(--modal-bg);
          color: var(--modal-text);
          border: 1px solid var(--modal-border);
          border-radius: var(--faf-radius-lg, 8px);
          box-shadow: var(--faf-shadow-modal, 0 20px 25px rgba(0, 0, 0, 0.1));
          padding: var(--faf-spacing-modal-padding, 2rem);
          max-width: 500px;
          width: 90vw;
          max-height: 90vh;
          overflow-y: auto;
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        /* Modal open state / Состояние модалки: открыто */
        :host([open]) .faf-modal {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        /* Modal header / Шапка модалки */
        .faf-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--faf-spacing-4, 1rem);
        }

        /* Modal title / Заголовок модалки */
        .faf-modal-title {
          font-size: var(--faf-font-size-xl, 1.25rem);
          font-weight: var(--faf-font-weight-semibold, 600);
          margin: 0;
        }

        /* Close button / Кнопка закрытия */
        .faf-modal-close {
          background: transparent;
          border: none;
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
          color: var(--faf-color-text-muted, #6b7280);
          padding: var(--faf-spacing-1, 0.25rem);
          border-radius: var(--faf-radius-sm, 4px);
          transition: background-color 0.2s, color 0.2s;
        }

        /* Close button hover state / Состояние hover для кнопки закрытия */
        .faf-modal-close:hover {
          background-color: var(--close-hover-bg);
          color: var(--close-hover-text);
        }

        /* Modal body / Тело модалки */
        .faf-modal-body {
          font-size: var(--faf-font-size-base, 1rem);
          line-height: var(--faf-line-height-normal, 1.5);
        }
      </style>
      <div class="faf-modal-backdrop" data-testid="backdrop"></div>
      <div class="faf-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header class="faf-modal-header">
          <h2 id="modal-title" class="faf-modal-title"><slot name="title">Modal Title</slot></h2>
          <button class="faf-modal-close" data-testid="close" aria-label="Close modal" type="button">×</button>
        </header>
        <div class="faf-modal-body">
          <slot></slot>
        </div>
      </div>
    `;
  }

  private _bindEvents(): void {
    const backdrop = this._shadow.querySelector('[data-testid="backdrop"]');
    const closeBtn = this._shadow.querySelector('[data-testid="close"]');

    if (backdrop) backdrop.addEventListener("click", () => this.close());
    if (closeBtn) closeBtn.addEventListener("click", () => this.close());

    document.addEventListener("keydown", this._handleKeyDown);
  }

  private _handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Escape" && this.hasAttribute("open")) {
      e.preventDefault();
      this.close();
    }
  };

  public open(): void {
    if (this.hasAttribute("open")) return;
    saveFocus();
    this.setAttribute("open", "");
    const modalContent = this._shadow.querySelector(".faf-modal");
    if (modalContent) {
      this._untrap = trapFocus(modalContent as HTMLElement);
    }
    this.dispatchEvent(new CustomEvent("faf-modal-open", { bubbles: true }));
  }

  public close(): void {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    if (this._untrap) {
      this._untrap();
      this._untrap = null;
    }
    restoreFocus();
    this.dispatchEvent(new CustomEvent("faf-modal-close", { bubbles: true }));
  }
}

if (!customElements.get("faf-modal")) {
  customElements.define("faf-modal", FafModal);
}
