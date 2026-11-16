import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--headless=new'] })
const p = await b.newPage()
await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 })
await p.goto('http://localhost:5175/work/', { waitUntil: 'networkidle0' })
await new Promise(r=>setTimeout(r,1500))
const c = await p.evaluate(() => { const r = document.querySelector('.wp__head').getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height} })
await p.screenshot({ path: '.shots/work-head.png', clip: {x:0, y:c.y, width:390, height:Math.min(c.height, 700)} })
await b.close()
