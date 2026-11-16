import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--headless=new'] })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 800 })
await p.goto('http://localhost:5175/work/', { waitUntil: 'networkidle0' })
await new Promise(r=>setTimeout(r,1800))
await p.evaluate(() => document.querySelectorAll('.wp__spine')[1].click())
await new Promise(r=>setTimeout(r,1600))
console.log(await p.evaluate(() => {
  const path = (el) => el ? el.tagName + '.' + el.className : 'none'
  const strip = [document.elementFromPoint(950, 215), document.elementFromPoint(950, 240)]
  const ph = document.querySelector('.wp__item.is-open .wp__photo').getBoundingClientRect()
  const img = document.querySelector('.wp__item.is-open .wp__photo img').getBoundingClientRect()
  return JSON.stringify({ strip: strip.map(path), photoY: [ph.y, ph.y + ph.height], imgR: [img.x, img.y, img.width, img.height] })
}))
await b.close()
