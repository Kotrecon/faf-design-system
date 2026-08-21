// src/types/tokens.d.ts

// 1. Разрешаем импортировать CSS-файлы как модули (если используешь CSS Modules)
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

// 2. Расширяем стандартные CSS-свойства, чтобы TS не ругался на кастомные переменные
declare global {
  namespace CSS {
    interface Properties {
      // Добавляем только самые базовые, остальные TS пропустит через index signature
      "--faf-color-primary"?: string;
      "--faf-color-text"?: string;
      "--faf-color-background"?: string;
      "--faf-spacing-button-x"?: string;
      "--faf-shadow-card"?: string;
      [key: `--faf-${string}`]: string | undefined; // 🔥 Магия: разрешает ЛЮБОЕ свойство, начинающееся на --faf-
    }
  }
}
