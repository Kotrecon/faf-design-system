# Руководство по дизайн-токенам

> [RU](./README.ru.md) | [ENG](./README.md)

Дизайн-токены — это атомарные значения (цвета, отступы, шрифты, тени), которые являются **единственным источником истины (Single Source of Truth)** для всей дизайн-системы Faf.

Вместо того чтобы писать `padding: 16px` или `color: #3b82f6` в каждом компоненте, вы используете токены: `padding: var(--faf-spacing-4)` и `color: var(--faf-color-primary)`.

---

## 1. Иерархия токенов

Токены организованы в три уровня. Каждый следующий уровень ссылается на предыдущий.

```bash

┌─────────────────────────────────────────────────────────────┐
│ Component Tokens (Компонентные) │
│ --faf-button-bg, --faf-input-border │
└─────────────────────────────────────────────────────────────┘
↑
┌─────────────────────────────────────────────────────────────┐
│ Semantic Tokens (Семантические) │
│ --faf-color-primary, --faf-spacing-card-padding │
└─────────────────────────────────────────────────────────────┘
↑
┌─────────────────────────────────────────────────────────────┐
│ Global Tokens (Глобальные / Примитивы) │
│ --faf-color-blue-500, --faf-spacing-4 │
└─────────────────────────────────────────────────────────────┘
```

### Global Tokens (Примитивы)

Сырые значения без привязки к контексту. Это "склад ингредиентов".

```typescript
// TypeScript
spacing[4]; // "1rem"
primitives.blue[500]; // "oklch(0.55 0.22 250)"

// CSS
--faf - spacing - 4; /* 1rem */
--faf - color - blue - 500; /* oklch(0.55 0.22 250) */
```

**Когда использовать:** Только когда семантический токен не покрывает ваш случай.

### Semantic Tokens (Семантические)

Примитивы с ролями. Это "меню ресторана".

```typescript
// TypeScript
semanticSpacing.cardPadding; // "1.5rem" (ссылается на spacing[6])
themes.light.primary; // "oklch(0.55 0.22 250)" (ссылается на blue-600)

// CSS
--faf - spacing - card - padding; /* 1.5rem */
--faf - color - primary; /* oklch(0.55 0.22 250) */
```

**Когда использовать:** Всегда при разработке компонентов. Это 95% случаев.

### Component Tokens (Компонентные)

Специфичные для конкретного компонента. Ссылаются на семантику.

```css
.faf-button {
  background-color: var(--faf-color-primary);
  padding: var(--faf-spacing-button-padding-y)
    var(--faf-spacing-button-padding-x);
}
```

**Когда использовать:** Только внутри реализации компонента.

---

## 2. Naming Conventions

### Формат имён

- **Примитивы:** `--faf-{категория}-{имя}-{шаг}`

  ```bash
  --faf-color-blue-500
  --faf-spacing-4
  --faf-shadow-md
  ```

- **Семантика:** `--faf-{категория}-{роль}`

  ```bash
  --faf-color-primary
  --faf-spacing-card-padding
  --faf-shadow-modal
  ```

- **Компонентные:** `--faf-{компонент}-{свойство}`

  ```bash
  --faf-button-bg
  --faf-input-border
  ```

### Префикс `--faf-`

Все токены имеют префикс `--faf-`, чтобы:

1. Избежать конфликтов с другими библиотеками
2. Быстро находить токены в DevTools
3. Понимать, что значение управляется дизайн-системой

### camelCase в TypeScript ↔ kebab-case в CSS

Трансформация происходит автоматически при генерации:

| TypeScript       | CSS                              |
| :--------------- | :------------------------------- |
| `buttonPaddingX` | `--faf-spacing-button-padding-x` |
| `brandFirefly`   | `--faf-color-brand-firefly`      |
| `cardPadding`    | `--faf-spacing-card-padding`     |

---

## 3. Использование в коде

### В CSS

```css
/* ✅ Правильно: через семантические токены */
.card {
  background: var(--faf-color-surface);
  padding: var(--faf-spacing-card-padding);
  box-shadow: var(--faf-shadow-card);
  border: 1px solid var(--faf-color-border);
}

/* ❌ Неправильно: магические числа */
.card {
  background: white;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}
```

### В TypeScript / React

```tsx
import { themes, semanticSpacing } from "@faf/foundations";

// ✅ Правильно: через токены
const cardStyle = {
  background: themes.light.surface,
  padding: semanticSpacing.cardPadding,
};

// ✅ Правильно: через CSS-переменные в style
const cardStyle2 = {
  background: "var(--faf-color-surface)",
  padding: "var(--faf-spacing-card-padding)",
};
```

---

## 4. Как добавить новый токен

### Сценарий А: Новый цвет в палитру

