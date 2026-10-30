#!/usr/bin/env node
// Validates design-tokens.json and generates tokens.css, tailwind.v4.css and tailwind.v3.cjs.
// Usage: node build-tokens.mjs [design-tokens.json] [--out dir] [--check] [--strict]
//   --check   validate only, write nothing
//   --strict  Tailwind v4: remove the default palette so only semantic colors exist (blocks slop V12)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { parseColor, contrastRatio, toHslChannels } from './contrast.mjs'

const argv = process.argv.slice(2)
const flagValue = (name) => {
  const i = argv.indexOf(name)
  return i >= 0 ? argv[i + 1] : undefined
}
const positional = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--out')
const file = positional[0] ?? 'design-tokens.json'
const outDir = flagValue('--out') ?? '.'
const checkOnly = argv.includes('--check')
const strict = argv.includes('--strict')

// shadcn/ui variable -> semantic color path (under semantic.<theme>.color)
const SHADCN = {
  background: 'bg.canvas', foreground: 'text.default',
  card: 'bg.surface', 'card-foreground': 'text.default',
  popover: 'bg.surface-raised', 'popover-foreground': 'text.default',
  primary: 'action.primary', 'primary-foreground': 'text.on-primary',
  secondary: 'action.secondary', 'secondary-foreground': 'text.default',
  muted: 'bg.surface-sunken', 'muted-foreground': 'text.muted',
  accent: 'action.secondary-hover', 'accent-foreground': 'text.default',
  destructive: 'action.destructive', 'destructive-foreground': 'text.on-primary',
  success: 'status.success', 'success-foreground': 'text.on-primary',
  warning: 'status.warning', 'warning-foreground': 'text.on-primary',
  info: 'status.info', 'info-foreground': 'text.on-primary',
  border: 'border.default', input: 'border.default', ring: 'border.focus',
  'chart-1': 'data.series-1', 'chart-2': 'data.series-2', 'chart-3': 'data.series-3',
  'chart-4': 'data.series-4', 'chart-5': 'data.series-5',
  sidebar: 'bg.surface', 'sidebar-foreground': 'text.default',
  'sidebar-primary': 'action.primary', 'sidebar-primary-foreground': 'text.on-primary',
  'sidebar-accent': 'action.secondary', 'sidebar-accent-foreground': 'text.default',
  'sidebar-border': 'border.default', 'sidebar-ring': 'border.focus',
}

const errors = []
const warnings = []
let tokens
try {
  tokens = JSON.parse(readFileSync(file, 'utf8'))
} catch (e) {
  console.error(`tastemaker tokens: cannot read ${file}: ${e.message}`)
  process.exit(2)
}

const isRef = (v) => typeof v === 'string' && /^\{[^}]+\}$/.test(v)
const refPath = (v) => v.slice(1, -1)
const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)

function leaves(obj, prefix = []) {
  const out = []
  for (const [k, v] of Object.entries(obj ?? {})) {
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) out.push(...leaves(v, [...prefix, k]))
    else out.push([[...prefix, k], v])
  }
  return out
}

const themes = Object.keys(tokens.semantic ?? {})
if (!themes.includes('light')) errors.push('semantic.light is required')

// "semantic.color.x" in the component layer means "the active theme's semantic.color.x"
function resolve(value, theme, seen = new Set()) {
  if (!isRef(value)) return value
  let path = refPath(value)
  if (path.startsWith('semantic.') && !themes.includes(path.split('.')[1])) {
    path = path.replace(/^semantic\./, `semantic.${theme}.`)
  }
  if (seen.has(path)) throw new Error(`circular reference at {${path}}`)
  seen.add(path)
  const next = get(tokens, path)
  if (next === undefined) throw new Error(`unresolved reference {${refPath(value)}}`)
  return resolve(next, theme, seen)
}

// CSS variable names
const primitiveVar = (path) => (path[0] === 'color' ? `--p-${path.slice(1).join('-')}` : `--${path.join('-')}`)
const semanticVar = (path) => `--${path.join('-')}`
const componentVar = (path) => `--${path.join('-')}`
function refToVar(value) {
  if (!isRef(value)) return value
  const parts = refPath(value).split('.')
  if (parts[0] === 'primitive') return `var(${primitiveVar(parts.slice(1))})`
  if (parts[0] === 'semantic') {
    const rest = themes.includes(parts[1]) ? parts.slice(2) : parts.slice(1)
    return `var(${semanticVar(rest)})`
  }
  if (parts[0] === 'component') return `var(${componentVar(parts.slice(1))})`
  return value
}

