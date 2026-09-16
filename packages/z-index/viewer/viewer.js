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
//  Импортируем CSS паттернов через Vite (они будут инлайнены автоматически)
import "../src/patterns/faf.modal.css";
import "../src/patterns/faf.toast.css";
import "../src/patterns/faf.dropdown.css";
import "../src/patterns/faf.tooltip.css";
import "../src/styles/tokens.generated.css";

//  Import TypeScript pattern files (they will register Web Components)
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
        description:
          "Базовый слой (контент страницы) / Base layer (page content)",
      },
      {
        name: "dropdown",
        value: 1000,
        description: "Дропдауны, меню, селекторы / Dropdowns, menus, selectors",
      },
      {
        name: "sticky",
        value: 1020,
        description: "Sticky элементы (header, sidebar) / Sticky elements",
      },
      {
        name: "fixed",
        value: 1030,
        description: "Fixed элементы (navbar) / Fixed elements (navbar)",
      },
      {
        name: "modal-backdrop",
        value: 1040,
        description: "Backdrop модалки (затемнение) / Modal backdrop (dimming)",
      },
      {
        name: "modal",
        value: 1050,
        description: "Модальное окно / Modal window",
      },
      {
        name: "popover",
        value: 1060,
        description: "Popover (всплывающие панели) / Popover (floating panels)",
      },
      {
        name: "tooltip",
        value: 1070,
        description: "Tooltip (всплывающие подсказки) / Tooltip (hover hints)",
      },
      {
        name: "toast",
        value: 1080,
        description:
          "Toast (уведомления, поверх всего) / Toast (notifications, above all)",
      },
    ];

    return `
      <section class="tokens-section">
        <h2>Z-Index Tokens</h2>
        <p style="color: var(--faf-color-text-muted, #6b7280); margin-bottom: var(--faf-spacing-6, 1.5rem);">
          Именованные значения z-index вместо магических чисел. 
          Используй токены в своих компонентах для соблюдения Layer Contract.
          <br/>
          Named z-index values instead of magic numbers. 
          Use tokens in your components to follow the Layer Contract.
        </p>
        <div class="tokens-list">
          ${tokens
            .map(
              (token) => `
            <div class="token-item">
              <div class="token-value">${token.value}</div>
              <div class="token-info">
                <code>--faf-zindex-${token.name}</code>
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
        <h2>Stacking Context<br/>Контекст наложения</h2>
        <p style="color: var(--faf-color-text-muted, #6b7280); margin-bottom: var(--faf-spacing-6, 1.5rem);">
          Stacking context — это группа элементов, которые накладываются друг на друга.<br/>
          z-index работает только внутри своего stacking context.
        </p>
        <div class="stacking-examples">
          <div class="example">
            <h3>Пример 1: Базовый stacking context<br/>Example 1: Basic stacking context</h3>
            <div class="demo-container">
              <div class="box box-1" style="display: flex; align-items: flex-end; padding-bottom: 8px;">
                <span style="font-size: 0.75rem;">Box 1<br/>z-index: 1</span>
              </div>
              <div class="box box-2" style="display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 0.75rem;">Box 2<br/>z-index: 2</span>
              </div>
            </div>
            <p>Box 2 поверх Box 1, потому что z-index больше.</p>
          </div>
          
          <div class="example">
            <h3>Пример 2: Вложенный stacking context<br/>Example 2: Nested stacking context</h3>
            <div class="demo-container">
              <div class="box box-1" style="display: flex; align-items: flex-end; padding-bottom: 8px;">
                <span style="font-size: 0.75rem;">Box 1<br/>z-index: 1</span>
                <div class="box box-3" style="display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 0.65rem;">Box 3<br/>z-index: 3</span>
                </div>
              </div>
              <div class="box box-2" style="display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 0.75rem;">Box 2<br/>z-index: 2</span>
              </div>
            </div>
            <p>Box 3 НЕ поверх Box 2, потому что Box 3 внутри stacking context Box 1.</p>
          </div>
          
          <div class="example">
            <h3>Пример 3: opacity создаёт stacking context<br/>Example 3: opacity creates stacking context</h3>
            <div class="demo-container">
              <div class="box box-1" style="opacity: 0.99; display: flex; align-items: flex-end; padding-bottom: 8px;">
                <span style="font-size: 0.75rem;">Box 1<br/>opacity: 0.99<br/>z-index: 1</span>
                <div class="box box-3" style="display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 0.65rem;">Box 3<br/>z-index: 3</span>
                </div>
              </div>
              <div class="box box-2" style="display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 0.75rem;">Box 2<br/>z-index: 2</span>
              </div>
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
        <h2>Patterns — Эталонные реализации / Reference Implementations</h2>
        <p style="color: var(--faf-color-text-muted, #6b7280); margin-bottom: var(--faf-spacing-6, 1.5rem);">
          Эти паттерны демонстрируют правильное использование z-index токенов. 
          Используйте их как готовые компоненты или как референс для своих.
          <br/>
          These patterns demonstrate correct z-index token usage.
          Use them as ready-made components or as a reference for your own.
        </p>
        <div class="patterns-list">
          <div class="pattern">
            <h3>🪟 Модалка / Modal (FafModal)</h3>
            <ul>
              <li>Backdrop: <code>--faf-zindex-modal-backdrop</code> (1040)</li>
              <li>Модалка / Modal: <code>--faf-zindex-modal</code> (1050)</li>
              <li>Focus Trap из Faf-Focus</li>
              <li>Закрытие по Escape, клику на backdrop / Close on Escape, backdrop click</li>
              <li>Восстановление фокуса / Focus restoration</li>
            </ul>
          </div>
          
          <div class="pattern">
            <h3>🔔 Тост / Toast (FafToast)</h3>
            <ul>
              <li>Контейнер / Container: <code>--faf-zindex-toast</code> (1080)</li>
              <li>Проверка контрастности через Faf-Contrast / Contrast check via Faf-Contrast</li>
              <li>Автоматическое исчезновение через 5 сек / Auto-dismiss after 5 sec</li>
              <li>Типы / Types: success, error, warning, info</li>
            </ul>
          </div>
          
          <div class="pattern">
            <h3>📋 Дропдаун / Dropdown (FafDropdown)</h3>
            <ul>
              <li>Меню / Menu: <code>--faf-zindex-dropdown</code> (1000)</li>
              <li>Закрытие по клику вне / Close on outside click</li>
              <li>Keyboard navigation (стрелки ↑↓ / arrows ↑↓)</li>
              <li>Закрытие по Escape / Close on Escape</li>
            </ul>
          </div>
          
          <div class="pattern">
            <h3> Тултип / Tooltip (FafTooltip)</h3>
            <ul>
              <li>Tooltip: <code>--faf-zindex-tooltip</code> (1070)</li>
              <li>Показ при hover И focus / Show on hover AND focus</li>
              <li>Позиционирование: top/bottom / Positioning: top/bottom</li>
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
        <h2> Live Demo — Попробуй паттерны в действии / Try patterns in action</h2>
        <p style="color: var(--faf-color-text-muted, #6b7280); margin-bottom: var(--faf-spacing-6, 1.5rem);">
          Нажимай кнопки, чтобы увидеть, как работают паттерны и как они накладываются друг на друга.
          <br/>
          Click buttons to see how patterns work and how they stack.
        </p>
        <div class="demo-buttons">
          <button class="demo-button" data-action="open-modal"> Открыть модалку / Open Modal</button>
          <button class="demo-button" data-action="show-toast">🔔 Показать тост / Show Toast</button>
          <button class="demo-button" data-action="open-dropdown"> Открыть дропдаун / Open Dropdown</button>
        </div>
        
        <div class="demo-area">
          <p>Область для демонстрации паттернов: / Pattern demonstration area:</p>
          
          <!-- Demo dropdown / Демо дропдауна -->
          <div style="margin-top: var(--faf-spacing-8, 2rem);">
            <faf-dropdown>
              <span slot="trigger">Выберите действие / Select action</span>
              <faf-dropdown-item>Edit / Редактировать</faf-dropdown-item>
              <faf-dropdown-item>Delete / Удалить</faf-dropdown-item>
              <faf-dropdown-divider></faf-dropdown-divider>
              <faf-dropdown-item>Export / Экспорт</faf-dropdown-item>
            </faf-dropdown>
          </div>
          
          <!-- Demo tooltip / Демо тултипа -->
          <div style="margin-top: var(--faf-spacing-8, 2rem); display: inline-block;">
            <faf-tooltip content="Это всплывающая подсказка! / This is a tooltip!" position="top">
              <button slot="trigger" class="demo-button">💬 Наведи на меня / Hover me</button>
            </faf-tooltip>
          </div>
        </div>
        
        <!-- Modal (hidden by default) / Модалка (скрыта по умолчанию) -->
        <faf-modal id="demo-modal">
          <span slot="title">Демо модалка / Demo Modal</span>
          <p>Это содержимое модалки. Она использует токены: / This is modal content. It uses tokens:</p>
          <ul style="margin: var(--faf-spacing-4, 1rem) 0; padding-left: var(--faf-spacing-6, 1.5rem);">
            <li><code>--faf-zindex-modal</code> (1050)</li>
            <li><code>--faf-zindex-modal-backdrop</code> (1040)</li>
          </ul>
          <p>Попробуйте нажать <kbd>Tab</kbd> — фокус останется внутри модалки (Focus Trap). / Try pressing <kbd>Tab</kbd> — focus will stay inside modal (Focus Trap).</p>
          <p>Нажмите <kbd>Escape</kbd> или кликните на затемнение, чтобы закрыть. / Press <kbd>Escape</kbd> or click backdrop to close.</p>
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
                "Successfully saved!",
                "An error occurred",
                "Warning: please check data",
                "New update available",
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
