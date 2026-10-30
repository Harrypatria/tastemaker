# Banner Sizes (px; verify current platform specs before final export)

| Use | Size | Safe area / notes |
|---|---|---|
| Open Graph / link preview | 1200x630 | keep text in centre 1000x500; some apps crop to square |
| X (Twitter) header | 1500x500 | avatar overlaps lower-left; keep left 400px clear at bottom |
| LinkedIn personal cover | 1584x396 | avatar covers lower-left |
| LinkedIn company cover | 1128x191 | one line of text at most |
| Facebook page cover | 820x312 desktop | crops on mobile; keep content centred |
| YouTube channel art | 2560x1440 | all text inside centre 1546x423 |
| Instagram feed | 1080x1080 or 1080x1350 | 64px margins |
| Stories / Reels / TikTok | 1080x1920 | avoid top 250px and bottom 340px (UI overlays) |
| Web hero | 1920x1080 design, responsive | text left or centre; scrim on photos; art-direct crops per breakpoint |
| Email header | 600x200 (export 1200x400) | live HTML text where possible; dark-mode safe logo |
| Google Display | 300x250, 336x280, 728x90, 300x600, 160x600, 970x250, 320x50 | network size limits (often 150KB); visible CTA; 1px border on white |
| Roll-up / print | 850x2000mm | 3mm bleed; 300dpi at final size or vector; CMYK note; 50mm safe margin |
| Poster | A3 / A2 | 3mm bleed |

## Reflow by shape

| Shape | Layout |
|---|---|
| Wide (728x90, 970x250, 1500x500) | headline left, CTA right, small logo |
| Square (1080x1080) | stacked, large headline, CTA bottom |
| Tall (1080x1920, 160x600, 300x600) | vertical stack inside safe zones, CTA in thumb zone |
| Tiny (320x50) | logo + 3-word message + CTA only |

Keep element order and tokens identical across sizes. File budgets: web hero 250KB, social 500KB, display ads per network.
