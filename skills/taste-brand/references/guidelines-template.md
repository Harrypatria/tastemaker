# brand-guidelines.md template

```md
# <Brand> Guidelines  v<semver> · owner <name> · updated <date>

1. Brief and positioning (statement, purpose, vision, mission, values with behaviours, differentiators with evidence)
2. Personality sliders, voice principles, tone matrix
3. Messaging (tagline, value prop, pitch, pillars, boilerplate, audience messages)
4. Logo usage (filled by taste-identity: clear space, min size, lockups, backgrounds, misuse)
5. Color (hex + OKLCH, role, usage ratio, verified pairs `fg on bg = ratio`, forbidden combinations)
6. Typography (families, licence, scale, weights, casing and tracking rules, fallbacks)
7. Imagery (subject, lighting, grade, crop) and illustration (line weight, fill, perspective); avoid-list
8. Iconography (library, stroke, grid, size steps)
9. Layout, spacing, radius family, elevation language
10. Motion (level, durations, easing, what never moves)
11. Data-viz palette and highlight rule
12. Voice do / don't (min 6 pairs)
13. Asset inventory and naming
14. Governance (owners, approval, versioning, changelog)
```

## Asset naming and layout

`<brand>-<asset>-<variant>-<size>.<ext>`, lowercase, hyphens: `northwind-logo-horizontal-mono-dark.svg`.

```
brand/
  brand-guidelines.md
  logos/      svg masters + png exports (1x, 2x) + favicon set
  tokens/     link to design-tokens.json
  fonts/      licence notes only (never redistribute without licence)
  imagery/  icons/  templates/ (banners, slides)
  assets.json (path, purpose, dimensions, licence, owner, updated)
  CHANGELOG.md
```
SVG is the master; rasters are exported from it.
