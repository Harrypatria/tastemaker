---
description: Build a UI, page or app with the full Taste Loop (brief, taste, tokens, components, guard)
argument-hint: <what to build, or path to a PRD>
---

Use the `tastemaker` skill to build: $ARGUMENTS

Run the Taste Loop end to end:
1. READ: detect platform and stack; if the input is a PRD or larger than one page, run `taste-brief` and write `BUILD_MANIFEST.md`.
2. DECIDE: run `taste-direction`; show the 8-line Design Decision before writing code.
3. TOKENS: ensure `design-tokens.json` exists (`taste-tokens` Minimal) and build it.
4. BUILD: `taste-components`, bottom-up, realistic seeded data, every state.
5. SCAN + FIX: `taste-guard` until 0 errors (max 3 cycles), then run typecheck, lint and build if available.
6. For anything larger than one view, ask the `taste-critic` agent for a fresh-eyes review and fix its P0 and P1 items.

Reply with the deliverable, one `Taste:` status line and at most 5 wire-up notes.
