// packages/contrast/viewer/viewer.js
// Viewer logic: category switching, theme toggle, contrast checker
// Логика viewer: переключение категорий, смена темы, проверка контраста

// FafContrast utility (browser version)
// Утилита FafContrast (браузерная версия)
const FafContrast = {
  parseHex(hex) {
    const result =
      /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) ||
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    if (!result) return [0, 0, 0];
    const isShort = result[1].length === 1;
    return [
      parseInt(isShort ? result[1] + result[1] : result[1], 16),
      parseInt(isShort ? result[2] + result[2] : result[2], 16),
      parseInt(isShort ? result[3] + result[3] : result[3], 16),
    ];
  },
  parseRgb(rgb) {
    const match = rgb.match(
      /rgb\(\s*([\d.]+)\s*[,]?\s*([\d.]+)\s*[,]?\s*([\d.]+)\s*\)/,
    );
    if (!match) return [0, 0, 0];
    return [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])];
  },
  parseOklch(oklch) {
    const match = oklch.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
    if (!match) return [0, 0, 0];
    const [_, l, c, h] = match.map(parseFloat);
    const hRad = (h * Math.PI) / 180;

    // Refactored for clarity and to avoid parenthesis errors
    // Рефакторинг для читаемости и избежания ошибок со скобками
    const r = Math.round(l * 255 * (1 + c * Math.cos(hRad)));
    const g = Math.round(
      l * 255 * (1 + c * Math.cos(hRad - (2 * Math.PI) / 3)),
    );
    const b = Math.round(
      l * 255 * (1 + c * Math.cos(hRad - (4 * Math.PI) / 3)),
    );

    return [
      Math.max(0, Math.min(255, r)),
      Math.max(0, Math.min(255, g)),
      Math.max(0, Math.min(255, b)),
    ];
  },
  parseColor(color) {
    const trimmed = color.trim().toLowerCase();
    if (trimmed.startsWith("#")) return this.parseHex(trimmed);
    if (trimmed.startsWith("rgb(")) return this.parseRgb(trimmed);
    if (trimmed.startsWith("oklch(")) return this.parseOklch(trimmed);
    return [0, 0, 0];
  },
  getLuminance(color) {
    const [r, g, b] = this.parseColor(color).map((c) => {
      const cSrgb = c / 255;
      return cSrgb <= 0.03928
        ? cSrgb / 12.92
        : Math.pow((cSrgb + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },
  calculateContrast(color1, color2) {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  },
  isAccessible(color1, color2, level = "AA", textSize = "normal") {
    const contrast = this.calculateContrast(color1, color2);
    if (level === "AA")
      return textSize === "large" ? contrast >= 3 : contrast >= 4.5;
    if (level === "AAA")
      return textSize === "large" ? contrast >= 4.5 : contrast >= 7;
    return false;
  },
  getAccessibilityInfo(color1, color2) {
    const ratio = this.calculateContrast(color1, color2);
    return {
      ratio: parseFloat(ratio.toFixed(2)),
      aa: { normal: ratio >= 4.5, large: ratio >= 3 },
      aaa: { normal: ratio >= 7, large: ratio >= 4.5 },
    };
  },
};

// Category switching / Переключение категорий
document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".category-section");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      sections.forEach((section) => {
        section.classList.remove("active");
        if (section.id === category) section.classList.add("active");
      });
    });
  });

  // Theme toggle / Переключение темы
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    html.setAttribute("data-theme", newTheme);
    themeToggle.textContent =
      newTheme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode";
  });

  // Contrast checker / Проверка контраста
  const fgInput = document.getElementById("fg-color");
  const bgInput = document.getElementById("bg-color");
  const fgPreview = document.getElementById("fg-preview");
  const bgPreview = document.getElementById("bg-preview");
  const checkBtn = document.getElementById("check-btn");
  const resultContainer = document.getElementById("checker-result");

  const updatePreviews = () => {
    fgPreview.style.backgroundColor = fgInput.value || "#000000";
    bgPreview.style.backgroundColor = bgInput.value || "#ffffff";
  };

  fgInput.addEventListener("input", updatePreviews);
  bgInput.addEventListener("input", updatePreviews);
  updatePreviews();

  checkBtn.addEventListener("click", () => {
    const fgColor = fgInput.value.trim();
    const bgColor = bgInput.value.trim();

    if (!fgColor || !bgColor) {
      resultContainer.innerHTML =
        '<p style="color: var(--viewer-error);">Please enter both colors.</p>';
      return;
    }

    try {
      const info = FafContrast.getAccessibilityInfo(fgColor, bgColor);
      resultContainer.innerHTML = `
        <div class="result-details">
          <div class="result-ratio">Contrast Ratio: ${info.ratio}:1</div>
          <div class="result-badges">
            <div>
              <strong>WCAG AA:</strong><br>
              <span class="badge ${info.aa.normal ? "badge-pass" : "badge-fail"}">Normal: ${info.aa.normal ? "✓" : "✗"}</span>
              <span class="badge ${info.aa.large ? "badge-pass" : "badge-fail"}">Large: ${info.aa.large ? "✓" : "✗"}</span>
            </div>
            <div>
              <strong>WCAG AAA:</strong><br>
              <span class="badge ${info.aaa.normal ? "badge-pass" : "badge-fail"}">Normal: ${info.aaa.normal ? "✓" : "✗"}</span>
              <span class="badge ${info.aaa.large ? "badge-pass" : "badge-fail"}">Large: ${info.aaa.large ? "✓" : "✗"}</span>
            </div>
          </div>
          <div class="result-preview" style="background: ${bgColor}; color: ${fgColor};">
            <strong>Preview:</strong> Sample text in ${fgColor} on ${bgColor}
          </div>
        </div>
      `;
    } catch (error) {
      resultContainer.innerHTML = `<p style="color: var(--viewer-error);">Error: ${error.message}</p>`;
    }
  });

  checkBtn.click();
});
