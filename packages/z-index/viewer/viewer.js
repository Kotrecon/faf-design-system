/**
 * @module ZIndexViewer
 * @description Interactive viewer for Z-Index tokens, stacking context, and pattern demos.
 *              Интерактивный viewer для токенов Z-Index, контекста наложения и демо паттернов.
 *
 * @contract FAF Styling Contract
 *           - Imports real tokens and pattern styles from the design system.
 *             Импортирует реальные токены и стили паттернов из дизайн-системы.
 */

// 🔥 Import real tokens from Foundations (SSOT for colors)
// 🔥 Импортируем реальные токены из Foundations (SSOT для цветов)
import "@faf/foundations/styles";

// 🔥 Import pattern CSS via Vite (they will be inlined automatically)
// 🔥 Импортируем CSS паттернов через Vite (они будут инлайнены автоматически)
import "../src/patterns/faf.modal.css";
import "../src/patterns/faf.toast.css";
import "../src/patterns/faf.dropdown.css";
import "../src/patterns/faf.tooltip.css";
import "../src/styles/tokens.generated.css";

// 🔥 Import TypeScript pattern files (they will register Web Components)
// 🔥 Импортируем TypeScript файлы паттернов (они зарегистрируют Web Components)
import "../src/patterns/faf.modal.ts";
import "../src/patterns/faf.toast.ts";
import "../src/patterns/faf.dropdown.ts";
import "../src/patterns/faf.tooltip.ts";

class ZIndexViewer {
  constructor() {
    this.currentCategory = this._getCategoryFromUrl() || "tokens";
    this.currentTheme = localStorage.getItem("faf-theme") || "light";

    this.categories = [
      { id: "tokens", name: "Tokens", icon: "📊" },
      { id: "stacking", name: "Stacking Context", icon: "📚" },
      { id: "patterns", name: "Patterns", icon: "🎨" },
      { id: "demo", name: "Live Demo", icon: "🔥" },
    ];

    this._init();
  }

  _init() {
    this._applyTheme();
    this._bindThemeToggle();
    this._bindEvents();
    this._renderCategory();
  }

  // ==========================================
  // Theme Management / Управление темой
  // ==========================================

  _applyTheme() {
    document.documentElement.setAttribute("data-theme", this.currentTheme);
    const toggleBtn = document.getElementById("themeToggle");
    if (toggleBtn) {
      toggleBtn.textContent =
        this.currentTheme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode";
    }
  }

