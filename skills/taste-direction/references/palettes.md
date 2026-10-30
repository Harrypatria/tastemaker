# Palette Recipes

Build: neutral ramp 50-950 + one primary ramp + optional accent + semantic status set (success, warning, danger, info). The listed `primary-600` values pass 4.5:1 with white text; verify any change with `node taste-tokens/scripts/contrast.mjs "#fff" "<hex>"`.

## Domain starters (ownable, non-default hues)

| Domain | primary-600 | Accent (use sparingly) | Neutral family | Notes |
|---|---|---|---|---|
| Fintech / banking | `#0F4C81` harbour blue | gain `#1A7F4B` | cool slate | Loss `#B42318`; always pair with sign and icon, never color alone |
| Healthcare | `#0B6E7F` clinical teal | `#2F7D4F` | cool gray | Low saturation, large text, no alarming reds outside real alerts |
| Dev tools / infra | `#2563C9` on light, `#6EA8FE` on dark | terminal green `#2DA44E` | near-black blue-gray | Canvas `#0B0D12` not `#000`; status colors distinct in dark |
| Productivity SaaS | `#C2410C` vermilion | none | warm stone | Ink-on-paper feel; accent only for primary action |
| E-commerce | `#1C1917` warm ink | CTA `#B45309` amber | warm stone | CTA must be the most saturated element on screen |
| Education | `#1E5AA8` study blue | `#F2B705` fill with dark text | neutral | Never yellow text on white |
| Wellness | `#4F6F52` sage | terracotta `#B4532A` | sand `#EFE7DA` surface | High whitespace; no gradients |
| Legal / enterprise | `#1B2A4A` navy | muted gold `#8A6D25` | warm gray | Conservative; gold for marks and dividers, not text |
| Creator / media | `#B0186A` magenta | `#0F766E` | neutral | One loud hue on calm neutrals |
| Public sector | `#0B4F8A` | none | neutral | AAA text where possible; 18px base |
| Climate / energy | `#2D6A4F` forest | `#E07A1F` | warm neutral | Data-led; chart palette carries the color |
| Security | `#1F6FEB` fills, `#58A6FF` text on dark | amber `#D29922` | graphite | Severity scale: info, low, medium, high, critical with icons |

## Semantic status (light mode, text-safe on white)

| Role | fg | bg (tint) | border |
|---|---|---|---|
| success | `#157F3B` | `#ECFDF3` | `#ABEFC6` |
| warning | `#B54708` | `#FFFAEB` | `#FEDF89` |
| danger | `#B42318` | `#FEF3F2` | `#FECDCA` |
| info | `#175CD3` | `#EFF8FF` | `#B2DDFF` |

## Data-viz (colorblind-safe, Okabe-Ito order)

`#0072B2` `#E69F00` `#009E73` `#D55E00` `#CC79A7` `#56B4E9` (avoid `#F0E442` for thin lines on white). One highlight series in the primary; others in neutral grays when telling a single story.

## Rules

- 60/30/10: neutral surfaces / secondary surfaces / accent.
- Status = color + icon + label (U15).
- Dark mode is a remapped semantic layer, not an inversion: reduce chroma 10-15%, express elevation by lighter surfaces, keep text at `neutral-100`, not pure white, for long reading.
- Generate ramps in OKLCH with fixed lightness steps, then hand-correct the 500-700 band for contrast.
- Test protanopia/deuteranopia whenever red and green carry meaning.
- Brand supplied? Use it; only fix contrast failures and say which pair was adjusted.