// 1. Layer rules and reference resolution
const primitives = leaves(tokens.primitive)
for (const [path, v] of primitives) if (isRef(v)) warnings.push(`primitive.${path.join('.')} is a reference; primitives should be raw values`)

const lightKeys = new Set()
for (const theme of themes) {
  for (const [path, v] of leaves(tokens.semantic[theme])) {
    const name = `semantic.${theme}.${path.join('.')}`
    if (theme === 'light') lightKeys.add(path.join('.'))
    if (!isRef(v)) errors.push(`${name} has a raw value "${v}"; semantic tokens must reference primitives`)
    else if (!refPath(v).startsWith('primitive.')) errors.push(`${name} must reference the primitive layer`)
    try { resolve(v, theme) } catch (e) { errors.push(`${name}: ${e.message}`) }
  }
}
for (const theme of themes.filter((t) => t !== 'light')) {
  const keys = new Set(leaves(tokens.semantic[theme]).map(([p]) => p.join('.')))
  for (const k of lightKeys) if (!keys.has(k)) errors.push(`semantic.${theme}.${k} missing (every light token needs a ${theme} value)`)
  for (const k of keys) if (!lightKeys.has(k)) warnings.push(`semantic.${theme}.${k} has no light counterpart`)
}
for (const [path, v] of leaves(tokens.component)) {
  const name = `component.${path.join('.')}`
  if (isRef(v) && refPath(v).startsWith('primitive.')) errors.push(`${name} references a primitive; use a semantic token`)
  if (!isRef(v)) warnings.push(`${name} has a raw value "${v}"`)
  for (const theme of themes) {
    try { resolve(v, theme) } catch (e) { errors.push(`${name} (${theme}): ${e.message}`) }
  }
}

// 2. Contrast pairs, every theme
const contrastReport = []
for (const [fgPath, bgPath, min = 4.5] of tokens.contrast ?? []) {
  for (const theme of themes) {
    try {
      const fg = resolve(`{semantic.${theme}.color.${fgPath}}`, theme)
      const bg = resolve(`{semantic.${theme}.color.${bgPath}}`, theme)
      const ratio = contrastRatio(fg, bg)
      if (Number.isNaN(ratio)) { warnings.push(`contrast ${fgPath} on ${bgPath} (${theme}): unsupported color format`); continue }
      contrastReport.push(`${theme.padEnd(5)} ${fgPath} on ${bgPath}: ${ratio.toFixed(2)}:1`)
      if (ratio < min) errors.push(`contrast ${fgPath} on ${bgPath} (${theme}) is ${ratio.toFixed(2)}:1, needs ${min}:1`)
    } catch (e) {
      errors.push(`contrast ${fgPath} on ${bgPath} (${theme}): ${e.message}`)
    }
  }
}

// 3. shadcn coverage
const shadcn = Object.entries(SHADCN).filter(([alias, path]) => {
  const ok = lightKeys.has(`color.${path}`)
  if (!ok) warnings.push(`shadcn --${alias} skipped: semantic color.${path} not defined`)
  return ok
})

for (const w of warnings) console.warn(`warn  ${w}`)
if (errors.length) {
  for (const e of errors) console.error(`error ${e}`)
  console.error(`\ntastemaker tokens: ${errors.length} error(s) in ${file}`)
  process.exit(1)
}
console.log(contrastReport.join('\n'))
console.log(`tastemaker tokens: ${file} valid (${themes.join(', ')}; ${contrastReport.length} contrast checks passed)`)
if (checkOnly) process.exit(0)

// 4. Generate
const decl = (name, value) => `  ${name}: ${value};`
const themeSelector = (t) => (t === 'light' ? ':root' : t === 'dark' ? '.dark' : `[data-theme="${t}"]`)
const css = ['/* Generated by tastemaker build-tokens from design-tokens.json. Do not edit by hand. */', '']

css.push(':root {', '  color-scheme: light;')
for (const [path, v] of primitives) css.push(decl(primitiveVar(path), v))
for (const [path, v] of leaves(tokens.component)) css.push(decl(componentVar(path), refToVar(v)))
for (const [alias, path] of shadcn) css.push(decl(`--${alias}`, `var(--color-${path.replace('.', '-')})`))
css.push(decl('--radius', refToVar('{primitive.radius.md}')))
css.push('}', '')

