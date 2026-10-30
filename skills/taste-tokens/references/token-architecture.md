# Token Architecture

| Layer | Purpose | Example | Rule |
|---|---|---|---|
| primitive | raw values | `color.neutral.900`, `space.4`, `radius.md` | never referenced by components |
| semantic | role | `color.bg.surface`, `color.text.muted`, `color.action.primary` | the layer components use; remapped per theme |
| component | targeted override | `button.primary.bg` | references semantic only |

Resolution: component -> semantic -> primitive. References use `{primitive.color.neutral.50}`.

## Primitive defaults

- Color ramps: neutral 50-950, primary 50-950, success/warning/danger/info key shades.
- Space (px): 0, 1=4, 2=8, 3=12, 4=16, 5=20, 6=24, 8=32, 10=40, 12=48, 16=64, 20=80, 24=96.
- Radius: none 0, sm 4, md 8, lg 12, xl 16, full 9999.
- Font size: 12, 14, 16, 18, 20, 24, 30, 36, 48, 60. Weight 400/500/600/700. Line height 1.2/1.4/1.5/1.6.
- Shadow: sm, md, lg (overlays only), focus ring.
- Duration: instant 80, fast 150, base 200, slow 300 ms. Easing: standard, enter, exit.
- Z: base 0, sticky 10, dropdown 20, overlay 30, modal 40, toast 50.
- Breakpoints: sm 640, md 768, lg 1024, xl 1280, 2xl 1536.

## Semantic set (light and dark required)

```
bg:      canvas, surface, surface-raised, surface-sunken, overlay, inverse
text:    default, muted, subtle, disabled, on-primary, on-inverse, link, danger
border:  default, strong, subtle, focus
action:  primary, primary-hover, secondary, secondary-hover, destructive
status:  success, warning, danger, info  (+ -bg, -border)
data:    series-1..6, highlight, grid
```

## shadcn/ui mapping (emitted by build-tokens)

| shadcn variable | semantic token |
|---|---|
| `--background` / `--foreground` | bg.canvas / text.default |
| `--card`, `--popover` (+ `-foreground`) | bg.surface, bg.surface-raised / text.default |
| `--primary` / `--primary-foreground` | action.primary / text.on-primary |
| `--secondary` / `--secondary-foreground` | action.secondary / text.default |
| `--muted` / `--muted-foreground` | bg.surface-sunken / text.muted |
| `--accent` / `--accent-foreground` | action.secondary-hover / text.default |
| `--destructive` | action.destructive |
| `--border`, `--input` | border.default |
| `--ring` | border.focus |
| `--chart-1..5` | data.series-1..5 |
| `--success`, `--warning`, `--info` (+ `-foreground`) | status.* |
| `--radius` | radius.md |

## Theming

`:root` = light, `.dark` = dark, `[data-contrast="more"]` = high contrast (AAA text, 2px borders). `@media (prefers-reduced-motion: reduce)` zeroes durations. Density through `[data-density]`.

## Governance

Lint for raw `#hex`, `rgb(`, `[#` outside token files (`tastemaker scan` V08). Contrast audit in both modes (build-tokens). Semver changelog. Generated docs page for review.
