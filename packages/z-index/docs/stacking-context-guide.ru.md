# Руководство по Stacking Context

## Что это такое

Stacking context — это независимый контекст наложения элементов на странице, который определяет порядок их отрисовки по оси Z.
Элементы внутри одного stacking context упорядочиваются относительно друг друга, но не могут “выпрыгнуть” наружу и перекрыть элементы из другого контекста только за счёт `z-index`.

## Что создаёт новый контекст

Новый stacking context создают, в частности:

- `position: absolute | relative` вместе с `z-index` не `auto`.
- `position: fixed` и `position: sticky`.
- `opacity < 1`.
- `transform`, `scale`, `rotate`, `translate`, `filter`, `backdrop-filter`, `perspective`, `clip-path`, `mask`, `mask-image`, `mask-border`.
- `mix-blend-mode` не `normal`.
- `isolation: isolate`.
- `will-change`, если оно указывает на свойство, создающее stacking context.
- `contain: layout`, `contain: paint`, `contain: strict`, `contain: content`.
- flex- и grid-элементы с `z-index` не `auto`.
- `popover` и элементы `<dialog>`.

## Правила Faf Design System

1. Используйте `z-index` только в связке с осознанной моделью позиционирования и токенами `--faf-zindex-*`.
2. Если элемент “пропадает” под другим, проверьте не только его `z-index`, но и родительские stacking context.
3. Не используйте магические числа вроде `9999`; порядок слоёв должен быть выражен через токены.
4. Избегайте случайного создания stacking context через `opacity: 0.99`, `transform: translateZ(0)` и похожие хаки без явной причины.

## Практическое правило

Если визуально что-то не перекрывается, как ожидается, сначала ищите **границу stacking context**, а уже потом настраивайте `z-index`.
Такой подход делает поведение слоёв предсказуемым и упрощает поддержку дизайн-системы.
