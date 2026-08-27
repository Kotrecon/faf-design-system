// packages/z-index/tokens.config.ts
export default {
  imports: {
    zindex: "./src/tokens/zindex.ts",
  },
  exports: {
    zindex: "zIndexTokens",
  },
  output: "./src/styles/tokens.generated.css",
};
