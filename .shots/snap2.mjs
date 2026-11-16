import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--headless=new'] })
const p = await b.newPage()
await p.setViewport({ width: 1280, height: 800 })
await p.goto('https://spectaclehub.shop/', { waitUntil: 'domcontentloaded', timeout: 45000 })
await new Promise(r=>setTimeout(r,12000))
await p.screenshot({ path: 'public/projects/spectaclehub.jpg', type: 'jpeg', quality: 82 })
await b.close()
