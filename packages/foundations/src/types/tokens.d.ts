/**
 * @module Token Type Declarations
 * @description TypeScript declarations for CSS modules and custom FAF properties.
 *              Объявления типов TypeScript для CSS-модулей и кастомных свойств FAF.
 */

// 1. Allow importing CSS files as modules
// 1. Разрешаем импортировать CSS-файлы как модули
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

// 2. Extend standard CSS properties for custom variables
// 2. Расширяем стандартные CSS-свойства для кастомных переменных
declare global {
  namespace CSS {
    interface Properties {
      [key: `--faf-${string}`]: string | undefined;
    }
  }

  // 3. Extend CSSStyleDeclaration for Web Components
  // 3. Расширяем CSSStyleDeclaration для веб-компонентов
  interface CSSStyleDeclaration {
    [key: `--faf-${string}`]: string | undefined;
  }
}
