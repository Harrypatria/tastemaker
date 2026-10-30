# Typography

## Pairings (all open-licence on Google Fonts; self-host in production)

| Mood | Heading / Body | Mono | Pick when |
|---|---|---|---|
| Neutral product | Inter / Inter | JetBrains Mono | density and neutrality are the brief; say so |
| Technical sharp | Geist / Geist | Geist Mono | devtools, infra, Next.js projects |
| Humanist friendly | Plus Jakarta Sans / Inter | IBM Plex Mono | consumer SaaS, onboarding-heavy |
| Editorial | Fraunces / Source Sans 3 | Source Code Pro | content, reports, premium consumer |
| Literary | Newsreader / Inter | IBM Plex Mono | long reading, research, journalism |
| Corporate | IBM Plex Sans / IBM Plex Sans | IBM Plex Mono | enterprise, public sector |
| Modern geometric | Manrope / Inter | Fira Code | fintech, product marketing |
| Grotesk character | Space Grotesk / Inter | Space Mono | creator tools, launches (headings only) |
| Warm rounded | Nunito / Nunito Sans | Fira Code | education, family, wellness |
| Swiss | Archivo / Archivo | JetBrains Mono | brand sites, annual reports |
| Condensed data | Barlow Condensed / Barlow | JetBrains Mono | dense dashboards needing compact headers |

## Scale

| Context | Base | Ratio | Steps (px) |
|---|---|---|---|
| Dense app | 14 | 1.2 | 12 / 14 / 16 / 20 / 24 / 28 |
| Product UI | 16 | 1.25 | 12 / 14 / 16 / 20 / 24 / 32 / 40 |
| Marketing | 16-18 | 1.333 | 14 / 16 / 18 / 24 / 32 / 44 / 56 / 72 |
| Slides (1920 artboard) | 28 | 1.333 | 20 / 28 / 40 / 56 / 72 / 96 |

Line height: 1.5 body, 1.2-1.3 headings, 1.1 display. Measure 60-75ch. Letter-spacing -0.01 to -0.02em at 24px+, +0.02 to +0.06em for uppercase labels only. Max 2 families, 3 weights (400/500/600, add 700 only for display).

## Numbers

`font-variant-numeric: tabular-nums` on every numeric column, KPI, timer and price list. Right-align numbers in tables. Format with `Intl.NumberFormat` and `Intl.DateTimeFormat` using the user's locale; show units and currency codes.

## Loading

Next.js: `next/font`. Vite: `@fontsource-variable/*` packages. Portable Mode: system stack `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. Always `font-display: swap` and a metric-compatible fallback to avoid layout shift.
