# WCAG Contrast Guide

## What is WCAG?

**WCAG (Web Content Accessibility Guidelines)** is the international standard for web accessibility, developed by the W3C. It provides a shared standard for web content accessibility that meets the needs of individuals, organizations, and governments internationally.

## Contrast Requirements (WCAG 2.1)

Contrast is measured as a ratio between the relative luminance of the foreground (text/icon) and the background. The ratio ranges from 1:1 (no contrast) to 21:1 (maximum contrast, black on white).

| Level                            | Normal Text | Large Text |
| :------------------------------- | :---------- | :--------- |
| **WCAG AA** (Minimum standard)   | ≥ 4.5:1     | ≥ 3.0:1    |
| **WCAG AAA** (Enhanced standard) | ≥ 7.0:1     | ≥ 4.5:1    |

## What is "Large Text"?

WCAG defines large text as:

- Font size **≥ 18pt (24px)**, OR
- Font size **≥ 14pt (18.5px)** with **bold** weight.

Large text has reduced contrast requirements because the increased size and weight make it easier to read even with lower contrast.

## How Contrast is Calculated

1. **Linearization**: Convert sRGB color channels (0-255) to linear values to account for monitor gamma correction.
   - If $C_{srgb} \le 0.03928$, then $C_{lin} = C_{srgb} / 12.92$
   - If $C_{srgb} > 0.03928$, then $C_{lin} = ((C_{srgb} + 0.055) / 1.055)^{2.4}$
2. **Relative Luminance ($L$)**: Calculate the perceived brightness.
   - $L = 0.2126 \times R_{lin} + 0.7152 \times G_{lin} + 0.0722 \times B_{lin}$
3. **Contrast Ratio ($CR$)**:
   - $CR = (L_{lighter} + 0.05) / (L_{darker} + 0.05)$

> 💡 **Note**: The `@faf/contrast` utility implements these exact formulas. For `oklch` colors, it uses a simplified conversion. See [Limitations](../README.md#limitations-and-allowances) for production recommendations.
