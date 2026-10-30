// taste-ignore-file
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { scanSource, scanPaths } from '../skills/taste-guard/scripts/slop-scan.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const ids = (src, file = 'x.tsx') => scanSource(src, file).map((f) => f.id)

test('sloppy fixture triggers the core catalog', () => {
  const r = scanPaths([join(here, 'fixtures/sloppy')])
  const found = new Set(r.findings.map((f) => f.id))
  for (const id of ['V01', 'V02', 'V03', 'V04', 'V07', 'V08', 'V09', 'V10', 'V12', 'C01', 'C02', 'C03', 'C04', 'C05', 'U01', 'U02', 'U03', 'U04', 'U06', 'U08', 'U12', 'E01', 'E02', 'E07', 'E08', 'E11']) {
    assert.ok(found.has(id), `expected ${id}`)
  }
  assert.ok(r.counts.error >= 10)
  assert.equal(r.score.letter, 'F')
})

test('clean fixture is clean', () => {
  const r = scanPaths([join(here, 'fixtures/clean')])
  assert.deepEqual(r.findings, [])
  assert.equal(r.score.value, 100)
})

test('focus ring replacement satisfies U03', () => {
  assert.ok(!ids('<button className="focus-visible:outline-none focus-visible:ring-2">Save draft</button>').includes('U03'))
  assert.ok(ids('<button className="outline-none">Save draft</button>').includes('U03'))
})

test('icon button with aria-label passes U01', () => {
  assert.ok(!ids('<Button size="icon" aria-label="Close"><X /></Button>').includes('U01'))
  assert.ok(ids('<Button size="icon"><X /></Button>').includes('U01'))
})

test('type="submit" is not a generic CTA, "Submit" text is', () => {
  assert.ok(!ids('<button type="submit">Create invoice</button>').includes('C04'))
  assert.ok(ids('<button type="submit">Submit</button>').includes('C04'))
})

test('raw hex allowed in token files only', () => {
  assert.ok(scanSource(':root { --brand: #0F4C81; }\n.x { color: #0F4C81; }', 'src/styles/tokens.css').every((f) => f.id !== 'V08'))
  assert.ok(scanSource('.card { color: #0F4C81; }', 'src/card.css').some((f) => f.id === 'V08'))
})

test('inline suppression with reason', () => {
  const src = '// taste-ignore V01 approved brand gradient\n<div className="bg-gradient-to-r from-violet-600 to-blue-600" />'
  assert.ok(!ids(src).includes('V01'))
})

test('config can switch rules off', () => {
  const f = scanSource('<p className="text-slate-500">Due today</p>', 'a.tsx', { rules: { V12: 'off' } })
  assert.deepEqual(f, [])
})

test('copyright symbol and arrows are not emoji', () => {
  assert.ok(!ids('<footer>© 2026 Northwind ↗</footer>').includes('V07'))
  assert.ok(ids('<span>Ship it \u{1F680}</span>').includes('V07'))
})

test('camelCase identifiers do not trip hype copy', () => {
  assert.ok(!ids('const unlockAccount = () => api.post("/unlock")').includes('C01'))
})