  _bindThemeToggle() {
    const toggleBtn = document.getElementById("themeToggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
        localStorage.setItem("faf-theme", this.currentTheme);
        this._applyTheme();
      });
    }
  }

  // ==========================================
  // Category Switching / Переключение категорий
  // ==========================================

  _bindEvents() {
    document.querySelectorAll(".category-switcher button").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.currentCategory = btn.dataset.category;
        this._updateActiveCategory();
        this._renderCategory();
        this._updateUrl();
      });
    });
  }

  _updateActiveCategory() {
    document.querySelectorAll(".category-switcher button").forEach((btn) => {
      btn.classList.toggle(
        "active",
        btn.dataset.category === this.currentCategory,
      );
    });
  }

  _renderCategory() {
    const content = document.getElementById("categoryContent");

    switch (this.currentCategory) {
      case "tokens":
        content.innerHTML = this._renderTokens();
        break;
      case "stacking":
        content.innerHTML = this._renderStacking();
        break;
      case "patterns":
        content.innerHTML = this._renderPatterns();
        break;
      case "demo":
        content.innerHTML = this._renderDemo();
        // Small delay to allow DOM to render / Небольшая задержка, чтобы DOM успел отрендериться
        setTimeout(() => this._bindDemoEvents(), 50);
        break;
    }
  }

  // ==========================================
  // Section: Tokens / Секция: Токены
  // ==========================================

  _renderTokens() {
    const tokens = [
      {
        name: "base",
        value: 0,
        description: "Базовый слой (контент страницы)",
      },
      {
        name: "dropdown",
        value: 1000,
        description: "Дропдауны, меню, селекторы",
      },
      {
        name: "sticky",
        value: 1020,
        description: "Sticky элементы (header, sidebar)",
      },
      { name: "fixed", value: 1030, description: "Fixed элементы (navbar)" },
      {
        name: "modal-backdrop",
        value: 1040,
        description: "Backdrop модалки (затемнение)",
      },
      { name: "modal", value: 1050, description: "Модальное окно" },
      {
        name: "popover",
        value: 1060,
        description: "Popover (всплывающие панели)",
      },
      {
        name: "tooltip",
        value: 1070,
        description: "Tooltip (всплывающие подсказки)",
      },
      {
        name: "toast",
        value: 1080,
        description: "Toast (уведомления, поверх всего)",
      },
    ];

    return `
      <section class="tokens-section">
        <h2>Z-Index Tokens</h2>
        <p style="color: var(--faf-color-text-muted, #6b7280); margin-bottom: 1.5rem;">
          Именованные значения z-index вместо магических чисел. 
          Используй токены в своих компонентах для соблюдения Layer Contract.
        </p>
        <div class="tokens-list">
          ${tokens
            .map(
              (token) => `
            <div class="token-item">
              <div class="token-value">${token.value}</div>
              <div class="token-info">
                <code>--faf-z-${token.name}</code>
                <span class="token-description">${token.description}</span>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </section>
    `;
  }

  // ==========================================
  // Section: Stacking Context / Секция: Контекст наложения
  // ==========================================

  _renderStacking() {
    return `
      <section class="stacking-section">
        <h2>Stacking Context — Интерактивные примеры</h2>
        <p style="color: var(--faf-color-text-muted, #6b7280); margin-bottom: 1.5rem;">
          Stacking context — это группа элементов, которые накладываются друг на друга в определённом порядке.
          z-index работает только внутри своего stacking context.
        </p>
        <div class="stacking-examples">
          <div class="example">
            <h3>Пример 1: Базовый stacking context</h3>
            <div class="demo-container">
              <div class="box box-1">Box 1 (z-index: 1)</div>
              <div class="box box-2">Box 2 (z-index: 2)</div>
            </div>
            <p>Box 2 поверх Box 1, потому что z-index больше.</p>
          </div>
          
          <div class="example">
            <h3>Пример 2: Вложенный stacking context</h3>
            <div class="demo-container">
              <div class="box box-1">
                Box 1 (z-index: 1)
                <div class="box box-3">Box 3 (z-index: 3, внутри Box 1)</div>
              </div>
              <div class="box box-2">Box 2 (z-index: 2)</div>
            </div>
            <p>Box 3 НЕ поверх Box 2, потому что Box 3 внутри stacking context Box 1.</p>
          </div>
          
          <div class="example">
            <h3>Пример 3: opacity создаёт stacking context</h3>
            <div class="demo-container">
              <div class="box box-1" style="opacity: 0.99;">
                Box 1 (opacity: 0.99, z-index: 1)
                <div class="box box-3">Box 3 (z-index: 3)</div>
              </div>
              <div class="box box-2">Box 2 (z-index: 2)</div>
            </div>
            <p>opacity &lt; 1 создаёт stacking context. Box 3 внутри Box 1, даже при z-index: 3.</p>
          </div>
        </div>
      </section>
    `;
  }

  // ==========================================
  // Section: Patterns / Секция: Паттерны
  // ==========================================

  _renderPatterns() {
    return `
      <section class="patterns-section">
        <h2>Patterns — Эталонные реализации</h2>
        <p style="color: var(--faf-color-text-muted, #6b7280); margin-bottom: 1.5rem;">
          Эти паттерны демонстрируют правильное использование z-index токенов. 
          Используйте их как готовые компоненты или как референс для своих.
        </p>
        <div class="patterns-list">
          <div class="pattern">
            <h3>🪟 Модалка (FafModal)</h3>
            <ul>
              <li>Backdrop: <code>--faf-z-modal-backdrop</code> (1040)</li>
              <li>Модалка: <code>--faf-z-modal</code> (1050)</li>
              <li>Focus Trap из Faf-Focus</li>
              <li>Закрытие по Escape, клику на backdrop</li>
              <li>Восстановление фокуса</li>
            </ul>
          </div>
          
          <div class="pattern">
            <h3>🔔 Тост (FafToast)</h3>
            <ul>
              <li>Контейнер: <code>--faf-z-toast</code> (1080)</li>
              <li>Проверка контрастности через Faf-Contrast</li>
              <li>Автоматическое исчезновение через 5 сек</li>
              <li>Типы: success, error, warning, info</li>
            </ul>
          </div>
          
          <div class="pattern">
            <h3>📋 Дропдаун (FafDropdown)</h3>
            <ul>
              <li>Меню: <code>--faf-z-dropdown</code> (1000)</li>
              <li>Закрытие по клику вне</li>
              <li>Keyboard navigation (стрелки ↑↓)</li>
              <li>Закрытие по Escape</li>
            </ul>
          </div>
          
          <div class="pattern">
            <h3>💬 Тултип (FafTooltip)</h3>
            <ul>
              <li>Tooltip: <code>--faf-z-tooltip</code> (1070)</li>
              <li>Показ при hover И focus</li>
              <li>Позиционирование: top/bottom</li>
              <li>ARIA: aria-describedby</li>
            </ul>
          </div>
        </div>
      </section>
    `;
  }

  // ==========================================
  // Section: Live Demo / Секция: Живое демо
  // ==========================================

  _renderDemo() {
    return `
      <section class="demo-section">
        <h2>🔥 Live Demo — Попробуй паттерны в действии</h2>
        <p style="color: var(--faf-color-text-muted, #6b7280); margin-bottom: 1.5rem;">
          Нажимай кнопки, чтобы увидеть, как работают паттерны и как они накладываются друг на друга.
        </p>
        <div class="demo-buttons">
          <button class="demo-button" data-action="open-modal">🪟 Открыть модалку</button>
          <button class="demo-button" data-action="show-toast">🔔 Показать тост</button>
          <button class="demo-button" data-action="open-dropdown">📋 Открыть дропдаун</button>
        </div>
        
        <div class="demo-area">
          <p>Область для демонстрации паттернов:</p>
          
          <!-- Demo dropdown / Демо дропдауна -->
          <div style="margin-top: 2rem;">
            <faf-dropdown>
              <span slot="trigger">Выберите действие</span>
              <faf-dropdown-item>Редактировать</faf-dropdown-item>
              <faf-dropdown-item>Удалить</faf-dropdown-item>
              <faf-dropdown-divider></faf-dropdown-divider>
              <faf-dropdown-item>Экспорт</faf-dropdown-item>
            </faf-dropdown>
          </div>
          
          <!-- Demo tooltip / Демо тултипа -->
          <div style="margin-top: 2rem; display: inline-block;">
            <faf-tooltip content="Это всплывающая подсказка!" position="top">
              <button slot="trigger" class="demo-button">💬 Наведи на меня</button>
            </faf-tooltip>
          </div>
        </div>
        
        <!-- Modal (hidden by default) / Модалка (скрыта по умолчанию) -->
        <faf-modal id="demo-modal">
          <span slot="title">Демо модалка</span>
          <p>Это содержимое модалки. Она использует токены:</p>
          <ul style="margin: 1rem 0; padding-left: 1.5rem;">
            <li><code>--faf-z-modal</code> (1050)</li>
            <li><code>--faf-z-modal-backdrop</code> (1040)</li>
          </ul>
          <p>Попробуйте нажать <kbd>Tab</kbd> — фокус останется внутри модалки (Focus Trap).</p>
          <p>Нажмите <kbd>Escape</kbd> или кликните на затемнение, чтобы закрыть.</p>
        </faf-modal>
      </section>
    `;
  }

  _bindDemoEvents() {
    document.querySelectorAll(".demo-button[data-action]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // 🔥 Stop propagation to prevent global listeners from closing patterns
        // 🔥 Останавливаем всплытие, чтобы глобальные listeners не закрывали паттерны
        e.stopPropagation();

        const action = btn.dataset.action;

        switch (action) {
          case "open-modal": {
            const modal = document.getElementById("demo-modal");
            if (modal && typeof modal.open === "function") {
              modal.open();
            }
            break;
          }

          case "show-toast": {
            const container = document.querySelector("faf-toast-container");
            if (container) {
              const types = ["success", "error", "warning", "info"];
              const messages = [
                "Успешно сохранено!",
                "Произошла ошибка",
                "Внимание: проверьте данные",
                "Новое обновление доступно",
              ];
              const randomIndex = Math.floor(Math.random() * types.length);

              const toast = document.createElement("faf-toast");
              toast.setAttribute("message", messages[randomIndex]);
              toast.setAttribute("type", types[randomIndex]);
              toast.setAttribute("duration", "5000");
              container.appendChild(toast);
            }
            break;
          }

          case "open-dropdown": {
            const dropdown = document.querySelector("faf-dropdown");
            if (dropdown && typeof dropdown.toggle === "function") {
              dropdown.toggle();
            }
            break;
          }
        }
      });
    });
  }

  // ==========================================
  // URL Management / Управление URL
  // ==========================================

  _getCategoryFromUrl() {
    return new URLSearchParams(window.location.search).get("category");
  }

  _updateUrl() {
    const params = new URLSearchParams();
    params.set("category", this.currentCategory);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
  }
}

// Initialization / Инициализация
document.addEventListener("DOMContentLoaded", () => {
  new ZIndexViewer();
});
