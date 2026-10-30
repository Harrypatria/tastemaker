#!/usr/bin/env node
// Generates platform-ready prompt files in dist/ from adapters/core-prompt.md (single source of truth).
// Usage: node scripts/build-adapters.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const core = readFileSync(join(root, 'adapters/core-prompt.md'), 'utf8').trim()
const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const stamp = `<!-- Generated from adapters/core-prompt.md by scripts/build-adapters.mjs (tastemaker v${version}). Edit the source, not this file. -->`

const scanHint = '\n\n## Automated check\nWhen a terminal is available, run `npx tastemaker scan src` (or `node <tastemaker>/skills/taste-guard/scripts/slop-scan.mjs src`) after edits and fix every error before finishing.'

const targets = [
  { file: 'system-prompt.md', body: `${stamp}\n${core}` },
  {
    file: 'lovable-knowledge.md',
    body: `${stamp}\n${core}\n\n## Lovable specifics\nThis project runs React, Vite, TypeScript, Tailwind and shadcn/ui. Use the existing \`src/components/ui\` primitives and the CSS variables in \`src/index.css\`; never add a second component kit. Keep mocks in \`src/services/\` so the first preview renders with data. Add Supabase only when the user asks for a backend.`,
  },
  {
    file: 'replit.md',
    body: `${stamp}\n${core}\n\n## Replit specifics\nOne run command; the first preview must render with seeded data and no missing env vars. Bind servers to 0.0.0.0. List required secrets in wire-up notes instead of hardcoding them.${scanHint}`,
  },
  { file: 'AGENTS.md', body: `${stamp}\n${core}${scanHint}` },
  { file: 'GEMINI.md', body: `${stamp}\n${core}${scanHint}` },
  { file: 'copilot-instructions.md', body: `${stamp}\n${core}` },
  {
    file: 'cursor/tastemaker.mdc',
    body: `---\ndescription: Tastemaker design rules. Apply when creating or editing UI components, pages, styles, design tokens, banners or slides.\nglobs: ["**/*.tsx", "**/*.jsx", "**/*.vue", "**/*.svelte", "**/*.astro", "**/*.html", "**/*.css"]\nalwaysApply: false\n---\n${stamp}\n${core}${scanHint}`,
  },
  {
    file: 'windsurf/tastemaker.md',
    body: `---\ntrigger: glob\nglobs: "**/*.{tsx,jsx,vue,svelte,astro,html,css}"\n---\n${stamp}\n${core}${scanHint}`,
  },
]

for (const t of targets) {
  const out = join(root, 'dist', t.file)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, `${t.body}\n`)
  console.log(`${t.file.padEnd(28)} ${String(t.body.length).padStart(6)} chars  ~${Math.round(t.body.length / 4)} tokens`)
}
