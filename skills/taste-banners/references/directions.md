# Art Directions

| Direction | Composition | Use when | Slop to avoid |
|---|---|---|---|
| Typographic | headline dominant, flat brand color, minimal graphics | strong message, no imagery | gradient text (V02) |
| Product / UI hero | real product screenshot framed with supporting copy | SaaS, apps, e-commerce | fake UI with lorem; tilted 3D mockups by default |
| Photographic | full-bleed photo, scrim, text on the calm zone | lifestyle, events, travel | stock handshakes and laptops |
| Geometric | brand-derived shapes on a grid | tech, finance | random blobs (V04) |
| Illustrative | original vector illustration in brand style | education, consumer | generic flat people |
| Data-led | one big real number or a simple chart as hero | reports, launches, results | invented numbers (C03) |
| Split | image half, copy half | recruiting, B2B | unequal visual weight without intent |
| Editorial quote | short real quote with attribution | proof, PR | unattributed or invented quotes |

Three options must differ in **idea** (what carries the message), not only color or layout mirroring. Generate all three from one shared token set.

## Export script

`node <skill-dir>/scripts/export-banners.mjs banners/` renders every `*.html` in the folder (except `index.html`) at its artboard size and 2x scale to PNG next to the source. Requires `npm i -D playwright` and `npx playwright install chromium`.
