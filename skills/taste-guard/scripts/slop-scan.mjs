#!/usr/bin/env node
// taste-ignore-file  (this file contains the patterns it detects)
// Tastemaker scanner: finds AI-slop patterns in UI code. Zero dependencies, Node 18+.
//
// Usage:
//   node slop-scan.mjs [paths...] [--json] [--project] [--fail-on error|warn] [--quiet]
//   node slop-scan.mjs --hook          Claude Code PostToolUse hook (tool JSON on stdin)
// Config: .tastemakerrc.json  { "rules": { "V12": "off" }, "ignore": ["src/legacy/*"], "includeVendored": false }
// Suppress inline: // taste-ignore V01 <reason>   (same or previous line)

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, extname, relative, resolve, dirname } from 'node:path'
import { pathToFileURL } from 'node:url'

const MARKUP = new Set(['.tsx', '.jsx', '.vue', '.svelte', '.astro', '.html', '.htm', '.cshtml', '.razor', '.erb', '.php', '.hbs', '.njk', '.liquid'])
const SCRIPT = new Set(['.ts', '.js', '.mjs', '.cjs'])
const STYLE = new Set(['.css', '.scss', '.sass', '.less', '.pcss'])
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.nuxt', '.svelte-kit', '.output', 'out', 'coverage', 'vendor', '.turbo', '.vercel', '.cache', 'public', 'storybook-static'])
const TOKEN_FILE = /(?:^|[\\/])(?:[\w.-]*tokens?|theme|globals?|variables|index|app|main|tailwind\.v[34])\.(?:css|scss)$|tailwind\.config\.|design-tokens/i
const VENDORED = /[\\/]components[\\/]ui[\\/]/
const WEIGHT = { error: 10, warn: 3, info: 1 }
const SEVERITIES = ['info', 'warn', 'error']

const kindOf = (file) => {
  const ext = extname(file).toLowerCase()
  if (MARKUP.has(ext)) return 'markup'
  if (SCRIPT.has(ext)) return 'script'
  if (STYLE.has(ext)) return 'style'
  return null
}

