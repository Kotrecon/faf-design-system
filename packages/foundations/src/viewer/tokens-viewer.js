class TokensViewer {
  constructor(container) {
    this.container = container;
    this.currentCategory = "colors";
    this.currentTheme = "light";

    this.categories = [
      { id: "colors", name: "Colors", icon: "🎨" },
      { id: "typography", name: "Typography", icon: "🔤" },
      { id: "spacing", name: "Spacing", icon: "📏" },
      { id: "shadows", name: "Shadows", icon: "🌑" },
    ];

    this.init();
  }

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

  bindEvents() {
    this.container.querySelectorAll(".theme-switcher button").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.currentTheme = btn.dataset.theme;
        this.applyTheme();
      });
    });

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

  applyTheme() {
    if (this.currentTheme === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", this.currentTheme);
    }

    this.container.querySelectorAll(".theme-switcher button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.theme === this.currentTheme);
    });
  }

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

  renderCategory() {
    const content = this.container.querySelector("#categoryContent");

    switch (this.currentCategory) {
      case "colors":
        content.innerHTML = this.renderColors();
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
    }
  }

  renderColors() {
    const colors = ["blue", "gray", "green", "red", "yellow", "purple"];
    const scales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    return `
    <section>
      <h2>Color Palette (oklch)</h2>
      ${colors
        .map(
          (color) => `
        <div style="margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1rem;">${color}</h3>
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

  renderTypography() {
    return `
      <section>
        <h2>Typography (Fluid)</h2>
        <div class="type-sample">
          <h1 style="font-size: var(--faf-font-size-fluid-3xl); font-weight: 700;">Heading 1</h1>
          <code>--faf-font-size-fluid-3xl</code>
        </div>
        <div class="type-sample">
          <h2 style="font-size: var(--faf-font-size-fluid-2xl); font-weight: 600;">Heading 2</h2>
          <code>--faf-font-size-fluid-2xl</code>
        </div>
        <div class="type-sample">
          <p style="font-size: var(--faf-font-size-fluid-base);">Base paragraph text</p>
          <code>--faf-font-size-fluid-base</code>
        </div>
        <div class="type-sample">
          <p style="font-size: var(--faf-font-size-fluid-sm); color: var(--faf-color-text-muted);">Small text</p>
          <code>--faf-font-size-fluid-sm</code>
        </div>
      </section>
    `;
  }

  renderSpacing() {
    const spacings = [
      { name: "0", token: "0px" },
      { name: "1", token: "0.25rem" },
      { name: "2", token: "0.5rem" },
      { name: "3", token: "0.75rem" },
      { name: "4", token: "1rem" },
      { name: "6", token: "1.5rem" },
      { name: "8", token: "2rem" },
      { name: "12", token: "3rem" },
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

  renderShadows() {
    const shadows = ["sm", "md", "lg", "xl"];

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
}

// Инициализация
const viewer = new TokensViewer(document.getElementById("app"));
