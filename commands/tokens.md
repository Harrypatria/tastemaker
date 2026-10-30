---
description: Create or update design-tokens.json from brand hints, then generate tokens.css and Tailwind/shadcn mappings
argument-hint: [brand hints, e.g. "fintech, calm, primary #0F4C81"]
allowed-tools: Bash(node:*), Read, Edit, Write, Glob
---

Use the `taste-tokens` skill. Hints: $ARGUMENTS

If `design-tokens.json` is missing, copy `${CLAUDE_PLUGIN_ROOT}/skills/taste-tokens/templates/design-tokens.json` and adapt the primitives (use `taste-direction` palette recipes when no brand is given). Detect the Tailwind major version, then run:
`node "${CLAUDE_PLUGIN_ROOT}/skills/taste-tokens/scripts/build-tokens.mjs" design-tokens.json --out <styles dir>`
Fix every validation error and rebuild until it exits 0. Wire the generated files into the CSS entry and report which contrast pairs were checked.
