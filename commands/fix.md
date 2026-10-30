---
description: Fix every slop error (and warnings with no stated reason) in the given paths, looping until clean
argument-hint: [paths...] (default: src)
allowed-tools: Bash(node:*), Read, Edit, Write, Grep, Glob
---

Use the `taste-guard` skill on: $ARGUMENTS (if empty: `src`).

Loop: scan, fix errors at the cause (tokens instead of raw values, real handlers instead of empty ones, labels instead of placeholders), re-scan touched files. Stop on two clean passes or after 3 cycles. Then run the project's typecheck and lint if present. Report the before/after score and any finding kept with an `taste-ignore` reason.
