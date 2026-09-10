# Patterns Guide

## Why are patterns in the z-index package?

Patterns (`FafModal`, `FafToast`, `FafDropdown`, `FafTooltip`) are included here not as a replacement for a full UI library, but as **reference implementations**. They prove that the token system works correctly in the real DOM and demonstrate the proper way to apply the Layer Contract.

## Styling Contract

All patterns adhere to the following common rules:

1. **Encapsulation:** Structure, local states, and accessibility are managed entirely within the Shadow DOM.
2. **Theming:** The primary mechanism relies on `--faf-*` CSS custom properties, which serve as the public API of the design system.
3. **Context:** `:host-context([data-theme="dark"])` is permitted _only_ for targeted, context-aware variable overrides, never for duplicating state logic.
4. **No `::slotted` for interactivity:** Complex hover/focus scenarios for projected content are handled by the child component's own Shadow DOM (e.g., `FafDropdownItem`).

## Usage

You can import these components directly or use their source code as a reference when building your own components in your project. [Learn more about Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).

## Note on Theming

- If the theme is already defined via tokens at the `html` or `:root` level, the component should read them directly without duplicating theming logic.
- `:host-context()` should only be used when a component genuinely needs to be aware of its surrounding context, not as the primary mechanism for styling states.
