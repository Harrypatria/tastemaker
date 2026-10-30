#!/usr/bin/env node
// Tastemaker CLI: thin dispatcher over the skill scripts so every tool works from one command.
import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const [cmd, ...rest] = process.argv.slice(2)

const SCRIPTS = {
  scan: 'skills/taste-guard/scripts/slop-scan.mjs',
  tokens: 'skills/taste-tokens/scripts/build-tokens.mjs',
  contrast: 'skills/taste-tokens/scripts/contrast.mjs',
  banners: 'skills/taste-banners/scripts/export-banners.mjs',
}

// tastemaker init <platform>: copy the generated prompt file to where that tool reads it
const INIT = {
  claude: [['skills/taste-tokens/templates/design-tokens.json', 'design-tokens.json']],
  cursor: [['dist/cursor/tastemaker.mdc', '.cursor/rules/tastemaker.mdc']],
  windsurf: [['dist/windsurf/tastemaker.md', '.windsurf/rules/tastemaker.md']],
  agents: [['dist/AGENTS.md', 'AGENTS.md']],
  codex: [['dist/AGENTS.md', 'AGENTS.md']],
  gemini: [['dist/GEMINI.md', 'GEMINI.md']],
  copilot: [['dist/copilot-instructions.md', '.github/copilot-instructions.md']],
  replit: [['dist/replit.md', 'replit.md']],
  tokens: [['skills/taste-tokens/templates/design-tokens.json', 'design-tokens.json']],
}

const HELP = `tastemaker <command>

  scan [paths] [--project] [--json] [--fail-on warn]   find AI slop, print Taste score (exit 1 on errors)
  tokens [design-tokens.json] --out <dir> [--strict]    validate tokens, write tokens.css + Tailwind v3/v4 + shadcn vars
  contrast <fg> <bg> [--large]                          WCAG contrast ratio
  banners <folder>                                      export banner HTML to 2x PNG (needs Playwright)
  init <claude|cursor|windsurf|agents|gemini|copilot|replit|tokens>
                                                        copy the platform rules file into this project
  prompt <lovable|ai-studio|system>                     print a paste-ready prompt for chat builders
`

if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
  console.log(HELP)
  process.exit(0)
}

if (SCRIPTS[cmd]) {
  const r = spawnSync(process.execPath, [join(root, SCRIPTS[cmd]), ...rest], { stdio: 'inherit' })
  process.exit(r.status ?? 1)
}

if (cmd === 'init') {
  const plan = INIT[rest[0]]
  if (!plan) {
    console.error(`Unknown platform "${rest[0] ?? ''}". Choose: ${Object.keys(INIT).join(', ')}`)
    process.exit(2)
  }
  for (const [from, to] of plan) {
    const dest = resolve(to)
    if (existsSync(dest) && !rest.includes('--force')) {
      console.log(`skip  ${to} exists (use --force to overwrite)`)
      continue
    }
    mkdirSync(dirname(dest), { recursive: true })
    copyFileSync(join(root, from), dest)
    console.log(`wrote ${to}`)
  }
  if (rest[0] === 'claude') console.log('Install the plugin in Claude Code: /plugin marketplace add Harrypatria/tastemaker then /plugin install tastemaker@tastemaker')
  process.exit(0)
}

if (cmd === 'prompt') {
  const file = { lovable: 'dist/lovable-knowledge.md', 'ai-studio': 'dist/system-prompt.md', system: 'dist/system-prompt.md' }[rest[0] ?? 'system']
  if (!file) {
    console.error('Choose: lovable, ai-studio, system')
    process.exit(2)
  }
  process.stdout.write(readFileSync(join(root, file), 'utf8'))
  process.exit(0)
}

console.error(`Unknown command "${cmd}".\n\n${HELP}`)
process.exit(2)
