// packages/contrast/viewer/viewer.js
// Viewer logic: category switching, theme toggle, contrast checker
// Логика viewer: переключение категорий, смена темы, проверка контраста

// Import the real utility from the package.
// Импортируем реальную утилиту из пакета.
import { FafContrast } from "../dist/index.js";

// Import real tokens from Foundations.
// Импортируем реальные токены Foundations.
import "@faf/foundations/styles";

// Import viewer styles through Vite.
// Импортируем стили viewer через Vite.
import "./styles.css";

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
    // Оставляем строго на английском, как ты и указал
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

  // Auto-check on load / Автопроверка при загрузке
  checkBtn.click();
});
