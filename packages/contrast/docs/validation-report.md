# Faf.Colors Contrast Validation Report

**Generated:** 2026-09-10T10:00:00Z

## Summary

- **Total checks:** 24
- **Passed:** 22 ✅
- **Failed:** 2 ❌

## Categories

### text-on-surface

> Text on surface (normal and large)

| Foreground               | Background            | Contrast | Size   | Status |
| ------------------------ | --------------------- | -------- | ------ | ------ |
| `--faf-color-text`       | `--faf-color-surface` | 15.4:1   | normal | ✅     |
| `--faf-color-text-muted` | `--faf-color-surface` | 4.6:1    | normal | ✅     |
| `--faf-color-text-muted` | `--faf-color-surface` | 4.6:1    | large  | ✅     |

### icon-outline

> Icons and outline elements

| Foreground            | Background            | Contrast | Size   | Status |
| --------------------- | --------------------- | -------- | ------ | ------ |
| `--faf-color-success` | `--faf-color-surface` | 3.5:1    | normal | ✅     |
| `--faf-color-warning` | `--faf-color-surface` | 2.1:1    | normal | ❌     |

### focus-ring

> Focus ring on various surfaces

| Foreground         | Background            | Contrast | Size   | Status |
| ------------------ | --------------------- | -------- | ------ | ------ |
| `--faf-focus-ring` | `--faf-color-surface` | 4.8:1    | normal | ✅     |

## 🚨 Issues

| Category     | Foreground            | Background            | Contrast | Required | Size   |
| ------------ | --------------------- | --------------------- | -------- | -------- | ------ |
| icon-outline | `--faf-color-warning` | `--faf-color-surface` | 2.1:1    | 4.5:1    | normal |

## Recommendations

- For text on light backgrounds, use shades 700-900.
- For text on dark backgrounds, use shades 100-300.
- Focus ring must be highly contrastive against any background (minimum 3:1).
- Warning color (yellow) often fails WCAG AA on white backgrounds — use with caution or with dark text.
- Large Text (≥18pt or ≥14pt bold) has reduced requirements (3:1 instead of 4.5:1).
