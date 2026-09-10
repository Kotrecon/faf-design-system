# Manual Testing Guide

> ⚠️ **Important**: Automated tools like `axe-core` and `@faf/contrast` are powerful, but they **do not replace manual testing**. They can only check what is programmatically measurable (e.g., static color contrast, missing ARIA attributes).

## When Automated Checks Are NOT Enough

1. **Complex Compositions**: Overlapping layers, semi-transparent backgrounds (`opacity`), or gradients can fool automated contrast checkers.
2. **Animations and Transitions**: Contrast might be sufficient at rest, but during an animation, it might drop below acceptable levels.
3. **Dynamic States**: `:hover`, `:active`, `:disabled`, or `loading` states are often not evaluated by static linters.
4. **Text on Images**: Automated tools generally cannot evaluate contrast between text and a complex photographic background.
5. **Contextual Icons**: An icon might have a 4.5:1 ratio against its background, but if its shape is too thin or ambiguous, it remains inaccessible.
6. **Focus States in Complex Layouts**: A focus ring might be clipped or obscured by a neighboring element (WCAG 2.4.11 Focus Not Obscured).

## When Manual Testing is MANDATORY

- **Before any major release**: Final accessibility sweep by QA/Design.
- **After major design system refactors**: Ensure token changes didn't break contrast in edge cases.
- **For critical user flows**: Forms, navigation, modals, and checkout processes.
- **Screen Reader Testing**: Verify that the logical reading order and ARIA labels make sense to a real user (e.g., using NVDA, VoiceOver, or JAWS).

## How to Test Manually

1. Use browser extensions like **WCAG Contrast Checker** or **Axe DevTools** to inspect specific elements.
2. Use the browser's built-in **Accessibility Inspector** (Firefox) or **Lighthouse** (Chrome).
3. Navigate the entire component using **only the keyboard** (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Arrow Keys`).
