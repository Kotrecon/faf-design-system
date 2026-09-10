// packages/z-index/vite.viewer.config.ts
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: resolve(__dirname, "viewer"),
  server: {
    port: 4000,
    host: "localhost",
    open: true,
  },
  build: {
    outDir: resolve(__dirname, "dist-viewer"),
  },
});
