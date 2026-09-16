# Stacking Context Guide

## What is a Stacking Context?

A stacking context is an independent grouping of elements on a page that determines their rendering order along the Z-axis. Elements within a single stacking context are ordered relative to each other, but they cannot "break out" to overlay elements from a different context using _only_ the `z-index` property.

## What Creates a New Stacking Context?

A new stacking context is created by, among other things:

- `position: absolute` or `position: relative` combined with a `z-index` value other than `auto`.
- `position: fixed` and `position: sticky`.
- An `opacity` value less than `1`.
- The use of `transform`, `filter`, `backdrop-filter`, `perspective`, `clip-path`, `mask`, `mask-image`, or `mask-border`.
- A `mix-blend-mode` value other than `normal`.
- The `isolation: isolate` property.
- The `will-change` property, if it specifies a value that would create a stacking context.
- The `contain` property with values `layout`, `paint`, `strict`, or `content`.
- Flexbox or Grid children with a `z-index` value other than `auto`.
- `popover` and `<dialog>` elements.

## Faf Design System Rules

1. Use `z-index` only in conjunction with an intentional positioning model and `--faf-zindex-*` tokens.
2. If an element "disappears" behind another, check not only its `z-index` but also the stacking contexts of its parent elements.
3. Never use magic numbers like `9999`; the layer order must be expressed through tokens.
4. Avoid accidentally creating stacking contexts through hacks like `opacity: 0.99` or `transform: translateZ(0)` without a clear, intentional reason.

## Practical Rule

If something does not overlay as expected visually, first look for the **stacking context boundary**, and only then adjust the `z-index`. This approach makes layer behavior predictable and simplifies the maintenance of the design system.
