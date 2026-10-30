# UX Laws and Accessibility Floor

| Law | Applied as |
|---|---|
| Hick | fewer visible choices; group and progressively disclose |
| Fitts | primary targets large and near the cursor/thumb path; 44px touch, 24px minimum pointer |
| Miller | chunk into groups of 5-9; chunk long IDs and numbers (`4021 8890 1123`) |
| Jakob | conventions win: logo home top-left, search top, settings under the profile menu |
| Proximity / common region | related items closer than unrelated; group with surfaces or borders |
| Doherty | respond under 400ms or show feedback |
| Postel | accept flexible input (spaces, dashes), output a strict format |
| Peak-end | design success and completion states with care |
| Zeigarnik | show progress; make incomplete work resumable |
| Tesler | move complexity into the system (smart defaults), not onto the user |
| Von Restorff | only one element should stand out per view: the primary action |
| Aesthetic-usability | polish raises trust, so never skip micro-states |

## Accessibility floor (WCAG 2.2 AA)

Contrast 4.5:1 text, 3:1 large text and UI parts; visible focus not obscured by sticky elements (2.4.11); target size 24px minimum (2.5.8); dragging has a single-pointer alternative (2.5.7); no keyboard traps; reduced motion honoured; reflow at 320px and 400% zoom; text resizable to 200%; status messages announced (`role="status"`); programmatic labels and error association; consistent help placement (3.2.6); no re-entry of information already given in the same flow (3.3.7); accessible authentication without cognitive tests (3.3.8); no color-only meaning; localisation-ready strings (no concatenated sentences); logical CSS properties when RTL is possible.

## Pre-flight (silent, before code)

- [ ] Critical flow completable in the minimum steps, one primary action per screen.
- [ ] Every view has loading, empty, error and permission states planned.
- [ ] Location always clear (active nav, title, breadcrumb).
- [ ] Destructive actions confirmed or undoable.
- [ ] Copy specific and verb-led; no C-series slop.
- [ ] Contrast pairs verified for both themes.
- [ ] Charts match the questions; units and labels present.
- [ ] Style justified by audience and risk, not trend.
