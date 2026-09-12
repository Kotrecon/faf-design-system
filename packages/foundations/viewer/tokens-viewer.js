/**
 * @module Tokens Viewer
 * @description Interactive viewer for design tokens (colors, typography, spacing, shadows, radius, opacity, transitions).
 *              Интерактивный просмотрщик токенов дизайна (цвета, типографика, отступы, тени, радиусы, прозрачность, переходы).
 */

class TokensViewer {
  /**
   * @param {HTMLElement} container - The DOM element to render the viewer into.
   *                                  DOM-элемент, в который будет отрендерен просмотрщик.
   */
  constructor(container) {
    this.container = container;
    this.currentCategory = "colors";
    this.currentTheme = "light";

    this.categories = [
      { id: "colors", name: "Colors", icon: "🎨" },
      { id: "typography", name: "Typography", icon: "🔤" },
      { id: "spacing", name: "Spacing", icon: "📏" },
      { id: "shadows", name: "Shadows", icon: "🌑" },
      { id: "radius", name: "Radius", icon: "🎯" },
      { id: "opacity", name: "Opacity", icon: "👁️" },
      { id: "transitions", name: "Transitions", icon: "⚡" },
    ];

    this.init();
  }

  /**
   * Initialize the viewer / Инициализация просмотрщика
   */
  init() {
    this.container.innerHTML = `
      <header class="viewer-header">
        <h1>Faf Design Tokens</h1>
        <div class="theme-switcher">
          <button data-theme="light" class="active">Light</button>
          <button data-theme="dark">Dark</button>
          <button data-theme="system">System</button>
        </div>
      </header>
      
      <nav class="category-switcher">
        ${this.categories
          .map(
            (cat) => `
          <button data-category="${cat.id}" class="${this.currentCategory === cat.id ? "active" : ""}">
            ${cat.icon} ${cat.name}
          </button>
        `,
          )
          .join("")}
      </nav>
      
      <main class="category-content" id="categoryContent"></main>
    `;

    this.bindEvents();
    this.renderCategory();
  }

