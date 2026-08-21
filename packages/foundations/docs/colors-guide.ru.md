# Руководство по использованию цветов

> [RU](./colors-guide.ru.md) | [ENG](./colors-guide.md)

Это практическое руководство по выбору цветовых комбинаций, обеспечивающих доступность (WCAG 2.1 AA/AAA) и визуальную согласованность интерфейсов.

---

## 1. Контрастность текста (WCAG)

Для обеспечения читаемости текста необходимо соблюдать минимальные требования контрастности согласно **WCAG 2.1**.

### Требования по уровням

| Уровень                 | Обычный текст (< 18px) | Крупный текст (≥ 18px / ≥ 14px bold) |
| :---------------------- | :--------------------- | :----------------------------------- |
| **AAA** (рекомендуется) | 7:1                    | 4.5:1                                |
| **AA** (обязательно)    | 4.5:1                  | 3:1                                  |

### Практические правила

#### На светлом фоне (`background: gray-50` до `gray-200`)

| Использование        | Рекомендуемые оттенки              | Контраст                    |
| :------------------- | :--------------------------------- | :-------------------------- |
| **Основной текст**   | `gray-900`, `gray-800`, `gray-700` | > 7:1 (AAA)                 |
| **Вторичный текст**  | `gray-600`, `gray-500`             | 4.5:1 - 7:1 (AA-AAA)        |
| **Неактивный текст** | `gray-400`                         | ~ 3:1 (только для disabled) |
| **Акцентный текст**  | `blue-600`, `blue-700`             | > 4.5:1 (AA)                |

#### На тёмном фоне (`background: gray-800` до `gray-900`)

| Использование        | Рекомендуемые оттенки          | Контраст         |
| :------------------- | :----------------------------- | :--------------- |
| **Основной текст**   | `gray-50`, `gray-100`, `white` | > 12:1 (AAA)     |
| **Вторичный текст**  | `gray-200`, `gray-300`         | 7:1 - 10:1 (AAA) |
| **Неактивный текст** | `gray-400`                     | ~ 4.5:1 (AA)     |
| **Акцентный текст**  | `blue-300`, `blue-400`         | > 4.5:1 (AA)     |

---

## 2. Семантические цвета

Семантические цвета (success, error, warning, info) должны использоваться строго по назначению и обеспечивать достаточный контраст.

### Error (ошибки, опасные действия)

```css
/* Фон алерта */
background-color: var(--faf-color-red-50); /* Светлый */
color: var(--faf-color-red-900); /* Тёмный текст */

/* Текст ошибки */
color: var(--faf-color-red-600);

/* Иконка */
fill: var(--faf-color-red-500);
```

### Success (успешные действия)

```css
/* Фон алерта */
background-color: var(--faf-color-green-50);
color: var(--faf-color-green-900);

/* Текст успеха */
color: var(--faf-color-green-700);
```

### Warning (предупреждения)

⚠️ **Важно**: Жёлтый цвет (`yellow`) имеет низкий контраст на белом фоне.

**Правильно:**

```css
/* Фон */
background-color: var(--faf-color-yellow-100);
/* Текст — тёмный, НЕ жёлтый */
color: var(--faf-color-gray-900);
/* Или тёмно-оранжевый/коричневый */
color: var(--faf-color-yellow-900);
```

**Неправильно:**

```css
/* Жёлтый текст на белом фоне — НЕЧИТАЕМ */
color: var(--faf-color-yellow-500); /* ❌ */
```

---

## 3. Интерактивные элементы

### Ссылки

Ссылки должны быть отличимы от обычного текста и иметь достаточный контраст.

```css
/* Светлая тема */
.faf-link {
  color: var(--faf-color-blue-600); /* Контраст > 4.5:1 на белом */
  text-decoration: underline; /* Дополнительно для отличия */
}

.faf-link:hover {
  color: var(--faf-color-blue-700); /* Темнее на hover */
}

/* Тёмная тема */
.faf-link {
  color: var(--faf-color-blue-400); /* Контраст > 4.5:1 на тёмном */
}
```

### Кнопки

#### Primary (основное действие)

```css
.faf-button-primary {
  background-color: var(--faf-color-primary); /* Blue 600 */
  color: white; /* Белый текст всегда читается на насыщенном цвете */
}

.faf-button-primary:hover {
  background-color: var(--faf-color-primary-hover); /* Blue 700 */
}

.faf-button-primary:disabled {
  background-color: var(--faf-color-gray-300);
  color: var(--faf-color-gray-500);
}
```

