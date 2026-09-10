# Contrast Best Practices Guide

## General Recommendations

1. **Text on Light Backgrounds**: Use color shades **700–900** for reliable WCAG AA compliance.
2. **Text on Dark Backgrounds**: Use color shades **100–300**.
3. **Focus Rings**: Must be highly visible against _any_ background. A minimum ratio of 3:1 is recommended, but 4.5:1 is safer.
4. **Icons and Outlines**: Treat them like normal text. They require a minimum of 3:1 for large icons and 4.5:1 for standard icons.

## The "Warning Color" Trap

Yellow/amber colors (e.g., `--faf-color-warning`) frequently fail WCAG AA when placed on white backgrounds.
**Solutions**:

- Use a darker shade of yellow/orange for the text/icon.
- Add a dark outline or shadow to the yellow element.
- Use yellow only as a background with dark text inside it.

## Production Color Parsing

The current implementation of `oklch` parsing in `@faf/contrast` uses a simplified mathematical approximation for educational purposes.

**For Production**: Replace the internal `parseOklch` method with a robust library like [`culori`](https://culorijs.org) or [`colorjs.io`](https://colorjs.io). This ensures 100% accuracy in color space conversion (oklch → oklab → XYZ D65 → linear sRGB → sRGB).

Example with `culori`:

```typescript
import { convertColor } from "culori";

// Replace the simplified logic with:
const rgb = convertColor("oklch(0.55 0.22 250)", "rgb");
const r = rgb.r * 255;
const g = rgb.g * 255;
const b = rgb.b * 255;
```
