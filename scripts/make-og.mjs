import puppeteer from 'puppeteer-core'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const portrait = readFileSync(resolve(root, 'public/images/deep-dey-portrait.webp')).toString('base64')

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--headless=new'] })
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })

await page.setContent(`<!doctype html><html><head>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:ital,opsz,wdth,wght@0,8..144,50..150,100..900&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box }
  body { width: 1200px; height: 630px; background: #cdc6be; display: flex; gap: 32px; padding: 48px; font-family: Newsreader, Georgia, serif; color: #1d1d1b }
  .left { flex: 0 0 62%; display: flex; flex-direction: column; justify-content: center; gap: 22px }
  .box { background: #1d1d1b; container-type: inline-size; text-align: center; padding: 8px 0 14px }
  .box span { font-family: "Roboto Serif", serif; font-weight: 800; font-stretch: 50%; font-variation-settings: "wdth" 50, "opsz" 144; color: #cdc6be; text-transform: uppercase; white-space: nowrap; font-size: 20cqw; line-height: 0.9 }
  .role { font-family: "Roboto Serif", serif; font-weight: 700; font-stretch: 50%; font-variation-settings: "wdth" 50, "opsz" 144; text-transform: uppercase; font-size: 38px; line-height: 1; white-space: nowrap }
  .sub { font-size: 28px }
  .right { flex: 1; border: 1px solid #1d1d1b; padding: 6px }
  .right img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 18%; filter: sepia(0.25) contrast(0.95); display: block }
</style></head><body>
<div class="left">
  <div class="box"><span>DEEP DEY</span></div>
  <div class="role">FULL STACK DEVELOPER &middot; LLM ENGINEER</div>
  <div class="sub">Kolkata, India &nbsp;&middot;&nbsp; deepdey.dev</div>
</div>
<div class="right"><img src="data:image/webp;base64,${portrait}" alt=""></div>
</body></html>`, { waitUntil: 'networkidle0' })

await page.evaluate(async () => {
  await document.fonts.ready
  const span = document.querySelector('.box span')
  const box = document.querySelector('.box')
  const prev = span.style.cssText
  span.style.cssText += ';display:inline-block;width:max-content;font-size:100px'
  const w = span.offsetWidth
  span.style.cssText = prev
  span.style.fontSize = (100 * (box.clientWidth - 24) / w).toFixed(2) + 'px'
})
await new Promise(r => setTimeout(r, 300))
const el = await page.$('body')
const buf = await el.screenshot({ type: 'jpeg', quality: 86 })
writeFileSync(resolve(root, 'public/og-image.jpg'), buf)
console.log('og-image.jpg', Math.round(buf.length / 1024) + 'kB')
await browser.close()
