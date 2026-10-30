# Changelog

## 1.0.0 (2026-10-30)

First public release, rebuilt from the earlier "UI Design Engineering Engine" skill set.

### Added
- Claude Code plugin: `.claude-plugin` manifests, `/tastemaker:build`, `:audit`, `:scan`, `:fix`, `:tokens` commands, PostToolUse hook, `taste-critic` agent.
- `taste-brief` (was the missing `prd_analyzer`) and `taste-guard` (was the missing `anti_slop_harness`).
- `taste-audit` for scoring and fixing existing UIs, screenshots and URLs.
- Slop catalog: 56 patterns across visual, copy, UX and engineering, 48 auto-detected by a zero-dependency scanner with Taste score, JSON output, inline suppression and project checks.
- Token builder: validates references, dark-mode coverage, layer rules and WCAG contrast; emits `tokens.css`, Tailwind v4 `@theme`, Tailwind v3 config and shadcn variables.
- Contrast checker supporting hex, rgb, hsl and oklch.
- Domain palette starters (all `primary-600` values pass 4.5:1 with white).
- Working HTML deck template with keyboard, touch, notes, overview, theme toggle, print-to-PDF and responsive reading mode.
- Banner PNG exporter (Playwright, optional).
- One-source platform prompts for Claude.ai, Google AI Studio, Lovable, Replit, Bolt, v0, Cursor, Windsurf, Codex/AGENTS.md, Gemini CLI and Copilot.

### Changed
- Renamed every skill to the `taste-*` scheme and split long files into a short SKILL.md plus on-demand `references/`, cutting the skill text loaded for a typical UI build from about 9,000 to about 3,200 tokens (about 65% less).
- Brand renamed to Tastemaker.
