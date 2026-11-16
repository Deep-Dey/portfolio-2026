import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--headless=new'] })
const p = await b.newPage()
await p.setViewport({ width: 390, height: 844 })
await p.goto('http://localhost:5175/work/', { waitUntil: 'networkidle0' })
await p.evaluate(() => document.fonts.ready)
await new Promise(r=>setTimeout(r,1200))
await p.screenshot({ path: '.shots/work-mobile.png' })
await b.close()
