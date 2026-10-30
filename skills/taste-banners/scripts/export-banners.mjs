#!/usr/bin/env node
// Exports banner HTML artboards to PNG at exact size and 2x scale.
// Usage: node export-banners.mjs <folder> [--scale 2]
// Each HTML file needs one element with class "banner" and explicit width/height.
import { readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const argv = process.argv.slice(2)
const dir = resolve(argv.find((a) => !a.startsWith('--')) ?? 'banners')
const scaleIdx = argv.indexOf('--scale')
const scale = scaleIdx >= 0 ? Number(argv[scaleIdx + 1]) : 2

let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  console.error('tastemaker banners: Playwright not found. Run: npm i -D playwright && npx playwright install chromium')
  process.exit(2)
}

const files = readdirSync(dir).filter((f) => f.endsWith('.html') && f !== 'index.html')
if (!files.length) {
  console.error(`tastemaker banners: no banner HTML files in ${dir}`)
  process.exit(1)
}

const browser = await chromium.launch()
try {
  for (const file of files) {
    const page = await browser.newPage({ deviceScaleFactor: scale, viewport: { width: 4000, height: 4000 } })
    await page.goto(pathToFileURL(join(dir, file)).href, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const banner = await page.$('.banner')
    if (!banner) {
      console.warn(`skip  ${file}: no .banner element`)
      await page.close()
      continue
    }
    const out = join(dir, file.replace(/\.html$/, '.png'))
    await banner.screenshot({ path: out, animations: 'disabled' })
    const box = await banner.boundingBox()
    console.log(`ok    ${file} -> ${out} (${box.width}x${box.height} @${scale}x)`)
    await page.close()
  }
} finally {
  await browser.close()
}