for (const theme of themes) {
  css.push(`${themeSelector(theme)} {`)
  if (theme === 'dark') css.push('  color-scheme: dark;')
  for (const [path, v] of leaves(tokens.semantic[theme])) css.push(decl(semanticVar(path), refToVar(v)))
  // HSL channels for Tailwind v3 alpha modifiers (bg-primary/90)
  for (const [alias, path] of shadcn) {
    const color = parseColor(resolve(`{semantic.${theme}.color.${path}}`, theme))
    if (color) css.push(decl(`--${alias}-hsl`, toHslChannels(color)))
  }
  css.push('}', '')
}

const durations = Object.keys(tokens.primitive?.duration ?? {})
if (durations.length) {
  css.push('@media (prefers-reduced-motion: reduce) {', '  :root {')
  for (const d of durations) css.push(`  ${decl(`--duration-${d}`, '0ms')}`)
  css.push('  }', '}', '')
}

const p = tokens.primitive ?? {}
const v4 = ['/* Generated by tastemaker build-tokens. Import after @import "tailwindcss"; and tokens.css. */', '']
v4.push('@custom-variant dark (&:where(.dark, .dark *));', '')
v4.push('@theme {')
if (strict) v4.push('  --color-*: initial;')
if (p.space?.['1']) v4.push(decl('--spacing', p.space['1']))
for (const [k, val] of Object.entries(p.radius ?? {})) if (k !== 'none' && k !== 'full') v4.push(decl(`--radius-${k}`, val))
for (const [k, val] of Object.entries(p.font?.family ?? {})) v4.push(decl(`--font-${k}`, val))
for (const [k, val] of Object.entries(p.font?.size ?? {})) v4.push(decl(`--text-${k}`, val))
for (const [k, val] of Object.entries(p.font?.leading ?? {})) v4.push(decl(`--leading-${k}`, val))
for (const [k, val] of Object.entries(p.shadow ?? {})) v4.push(decl(`--shadow-${k}`, val))
for (const [k, val] of Object.entries(p.easing ?? {})) v4.push(decl(`--ease-${k}`, val))
if (p.duration?.fast) v4.push(decl('--default-transition-duration', 'var(--duration-fast)'))
v4.push('}', '', '@theme inline {')
for (const [alias] of shadcn) v4.push(decl(`--color-${alias}`, `var(--${alias})`))
v4.push('}', '')

const nest = {}
for (const [alias] of shadcn) {
  const value = `hsl(var(--${alias}-hsl) / <alpha-value>)`
  const m = alias.match(/^(.+)-foreground$/)
  const base = m && SHADCN[m[1]] ? m[1] : null
  if (base) (nest[base] = typeof nest[base] === 'object' ? nest[base] : { DEFAULT: nest[base] }).foreground = value
  else if (typeof nest[alias] === 'object') nest[alias].DEFAULT = value
  else nest[alias] = value
}
const v3 = {
  colors: nest,
  borderRadius: Object.fromEntries(Object.keys(p.radius ?? {}).map((k) => [k, `var(--radius-${k})`])),
  fontFamily: Object.fromEntries(Object.keys(p.font?.family ?? {}).map((k) => [k, `var(--font-family-${k})`])),
  boxShadow: Object.fromEntries(Object.keys(p.shadow ?? {}).map((k) => [k, `var(--shadow-${k})`])),
  transitionDuration: Object.fromEntries(durations.map((k) => [k, `var(--duration-${k})`])),
  transitionTimingFunction: Object.fromEntries(Object.keys(p.easing ?? {}).map((k) => [k, `var(--easing-${k})`])),
  zIndex: Object.fromEntries(Object.keys(p.z ?? {}).map((k) => [k, `var(--z-${k})`])),
}
const v3src = `// Generated by tastemaker build-tokens. Spread into tailwind.config theme.extend; set darkMode: 'class'.\nmodule.exports = ${JSON.stringify(v3, null, 2)}\n`

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'tokens.css'), css.join('\n'))
writeFileSync(join(outDir, 'tailwind.v4.css'), v4.join('\n'))
writeFileSync(join(outDir, 'tailwind.v3.cjs'), v3src)
console.log(`tastemaker tokens: wrote tokens.css, tailwind.v4.css, tailwind.v3.cjs to ${outDir}`)
