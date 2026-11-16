import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.env.BASE || 'http://localhost:5175'
const out = (n) => resolve(root, '.shots', n)

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--headless=new'] })
const page = await browser.newPage()
const logs = []
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`))
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`))

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// 1. /work/ desktop
await page.setViewport({ width: 1440, height: 800, deviceScaleFactor: 1 })
await page.goto(`${BASE}/work/`, { waitUntil: 'networkidle0' })
await wait(1600)
writeFileSync(out('work-desktop.png'), await page.screenshot())

// 2. second spine open
await page.evaluate(() => document.querySelectorAll('.wp__spine')[1].click())
await wait(1000)
writeFileSync(out('work-open.png'), await page.screenshot())
await page.evaluate(() => document.querySelectorAll('.wp__spine')[1].click())
await wait(900)

// 3. menu mid-open (horizontal tear)
await page.click('.burger')
await wait(800)
writeFileSync(out('work-menu-mid.png'), await page.screenshot())
await wait(1400)
await page.keyboard.press('Escape')
await wait(1200)

// 4. mobile /work/
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
await page.goto(`${BASE}/work/`, { waitUntil: 'networkidle0' })
await wait(1600)
writeFileSync(out('work-mobile.png'), await page.screenshot())

// 5. home desktop
await page.setViewport({ width: 1440, height: 800, deviceScaleFactor: 1 })
await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' })
await wait(1500)
writeFileSync(out('home-desktop.png'), await page.screenshot())

// 6. home menu mid-open (vertical)
await page.click('.burger')
await wait(800)
writeFileSync(out('home-menu-mid.png'), await page.screenshot())

await browser.close()
writeFileSync(out('console.log'), logs.join('\n') || '(no console output)')
console.log('done\n' + logs.filter((l) => /warn|error/i.test(l)).join('\n'))
