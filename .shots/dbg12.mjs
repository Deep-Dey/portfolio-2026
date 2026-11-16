import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--headless=new'] })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 800 })
await p.goto('http://localhost:5175/work/', { waitUntil: 'networkidle0' })
await new Promise(r=>setTimeout(r,1800))
await p.evaluate(() => document.querySelectorAll('.wp__spine')[1].click())
await new Promise(r=>setTimeout(r,1600))
console.log(await p.evaluate(() => {
  const pin = document.querySelector('.wp__item.is-open .wp__panel-in')
  return JSON.stringify([...pin.children].map(c => {
    const r = c.getBoundingClientRect()
    return `${c.className} y:${Math.round(r.y)}-${Math.round(r.bottom)} h:${Math.round(r.height)}`
  }))
}))
await b.close()
