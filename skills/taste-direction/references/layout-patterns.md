# Layout and Navigation

## Navigation

| Pattern | Use when | Spec |
|---|---|---|
| Collapsible sidebar | 5+ destinations, power users | rail 64px, expanded 240-256px, active = surface + indicator + `aria-current="page"` |
| Top nav | 3-5 destinations, marketing, content | sticky, 56-64px, condenses on scroll, mobile = sheet menu |
| Bottom tabs | mobile apps, 3-5 destinations | 56px + safe-area inset, labels always visible |
| Breadcrumbs | hierarchy depth 3+ | last crumb is text, not link |
| Command palette | 20+ actions or power users | Cmd/Ctrl+K, fuzzy, grouped, recent first |
| Tabs | peer views of one entity | never for sequential steps; URL-synced |
| Stepper | multi-step creation | progress, back allowed, draft saved |

## Layout from questions (not from templates)

Write the user's top 3 questions for the view, then place answers by priority:

| Question shape | Layout answer |
|---|---|
| "Is anything wrong right now?" | status strip or alert list at top, exceptions first, healthy items collapsed |
| "How are we trending?" | one primary chart with the comparison baseline, annotated |
| "What needs my action?" | task/queue list with inline actions above any charts |
| "Find a specific record" | search-first header, filters, table, detail drawer |
| "Compare options" | side-by-side columns with identical rows, recommended highlighted |
| "Understand a concept" | narrative column, progressive disclosure, example near claim |

Only then add KPI tiles, and only for numbers a decision depends on (each with period, delta, comparison).

## Page anatomy

Page header: title, one-line description, actions right (primary last). One primary action per view; destructive actions separated and confirmed. Content max width: apps `max-w-screen-2xl`, forms `max-w-2xl`, reading `max-w-prose`.

## Responsive

Mobile-first. Breakpoints 640 / 768 / 1024 / 1280 / 1536. Use `min-h-dvh`, container queries for reusable panels, `hidden md:table-cell` for secondary columns, card list below `md` for wide tables, sticky bottom action bar for mobile forms. Never shrink type below the minimum to fit: reflow.

## Marketing page skeleton (derive, then trim)

Hero (benefit headline + proof line + one CTA + real product visual) -> problem in the user's words -> how it works (3 steps with real UI) -> proof (only real data) -> pricing or next step -> FAQ (real objections) -> footer. Delete any section without real content rather than filling it.