const ICON_LIBS = /from\s+['"](lucide-react|lucide-vue-next|lucide-svelte|react-icons[\w/-]*|@heroicons\/[\w/-]+|@fortawesome\/[\w/-]+|@mui\/icons-material|phosphor-react|@phosphor-icons\/[\w-]+|@tabler\/icons[\w-]*|react-feather|@radix-ui\/react-icons)['"]/g
const KITS = /from\s+['"](@mui\/material|antd|@chakra-ui\/react|react-bootstrap|@mantine\/core|semantic-ui-react|@headlessui\/react)['"]/
const SHADCN_IMPORT = /from\s+['"](?:@\/|~\/|\.{1,2}\/)[\w/.-]*components\/ui\//

const PALETTE = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'
const ICONISH = /<(?:svg\b|[A-Z]\w*(?:Icon)?\b)/

// Line rules: regex tested per line. `when(line)` adds context conditions.
const LINE_RULES = [
  { id: 'V01', sev: 'warn', kinds: ['markup', 'script'], re: /\b(?:from|via)-(?:indigo|violet|purple|fuchsia)-\d{2,3}\b[^"'`\n]*\bto-(?:pink|blue|purple|violet|cyan|fuchsia|indigo|sky|rose)-\d{2,3}/, msg: 'Default "AI gradient"', fix: 'Solid brand surface; gradients only if brand-guidelines.md defines them' },
  { id: 'V02', sev: 'warn', kinds: ['markup', 'script', 'style'], re: /\bbg-clip-text\b[^"'`\n]*\btext-transparent\b|\btext-transparent\b[^"'`\n]*\bbg-clip-text\b|background-clip:\s*text/, msg: 'Gradient-clipped text', fix: 'Solid text-foreground; emphasise with weight or size' },
  { id: 'V03', sev: 'warn', kinds: ['markup', 'script'], re: /\bbackdrop-blur(?:-\w+)?\b/, when: (l) => !/\b(?:sticky|fixed|overlay|Overlay|supports-\[backdrop)/.test(l), msg: 'Glass on a resting surface', fix: 'Blur only sticky headers and overlays' },
  { id: 'V04', sev: 'warn', kinds: ['markup', 'script'], re: /\bblur-(?:2xl|3xl|\[\d{2,3}px\])/, when: (l) => /\b(?:absolute|rounded-full|-z-10|pointer-events-none)\b/.test(l), msg: 'Decorative blurred blob', fix: 'Remove; create interest with layout, type and real imagery' },
  { id: 'V05', sev: 'info', kinds: ['markup', 'script'], re: /\b(?:shadow-2xl|rounded-3xl|rounded-\[(?:2[4-9]|[3-9]\d)px\])/, msg: 'Heavy shadow or oversized radius', fix: 'Border first; shadow for overlays; radius from token family' },
  { id: 'V06', sev: 'warn', kinds: ['markup', 'script'], re: /\bhover:scale-(?:10[2-9]|1[1-9]\d)\b/, when: (l) => !/<(?:img|Image|video)\b/.test(l), msg: 'Hover scale on a card or button', fix: 'Change color, border or elevation instead' },
  { id: 'V07', sev: 'error', kinds: ['markup', 'script'], re: /(?![\u00A9\u00AE\u2122\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u25AA-\u25FE\u2600-\u2604\u2611\u2660-\u2668])\p{Extended_Pictographic}/u, msg: 'Emoji in UI', fix: 'Lucide or inline SVG icon with a text label' },
  { id: 'V08', sev: 'error', kinds: ['markup', 'script', 'style'], skipTokenFiles: true, re: /\b(?:bg|text|border|from|via|to|ring|fill|stroke|shadow|outline|decoration|divide|placeholder|caret|accent)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(|oklch\()|\b(?:color|background(?:Color)?|borderColor|fill|stroke)\s*:\s*['"`](?:#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\()|(?:^|[{;])\s*(?:color|background(?:-color)?|border(?:-color)?|fill|stroke|box-shadow)\s*:[^;]*(?:#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\()/, msg: 'Raw color outside the token layer', fix: 'Use a semantic token (bg-primary, text-muted-foreground, var(--color-...))' },
  { id: 'V09', sev: 'warn', kinds: ['markup', 'script'], re: /\b(?:drop-)?shadow-\[0_0_\d+px/, msg: 'Neon glow', fix: 'Remove, or reserve one focus/status glow defined in tokens' },
  { id: 'V10', sev: 'warn', kinds: ['markup', 'script'], re: /\bSparkles(?:Icon)?\b/, msg: 'Sparkles icon as "AI" shorthand', fix: 'Name the capability with a functional icon ("Summarize", "Draft reply")' },
  { id: 'V11', sev: 'warn', kinds: ['markup', 'script'], re: /\banimate-(?:bounce|ping)\b/, msg: 'Decorative animation', fix: 'Motion only for feedback, orientation or continuity' },
  { id: 'V12', sev: 'warn', kinds: ['markup', 'script'], re: new RegExp(`\\b(?:bg|text|border|ring|divide|from|via|to)-(?:(?:${PALETTE})-(?:50|[1-9]00|950)|white|black)\\b`), msg: 'Palette class instead of semantic token', fix: 'bg-background, bg-card, bg-muted, text-muted-foreground, border-border' },
  { id: 'V16', sev: 'info', kinds: ['markup', 'script'], re: /bg-\[radial-gradient|bg-\[url\(['"]?data:image\/svg|\bbg-(?:grid|dot)(?:-[\w-]+)?\b|bg-\[linear-gradient\(to_right,/, msg: 'Default decorative background pattern', fix: 'Plain surface unless the brand defines a texture' },

  { id: 'C01', sev: 'warn', kinds: ['markup', 'script'], re: /\b(?:unlock(?:s|ing)? (?:the|your|new|more|a|an|real|full)\b|supercharg\w*|elevate your|seamless(?:ly)?|revolutioni[sz]\w*|effortless(?:ly)?|cutting[- ]edge|game[- ]chang\w*|next[- ]level|unleash\w*|empower(?:s|ing)?|world[- ]class|best[- ]in[- ]class|state[- ]of[- ]the[- ]art|harness the power|fast[- ]paced world|look no further)\b/i, when: (l) => !/^\s*import\b/.test(l), msg: 'Hype copy', fix: 'State the concrete outcome with a number or noun' },
  { id: 'C02', sev: 'error', kinds: ['markup', 'script'], re: /\blorem ipsum\b|\bdolor sit amet\b|\b(?:john|jane) (?:doe|smith)\b|\byour company(?: name)?\b|\bcompany name\b|\bproduct name\b|\bplaceholder text\b/i, msg: 'Placeholder content', fix: 'Domain-true copy and seeded data' },
  { id: 'C03', sev: 'warn', kinds: ['markup', 'script'], re: /\b\d[\d,.]*\s?[kKmM]?\+\s+(?:happy |satisfied |active )?(?:users|customers|clients|developers|teams|companies|businesses|downloads)\b|\btrusted by\b|\b99\.9+%\s*uptime\b|\b(?:5|five)[- ]star\b|\bloved by\b/i, msg: 'Social proof that may be invented', fix: 'Use only real, supplied data; otherwise remove' },
  { id: 'C04', sev: 'warn', kinds: ['markup', 'script'], re: /(?:>|(?<!type=)["'`])\s*(?:get started|learn more|click here|submit|read more)\s*(?:<|["'`])|^\s*(?:get started|learn more|click here|submit|read more)\s*$/i, msg: 'Generic call to action', fix: 'Verb + object: "Create invoice", "Compare plans"' },
  { id: 'C05', sev: 'warn', kinds: ['markup', 'script'], re: /\bWelcome to [A-Z]/, msg: '"Welcome to <Product>" headline', fix: 'Lead with the benefit for this audience' },
  { id: 'C06', sev: 'info', kinds: ['markup'], re: />[^<>{}\n]*[a-z]![^<>{}\n=]*</, msg: 'Exclamation mark in interface copy', fix: 'Calm, specific tone' },

  { id: 'U03', sev: 'error', kinds: ['markup', 'script'], re: /(?:^|[\s"'`])(?:focus:)?outline-none\b/, when: (l) => !/(?:focus|focus-visible|focus-within|group-focus-visible|peer-focus-visible):(?:ring|outline-(?!none)|border|shadow)/.test(l), msg: 'Focus outline removed without replacement', fix: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2' },
  { id: 'U05', sev: 'error', kinds: ['markup', 'script'], re: /user-scalable\s*=\s*(?:no|0)|maximum-scale\s*=\s*1(?:\.0)?\b/, msg: 'Zoom disabled', fix: 'content="width=device-width, initial-scale=1"' },
  { id: 'U06', sev: 'warn', kinds: ['markup', 'script', 'style'], re: /\b(?:min-)?h-screen\b|\b100vh\b/, msg: 'Viewport height that breaks on mobile', fix: 'min-h-dvh / 100dvh' },
  { id: 'U07', sev: 'error', kinds: ['markup', 'script'], re: /\bwindow\.(?:alert|confirm|prompt)\s*\(|(?<![\w.$])alert\s*\(/, msg: 'Native alert/confirm dialog', fix: 'Toast for info, AlertDialog for decisions' },
  { id: 'U11', sev: 'warn', kinds: ['markup', 'script', 'style'], re: /\btext-\[(?:[0-9]|1[01])(?:\.\d+)?px\]|font-size:\s*(?:[0-9]|1[01])px/, msg: 'Text smaller than 12px', fix: 'Minimum 12px for meta text, 14-16px for body' },
  { id: 'U13', sev: 'error', kinds: ['markup', 'script'], re: /tabIndex=\{?\s*["']?[1-9]|tabindex=["'][1-9]/, msg: 'Positive tabindex', fix: 'Rely on DOM order; use 0 or -1 only' },

  { id: 'E01', sev: 'error', kinds: ['markup', 'script', 'style'], re: /(?:\/\/|\/\*|<!--|\{\/\*|#)\s*(?:TODO|FIXME|HACK)\b|\brest of (?:the )?(?:code|component|implementation)\b|\b(?:add|put) (?:your )?(?:logic|code) here\b|\bimplement(?:ation)? (?:goes )?here\b|\.{3}\s*(?:existing|rest of|more) (?:code|items|logic)/i, msg: 'Unfinished code marker', fix: 'Implement now, or cut scope and say so in wire-up notes' },
  { id: 'E02', sev: 'error', kinds: ['markup', 'script'], re: /\bon[A-Z]\w*=\{\s*(?:\(\s*\w*\s*\)|\w+)\s*=>\s*\{\s*\}\s*\}|function\s+handle\w*\s*\([^)]*\)\s*\{\s*\}/, msg: 'Empty event handler', fix: 'Wire a real handler or disable the control with a reason' },
  { id: 'E02', sev: 'warn', kinds: ['markup'], re: /href=["']#["']/, msg: 'Dead link href="#"', fix: 'Real route, or a <button> for actions' },
  { id: 'E03', sev: 'warn', kinds: ['markup'], re: /\bconsole\.(?:log|debug)\s*\(/, msg: 'console.log in UI code', fix: 'Remove or route through a logger' },
  { id: 'E04', sev: 'warn', kinds: ['markup', 'script'], tsOnly: true, re: /:\s*any\b(?![\w-])|\bas any\b|<any>/, msg: 'any type', fix: 'Type from the data contract' },
  { id: 'E05', sev: 'warn', kinds: ['markup', 'style'], skipTokenFiles: true, re: /!important/, msg: '!important', fix: 'Fix specificity or merge classes with cn()' },
  { id: 'E06', sev: 'warn', kinds: ['markup', 'script', 'style'], re: /\bz-\[\d{3,}\]|z-index:\s*\d{3,}/, msg: 'z-index ladder', fix: 'Token z-scale: sticky 10, dropdown 20, overlay 30, modal 40, toast 50' },
  { id: 'E07', sev: 'warn', kinds: ['markup'], re: /key=\{\s*(?:index|idx|i)\s*\}/, msg: 'Array index as key', fix: 'Stable ID from the data' },
  { id: 'E08', sev: 'error', kinds: ['markup', 'script', 'style'], re: /placeholder\.com|placehold\.(?:co|it)|picsum\.photos|source\.unsplash\.com|dummyimage\.com|placekitten\.com|loremflickr\.com|fakeimg\.pl|randomuser\.me/i, msg: 'Placeholder image service', fix: 'Local asset, generated SVG, or skeleton with aspect ratio' },
  { id: 'E09', sev: 'warn', kinds: ['markup'], re: /style=\{\{[^}]*\b(?:color|background(?:Color)?|margin\w*|padding\w*|fontSize|borderRadius)\s*:\s*['"\d]|style="[^"]*\b(?:color|background|margin|padding|font-size)\s*:/, msg: 'Inline style literal', fix: 'Token classes or CSS variables' },
  { id: 'E10', sev: 'warn', kinds: ['markup'], re: /\b(?:Math\.random|Date\.now)\s*\(\)/, msg: 'Non-deterministic value in a component file', fix: 'Seeded generator outside render (hydration-safe)' },
  { id: 'E14', sev: 'warn', kinds: ['markup'], re: /dangerouslySetInnerHTML/, msg: 'dangerouslySetInnerHTML', fix: 'Render as text or sanitise with a vetted library' },
]

// Tag rules: inspect whole JSX/HTML elements, including multi-line tags.
const TAG = (names) => new RegExp(`<(${names})\\b((?:=>|[^>])*)>`, 'g')
const PAIRED = (names) => new RegExp(`<(${names})\\b((?:=>|[^>])*)>([\\s\\S]*?)<\\/\\1>`, 'g')
const has = (attrs, name) => new RegExp(`\\b${name}\\s*=`).test(attrs)

const TAG_RULES = [
  { id: 'U01', sev: 'error', re: PAIRED('button|Button|IconButton'), check: (m) => {
      const [, , attrs, children] = m
      if (/\/\s*$/.test(attrs) || has(attrs, 'aria-label') || has(attrs, 'aria-labelledby') || has(attrs, 'title')) return false
      if (children.includes('{') || /sr-only|<button/i.test(children)) return false
      const text = children.replace(/<[^>]*>/g, '').trim()
      return text === '' && ICONISH.test(children)
    }, msg: 'Icon-only button without an accessible name', fix: 'aria-label="..." plus a Tooltip' },
  { id: 'U02', sev: 'error', re: TAG('div|span|li|td|tr|img|section|article'), check: (m) => /\bonClick\s*=/.test(m[2]) && !/role=["']button["']/.test(m[2]), msg: 'Clickable non-interactive element', fix: '<button> or <a href>; Radix Slot for polymorphism' },
  { id: 'U04', sev: 'warn', re: TAG('input|Input|textarea|Textarea'), check: (m) => has(m[2], 'placeholder') && !has(m[2], 'aria-label') && !has(m[2], 'aria-labelledby') && !has(m[2], 'id') && !/type=["']hidden["']/.test(m[2]), msg: 'Placeholder used as the only label', fix: 'Visible <Label htmlFor> above the input' },
  { id: 'U08', sev: 'error', re: TAG('img|Image'), check: (m) => !has(m[2], 'alt') && !/\{\.\.\.\w+\}/.test(m[2]), msg: 'Image without alt', fix: 'Meaningful alt, or alt="" if decorative' },
  { id: 'U09', sev: 'warn', re: TAG('video|audio'), check: (m) => /\bautoplay\b/i.test(m[2]) && !/\bmuted\b/.test(m[2]), msg: 'Autoplay without muted', fix: 'muted playsInline, user-controlled play' },
  { id: 'U12', sev: 'warn', re: TAG('a|Link'), check: (m) => /target=["']_blank["']/.test(m[2]) && !has(m[2], 'rel'), msg: 'target="_blank" without rel', fix: 'rel="noopener noreferrer" and an external-link cue' },
]

function lineIndex(src) {
  const starts = [0]
  for (let i = 0; i < src.length; i++) if (src[i] === '\n') starts.push(i + 1)
  return (pos) => {
    let lo = 0
    let hi = starts.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (starts[mid] <= pos) lo = mid
      else hi = mid - 1
    }
    return { line: lo + 1, col: pos - starts[lo] + 1 }
  }
}

function suppressed(lines, lineNo, id) {
  for (const l of [lines[lineNo - 1], lines[lineNo - 2]]) {
    const m = l && l.match(/taste-ignore(?!-file)\b([^\n]*)/)
    if (!m) continue
    const ids = m[1].match(/\b[VCUE]\d{2}\b/g)
    if (!ids || ids.includes(id)) return true
  }
  return false
}

/** Scan one source string. Returns findings [{id, sev, line, col, msg, fix, snippet}]. */
export function scanSource(src, file, config = {}) {
  const kind = kindOf(file)
  if (!kind || /taste-ignore-file/.test(src.slice(0, 500))) return []
  const lines = src.split(/\r?\n/)
  const at = lineIndex(src)
  const isToken = TOKEN_FILE.test(file)
  const isTs = /\.tsx?$/.test(file)
  const out = []
  const sevOf = (rule) => config.rules?.[rule.id] ?? rule.sev
  const push = (rule, line, col, snippet) => {
    const sev = sevOf(rule)
    if (sev === 'off' || suppressed(lines, line, rule.id)) return
    out.push({ id: rule.id, sev, line, col, msg: rule.msg, fix: rule.fix, snippet: snippet.trim().slice(0, 90) })
  }

  for (const rule of LINE_RULES) {
    if (!rule.kinds.includes(kind) || (rule.skipTokenFiles && isToken) || (rule.tsOnly && !isTs)) continue
    lines.forEach((text, i) => {
      const m = text.match(rule.re)
      if (m && (!rule.when || rule.when(text))) push(rule, i + 1, m.index + 1, m[0])
    })
  }

  if (kind === 'markup') {
    for (const rule of TAG_RULES) {
      for (const m of src.matchAll(rule.re)) {
        if (rule.check(m)) {
          const { line, col } = at(m.index)
          push(rule, line, col, m[0].split('\n')[0])
        }
      }
    }
  }

  if (kind === 'markup' || kind === 'script') {
    const radii = new Set((src.match(/\brounded(?:-(?:sm|md|lg|xl|2xl|3xl|\[[^\]]+\]))?(?![\w-])/g) ?? []))
    if (radii.size > 3) push({ id: 'V13', sev: 'info', msg: `${radii.size} radius values (${[...radii].join(', ')})`, fix: 'One radius family from tokens' }, 1, 1, '')
    const centered = (src.match(/\btext-center\b/g) ?? []).length
    if (centered > 6) push({ id: 'V14', sev: 'info', msg: `text-center used ${centered} times`, fix: 'Left-align reading content' }, 1, 1, '')
    const icons = new Set([...src.matchAll(ICON_LIBS)].map((m) => m[1].split('/')[0]))
    if (icons.size > 1) push({ id: 'E11', sev: 'warn', msg: `Multiple icon libraries: ${[...icons].join(', ')}`, fix: 'One icon library (Lucide default)' }, 1, 1, '')
    if (KITS.test(src) && SHADCN_IMPORT.test(src)) push({ id: 'E12', sev: 'error', msg: 'Mixed component kits in one file', fix: 'One kit per project' }, 1, 1, '')
  }
  if (lines.length > 400 && kind !== 'style') push({ id: 'E15', sev: 'info', msg: `${lines.length} lines`, fix: 'Split into organisms' }, 1, 1, '')

  return out.sort((a, b) => a.line - b.line || a.col - b.col)
}

function loadConfig(start) {
  let dir = resolve(start)
  for (;;) {
    const f = join(dir, '.tastemakerrc.json')
    if (existsSync(f)) {
      try { return JSON.parse(readFileSync(f, 'utf8')) } catch { return {} }
    }
    const up = dirname(dir)
    if (up === dir) return {}
    dir = up
  }
}

const globToRe = (g) => new RegExp(g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\u0000/g, '.*'))

function collect(target, config, out = []) {
  const st = statSync(target, { throwIfNoEntry: false })
  if (!st) return out
  if (st.isFile()) { out.push(target); return out }
  for (const name of readdirSync(target)) {
    if (SKIP_DIRS.has(name) || name.startsWith('.')) continue
    const p = join(target, name)
    const s = statSync(p, { throwIfNoEntry: false })
    if (!s) continue
    if (s.isDirectory()) {
      if (!config.includeVendored && VENDORED.test(p + '/')) continue
      collect(p, config, out)
    } else if (kindOf(p)) out.push(p)
  }
  return out
}

/** Project-level checks: E11 across files, E12 kits, E13 Tailwind major mismatch. */
export function scanProject(root, files) {
  const findings = []
  const pkgPath = join(root, 'package.json')
  if (!existsSync(pkgPath)) return findings
  let pkg = {}
  try { pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) } catch { return findings }
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  const tw = deps.tailwindcss && parseInt(String(deps.tailwindcss).replace(/^[^\d]*/, ''), 10)
  for (const f of files.filter((x) => kindOf(x) === 'style')) {
    const src = readFileSync(f, 'utf8')
    if (tw >= 4 && /@tailwind\s+(?:base|components|utilities)/.test(src)) findings.push({ file: f, id: 'E13', sev: 'error', line: 1, col: 1, msg: 'Tailwind v3 directives in a v4 project', fix: '@import "tailwindcss"; tokens in @theme', snippet: '' })
    if (tw === 3 && /@import\s+["']tailwindcss["']|@theme\b/.test(src)) findings.push({ file: f, id: 'E13', sev: 'error', line: 1, col: 1, msg: 'Tailwind v4 syntax in a v3 project', fix: '@tailwind base/components/utilities + tailwind.config', snippet: '' })
  }
  const kits = ['@mui/material', 'antd', '@chakra-ui/react', 'react-bootstrap', '@mantine/core', 'semantic-ui-react'].filter((k) => deps[k])
  if (existsSync(join(root, 'components.json')) && kits.length) findings.push({ file: pkgPath, id: 'E12', sev: 'error', line: 1, col: 1, msg: `shadcn/ui plus ${kits.join(', ')}`, fix: 'One component kit per project', snippet: '' })
  const icons = ['lucide-react', 'react-icons', '@heroicons/react', '@fortawesome/react-fontawesome', '@mui/icons-material', '@phosphor-icons/react', '@tabler/icons-react', '@radix-ui/react-icons'].filter((k) => deps[k])
  if (icons.length > 1) findings.push({ file: pkgPath, id: 'E11', sev: 'warn', line: 1, col: 1, msg: `Icon libraries installed: ${icons.join(', ')}`, fix: 'Keep one (Lucide default)', snippet: '' })
  return findings
}

export function score(findings, fileCount) {
  const perFileRule = new Map()
  for (const f of findings) {
    const k = `${f.file}|${f.id}|${f.sev}`
    perFileRule.set(k, Math.min(3, (perFileRule.get(k) ?? 0) + 1))
  }
  let penalty = 0
  for (const [k, n] of perFileRule) penalty += WEIGHT[k.split('|')[2]] * n
  const value = Math.max(0, Math.round(100 - penalty / Math.max(1, fileCount)))
  const letter = value >= 90 ? 'A' : value >= 75 ? 'B' : value >= 60 ? 'C' : value >= 40 ? 'D' : 'F'
  return { value, letter }
}

export function scanPaths(paths, { project = false, cwd = process.cwd() } = {}) {
  const config = loadConfig(paths[0] ?? cwd)
  const ignore = (config.ignore ?? []).map(globToRe)
  const files = [...new Set(paths.flatMap((p) => collect(resolve(cwd, p), config)))]
    .filter((f) => !ignore.some((re) => re.test(relative(cwd, f).split('\\').join('/'))))
  const findings = []
  for (const file of files) {
    let src
    try { src = readFileSync(file, 'utf8') } catch { continue }
    for (const f of scanSource(src, file, config)) findings.push({ file, ...f })
  }
  if (project) findings.push(...scanProject(resolve(cwd, paths[0] ?? '.'), files))
  const counts = { error: 0, warn: 0, info: 0 }
  for (const f of findings) counts[f.sev]++
  return { files: files.length, findings, counts, score: score(findings, files.length) }
}

function format(result, cwd, quiet) {
  const { files, findings, counts, score: s } = result
  const out = [`tastemaker scan · ${files} files · score ${s.value} (${s.letter}) · ${counts.error} errors · ${counts.warn} warnings · ${counts.info} info`]
  let current = ''
  for (const f of findings) {
    if (quiet && f.sev === 'info') continue
    const rel = relative(cwd, f.file) || f.file
    if (rel !== current) { out.push('', rel); current = rel }
    out.push(`  ${`${f.line}:${f.col}`.padEnd(8)} ${f.sev.padEnd(5)}  ${f.id}  ${f.msg}${f.snippet ? `  "${f.snippet}"` : ''}`)
    out.push(`  ${''.padEnd(8)} ${''.padEnd(5)}  fix: ${f.fix}`)
  }
  if (!findings.length) out.push('No slop found.')
  return out.join('\n')
}

async function hook() {
  const mode = (process.env.TASTEMAKER_HOOK ?? 'block').toLowerCase()
  if (mode === 'off') return 0
  let input = ''
  for await (const chunk of process.stdin) input += chunk
  let data
  try { data = JSON.parse(input) } catch { return 0 }
  const raw = data?.tool_input?.file_path
  if (!raw || !kindOf(raw)) return 0
  const file = resolve(data.cwd ?? process.cwd(), raw)
  if (!existsSync(file)) return 0
  const config = loadConfig(dirname(file))
  if (!config.includeVendored && VENDORED.test(file)) return 0
  const findings = scanSource(readFileSync(file, 'utf8'), file, config).filter((f) => f.sev === 'error')
  if (!findings.length) return 0
  const lines = findings.slice(0, 12).map((f) => `${f.line}:${f.col} ${f.id} ${f.msg}${f.snippet ? ` "${f.snippet}"` : ''} -> ${f.fix}`)
  const more = findings.length > 12 ? `\n...and ${findings.length - 12} more` : ''
  process.stderr.write(`Tastemaker guard: ${findings.length} slop error(s) in ${file}\n${lines.join('\n')}${more}\nFix these (see taste-guard), or add "taste-ignore <ID> <reason>" if intentional.\n`)
  return mode === 'warn' ? 1 : 2
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const argv = process.argv.slice(2)
  if (argv.includes('--hook')) {
    process.exit(await hook())
  }
  const failIdx = argv.indexOf('--fail-on')
  const failOn = failIdx >= 0 ? argv[failIdx + 1] : 'error'
  const paths = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--fail-on')
  const result = scanPaths(paths.length ? paths : ['.'], { project: argv.includes('--project') })
  if (argv.includes('--json')) console.log(JSON.stringify(result, null, 2))
  else console.log(format(result, process.cwd(), argv.includes('--quiet')))
  const threshold = SEVERITIES.includes(failOn) ? SEVERITIES.indexOf(failOn) : 2
  const failed = result.findings.some((f) => SEVERITIES.indexOf(f.sev) >= threshold)
  process.exit(failed ? 1 : 0)
}
