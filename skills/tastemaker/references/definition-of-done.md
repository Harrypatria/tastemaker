# Definition of Done

## Product
- [ ] Every requirement in `BUILD_MANIFEST.md` maps to a rendered, working element (or slide / asset).
- [ ] One primary action per view; navigation location always clear.
- [ ] Copy is domain-specific; no catalog C-series findings without a stated reason.

## States
- [ ] Interactive: default, hover, focus-visible, active, disabled, loading.
- [ ] Data: loading (skeleton matching final layout), empty (first-use), filtered-empty, error (cause + retry), success, permission-denied, offline/slow where relevant.
- [ ] Forms: pristine, invalid (inline, focus first invalid), submitting, server error (input preserved), success.

## Visual system
- [ ] All values trace to `design-tokens.json` / `tokens.css`; no V08.
- [ ] Light and dark verified per component; no theme flash.
- [ ] Responsive at 320 / 768 / 1280 / 1536; no horizontal page scroll; touch targets 44px on touch.

## Accessibility (WCAG 2.2 AA)
- [ ] Contrast 4.5:1 text, 3:1 large text and UI boundaries, verified by `taste-tokens/scripts/contrast.mjs` for token pairs.
- [ ] Full keyboard path; visible focus not hidden by sticky bars; no traps; logical order.
- [ ] Landmarks, headings in order, labelled controls, errors linked via `aria-describedby`, status messages announced.
- [ ] `prefers-reduced-motion` honoured; content reflows at 400% zoom.

## Engineering
- [ ] Stack adapter applied; one kit, one icon set, correct Tailwind major.
- [ ] Data boundary isolated with typed mocks and `// DATA:` contracts.
- [ ] `tastemaker scan` 0 errors; typecheck, lint, build pass where tooling exists.
- [ ] New dependencies listed in wire-up notes with the reason.
