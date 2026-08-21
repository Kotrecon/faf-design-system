# Color Usage Guide

> [RU](./README.ru.md) | [ENG](./README.md)

This is a practical guide to choosing color combinations that ensure accessibility (WCAG 2.1 AA/AAA) and visual consistency across interfaces.

---

## 1. Text Contrast (WCAG)

To ensure text readability, minimum contrast requirements according to **WCAG 2.1** must be met.

### Requirements by Level

| Level                 | Normal text (< 18px) | Large text (≥ 18px / ≥ 14px bold) |
| :-------------------- | :------------------- | :-------------------------------- |
| **AAA** (recommended) | 7:1                  | 4.5:1                             |
| **AA** (required)     | 4.5:1                | 3:1                               |

### Practical Rules

#### On light backgrounds (`background: gray-50` to `gray-200`)

| Usage              | Recommended shades                 | Contrast              |
| :----------------- | :--------------------------------- | :-------------------- |
| **Primary text**   | `gray-900`, `gray-800`, `gray-700` | > 7:1 (AAA)           |
| **Secondary text** | `gray-600`, `gray-500`             | 4.5:1 - 7:1 (AA-AAA)  |
| **Disabled text**  | `gray-400`                         | ~ 3:1 (disabled only) |
| **Accent text**    | `blue-600`, `blue-700`             | > 4.5:1 (AA)          |

#### On dark backgrounds (`background: gray-800` to `gray-900`)

| Usage              | Recommended shades             | Contrast         |
| :----------------- | :----------------------------- | :--------------- |
| **Primary text**   | `gray-50`, `gray-100`, `white` | > 12:1 (AAA)     |
| **Secondary text** | `gray-200`, `gray-300`         | 7:1 - 10:1 (AAA) |
| **Disabled text**  | `gray-400`                     | ~ 4.5:1 (AA)     |
| **Accent text**    | `blue-300`, `blue-400`         | > 4.5:1 (AA)     |

---

## 2. Semantic Colors

Semantic colors (success, error, warning, info) must be used strictly for their intended purposes and provide sufficient contrast.

### Error (errors, destructive actions)

```css
/* Alert background */
background-color: var(--faf-color-red-50); /* Light */
color: var(--faf-color-red-900); /* Dark text */

/* Error text */
color: var(--faf-color-red-600);

/* Icon */
fill: var(--faf-color-red-500);
```

### Success (successful actions)

```css
/* Alert background */
background-color: var(--faf-color-green-50);
color: var(--faf-color-green-900);

/* Success text */
color: var(--faf-color-green-700);
```

### Warning (warnings)

⚠️ **Important**: Yellow (`yellow`) has low contrast on white backgrounds.

**Correct:**

```css
/* Background */
background-color: var(--faf-color-yellow-100);
/* Text — dark, NOT yellow */
color: var(--faf-color-gray-900);
/* Or dark orange/brown */
color: var(--faf-color-yellow-900);
```

**Incorrect:**

```css
/* Yellow text on a white background is UNREADABLE */
color: var(--faf-color-yellow-500); /* ❌ */
```

---

## 3. Interactive Elements

### Links

Links must be distinguishable from regular text and have sufficient contrast.

```css
/* Light theme */
.faf-link {
  color: var(--faf-color-blue-600); /* Contrast > 4.5:1 on white */
  text-decoration: underline; /* Additional distinction */
}

.faf-link:hover {
  color: var(--faf-color-blue-700); /* Darker on hover */
}

/* Dark theme */
.faf-link {
  color: var(--faf-color-blue-400); /* Contrast > 4.5:1 on dark */
}
```

### Buttons

#### Primary (main action)

```css
.faf-button-primary {
  background-color: var(--faf-color-primary); /* Blue 600 */
  color: white; /* White text is always readable on saturated colors */
}

.faf-button-primary:hover {
  background-color: var(--faf-color-primary-hover); /* Blue 700 */
}

.faf-button-primary:disabled {
  background-color: var(--faf-color-gray-300);
  color: var(--faf-color-gray-500);
}
```

#### Secondary (secondary action)

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

## 4. Backgrounds and Surfaces

### Surface Hierarchy

| Element                | Light theme              | Dark theme               |
| :--------------------- | :----------------------- | :----------------------- |
| **Base background**    | `gray-50`                | `gray-900`               |
| **Surface (card)**     | `white`                  | `gray-800`               |
| **Raised**             | `white` + `shadow-md`    | `gray-750` + `shadow-md` |
| **Overlay (backdrop)** | `gray-900` @ 50% opacity | `gray-900` @ 70% opacity |

### Borders

Borders should be noticeable but not distracting.

```css
/* Light theme */
border-color: var(
  --faf-color-gray-200
); /* 1.5:1 contrast with gray-50 background */

/* Dark theme */
border-color: var(
  --faf-color-gray-700
); /* 1.5:1 contrast with gray-800 background */
```

---

## 5. Brand Colors

Brand colors (`brandFirefly`, `brandAi`, `brandFlow`) **do not invert** when switching themes.

### Usage

```css
/* Logos, key accents */
.faf-brand-firefly {
  color: var(--faf-color-brand-firefly);
}

/* Illustrations, decorative elements */
.faf-brand-gradient {
  background: linear-gradient(
    135deg,
    var(--faf-color-brand-firefly),
    var(--faf-color-brand-ai)
  );
}
```

⚠️ **Do not use brand colors for text** on standard surfaces, as they may not meet WCAG requirements. Use them only for:

- Logos
- Decorative elements
- Illustrations
- Accent backgrounds (with dark text on top)

---

## 6. Checking Contrast

### Tools

Before release, check the contrast of critical elements:

1. **Figma Plugin**: "Stark" or "Contrast"
2. **Chrome DevTools**:
   - Open Elements → Styles → click the color square next to `color`
   - The contrast ratio will be displayed in the popup
3. **WebAIM Contrast Checker**: [https://webaim.org/resources/contrastchecker/](https://webaim.org/resources/contrastchecker/)

### Automated Tests

In the future, Token Contract Tests will be added to verify that:

- All semantic colors have a minimum 4.5:1 contrast with the background.
- `hover` states differ from the base state by at least 0.05 in Lightness.

---

## 7. Pre-Usage Color Checklist

- [ ] The color provides ≥ 4.5:1 contrast for text (≥ 3:1 for large text).
- [ ] Color is not the only way to convey information (add an icon or text).
- [ ] Interactive elements have visible `:hover` and `:focus` states.
- [ ] The color works in both themes (light/dark) or has a dedicated dark theme alternative.

---

## Examples

### ✅ Correct

```html
<!-- Card with sufficient contrast -->
<div style="background: white; border: 1px solid gray-200;">
  <h2 style="color: gray-900;">Heading</h2>
  <p style="color: gray-600;">Secondary text</p>
  <a href="#" style="color: blue-600;">Link</a>
  <button style="background: blue-600; color: white;">Button</button>
</div>
```

### ❌ Incorrect

```html
<!-- Card with poor contrast -->
<div style="background: gray-50; border: 1px solid gray-100;">
  <h2 style="color: gray-400;">Heading (unreadable!)</h2>
  <p style="color: yellow-500;">Text (unreadable on white!)</p>
  <a href="#" style="color: blue-300;">Link (weak contrast)</a>
  <button style="background: gray-200; color: gray-400;">
    Button (invisible)
  </button>
</div>
```

---

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [OKLCH Color Converter](https://oklch.com/)

---
