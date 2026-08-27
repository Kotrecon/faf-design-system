import { defineConfig } from "vite";
import { resolve } from "path";
import { copyFileSync, mkdirSync, existsSync } from "fs";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "FafZIndex",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: ["@faf/foundations"],
      output: {
        globals: {
          "@faf/foundations": "FafFoundations",
        },
      },
    },
  },
  plugins: [
    {
      name: "copy-css",
      writeBundle() {
        const src = resolve(__dirname, "src/styles/tokens.generated.css");
        const dest = resolve(__dirname, "dist/tokens.css");

        if (existsSync(src)) {
          copyFileSync(src, dest);
          console.log("✅ CSS скопирован в dist/tokens.css");
        } else {
          console.warn(
            "⚠️ src/styles/tokens.generated.css не найден. Запустите generate:tokens",
          );
        }
      },
    },
  ],
});
