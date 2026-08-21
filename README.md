# 🎨 Faf Design System

> [RU](./README.ru.md) | [ENG](./README.md)

**A next-generation modular design system** built on TypeScript-first principles, perceptual uniformity (OKLCH), and automation.

---

## 🎯 Philosophy

- **TypeScript as Single Source of Truth (SSOT)** — all tokens are defined in `.ts` files, CSS is generated automatically.
- **Perceptual Uniformity** — OKLCH colors ensure visual consistency across the palette.
- **Modularity** — each package is independent and can be used standalone.
- **Accessibility by Default** — WCAG AA/AAA baked into the guidelines.

---

## 📦 Packages

| Package                                       | Description                                       |   Status   |
| :-------------------------------------------- | :------------------------------------------------ | :--------: |
| [`@faf/foundations`](./packages/foundations/) | Foundations: colors, typography, spacing, shadows |  ✅ Ready  |
| `@faf/z-index`                                | Layering and elevation system                     | 🚧 Planned |
| `@faf/contrast`                               | WCAG AA/AAA utilities                             | 🚧 Planned |
| `@faf/components`                             | UI components                                     | 🚧 Planned |

---

## 🛠️ Tech Stack

- **TypeScript 7** — strict token typing
- **pnpm Workspaces** — monorepo
- **Vite** — package bundling
- **Vitest** — unit and contract tests
- **OKLCH** — modern color space
- **CSS Custom Properties** — runtime variables

---

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Generate CSS tokens from TypeScript
pnpm run generate:tokens

# Build all packages
pnpm run build

# Run tests
pnpm run test
```

---

## 📚 Documentation

- [OKLCH Guide](./packages/foundations/docs/oklch-guide.md)
- [Contrast Rules](./packages/foundations/docs/colors-guide.md)
- [Tokens Guide](./packages/foundations/docs/tokens-guide.md)

---

## 📄 License

MIT © Faf Design System

---
