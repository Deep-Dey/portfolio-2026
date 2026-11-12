import puppeteer from 'puppeteer-core'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--headless=new'] })
const page = await browser.newPage()

const html = `<!doctype html><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:ital,opsz,wdth,wght@0,8..144,50..150,100..900&display=swap" rel="stylesheet">
<canvas id="c"></canvas>
<script>
window.draw = async (size) => {
  await document.fonts.ready
  const c = document.getElementById('c'); c.width = c.height = size
  const x = c.getContext('2d')
  const bar = Math.max(1, Math.round(size * 0.08))
  x.fillStyle = '#1d1d1b'; x.fillRect(0, 0, size, size)
  x.fillStyle = '#cdc6be'
  x.textAlign = 'center'; x.textBaseline = 'middle'
  const fs = size * 0.75
  x.font = '800 ' + fs + 'px "Roboto Serif"'
  try { x.fontVariationSettings = '"wdth" 50, "opsz" 144' } catch (e) {}
  x.fillText('D', size / 2, size / 2 - bar / 2 + size * 0.02)
  x.fillStyle = '#c03f13'; x.fillRect(0, size - bar, size, bar)
  return c.toDataURL('image/png')
}
</script>`
await page.setContent(html, { waitUntil: 'networkidle0' })
await page.evaluate(() => document.fonts.ready)

const shot = async (size) => {
  const dataUrl = await page.evaluate((s) => window.draw(s), size)
  return Buffer.from(dataUrl.split(',')[1], 'base64')
}

const sizes = { 16: null, 32: null, 48: null, 180: 'apple-touch-icon.png', 192: 'icon-192.png', 512: 'icon-512.png' }
const pngs = {}
for (const s of [16, 32, 48, 180, 192, 512]) pngs[s] = await shot(s)
writeFileSync(resolve(root, 'public/apple-touch-icon.png'), pngs[180])
writeFileSync(resolve(root, 'public/icon-192.png'), pngs[192])
writeFileSync(resolve(root, 'public/icon-512.png'), pngs[512])
writeFileSync(resolve(root, 'public/favicon-32.png'), pngs[32])

// ICO container: ICONDIR + ICONDIRENTRY per image (PNG payloads)
const icoSizes = [16, 32, 48]
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(icoSizes.length, 4)
const entries = Buffer.alloc(16 * icoSizes.length)
let offset = 6 + 16 * icoSizes.length
icoSizes.forEach((s, i) => {
  const p = pngs[s]
  entries[i * 16] = s === 256 ? 0 : s
  entries[i * 16 + 1] = s === 256 ? 0 : s
  entries[i * 16 + 2] = 0
  entries[i * 16 + 3] = 0
  entries.writeUInt16LE(1, i * 16 + 4)
  entries.writeUInt16LE(32, i * 16 + 6)
  entries.writeUInt32LE(p.length, i * 16 + 8)
  entries.writeUInt32LE(offset, i * 16 + 12)
  offset += p.length
})
writeFileSync(resolve(root, 'public/favicon.ico'), Buffer.concat([header, entries, ...icoSizes.map((s) => pngs[s])]))
// Brand logo for CDN use: https://deepdey.dev/assets/logo/deep-dey-logo[-<size>].png
const logoDir = resolve(root, 'public/assets/logo')
mkdirSync(logoDir, { recursive: true })
for (const s of [64, 256, 512, 1024, 2048]) writeFileSync(resolve(logoDir, `deep-dey-logo-${s}.png`), await shot(s))
writeFileSync(resolve(logoDir, 'deep-dey-logo.png'), await shot(1024))
console.log('icons written:', Object.keys(pngs).join(','), '+ logo 64,256,512,1024,2048')
await browser.close()
