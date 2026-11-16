import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--headless=new'] })
const p = await b.newPage()
await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
await p.goto('http://localhost:5175/work/', { waitUntil: 'networkidle2' })
await new Promise(r=>setTimeout(r,1500))
await p.screenshot({ path: '.shots/mob-head.png' })
await b.close()
