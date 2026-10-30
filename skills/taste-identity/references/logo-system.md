# Logo System

## Style families (max two combined)

Geometric minimal · Monoline · Bold wordmark · Lettermark/monogram · Negative space · Abstract symbol · Flat (no gradient) · Emblem/badge · Grid construction · Rounded friendly · Sharp technical · Stencil · Serif editorial · Condensed industrial · Hand-drawn (original) · Pixel/retro-tech · Isometric block · Orbit/ring · Shield · Wave/flow · Hexagon/modular · Node network · Leaf/organic · Arrow/motion · Stacked layers

| Domain | Good fits | Overused there (avoid as first idea) |
|---|---|---|
| Fintech | geometric minimal, sharp technical, monogram | upward arrow, shield + check |
| Healthcare | rounded friendly, monoline | cross + heart, pulse line |
| Dev tools | monogram, sharp technical, grid construction | brackets `</>`, terminal cursor |
| AI products | abstract symbol, lettermark | sparkle, brain, neural nodes (V10) |
| Wellness | organic, serif editorial | lotus, generic leaf |
| Consumer | bold wordmark, rounded | speech bubble, generic heart |

## SVG construction

- Symbols on a square `viewBox` (e.g. `0 0 64 64`); lockups on a baseline grid; coordinates on whole or half units.
- Single-color master uses `currentColor`; multicolor uses named CSS variables so dark mode can remap.
- Strokes: consistent `stroke-linecap` / `stroke-linejoin`; convert to fills for final export when scaling matters.
- Optical corrections: round shapes overshoot flat edges by 1-3%; tighten spacing around diagonal terminals.
- Minimal path count; no stray points, hidden layers or editor metadata; include `<title>` and `role="img"`.
- Wordmarks: outline text in the master, or document font, weight, tracking and fallback.

## Usage spec (written to brand-guidelines.md §4)

| Rule | Spec |
|---|---|
| Clear space | x = height of the symbol's main shape, on all sides |
| Minimum size | symbol 16px / 6mm; full lockup 96px / 25mm |
| Backgrounds | surface, inverse surface, brand primary (reversed); busy imagery only with scrim |
| Misuse | no stretch, rotate, recolor, outline, shadow, effects, rearrangement, crowding, low contrast |
| Lockup choice | horizontal for headers, stacked for square avatars, symbol for favicons and app icons |
