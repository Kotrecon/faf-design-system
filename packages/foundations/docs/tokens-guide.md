# Design Tokens Guide

> [RU](./tokens-guide.ru.md) | [ENG](./tokens-guide.md)

Design tokens are atomic values (colors, spacing, typography, shadows) that serve as the **Single Source of Truth (SSOT)** for the entire Faf design system.

Instead of writing `padding: 16px` or `color: #3b82f6` in every component, you use tokens: `padding: var(--faf-spacing-4)` and `color: var(--faf-color-primary)`.

---

## 1. Token Hierarchy

Tokens are organized into three levels. Each subsequent level references the previous one.

```text
┌─────────────────────────────────────────────────────────────┐
│ Component Tokens                                            │
│ --faf-button-bg, --faf-input-border                         │
└─────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────┐
│ Semantic Tokens                                             │
│ --faf-color-primary, --faf-spacing-card-padding             │
└─────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────┐
│ Global Tokens (Primitives)                                  │
│ --faf-color-blue-500, --faf-spacing-4                       │
└─────────────────────────────────────────────────────────────┘
```

### Global Tokens (Primitives)

Raw values without context. This is the "ingredient pantry".

```typescript
// TypeScript
spacing[4]; // "1rem"
primitives.blue[500]; // "oklch(0.55 0.22 250)"

// CSS
--faf - spacing - 4; /* 1rem */
--faf - color - blue - 500; /* oklch(0.55 0.22 250) */
```

**When to use:** Only when a semantic token doesn't cover your specific use case.

### Semantic Tokens

Primitives with assigned roles. This is the "restaurant menu".

```typescript
// TypeScript
semanticSpacing.cardPadding; // "1.5rem" (references spacing[6])
themes.light.primary; // "oklch(0.55 0.22 250)" (references blue-600)

// CSS
--faf - spacing - card - padding; /* 1.5rem */
--faf - color - primary; /* oklch(0.55 0.22 250) */
```

**When to use:** Always when developing components. This covers 95% of use cases.

### Component Tokens

Specific to a particular component. They reference semantic tokens.

```css
.faf-button {
  background-color: var(--faf-color-primary);
  padding: var(--faf-spacing-button-padding-y)
    var(--faf-spacing-button-padding-x);
}
```

**When to use:** Only within the implementation of a specific component.

---

## 2. Naming Conventions

### Name Format

- **Primitives:** `--faf-{category}-{name}-{step}`

  ```css
  --faf-color-blue-500
  --faf-spacing-4
  --faf-shadow-md
  ```

- **Semantics:** `--faf-{category}-{role}`

  ```css
  --faf-color-primary
  --faf-spacing-card-padding
  --faf-shadow-modal
  ```

- **Components:** `--faf-{component}-{property}`

  ```css
  --faf-button-bg
  --faf-input-border
  ```

### The `--faf-` Prefix

All tokens have the `--faf-` prefix to:

1. Prevent conflicts with other libraries.
2. Make tokens easy to find in DevTools.
3. Clearly indicate that the value is managed by the design system.

### camelCase in TypeScript ↔ kebab-case in CSS

Transformation happens automatically during generation:

| TypeScript       | CSS                              |
| :--------------- | :------------------------------- |
| `buttonPaddingX` | `--faf-spacing-button-padding-x` |
| `brandFirefly`   | `--faf-color-brand-firefly`      |
| `cardPadding`    | `--faf-spacing-card-padding`     |

---

## 3. Usage in Code

### In CSS

```css
/* ✅ Correct: via semantic tokens */
.card {
  background: var(--faf-color-surface);
  padding: var(--faf-spacing-card-padding);
  box-shadow: var(--faf-shadow-card);
  border: 1px solid var(--faf-color-border);
}

/* ❌ Incorrect: magic numbers */
.card {
  background: white;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}
```

### In TypeScript / React

```tsx
import { themes, semanticSpacing } from "@faf/foundations";

// ✅ Correct: via tokens
const cardStyle = {
  background: themes.light.surface,
  padding: semanticSpacing.cardPadding,
};

// ✅ Correct: via CSS variables in style
const cardStyle2 = {
  background: "var(--faf-color-surface)",
  padding: "var(--faf-spacing-card-padding)",
};
```

---

