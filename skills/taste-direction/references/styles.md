# Style Catalog

Choose by fit. Never mix more than two. The modifier changes surface treatment only, never layout logic.

| Style | Best for | Signature traits | Avoid when | Slop risk to watch |
|---|---|---|---|---|
| Functional minimalism | SaaS, B2B, productivity | 1px borders, neutral ramp, one accent, tight type, generous but not empty space | brand needs warmth | sterile sameness: add one ownable detail (type, accent, iconography) |
| High-density workspace | fintech, ops, trading, logistics, analytics | 13-14px base, 32-36px rows, tabular nums, split panes, keyboard-first | consumer or low-literacy audiences | cramming: density still needs grouping and hierarchy |
| Soft consumer | wellness, personal finance, education, family | 12-16px radius, big targets, friendly copy, warm neutrals | dense professional tools | pastel gradients and blobs (V01, V04) |
| Editorial / typographic | content, publishing, portfolios, reports | strong scale, serif display, 60-75ch measure, restrained color | data-heavy dashboards | decorative drop caps everywhere |
| Bento grid | product overviews, home dashboards | tiles of varied span sized by importance, consistent gap | long linear reading | equal tiles (V15): spans must reflect priority |
| Dark technical | developer, security, infra, observability | dark-first, mono accents, status dots, elevation by lightness | print-heavy or older audiences | neon glow (V09), pure black `#000` backgrounds |
| Neo-brutalist | creator tools, youth brands, indie | 2-3px borders, hard offset shadows, flat saturated fills | regulated, healthcare, finance | unreadable contrast, gimmick over function |
| Swiss / grid-rigorous | brand sites, annual reports, institutions | strict columns, flush-left, limited palette, big numerals | playful consumer apps | rigidity on mobile: reflow, don't shrink |
| Warm humanist | community, nonprofit, local services | rounded type, natural tones, real photography, illustration | cold enterprise | clip-art illustration, fake people |
| Restrained glass | media overlays, OS-like panels | blur only on overlays, solid fallback, high-contrast text | as the default surface | V03 glass cards |
| Skeuomorphic-lite | audio, finance cards, tactile tools | one material metaphor, soft depth | scanning-heavy views | inconsistent light source |
| Accessible high-contrast | healthcare, public sector, education | AAA contrast, 18px+ base, explicit labels, no motion dependence | none (use as modifier anywhere) | none |

## Archetype to style defaults

| Archetype | Primary | Modifier option |
|---|---|---|
| data-workspace / realtime | High-density workspace | Dark technical |
| crud-admin | Functional minimalism | Accessible high-contrast |
| consumer-app | Soft consumer | Warm humanist |
| marketing-site (B2B) | Swiss / grid-rigorous | Bento grid (feature overview section only) |
| marketing-site (consumer) | Warm humanist or Editorial | Soft consumer |
| content | Editorial | Accessible high-contrast |
| devtool | Dark technical | Functional minimalism |
| commerce | Functional minimalism | Editorial (product storytelling) |