1. Добавьте значение в `src/tokens/colors/primitives.ts`:

   ```typescript
   export const primitives = {
     // ... существующие цвета
     pink: {
       500: "oklch(0.65 0.25 350)",
       // ...
     },
   };
   ```

2. Перегенерируйте CSS:

   ```bash
   pnpm run generate:tokens
   ```

3. Готово. В CSS появится `--faf-color-pink-500`.

### Сценарий Б: Новая семантическая роль

1. Добавьте роль в `src/semantic/themes.ts` (в интерфейс `SemanticTheme` и в обе темы):

   ```typescript
   export interface SemanticTheme {
     // ... существующие
     highlight: string; // <-- новая роль
   }

   export const themes = {
     light: {
       // ...
       highlight: primitives.yellow[100],
     },
     dark: {
       // ...
       highlight: primitives.yellow[900],
     },
   };
   ```

2. TypeScript автоматически проверит, что вы не забыли добавить токен в одну из тем.

3. Перегенерируйте CSS:

   ```bash
   pnpm run generate:tokens
   ```

4. В CSS появится `--faf-color-highlight`.

### Сценарий В: Новый семантический отступ

1. Добавьте роль в `src/tokens/spacing/semantic.ts`:

   ```typescript
   export const semanticSpacing = {
     // ... существующие
     sidebarWidth: spacing[64],
   };
   ```

2. Перегенерируйте CSS:

   ```bash
   pnpm run generate:tokens
   ```

3. В CSS появится `--faf-spacing-sidebar-width`.

---

## 5. Best Practices

### ✅ Делайте

- **Всегда используйте семантические токены** в компонентах. Примитивы — только для edge-cases.
- **Добавляйте новую роль в семантику**, если отступ/цвет используется в 2+ местах.
- **Проверяйте контрастность** перед использованием цвета для текста (см. `colors-guide.md`).
- **Используйте viewer** для визуальной проверки токенов: `viewer/index.html`.

### ❌ Не делайте

- **Не используйте магические числа** (`16px`, `#3b82f6`) в компонентах.
- **Не дублируйте токены** в CSS. Если значение уже есть в семантике — используйте его.
- **Не модифицируйте `tokens.generated.css` вручную**. Этот файл генерируется автоматически.
- **Не создавайте компонентные токены без необходимости**. Начинайте с семантики.

---

## 6. Антипаттерны

### ❌ Антипаттерн 1: Прямое использование примитивов в компонентах

```css
/* Плохо: жёсткая привязка к примитиву */
.button {
  background: var(--faf-color-blue-600);
}

/* Хорошо: используем семантику */
.button {
  background: var(--faf-color-primary);
}
```

**Почему плохо:** Если бренд изменит primary цвет с синего на фиолетовый, придётся искать все места с `blue-600`.

### ❌ Антипаттерн 2: Магические числа

```css
/* Плохо */
.card {
  padding: 24px;
  border-radius: 8px;
}

/* Хорошо */
.card {
  padding: var(--faf-spacing-card-padding);
  border-radius: var(--faf-radius-md);
}
```

**Почему плохо:** Невозможно централизованно изменить дизайн.

### ❌ Антипаттерн 3: Создание дублирующих токенов

```css
/* Плохо: дублирование */
--faf-color-button-bg: var(--faf-color-primary);
.button {
  background: var(--faf-color-button-bg);
}

/* Хорошо: используем существующую семантику */
.button {
  background: var(--faf-color-primary);
}
```

**Почему плохо:** Создаёт лишнюю абстракцию без пользы.

---

## 7. Инструменты

### Viewer

Интерактивный просмотр всех токенов:

```bash
# Откройте viewer/index.html в браузере
```

Позволяет переключать темы (Light/Dark/System) и просматривать токены по категориям.

### Генератор CSS

Автоматически создаёт `tokens.generated.css` из TypeScript-токенов:

```bash
pnpm run generate:tokens
```

### TypeScript

Все токены имеют строгую типизацию. Автодополнение работает из коробки:

```typescript
import { semanticSpacing } from '@faf/foundations';
semanticSpacing. // <-- IDE покажет все доступные роли
```

---

## 8. Связанные документы

- [`oklch-guide.md`](./oklch-guide.md) — почему мы используем OKLCH
- [`colors-guide.md`](./colors-guide.md) — правила контрастности и использования цветов

---

## 9. Чек-лист перед использованием токена

- [ ] Я использую семантический токен, а не примитив (где это возможно)
- [ ] Токен существует в дизайн-системе (проверил через viewer)
- [ ] Если токена нет — я добавил его в семантику, а не использовал примитив
- [ ] Цвет обеспечивает достаточный контраст (см. `colors-guide.md`)
- [ ] Я не редактирую `tokens.generated.css` вручную

---