## 4. How to Add a New Token

### Scenario A: A new color in the palette

1. Add the value to `src/tokens/colors/primitives.ts`:

   ```typescript
   export const primitives = {
     // ... existing colors
     pink: {
       500: "oklch(0.65 0.25 350)",
       // ...
     },
   };
   ```

2. Regenerate CSS:

   ```bash
   pnpm run generate:tokens
   ```

3. Done. `--faf-color-pink-500` will now appear in the CSS.

### Scenario B: A new semantic role

1. Add the role to `src/semantic/themes.ts` (in the `SemanticTheme` interface and in both themes):

   ```typescript
   export interface SemanticTheme {
     // ... existing
     highlight: string; // <-- new role
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

2. TypeScript will automatically check that you didn't forget to add the token to one of the themes.
3. Regenerate CSS:

   ```bash
   pnpm run generate:tokens
   ```

4. `--faf-color-highlight` will now appear in the CSS.

### Scenario C: A new semantic spacing

1. Add the role to `src/tokens/spacing/semantic.ts`:

   ```typescript
   export const semanticSpacing = {
     // ... existing
     sidebarWidth: spacing[64],
   };
   ```

2. Regenerate CSS:

   ```bash
   pnpm run generate:tokens
   ```

3. `--faf-spacing-sidebar-width` will now appear in the CSS.

---

## 5. Best Practices

### ✅ Do

- **Always use semantic tokens** in components. Primitives are only for edge cases.
- **Add a new role to semantics** if a spacing/color is used in 2+ places.
- **Check contrast** before using a color for text (see `colors-guide.md`).
- **Use the viewer** for visual verification of tokens: `viewer/index.html`.

### ❌ Don't

- **Don't use magic numbers** (`16px`, `#3b82f6`) in components.
- **Don't duplicate tokens** in CSS. If a value already exists in semantics, use it.
- **Don't manually modify `tokens.generated.css`**. This file is generated automatically.
- **Don't create component tokens unnecessarily**. Start with semantics.

---

## 6. Anti-patterns

### ❌ Anti-pattern 1: Direct use of primitives in components

```css
/* Bad: hard coupling to a primitive */
.button {
  background: var(--faf-color-blue-600);
}

/* Good: using semantics */
.button {
  background: var(--faf-color-primary);
}
```

**Why it's bad:** If the brand changes the primary color from blue to purple, you would have to hunt down every instance of `blue-600`.

### ❌ Anti-pattern 2: Magic numbers

```css
/* Bad */
.card {
  padding: 24px;
  border-radius: 8px;
}

/* Good */
.card {
  padding: var(--faf-spacing-card-padding);
  border-radius: var(--faf-radius-md);
}
```

**Why it's bad:** Makes it impossible to centrally update the design.

### ❌ Anti-pattern 3: Creating duplicate tokens

```css
/* Bad: duplication */
--faf-color-button-bg: var(--faf-color-primary);
.button {
  background: var(--faf-color-button-bg);
}

/* Good: using existing semantics */
.button {
  background: var(--faf-color-primary);
}
```

**Why it's bad:** Creates unnecessary abstraction without adding value.

---

## 7. Tools

### Viewer

Interactive viewing of all tokens:

```bash
# Open viewer/index.html in your browser
```

Allows switching themes (Light/Dark/System) and browsing tokens by category.

### CSS Generator

Automatically creates `tokens.generated.css` from TypeScript tokens:

```bash
pnpm run generate:tokens
```

### TypeScript

All tokens are strictly typed. Autocompletion works out of the box:

```typescript
import { semanticSpacing } from '@faf/foundations';
semanticSpacing. // <-- IDE will show all available roles
```

---

## 8. Related Documents

- [`oklch-guide.md`](./oklch-guide.md) — Why we use OKLCH
- [`colors-guide.md`](./colors-guide.md) — Contrast rules and color usage

---

## 9. Pre-Usage Checklist

- [ ] I am using a semantic token, not a primitive (where possible).
- [ ] The token exists in the design system (verified via the viewer).
- [ ] If the token doesn't exist, I added it to semantics rather than using a primitive.
- [ ] The color provides sufficient contrast (see `colors-guide.md`).
- [ ] I am not editing `tokens.generated.css` manually.

---
