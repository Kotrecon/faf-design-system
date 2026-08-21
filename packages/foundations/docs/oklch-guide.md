# Why We Use OKLCH

> [RU](./oklch-guide.ru.md) | [ENG](./oklch-guide.md)

OKLCH (Lightness, Chroma, Hue) is a modern color space that has become the industry standard for professional design systems (Tailwind CSS, GitHub Primer, Shopify Polaris).

It solves fundamental problems of older formats (HEX, RGB, HSL) when programmatically generating and scaling interfaces.

---

## 1. Perceptual Uniformity

This is the main advantage of OKLCH. Changing the `Lightness` parameter by a fixed percentage is **always perceived by the human eye as an identical change**, regardless of the `Hue`.

| Space     | Problem                                                                                                                                          | Example                                                                             |
| :-------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| **HSL**   | Yellow (`hsl(60, 100%, 50%)`) and Blue (`hsl(240, 100%, 50%)`) have the same declared lightness (50%), but yellow visually appears much lighter. | Impossible to create a harmonious 10-step palette across different colors.          |
| **OKLCH** | `oklch(0.50 0.20 60)` (yellow) and `oklch(0.50 0.20 250)` (blue) visually have **absolutely the same lightness**.                                | You can take any `Hue` and generate a perfect 50 to 900 scale just by changing `L`. |

---

## 2. Predictable States (Hover, Active, Disabled)

In OKLCH, you don't need to guess HEX codes "by eye" for button states. States are generated mathematically and always remain harmonious.

**Faf Rule:**

- **Hover**: Decrease `Lightness` by `0.08` (or increase for the dark theme).
- **Disabled**: Set `Chroma` to `0` (full desaturation to gray) and `Lightness` to `0.70`.

```css
/* Example: Primary button */
.button {
  /* Base color: oklch(0.55 0.22 250) */
  background-color: var(--faf-color-primary);
}

.button:hover {
  /* Hover: simply decrease lightness by 0.08. Hue and Chroma remain the same. */
  /* Result: oklch(0.47 0.20 250) */
  background-color: var(--faf-color-primary-hover);
}
```

In HEX or RGB, such changes often lead to "muddy" or unpredictable shades.

---

## 3. Wide Gamut

OKLCH supports **Display P3** and **Rec.2020** color spaces.

- **HEX/RGB** are limited to the outdated **sRGB** space.
- On modern OLED screens (iPhone, MacBook, high-end monitors), colors in OKLCH format appear more vibrant and accurate, as the browser can utilize the full hardware potential of the display without clipping colors to sRGB.

---

## 4. OKLCH Value Structure

Syntax: `oklch(L C H)`

| Parameter | Name      | Range          | Description                                                                               |
| :-------- | :-------- | :------------- | :---------------------------------------------------------------------------------------- |
| **L**     | Lightness | `0.0` – `1.0`  | `0` = absolute black, `1` = absolute white.                                               |
| **C**     | Chroma    | `0.0` – `~0.4` | `0` = shade of gray. Maximum value depends on the hue (~0.35 for blue, ~0.25 for yellow). |
| **H**     | Hue       | `0` – `360`    | Angle on the color wheel (0 = red, 120 = green, 250 = blue).                              |

---

## 5. Backward Compatibility (Fallback)

Browser support for OKLCH is currently **~90%** (Safari 15.4+, Chrome 111+, Firefox 113+).

For critically important projects requiring support for very old browsers, we use a progressive enhancement strategy via CSS cascade (or `@supports`):

```css
.faf-element {
  /* Fallback for older browsers (converted from OKLCH to HEX) */
  background-color: #3b82f6;

  /* Primary color for modern browsers */
  background-color: oklch(0.55 0.22 250);
}
```

_Note: In the Faf-Foundations architecture, HEX fallbacks can be added during the CSS generation stage if required for a specific project._

---

## Conclusion

Using OKLCH in the Faf Design System is not a trend, but an engineering solution that:

1. Guarantees visual consistency of the palette.
2. Allows algorithmic generation of themes (Light/Dark) and states (Hover/Disabled).
3. Is future-proof (Wide Gamut displays).

---
