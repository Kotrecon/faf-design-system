/**
 * @module Semantic Typography
 * @description Semantic typography roles (headings, body, UI) mapping to primitive tokens.
 *              Семантические роли типографики (заголовки, текст, UI), маппящиеся на примитивные токены.
 */

import { fluidSizes } from "./fluid";
import { typographyScale } from "./scales";
import { fontFamilies } from "./font-families";
import { lineHeights } from "./line-heights";
import { fontWeights } from "./font-weights";

export const semanticTypography = {
  heading: {
    h1: {
      size: fluidSizes["3xl"],
      weight: fontWeights.bold,
      lineHeight: lineHeights.tight,
      family: fontFamilies.sans,
    },
    h2: {
      size: fluidSizes["2xl"],
      weight: fontWeights.semibold,
      lineHeight: lineHeights.tight,
      family: fontFamilies.sans,
    },
    h3: {
      size: fluidSizes.xl,
      weight: fontWeights.semibold,
      lineHeight: lineHeights.tight,
      family: fontFamilies.sans,
    },
    h4: {
      size: fluidSizes.lg,
      weight: fontWeights.medium,
      lineHeight: lineHeights.tight,
      family: fontFamilies.sans,
    },
  },
  body: {
    large: {
      size: fluidSizes.lg,
      weight: fontWeights.normal,
      lineHeight: lineHeights.relaxed,
      family: fontFamilies.sans,
    },
    base: {
      size: fluidSizes.base,
      weight: fontWeights.normal,
      lineHeight: lineHeights.normal,
      family: fontFamilies.sans,
    },
    small: {
      size: fluidSizes.sm,
      weight: fontWeights.normal,
      lineHeight: lineHeights.normal,
      family: fontFamilies.sans,
    },
    caption: {
      size: typographyScale[-2],
      weight: fontWeights.normal,
      lineHeight: lineHeights.normal,
      family: fontFamilies.sans,
    },
    muted: {
      size: typographyScale[-1],
      weight: fontWeights.normal,
      lineHeight: lineHeights.normal,
      family: fontFamilies.sans,
    },
  },
  ui: {
    button: {
      size: typographyScale[0],
      weight: fontWeights.medium,
      lineHeight: lineHeights.tight,
      family: fontFamilies.sans,
    },
    label: {
      size: typographyScale[-1],
      weight: fontWeights.semibold,
      lineHeight: lineHeights.tight,
      family: fontFamilies.sans,
    },
    code: {
      size: typographyScale[-1],
      weight: fontWeights.light,
      lineHeight: lineHeights.normal,
      family: fontFamilies.mono,
    },
    dataValue: {
      size: fluidSizes["2xl"],
      weight: fontWeights.bold,
      lineHeight: lineHeights.tight,
      family: fontFamilies.mono,
    },
  },
} as const;

export type SemanticTypographyCategory = keyof typeof semanticTypography;
export type SemanticTypographyRole<T extends SemanticTypographyCategory> =
  keyof (typeof semanticTypography)[T];
