# Contributing to Tastemaker

Thanks for helping AI coders ship better interfaces.

## Ground rules

- Every rule must make products better for real users, not enforce one aesthetic. "Purple is bad" is not a rule; "a default gradient chosen without a brand reason" is.
- Keep SKILL.md bodies under the 1,800-token budget. Put depth in `references/`.
- No runtime dependencies in scripts. Node 18+ built-ins only.
- Write the way the skills ask agents to write: specific, sentence case, no hype.

## Add a slop pattern

1. **Catalog**: add a row to `skills/tastemaker/references/slop-catalog.md` with the next free ID in its series (V, C, U, E), severity, Auto or Review, and the fix.
2. **Scanner** (if Auto): add a rule to `LINE_RULES` or `TAG_RULES` in `skills/taste-guard/scripts/slop-scan.mjs`. Prefer precise patterns over broad ones; a noisy rule gets switched off and helps nobody.
3. **Test**: add a positive and a negative case to `tests/slop-scan.test.mjs`, and extend `tests/fixtures/sloppy` if the pattern is common.
4. **Prompt**: if the pattern is common enough for the banned list, add it to `adapters/core-prompt.md` and run `npm run build:adapters`.

## Add or change a skill

- Folder name = frontmatter `name`, lowercase kebab-case, `taste-` prefix.
- The description says what it does and when to use it, with trigger phrases users actually type.
- Reference other files with backticked relative paths so `npm run check` can verify they exist.

## Before you open a pull request

```bash
npm run verify          # skill lint + tests + token template validation
npm run build:adapters  # if you touched adapters/core-prompt.md
```
