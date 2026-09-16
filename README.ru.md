# Faf Design System

> [RU](./README.ru.md) | [ENG](./README.md)

**Модульная дизайн-система нового поколения**, построенная на принципах TypeScript-first, перцептивной равномерности (OKLCH) и автоматизации.

---

## 🎯 Философия

- **TypeScript как единый источник истины (SSOT)** — все токены определены в `.ts` файлах, CSS генерируется автоматически.
- **Перцептивная равномерность** — цвета OKLCH обеспечивают визуальную согласованность палитры.
- **Модульность** — каждый пакет независим и может использоваться отдельно.
- **Доступность по умолчанию** — стандарты WCAG AA/AAA встроены в рекомендации.

---

## 📦 Пакеты

| Пакет                                         | Описание                                  |     Статус      |
| :-------------------------------------------- | :---------------------------------------- | :-------------: |
| [`@faf/foundations`](./packages/foundations/) | Основы: цвета, типографика, отступы, тени |    ✅ Готов     |
| [`@faf/z-index`](./packages/z-index/)         | Система слоёв и глубины                   |    ✅ Готов     |
| `@faf/contrast`                               | Утилиты WCAG AA/AAA                       | 🚧 Запланирован |
| `@faf/components`                             | UI-компоненты                             | 🚧 Запланирован |

---

## 🛠️ Технологический стек

- **TypeScript 7** — строгая типизация токенов
- **pnpm Workspaces** — монорепозиторий
- **Vite** — сборка пакетов
- **Vitest** — юнит-тесты и тесты контрактов
- **OKLCH** — современное цветовое пространство
- **CSS Custom Properties** — runtime-переменные

---

## Быстрый старт

```bash
# Установка зависимостей
pnpm install

# Генерация CSS-токенов из TypeScript
pnpm run generate:tokens

# Сборка всех пакетов
pnpm run build

# Запуск тестов
pnpm run test
```

---

## 📚 Документация

- [Руководство по OKLCH](./packages/foundations/docs/oklch-guide.md)
- [Правила контрастности](./packages/foundations/docs/colors-guide.md)
- [Руководство по токенам](./packages/foundations/docs/tokens-guide.md)
- [Руководство по паттернам](./packages/z-index/docs/patterns-guide.ru.md)
- [Руководство по Stacking Context](./packages/z-index/docs/stacking-context-guide.md)

---

## Лицензия

MIT © Faf Design System

---
