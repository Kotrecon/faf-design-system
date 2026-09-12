/**
 * @module React CSS Properties Extension
 * @description Extends React CSSProperties to allow custom FAF CSS variables.
 *              Расширяет React CSSProperties для поддержки кастомных CSS-переменных FAF.
 */

import "react";

declare module "react" {
  interface CSSProperties {
    [key: `--faf-${string}`]: string | undefined;
  }
}