  /**
   * Bind event listeners / Привязка обработчиков событий
   */
  bindEvents() {
    // Theme switcher events / События переключателя тем
    this.container.querySelectorAll(".theme-switcher button").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.currentTheme = btn.dataset.theme;
        this.applyTheme();
      });
    });

    // Category switcher events / События переключателя категорий
    this.container
      .querySelectorAll(".category-switcher button")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          this.currentCategory = btn.dataset.category;
          this.updateActiveCategory();
          this.renderCategory();
        });
      });
  }

  /**
   * Apply the selected theme to the document / Применение выбранной темы к документу
   */
  applyTheme() {
    if (this.currentTheme === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", this.currentTheme);
    }

    // Update active button state / Обновление состояния активной кнопки
    this.container.querySelectorAll(".theme-switcher button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.theme === this.currentTheme);
    });
  }

  /**
   * Update the active category button UI / Обновление UI активной кнопки категории
   */
  updateActiveCategory() {
    this.container
      .querySelectorAll(".category-switcher button")
      .forEach((btn) => {
        btn.classList.toggle(
          "active",
          btn.dataset.category === this.currentCategory,
        );
      });
  }

  /**
   * Render the content for the current category / Рендеринг контента для текущей категории
   */
  renderCategory() {
    const content = this.container.querySelector("#categoryContent");

    switch (this.currentCategory) {
      case "colors":
        content.innerHTML = this.renderColors();
        setTimeout(() => this.adjustSwatchContrast(), 50);
        break;
      case "typography":
        content.innerHTML = this.renderTypography();
        break;
      case "spacing":
        content.innerHTML = this.renderSpacing();
        break;
      case "shadows":
        content.innerHTML = this.renderShadows();
        break;
      case "radius":
        content.innerHTML = this.renderRadius();
        break;
      case "opacity":
        content.innerHTML = this.renderOpacity();
        break;
      case "transitions":
        content.innerHTML = this.renderTransitions();
        break;
    }
  }

  /**
   * Render colors section / Рендеринг секции цветов
   */
  renderColors() {
    const colors = [
      "blue",
      "gray",
      "green",
      "red",
      "yellow",
      "orange",
      "purple",
    ];
    const scales = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    return `
    <section>
      <h2>Color Palette (oklch)</h2>
      ${colors
        .map(
          (color) => `
        <div style="margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1rem; text-transform: capitalize;">${color}</h3>
          <div class="color-scale">
            ${scales
              .map(
                (scale) => `
              <div class="color-swatch" style="background: var(--faf-color-${color}-${scale})">
                <span>${scale}</span>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `,
        )
        .join("")}
      
      <h2>Brand Colors</h2>
      <div class="color-scale" style="margin-bottom: 2rem;">
        <div class="color-swatch" style="background: var(--faf-color-brand-firefly)">
          <span>Firefly</span>
        </div>
        <div class="color-swatch" style="background: var(--faf-color-brand-ai)">
          <span>AI</span>
        </div>
        <div class="color-swatch" style="background: var(--faf-color-brand-flow)">
          <span>Flow</span>
        </div>
      </div>
      
      <h2>Accent Colors</h2>
      <div class="color-scale">
        <div class="color-swatch" style="background: var(--faf-color-accent-hot)">
          <span>Hot</span>
        </div>
        <div class="color-swatch" style="background: var(--faf-color-accent-electric)">
          <span>Electric</span>
        </div>
        <div class="color-swatch" style="background: var(--faf-color-accent-lime)">
          <span>Lime</span>
        </div>
      </div>
    </section>
  `;
  }

  /**
   * Render typography section / Рендеринг секции типографики
   */
  renderTypography() {
    return `
      <section>
        <h2>Typography (Fluid)</h2>
        <div class="type-sample">
          <h1 style="font-size: var(--faf-font-size-3xl); font-weight: var(--faf-font-weight-bold);">Heading 1</h1>
          <code>--faf-font-size-3xl</code>
        </div>
        <div class="type-sample">
          <h2 style="font-size: var(--faf-font-size-2xl); font-weight: var(--faf-font-weight-semibold);">Heading 2</h2>
          <code>--faf-font-size-2xl</code>
        </div>
        <div class="type-sample">
          <p style="font-size: var(--faf-font-size-base);">Base paragraph text</p>
          <code>--faf-font-size-base</code>
        </div>
        <div class="type-sample">
          <p style="font-size: var(--faf-font-size-sm); color: var(--faf-color-text-muted);">Small text</p>
          <code>--faf-font-size-sm</code>
        </div>
      </section>
    `;
  }

  /**
   * Render spacing section / Рендеринг секции отступов
   */
  renderSpacing() {
    const spacings = [
      { name: "0", token: "0px" },
      { name: "1", token: "0.25rem" },
      { name: "2", token: "0.5rem" },
      { name: "3", token: "0.75rem" },
      { name: "4", token: "1rem" },
      { name: "6", token: "1.5rem" },
      { name: "8", token: "2rem" },
      { name: "10", token: "2.5rem" },
      { name: "12", token: "3rem" },
      { name: "16", token: "4rem" },
    ];

    return `
      <section>
        <h2>Spacing Scale (4px base)</h2>
        ${spacings
          .map(
            (s) => `
          <div class="spacing-sample">
            <div class="spacing-bar" style="width: ${s.token}; height: 24px;"></div>
            <span class="spacing-label">${s.name} (${s.token})</span>
          </div>
        `,
          )
          .join("")}
      </section>
    `;
  }

  /**
   * Render shadows section / Рендеринг секции теней
   */
  renderShadows() {
    const shadows = ["none", "sm", "md", "lg", "xl", "xxl"];

    return `
      <section>
        <h2>Elevation System</h2>
        ${shadows
          .map(
            (s) => `
          <div class="shadow-sample">
            <div class="shadow-box" style="box-shadow: var(--faf-shadow-${s})">${s}</div>
          </div>
        `,
          )
          .join("")}
      </section>
    `;
  }

  /**
   * Render radius section / Рендеринг секции скруглений
   */
  renderRadius() {
    const radii = [
      { name: "none", value: "0px" },
      { name: "xs", value: "0.125rem" },
      { name: "sm", value: "0.25rem" },
      { name: "md", value: "0.5rem" },
      { name: "lg", value: "0.75rem" },
      { name: "xl", value: "1rem" },
      { name: "xxl", value: "2rem" },
      { name: "full", value: "9999px" },
    ];

    return `
      <section>
        <h2>Border Radius</h2>
        ${radii
          .map(
            (r) => `
          <div class="spacing-sample">
            <div style="width: 60px; height: 60px; background: var(--faf-color-primary); border-radius: var(--faf-radius-${r.name});"></div>
            <span class="spacing-label">${r.name} (${r.value})</span>
          </div>
        `,
          )
          .join("")}
      </section>
    `;
  }

  /**
   * Render opacity section / Рендеринг секции прозрачности
   */
  renderOpacity() {
    const opacities = [
      { name: "0", value: "0" },
      { name: "25", value: "0.25" },
      { name: "50", value: "0.5" },
      { name: "75", value: "0.75" },
      { name: "100", value: "1" },
    ];

    return `
      <section>
        <h2>Opacity</h2>
        ${opacities
          .map(
            (o) => `
          <div class="spacing-sample">
            <div style="width: 100px; height: 40px; background: var(--faf-color-primary); opacity: var(--faf-opacity-${o.name}); border: 1px dashed var(--faf-color-border);"></div>
            <span class="spacing-label">${o.name} (${o.value})</span>
          </div>
        `,
          )
          .join("")}
      </section>
    `;
  }

  /**
   * Render transitions section / Рендеринг секции переходов
   */
  renderTransitions() {
    const transitions = [
      {
        name: "color",
        value: "150ms cubic-bezier(0, 0, 0.2, 1)",
        desc: "Мгновенная реакция",
      },
      {
        name: "default",
        value: "250ms cubic-bezier(0, 0, 0.2, 1)",
        desc: "Стандартное движение",
      },
      {
        name: "transform",
        value: "350ms cubic-bezier(0.4, 0, 0.2, 1)",
        desc: "Плавное, весомое движение",
      },
    ];

    return `
      <section>
        <h2>Transitions</h2>
        <p style="margin-bottom: 2rem; color: var(--faf-color-text-muted);">
          Наведите курсор на блоки. Увеличенная амплитуда движения делает разницу в скорости очевидной.
        </p>
        ${transitions
          .map(
            (t) => `
          <div class="type-sample">
            <div style="font-weight: var(--faf-font-weight-semibold); margin-bottom: 0.25rem;">--faf-transition-${t.name}</div>
            <code style="margin-bottom: 1rem; display: block; font-size: var(--faf-font-size-xs);">${t.value}</code>
            <div 
              class="transition-demo-box" 
              style="transition: var(--faf-transition-${t.name});"
              onmouseover="this.style.transform='translateX(40px) scale(1.1)'; this.style.backgroundColor='var(--faf-color-accent-hot)'"
              onmouseout="this.style.transform='translateX(0) scale(1)'; this.style.backgroundColor='var(--faf-color-primary)'"
            >
              ${t.name}
            </div>
          </div>
        `,
          )
          .join("")}
      </section>
    `;
  }

  /**
   * Apply dynamic contrast to color swatches / Применение динамического контраста к цветовым образцам
   */
  adjustSwatchContrast() {
    const swatches = this.container.querySelectorAll(".color-swatch");

    swatches.forEach((swatch) => {
      const bgColor = window.getComputedStyle(swatch).backgroundColor;
      const rgb = bgColor.match(/\d+/g);

      if (rgb && rgb.length >= 3) {
        const r = parseInt(rgb[0]) / 255;
        const g = parseInt(rgb[1]) / 255;
        const b = parseInt(rgb[2]) / 255;

        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        const label = swatch.querySelector("span");
        if (luminance > 0.6) {
          label.classList.add("is-light");
          label.classList.remove("is-dark");
        } else {
          label.classList.add("is-dark");
          label.classList.remove("is-light");
        }
      }
    });
  }
}

// Safe initialization / Безопасная инициализация
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (app) {
    new TokensViewer(app);
  } else {
    console.error(
      "Tokens Viewer: #app container not found / Контейнер #app не найден",
    );
  }
});