#### Secondary (вторичное действие)

```css
.faf-button-secondary {
  background-color: transparent;
  color: var(--faf-color-gray-700);
  border: 1px solid var(--faf-color-gray-300);
}

.faf-button-secondary:hover {
  background-color: var(--faf-color-gray-50);
  border-color: var(--faf-color-gray-400);
}
```

---

## 4. Фоны и поверхности

### Иерархия поверхностей

| Элемент                    | Светлая тема             | Тёмная тема              |
| :------------------------- | :----------------------- | :----------------------- |
| **Основной фон**           | `gray-50`                | `gray-900`               |
| **Поверхность (карточка)** | `white`                  | `gray-800`               |
| **Raised (приподнятый)**   | `white` + `shadow-md`    | `gray-750` + `shadow-md` |
| **Overlay (затемнение)**   | `gray-900` @ 50% opacity | `gray-900` @ 70% opacity |

### Границы (Borders)

Границы должны быть заметны, но не отвлекать внимание.

```css
/* Светлая тема */
border-color: var(--faf-color-gray-200); /* Контраст 1.5:1 с фоном gray-50 */

/* Тёмная тема */
border-color: var(--faf-color-gray-700); /* Контраст 1.5:1 с фоном gray-800 */
```

---

## 5. Брендовые цвета

Брендовые цвета (`brandFirefly`, `brandAi`, `brandFlow`) **не инвертируются** при смене темы.

### Использование

```css
/* Логотипы, ключевые акценты */
.faf-brand-firefly {
  color: var(--faf-color-brand-firefly);
}

/* Иллюстрации, декоративные элементы */
.faf-brand-gradient {
  background: linear-gradient(
    135deg,
    var(--faf-color-brand-firefly),
    var(--faf-color-brand-ai)
  );
}
```

⚠️ **Не используйте брендовые цвета для текста** на обычных поверхностях — они могут не соответствовать WCAG. Используйте их только для:

- Логотипов
- Декоративных элементов
- Иллюстраций
- Акцентных фонов (с тёмным текстом поверх)

---

## 6. Проверка контрастности

### Инструменты

Перед релизом проверяйте контрастность критических элементов:

1. **Figma Plugin**: "Stark" или "Contrast"
2. **Chrome DevTools**:
   - Откройте Elements → Styles → цветной квадрат рядом с `color`
   - В появившемся окне будет указан контраст
3. **WebAIM Contrast Checker**: `https://webaim.org/resources/contrastchecker/`

### Автоматические тесты

В будущем планируется добавить Token Contract Tests, которые будут проверять:

- Все семантические цвета имеют минимальный контраст 4.5:1 с фоном
- Состояния `hover` отличаются от базового состояния минимум на 0.05 по Lightness

---

## 7. Чек-лист перед использованием цвета

- [ ] Цвет обеспечивает контраст ≥ 4.5:1 для текста (≥ 3:1 для крупного)
- [ ] Цвет не используется как единственный способ передачи информации (добавьте иконку или текст)
- [ ] Для интерактивных элементов есть видимое состояние `:hover` и `:focus`
- [ ] Цвет работает в обеих темах (light/dark) или имеет альтернативу для тёмной темы

---

## Примеры

### ✅ Правильно

```html
<!-- Карточка с достаточным контрастом -->
<div style="background: white; border: 1px solid gray-200;">
  <h2 style="color: gray-900;">Заголовок</h2>
  <p style="color: gray-600;">Вторичный текст</p>
  <a href="#" style="color: blue-600;">Ссылка</a>
  <button style="background: blue-600; color: white;">Кнопка</button>
</div>
```

### ❌ Неправильно

```html
<!-- Карточка с плохим контрастом -->
<div style="background: gray-50; border: 1px solid gray-100;">
  <h2 style="color: gray-400;">Заголовок (не читается!)</h2>
  <p style="color: yellow-500;">Текст (не читается на белом!)</p>
  <a href="#" style="color: blue-300;">Ссылка (слабый контраст)</a>
  <button style="background: gray-200; color: gray-400;">
    Кнопка (не видно)
  </button>
</div>
```

---

## Ссылки

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [OKLCH Color Converter](https://oklch.com/)

---
