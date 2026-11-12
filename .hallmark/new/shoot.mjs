import puppeteer from 'puppeteer-core'
import { join } from 'node:path'

const OUT = 'D:/DEEP/portfolio/.hallmark/new'
const URL = 'http://localhost:5173/'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const p = await browser.newPage()
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await p.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
await p.evaluate(async () => { await document.fonts.ready })
await new Promise(r => setTimeout(r, 1200))

const h = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight)
const steps = 10
for (let i = 0; i <= steps; i++) {
  const y = Math.round((h / steps) * i)
  await p.evaluate((v) => window.scrollTo(0, v), y)
  await new Promise(r => setTimeout(r, 900))
  await p.screenshot({ path: join(OUT, `n${i}.png`) })
}

// menu overlay
await p.evaluate(() => window.scrollTo(0, 0))
await p.click('.burger')
await new Promise(r => setTimeout(r, 600))
await p.screenshot({ path: join(OUT, 'menu-open.png') })
const menu = await p.evaluate(() => {
  const m = document.querySelector('.menu')
  const before = document.activeElement?.textContent
  return { open: m.classList.contains('open'), expanded: document.querySelector('.burger').getAttribute('aria-expanded'), focused: before }
})
await p.keyboard.press('Escape')
await new Promise(r => setTimeout(r, 500))
const menu2 = await p.evaluate(() => ({ open: document.querySelector('.menu').classList.contains('open'), focused: document.activeElement?.className }))
console.log('MENU:', JSON.stringify({ ...menu, afterEsc: menu2 }))

// rail drag
const drag = await p.evaluate(async () => {
  const rail = document.querySelector('.rail')
  const before = rail.scrollLeft
  rail.dispatchEvent(new PointerEvent('pointerdown', { clientX: 700, bubbles: true }))
  for (let x = 700; x > 200; x -= 50) rail.dispatchEvent(new PointerEvent('pointermove', { clientX: x, bubbles: true }))
  rail.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
  await new Promise(r => setTimeout(r, 300))
  return { before, after: rail.scrollLeft }
})
await p.screenshot({ path: join(OUT, 'rail-dragged.png') })
console.log('DRAG:', JSON.stringify(drag))

// 375 full page
const m = await browser.newPage()
await m.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 })
await m.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
await m.evaluate(async () => { await document.fonts.ready; for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 80)) } scrollTo(0, 0) })
await new Promise(r => setTimeout(r, 1200))
await m.screenshot({ path: join(OUT, 'm375-full.png'), fullPage: true })

await browser.close()
console.log('done')
