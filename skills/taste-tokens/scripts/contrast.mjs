#!/usr/bin/env node
// WCAG 2.x contrast ratio for hex, rgb(), hsl() and oklch() colors. Zero dependencies.
// Usage: node contrast.mjs <fg> <bg> [--large]      e.g. node contrast.mjs "#fff" "#0F4C81"
import { pathToFileURL } from 'node:url'

const srgbEncode = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)
const srgbDecode = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const clamp01 = (n) => Math.min(1, Math.max(0, n))

function hslToRgb(h, s, l) {
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
  return [f(0), f(8), f(4)]
}

function oklchToRgb(L, C, H) {
  const hr = (H * Math.PI) / 180
  const a = C * Math.cos(hr)
  const b = C * Math.sin(hr)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((c) => srgbEncode(clamp01(c)))
}

/** Parse a CSS color into sRGB channels 0..1, or null if unsupported. */
export function parseColor(input) {
  const s = String(input).trim().toLowerCase()
  if (s === 'white') return [1, 1, 1]
  if (s === 'black') return [0, 0, 0]
  let m
  if ((m = s.match(/^#([0-9a-f]{3,8})$/))) {
    let h = m[1]
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('')
    if (h.length !== 6 && h.length !== 8) return null
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
  }
  if ((m = s.match(/^rgba?\(([^)]+)\)$/))) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean).slice(0, 3)
    return p.map((v) => (v.endsWith('%') ? parseFloat(v) / 100 : parseFloat(v) / 255))
  }
  if ((m = s.match(/^hsla?\(([^)]+)\)$/))) {
    const [h, sat, l] = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat)
    return hslToRgb(h, sat / 100, l / 100)
  }
  if ((m = s.match(/^oklch\(([^)]+)\)$/))) {
    const p = m[1].split(/[\s/]+/).filter(Boolean)
    const L = p[0].endsWith('%') ? parseFloat(p[0]) / 100 : parseFloat(p[0])
    return oklchToRgb(L, parseFloat(p[1]), parseFloat(p[2]) || 0)
  }
  return null
}

export function luminance(rgb) {
  const [r, g, b] = rgb.map(srgbDecode)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(fg, bg) {
  const a = typeof fg === 'string' ? parseColor(fg) : fg
  const b = typeof bg === 'string' ? parseColor(bg) : bg
  if (!a || !b) return NaN
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** "H S% L%" channel string for Tailwind v3 / shadcn HSL variables. */
export function toHslChannels(color) {
  const rgb = typeof color === 'string' ? parseColor(color) : color
  const [r, g, b] = rgb
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
    h *= 60
  }
  const r1 = (n) => Math.round(n * 10) / 10
  return `${r1(h)} ${r1(s * 100)}% ${r1(l * 100)}%`
}

export function grade(ratio) {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA-large'
  return 'FAIL'
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2)
  const large = args.includes('--large')
  const [fg, bg] = args.filter((a) => !a.startsWith('--'))
  if (!fg || !bg) {
    console.error('Usage: node contrast.mjs <foreground> <background> [--large]')
    process.exit(2)
  }
  const ratio = contrastRatio(fg, bg)
  if (Number.isNaN(ratio)) {
    console.error(`Unsupported color: ${fg} or ${bg}`)
    process.exit(2)
  }
  const min = large ? 3 : 4.5
  console.log(`${fg} on ${bg} = ${ratio.toFixed(2)}:1  ${grade(ratio)}  (needs ${min}:1)`)
  process.exit(ratio >= min ? 0 : 1)
}
