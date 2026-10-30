---
description: Audit an existing UI (code, screenshot or URL) for AI slop, UX and accessibility issues, with a scored fix plan
argument-hint: [path | url | "fix" to apply fixes]
---

Use the `taste-audit` skill on: $ARGUMENTS (if empty: the current project's UI source)

Run the scanner first when code is available, then the heuristic lenses. Return the 12-line summary and P0/P1/P2 tables. If the arguments include "fix", apply P0 then P1 fixes with minimal diffs, re-scan and report the before/after score.
