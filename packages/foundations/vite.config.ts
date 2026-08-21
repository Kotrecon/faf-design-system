// packages/foundations/vite.config.ts
import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    lib: {
      // 🔥 ИСПРАВЛЕНИЕ: используем import.meta.dirname (доступно в Node.js 20.11+)
      // Это современный и безопасный аналог __dirname для ES-модулей
      entry: resolve(import.meta.dirname, "src/index.ts"),
      name: "FafFoundations",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      // Оставляем пустым, если нет внешних зависимостей,
      // или добавляем туда пакеты, которые не нужно бандлить (например, 'react')
      external: [],
      output: {
        assetFileNames: (assetInfo) => {
          // Переименовываем сгенерированный CSS в ожидаемое имя
          if (
            assetInfo.name === "style.css" ||
            assetInfo.name?.endsWith(".css")
          ) {
            return "tokens.css";
          }
          return assetInfo.name || "";
        },
      },
    },
    // Опционально: минификация для продакшена
    minify: "esbuild",
  },
  // Убрали пустой и бесполезный блок preprocessorOptions
});
