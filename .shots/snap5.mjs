import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--headless=new'] })
const p = await b.newPage()
await p.setViewport({ width: 1280, height: 800 })
await p.goto('https://websoftiot.com', { waitUntil: 'domcontentloaded', timeout: 45000 })
await new Promise(r=>setTimeout(r,8000))
await p.screenshot({ path: '.shots/websoft.png' })
await b.close()
