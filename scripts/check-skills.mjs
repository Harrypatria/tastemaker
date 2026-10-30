#!/usr/bin/env node
// Lints the skill suite: frontmatter, naming, token budgets and every referenced file.
// Usage: node scripts/check-skills.mjs
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BODY_TOKEN_BUDGET = 1800 // SKILL.md bodies load on trigger; depth lives in references/
const DESC_MAX = 1024
const errors = []
const rows = []
const tokens = (s) => Math.round(s.length / 4)

function frontmatter(src, file) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!m) { errors.push(`${file}: missing frontmatter`); return [{}, src] }
  const fm = Object.fromEntries(m[1].split(/\r?\n/).map((l) => l.match(/^(\w[\w-]*):\s*(.*)$/)).filter(Boolean).map((x) => [x[1], x[2]]))
  return [fm, m[2]]
}

const skillsDir = join(root, 'skills')
const skills = readdirSync(skillsDir).filter((d) => statSync(join(skillsDir, d)).isDirectory())
for (const name of skills) {
  const dir = join(skillsDir, name)
  const file = join(dir, 'SKILL.md')
  if (!existsSync(file)) { errors.push(`skills/${name}: missing SKILL.md`); continue }
  const src = readFileSync(file, 'utf8')
  const [fm, body] = frontmatter(src, `skills/${name}/SKILL.md`)
  if (fm.name !== name) errors.push(`skills/${name}: frontmatter name "${fm.name}" must equal folder name`)
  if (!/^[a-z0-9-]+$/.test(name)) errors.push(`skills/${name}: name must be lowercase kebab-case`)
  if (!fm.description) errors.push(`skills/${name}: missing description`)
  else if (fm.description.length > DESC_MAX) errors.push(`skills/${name}: description ${fm.description.length} chars > ${DESC_MAX}`)
  if (tokens(body) > BODY_TOKEN_BUDGET) errors.push(`skills/${name}: body ~${tokens(body)} tokens > budget ${BODY_TOKEN_BUDGET}; move depth to references/`)

  // every `references/x.md`, `templates/x`, `scripts/x` mentioned must exist in this skill or the named sibling
  for (const m of body.matchAll(/`(?:(\.\.\/)?(taste-[\w-]+|tastemaker)\/)?((?:references|templates|scripts)\/[\w.-]+)`/g)) {
    const target = m[2] ? join(skillsDir, m[2], m[3]) : join(dir, m[3])
    if (!existsSync(target)) errors.push(`skills/${name}/SKILL.md references missing ${m[2] ? `${m[2]}/` : ''}${m[3]}`)
  }
  let refTokens = 0
  for (const sub of ['references', 'templates']) {
    const p = join(dir, sub)
    if (existsSync(p)) for (const f of readdirSync(p)) refTokens += tokens(readFileSync(join(p, f), 'utf8'))
  }
  rows.push([name, tokens(fm.description ?? ''), tokens(body), refTokens])
}

for (const f of readdirSync(join(root, 'agents'))) {
  const [fm] = frontmatter(readFileSync(join(root, 'agents', f), 'utf8'), `agents/${f}`)
  if (!fm.name || !fm.description) errors.push(`agents/${f}: needs name and description`)
}
for (const f of readdirSync(join(root, 'commands'))) {
  const [fm] = frontmatter(readFileSync(join(root, 'commands', f), 'utf8'), `commands/${f}`)
  if (!fm.description) errors.push(`commands/${f}: needs description`)
}
for (const f of ['.claude-plugin/plugin.json', '.claude-plugin/marketplace.json', 'hooks/hooks.json', 'package.json']) {
  try { JSON.parse(readFileSync(join(root, f), 'utf8')) } catch (e) { errors.push(`${f}: invalid JSON (${e.message})`) }
}

console.log('skill'.padEnd(18), 'desc'.padStart(6), 'body'.padStart(6), 'refs'.padStart(6), ' (approx tokens)')
for (const [n, d, b, r] of rows) console.log(n.padEnd(18), String(d).padStart(6), String(b).padStart(6), String(r).padStart(6))
const always = rows.reduce((s, r) => s + r[1], 0)
console.log(`Always loaded (all descriptions): ~${always} tokens. Typical build chain loads ~${rows.filter((r) => ['tastemaker', 'taste-direction', 'taste-components', 'taste-guard'].includes(r[0])).reduce((s, r) => s + r[2], 0)} tokens of skill bodies.`)

if (errors.length) {
  for (const e of errors) console.error(`error ${e}`)
  process.exit(1)
}
console.log(`check-skills: ${rows.length} skills OK`)
