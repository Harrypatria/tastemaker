---
description: Run the Tastemaker slop scanner and summarise findings by severity
argument-hint: [paths...] (default: src or .)
allowed-tools: Bash(node:*)
---

Run: `node "${CLAUDE_PLUGIN_ROOT}/skills/taste-guard/scripts/slop-scan.mjs" $ARGUMENTS --project` (no arguments: scan `src`)

If `src` does not exist, scan `.` instead. Summarise: score, counts, the top 5 findings by severity with their fixes. Do not edit files unless asked; offer `/tastemaker:fix` as the next step.
