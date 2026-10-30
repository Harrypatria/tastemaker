# Icons and Collateral

## App and web icons

Favicon: `favicon.svg` + 32px PNG (+ 16px ICO for legacy). Apple touch 180px. PWA 192 and 512, plus maskable 512 with the mark inside the central 80% safe zone. OG card 1200x630 on a solid surface (see taste-banners).

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
```

## UI icon set

Lucide by default. Custom icons match its geometry: 24px grid, 2px stroke (or the brand's), 2px padding, round caps and joins, `currentColor`. Sizes 16 / 20 / 24. Icon + label by default; icon-only needs `aria-label` and a tooltip (U01).

## Collateral (HTML/SVG templates on request)

| Asset | Spec |
|---|---|
| Business card | 85x55mm (or 3.5x2in), 3mm bleed, 5mm safe margin |
| Letterhead | A4 / US Letter, 20mm margins, logo top-left, legal line in footer |
| Email signature | table-based HTML, max 600px wide, web-safe font fallbacks, hosted logo with alt text |
| Social avatar | 400x400, symbol centered and circle-crop safe |
| Invoice / document | A4, token typography, tabular numerals, clear totals block |
| Deck / banner | see taste-slides / taste-banners |

Mockups: flat CSS placement only. Never fabricate photographic realism, endorsements or customer logos.
