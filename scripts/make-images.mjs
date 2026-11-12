import puppeteer from 'puppeteer-core'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const jobs = [
  ['src/assets/profile-pic.png', 'public/images/deep-dey-portrait.webp'],
  ['src/assets/side.png', 'public/images/deep-dey-side-profile.webp'],
  ['src/assets/hero.png', 'public/images/deep-dey-tech-stack.webp'],
]

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--headless=new'] })
const page = await browser.newPage()
mkdirSync(resolve(root, 'public/images'), { recursive: true })

for (const [src, out] of jobs) {
  const b64 = readFileSync(resolve(root, src)).toString('base64')
  const res = await page.evaluate(async (dataUrl) => {
    const img = new Image()
    await new Promise((r, j) => { img.onload = r; img.onerror = j; img.src = dataUrl })
    const scale = Math.min(1, 1400 / Math.max(img.naturalWidth, img.naturalHeight))
    const w = Math.round(img.naturalWidth * scale)
    const h = Math.round(img.naturalHeight * scale)
    const c = document.createElement('canvas')
    c.width = w; c.height = h
    c.getContext('2d').drawImage(img, 0, 0, w, h)
    const webp = await new Promise((r) => c.toBlob(r, 'image/webp', 0.82))
    const buf = await webp.arrayBuffer()
    return { w, h, srcW: img.naturalWidth, srcH: img.naturalHeight, b64: btoa(new Uint8Array(buf).reduce((s, b) => s + String.fromCharCode(b), '')) }
  }, `data:image/png;base64,${b64}`)
  writeFileSync(resolve(root, out), Buffer.from(res.b64, 'base64'))
  const size = readFileSync(resolve(root, out)).length
  console.log(`${src} (${res.srcW}x${res.srcH}) -> ${out} ${res.w}x${res.h} ${Math.round(size / 1024)}kB`)
}
await browser.close()
